import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AdminLoginScreen from "../screens/Admin/AdminLoginScreen";
import AdminForgotPasswordScreen from "../screens/Admin/AdminForgotPasswordScreen";
import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
import RegisteredClothingListScreen from "../screens/Admin/RegisteredClothingListScreen";
import RegisterClothingScreen from "../screens/Admin/RegisterClothingScreen";
import AddAdminScreen from "../screens/Admin/AddAdminScreen";
import DonatedClothingScreen from "../screens/Admin/DonatedClothingScreen";
import AdminChatScreen from "../screens/Admin/AdminChatScreen";
import AdminChatListScreen from "../screens/Admin/AdminChatListScreen";
import EditClothingScreen from "../screens/Admin/EditClothingScreen";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AdminLoginScreen">
      <Stack.Screen
        name="AdminLoginScreen"
        component={AdminLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminHomeScreen"
        component={AdminHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisteredClothingListScreen"
        component={RegisteredClothingListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterClothingScreen"
        component={RegisterClothingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditClothingScreen"
        component={EditClothingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminChatListScreen"
        component={AdminChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminChatScreen"
        component={AdminChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddAdminScreen"
        component={AddAdminScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DonatedClothingScreen"
        component={DonatedClothingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminForgotPasswordScreen"
        component={AdminForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
