import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddSubItemModal from '../componentes/addsubmodal';
import EditSubItemModal from '../componentes/editsubmodal';

const SublistaScreen = ({ route }) => {
    const { itemId } = route.params;
    const [sublist, setSublist] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);


    useEffect(() => {
        if (itemId) {
            fetchSublista(itemId);
        } else {
            Alert.alert('Erro', 'ID da lista não encontrado.');
        }
    }, [itemId]);

    const addModal = () => {
        setAddModalOpen(!addModalOpen);
    };

    const editModal = () => {
        setEditModalOpen(!editModalOpen);
    };

    const deleteSubItem = async (id) => {
        try {
            await axios.delete(`http://172.18.0.1:3000/sublista/${id}`);
            fetchSublista(itemId); 
        } catch (error) {
            console.error('Erro ao excluir subitem:', error);
            Alert.alert('Erro', 'Não foi possível excluir o item.');
        }
    };

    const fetchSublista = async (id) => {
        try {
            const response = await axios.get(`http://172.18.0.1:3000/sublista/${id}`);
            setSublist(response.data);
        } catch (error) {
            console.error('Erro ao buscar sublistas:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao carregar as sublistas.');
        }
    };

    const renderSubItem = ({ item }) => (
        <View key={item.id} style={styles.box}>
            <View style={styles.subItem}>
                <Text style={styles.subItemText}>{item.name}</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={editModal} 
                >
                    <Icon name="pencil" size={24} color="#daa520" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteSubItem(item.id)} 
                >
                    <Icon name="trash-o" size={24} color="#ff0000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sublist}
                renderItem={renderSubItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma sublista disponível.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={addModal}>
                <Icon name="plus-circle" size={55} color="#4682b4" />
            </TouchableOpacity>

            <AddSubItemModal
                isVisible={addModalOpen}
                toggleModal={addModal}
                fetchSublista={() => fetchSublista(itemId)}
                itemId={itemId}
            />
            <EditSubItemModal
                isVisible={editModalOpen}
                toggleModal={editModal}
                fetchSublista={() => fetchSublista(itemId)}
                itemId={itemId} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    subItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'normal',
        color: '#333',
        marginRight: 10,
    },
    box: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    editButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SublistaScreen;
