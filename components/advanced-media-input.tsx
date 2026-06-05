import React, { useState } from "react";
import { View, Text, Pressable, Modal, ScrollView, ActivityIndicator, TextInput, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Image as ExpoImage } from "expo-image";

interface AdvancedMediaInputProps {
  onImageSelected?: (uri: string, type: "photo" | "video") => void;
  onDocumentSelected?: (uri: string, name: string, type: string) => void;
  onLinkAdded?: (url: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function AdvancedMediaInput({
  onImageSelected,
  onDocumentSelected,
  onLinkAdded,
  visible,
  onClose,
}: AdvancedMediaInputProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ uri: string; type: "photo" | "video" } | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [linkInput, setLinkInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"media" | "documents" | "links">("media");

  // Caméra - Photos
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
        setSelectedMedia({ uri, type: "photo" });
        onImageSelected?.(uri, "photo");
        onClose();
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Caméra - Vidéos
  const handleRecordVideo = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setSelectedMedia({ uri, type: "video" });
        onImageSelected?.(uri, "video");
        onClose();
      }
    } catch (error) {
      console.error("Error recording video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Galerie - Images et Vidéos
  const handlePickMedia = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const type = asset.type === "video" ? "video" : "photo";
        setSelectedMedia({ uri: asset.uri, type });
        onImageSelected?.(asset.uri, type);
        onClose();
      }
    } catch (error) {
      console.error("Error picking media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Documents
  const handlePickDocument = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
      });

      if (!result.canceled) {
        const doc = result.assets[0];
        const newDoc = { uri: doc.uri, name: doc.name, type: doc.mimeType || "unknown" };
        setSelectedDocuments([...selectedDocuments, newDoc]);
        onDocumentSelected?.(doc.uri, doc.name, doc.mimeType || "unknown");
      }
    } catch (error) {
      console.error("Error picking document:", error);
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

  const removeDocument = (index: number) => {
    setSelectedDocuments(selectedDocuments.filter((_, i) => i !== index));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.95)", "rgba(15, 23, 42, 0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderTopColor: "rgba(6, 182, 212, 0.3)", maxHeight: "80%" }}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "rgba(139, 92, 246, 0.2)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#06b6d4" }}>Ajouter un média</Text>
            <Pressable onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ fontSize: 24, color: "#06b6d4" }}>✕</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(139, 92, 246, 0.2)" }}>
            {["media", "documents", "links"].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as any)}
                style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? "#06b6d4" : "transparent" }}
              >
                <Text style={{ textAlign: "center", color: activeTab === tab ? "#06b6d4" : "#64748b", fontWeight: activeTab === tab ? "700" : "500" }}>
                  {tab === "media" ? "📸 Médias" : tab === "documents" ? "📄 Documents" : "🔗 Liens"}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView style={{ maxHeight: 400, paddingHorizontal: 24, paddingVertical: 16 }}>
            {/* Media Tab */}
            {activeTab === "media" && (
              <View>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>📸 Caméra</Text>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
                  <Pressable
                    onPress={handleTakePhoto}
                    disabled={isLoading}
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)", opacity: isLoading ? 0.5 : 1 }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#06b6d4" />
                    ) : (
                      <Text style={{ textAlign: "center", color: "#06b6d4", fontWeight: "600" }}>📷 Photo</Text>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={handleRecordVideo}
                    disabled={isLoading}
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)", opacity: isLoading ? 0.5 : 1 }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#8b5cf6" />
                    ) : (
                      <Text style={{ textAlign: "center", color: "#c084fc", fontWeight: "600" }}>🎥 Vidéo</Text>
                    )}
                  </Pressable>
                </View>

                <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>📱 Galerie</Text>
                <Pressable
                  onPress={handlePickMedia}
                  disabled={isLoading}
                  style={{ paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)", opacity: isLoading ? 0.5 : 1, marginBottom: 24 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#06b6d4" />
                  ) : (
                    <Text style={{ textAlign: "center", color: "#06b6d4", fontWeight: "600" }}>Sélectionner</Text>
                  )}
                </Pressable>

                {selectedMedia && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>Aperçu</Text>
                    <ExpoImage
                      source={{ uri: selectedMedia.uri }}
                      style={{ width: "100%", height: 192, borderRadius: 8, borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)" }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <View>
                <Pressable
                  onPress={handlePickDocument}
                  disabled={isLoading}
                  style={{ paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)", marginBottom: 16, opacity: isLoading ? 0.5 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#06b6d4" />
                  ) : (
                    <Text style={{ textAlign: "center", color: "#06b6d4", fontWeight: "600" }}>+ Ajouter un document</Text>
                  )}
                </Pressable>

                {selectedDocuments.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#c084fc", marginBottom: 12 }}>Documents sélectionnés</Text>
                    <FlatList
                      data={selectedDocuments}
                      keyExtractor={(_, i) => i.toString()}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(139, 92, 246, 0.2)" }}>
                          <Text style={{ color: "#06b6d4", flex: 1, fontSize: 12 }} numberOfLines={1}>
                            📄 {item.name}
                          </Text>
                          <Pressable onPress={() => removeDocument(index)} style={{ padding: 8 }}>
                            <Text style={{ color: "#ef4444" }}>✕</Text>
                          </Pressable>
                        </View>
                      )}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Links Tab */}
            {activeTab === "links" && (
              <View>
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
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}
