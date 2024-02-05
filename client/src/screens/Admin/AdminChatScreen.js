import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import ChatMessage from "../../components/ChatMessage";
import { sendMessageAsAdmin, fetchMessagesForAdminChat } from "../../services/api";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useNavigation } from "@react-navigation/native";

const AdminChatScreen = ({ route }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { chatId } = route.params;

  useEffect(() => {
    fetchAdminChatMessages();
  }, [chatId, user.token]);

  const fetchAdminChatMessages = async () => {
    try {
      const response = await fetchMessagesForAdminChat(chatId, user.token);
      if (response && response.success) {
        setMessages(response.messages);
      } else {
        Alert.alert("Erro", "Falha ao buscar mensagens.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao buscar as mensagens.");
      console.error("Erro ao buscar mensagens para admin:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      const response = await sendMessageAsAdmin(chatId, currentMessage, user.token);

      if (response.success) {
        setCurrentMessage("");
      } else {
        Alert.alert("Falha", "Não foi possível enviar a mensagem.");
        console.error("Falha ao enviar mensagem:", response.message);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar a mensagem.");
      console.error("Falha ao enviar mensagem:", error);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUserSender = item.senderRole === "admin";
    return <ChatMessage message={item.content} isCurrentUserSender={isCurrentUserSender} />;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 20 }}
      />
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Barra de Digitação"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.buttonSendMessage}>
          <Text style={styles.textForSendingMessage}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },
  inputSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    width: 235,
    height: 47,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 1,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 0.4,
    fontSize: 17,
    color: "rgba(0, 0, 0, 0.5)",
  },
  buttonSendMessage: {
    width: 90,
    height: 47,
    backgroundColor: "#2182DB",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 0.4,
  },
  textForSendingMessage: {
    color: "#FFFFFF",
    fontSize: 17,
  },
});

export default AdminChatScreen;
