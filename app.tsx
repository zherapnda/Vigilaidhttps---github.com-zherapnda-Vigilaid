import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";  
import { User } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
// Import Screens
import HomeScreen from "./screens/HomeScreen";
import LearnScreen from "./screens/LearnScreen";
import DiscussionScreen from "./screens/Discussion";
import AccountScreen from "./screens/AccountScreen";
import SignupScreen from "./screens/SignupScreen";
import LessonScreen from './screens/Learn/LessonScreen';
import QuizScreen from './screens/Learn/QuizScreen';
import DiscussionStack from "./screens/Discussion/DiscussionStack"; // Import the DiscussionStack
import DiscussionDetailsScreen from "./screens/Discussion/DiscussionDetails";

// Define LessonScreenProps
interface LessonScreenProps {
  route: {
    params: {
      topicId: string;
    };
  };
  navigation: any; // Replace 'any' with the correct type if available
}

export type RootStackParamList = {
  Signup: undefined;
  MainTabs: { screen: keyof RootStackParamList } | undefined;
  Discussion: undefined;
  DiscussionDetails: { postId: string };
  Account: undefined;
  Home: undefined;
  Learn: undefined;
  Lesson: { topicId: string }; 
  Quiz: { topicId: string };
};


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Navigation Tabs
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: any;

        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Learn') iconName = 'book';
        else if (route.name === 'Forum') iconName = 'chatbubbles';
        else if (route.name === 'Account') iconName = 'person';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarStyle: {
        backgroundColor: '#D2665A',
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        height: 55,
        paddingBottom: 10,
      },
      tabBarLabelStyle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
      },
      tabBarActiveTintColor: '#B82132',
      tabBarInactiveTintColor: '#F2B28C',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen as React.FC<any>} options = {{ headerShown: false}} />
    <Tab.Screen name="Learn" component={LearnScreen as React.FC<any>} options = {{ headerShown: false}}/>
    <Tab.Screen name="Forum" component={DiscussionStack} options = {{ headerShown: false}}/>
    <Tab.Screen name="Account" component={AccountScreen as React.FC<any>} options = {{ headerShown: false}}/>
  </Tab.Navigator>
);


export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
    'RobotoSlab-Regular': require('./assets/fonts/RobotoSlab-Regular.ttf'),
    'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),

  });

  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as User | null);  
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (!fontsLoaded || loading) {
    return null; // Optionally return <AppLoading /> or a spinner here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: {
      backgroundColor: '#D2665A',
    },
    headerTintColor: '#872341',
    headerTitleStyle: {
      fontFamily: 'Poppins-Bold',
      fontSize: 26,
    }, }}>
        {user ? (
          <>
            <Stack.Screen name="Vigilaid ⛨                                ⚚" component={TabNavigator} />
            <Stack.Screen name="Lesson" component={LessonScreen as React.FC<any>} />
            <Stack.Screen name="Quiz" component={QuizScreen as React.FC<any>} />
              
          </>
        ) : (
          <Stack.Screen name="Signup" component={SignupScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
