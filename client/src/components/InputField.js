import React from "react";
import { TextInput, StyleSheet } from "react-native";

const InputField = ({ type, value, onChangeText, placeholder, secure }) => {
  return (
    <TextInput
      type={type}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(0, 0, 0, 0.5)"
      secureTextEntry={secure}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 324,
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
});

export default InputField;
