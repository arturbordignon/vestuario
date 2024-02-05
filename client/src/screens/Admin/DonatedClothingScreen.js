import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text, FlatList, Image, Dimensions } from "react-native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchDonatedClothingForAdmin } from "../../services/api";
import { useNavigation } from "@react-navigation/native";

const numColumns = 2;
const horizontalGap = 30;
const verticalGap = 15;
const screenWidth = Dimensions.get("window").width;

const cardWidth = (screenWidth - (numColumns + 1) * horizontalGap) / numColumns;

const DonatedClothingScreen = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getClothingDonatedItemsForAdmin = async () => {
      if (user.token) {
        try {
          const response = await fetchDonatedClothingForAdmin(user.token);

          if (response && response.data) {
            setClothingItems(response.data);
          }
        } catch (error) {
          console.error("Erro ao buscar as roupas doadas para admin:", error);
        }
      }
    };

    getClothingDonatedItemsForAdmin();
  }, [user?.token]);

  const renderItem = ({ item, index }) => {
    const isLastColumnItem = (index + 1) % numColumns === 0;
    const itemStyle = isLastColumnItem ? {} : { marginRight: horizontalGap };

    return (
      <View style={[styles.cardContainer, itemStyle]}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />

      <Text style={styles.title}>Lista de Roupas Doadas</Text>

      <FlatList
        data={clothingItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={numColumns}
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
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 38,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  text: {
    flex: 1,
    alignSelf: "center",
    fontSize: 18,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: verticalGap,
  },
  cardContainer: {
    width: cardWidth,
    height: 167,
    marginBottom: verticalGap,
  },
  cardImage: {
    width: "100%",
    height: 137,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default DonatedClothingScreen;
