import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import socketService from '../../services/socketService';

interface Call {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  callType: 'voice' | 'video';
  duration: number;
  timestamp: number;
  status: 'incoming' | 'outgoing' | 'missed';
}

interface IncomingCallData {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  callType: 'voice' | 'video';
}

const CallScreen = ({ navigation }: any) => {
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadCallHistory();
    setupCallListeners();
  }, []);

  const setupCallListeners = () => {
    socketService.on('call-incoming', (data: IncomingCallData) => {
      setIncomingCall(data);
    });
  };

  const loadCallHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/calls/history');
      setCallHistory(response.data.calls);
    } catch (error) {
      console.error('Error loading call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleAnswerCall = () => {
    if (incomingCall) {
      socketService.answerCall(incomingCall.callId);
      navigation.navigate('CallDetail', { callId: incomingCall.callId });
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      socketService.rejectCall(incomingCall.callId);
      setIncomingCall(null);
    }
  };

  const handleInitiateCall = (recipientId: string, callType: 'voice' | 'video') => {
    socketService.initiateCall(recipientId, callType);
    navigation.navigate('CallDetail', { callType });
  };

  const renderCallItem = ({ item }: { item: Call }) => {
    const getStatusIcon = () => {
      switch (item.status) {
        case 'missed':
          return '❌';
        case 'incoming':
          return '📥';
        case 'outgoing':
          return '📤';
        default:
          return '📞';
      }
    };

    const getCallTypeIcon = () => {
      return item.callType === 'video' ? '📹' : '🎙️';
    };

    return (
      <TouchableOpacity
        style={styles.callItem}
        onPress={() => handleInitiateCall(item.participantId, item.callType)}
      >
        <Image
          source={{ uri: item.participantAvatar || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={styles.callContent}>
          <View style={styles.callHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.callStatusIcon}>{getStatusIcon()}</Text>
              <Text style={styles.participantName}>{item.participantName}</Text>
            </View>
            <Text style={styles.callTypeIcon}>{getCallTypeIcon()}</Text>
          </View>
          <View style={styles.callFooter}>
            <Text style={styles.callTime}>{formatTime(item.timestamp)}</Text>
            <Text style={styles.callDuration}>{formatDuration(item.duration)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calls</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
          <Text style={styles.newCallButton}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Incoming Call Modal */}
      <Modal visible={!!incomingCall} transparent animationType="slide">
        <View style={styles.incomingCallContainer}>
          <View style={styles.incomingCallContent}>
            <Image
              source={{
                uri: incomingCall?.callerAvatar || 'https://via.placeholder.com/100',
              }}
              style={styles.incomingCallAvatar}
            />
            <Text style={styles.incomingCallerName}>{incomingCall?.callerName}</Text>
            <Text style={styles.incomingCallType}>
              {incomingCall?.callType === 'video' ? 'Video Call' : 'Voice Call'}
            </Text>
            <Text style={styles.incomingCallStatus}>Incoming...</Text>

            <View style={styles.callButtonsContainer}>
              <TouchableOpacity
                style={[styles.callActionButton, styles.rejectButton]}
                onPress={handleRejectCall}
              >
                <Text style={styles.callActionButtonText}>❌ Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.callActionButton, styles.answerButton]}
                onPress={handleAnswerCall}
              >
                <Text style={styles.callActionButtonText}>✅ Answer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Call History */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : callHistory.length > 0 ? (
        <FlatList
          data={callHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderCallItem}
          onRefresh={loadCallHistory}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No calls yet</Text>
          <TouchableOpacity
            style={styles.startCallButton}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Text style={styles.startCallButtonText}>Start a Call</Text>
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
  newCallButton: {
    fontSize: 24,
  },
  callItem: {
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
  callContent: {
    flex: 1,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callStatusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  callTypeIcon: {
    fontSize: 16,
  },
  callFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callTime: {
    fontSize: 13,
    color: '#999',
  },
  callDuration: {
    fontSize: 13,
    color: '#666',
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
  startCallButton: {
    backgroundColor: '#075E54',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  startCallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  incomingCallContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomingCallContent: {
    alignItems: 'center',
  },
  incomingCallAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#25D366',
  },
  incomingCallerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  incomingCallType: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 4,
  },
  incomingCallStatus: {
    fontSize: 14,
    color: '#999',
    marginBottom: 40,
  },
  callButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  callActionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#ff6b6b',
  },
  answerButton: {
    backgroundColor: '#25D366',
  },
  callActionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CallScreen;