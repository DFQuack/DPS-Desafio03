import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const CONTINENTS = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View className="mt-4 border-t border-gray-300 px-4 py-2">
        <Text className="mb-3 font-semibold text-gray-700">Continents</Text>
        {CONTINENTS.map((continent) => (
          <DrawerItem
            key={continent}
            label={continent}
            onPress={() => {
              router.push({
                pathname: "/continent",
                params: { name: continent },
              });
            }}
            labelStyle={{ marginLeft: -16, fontSize: 14 }}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
        <Drawer drawerContent={CustomDrawerContent}>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Home",
              title: "Countries of the world",
            }}
          />
          <Drawer.Screen
            name="continent"
            options={{
              drawerLabel: "View Continent",
              title: "Countries by Continent",
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="country-details"
            options={{
              drawerLabel: "Country Details",
              title: "Country Details",
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
