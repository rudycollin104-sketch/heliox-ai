import React, { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";

interface MediaInputProps {
  onImageSelected?: (uri: string) => void;
  onLinkAdded?: (url: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function MediaInput({ onImageSelected, onLinkAdded, visible, onClose }: MediaInputProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        onImageSelected?.(uri);
        onClose();
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        onImageSelected?.(uri);
        onClose();
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      onLinkAdded?.(linkInput);
      setLinkInput("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.95)", "rgba(15, 23, 42, 0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderTopColor: "rgba(6, 182, 212, 0.3)" }}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "rgba(139, 92, 246, 0.2)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#06b6d4" }}>Ajouter un média</Text>
            <Pressable onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ fontSize: 24, color: "#06b6d4" }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 400, paddingHorizontal: 24, paddingVertical: 16 }}>
            {/* Image Options */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>📸 Images</Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable
                  onPress={handlePickImage}
                  disabled={isLoading}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)", opacity: isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#06b6d4" />
                  ) : (
                    <Text style={{ textAlign: "center", color: "#06b6d4", fontWeight: "600" }}>Galerie</Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={handleTakePhoto}
                  disabled={isLoading}
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)", opacity: isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#8b5cf6" />
                  ) : (
                    <Text style={{ textAlign: "center", color: "#c084fc", fontWeight: "600" }}>Caméra</Text>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Link Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>🔗 Lien</Text>
              <View style={{ borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "rgba(15, 23, 42, 0.5)" }}>
                <Text style={{ fontSize: 12, color: "rgba(139, 92, 246, 0.6)", marginBottom: 8 }}>Entrez une URL</Text>
                <TextInput
                  placeholder="https://..."
                  placeholderTextColor="#64748b"
                  value={linkInput}
                  onChangeText={setLinkInput}
                  style={{ color: "#06b6d4", fontSize: 16 }}
                />
              </View>
              <Pressable
                onPress={handleAddLink}
                disabled={!linkInput.trim()}
                style={{ marginTop: 12, paddingVertical: 12, borderRadius: 8, backgroundColor: linkInput.trim() ? "rgba(6, 182, 212, 0.8)" : "rgba(6, 182, 212, 0.3)" }}
              >
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>Ajouter le lien</Text>
              </Pressable>
            </View>

            {/* Preview */}
            {selectedImage && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>Aperçu</Text>
                <ExpoImage
                  source={{ uri: selectedImage }}
                  style={{ width: "100%", height: 192, borderRadius: 8, borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)" }}
                />
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}
