import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { DiscussionStackParamList } from "./DiscussionStack";
import { ImageBackground } from "react-native";

type DiscussionDetailsScreenProps = NativeStackScreenProps<
  DiscussionStackParamList,
  "DiscussionDetails"
>;

type Post = {
  id: string;
  text: string;
  timestamp: Timestamp;
  likes: number;
  userId: string;
  surprise: number;
  happiness: number;
  sadness: number;
  anger: number;
  fear: number;
};

const DiscussionDetailsScreen: React.FC<DiscussionDetailsScreenProps> = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPost({
            id: docSnap.id,
            text: data.text,
            timestamp: data.timestamp,
            likes: data.likes,
            userId: data.userId,
            surprise: data.surprise,
            happiness: data.happiness,
            sadness: data.sadness,
            anger: data.anger,
            fear: data.fear,
          });
        } else {
          console.log("Post not found.");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!post) {
    return <Text style={styles.errorText}>Post not found.</Text>;
  }

  return (
   <ImageBackground
              source={require('../../assets/images/backgroundL.png')}
              style={styles.background}
              resizeMode="cover"
            >
    
      <View style={styles.postContainer}>   
        
        <Text style={styles.postText}>{post.text}</Text>
        <Text style={styles.likes}>❤️ {post.likes} likes</Text>
        <Text style={styles.surprise}>😲 {post.surprise}</Text>
        <Text style={styles.happiness}>😃 {post.surprise}</Text>
        <Text style={styles.sadness}>😢 {post.surprise}</Text>
        <Text style={styles.anger}>😡 {post.surprise}</Text>
        <Text style={styles.fear}>😱 {post.surprise}</Text>
        <Text style={styles.timestamp}>
          Posted on {new Date(post.timestamp.toDate()).toLocaleString()}
        </Text>
      </View>
    
    </ImageBackground>
  );
};

export default DiscussionDetailsScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    color: "#FDF8F2",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  postText: {
    fontFamily: "Poppins-Medium", 
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  likes: {
    fontSize: 16,
    color: "#dc3545",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
  },
  surprise: {
    fontSize: 16,
    color: "#28a745",
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  happiness: {
    fontSize: 16,
    color: "#ffc107",
    marginBottom: 5,
  },
  sadness: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 5,
  },
  anger: {
    fontSize: 16,
    color: "#ff6347",
    marginBottom: 5,
  },
  fear: {
    fontSize: 16,
    color: "#17a2b8",
    marginBottom: 5,
  },
});
