import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import {
  fetchChatsForAdmin,
  markAsDonatedForAdmin,
  fetchDonatedClothingForAdmin,
} from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

const AdminChatListScreen = () => {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getChatsAndFilterDonated = async () => {
      if (!user || user.role !== "admin") {
        console.error("Admin não está logado.");
        return;
      }

      try {
        const donatedResponse = await fetchDonatedClothingForAdmin(user.token);

        const donatedClothingIds = donatedResponse.data.map((item) => item._id);

        const chatResponse = await fetchChatsForAdmin(user.token);
        if (chatResponse.success) {
          const nonDonatedChats = chatResponse.chats.filter(
            (chat) => !donatedClothingIds.includes(chat.clothing._id)
          );
          setChats(nonDonatedChats);
        } else {
          console.error("Falha ao buscar chats do admin:", chatResponse.message);
        }
      } catch (error) {
        console.error("Erro ao buscar roupas doadas ou chats:", error);
      }
    };

    getChatsAndFilterDonated();
  }, [user]);

  const handleMarkAsDonated = async (clothingId) => {
    try {
      await markAsDonatedForAdmin(clothingId, user.token);

      const updatedChats = chats.map((chat) => {
        if (chat.clothing._id === clothingId) {
          return {
            ...chat,
            clothing: { ...chat.clothing, status: "doada" },
          };
        }
        return chat;
      });
      setChats(updatedChats);
    } catch (error) {
      console.error("Erro ao marcar como doada:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.chatItem}>
      <View style={styles.imageAndTitleName}>
        <Image source={{ uri: item.clothing.image }} style={styles.clothingImage} />
        <View style={styles.nameAndTitleUserChat}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.clothingName}>{item.clothing.title}</Text>
        </View>
      </View>
      <View style={styles.buttonToOpenChatAndMarkDonated}>
        <TouchableOpacity
          style={styles.openChatButton}
          onPress={() => navigation.navigate("AdminChatScreen", { chatId: item._id })}
        >
          <Text style={styles.openChatButtonText}>Abrir Conversa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.donatedButton}
          onPress={() => handleMarkAsDonated(item.clothing._id)}
        >
          <Text style={styles.donatedButtonText}>Doada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} />
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
    gap: 14,
    marginBottom: 30,
  },
  imageAndTitleName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  nameAndTitleUserChat: {
    gap: 8,
  },

  buttonToOpenChatAndMarkDonated: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clothingImage: {
    width: 114,
    height: 111,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOpacity: 0.3,
    marginRight: 24,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "400",
    color: "#000",
  },
  clothingName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  openChatButton: {
    width: 195,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#2182BD",
    borderRadius: 18,
    marginRight: 10,
  },
  donatedButton: {
    width: 105,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "rgba(75, 181, 67, 0.9)",
    borderRadius: 18,
  },
  openChatButtonText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#fff",
  },
  donatedButtonText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#fff",
  },
});

export default AdminChatListScreen;
