import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const AdminHomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    navigation.navigate("AdminLoginScreen");
  };

  useEffect(() => {
    if (!user) {
      navigation.navigate("AdminLoginScreen");
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Header style={styles.logo} />
      <Text style={styles.title}>Menu</Text>
      <View style={styles.menu}>
        <Button
          width={345}
          height={49}
          fontSize={22}
          borderRadius={18}
          name="Lista de Roupas Cadastradas"
          onPress={() => navigation.navigate("RegisteredClothingListScreen")}
        />
        <Button
          width={345}
          height={49}
          fontSize={22}
          borderRadius={18}
          name="Cadastrar Roupas"
          onPress={() => navigation.navigate("RegisterClothingScreen")}
        />
        <Button
          width={345}
          height={49}
          fontSize={22}
          borderRadius={18}
          name="Conversas"
          onPress={() => navigation.navigate("AdminChatListScreen")}
        />
        <Button
          width={345}
          height={49}
          fontSize={22}
          borderRadius={18}
          name="Adicionar Admin"
          onPress={() => navigation.navigate("AddAdminScreen")}
        />
        <Button
          width={345}
          height={49}
          fontSize={22}
          borderRadius={18}
          name="Roupas Doadas"
          onPress={() => navigation.navigate("DonatedClothingScreen")}
        />

        <Button
          width={345}
          height={49}
          fontSize={22}
          borderRadius={18}
          name="Sair"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    marginTop: 120,
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 38,
  },
  menu: {
    width: "100%",
    alignItems: "center",
    gap: 18,
  },
  logoutButton: {
    backgroundColor: "#C50C0C",
  },
});

export default AdminHomeScreen;
