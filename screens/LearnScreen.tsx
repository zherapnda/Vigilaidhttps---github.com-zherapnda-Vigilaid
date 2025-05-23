import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app';
import { ImageBackground } from 'react-native';

type LearnScreenProps = NativeStackScreenProps<RootStackParamList, 'Learn'>;

const topics = [
  { id: 'bleeding', title: 'Bleeding' },
  { id: 'choking', title: 'Choking' },
  { id: 'burn', title: 'Burns' },
  { id: 'allergy', title: 'Allergic Reaction' },
  { id: 'drowning', title: 'Drowning' },
  { id: 'cardiacemergencies', title: 'Cardiac Emergencies' },
  { id: "firstaid", title: "First Aid Kit" },
];

const LearnScreen: React.FC<LearnScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground
          source={require('../assets/images/backgroundW.png')}
          style={styles.background}
          resizeMode="cover"
        >
    <ScrollView contentContainerStyle={styles.overlay}>
      <Text style={styles.header}>⚕ Select an emergency to learn! ⚕</Text>
      {topics.map((topic) => (
        <TouchableOpacity
          key={topic.id}
          style={styles.topicButton}
          onPress={() => navigation.navigate('Lesson', { topicId: topic.id })}
        >
          <Text style={styles.buttonText}>{topic.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </ImageBackground>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Poppins-Italic',
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: "#CAE0BC",
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'RobotoSlab-Bold',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  topicButton: {
    
    backgroundColor: "#F2B28C",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: '#872341',
    fontSize: 18,
  },
});
