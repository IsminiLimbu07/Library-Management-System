import { View, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const homePage = () => {
  return (
    <View className="flex-1 bg-blue-600 flex flex-col">
      <View className="w-full h-[100px] flex flex-row p-5">
        <Icon name="align-left" size={40} color={"#fff"}></Icon>
        <Text className='text-white font-semibold w-full text-center text-2xl'> HRMS ENRICHMENT</Text>
      </View>

      <View className="w-full h-full bg-white rounded-[40px] grid grid-cols-2 p-6 gap-4 place-items-center">
        <View className="w-[95%] h-[180px] rounded-2xl flex flex-col p-5 gap-3 justify-center shadow-lg shadow-slate-400">
          <View className="w-[60px] h-[60px] bg-purple-500 rounded-xl flex items-center justify-center">
            <Icon name="user" size={45} color="#fff"></Icon>
          </View>
          <View className="w-full flex felx-col">
            <Text className="text-xl text-black">Employee</Text>
            <Text className="text-xl text-black">Management</Text>
          </View>
        </View>

        <View className="w-[95%] h-[180px] rounded-2xl flex flex-col p-5 gap-3 gap-y-5 justify-center shadow-lg shadow-slate-400">
          <View className="w-[60px] h-[60px] bg-blue-500 rounded-xl flex items-center justify-center">
            <Icon name="plane" size={45} color="#fff"></Icon>
          </View>
          <View className="w-full flex felx-col">
            <Text className="text-xl text-black">Leave</Text>
            <Text className="text-xl text-black">Management</Text>
          </View>
        </View>

        <View className="w-[95%] h-[180px] rounded-2xl flex flex-col p-5 gap-3 justify-center shadow-lg shadow-slate-400">
          <View className="w-[60px] h-[60px] bg-green-500 rounded-xl flex items-center justify-center">
            <Icon name="money" size={45} color="#fff"></Icon>
          </View>
          <View className="w-full flex felx-col">
            <Text className="text-xl text-black">PayRoll</Text>
            <Text className="text-xl text-black">Management</Text>
          </View>
        </View>

        <View className="w-[95%] h-[180px] rounded-2xl flex flex-col p-5 gap-3 gap-y-5 justify-center shadow-lg shadow-slate-400">
          <View className="w-[60px] h-[60px] bg-yellow-500 rounded-xl flex items-center justify-center">
            <Icon name="calendar" size={45} color="#fff"></Icon>
          </View>
          <View className="w-full flex felx-col">
            <Text className="text-xl text-black">Attendance</Text>
            <Text className="text-xl text-black">Management</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default homePage;