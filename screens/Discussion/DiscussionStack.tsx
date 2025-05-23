import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscussionScreen from '../Discussion';
import DiscussionDetailsScreen from './DiscussionDetails';

export type DiscussionStackParamList = {
  Discussion: undefined;
  DiscussionDetails: { postId: string };
};

const Stack = createNativeStackNavigator<DiscussionStackParamList>();

const DiscussionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Discussion"
        component={DiscussionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiscussionDetails"
        component={DiscussionDetailsScreen}
        options={{ title: 'Post Details' }}
      />
    </Stack.Navigator>
  );
};

export default DiscussionStack;
