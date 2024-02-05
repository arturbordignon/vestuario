import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { fetchAllClothing } from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

const AllClothingScreen = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getClothingItems = async () => {
      try {
        const response = await fetchAllClothing();
        const availableClothing = response.filter((item) => item.status.toLowerCase() !== "doada");
        setClothingItems(availableClothing);
      } catch (error) {
        console.error("Erro ao buscar as roupas:", error);
      }
    };

    getClothingItems();
  }, []);

  const renderClothingItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {user && (
          <TouchableOpacity
            onPress={() => navigation.navigate("ClothingInfoScreen", { clothingId: item._id })}
            style={styles.reserveButton}
          >
            <Text style={styles.reserveButtonText}>Reservar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />

      <Text style={styles.title}>Todas as Roupas Disponíveis</Text>

      <FlatList
        data={clothingItems}
        renderItem={renderClothingItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
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
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 38,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
    marginBottom: 24,
    gap: 30,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: 143,
    height: 144,
    resizeMode: "cover",
  },
  reserveButton: {
    backgroundColor: "#2182BD",
    paddingVertical: 7,
  },
  reserveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default AllClothingScreen;
