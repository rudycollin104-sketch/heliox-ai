import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export function useCloudFavorites() {
  const [cloudFavorites, setCloudFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const listFavorites = trpc.favorites.list.useQuery();
  const addFavorite = trpc.favorites.add.useMutation();
  const removeFavorite = trpc.favorites.remove.useMutation();

  useEffect(() => {
    if (listFavorites.data) {
      setCloudFavorites(listFavorites.data.map((fav) => fav.toolId));
    }
  }, [listFavorites.data]);

  const handleAddFavorite = async (toolId: string) => {
    setIsLoading(true);
    try {
      await addFavorite.mutateAsync({ toolId });
      setCloudFavorites((prev) => [...prev, toolId]);
    } catch (error) {
      console.error("Failed to add favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (toolId: string) => {
    setIsLoading(true);
    try {
      await removeFavorite.mutateAsync({ toolId });
      setCloudFavorites((prev) => prev.filter((id) => id !== toolId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (toolId: string) => cloudFavorites.includes(toolId);

  return {
    cloudFavorites,
    isLoading,
    isFavorite,
    addFavorite: handleAddFavorite,
    removeFavorite: handleRemoveFavorite,
  };
}
