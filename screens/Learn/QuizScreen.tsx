import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { firestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { RootStackParamList } from "../../app";

type QuizScreenProps = NativeStackScreenProps<RootStackParamList, "Quiz">;

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ route, navigation }) => {
  const { topicId } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const quizRef = collection(firestore, `emergency_lessons/${topicId}/quiz`);
        const snapshot = await getDocs(quizRef);
        const loadedQuestions: Question[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[];
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {quizCompleted ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Learn")}>
            <Text style={styles.buttonText}>Back to Learn</Text>
          </TouchableOpacity>
        </View>
      ) : (
        questions.length > 0 && (
          <View>
            <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
            <FlatList
              data={questions[currentQuestionIndex].options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedAnswer === item
                      ? item === questions[currentQuestionIndex].correctAnswer
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
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#007bff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
  correctAnswer: {
    backgroundColor: "#28a745",
  },
  wrongAnswer: {
    backgroundColor: "#dc3545",
  },
  resultContainer: {
    alignItems: "center",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
