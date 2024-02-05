import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchClothingById, startOrContinueChat } from "../../services/api";
import Button from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";

const ClothingInfoScreen = () => {
  const [clothingItem, setClothingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { clothingId } = route.params;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getClothingItem = async () => {
      try {
        setLoading(true);
        const response = await fetchClothingById(clothingId);
        setClothingItem(response);
      } catch (error) {
        console.error("Erro ao buscar a roupa:", error);
      } finally {
        setLoading(false);
      }
    };
    getClothingItem();
  }, [clothingId]);

  const handleStartOrContinueChat = async () => {
    if (!user || !user.token) {
      Alert.alert("Erro", "Faça Login para iniciar uma conversa.");
      return;
    }

    try {
      const chatResponse = await startOrContinueChat(user.id, clothingId, user.token);
      if (chatResponse.success) {
        navigation.navigate("UserChatScreen", {
          chatId: chatResponse.chatId,
          clothingId: clothingId,
        });
      } else {
        Alert.alert(
          "Erro na Conversa",
          chatResponse.message || "Não é possível continuar ou iniciar uma conversa."
        );
      }
    } catch (error) {
      console.error("Erro ao iniciar ou continuar conversa:", error);
      Alert.alert("Erro na Conversa", "Algo inesperado aconteceu.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      {clothingItem ? (
        <View style={styles.content}>
          <Text style={styles.title}>Informações da Roupa</Text>
          <Image source={{ uri: clothingItem.image }} style={styles.image} />
          <Text style={styles.clothingTitle}>{clothingItem.title}</Text>
          <Text style={styles.detailText}>
            Tamanho: <Text style={styles.boldText}>{clothingItem.size}</Text>
          </Text>
          <Text style={styles.detailText}>
            Cor: <Text style={styles.boldText}>{clothingItem.color}</Text>
          </Text>
          <Text style={styles.detailText}>
            <Text>{clothingItem.gender}</Text>
          </Text>
          <Text style={styles.detailText}>
            <Text>{clothingItem.condition}</Text>
          </Text>
          <Button
            width={333}
            height={43}
            fontSize={20}
            borderRadius={18}
            name="Reservar"
            onPress={handleStartOrContinueChat}
          />
        </View>
      ) : (
        <Text style={styles.infoText}>Roupa não encontrada</Text>
      )}
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

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  image: {
    width: 143,
    height: 144,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 26,
    marginBottom: 26,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: 30,
  },
  clothingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },

  infoText: {
    textAlign: "center",
    margin: 20,
  },
});

export default ClothingInfoScreen;
