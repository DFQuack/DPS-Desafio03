import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <Drawer>
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
            }}
          />
        </Drawer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
