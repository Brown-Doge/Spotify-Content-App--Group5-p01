import React, { useState } from "react";
import { Alert, Button, FlatList, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// Update the import path below if the actual path is different
import { getCurrentUserId } from "../db/auth";
import { setFavorite } from "../db/favorites";
import { addUserHistory } from "../db/history";
import { inserMovie } from "../db/movies";

export default function Search() {

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<any[]>([]);  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [selectedRuntime, setSelectedRuntime] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // Getting the API key from the .env file if null set to empty string
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "";

  // Empty movies array at first but then setMovies replaces it with data results 
  const [movies, setMovies] = useState<any[]>([]);


  // function that implements the api and calls the search movies using TMDB documentation
  async function searchMovies() {
    try {
      const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );
      const data = await response.json();
      console.log("TMDB:", data);
      if (data) {
        // Searches movies up to 8 results
        setMovies(data.results.slice(0,8));
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
  async function loadMovieDetails(movieId: number) {
    setDetailsLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US&append_to_response=reviews`
      );
      const data = await res.json();
  
      const runtime: number | null =
        typeof data?.runtime === "number" ? data.runtime : null;
  
      const genres: string[] = Array.isArray(data?.genres)
        ? data.genres
            .map(function (g: any) {
              return g?.name;
            })
            .filter(Boolean)
        : [];
  
      const reviews: any[] = Array.isArray(data?.reviews?.results)
        ? data.reviews.results
        : [];
  
      setSelectedRuntime(runtime);
      setSelectedGenres(genres);
      setSelectedReviews(reviews);
    } catch (e) {
      console.error("Error fetching details for movie", movieId, e);
      setSelectedRuntime(null);
      setSelectedGenres([]);
      setSelectedReviews([]);
    } finally {
      setDetailsLoading(false);
    }
  }
  // Alerts user if not logged in
  const showLoginAlert = () => {
    if (Platform.OS === "web") {
      window.alert("Please log in first");
    } else {
      Alert.alert("Please log in first");
    }
  };
  
return (
  // Search bar 
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={function (text) {
          setQuery(text);
        }}
        placeholder="Search movies"
      />
      <Button title="Search" onPress={searchMovies} />

      <FlatList
        data={movies}
        keyExtractor={function (item) {
          return String(item.id);
        }}
        // Images next to movie when user searches
        renderItem={({ item }) => {
          const posterUrl = item.poster_path
            ? "https://image.tmdb.org/t/p/w92" + item.poster_path
            : null;
  
            return (
              // When user touches on movie we set the Modal Visibility to true which shows a little overview of the movie
              <TouchableOpacity
                onPress={async () => {
                  setSelectedMovie(item);
                  setSelectedMovie(item);
                  setModalVisible(true);
                  loadMovieDetails(item.id);
                  setModalVisible(true);

                  //saves clicked movie to db and shows up in history tab
                  try{
                    const userId = await getCurrentUserId(); 
                    if(!userId){
                      showLoginAlert();
                      return;
                    }
                    await inserMovie({
                      movie_id: item.id,
                      title: item.title,
                      overview: item.overview ?? null,
                    });
                   await addUserHistory(userId, item.id);
                  console.log("Movie added to history");
                  }catch(error){
                    console.error("Error adding movie to history:", error);
                    showLoginAlert();
                    return;
                  }

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
              // Search results ^

            );
          }}
          ItemSeparatorComponent={() => <View style={styles.lineBreak} />} 
       />
       
       <Modal
  transparent
  visible={modalVisible}
  animationType="fade"
  onRequestClose={() => {
    setModalVisible(false);
    setSelectedRuntime(null);
    setSelectedGenres([]);
    setSelectedReviews([]);
  }}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalCard}>
      {selectedMovie && (
        <>
          {selectedMovie.poster_path ? (
            <Image
              source={{ uri: "https://image.tmdb.org/t/p/w154" + selectedMovie.poster_path }}
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
            {selectedMovie.overview || "No overview available."}
          </Text>

          <Button
  title={isFav ? "Remove Favorite" : "Add to Favorites ★"}
  onPress={async () => {
    if (!selectedMovie) return;
    try {
      getCurrentUserId(); // throws if not logged in
    } catch {
      showLoginAlert();   //Alert
      return;
    }
    await setFavorite(
      { movie_id: selectedMovie.id, title: selectedMovie.title, poster_path: selectedMovie.poster_path ?? null },
      !isFav
    );
    setIsFav(!isFav);
  }}
/>


          <View style={{ height: 8 }} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </>
      )}
    </View>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop:50 , backgroundColor: "#fff", paddingLeft: 10, paddingRight: 10},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  
  // Search bar result styles
  item: { paddingVertical: 6, fontSize: 13 },
  movieRow: {flexDirection: "row", alignItems: "center", paddingVertical: 6},
  poster: {width: 50, height: 75, borderRadius: 4, marginRight: 10},
  posterUnknown: {width: 50, height: 75, borderRadius: 4, marginRight: 10, backgroundColor: "#000"},
  lineBreak: { height: 1, backgroundColor: "#000" },
  
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxWidth: 500,
    width: "100%",
    maxHeight: "80%",
  },
  modalPoster: {
    width: 100,
    height: 150,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalOverview: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  ratingBadge: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  ratingText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 12,
  },

});