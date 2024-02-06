import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";
import Button from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { ActivityIndicator } from "react-native";

const AdminLoginScreen = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const { login, switchToUserMode, isInAdminMode } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const navigation = useNavigation();

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setShowLoadingOverlay(true);
    try {
      await login(adminEmail, adminPassword, true);

      setLoginAttempted(true);
      setLoginSuccessful(true);
    } catch (error) {
      console.log("Erro ao fazer Login:", error.message);
      setLoginAttempted(true);
      setLoginSuccessful(false);
    } finally {
      setIsLoading(false);
      setShowLoadingOverlay(false);
    }
  };

  useEffect(() => {
    if (loginSuccessful && isInAdminMode) {
      navigation.navigate("AdminHomeScreen");
    } else if (!isInAdminMode && loginAttempted && !loginSuccessful) {
      navigation.navigate("UserLoginScreen");
    }
  }, [loginSuccessful, isInAdminMode, loginAttempted, navigation]);

  const handleSwitchToUserLogin = () => {
    switchToUserMode();
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <Header style={styles.logo} />
      <Text style={styles.title}>Faça Login</Text>

      <InputField
        type={"email"}
        placeholder="Email do Administrador"
        value={adminEmail}
        onChangeText={setAdminEmail}
      />

      <View style={styles.forgotPassLink}>
        <TouchableOpacity onPress={() => navigation.navigate("AdminForgotPasswordScreen")}>
          <Text style={styles.forgotPassword}>Esqueceu sua Senha?</Text>
        </TouchableOpacity>
        <InputField
          type={"password"}
          placeholder="Senha"
          value={adminPassword}
          onChangeText={setAdminPassword}
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
          onPress={() => handleAdminLogin()}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleSwitchToUserLogin()}>
          <Text style={styles.footerTextLoginAdmin}>Fazer Login como Usuário</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} animationType="slide" visible={showLoadingOverlay}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
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
  footer: {
    marginTop: 80,
  },
  footerTextLoginAdmin: {
    marginTop: 38,
    fontSize: 18,
    fontWeight: "bold",
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

export default AdminLoginScreen;
