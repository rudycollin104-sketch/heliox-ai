import { useColors } from "@/hooks/use-colors";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ShareMenuProps {
  visible: boolean;
  onClose: () => void;
  conversationTitle: string;
  conversationText: string;
}

export function ShareMenu({
  visible,
  onClose,
  conversationTitle,
  conversationText,
}: ShareMenuProps) {
  const colors = useColors();
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(conversationText);
    setCopied(true);
    Alert.alert("✅", "Conversation copiée dans le presse-papiers");
    setTimeout(() => setCopied(false), 2000);
    onClose();
  };

  const handleExportMarkdown = async () => {
    const markdown = `# ${conversationTitle}\n\n${conversationText}\n\n---\n*Exporté depuis Heliox AI*`;
    await Clipboard.setStringAsync(markdown);
    Alert.alert("✅", "Conversation en Markdown copiée");
    onClose();
  };

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(conversationText, {
        mimeType: "text/plain",
        dialogTitle: `Partager ${conversationTitle}`,
      });
      Alert.alert("✅", "Conversation partagée avec succès");
      onClose();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de partager la conversation");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Partager & Exporter</Text>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: colors.background },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleCopyToClipboard}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>
                Copier le texte
              </Text>
              <Text style={[styles.menuDesc, { color: colors.muted }]}>
                Copier la conversation
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: colors.background },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleExportMarkdown}
          >
            <Text style={styles.menuIcon}>📄</Text>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>
                Exporter en Markdown
              </Text>
              <Text style={[styles.menuDesc, { color: colors.muted }]}>
                Format texte formaté
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: colors.background },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleShare}
          >
            <Text style={styles.menuIcon}>🔗</Text>
            <View style={styles.menuContent}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>
                Partager
              </Text>
              <Text style={[styles.menuDesc, { color: colors.muted }]}>
                Via SMS, Email, etc.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.closeBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85 },
            ]}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>Fermer</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  menu: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  menuIcon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  menuDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
