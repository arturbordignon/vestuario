import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getAllAdmins } from "../../services/api";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useNavigation } from "@react-navigation/native";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const AddAdminScreen = () => {
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAllAdmins(user.token);
        if (response && response.data) {
          setAdmins(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar admins:", error);
      }
    };

    fetchAdmins();
  }, [user.token]);

  const handleAddAdmin = async () => {
    Alert.alert(
      "Solicitação Enviada",
      "Uma solicitação de acesso para o novo email foi enviada para o desenvolvedor."
    );
    setEmail("");
  };

  const handleDeleteAdmin = async () => {
    Alert.alert("Erro", "Somente o desenvolvedor pode excluir Administradores");
  };

  const confirmDelete = (adminId) => {
    Alert.alert(
      "Excluir Admin",
      "Tem certeza que quer remover o admin?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "OK", onPress: () => handleDeleteAdmin() },
      ],
      { cancelable: false }
    );
  };

  const renderAdmin = ({ item }) => (
    <View style={styles.adminContainer}>
      <Text style={styles.adminName}>{item.email}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        <Icon name="trash" size={21} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />

      <Text style={styles.title}>Adicione um Administrador</Text>
      <Text style={styles.subtitle}>Digite o email para o envio do acesso ao Aplicativo</Text>
      <InputField
        type={"email"}
        value={email}
        onChangeText={setEmail}
        placeholder={"Digite o Email"}
        style={styles.input}
      />
      <View style={styles.addAdminButton}>
        <Button
          width={153}
          height={38}
          fontSize={18}
          borderRadius={18}
          name={"Enviar Acesso"}
          onPress={() => handleAddAdmin()}
        />
      </View>
      <FlatList data={admins} keyExtractor={(item) => item._id} renderItem={renderAdmin} />
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
    marginTop: 150,
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 22,
  },
  input: {
    width: "80%",
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  addAdminButton: {
    width: "90%",
    alignItems: "flex-end",
    marginTop: 16,
  },
  adminContainer: {
    marginTop: 39,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,

    width: 313,
    height: 70,
    backgroundColor: "#fff",
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 20,
    fontSize: 22,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 4,
  },
  adminName: {
    fontSize: 17,
    fontWeight: "500",
  },
  deleteButton: {
    marginRight: 10,
  },
});

export default AddAdminScreen;
