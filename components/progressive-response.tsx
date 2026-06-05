import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface ProgressiveResponseProps {
  content: string;
  isComplete: boolean;
  themeColor?: string;
}

export function ProgressiveResponse({ content, isComplete, themeColor = "#06b6d4" }: ProgressiveResponseProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!isComplete && charIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 15); // Vitesse d'affichage (ms par caractère)

      return () => clearTimeout(timer);
    } else if (isComplete && displayedContent !== content) {
      setDisplayedContent(content);
    }
  }, [charIndex, content, isComplete, displayedContent]);

  return (
    <Animated.View entering={FadeInUp}>
      <LinearGradient
        colors={["rgba(34, 197, 94, 0.1)", "rgba(59, 130, 246, 0.1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl rounded-bl-none px-4 py-3 border border-cyan-500/40 bg-cyan-900/10"
      >
        <Text className="text-base text-cyan-100 leading-6">
          {displayedContent}
          {!isComplete && <Text className="text-cyan-400 animate-pulse">▌</Text>}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}
