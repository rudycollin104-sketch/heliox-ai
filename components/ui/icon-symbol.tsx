// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Heliox AI
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "safari.fill": "explore",
  "heart.fill": "favorite",
  "gearshape.fill": "settings",
  // Actions
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "plus": "add",
  "magnifyingglass": "search",
  "arrow.left": "arrow-back",
  "square.and.arrow.up": "share",
  "doc.on.doc": "content-copy",
  "trash": "delete",
  "star.fill": "star",
  "star": "star-border",
  // Categories
  "music.note": "music-note",
  "pencil": "edit",
  "gamecontroller.fill": "sports-esports",
  "paintbrush.fill": "brush",
  "briefcase.fill": "work",
  "book.fill": "menu-book",
  "airplane": "flight",
  "cpu": "memory",
  // Tools
  "mic.fill": "mic",
  "waveform": "graphic-eq",
  "text.bubble.fill": "chat",
  "globe": "language",
  "chart.bar.fill": "bar-chart",
  "video.fill": "videocam",
  "person.fill": "person",
  "bolt.fill": "bolt",
  "sparkles": "auto-awesome",
  "wand.and.stars": "auto-fix-high",
  // UI
  "checkmark": "check",
  "info.circle": "info",
  "exclamationmark.triangle": "warning",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",
  "clock.fill": "history",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
