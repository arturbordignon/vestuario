import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";
import { AuthContext } from "../contexts/AuthContext";

const AppNavigator = () => {
  const { isInAdminMode } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isInAdminMode ? <AdminNavigator /> : <UserNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
