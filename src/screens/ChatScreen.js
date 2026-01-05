// src/screens/ChatScreen.js
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native'; // Added View & Platform
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure content stays in view
import { auth, db } from '../config/firebase';
import { sendMessage } from '../services/chat';

export default function ChatScreen({ route }) {
  const { matchId } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "matches", matchId, "messages");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formattedMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));
      setMessages(formattedMessages);
    });

    return unsubscribe;
  }, []);

  const onSend = useCallback((newMessages = []) => {
    const text = newMessages[0].text;
    sendMessage(matchId, auth.currentUser.uid, text);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: auth.currentUser.uid,
        }}
        // FIX FOR ANDROID KEYBOARD ISSUE
        alwaysShowSend
        scrollToBottom
        keyboardShouldPersistTaps="never"
        bottomOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust if still hidden
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});