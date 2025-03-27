import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { RootStackParamList } from '../app';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Check if the user has an account
  useEffect(() => {
    const checkAccountStatus = async () => {
      const accountStatus = await AsyncStorage.getItem('hasAccount');
      setHasAccount(accountStatus === 'true'); 
    };
    checkAccountStatus();
  }, []);

  // Emergency Call Function
  const handleEmergencyCall = () => {
    Alert.alert(
      "Emergency Alert",
      "Do you want to call emergency services?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call Now", onPress: () => Linking.openURL("tel:911") }
      ]
    );
  };

  // Start Recording Function
  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      console.log('Starting recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop Recording Function
  const stopRecording = async () => {
    if (!recording) return;
    console.log("Stopping recording...");

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording saved at:", uri);

    setRecording(null);
    setIsRecording(false);

    // Send the recording to an ML API (you need to implement this function)
    sendToMLModel(uri);
  };

  // Function to send audio to ML model (Replace this with your actual API)
  const sendToMLModel = async (audioUri: string | null) => {
    if (!audioUri) return;
    console.log("Uploading to ML model:", audioUri);

    // Example: Implement API request to upload the recording to a backend or Firebase
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Vigilaid! 🚀</Text>
      <Text style={styles.subtitle}>Your safety, our priority.</Text>

      {hasAccount === false && (
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.buttonText}>⚠️ Emergency Contact</Text>
      </TouchableOpacity>

      {/* Voice Recording Button */}
      <TouchableOpacity
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{isRecording ? "🛑 Stop Recording" : "🎤 Start Recording"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginBottom: 15,
  },
  emergencyButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  recordButton: {
    backgroundColor: '#28a745', // Green for recording
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
