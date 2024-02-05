import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const ChatMessage = ({ message, isCurrentUserSender }) => {
  const screenWidth = Dimensions.get("window").width;
  const halfScreenWidth = screenWidth * 0.5;

  const messageAlignment = isCurrentUserSender
    ? styles.currentUserMessage
    : styles.otherUserMessage;

  return (
    <View style={[styles.messageContainer, messageAlignment, { maxWidth: halfScreenWidth }]}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    marginVertical: 8,
  },
  currentUserMessage: {
    backgroundColor: "rgba(217, 217, 217, 0.5)",
    alignSelf: "flex-end",
    marginRight: 20,
  },
  otherUserMessage: {
    backgroundColor: "rgba(217, 217, 217, 0.5)",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  messageText: {
    fontSize: 18,
    color: "#000",
  },
});

export default ChatMessage;
