import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { fetchChats, fetchDonatedClothingForUser } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

const UserChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getChatsAndFilterDonated = async () => {
      if (!user) {
        console.error("O Usuário não está logado.");
        return;
      }
      try {
        const chatResponse = await fetchChats(user.token);
        if (!chatResponse || !chatResponse.success) {
          console.error("Não foi possível obter os chats.");
          return;
        }

        const donatedResponse = await fetchDonatedClothingForUser(user.token);
        if (!donatedResponse || !donatedResponse.data) {
          console.error("Erro ao buscar roupas doadas.");
          return;
        }

        const donatedIdsSet = new Set(donatedResponse.data.map((item) => item._id));

        const filteredChats = chatResponse.chats.filter(
          (chat) => !donatedIdsSet.has(chat.clothing._id)
        );

        setChats(filteredChats);
      } catch (error) {
        console.error("Falha ao encontrar conversas:", error);
      }
    };

    getChatsAndFilterDonated();
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.chatItem}>
      <View style={styles.separateImageAndButton}>
        <Image source={{ uri: item.clothing.image }} style={styles.clothingImage} />
        <Text style={styles.clothingName}>{item.clothing.title}</Text>
      </View>
      <TouchableOpacity
        style={styles.openChatButton}
        onPress={() =>
          navigation.navigate("UserChatScreen", { chatId: item._id, clothingId: item.clothing._id })
        }
      >
        <Text style={styles.openChatButtonText}>Abrir Conversa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingTop: 130, paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: "column",
    padding: 10,
    paddingHorizontal: 23,
    gap: 5,
    marginBottom: 30,
  },
  separateImageAndButton: {
    display: "flex",
    flexDirection: "row",
    gap: 24,
    alignItems: "center",
    marginBottom: 21,
    paddingHorizontal: 20,
  },
  clothingImage: {
    width: 114,
    height: 111,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOpacity: 0.3,
  },
  clothingName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  openChatButton: {
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2182DB",
    borderRadius: 18,
  },
  openChatButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "400",
  },
});

export default UserChatListScreen;
