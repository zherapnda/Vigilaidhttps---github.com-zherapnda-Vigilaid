import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app';
import * as Speech from 'expo-speech';
import { ImageBackground } from 'react-native';


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const emergencyInstructions: Record<string, string[]> = {
  bleeding: [
    "Apply direct pressure to the wound.",
    "Elevate the injured area above heart level.",
    "Do not remove embedded objects.",
    "Seek medical assistance if bleeding continues."
  ],
  choking: [
    "Ask if the person can cough or speak.",
    "Give 5 back blows between the shoulder blades.",
    "Perform abdominal thrusts if needed.",
    "Call emergency services immediately."
  ],
  burn: [
    "Cool the burn under running water for 10 minutes.",
    "Remove jewelry or tight items around the burn.",
    "Cover with a clean cloth.",
    "Seek medical help for severe burns."
  ],
  allergy: [
    "Use an epinephrine auto-injector if available.",
    "Call emergency services immediately.",
    "Lay the person down and elevate legs.",
    "Loosen tight clothing."
  ],
  drowning: [
    "Call emergency services immediately.",
    "Begin CPR if the person isn’t breathing.",
    "Turn them on their side to drain water if needed.",
    "Stay with the person until help arrives."
  ],
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);

  useEffect(() => {
    const checkAccountStatus = async () => {
      const accountStatus = await AsyncStorage.getItem('hasAccount');
      setHasAccount(accountStatus === 'true');
    };
    checkAccountStatus();
  }, []);

  const handleEmergencyCall = () => {
    Alert.alert("Emergency", "Do you want to call emergency services?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL("tel:911") },
    ]);
  };

  const openInstructions = (type: string) => {
    setSelectedEmergency(type);
    setModalVisible(true);
    const steps = emergencyInstructions[type];
    Speech.speak(steps.join('. '));
  };

  const myths = [
    {
      myth: "Put butter on a burn to soothe the pain.",
      truth: "Butter traps heat and can worsen burns. Use cool running water instead.",
    },
    {
      myth: "You should suck out snake venom.",
      truth: "That is dangerous. Keep the person calm and seek emergency help immediately.",
    },
    {
      myth: "If someone is choking, hit them on the back right away.",
      truth: "Only do this if they cannot cough or speak. Encourage them to cough first.",
    },
    {
      myth: "You should always tilt your head back for a nosebleed.",
      truth: "You should lean forward to avoid swallowing blood.",
    },
    {
      myth: "Heart attacks are always sudden and dramatic.",
      truth: "They can start subtly. Chest discomfort, nausea, and fatigue are warning signs too.",
    },
  ];
  
  const [todayMyth, setTodayMyth] = useState<{ myth: string; truth: string } | null>(null);
  const [showWelcomeBox, setShowWelcomeBox] = useState(false);

  
  useEffect(() => {
    const randomMyth = myths[Math.floor(Math.random() * myths.length)];
    setTodayMyth(randomMyth);
  }, []);
  

  return (
    <ImageBackground
      source={require('../assets/images/backgroundM.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <View style={styles.container}>
      <Image
    source={require('../assets/images/icon.png')}
    style={styles.logo}
  />
      
      <Text style={styles.title}>Vigilaid </Text>
      <Text style={styles.subtitle}></Text>

      
      <TouchableOpacity
  style={styles.getStartedButton}
  onPress={() => setShowWelcomeBox(true)} // <-- OPEN the welcome box
>
  <Text style={styles.buttonText}>🍀Get Started🍀</Text>
</TouchableOpacity>

      

      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.buttonText}>⚠️ Emergency Contact ⚠️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickHelpButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>🆘 Quick Emergency Help 🆘</Text>
      </TouchableOpacity>

      {/* Quick Emergency Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedEmergency ? (
              <>
                <Text style={styles.modalTitle}>
                  {selectedEmergency.charAt(0).toUpperCase() + selectedEmergency.slice(1)} Instructions
                </Text>
                <ScrollView>
                  {emergencyInstructions[selectedEmergency].map((step, index) => (
                    <Text key={index} style={styles.instructionText}>{index + 1}. {step}</Text>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedEmergency(null)}
                >
                  <Text style={styles.buttonText}>← Back</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Choose Emergency</Text>
                {Object.keys(emergencyInstructions).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.optionButton}
                    onPress={() => openInstructions(type)}
                  >
                    <Text style={styles.buttonText}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            <TouchableOpacity
              style={[styles.closeButton, { marginTop: 10 }]}
              onPress={() => {
                setSelectedEmergency(null);
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 🔍 Myth of the Day Section */}
      {todayMyth && (
        <View style={styles.mythContainer}>
          <Text style={styles.mythHeader}>Myth of the Day</Text>
          <Text style={styles.mythLabel}>Myth:</Text>
          <Text style={styles.mythText}>{todayMyth.myth}</Text>
          <Text style={styles.mythLabel}>Truth:</Text>
          <Text style={styles.truthText}>{todayMyth.truth}</Text>
        </View>
      )}
      {showWelcomeBox && (
  <View style={styles.welcomeBox}>
    <Text style={styles.welcomeTitle}>🍀 Welcome to Vigilaid! 🍀</Text>
    <Text style={styles.welcomeText}>
      Vigilaid is here to help you master first aid emergencies!
      {"\n\n"}
      📚 Tap 'Learn' to study situations.{"\n"}
      🆘 Use 'Quick Help' in real emergencies.{"\n"}
      ❤️ Connect with others in the Forum!
    </Text>
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setShowWelcomeBox(false)} // <-- CLOSE the box
    >
      <Text style={styles.buttonText}>Got it!</Text>
    </TouchableOpacity>
  </View>
)}

    </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily:'Poppins-Black',
    fontSize: 38,
    marginBottom: -3,
    color: '#6B0F0F',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Italic',
    fontSize: 1,
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  welcomeBox: {
    backgroundColor: '#F2B28C', 
    padding: 20,
    borderRadius: 15,
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#D2665A',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#6E8E59',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginBottom: 18,
  },
  emergencyButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginBottom: 15,
  },
  quickHelpButton: {
    backgroundColor: '#28a745',
    paddingVertical: 22,
    paddingHorizontal: 55,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#6E8E59',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#CAE0BC',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  instructionText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 8,
  },
  logo: {
    width: 106,
    height: 105,
    marginBottom: 5,
    resizeMode: 'contain',
    borderRadius: 40,
  },  
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // light overlay for readability
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  mythContainer: {
    marginTop: 30,
    backgroundColor: '#CAE0BC',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#CAE0BC',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  mythHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  mythLabel: {
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    marginTop: 8,
    color: '#dc3545',
  },
  mythText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#444',
  },
  truthText: {
    fontFamily: 'Poppins-Italic',
    fontSize: 16,
    color: '#A35C7A',
  }  
});
