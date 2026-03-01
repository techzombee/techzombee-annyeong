import { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { fetchTranscript, TranscriptLine } from '@/lib/youtube';
import { fetchNuance } from '@/lib/claude';
import NuanceSheet from '@/components/NuanceSheet';
import PaywallModal from '@/components/PaywallModal';
import { Colors, FontSize, Spacing } from '@/constants/theme';

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { isPremium } = useSubscription();

  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [nuance, setNuance] = useState('');
  const [nuanceLoading, setNuanceLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => fetchTranscript(id, token))
      .then(setTranscript)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  async function handlePhraseTap(line: TranscriptLine) {
    if (!isPremium) {
      setPaywallOpen(true);
      return;
    }
    setSelectedPhrase(line.text);
    setSheetOpen(true);
    setNuanceLoading(true);
    try {
      const token = await user!.getIdToken();
      const surrounding = transcript
        .slice(Math.max(0, transcript.indexOf(line) - 2), transcript.indexOf(line) + 3)
        .map((l) => l.text)
        .join(' ');
      const res = await fetchNuance({ phrase: line.text, context: surrounding }, token);
      setNuance(res.explanation);
    } catch (e) {
      setNuance('Failed to load explanation. Please try again.');
    } finally {
      setNuanceLoading(false);
    }
  }

  const activeLine = transcript.findIndex(
    (l) => currentTime >= l.start && currentTime < l.start + l.duration
  );

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={220}
        videoId={id}
        onChangeState={() => {}}
        onProgress={({ currentTime: t }) => setCurrentTime(t)}
      />

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={transcript}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handlePhraseTap(item)}>
              <Text style={[styles.line, index === activeLine && styles.activeLine]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: Spacing.md }}
        />
      )}

      <NuanceSheet
        open={sheetOpen}
        phrase={selectedPhrase}
        explanation={nuance}
        loading={nuanceLoading}
        onClose={() => setSheetOpen(false)}
      />

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  line: { color: Colors.text, fontSize: FontSize.md, paddingVertical: Spacing.xs, lineHeight: 24 },
  activeLine: { color: Colors.primary, fontWeight: 'bold' },
});
