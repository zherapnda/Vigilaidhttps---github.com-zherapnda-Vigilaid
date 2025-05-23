import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ImageBackground } from 'react-native';


const AccountScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedContact, setEditedContact] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setEditedName(data.name || "");
          setEditedContact(data.emergencyContact || "");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data.");
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        name: editedName,
        emergencyContact: editedContact,
      });

      setUserData((prev: any) => ({
        ...prev,
        name: editedName,
        emergencyContact: editedContact,
      }));

      setIsEditing(false);
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to save changes.");
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found.</Text>
      </View>
    );
  }

  return (
    <ImageBackground
              source={require('../assets/images/backgroundL.png')}
              style={styles.background}
              resizeMode="cover"
            >
    <ScrollView contentContainerStyle={styles.overlay}>
      <Image source={require('../assets/images/icon.png')} style={styles.profilePic} />

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Your Name"
          />
          <TextInput
            style={styles.input}
            value={editedContact}
            onChangeText={setEditedContact}
            placeholder="Emergency Contact"
            keyboardType="phone-pad"
          />
        </>
      ) : (
        <>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.label}>Emergency Contact:</Text>
        <Text style={styles.value}>{userData.emergencyContact}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Overall Score:</Text>
        <Text style={styles.value}>{userData.score || 0} pts</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Your Comments:</Text>
        {userData.comments && userData.comments.length > 0 ? (
          userData.comments.map((comment: string, index: number) => (
            <Text key={index} style={styles.value}>{comment}</Text>
          ))
        ) : (
          <Text style={styles.value}>No comments available.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit Profile"}</Text>
      </TouchableOpacity>
    </ScrollView>
  </ImageBackground>

  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FDF8F2",
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsSection: {
    width: "90%",
    marginTop: 20,
  },
  commentsTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    marginBottom: 10,
    color: "#007bff",
  },
  commentBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // semi-transparent
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  commentText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#444",
  },  

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "#123524",
  },
  email: {
    fontFamily: "Poppins-Italic",
    fontSize: 20,
    color: "#fff",
    marginBottom: 15,
  },
  input: {
    width: "90%",
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F6DED8",
  },
  infoBox: {
    fontFamily: "Poppins-Medium",
    width: "90%",
    backgroundColor: "#F6DED8",
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
    fontFamily: "Poppins-Medium",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#B82132",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 50,
  },
});
