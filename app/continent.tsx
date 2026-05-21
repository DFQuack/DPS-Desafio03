import CountryItem from "@/components/CountryItem";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  cca2: string;
  continents: string[];
}

export default function ContinentScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca2,continents"
        );
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();

        // Filter by selected continent
        const filtered = data
          .filter((c: Country) => c.continents.includes(name))
          .sort((a: Country, b: Country) =>
            a.name.common.localeCompare(b.name.common)
          );

        setCountries(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchCountries();
    }
  }, [name]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 bg-blue-500 px-4 py-3">
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-2xl font-bold flex-1">{name}</Text>
        <Text className="text-white text-sm">({countries.length})</Text>
      </View>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.cca2}
        renderItem={({ item }) => (
          <CountryItem
            country={item}
            onPress={() => {
              router.push({
                pathname: "/country-details" as any,
                params: { cca2: item.cca2 },
              });
            }}
          />
        )}
      />
    </View>
  );
}
