import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import HotelDetailScreen from './screens/HotelDetailScreen'
import BookingScreen from './screens/BookingScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1677ff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '易宿' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: '搜索酒店' }} />
        <Stack.Screen name="HotelDetail" component={HotelDetailScreen} options={{ title: '酒店详情' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: '填写预订信息' }} />
        <Stack.Screen name="Confirm" component={ConfirmScreen} options={{ title: '预订确认' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
