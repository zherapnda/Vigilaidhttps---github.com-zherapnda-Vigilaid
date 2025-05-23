import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app';
import { ImageBackground } from 'react-native';


type DiscussionNavProp = NativeStackNavigationProp<RootStackParamList, 'DiscussionDetails'>;


type Post = {
  id: string;
  text: string;
  timestamp: any;
  likes: number;
  userId: string;
  username: string;
  profilePic: string;
  surprise: number;
};

// ✅ Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Discussion'>;

// Function to generate a random color based on a string input
const getRandomColor = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`;
  return color;
};

const DiscussionScreen = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const navigation = useNavigation<NavigationProp>(); // ✅ Apply navigation type

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          const data = doc.data() as Post;
          return { ...data, id: doc.id };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    await addDoc(collection(db, 'posts'), {
      text: newPost,
      timestamp: new Date(),
      likes: 0,
      surprise: 0,
      userId: auth.currentUser?.uid,
      username: auth.currentUser?.displayName || 'Anonymous',
      profilePic: auth.currentUser?.photoURL || 'https://via.placeholder.com/50',
    });

    setNewPost('');
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { likes: currentLikes + 1 });
  };
  const handleSurprise = async (postId: string, currentSurprise: number) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { surprise: currentSurprise + 1 });
  };
  const handleHappiness = async (postId: string, currentHappiness: number) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { surprise: currentHappiness + 1 });
  };
  const handleSadness = async (postId: string, currentSadness: number) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { surprise: currentSadness + 1 });
  }
  const handleAnger = async (postId: string, currentAnger: number) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { surprise: currentAnger + 1 });
  }
  const handleFear = async (postId: string, currentFear: number) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { surprise: currentFear + 1 });
  }

  return (
    <ImageBackground
          source={require('../assets/images/backgroungR.png')}
          style={styles.background}
          resizeMode="cover"
        >
    <View style={styles.overlay}>
      <View style={styles.postBox}>
        <Image
          source={{
            uri: auth.currentUser?.photoURL || 'https://via.placeholder.com/50',
          }}
          style={styles.profilePic}
        />
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ alignItems: 'flex-start', paddingHorizontal: 15 }} 
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.post}
            onPress={() => navigation.navigate('DiscussionDetails', { postId: item.id })}
          >
            <View style={styles.postHeader}>
  <View style={[styles.avatar, { backgroundColor: getRandomColor(item.userId) }]}>
    <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
  </View>
  <Text style={styles.username}>{item.username}</Text>
</View>
            <Text style={styles.postText}>{item.text}</Text>
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => handleLike(item.id, item.likes)}>
                <Text style={styles.likeButton}>❤️ {item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSurprise(item.id, item.surprise)}>
                <Text style={styles.likeButton}> 😲{item.surprise}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleHappiness(item.id, item.surprise)}>
                <Text style={styles.likeButton}> 😁{item.surprise}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSadness(item.id, item.surprise)}>
                <Text style={styles.likeButton}> 😢{item.surprise}</Text  >
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAnger(item.id, item.surprise)}>
                <Text style={styles.likeButton}> 😡{item.surprise}</Text   >
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFear(item.id, item.surprise)}>
                <Text style={styles.likeButton}> 😱{item.surprise}</Text  >
              </TouchableOpacity>

            </View>
          </TouchableOpacity>
        )}
      />
    </View>
    </ImageBackground>
  );
};

export default DiscussionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#FDF8F2" },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  postBox: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  postButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginLeft: 10 },
  postButtonText: { color: '#fff', fontWeight: 'bold' },
  post: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent background
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    width: '95%', // nice margin from edges
    alignSelf: 'flex-start', // center the box horizontally
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },  
  postHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  username: { fontWeight: 'bold', fontSize: 16 },
  postText: { fontSize: 16, marginVertical: 10 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  likeButton: { fontSize: 16, color: 'red' },
});
