import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import socketService from '../../services/socketService';

interface CallDetailScreenProps {
  route: any;
  navigation: any;
}

const CallDetailScreen: React.FC<CallDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { callId, callType } = route.params;
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCallTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${pad(minutes)}:${pad(secs)}`;
  };

  const handleEndCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    socketService.endCall(callId);
    navigation.goBack();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (callType === 'video') {
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Video View (placeholder) */}
      {callType === 'video' && (
        <View style={styles.videoContainer}>
          <View style={styles.remoteVideo}>
            <Text style={styles.videoPlaceholder}>Video Stream</Text>
          </View>
          <View style={styles.localVideo}>
            <Text style={styles.videoPlaceholder}>You</Text>
          </View>
        </View>
      )}

      {/* Call Info */}
      <View style={styles.callInfo}>
        <Text style={styles.callerName}>John Doe</Text>
        <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        <Text style={styles.callTypeText}>
          {callType === 'video' ? 'Video Call' : 'Voice Call'}
        </Text>
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeControl]}
          onPress={toggleMute}
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        {callType === 'video' && (
          <TouchableOpacity
            style={[styles.controlButton, !isVideoEnabled && styles.activeControl]}
            onPress={toggleVideo}
          >
            <Text style={styles.controlIcon}>{isVideoEnabled ? '📹' : '📷'}</Text>
            <Text style={styles.controlLabel}>
              {isVideoEnabled ? 'Video On' : 'Video Off'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, isSpeakerOn && styles.activeControl]}
          onPress={toggleSpeaker}
        >
          <Text style={styles.controlIcon}>{isSpeakerOn ? '🔊' : '🔉'}</Text>
          <Text style={styles.controlLabel}>
            {isSpeakerOn ? 'Speaker' : 'Phone'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* End Call Button */}
      <View style={styles.endCallContainer}>
        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
        >
          <Text style={styles.endCallIcon}>📞</Text>
          <Text style={styles.endCallText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  localVideo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  videoPlaceholder: {
    color: '#fff',
    fontSize: 14,
  },
  callInfo: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  callDuration: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  callTypeText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
  },
  activeControl: {
    opacity: 0.5,
  },
  controlIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
  },
  endCallContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  endCallButton: {
    backgroundColor: '#ff6b6b',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallIcon: {
    fontSize: 24,
  },
  endCallText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default CallDetailScreen;