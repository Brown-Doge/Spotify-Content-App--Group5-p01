import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function Search() {

  const [query, setQuery] = useState("");

  // Empty movies array at first but then setMovies replaces it with data results 
  const [movies, setMovies] = useState<any[]>([]);
 
 
  //AS OF NOW TO MAKE IT SIMPLE, TAKE OUT THE KEY BEFORE PUSHING CODE ON GITHUB
  const API_KEY = "cle"; 


  // function that implements the api and calls the search movies using TMDB documentation
  async function searchMovies() {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + "&query="+encodeURIComponent(query));
      const data = await response.json();
      console.log("TMDB:", data);
      if (data) {
        setMovies(data.results);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
  
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
        renderItem={function ({ item }) {
          return <Text style={styles.item}>{item.title}</Text>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 75, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  item: { paddingVertical: 6, fontSize: 16 },
});