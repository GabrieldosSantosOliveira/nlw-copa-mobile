import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

import { Details } from '../screens/Details';
import { Find } from '../screens/Find';
import { New } from '../screens/New';
import { Pools } from '../screens/Pools';
const { Navigator, Screen } = createBottomTabNavigator();
export const AppRoutes = () => {
  const { colors, sizes } = useTheme();
  const size = sizes[6];
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: sizes[22],
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0,
        },
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="pluscircleo" color={color} size={size} />
          ),
          tabBarLabel: 'Novo bolão',
        }}
      />
      <Screen
        name="pools"
        component={Pools}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sports-soccer" color={color} size={size} />
          ),
          tabBarLabel: 'Meus bolões',
        }}
      />
      <Screen
        name="find"
        component={Find}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Screen
        name="details"
        component={Details}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Navigator>
  );
};
