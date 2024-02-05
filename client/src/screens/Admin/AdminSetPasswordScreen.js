import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { adminResetPassword } from "../../services/api";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

const AdminSetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const route = useRoute();
  const navigation = useNavigation();

  const handleSetNewPassword = async () => {
    try {
      const token = route.params?.token;
      await adminResetPassword(token, newPassword);

      navigation.navigate("AdminLoginScreen");
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />

      <Text style={styles.title}>Recuperar sua Senha</Text>

      <InputField
        type={"password"}
        placeholder="Nova Senha"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <View style={styles.buttonSetNewPass}>
        <Button
          width={220}
          height={43}
          fontSize={22}
          borderRadius={18}
          name={"Redefinir Senha"}
          onPress={() => handleSetNewPassword()}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Retornar para Login</Text>

        <Button
          width={197}
          height={40}
          fontSize={20}
          borderRadius={18}
          name="Login"
          onPress={() => navigation.navigate("AdminLoginScreen")}
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
  title: {
    marginTop: 120,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 38,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonSetNewPass: {
    width: "90%",
    alignItems: "flex-end",
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
});

export default AdminSetPasswordScreen;
