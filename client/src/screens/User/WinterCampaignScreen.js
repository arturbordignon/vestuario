import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useContext } from "react";
import { fetchClothingBySeason } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";

const WinterCampaignScreen = () => {
  const [winterClothes, setWinterClothes] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadWinterClothes = async () => {
      try {
        const response = await fetchClothingBySeason("Inverno");
        setWinterClothes(response.data);
      } catch (error) {
        console.error("Erro ao buscar roupas de inverno: ", error);
      }
    };

    loadWinterClothes();
  }, []);

  const renderClothingItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      {user && (
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => {
            navigation.navigate("ClothingInfoScreen", { clothingId: item._id });
          }}
        >
          <Text style={styles.reserveButtonText}>Reservar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Campanha de Inverno</Text>
      <FlatList
        data={winterClothes}
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
    justifyContent: "space-around",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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

export default WinterCampaignScreen;
