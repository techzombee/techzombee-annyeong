import { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform, useWindowDimensions,
} from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import NuanceSheet from '@/components/NuanceSheet';
import PaywallModal from '@/components/PaywallModal';

interface TranscriptLine {
  text: string;
  start: number;
  duration: number;
}

// Mock Korean transcript — replace with real Cloud Function data once deployed
const MOCK_TRANSCRIPT: TranscriptLine[] = [
  { text: '안녕하세요, 오늘은 한국어를 배워봐요!', start: 0, duration: 4 },
  { text: '제 이름은 민준이에요.', start: 4, duration: 3 },
  { text: '한국어는 어렵지만 재미있어요.', start: 7, duration: 4 },
  { text: '오늘은 인사말부터 시작할게요.', start: 11, duration: 4 },
  { text: '처음 뵙겠습니다, 잘 부탁드립니다.', start: 15, duration: 4 },
  { text: '이 표현은 처음 만날 때 많이 써요.', start: 19, duration: 4 },
  { text: '친구한테는 "안녕"이라고 해요.', start: 23, duration: 4 },
  { text: '어른한테는 "안녕하세요"라고 해야 해요.', start: 27, duration: 4 },
  { text: '한국어는 존댓말이 매우 중요해요.', start: 31, duration: 4 },
  { text: '상대방에 따라 말이 달라져요.', start: 35, duration: 4 },
  { text: '오늘 배운 것 기억하세요!', start: 39, duration: 4 },
  { text: '다음 시간에 또 만나요. 안녕히 계세요!', start: 43, duration: 5 },
];

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const playerRef = useRef<YoutubeIframeRef>(null);

  const [transcript] = useState<TranscriptLine[]>(MOCK_TRANSCRIPT);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const { width } = useWindowDimensions();
  const playerHeight = Math.round(width * (9 / 16));

  const [selectedLine, setSelectedLine] = useState<TranscriptLine | null>(null);
  const [nuance, setNuance] = useState('');
  const [nuanceLoading, setNuanceLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Poll current time every 500ms on mobile
  useEffect(() => {
    if (!playing || Platform.OS === 'web') return;
    const interval = setInterval(async () => {
      const time = await playerRef.current?.getCurrentTime();
      if (time != null) setCurrentTime(time);
    }, 500);
    return () => clearInterval(interval);
  }, [playing]);

  const activeLine = transcript.findIndex(
    (l) => currentTime >= l.start && currentTime < l.start + l.duration
  );

  async function handlePhraseTap(line: TranscriptLine) {
    if (!isPremium) {
      setPaywallOpen(true);
      return;
    }
    setSelectedLine(line);
    setNuance('');
    setSheetOpen(true);
    setNuanceLoading(true);
    try {
      const token = await user!.getIdToken();
      const idx = transcript.indexOf(line);
      const context = transcript
        .slice(Math.max(0, idx - 2), idx + 3)
        .map((l) => l.text)
        .join(' ');
      const { fetchNuance } = await import('@/lib/claude');
      const res = await fetchNuance({ phrase: line.text, context }, token);
      setNuance(res.explanation);
    } catch {
      setNuance('Explanation unavailable — AI function not yet deployed.');
    } finally {
      setNuanceLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <YoutubePlayer
        ref={playerRef}
        width={width}
        height={playerHeight}
        videoId={id}
        play={playing}
        onChangeState={(state) => setPlaying(state === 'playing')}
      />

      <FlatList
        data={transcript}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const isActive = index === activeLine;
          return (
            <TouchableOpacity
              onPress={() => handlePhraseTap(item)}
              style={[styles.lineRow, isActive && styles.activeRow]}
              activeOpacity={0.7}
            >
              <Text style={[styles.lineText, isActive && styles.activeText]}>
                {item.text}
              </Text>
              {!isPremium && <Text style={styles.lock}>✦</Text>}
            </TouchableOpacity>
          );
        }}
      />

      <NuanceSheet
        open={sheetOpen}
        phrase={selectedLine?.text ?? ''}
        explanation={nuance}
        loading={nuanceLoading}
        onClose={() => setSheetOpen(false)}
      />

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  lineRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4,
  },
  activeRow: { backgroundColor: '#FFF0F1' },
  lineText: { flex: 1, fontSize: 16, color: '#333', lineHeight: 26 },
  activeText: { color: '#E63946', fontWeight: '700' },
  lock: { color: '#E63946', fontSize: 10, marginLeft: 8, opacity: 0.4 },
});
