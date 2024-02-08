import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { userRegister } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import Button from "../../components/Button";
import InputField from "../../components/InputField";

const UserRegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [completeName, setCompleteName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("As senhas não são iguais");
      return;
    }

    const response = await userRegister(cpf, completeName, email, password);

    if (response.error) {
      alert(response.error);
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    navigation.navigate("UserLoginScreen");
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Faça seu Cadastro</Text>

      <View style={styles.allInputs}>
        <InputField type={"email"} placeholder="Email" value={email} onChangeText={setEmail} />

        <InputField type={"text"} placeholder="CPF" value={cpf} onChangeText={setCpf} />
        <InputField
          type={"text"}
          placeholder="Nome Completo"
          value={completeName}
          onChangeText={setCompleteName}
        />
        <InputField
          type={"password"}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secure={true}
        />
        <InputField
          type={"password"}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure={true}
        />
      </View>

      <View style={styles.buttonLogin}>
        <Button
          width={155}
          height={43}
          fontSize={22}
          borderRadius={18}
          name="Cadastrar"
          onPress={() => handleRegister()}
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

export default UserRegisterScreen;
