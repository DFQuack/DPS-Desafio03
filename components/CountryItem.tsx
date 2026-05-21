import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  cca2: string;
}

interface CountryItemProps {
  country: Country;
  onPress?: () => void;
}

// Componente para mostrar cada país en la lista
const CountryItem = memo(function CountryItem({ country, onPress }: CountryItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="border-b border-gray-200 py-4 px-4 active:bg-gray-100"
    >
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: country.flags.png }}
          style={{ width: 72, height: 48, borderRadius: 4 }}
          contentFit="cover"
        />
        <Text className="flex-1 text-lg font-semibold text-gray-800">
          {country.name.common}
        </Text>
      </View>
    </Pressable>
  );
});

export default CountryItem;
