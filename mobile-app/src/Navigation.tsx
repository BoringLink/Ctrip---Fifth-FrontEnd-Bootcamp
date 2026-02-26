import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import HomeScreen from './screens/HomeScreen'
import MapScreen from './screens/MapScreen'
import SearchScreen from './screens/SearchScreen'
import HotelDetailScreen from './screens/HotelDetailScreen'
import BookingScreen from './screens/BookingScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import { AuthProvider } from './context/AuthContext'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

const stackOptions = {
  headerStyle: { backgroundColor: '#1677ff' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' as const },
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1677ff',
        tabBarInactiveTintColor: '#999',
        headerStyle: { backgroundColor: '#1677ff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' as const },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: '易宿',
          tabBarLabel: '首页',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: '附近酒店',
          tabBarLabel: '地图',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: '我的',
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

export default function Navigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={stackOptions}>
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '注册账号' }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: '搜索酒店' }} />
          <Stack.Screen name="HotelDetail" component={HotelDetailScreen} options={{ title: '酒店详情' }} />
          <Stack.Screen name="Booking" component={BookingScreen} options={{ title: '填写预订信息' }} />
          <Stack.Screen name="Confirm" component={ConfirmScreen} options={{ title: '预订确认' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}
