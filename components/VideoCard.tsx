import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
}

const LEVEL_COLORS: Record<Video['level'], string> = {
  Beginner: '#4CAF50',
  Intermediate: '#FF9800',
  Advanced: '#F44336',
};

export default function VideoCard({ video }: { video: Video }) {
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/video/${video.youtubeId}`)}>
      <View style={styles.thumbnailWrapper}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.duration}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
        <View style={[styles.badge, { backgroundColor: LEVEL_COLORS[video.level] }]}>
          <Text style={styles.badgeText}>{video.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 160, marginRight: 12 },
  thumbnailWrapper: { position: 'relative', borderRadius: 8, overflow: 'hidden' },
  thumbnail: { width: 160, height: 90 },
  duration: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1,
  },
  durationText: { color: '#fff', fontSize: 11 },
  info: { marginTop: 6 },
  title: { fontSize: 13, color: '#111', fontWeight: '500', lineHeight: 18, marginBottom: 4 },
  badge: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});
