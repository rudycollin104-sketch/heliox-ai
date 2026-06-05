import { AI_TOOLS } from "@/constants/ai-tools";
import { useMemo } from "react";

export function useSearch(query: string) {
  const results = useMemo(() => {
    if (!query.trim()) return AI_TOOLS;

    const lowerQuery = query.toLowerCase();
    return AI_TOOLS.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return results;
}
