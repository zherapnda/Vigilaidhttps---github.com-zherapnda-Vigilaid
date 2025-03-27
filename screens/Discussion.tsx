import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

type Post = {
    id: string;
    text: string;
    timestamp: any;
    likes: number;
    userId: string;
    username: string;
    profilePic: string;
  };

const DiscussionScreen = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => {
        const data = doc.data() as Post;
        return { ...data, id: doc.id }; // Ensure `id` is added only once
      }));
    });
  
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    await addDoc(collection(db, 'posts'), {
      text: newPost,
      timestamp: new Date(),
      likes: 0,
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

  return (
    <View style={styles.container}>
      {/* Input Box to Create a New Post */}
      <View style={styles.postBox}>
        <Image source={{ uri: auth.currentUser?.photoURL || 'https://via.placeholder.com/50' }} style={styles.profilePic} />
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

      {/* Feed of Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.post}
            onPress={() => navigation.navigate('DiscussionDetails', { postId: item.id })}
          >
            <View style={styles.postHeader}>
              <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
              <Text style={styles.username}>{item.username}</Text>
            </View>
            <Text style={styles.postText}>{item.text}</Text>
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => handleLike(item.id, item.likes)}>
                <Text style={styles.likeButton}>❤️ {item.likes}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DiscussionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  postBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  postButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginLeft: 10 },
  postButtonText: { color: '#fff', fontWeight: 'bold' },
  post: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  postHeader: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 16 },
  postText: { fontSize: 16, marginVertical: 10 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  likeButton: { fontSize: 16, color: 'red' },
});
