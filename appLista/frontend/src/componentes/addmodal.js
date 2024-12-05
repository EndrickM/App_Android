import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const AddItemModal = ({ isVisible, toggleModal, fetchListas, categorias, userId }) => {
  const [name, setName] = useState('');
  const [categoria, setCategoria] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleAddItem = async () => {
    try {
      console.log("Dados:", name, categoria, userId);
      await axios.post('http://172.18.0.1:3000/lista', {
        name,
        categoria,
        userId,
      });
      setName('');
      fetchListas();
      toggleModal();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar Lista</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da Lista"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <Text style={styles.dropdownHeaderText}>
              {categoria ? categoria : 'Escolha uma categoria'}
            </Text>
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdownContainer}>
              <FlatList
                data={categorias}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      categoria === item.name && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setCategoria(item.name);
                      setIsDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                style={styles.dropdownList}
              />
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  dropdownHeader: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#555',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
});

export default AddItemModal;
