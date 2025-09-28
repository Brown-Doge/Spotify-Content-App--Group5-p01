import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, Button, FlatList, Image, RefreshControl, Text, View } from "react-native";
import { getMyFavorites, setFavorite } from "../db/favorites";

export default function FavoritesTab() {
  const [rows, setRows] = useState<
    Array<{ movie_id: number; title: string; poster_path: string | null }>
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => setRows(await getMyFavorites());

  // remove a movie from favortie list that way there is a way to 
  const removeFromFav = async (movie: { movie_id: number; title: string; poster_path: string | null }) => {
    try {
      await setFavorite(movie, false);
      await load();
    } catch (error) {
      console.error("Error removing favorite ", error);
      Alert.alert("Error", "Failed to remove favorite");
    }
  };

  // reload every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      load().catch(console.error);
    }, [])
  );

//   List the movies once favorited
  return (
    <FlatList
      data={rows}
      keyExtractor={(x) => String(x.movie_id)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
      renderItem={({ item }) => (
        <View
          style={{
            flexDirection: "row",
            padding: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {item.poster_path ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w185${item.poster_path}` }}
                style={{ width: 60, height: 90, marginRight: 12 }}
              />
            ) : null}
            <Text style={{ fontSize: 16, flex: 1 }}>{item.title}</Text>
          </View>
          <Button
            title="Remove"
            onPress={() => removeFromFav(item)}
            color="#ff4444"
          />
        </View>
      )}
      ListEmptyComponent={<Text style={{ padding: 16 }}>No favorites yet.</Text>}
    />
  );
}
