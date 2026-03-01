import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Purchases from 'react-native-purchases';
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PaywallModal({ open, onClose }: Props) {
  async function handleSubscribe() {
    try {
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
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.description}>
            Unlock AI-powered nuance explanations for every Korean phrase you encounter.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
            <Text style={styles.buttonText}>Subscribe — $4.99/month</Text>
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.xl },
  title: { color: Colors.text, fontSize: FontSize.xl, fontWeight: 'bold', textAlign: 'center', marginBottom: Spacing.md },
  description: { color: Colors.textMuted, fontSize: FontSize.md, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
  button: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 8, alignItems: 'center', marginBottom: Spacing.md },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: FontSize.md },
  cancel: { color: Colors.textMuted, textAlign: 'center', fontSize: FontSize.sm },
});
