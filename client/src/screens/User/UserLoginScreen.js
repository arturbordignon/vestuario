import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { AuthContext } from "../../contexts/AuthContext";
import { ActivityIndicator } from "react-native";

const UserLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const { login, isInAdminMode, switchToAdminMode } = useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);
    setShowLoadingOverlay(true);

    const result = await login(email, password, false);

    setIsLoading(false);
    setShowLoadingOverlay(false);

    if (result && result.success) {
      navigation.navigate("UserClothingListScreen");
    } else {
      alert("Erro ao fazer Login");
    }
  };

  useEffect(() => {
    if (isInAdminMode) {
      navigation.navigate("AdminLoginScreen");
    }
  }, [isInAdminMode]);

  const handleAdminLoginPress = () => {
    switchToAdminMode();
  };

  return (
    <View style={styles.container}>
      <Header style={styles.logo} />
      <Text style={styles.title}>Faça Login</Text>

      <InputField type={"email"} placeholder="Email" value={email} onChangeText={setEmail} />

      <View style={styles.forgotPassLink}>
        <TouchableOpacity onPress={() => navigation.navigate("UserForgotPasswordScreen")}>
          <Text style={styles.forgotPassword}>Esqueceu sua Senha?</Text>
        </TouchableOpacity>
        <InputField
          type={"password"}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secure={true}
        />
      </View>

      <View style={styles.buttonLogin}>
        <Button
          width={155}
          height={43}
          fontSize={22}
          borderRadius={18}
          name="Login"
          onPress={() => handleLogin()}
        />
      </View>
      <TouchableOpacity onPress={() => handleAdminLoginPress()}>
        <Text style={styles.footerTextLoginAdmin}>Fazer Login como Admin</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("UserRegisterScreen")}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
        </TouchableOpacity>
        <Button
          width={197}
          height={40}
          fontSize={20}
          borderRadius={18}
          name="Cadastre-se"
          onPress={() => navigation.navigate("UserRegisterScreen")}
        />
      </View>

      <Modal transparent={true} animationType="slide" visible={showLoadingOverlay}>
        <View style={styles.overlay}>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </Modal>
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
  title: {
    marginTop: 120,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 38,
  },
  forgotPassLink: {
    marginTop: 12,
    width: "90%",
    alignItems: "flex-end",
    marginBottom: 38,
  },
  forgotPassword: {
    color: "#000",
    fontWeight: "500",
    textDecorationLine: "none",
    fontSize: 15,
    lineHeight: 35,
  },
  footerTextLoginAdmin: {
    marginTop: 38,
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 21,
    gap: 13,
  },
  footerText: {
    color: "#000",
    textDecorationLine: "none",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    padding: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonLogin: {
    width: "90%",
    alignItems: "flex-end",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default UserLoginScreen;
