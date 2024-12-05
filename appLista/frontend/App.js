import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './src/telas/login'; 
import Home from './src/telas/home';
import Listas from './src/telas/listas';
import SubListas from './src/telas/subListas';
import Cadastro from './src/telas/cadastro';

const Stack = createStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setLoggedIn(!!token); 
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('userToken');
    setLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: 'Home', 
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Icon name="sign-out" size={24} color="#000" />
                </TouchableOpacity>
              ),
            }}
          />

          <Stack.Screen name="Listas" component={Listas} />
          <Stack.Screen name="Items" component={SubListas} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setLoggedIn={setLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};


export default App;
