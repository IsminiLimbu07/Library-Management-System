import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "borrower",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return 'Please fill in all required fields';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      if (response.status === 201) {
        const data = response.data;
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/home/homePage");
      }
    } catch (error) {
      setError(error?.response?.data?.error || "Registration failed");
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
              Create your account
            </Text>
            <View className="mt-2 flex-row items-center">
              <Text className="text-sm text-gray-600">Or </Text>
              <Link href="/auth/login" className="text-sm font-medium text-library-primary">
                sign in to your existing account
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
              {/* Name Field */}
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base bg-white"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
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

              {/* Email Field */}
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  Email address *
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
                  Password *
                </Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base bg-white"
                  placeholder="Enter your password (min 6 characters)"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-3 text-base bg-white"
                  placeholder="Confirm your password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, confirmPassword: text }))
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

              {/* Role Selection */}
              <View>
                <Text className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </Text>
                <View className="border border-gray-300 rounded-md bg-white" style={{ borderColor: '#D8DBD8' }}>
                  <Picker
                    selectedValue={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                    style={{ height: 48, color: '#2C4A7E' }}
                  >
                    <Picker.Item label="Borrower" value="borrower" />
                    <Picker.Item label="Librarian" value="librarian" />
                  </Picker>
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Choose 'Borrower' to borrow books, or 'Librarian' to manage the library
                </Text>
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
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-base font-medium">Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default register;