import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

interface StreamingResponseProps {
  content: string;
  isStreaming: boolean;
  color: string;
}

export function StreamingResponse({ content, isStreaming, color }: StreamingResponseProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content);
      return;
    }

    if (charIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 10); // 10ms per character for smooth streaming effect

      return () => clearTimeout(timer);
    }
  }, [charIndex, content, isStreaming]);

  useEffect(() => {
    if (!isStreaming) {
      setCharIndex(0);
      setDisplayedContent("");
    }
  }, [isStreaming, content]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>
        {displayedContent}
        {isStreaming && charIndex < content.length && (
          <Text style={[styles.cursor, { color }]}>▌</Text>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  cursor: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 2,
  },
});
