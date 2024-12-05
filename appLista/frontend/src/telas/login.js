import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation, setLoggedIn }) => {
  const [form, setForm] = useState({
    email: '',
    senha: '',
  });

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://172.18.0.1:3000/login', form);
      const { token, user } = response.data;
      await AsyncStorage.setItem('userId', JSON.stringify(user.id));
      console.log('Login bem-sucedido:', user);
      await AsyncStorage.setItem('userToken', token);
      setLoggedIn(true);

    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro no Login',
        error.response?.data?.error || 'Credenciais inválidas. Tente novamente.'
      );
    }
  }
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Second Memory
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="Digite seu email"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>
          <Text style={styles.inputLabel}>Senha</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={senha => setForm({ ...form, senha })}  
              placeholder="Digite sua senha"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry
              value={form.senha} 
            />

          <TouchableOpacity
            onPress={() => {
              console.log('Esqueceu a senha?');
            }}
          >
            <Text style={styles.formLink}>Esqueceu sua senha?</Text>
          </TouchableOpacity>          

          <View style={styles.bottomEnter}>
            <TouchableOpacity onPress={handleSignIn}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Entrar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Cadastro');  
        }}
      >
        <Text style={styles.formFooter}>
          Não tem uma conta?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Crie uma</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  bottomEnter: {
    marginTop: 35,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Login;
