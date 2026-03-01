import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '@/lib/firebase';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Annyeong</Text>
      <Text style={styles.subtitle}>Learn Korean naturally</Text>

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
        placeholder="Password"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.xl },
  title: { color: Colors.primary, fontSize: FontSize.xxl, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: Colors.textMuted, fontSize: FontSize.md, textAlign: 'center', marginBottom: Spacing.xl },
  error: { color: Colors.primary, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surface, color: Colors.text, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md, fontSize: FontSize.md },
  button: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 8, alignItems: 'center', marginBottom: Spacing.md },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: FontSize.md },
  link: { color: Colors.accent, textAlign: 'center', marginTop: Spacing.sm },
});
