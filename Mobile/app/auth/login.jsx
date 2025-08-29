import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    console.log("Form Data: ", formData);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      // Updated to match your server.js endpoint: /api/auth/login
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      console.log(response);

      if (response.status === 200) {
        const data = response?.data;
        const token = data?.token;
        const user = data?.user;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        router.replace("/");
      }
      
    } catch (error) {
      // Updated error handling to match your backend response structure
      setError(error?.response?.data?.error || error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <View className="flex-1 flex-col items-center gap-4 px-6">
      <Text className="text-xl font-bold color-red-900 ">Welcome Back</Text>
      <View className="flex flex-col gap-2 w-full">
        <Text className="text-lg">Email</Text>
        <TextInput
          className="border p-2 rounded-md"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
        />

        <Text className="text-lg">Password</Text>
        <TextInput
          className="border p-2 rounded-md"
          placeholder="*******"
          autoCapitalize="none"
          secureTextEntry={true}
          value={formData.password}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, password: text }))
          }
        />

        {error && <Text className="text-red-800">{error}</Text>}
      </View>

      {/* Login Button */}
      <TouchableOpacity 
        className="bg-red-200 p-1 rounded-md w-full"
        onPress={handleLogin}
      >
        <Text className="text-center text-lg font-semibold color-red-950"> Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default login;