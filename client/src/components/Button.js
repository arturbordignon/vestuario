import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ width, height, fontSize, borderRadius, name, onPress, style }) => {
  const dynamicStyles = StyleSheet.create({
    button: {
      width: width,
      height: height,
      backgroundColor: "#2182DB",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: borderRadius,
      ...style,
    },
    text: {
      fontSize: fontSize,
      color: "#FFFFFF",
      fontFamily: "Inter-Regular",
    },
  });

  return (
    <TouchableOpacity style={dynamicStyles.button} onPress={onPress}>
      <Text style={dynamicStyles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

export default Button;
