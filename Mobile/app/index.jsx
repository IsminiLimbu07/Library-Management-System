import { Text, View, ActivityIndicator } from "react-native";
import "../global.css"; 
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/auth/login");
          return;
        }

        // Verify token with your backend's /api/auth/me endpoint
        // Use your deployed backend URL
        const response = await axios.get("https://library-management-system-7evp.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          // Update user data in AsyncStorage
          await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          router.replace("/home/homePage");
        } else {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        // Clear invalid tokens
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#F5F6F5' }}>
        <View className="items-center">
          <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#2C4A7E' }}>
            <Text className="text-white text-3xl">📚</Text>
          </View>
          <ActivityIndicator size="large" color="#2C4A7E" />
          <Text className="mt-4 text-base" style={{ color: '#6B7280' }}>
            Loading BookSphere...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#F5F6F5' }}>
      <Text className="text-base" style={{ color: '#6B7280' }}>
        Redirecting...
      </Text>
    </View>
  )
}