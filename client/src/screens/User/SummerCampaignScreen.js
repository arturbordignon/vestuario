import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { fetchClothingBySeason, fetchDonatedClothingForUser } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

const SummerCampaignScreen = () => {
  const [summerClothes, setSummerClothes] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadSummerClothes = async () => {
      try {
        const summerResponse = await fetchClothingBySeason("Verão");
        if (summerResponse && summerResponse.data) {
          let filteredSummerClothes = summerResponse.data;

          if (user && user.token) {
            const donatedResponse = await fetchDonatedClothingForUser(user.token);
            if (donatedResponse && donatedResponse.data) {
              const donatedIds = donatedResponse.data.map((item) => item._id);
              filteredSummerClothes = summerResponse.data.filter(
                (item) => !donatedIds.includes(item._id)
              );
            }
          }

          setSummerClothes(filteredSummerClothes);
        }
      } catch (error) {
        console.error("Erro ao buscar roupas de verão:", error);
      }
    };

    loadSummerClothes();
  }, [user]);

  const renderClothingItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => {
          navigation.navigate("ClothingInfoScreen", { clothingId: item._id });
        }}
      >
        <Text style={styles.reserveButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Campanha de Verão</Text>
      <FlatList
        data={summerClothes}
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

export default SummerCampaignScreen;
