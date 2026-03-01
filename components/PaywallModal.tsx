import { Platform, View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PaywallModal({ open, onClose }: Props) {
  async function handleSubscribe() {
    if (Platform.OS === 'web') {
      alert('Subscriptions are available on the iOS and Android app.');
      onClose();
      return;
    }
    try {
      const Purchases = (await import('react-native-purchases')).default;
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.monthly;
      if (pkg) await Purchases.purchasePackage(pkg);
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>UNLOCK FULL ACCESS</Text>
          <Text style={styles.title}>Annyeong Pro</Text>
          <Text style={styles.description}>
            Tap any Korean phrase to instantly get AI-powered explanations of nuance, tone, and cultural context.
          </Text>

          <View style={styles.featureList}>
            {[
              '✦  Unlimited AI nuance explanations',
              '✦  Full transcript access',
              '✦  All video categories',
            ].map((f) => (
              <Text key={f} style={styles.feature}>{f}</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
            <Text style={styles.buttonText}>Start for $4.99 / month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.yearlyButton} onPress={handleSubscribe}>
            <Text style={styles.yearlyText}>$39.99 / year  <Text style={styles.yearlyBadge}>Save 33%</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: Spacing.xl },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: Spacing.xl },
  eyebrow: { color: Colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textAlign: 'center', marginBottom: Spacing.xs },
  title: { color: '#111', fontSize: FontSize.xxl, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.md },
  description: { color: '#555', fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg },
  featureList: { marginBottom: Spacing.xl },
  feature: { color: '#333', fontSize: FontSize.sm, marginBottom: Spacing.xs, lineHeight: 22 },
  button: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, alignItems: 'center', marginBottom: Spacing.sm },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  yearlyButton: { backgroundColor: '#f5f5f5', padding: Spacing.md, borderRadius: 12, alignItems: 'center', marginBottom: Spacing.lg },
  yearlyText: { color: '#333', fontWeight: '600', fontSize: FontSize.sm },
  yearlyBadge: { color: Colors.primary, fontWeight: '700' },
  cancel: { color: '#aaa', textAlign: 'center', fontSize: FontSize.sm },
});
