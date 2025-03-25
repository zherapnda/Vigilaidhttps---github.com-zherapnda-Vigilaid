import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app';

// Define navigation prop types
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  // Check if the user has an account
  useEffect(() => {
    const checkAccountStatus = async () => {
      const accountStatus = await AsyncStorage.getItem('hasAccount');
      setHasAccount(accountStatus === 'true'); // Convert stored string to boolean
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
        { text: "Call Now", onPress: () => Linking.openURL("tel:911") } // Replace "911" with the real emergency number
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* App Logo / Illustration */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome to Vigilaid! 🚀</Text>
      <Text style={styles.subtitle}>Your safety, our priority.</Text>

      {/* Show "Get Started" Button Only If User Doesn't Have an Account */}
      {hasAccount === false && (
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}

      {/* Emergency Contact Button (Always Visible) */}
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.buttonText}>⚠️ Emergency Contact</Text>
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
    backgroundColor: '#dc3545', // Red for emergency
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
