import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '@/lib/firebase';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup() {
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (6+ characters)"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.xl },
  title: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: 'bold', textAlign: 'center', marginBottom: Spacing.xl },
  error: { color: Colors.primary, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surface, color: Colors.text, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md, fontSize: FontSize.md },
  button: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 8, alignItems: 'center', marginBottom: Spacing.md },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: FontSize.md },
  link: { color: Colors.accent, textAlign: 'center', marginTop: Spacing.sm },
});
