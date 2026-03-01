import {
  View, Text, ScrollView, FlatList,
  StyleSheet, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useVideos } from '@/hooks/useVideos';
import VideoCard, { Video } from '@/components/VideoCard';

export default function HomeScreen() {
  const { sections, loading, error } = useVideos();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>annyeong</Text>
          <Text style={styles.logoKo}>안녕</Text>
        </View>

        {loading && <ActivityIndicator color="#E63946" style={{ marginTop: 40 }} />}
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && sections.length === 0 && (
          <Text style={styles.empty}>No videos yet. Check back soon!</Text>
        )}

        {/* Category sections */}
        {sections.map(({ category, videos }) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <FlatList
              data={videos}
              keyExtractor={(v) => v.id}
              renderItem={({ item }) => <VideoCard video={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            />
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'baseline',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  logo: { fontSize: 26, fontWeight: '800', color: '#E63946', letterSpacing: -0.5 },
  logoKo: { fontSize: 16, color: '#999', marginLeft: 8 },
  section: { marginTop: 28 },
  sectionTitle: {
    fontSize: 17, fontWeight: '700', color: '#111',
    paddingHorizontal: 20, marginBottom: 12,
  },
  row: { paddingHorizontal: 20 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 60, fontSize: 15 },
  errorText: { color: '#E63946', textAlign: 'center', marginTop: 40, fontSize: 14 },
});
