import React from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: StatusBar.currentHeight,
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 95,
    resizeMode: "contain",
  },
});

export default Header;
