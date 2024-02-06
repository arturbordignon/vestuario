import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Button from "../../components/Button";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import { addClothingForAdmin } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import InputField from "../../components/InputField";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";

const Checkbox = ({ label, isSelected, onToggle }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Icon name="check" style={styles.checkboxIcon} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const RegisterClothingScreen = () => {
  const [title, setTitle] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [condition, setCondition] = useState("");
  const [season, setSeason] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddClothing = async () => {
    if (!title || !size || !color || !gender || !condition || !season || !image) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!user || !user.token) {
      alert("Admin não autenticado. Faça o login novamente.");
      return;
    }

    setIsLoading(true);

    try {
      const imageInfo = await FileSystem.getInfoAsync(image.uri);
      if (!imageInfo.exists) {
        alert("A Imagem não existe!");
        setIsLoading(false);
        return;
      }

      const clothingData = new FormData();
      clothingData.append("title", title);
      clothingData.append("size", size);
      clothingData.append("color", color);
      clothingData.append("gender", gender);
      clothingData.append("condition", condition);

      const selectedSeason = season === "Verão" ? "Verão" : "Inverno";
      clothingData.append("season", selectedSeason);

      if (image) {
        clothingData.append("image", {
          uri: image.uri,
          type: "image/jpeg",
          name: "clothing.jpg",
        });
      }

      const response = await addClothingForAdmin(clothingData, user.token);
      setIsLoading(false);

      if (response && response._id) {
        navigation.navigate("RegisteredClothingListScreen");
      } else {
        console.log("Erro na API:", response);
        alert("Erro ao cadastrar a roupa. Verifique os campos e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar a roupa:", error);
      alert("Erro ao cadastrar a roupa. Verifique sua conexão e tente novamente.");
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleCheckbox = (value) => {
    setSeason(season === value ? "" : value);
  };

  return (
    <View style={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Cadastrar Roupa</Text>
      <Text style={styles.subtitle}>
        Cadastre sua Roupa aqui, ela ficará disponível para doação
      </Text>
      <InputField
        type={"text"}
        value={title}
        onChangeText={setTitle}
        placeholder={"Título"}
        style={styles.input}
      />
      <View style={styles.sizeAndColorInputs}>
        <TextInput
          type={"text"}
          style={styles.inputSizeAndColor}
          value={size}
          onChangeText={setSize}
          placeholder={"Tamanho"}
        />
        <TextInput
          type={"text"}
          style={styles.inputSizeAndColor}
          value={color}
          onChangeText={setColor}
          placeholder={"Cor"}
        />
      </View>
      <View style={styles.genderContainer}>
        {["Masculina", "Feminina", "Unissex"].map((genderOption) => (
          <Checkbox
            key={genderOption}
            label={genderOption}
            isSelected={gender === genderOption}
            onToggle={() => setGender(gender === genderOption ? "" : genderOption)}
          />
        ))}
      </View>

      <InputField
        type={"text"}
        value={condition}
        onChangeText={setCondition}
        placeholder={"Estado de Uso"}
        style={styles.input}
      />

      <View style={styles.seasonContainer}>
        {["Verão", "Inverno"].map((seasonOption) => (
          <Checkbox
            key={seasonOption}
            label={seasonOption}
            isSelected={season === seasonOption}
            onToggle={() => handleCheckbox(seasonOption)}
          />
        ))}
      </View>
      {/* {image && <Image source={{ uri: image }} style={styles.previewImage} />} */}
      <TouchableOpacity style={styles.addButton} onPress={handleImagePicker}>
        <Icon name="upload" size={20} color="#000" style={styles.iconStyle} />
        <Text style={styles.buttonInsideImagePreview}>Adicionar Fotos</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          width={330}
          height={43}
          fontSize={20}
          borderRadius={18}
          name="Cadastrar Roupa"
          onPress={() => handleAddClothing()}
        />
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
  title: {
    marginTop: 120,
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 21,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  sizeAndColorInputs: {
    flexDirection: "row",
    gap: 20,
    marginTop: 17,
  },
  inputSizeAndColor: {
    width: 152,
    height: 43,
    backgroundColor: "#fff",
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 20,
    fontSize: 22,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 4,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  seasonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
  },
  checkboxSelected: {
    backgroundColor: "#ddd",
  },
  checkboxIcon: {
    fontSize: 13,
    color: "#000",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.5)",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 287,
    height: 91,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  iconStyle: {
    marginRight: 8,
  },
  buttonInsideImagePreview: {
    fontSize: 20,
    fontWeight: "500",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default RegisterClothingScreen;
