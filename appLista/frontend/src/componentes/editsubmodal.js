import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const EditSubItemModal = ({ isVisible, toggleModal, fetchSublista, itemId }) => {
    const [name, setName] = useState('');


    const handleEditItem = async () => {
        if (!name) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            await axios.put(`http://172.18.0.1:3000/sublista/${itemId}`, {
                name, // Atualiza o nome do item
            });
            setName('');
            fetchSublista(itemId);  // Atualiza a lista de subitens
            toggleModal();  // Fecha o modal
        } catch (error) {
            console.error('Erro ao editar item:', error);
            Alert.alert('Erro', 'Não foi possível editar o item.');
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <Text style={styles.addText}>Editar Item</Text>
                    <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                        <Icon name="times-circle" size={40} color="#4682b4" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={name}
                        onChangeText={setName}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleEditItem}>
                        <Text style={styles.addButtonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        height: 200,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        marginTop: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addText: {
        color: 'black',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#4682b4',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
});

export default EditSubItemModal;
