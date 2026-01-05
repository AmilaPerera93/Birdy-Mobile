// src/screens/MatchesListScreen.js
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // <--- Added Image import
import { auth } from '../config/firebase';
import { fetchMatches } from '../services/chat';

export default function MatchesListScreen({ navigation }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const data = await fetchMatches(auth.currentUser.uid);
    setMatches(data);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => navigation.navigate('Chat', { matchId: item.id })}
    >
      <View style={styles.avatar}>
         {/* If they have a photo, show it. Otherwise show emoji. */}
         {item.photo ? (
            <Image 
              source={{ uri: item.photo }} 
              style={{ width: 50, height: 50, borderRadius: 25 }} 
            />
         ) : (
            <Text style={{fontSize: 20}}>👤</Text>
         )}
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subtext} numberOfLines={1}>
          {item.lastMessage || "Start the conversation!"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.header}>Your Matches</Text>
      
      <FlatList 
        data={matches}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
            <Text style={styles.empty}>No matches yet. Keep swiping!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF5733' },
  item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  name: { fontSize: 18, fontWeight: 'bold' },
  subtext: { color: 'gray', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 }
});