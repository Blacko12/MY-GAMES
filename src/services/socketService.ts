import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: { [key: string]: Function[] } = {};

  async connect() {
    try {
      const token = await AsyncStorage.getItem('token');
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        this.emit('connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.emit('disconnected');
      });

      this.socket.on('message', (data) => {
        this.emit('message', data);
      });

      this.socket.on('typing', (data) => {
        this.emit('typing', data);
      });

      this.socket.on('call-incoming', (data) => {
        this.emit('call-incoming', data);
      });

      this.socket.on('call-answered', (data) => {
        this.emit('call-answered', data);
      });

      this.socket.on('call-rejected', (data) => {
        this.emit('call-rejected', data);
      });

      this.socket.on('call-ended', (data) => {
        this.emit('call-ended', data);
      });

      this.socket.on('user-online', (data) => {
        this.emit('user-online', data);
      });

      this.socket.on('user-offline', (data) => {
        this.emit('user-offline', data);
      });
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  sendMessage(chatId: string, message: any) {
    if (this.socket) {
      this.socket.emit('message', { chatId, ...message });
    }
  }

  setTyping(chatId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { chatId, isTyping });
    }
  }

  initiateCall(recipientId: string, callType: 'voice' | 'video') {
    if (this.socket) {
      this.socket.emit('call-initiate', { recipientId, callType });
    }
  }

  answerCall(callId: string) {
    if (this.socket) {
      this.socket.emit('call-answer', { callId });
    }
  }

  rejectCall(callId: string) {
    if (this.socket) {
      this.socket.emit('call-reject', { callId });
    }
  }

  endCall(callId: string) {
    if (this.socket) {
      this.socket.emit('call-end', { callId });
    }
  }
}

export default new SocketService();