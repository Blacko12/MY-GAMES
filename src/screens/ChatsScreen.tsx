import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';

interface ChatItemProps {
  chat: any;
  onPress: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => {
  const lastMessage = chat.lastMessage?.text || 'No messages yet';
  const timestamp = chat.lastMessage?.timestamp
    ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image
        source={{ uri: chat.groupAvatar || 'https://via.placeholder.com/50' }}
        style={styles.avatar}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.groupName || 'Chat'}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatsScreen = ({ navigation }: any) => {
  const { chats, loadChats } = useChatStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChatsData();
  }, []);

  const loadChatsData = async () => {
    setLoading(true);
    try {
      await loadChats();
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      chat.groupName?.toLowerCase().includes(searchTerm) ||
      chat.lastMessage?.text?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
          <View style={styles.editButton}>
            <Text style={styles.editButtonText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem
              chat={item}
              onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
            />
          )}
          onRefresh={loadChatsData}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Text style={styles.startButtonText}>Start a conversation</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
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
  chatItem: {
    flexDirection: 'row',
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
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 13,
    color: '#999',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#075E54',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatsScreen;