import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';
import { useChatStore } from '../../store/chatStore';

interface Status {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  images: string[];
  text?: string;
  timestamp: number;
  expiresAt: number;
}

const StatusScreen = ({ navigation }: any) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { createGroupChat } = useChatStore();

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/statuses');
      setStatuses(response.data.statuses);
    } catch (error) {
      console.error('Error loading statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusItem = ({ item }: { item: Status }) => {
    const formatTime = (timestamp: number) => {
      const now = Date.now();
      const diff = now - timestamp;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return 'now';
    };

    return (
      <TouchableOpacity
        style={styles.statusItem}
        onPress={() => {
          setSelectedStatus(item);
          setShowStatusModal(true);
        }}
      >
        <View style={styles.statusImageContainer}>
          <Image
            source={{ uri: item.images[0] || 'https://via.placeholder.com/80' }}
            style={styles.statusImage}
          />
          <View style={styles.statusOverlay} />
        </View>
        <View style={styles.statusInfo}>
          <Text style={styles.statusUserName}>{item.userName}</Text>
          <Text style={styles.statusTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Status</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateStatus')}>
          <Text style={styles.addButton}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Add Your Status Button */}
      <TouchableOpacity style={styles.myStatusContainer}>
        <View style={styles.myStatusImageContainer}>
          <View style={styles.myStatusPlaceholder}>
            <Text style={styles.myStatusIcon}>📷</Text>
          </View>
        </View>
        <View style={styles.myStatusInfo}>
          <Text style={styles.myStatusLabel}>Add to my status</Text>
          <Text style={styles.myStatusSubtitle}>Tap to add a status</Text>
        </View>
      </TouchableOpacity>

      {/* Status List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : statuses.length > 0 ? (
        <FlatList
          data={statuses}
          keyExtractor={(item) => item.id}
          renderItem={renderStatusItem}
          onRefresh={loadStatuses}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No statuses yet</Text>
          <Text style={styles.emptySubtext}>When contacts add statuses, they'll show up here</Text>
        </View>
      )}

      {/* Status Modal */}
      <Modal visible={showStatusModal} transparent animationType="fade">
        <View style={styles.statusModalContainer}>
          <TouchableOpacity
            style={styles.statusModalBackdrop}
            onPress={() => setShowStatusModal(false)}
          />
          {selectedStatus && (
            <View style={styles.statusModalContent}>
              <Image
                source={{
                  uri: selectedStatus.images[0] || 'https://via.placeholder.com/400',
                }}
                style={styles.statusModalImage}
              />
              <View style={styles.statusModalInfo}>
                <Text style={styles.statusModalName}>{selectedStatus.userName}</Text>
                {selectedStatus.text && (
                  <Text style={styles.statusModalText}>{selectedStatus.text}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
  addButton: {
    fontSize: 24,
  },
  myStatusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  myStatusImageContainer: {
    marginRight: 12,
  },
  myStatusPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#075E54',
    borderStyle: 'dashed',
  },
  myStatusIcon: {
    fontSize: 28,
  },
  myStatusInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  myStatusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  myStatusSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  statusItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  statusImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#075E54',
  },
  statusInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  statusUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusTime: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
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
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statusModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusModalContent: {
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusModalImage: {
    width: '100%',
    height: 400,
  },
  statusModalInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusModalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusModalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default StatusScreen;