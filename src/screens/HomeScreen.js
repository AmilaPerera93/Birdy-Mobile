// src/screens/HomeScreen.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase';
import { getPotentialMatches } from '../services/matches';
import { handleSwipe } from '../services/swipes';
import { addDummyUsers } from '../utils/seedData';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchModalVisible, setMatchModalVisible] = useState(false); // New Match Popup

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const data = await getPotentialMatches(auth.currentUser.uid);
    // FIX: Filter strictly by ID to ensure you never see yourself
    const filtered = data.filter(p => p.uid !== auth.currentUser.uid);
    setProfiles(filtered);
    setLoading(false);
  };

  const onSwipe = async (action) => {
    if (currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    
    // 1. Optimistic Update (Move to next card immediately for speed)
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // 2. Send data to backend
    const result = await handleSwipe(auth.currentUser.uid, currentProfile.uid, action);

    // 3. Check for Match
    if (result.isMatch) {
      setMatchModalVisible(true); // Show the "It's a Match" popup!
    }
  };

  const currentProfile = profiles[currentIndex];

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF5733"/></View>;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Birdy.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileLink}>👤 Profile</Text>
        </TouchableOpacity>
      </View>

      {/* DEV TOOLS */}
      <View style={styles.devTools}>
         <TouchableOpacity onPress={addDummyUsers} style={styles.miniButton}>
            <Text style={styles.miniButtonText}>+ Dummies</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={fetchProfiles} style={[styles.miniButton, {backgroundColor: 'green'}]}>
            <Text style={styles.miniButtonText}>Refresh</Text>
         </TouchableOpacity>
      </View>

      {/* CARD AREA */}
      <View style={styles.cardContainer}>
        {currentProfile ? (
          <View style={styles.card}>
            {currentProfile.profileImage ? (
               <Image source={{ uri: currentProfile.profileImage }} style={styles.image} />
            ) : (
               <View style={[styles.image, { backgroundColor: '#ddd' }]} />
            )}
            
            <View style={styles.info}>
              <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
              <Text style={styles.bio}>{currentProfile.bio || "No bio available."}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.center}>
            <Text style={{fontSize: 18, color: 'gray'}}>No more profiles!</Text>
            <Text style={{fontSize: 14, color: '#ccc'}}>Check back later.</Text>
          </View>
        )}
      </View>

      {/* SWIPE BUTTONS */}
      {currentProfile && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => onSwipe("pass")} style={[styles.roundButton, {borderColor: 'red'}]}>
            <Text style={{fontSize: 30}}>❌</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSwipe("like")} style={[styles.roundButton, {borderColor: 'green'}]}>
            <Text style={{fontSize: 30}}>💚</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MATCH POPUP MODAL */}
      <Modal visible={matchModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.matchTitle}>IT'S A MATCH! 🎉</Text>
            <Text style={styles.matchText}>You and that person like each other.</Text>
            <TouchableOpacity 
              style={styles.matchButton} 
              onPress={() => setMatchModalVisible(false)}
            >
              <Text style={styles.matchButtonText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', paddingTop: 50 },
  center: { justifyContent: 'center', alignItems: 'center', height: 300 },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 10 },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#FF5733' },
  profileLink: { fontSize: 16, color: '#6200ea', marginTop: 5 },
  
  devTools: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  miniButton: { backgroundColor: '#6200ea', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  miniButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  cardContainer: { height: 450, width: width * 0.9, justifyContent: 'center', alignItems: 'center' },
  card: { width: '100%', height: '100%', backgroundColor: 'white', borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, overflow: 'hidden' },
  image: { width: '100%', height: '70%' },
  info: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold' },
  bio: { fontSize: 16, color: 'gray', marginTop: 5 },

  buttons: { flexDirection: 'row', justifyContent: 'space-evenly', width: '80%', marginTop: 20 },
  roundButton: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center' },
  matchTitle: { fontSize: 30, fontWeight: 'bold', color: '#FF5733', marginBottom: 10 },
  matchText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  matchButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 30, width: '100%', alignItems: 'center' },
  matchButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});