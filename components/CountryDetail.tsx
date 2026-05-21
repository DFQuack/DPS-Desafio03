import { View, Text } from "react-native";

interface CountryDetailProps {
  property: string;
  value: string;
}

// Componente para mostrar los detalles del país en country-details.tsx
export default function CountryDetail({ property, value }: CountryDetailProps) {
  return (
    <View className="mb-4 p-2 border-b border-gray-200">
      <Text className="text-lg font-semibold text-blue-500">
        {property}
      </Text>
      <Text className="text-base text-gray-900">{value}</Text>
    </View>
  );
};