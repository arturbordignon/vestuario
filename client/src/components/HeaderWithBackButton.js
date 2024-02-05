import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";

const HeaderWithBackButton = ({ navigation }) => {
  const scaledWidth = 213 * 0.8;
  const scaledHeight = 108 * 0.8;

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={require("../../assets/back-icon.png")} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: scaledWidth, height: scaledHeight, resizeMode: "contain" }}
        />
      </View>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: StatusBar.currentHeight,
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 23,
    height: 23,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 23,
    height: 23,
    padding: 10,
    opacity: 0,
  },
});

export default HeaderWithBackButton;
