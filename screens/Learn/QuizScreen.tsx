import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../app";
import { ImageBackground } from 'react-native';

type QuizScreenProps = NativeStackScreenProps<RootStackParamList, "Quiz">;

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizzes: Record<string, Question[]> = {
  choking: [
    {
      question: "What is the first step when someone is choking?",
      options: ["Call 911", "Give water", "Encourage coughing", "Do CPR"],
      correctAnswer: "Encourage coughing",
    },
    {
      question: "What do you do if coughing doesn't help?",
      options: ["Back blows", "Call mom", "Wait", "Shake them"],
      correctAnswer: "Back blows",
    },
  ],
  bleeding: [
    {
      question: "What is the first thing to do for a bleeding wound?",
      options: [
        "Apply direct pressure",
        "Wash with soap",
        "Put oil",
        "Ignore it",
      ],
      correctAnswer: "Apply direct pressure",
    },
    {
      question: "What should you avoid doing to a bleeding wound?",
      options: [
        "Apply pressure",
        "Elevate the limb",
        "Remove embedded objects",
        "Cover with a clean cloth",
      ],
      correctAnswer: "Remove embedded objects",
    },
  ],
  burn: [
    {
      question: "What's the first step in treating a burn?",
      options: [
        "Apply ice",
        "Cool under running water",
        "Cover with butter",
        "Pop blisters",
      ],
      correctAnswer: "Cool under running water",
    },
    {
      question: "What should you avoid applying to a burn?",
      options: ["Clean cloth", "Butter", "Cool water", "Loose bandage"],
      correctAnswer: "Butter",
    },
  ],
  allergy: [
    {
      question: "What's the immediate action for a severe allergic reaction?",
      options: [
        "Give antihistamines",
        "Use an epinephrine auto-injector",
        "Wait and watch",
        "Apply cold compress",
      ],
      correctAnswer: "Use an epinephrine auto-injector",
    },
    {
      question: "After administering epinephrine, what should you do?",
      options: [
        "Lay the person down and elevate legs",
        "Give them food",
        "Have them walk around",
        "Ignore symptoms",
      ],
      correctAnswer: "Lay the person down and elevate legs",
    },
  ],
  drowning: [
    {
      question: "What's the first step when someone is drowning?",
      options: [
        "Call emergency services",
        "Jump in immediately",
        "Wait for them to surface",
        "Throw objects at them",
      ],
      correctAnswer: "Call emergency services",
    },
    {
      question: "If the person isn't breathing after drowning, what should you do?",
      options: [
        "Begin CPR",
        "Wait for help",
        "Shake them",
        "Give them water",
      ],
      correctAnswer: "Begin CPR",
    },
  ],
  cardiacemergencies: [
    {
      question: "What is the first step in a cardiac emergency?",
      options: [
        "Call 911",
        "Give water",
        "Start CPR",
        "Wait for help",
      ],
      correctAnswer: "Call 911",
    },
    {
      question: "What should you do if the person is unresponsive?",
      options: [
        "Shake them",
        "Start CPR",
        "Give them food",
        "Ignore them",
      ],
      correctAnswer: "Start CPR",
    },
  ],
  firstaid: [
    {
      question: "What is the first step in any first aid situation?",
      options: [
        "Assess the scene for safety",
        "Call 911",
        "Start CPR",
        "Give water",
      ],
      correctAnswer: "Assess the scene for safety",
    },
    {
      question: "What should you do if someone is bleeding heavily?",
      options: [
        "Apply direct pressure",
        "Ignore it",
        "Give them food",
        "Call mom",
      ],
      correctAnswer: "Apply direct pressure",
    },  
    
    {
      question: "What should you do if someone is having a seizure?",
      options: [
        "Hold them down",
        "Move objects away",
        "Give them water",
        "Ignore it",
      ],
      correctAnswer: "Move objects away",
    },
    {
      question: "What should you do if someone is having a stroke?",
      options: [
        "Call 911 immediately",
        "Give them food",
        "Wait and watch",
        "Shake them awake",
      ],
      correctAnswer: "Call 911 immediately",
    },
  ],
};

const QuizScreen: React.FC<QuizScreenProps> = ({ route, navigation }) => {
  const { topicId } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const topicQuestions = quizzes[topicId];
    if (topicQuestions) {
      setQuestions(topicQuestions);
    } else {
      Alert.alert("No quiz found for this topic.");
      navigation.goBack();
    }
  }, [topicId]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
        saveScore();
      }
    }, 1000);
  };

  const saveScore = async () => {
    try {
      const existingScore = await AsyncStorage.getItem("overallScore");
      const updatedScore =
        (existingScore ? parseInt(existingScore) : 0) + score;
      await AsyncStorage.setItem("overallScore", updatedScore.toString());
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
  <ImageBackground
        source={require('../../assets/images/backgroundB.png')}
        style={styles.background}
        resizeMode="cover"
      >

    <View style={styles.overlay}>
      {quizCompleted ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score} / {questions.length}
          </Text>
        </View>
      ) : (
        questions.length > 0 && (
          <View>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].question}
            </Text>
            <FlatList
              data={questions[currentQuestionIndex].options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedAnswer === item
                      ? item ===
                        questions[currentQuestionIndex].correctAnswer
                        ? styles.correctAnswer
                        : styles.wrongAnswer
                      : {},
                  ]}
                  onPress={() => handleAnswerSelect(item)}
                  disabled={!!selectedAnswer}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )
      )}
    </View>
  </ImageBackground>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FDF8F2",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#123524",
    marginBottom: 2,
  },
  scoreText: {
    fontFamily: "Poppins-Black",
    fontSize: 32,
    color: "#123524",
    marginBottom: 380,
    fontWeight: "600",
  },
  questionText: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    marginBottom: 44,
    color: "#123524",
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
  button: {
    backgroundColor: "#6E8E59",
    padding: 28,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 2,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    color: "#fff",
    fontSize: 16,
  },
  optionButton: {
    backgroundColor: "#6E8E59",
    padding: 19,
    borderRadius: 5,
    marginBottom: 10,
  },
  correctAnswer: {
    backgroundColor: "green",
  },
  wrongAnswer: {
    backgroundColor: "red",
  },
  optionText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
  optionButtonDisabled: {
    backgroundColor: "#ccc",
  },
  optionTextDisabled: {
    color: "#999",
  },
})