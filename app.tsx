import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";  
import { User } from "firebase/auth";

// Import Screens
import HomeScreen from "./screens/HomeScreen";
import LearnScreen from "./screens/LearnScreen";
import DiscussionScreen from "./screens/Discussion";
import AccountScreen from "./screens/AccountScreen";
import SignupScreen from "./screens/SignupScreen";

export type RootStackParamList = {
  Signup: undefined;
  MainTabs: undefined;
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
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen as React.FC<any>} />
    <Tab.Screen name="Learn" component={LearnScreen as React.FC<any>} />
    <Tab.Screen name="Forum" component={DiscussionScreen} />
    <Tab.Screen name="Account" component={AccountScreen as React.FC<any>} />
  </Tab.Navigator>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checking if user is already signed in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as User | null);  
      setLoading(false);
    });

    return unsubscribe; // Cleanup function
  }, []);

  if (loading) return null; // Prevent flashing

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (  // If user is logged in, go to MainTabs
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        ) : (  // Otherwise, show Signup screen
          <Stack.Screen name="Signup" component={SignupScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
