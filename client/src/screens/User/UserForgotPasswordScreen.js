import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import Button from "../../components/Button";
import InputField from "../../components/InputField";

const UserForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");

  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    alert("Para trocar sua Senha, por favor entre em contato com o suporte.");
    navigation.navigate("UserLoginScreen");
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Recuperar sua Senha</Text>

      <View style={styles.allInputs}>
        <InputField type={"email"} placeholder="Email" value={email} onChangeText={setEmail} />
      </View>

      <View style={styles.buttonLogin}>
        <Button
          width={220}
          height={43}
          fontSize={22}
          borderRadius={18}
          name="Redefinir Senha"
          onPress={() => handleForgotPassword()}
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
          onPress={() => navigation.navigate("UserLoginScreen")}
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
  allInputs: {
    width: "90%",
    gap: 24,
    marginBottom: 33,
  },
  footer: {
    marginTop: 150,
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
});

export default UserForgotPasswordScreen;
