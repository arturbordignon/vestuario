import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/Button";
import { fetchClothingBySeason, fetchDonatedClothingForUser } from "../../services/api";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const UserClothingListScreen = () => {
  const [summerClothes, setSummerClothes] = useState([]);
  const [winterClothes, setWinterClothes] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadClothing = async () => {
      try {
        const summerResponse = await fetchClothingBySeason("Verão");
        const winterResponse = await fetchClothingBySeason("Inverno");
        let filteredSummerClothes = summerResponse.data;
        let filteredWinterClothes = winterResponse.data;

        if (user && user.token) {
          const donatedResponse = await fetchDonatedClothingForUser(user.token);
          if (donatedResponse && donatedResponse.data) {
            const donatedIds = donatedResponse.data.map((item) => item._id);
            filteredSummerClothes = summerResponse.data.filter(
              (item) => !donatedIds.includes(item._id)
            );
            filteredWinterClothes = winterResponse.data.filter(
              (item) => !donatedIds.includes(item._id)
            );
          }
        }

        setSummerClothes(filteredSummerClothes);
        setWinterClothes(filteredWinterClothes);
      } catch (error) {
        console.error("Erro ao buscar Roupas:", error);
      }
    };

    loadClothing();
  }, [user]);

  if (!user) {
    navigation.navigate("UserLoginScreen");
    return null;
  }

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Encontre a roupa que combine com você</Text>

      <View style={styles.seasonLine}>
        <Text style={styles.buttonsSeason}>Campanha de Verão</Text>
        <Button
          width={108}
          height={25}
          fontSize={15}
          borderRadius={18}
          name="Ver mais"
          onPress={() => navigation.navigate("SummerCampaignScreen")}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        {summerClothes.map((item) => (
          <Image key={item._id} source={{ uri: item.image }} style={styles.clothingImage} />
        ))}
      </ScrollView>

      <View style={styles.seasonLine}>
        <Text style={styles.buttonsSeason}>Campanha de Inverno</Text>
        <Button
          width={108}
          height={25}
          fontSize={15}
          borderRadius={18}
          name="Ver mais"
          onPress={() => navigation.navigate("WinterCampaignScreen")}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {winterClothes.map((item) => (
          <Image key={item._id} source={{ uri: item.image }} style={styles.clothingImage} />
        ))}
      </ScrollView>

      <View style={styles.buttonsNav}>
        <Button
          width={266}
          height={42}
          fontSize={20}
          borderRadius={18}
          name="Ver todas as roupas"
          onPress={() => navigation.navigate("AllClothingScreen")}
        />
        <Button
          width={266}
          height={42}
          fontSize={20}
          borderRadius={18}
          name="Ver Conversas"
          onPress={() => navigation.navigate("UserChatListScreen")}
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    marginTop: 120,
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 30,
  },
  seasonLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonsSeason: {
    fontSize: 16,
    fontWeight: "500",
  },
  clothingImage: {
    width: 108,
    height: 119,
    borderRadius: 8,
    marginRight: 20,
    marginTop: 19,
  },
  buttonsNav: {
    marginTop: 15,
    flexDirection: "column",
    gap: 15,
  },
});

export default UserClothingListScreen;
