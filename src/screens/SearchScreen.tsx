import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

interface SearchResult {
  id: string;
  type: 'user' | 'chat' | 'message';
  name: string;
  avatar?: string;
  preview?: string;
}

const SearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/search', {
        params: { q: text },
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setSearchHistory([result.name, ...searchHistory.slice(0, 4)]);
    navigation.navigate('ChatDetail', { chatId: result.id });
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectResult(item)}
    >
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/40' }}
        style={styles.resultAvatar}
      />
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>{item.name}</Text>
        {item.preview && (
          <Text style={styles.resultPreview} numberOfLines={1}>
            {item.preview}
          </Text>
        )}
      </View>
      <View style={styles.resultTypeTag}>
        <Text style={styles.resultType}>
          {item.type === 'user' ? '👤' : item.type === 'chat' ? '💬' : '📝'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages, people, chats..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>

      {searchQuery.length > 0 ? (
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#075E54" />
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderSearchResult}
            contentContainerStyle={styles.resultsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        )
      ) : (
        <View style={styles.historyContainer}>
          {searchHistory.length > 0 && (
            <>
              <Text style={styles.historyTitle}>Recent Searches</Text>
              {searchHistory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => handleSearch(item)}
                >
                  <Text style={styles.historyText}>🔍 {item}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
    gap: 12,
  },
  backButton: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  resultsList: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  resultPreview: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  resultTypeTag: {
    marginLeft: 8,
  },
  resultType: {
    fontSize: 16,
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
  historyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 14,
    color: '#000',
  },
});

export default SearchScreen;