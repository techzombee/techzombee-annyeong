import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface Props {
  open: boolean;
  phrase: string;
  explanation: string;
  loading: boolean;
  onClose: () => void;
}

export default function NuanceSheet({ open, phrase, explanation, loading, onClose }: Props) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.phrase}>{phrase}</Text>
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.md }} />
        ) : (
          <Text style={styles.explanation}>{explanation}</Text>
        )}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    minHeight: 280,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  phrase: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: 'bold', marginBottom: Spacing.md },
  explanation: { color: Colors.text, fontSize: FontSize.md, lineHeight: 24 },
  closeBtn: { marginTop: Spacing.lg, alignItems: 'center' },
  closeBtnText: { color: Colors.textMuted, fontSize: FontSize.sm },
});
