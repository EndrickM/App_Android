import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  
  const getCategoryColor = (categoria) => {
    switch (categoria) {
      case 'Mercado':
        return '#d9534f';
      case 'Tarefas':
        return '#f0ad4e';
      case 'Reuniões':
        return '#5cb85c';
      case 'Shopping':
        return '#0275d8';
      case 'Outros':
        return '#6c757d';
      default:
        return '#ccc';
    }
  };

  const fetchFavoritas = async () => {
    try {
      const response = await axios.get(`http://172.18.0.1:3000/lista`);
      const favoritas = response.data.filter((item) => item.favorito === true);
      setFavoritos(favoritas);
      console.log('Favoritas:', favoritas);
    } catch (error) {
      console.error('Erro ao buscar favoritas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as listas favoritas.');
    }
  };

  const fetchRecentes = async () => {
    try {
      const response = await axios.get(`http://172.18.0.1:3000/lista/recentes`);
      setRecentItems(response.data);
      console.log('Últimas acessadas:', response.data);
      fetchRecentes();
    } catch (error) {
      console.error('Erro ao buscar últimas listas acessadas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as últimas listas acessadas.');
    }
  };

  const fetchLast = async ( listaId ) => {
    try{
      navigation.navigate('Items', { itemId: listaId });
      await axios.put(`http://172.18.0.1:3000/lista/${listaId}/acessar`);
    } catch (error) {
      console.log('Id:', listaId);
      console.error('Erro ao marcar como ultimas acessadas:', error);
    }
  };


  useEffect(() => {
    fetchFavoritas();
    fetchRecentes();
  }, []);

  const renderListItem = (item) => (
    <View key={item.id} style={styles.box}>
      <View style={styles.listItem}>
        <TouchableOpacity
          style={styles.listButton}
          onPress={() => fetchLast(item.id)}
        >
          <Text style={styles.listText}>{item.name}</Text>
        </TouchableOpacity>
        <View
              style={[
                styles.categoryTag,
                { backgroundColor: getCategoryColor(item.categoria) },
              ]}
            >
          <Text style={styles.categoryText}>{item.categoria}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoritoButton}
          onPress={() => toggleFavorito(item.id, item.favorito)}
        >
          <Icon
            name={item.favorito ? 'star' : 'star-o'}
            size={24}
            color={item.favorito ? '#FFD700' : '#A9A9A9'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const toggleFavorito = async (id, favoritoAtual) => {
    try {
      await axios.put(`http://172.18.0.1:3000/lista/${id}`, {
        favorito: !favoritoAtual,
      });
      setFavoritos((prevFavoritos) =>
        prevFavoritos.map((item) =>
          item.id === id ? { ...item, favorito: !favoritoAtual } : item
        )
      );
      fetchFavoritas();
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status de favorito.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
      <Text style={styles.headerTitleText}>Second Memory</Text>
      </View>
    
      <View style={styles.favoritesSection}>
        <Text style={styles.sectionFavoritesTitle}>Listas Favoritas</Text>
        <ScrollView style={styles.limitedScroll}>
          {favoritos.map(renderListItem)}
        </ScrollView>
      </View>
      <View style={styles.recentSection}>
        <Text style={styles.sectionRecentTitle}>Últimas Listas</Text>
        <ScrollView style={styles.limitedScroll}>
          {recentItems.map(renderListItem)}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Listas')}
      >
        <Icon name="plus-circle" size={60} color="#4682b4" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 90,
  },
  listButton: {
    flex: 1, 
    marginRight: 10,
  },
  headerTitle: {
    backgroundColor: '#d0e1ff',
    padding: 10,
    borderRadius: 5,
    paddingBottom: 20,
    marginHorizontal: 125,
    marginTop: 25,
    shadowColor: '#a0b8e0',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3, 

  },
  headerTitleText: {
    margin: 0,
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritesSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 0,
    marginTop: 10,
    maxHeight: 258,
  },
  recentSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    marginTop: -10,
    maxHeight: 258,
  },
  sectionFavoritesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#fff3b0',
    borderRadius: 8,
  },
  sectionRecentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
  },
  limitedScroll: {
    maxHeight: 270,
    paddingBottom: 20,
  },
  box: {
    padding: 12,
    marginBottom: 7,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listText: {
    flex: 1,
    fontSize: 15,
  },
  categoryTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  addButton: {
    bottom: -15,
    left: 300,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  favoritoButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;

