import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please provide email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use your deployed backend URL
      const response = await axios.post("https://library-management-system-7evp.onrender.com/api/auth/login", formData);
      
      if (response.status === 200) {
        const data = response.data;
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/home/homePage");
      }
    } catch (error) {
      setError(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center py-12 px-4">
        <View className="w-full max-w-md">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-12 h-12 bg-library-primary rounded-full items-center justify-center mb-6">
              <Text className="text-white text-2xl">📚</Text>
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 text-center">
              Sign in to your account
            </Text>
            <View className="mt-2 flex-row items-center">
              <Text className="text-sm text-gray-600">Or </Text>
              <Link href="/auth/register" className="text-sm font-medium text-library-primary">
                create a new account
              </Link>
            </View>
          </View>

          {/* Form */}
          <View className="bg-white rounded-lg p-6 shadow-lg">
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <Text className="text-red-600 text-sm text-center">{error}</Text>
              </View>
            ) : null}

            <View className="space-y-4">
              {/* Email Field */}
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base bg-white"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, email: text }))
                  }
                  style={{
                    fontSize: 16,
                    minHeight: 48,
                    borderColor: '#D8DBD8',
                    backgroundColor: '#FFFFFF',
                    color: '#2C4A7E',
                  }}
                />
              </View>

              {/* Password Field */}
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base bg-white"
                  placeholder="Enter your password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  autoComplete="current-password"
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, password: text }))
                  }
                  style={{
                    fontSize: 16,
                    minHeight: 48,
                    borderColor: '#D8DBD8',
                    backgroundColor: '#FFFFFF',
                    color: '#2C4A7E',
                  }}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="w-full rounded-md py-3 px-4 mt-6 items-center justify-center"
              style={{
                backgroundColor: '#2C4A7E',
                minHeight: 48,
                shadowColor: '#2C4A7E',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-base font-medium">Sign in</Text>
              )}
            </TouchableOpacity>

            {/* Demo Accounts Info */}
            <View className="mt-6 p-3 bg-gray-50 rounded-md">
              <Text className="text-sm text-gray-600 text-center">
                Demo accounts:{'\n'}
                Librarian: librarian@demo.com / password123{'\n'}
                Borrower: borrower@demo.com / password123
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default login;