import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import type { RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LoginScreen() {
  const navigation = useNavigation<Nav>()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('提示', '请填写邮箱和密码'); return }
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    } catch (e: any) {
      Alert.alert('登录失败', e?.response?.data?.message || '邮箱或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.card}>
        <Text style={s.logo}>易宿</Text>
        <Text style={s.subtitle}>酒店预订平台</Text>

        <TextInput
          style={s.input}
          placeholder="邮箱"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={s.input}
          placeholder="密码"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>登录</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.link} onPress={() => navigation.navigate('Register')}>
          <Text style={s.linkText}>没有账号？立即注册</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.skip} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}>
          <Text style={s.skipText}>跳过，先逛逛</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1677ff', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28 },
  logo: { fontSize: 36, fontWeight: '800', color: '#1677ff', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 28, marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#e8e8e8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#333', marginBottom: 14, backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#1677ff', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#1677ff', fontSize: 14 },
  skip: { alignItems: 'center', marginTop: 10 },
  skipText: { color: '#bbb', fontSize: 13 },
})
