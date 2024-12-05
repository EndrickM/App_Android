import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable,  Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const Cadastro = () => {
    const { control, handleSubmit, watch } = useForm();
    const pwd = watch('senha');
    const navigation = useNavigation();

    const onRegisterPressed = async (data) => {
        const { 'password-repeat': passwordRepeat, ...userData } = data;
        try {
            const response = await axios.post('http://172.18.0.1:3000/users', userData);
            console.log('Dados cadastrados:', userData);
            Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
            console.log('Dados cadastrados:', userData);
        }
    };

    const onSignInPress = () => {
        navigation.navigate('Login');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Criar uma conta</Text>

            <CustomInput
            name="name"
            control={control}
            placeholder="Nome"
            rules={{
                required: 'O nome é obrigatório',
                minLength: {
                value: 3,
                message: 'O nome deve ter pelo menos 3 caracteres',
                },
                maxLength: {
                value: 24,
                message: 'O nome deve ter no máximo 24 caracteres',
                },
            }}
            />

            <CustomInput
            name="email"
            control={control}
            placeholder="Email"
            rules={{
                required: 'O email é obrigatório',
                pattern: {
                value: EMAIL_REGEX,
                message: 'Email inválido',
                },
            }}
            />

            <CustomInput
            name="senha"
            control={control}
            placeholder="Senha"
            secureTextEntry
            rules={{
                required: 'A senha é obrigatória',
                minLength: {
                value: 8,
                message: 'A senha deve ter pelo menos 8 caracteres',
                },
            }}
            />

            <CustomInput
            name="senha-repeat"
            control={control}
            placeholder="Repita a senha"
            secureTextEntry
            rules={{
                validate: (value) => value === pwd || 'As senhas não coincidem',
            }}
            />

            <CustomButton text="Registrar" onPress={handleSubmit(onRegisterPressed)} />
            <CustomButton text="Já tem uma conta? Entrar" onPress={onSignInPress} type="TERTIARY" />
        </View>
        </ScrollView>
    );
    };

const CustomInput = ({ name, control, placeholder, rules, secureTextEntry }) => {
  return (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              style={[
                styles.input,
                error ? { borderColor: 'red' } : { borderColor: '#e8e8e8' },
              ]}
              secureTextEntry={secureTextEntry}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
};

const CustomButton = ({ text, onPress, type = 'PRIMARY' }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        type === 'TERTIARY' ? styles.buttonTertiary : styles.buttonPrimary,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          type === 'TERTIARY' ? styles.textTertiary : styles.textPrimary,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    marginVertical: 10,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 5,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonPrimary: {
    backgroundColor: '#3B71F3',
  },
  buttonTertiary: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  textPrimary: {
    color: 'white',
  },
  textTertiary: {
    color: '#3B71F3',
  },
});

export default Cadastro;
