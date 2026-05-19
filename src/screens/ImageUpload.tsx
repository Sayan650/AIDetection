// src/screens/ImageUploadScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ImageUploadScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Disease Image</Text>
      <Button
        title="Upload Image"
        onPress={() => alert("Image picker coming soon")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  title: { fontSize: 20, color: "#f1f5f9", marginBottom: 20 },
});
