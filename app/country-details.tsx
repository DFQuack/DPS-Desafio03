import CountryDetail from "@/components/CountryDetail";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from 'react-native-maps';

const OPENWEATHER_API_KEY = "d491973e77a25cd4c10db6638c949c43";

interface DetailedCountry {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  cca2: string;
  capital?: string[];
  continents: string[];
  population: number;
  area: number;
  region: string;
  subregion?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  timezones?: string[];
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  latitude: number;
  longitude: number;
}

export default function CountryDetails() {
  const { cca2 } = useLocalSearchParams<{ cca2: string }>();
  const router = useRouter();
  const [country, setCountry] = useState<DetailedCountry | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${cca2}`
        );
        if (!response.ok) throw new Error("Failed to fetch country details");
        const data = await response.json();
        setCountry(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (cca2) {
      fetchCountry();
    }
  }, [cca2]);

  // Carga clima de la capital
  useEffect(() => {
    const fetchWeather = async () => {
      if (!country?.capital?.[0]) return;

      setWeatherLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();

        setWeather({
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          latitude: data.coord.lat,
          longitude: data.coord.lon
        });
      } catch (err) {
        console.log("Weather fetch error:", err);
        // Falla silenciosamente
      } finally {
        setWeatherLoading(false);
      }
    };

    if (country) {
      fetchWeather();
    }
  }, [country]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !country) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600 text-lg">{error || "Country not found"}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 bg-blue-500 px-4 py-3">
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold flex-1 truncate">
          {country.name.common}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Bandera */}
        <View className="mb-6 items-center">
          <Image
            source={{ uri: country.flags.png }}
            style={{ width: 200, height: 120, borderRadius: 8 }}
            contentFit="cover"
          />
        </View>

        {/* Nombre oficial */}
        <CountryDetail property="Official Name" value={country.name.official} />

        {/* Capital */}
        {country.capital && (
          <CountryDetail property="Capital" value={country.capital.join(", ")} />
        )}

        {/* Región */}
        <CountryDetail property="Region" value={`${country.region}${country.subregion ? ` - ${country.subregion}` : ""}`} />

        {/* Población */}
        <CountryDetail property="Population" value={country.population.toLocaleString()} />

        {/* Área */}
        <CountryDetail property="Area" value={`${country.area.toLocaleString()} km²`} />

        {/* Idiomas */}
        {country.languages && Object.keys(country.languages).length > 0 && (
          <CountryDetail property="Languages" value={Object.values(country.languages).join(", ")} />
        )}

        {/* Monedas */}
        {country.currencies && Object.keys(country.currencies).length > 0 && (
          <CountryDetail property="Currencies" value={Object.entries(country.currencies).map(([code, curr]: [string, any]) => `${curr.name} (${curr.symbol || code})`).join(", ")} />
        )}

        {/* Continentes */}
        <CountryDetail property="Continents" value={country.continents.join(", ")} />

        {/* Clima */}
        {weather && (
          <View className="mb-4 rounded-lg bg-blue-50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <MaterialIcons name="cloud" size={24} color="#3b82f6" />
              <Text className="text-lg font-semibold text-blue-600">
                Weather in {country.capital?.[0]}
              </Text>
            </View>
            <View className="mt-3 gap-2">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-700">Temperature</Text>
                <Text className="text-gray-900">{weather.temp}°C</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-700">Condition</Text>
                <Text className="text-gray-900">{weather.description}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-700">Feels Like</Text>
                <Text className="text-gray-900">{weather.feelsLike}°C</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-700">Humidity</Text>
                <Text className="text-gray-900">{weather.humidity}%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-700">Wind Speed</Text>
                <Text className="text-gray-900">{weather.windSpeed.toFixed(1)} m/s</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-700">Pressure</Text>
                <Text className="text-gray-900">{weather.pressure} hPa</Text>
              </View>
            </View>
          </View>
        )}

        {weatherLoading && (
          <View className="mb-4 items-center py-4">
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text className="mt-2 text-sm text-gray-600">Loading weather...</Text>
          </View>
        )}

        {/* Mapa */}
        {weather && (
          <View className="mb-6 p-2 border-b border-gray-200">
            <Text className="text-lg font-semibold text-blue-500">
              Map
            </Text>
            <MapView
              style={{ width: "100%", height: 200 }}
              region={{
                latitude: weather.latitude,
                longitude: weather.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker
                coordinate={{
                  latitude: weather.latitude,
                  longitude: weather.longitude,
                }}
                title={country.name.common}
              />
            </MapView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
