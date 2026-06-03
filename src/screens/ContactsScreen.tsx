import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isOnline: boolean;
}

const ContactsScreen = ({ navigation }: any) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/contacts');
      setContacts(response.data.contacts);
      setFilteredContacts(response.data.contacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.phoneNumber.includes(text)
    );
    setFilteredContacts(filtered);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ChatDetail', { contactId: item.id })}
    >
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
        style={styles.avatar}
      />
      <View style={styles.contactContent}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
      </View>
      <View style={[styles.statusDot, item.isOnline && styles.onlineStatus]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contacts</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : filteredContacts.length > 0 ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          onRefresh={loadContacts}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
  },
  backButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactPhone: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  onlineStatus: {
    backgroundColor: '#25D366',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ContactsScreen;