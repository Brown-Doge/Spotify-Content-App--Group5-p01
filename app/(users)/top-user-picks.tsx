import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TmdbMovie = {
  id: number;
  title: string;
  poster_path?: string | null;
  overview?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  vote_count?: number | null;
};

export default function Trending() {
  const [trendingDay, setTrendingDay] = useState<TmdbMovie[]>([]);
  const [trendingWeek, setTrendingWeek] = useState<TmdbMovie[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const [selectedRuntime, setSelectedRuntime] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '';

  useEffect(function loadTrending() {
    async function fetchTrending(time_window: 'day' | 'week') {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=${apiKey}`);
        const data = await res.json();
        const items: TmdbMovie[] = Array.isArray(data?.results) ? data.results.slice(0, 15) : [];
        if (time_window === 'day') {
          setTrendingDay(items);
        } else {
          setTrendingWeek(items);
        }
      } catch (e) {
        console.error('Error fetching trending', time_window, e);
        if (time_window === 'day') setTrendingDay([]);
        if (time_window === 'week') setTrendingWeek([]);
      }
    }

    fetchTrending('day');
    fetchTrending('week');
  }, [apiKey]);

  

  async function loadMovieDetails(movieId: number) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`);
      const data = await res.json();
      const runtime: number | null = typeof data?.runtime === 'number' ? data.runtime : null;
      const genres: string[] = Array.isArray(data?.genres) ? data.genres.map(function (g: any) { return g?.name; }).filter(Boolean) : [];
      setSelectedRuntime(runtime);
      setSelectedGenres(genres);
    } catch (e) {
      console.error('Error fetching details for movie', movieId, e);
      setSelectedRuntime(null);
      setSelectedGenres([]);
    }
  }

  function renderMovieItem(item: TmdbMovie) {
    const posterUrl = item.poster_path ? 'https://image.tmdb.org/t/p/w92' + item.poster_path : null;
    return (
      <TouchableOpacity
        onPress={function () {
          setSelectedMovie(item);
          setModalVisible(true);
          setSelectedRuntime(null);
          setSelectedGenres([]);
          loadMovieDetails(item.id);
        }}
      >
        <View style={styles.movieRow}>
          {posterUrl ? (
            <Image source={{ uri: posterUrl }} style={styles.poster} />
          ) : (
            <View style={styles.posterUnknown} />
          )}
          <Text style={styles.item}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending Today</Text>
      <FlatList
        data={trendingDay}
        keyExtractor={function (m) { return String(m.id); }}
        renderItem={function ({ item }) { return renderMovieItem(item); }}
        ItemSeparatorComponent={function () { return <View style={styles.lineBreak} />; }}
        ListEmptyComponent={function () { return <Text style={styles.empty}>No results.</Text>; }}
      />

      <View style={{ height: 24 }} />

      <Text style={styles.header}>Trending This Week</Text>
      <FlatList
        data={trendingWeek}
        keyExtractor={function (m) { return String(m.id); }}
        renderItem={function ({ item }) { return renderMovieItem(item); }}
        ItemSeparatorComponent={function () { return <View style={styles.lineBreak} />; }}
        ListEmptyComponent={function () { return <Text style={styles.empty}>No results.</Text>; }}
      />

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={function () { setModalVisible(false); }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedMovie && (
              <>
                {selectedMovie.poster_path ? (
                  <Image
                    source={{ uri: 'https://image.tmdb.org/t/p/w154' + selectedMovie.poster_path }}
                    style={styles.modalPoster}
                  />
                ) : null}

                <Text style={styles.modalTitle}>{selectedMovie.title}</Text>

                {typeof selectedMovie.vote_average === 'number' && (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      {`★ ${selectedMovie.vote_average.toFixed(1)}`}
                      {typeof selectedMovie.vote_count === 'number' ? ` (${selectedMovie.vote_count})` : ''}
                    </Text>
                  </View>
                )}

                <Text style={styles.subTitle}>
                  {[
                    (selectedMovie.release_date ? String(new Date(selectedMovie.release_date).getFullYear()) : '—'),
                    (typeof selectedRuntime === 'number' ? `${selectedRuntime} min` : null),
                    (selectedGenres.length ? selectedGenres.join(', ') : null),
                  ].filter(Boolean).join(' • ')}
                </Text>

                <Text style={styles.modalOverview}>
                  {selectedMovie.overview || 'No overview available.'}
                </Text>

                <View style={{ height: 8 }} />
                <TouchableOpacity onPress={function () { setModalVisible(false); }} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingLeft: 10, paddingRight: 10 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  empty: { fontSize: 14, color: '#666', marginBottom: 8 },
  item: { paddingVertical: 6, fontSize: 13 },
  movieRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  poster: { width: 50, height: 75, borderRadius: 4, marginRight: 10 },
  posterUnknown: { width: 50, height: 75, borderRadius: 4, marginRight: 10, backgroundColor: '#000' },
  lineBreak: { height: 1, backgroundColor: '#000' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxWidth: 500,
    width: '100%',
    maxHeight: '80%',
  },
  modalPoster: {
    width: 100,
    height: 150,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalOverview: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingBadge: {
    alignSelf: 'center',
    backgroundColor: '#111827',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    marginBottom: 6,
  },
  ratingText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  favButton: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  favButtonText: { color: '#fff', fontWeight: '600' },
  closeButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: { color: '#111827', fontWeight: '600' },
});
