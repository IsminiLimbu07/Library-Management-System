import { Text, View } from "react-native";
import "../global.css"; 
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/auth/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          router.replace("/home/homePage");
        }
      } catch (error) {
        console.error(error);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/auth/login");
      }
    };
    verifyToken();
  }, [router]);

  return (
    <View>
      <Text>Hello world</Text>
    </View>
  );
}
