import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../app";

// Define navigation props
type LessonScreenProps = NativeStackScreenProps<RootStackParamList, "Lesson">;

const LessonScreen: React.FC<LessonScreenProps> = ({ route, navigation }) => {
  const { topicId } = route.params; // Get topicId from navigation params
  const [lesson, setLesson] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson details from Firestore
  useEffect(() => {
    const fetchLessonDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "Emergency Lessons", topicId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLesson(docSnap.data() as { title: string; content: string });
        } else {
          setError("Lesson not found.");
        }
      } catch (err) {
        setError("Failed to load lesson. Please try again.");
        console.error("Error fetching lesson:", err);
      }
      setLoading(false);
    };

    fetchLessonDetails();
  }, [topicId]);

  // Navigate to Quiz Screen
  const goToQuiz = () => {
    navigation.navigate("Quiz", { topicId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : lesson ? (
        <>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.content}>{lesson.content}</Text>

          {/* Take Quiz Button */}
          <TouchableOpacity style={styles.quizButton} onPress={goToQuiz}>
            <Text style={styles.quizButtonText}>Take Quiz</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </ScrollView>
  );
};

export default LessonScreen;

// Styles
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15, color: "#333", textAlign: "center" },
  content: { fontSize: 18, color: "#555", textAlign: "center", marginBottom: 30 },
  error: { color: "red", fontSize: 16, marginBottom: 20 },
  quizButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  quizButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});
