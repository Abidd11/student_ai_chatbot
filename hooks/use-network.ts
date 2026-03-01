import { useEffect, useState } from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

export function useNetwork() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial connection status
    const checkConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected ?? false);
      } catch (error) {
        console.error("Failed to check network status:", error);
        setIsConnected(true); // Default to connected if check fails
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();

    // Subscribe to connection changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, isLoading };
}
