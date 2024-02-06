import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import {
  fetchClothingById,
  updateClothingForAdmin,
  deleteClothingForAdmin,
} from "../../services/api";
import Button from "../../components/Button";
import HeaderWithBackButton from "../../components/HeaderWithBackButton";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import InputField from "../../components/InputField";

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

const EditClothingScreen = ({ route, navigation }) => {
  const { clothingId } = route.params;
  const { user } = useContext(AuthContext);
  const [clothingData, setClothingData] = useState({
    title: "",
    size: "",
    color: "",
    condition: "",
    gender: "",
    season: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClothingById(clothingId);

        if (response) {
          setClothingData({
            title: response.title || "",
            size: response.size || "",
            color: response.color || "",
            condition: response.condition || "",
            gender: response.gender || "",
            season: response.season || "",
            image: response.image || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar os dados da roupa:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token && clothingId) {
      fetchData();
    }
  }, [clothingId, user?.token]);

  const handleSave = async () => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("title", clothingData.title);
    formData.append("size", clothingData.size);
    formData.append("color", clothingData.color);
    formData.append("condition", clothingData.condition);
    formData.append("gender", clothingData.gender);
    formData.append("season", clothingData.season);

    if (clothingData.image.includes("file://")) {
      formData.append("image", {
        uri: clothingData.image,
        type: "image/jpeg",
        name: "updated-clothing.jpg",
      });
    }

    try {
      const response = await updateClothingForAdmin(clothingId, formData, user.token);
      if (response && response.status === "Sucesso") {
        alert("Roupa editada com sucesso.");
        navigation.goBack();
      } else {
        alert("Erro ao editar roupa.");
      }
    } catch (error) {
      console.error("Erro ao editar roupa:", error);
      alert("Erro ao tentar salvar as alterações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteClothingForAdmin(clothingId, user.token);
      console.log(response);
      if (response.status === "Sucesso") {
        alert("Roupa excluída com sucesso.");
        navigation.navigate("RegisteredClothingListScreen");
      } else {
        alert("Erro ao excluir roupa.");
      }
    } catch (error) {
      console.error("Erro ao excluir roupa:", error);
    } finally {
      setIsLoading(false);
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
      setClothingData({ ...clothingData, image: result.assets[0].uri });
    }
  };

  if (isLoading || !clothingData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const toggleCheckbox = (option, type) => {
    setClothingData((prevData) => ({
      ...prevData,
      [type]: prevData[type] === option ? "" : option,
    }));
  };

  const renderImage = () => {
    if (clothingData.image) {
      return <Image source={{ uri: clothingData.image }} style={styles.clothingImage} />;
    }
    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderWithBackButton navigation={navigation} style={styles.logo} />
      <Text style={styles.title}>Editar Roupa</Text>

      <Text style={styles.subtitle}>Faça uma modificação ou exclua a roupa de listagem</Text>

      <InputField
        type="text"
        value={clothingData.title}
        onChangeText={(text) => setClothingData({ ...clothingData, title: text })}
        placeholder="Título"
        style={styles.input}
      />

      <View style={styles.sizeAndColorInputs}>
        <TextInput
          type="text"
          style={styles.inputSizeAndColor}
          value={clothingData.size}
          onChangeText={(size) => setClothingData({ ...clothingData, size })}
          placeholder="Tamanho"
        />
        <TextInput
          type="text"
          style={styles.inputSizeAndColor}
          value={clothingData.color}
          onChangeText={(color) => setClothingData({ ...clothingData, color })}
          placeholder="Cor"
        />
      </View>

      <View style={styles.genderContainer}>
        {["Masculina", "Feminina", "Unissex"].map((genderOption) => (
          <Checkbox
            key={genderOption}
            label={genderOption}
            isSelected={clothingData.gender === genderOption}
            onToggle={() => toggleCheckbox(genderOption, "gender")}
          />
        ))}
      </View>

      <InputField
        type="text"
        value={clothingData.condition}
        onChangeText={(condition) => setClothingData({ ...clothingData, condition })}
        placeholder="Estado de Uso"
        style={styles.input}
      />

      <View style={styles.seasonContainer}>
        {["Verão", "Inverno"].map((seasonOption) => (
          <Checkbox
            key={seasonOption}
            label={seasonOption}
            isSelected={clothingData.season === seasonOption}
            onToggle={() => toggleCheckbox(seasonOption, "season")}
          />
        ))}
      </View>

      <View style={styles.imageEdit}>
        {renderImage()}
        <TouchableOpacity style={styles.addButton} onPress={handleImagePicker}>
          <Icon name="upload" size={20} color="#000" style={styles.iconStyle} />
          <Text style={styles.buttonInsideImagePreview}>Alterar Foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsSaveAndDelete}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button
            width={308}
            height={40}
            fontSize={20}
            borderRadius={18}
            backgroundColor="#2182DB"
            name="Salvar Edição"
            onPress={() => handleSave()}
          />
        )}

        <Button
          width={308}
          height={40}
          fontSize={20}
          borderRadius={18}
          style={{ backgroundColor: "#C50C0C" }}
          name="Excluir Roupa"
          onPress={() => handleDelete()}
        />
      </View>
    </ScrollView>
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
  clothingImage: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 8,
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
  imageEdit: {
    flexDirection: "row",
    gap: 25,
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
    width: 212,
    height: 91,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  iconStyle: {
    marginRight: 8,
  },
  buttonInsideImagePreview: {
    fontSize: 17,
    fontWeight: "400",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  buttonsSaveAndDelete: {
    gap: 12,
  },
});

export default EditClothingScreen;
