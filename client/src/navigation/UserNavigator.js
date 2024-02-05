import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserLoginScreen from "../screens/User/UserLoginScreen";
import UserRegisterScreen from "../screens/User/UserRegisterScreen";
import UserForgotPasswordScreen from "../screens/User/UserForgotPasswordScreen";
import UserClothingListScreen from "../screens/User/UserClothingListScreen";
import SummerCampaignScreen from "../screens/User/SummerCampaignScreen";
import WinterCampaignScreen from "../screens/User/WinterCampaignScreen";
import AllClothingScreen from "../screens/User/AllClothingScreen";
import UserChatListScreen from "../screens/User/UserChatListScreen";
import UserChatScreen from "../screens/User/UserChatScreen";
import ClothingInfoScreen from "../screens/User/ClothingInfoScreen";

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="UserLogin">
      <Stack.Screen
        name="UserLoginScreen"
        component={UserLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserRegisterScreen"
        component={UserRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserForgotPasswordScreen"
        component={UserForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserClothingListScreen"
        component={UserClothingListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClothingInfoScreen"
        component={ClothingInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllClothingScreen"
        component={AllClothingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SummerCampaignScreen"
        component={SummerCampaignScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WinterCampaignScreen"
        component={WinterCampaignScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserChatListScreen"
        component={UserChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserChatScreen"
        component={UserChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
