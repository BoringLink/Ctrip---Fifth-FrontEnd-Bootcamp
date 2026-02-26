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

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert('提示', '请填写所有字段'); return }
    if (password !== confirm) { Alert.alert('提示', '两次密码不一致'); return }
    if (password.length < 6) { Alert.alert('提示', '密码至少6位'); return }
    setLoading(true)
    try {
      await register(email.trim(), password, name.trim())
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    } catch (e: any) {
      Alert.alert('注册失败', e?.response?.data?.message || '请检查信息后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.card}>
        <Text style={s.title}>创建账号</Text>

        <TextInput style={s.input} placeholder="昵称" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="邮箱" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="密码（至少6位）" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={s.input} placeholder="确认密码" placeholderTextColor="#aaa" value={confirm} onChangeText={setConfirm} secureTextEntry />

        <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>注册</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={s.link} onPress={() => navigation.goBack()}>
          <Text style={s.linkText}>已有账号？去登录</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1677ff', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28 },
  title: { fontSize: 22, fontWeight: '800', color: '#222', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#e8e8e8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#333', marginBottom: 14, backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#1677ff', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#1677ff', fontSize: 14 },
})
