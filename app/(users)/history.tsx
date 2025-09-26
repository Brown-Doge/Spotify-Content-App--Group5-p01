import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { getCurrentUserId } from "../db/auth";
import { deleteHistoryEntry, getUserHistory, HistoryRow } from "../db/history";



export default function HistoryTab() {
    const[rows, setRows] = React.useState<HistoryRow[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const userId = getCurrentUserId();

    const load = async () => {
        try {
            if (userId) {
                const data = await getUserHistory(userId);
                setRows(data);
            }
        } catch (error) {
            console.error("Error loading history:", error);
        }
    };
    const handleDelete = async (historyId: number) => {
        try {
            await deleteHistoryEntry(historyId);
            await load();
        } catch (error) {
            console.error("Error deleting history entry:", error);
        }
    };
    React.useEffect(() => {
        load().catch(console.error);
    }, []);
    return (
        <FlatList
            data={rows}
            keyExtractor={(x) => String(x.history_id)}
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
                <View style={styles.row}>
                    <View style = {{flex: 1}}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>Watched at: {new Date(item.watched_at).toLocaleString()}</Text>
                    </View>
                    <Text style={styles.delete} onPress={() => handleDelete(item.history_id)}>Delete</Text>
                </View>
            )}
            ListEmptyComponent={<Text style={{ padding: 16 }}>No history yet.</Text>}
        />
    );
}
const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 12,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,

    },
    date: {
        fontSize: 14,
        color: "gray",
    },
    delete: {
        color: "red",
        fontWeight: "bold",
        padding: 8,
        backgroundColor: "#fdd",
        borderRadius: 4,
    },
});
