import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

const CONTINENTS = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContinentPress = (continent: string) => {
    router.push({
      pathname: "/continent",
      params: { name: continent },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-500 px-4 py-3">
        <Text className="text-white text-2xl font-bold">Select a Continent</Text>
      </View>
      <FlatList
        data={CONTINENTS}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleContinentPress(item)}
            className="mb-3 rounded-lg bg-blue-100 p-4 active:bg-blue-200"
          >
            <Text className="text-center text-lg font-semibold text-blue-900">
              {item}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}