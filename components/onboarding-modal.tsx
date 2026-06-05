import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ONBOARDING_KEY = "@heliox_onboarding_done";
const { width } = Dimensions.get("window");

const SLIDES = [
  {
    emoji: "🤖",
    title: "Bienvenue sur Heliox AI",
    description:
      "Votre univers IA tout-en-un. Accédez à 25+ outils intelligents pour booster votre créativité et productivité.",
    color: "#6C3CE1",
  },
  {
    emoji: "🎵✍️🎮",
    title: "25+ Outils IA Puissants",
    description:
      "Musique, écriture, jeux RPG, création visuelle, productivité, apprentissage et bien plus encore.",
    color: "#00D4FF",
  },
  {
    emoji: "⚡",
    title: "Prêt à commencer ?",
    description:
      "Explorez les catégories, ajoutez vos outils favoris et commencez à créer avec l'IA dès maintenant !",
    color: "#FF6B6B",
  },
];

export function OnboardingModal() {
  const colors = useColors();
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const done = await AsyncStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      setVisible(true);
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setVisible(false);
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  if (!visible) return null;

  const slide = SLIDES[currentSlide];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Slide Content */}
          <View style={[styles.slideContent, { backgroundColor: slide.color + "15" }]}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
          </View>

          <View style={styles.textContent}>
            <Text style={[styles.slideTitle, { color: colors.foreground }]}>{slide.title}</Text>
            <Text style={[styles.slideDesc, { color: colors.muted }]}>{slide.description}</Text>
          </View>

          {/* Dots */}
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === currentSlide ? colors.primary : colors.border,
                    width: i === currentSlide ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            {currentSlide < SLIDES.length - 1 && (
              <Pressable
                style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.7 }]}
                onPress={handleFinish}
              >
                <Text style={[styles.skipText, { color: colors.muted }]}>Passer</Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.nextBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextText}>
                {currentSlide === SLIDES.length - 1 ? "Commencer 🚀" : "Suivant →"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 28,
    overflow: "hidden",
    padding: 24,
    gap: 20,
  },
  slideContent: {
    height: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  slideEmoji: { fontSize: 72 },
  textContent: { gap: 8 },
  slideTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  slideDesc: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  skipBtn: { padding: 12 },
  skipText: { fontSize: 15 },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
