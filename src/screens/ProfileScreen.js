// src/screens/ProfileScreen.js
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../config/firebase';
import { saveUserProfile } from '../services/storage';

export default function ProfileScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // Store the text version
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const user = auth.currentUser;

  // Load existing profile data when screen opens
  useEffect(() => {
    const loadProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profileImage) setImage(data.profileImage);
        if (data.bio) setBio(data.bio);
      }
    };
    loadProfile();
  }, []);

  // 1. Pick Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profiles
      quality: 0.2,   // <--- IMPORTANT: Keep quality low to fit in Database
      base64: true,   // <--- This gives us the image as text
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);        // For showing on screen now
      setImageBase64(result.assets[0].base64); // For saving to database
    }
  };

  // 2. Save Profile
  const handleSave = async () => {
    if (!user) return;
    setUploading(true);

    const result = await saveUserProfile(user.uid, imageBase64, bio);
    
    setUploading(false);

    if (result.success) {
      Alert.alert("Success", "Profile Updated!");
      navigation.goBack(); 
    } else {
      Alert.alert("Error", "Failed to save profile");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Your Bio</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Tell us about yourself..." 
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#FF5733' },
  imageContainer: { marginBottom: 30 },
  image: { width: 150, height: 150, borderRadius: 75 },
  placeholder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: 'gray' },
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20, textAlignVertical: 'top' },
  button: { backgroundColor: '#FF5733', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});