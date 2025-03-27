import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app";

// Define navigation prop types
type AccountScreenProps = NativeStackScreenProps<RootStackParamList, "Account">;

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    emergencyContact: "911",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    overallScore: 0,
    comments: [],
  });

  // Load User Data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedScore = await AsyncStorage.getItem("overallScore");
      const storedComments = await AsyncStorage.getItem("userComments");
      const storedContact = await AsyncStorage.getItem("emergencyContact");

      setUserData((prev) => ({
        ...prev,
        overallScore: storedScore ? parseInt(storedScore) : 0,
        comments: storedComments ? JSON.parse(storedComments) : [],
        emergencyContact: storedContact || "911",
      }));
    };

    loadUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <Image source={{ uri: userData.profilePic }} style={styles.profilePic} />

      {/* User Info */}
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      {/* Emergency Contact */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Emergency Contact:</Text>
        <Text style={styles.value}>{userData.emergencyContact}</Text>
      </View>

      {/* Overall Score */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Overall Score:</Text>
        <Text style={styles.value}>{userData.overallScore} pts</Text>
      </View>

      {/* User Comments */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Your Comments:</Text>
        {userData.comments.length > 0 ? (
          userData.comments.map((comment, index) => (
            <Text key={index} style={styles.comment}>
              - {comment}
            </Text>
          ))
        ) : (
          <Text style={styles.noComments}>No comments yet.</Text>
        )}
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.button} onPress={() => alert("Edit Profile Coming Soon!")}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  infoBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  commentsContainer: {
    width: "90%",
    marginTop: 15,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  comment: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  noComments: {
    fontSize: 16,
    color: "#888",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
