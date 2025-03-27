import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, getDoc, addDoc, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { firestore } from "../../firebaseConfig"; // Make sure this points to your Firestore config
import { RootStackParamList } from "../../app";

// Define route props for navigation
type DiscussionDetailsScreenRouteProp = RouteProp<RootStackParamList, "DiscussionDetails">;

// Define component props
type DiscussionDetailsScreenProps = NativeStackScreenProps<RootStackParamList, "DiscussionDetails">;

// Define Post Type
type Post = {
  id: string;
  text: string;
  timestamp: Timestamp;
  likes: number;
  userId: string;
};

// Define Comment Type
type Comment = {
  id: string;
  text: string;
  timestamp: Timestamp;
  userId: string;
};

const DiscussionDetailsScreen: React.FC<DiscussionDetailsScreenProps> = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch post data
    const fetchPost = async () => {
      try {
        const docRef = doc(firestore, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          console.log("No such post found!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    // Fetch and listen for comments in real time
    const commentsRef = collection(firestore, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(loadedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(firestore, "posts", postId, "comments"), {
        text: newComment,
        timestamp: Timestamp.now(),
        userId: "currentUser123", // Replace with actual user ID from auth
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {post ? (
        <>
          {/* Post Details */}
          <View style={styles.postContainer}>
            <Text style={styles.postText}>{post.text}</Text>
            <Text style={styles.timestamp}>{new Date(post.timestamp.toDate()).toLocaleString()}</Text>
          </View>

          {/* Comments List */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTimestamp}>{new Date(item.timestamp.toDate()).toLocaleString()}</Text>
              </View>
            )}
          />

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Post not found.</Text>
      )}
    </View>
  );
};

export default DiscussionDetailsScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
  },
  commentContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  commentText: {
    fontSize: 16,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
