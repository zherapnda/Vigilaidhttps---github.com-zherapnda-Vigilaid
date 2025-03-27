import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app";

// Define navigation props
type LearnScreenProps = NativeStackScreenProps<RootStackParamList, "Learn">;

const LearnScreen: React.FC<LearnScreenProps> = ({ navigation }) => {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch emergency categories from Firestore
  useEffect(() => {
    const fetchEmergencyCategories = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "lessons"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
        console.error("Error fetching categories:", err);
      }
      setLoading(false);
    };

    fetchEmergencyCategories();
  }, []);

  // Navigate to Lesson Screen
  const goToLesson = (topicId: string) => {
    navigation.navigate("Lesson", { topicId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Select an Emergency to Learn</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.button} onPress={() => goToLesson(category.id)}>
            <Text style={styles.buttonText}>{category.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default LearnScreen;

// Styles
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  error: { color: "red", fontSize: 16, marginBottom: 20 },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});
