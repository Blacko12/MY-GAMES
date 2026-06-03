import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useChatStore, Message } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import socketService from '../../services/socketService';

interface ChatDetailScreenProps {
  route: any;
  navigation: any;
}

const MessageBubble: React.FC<{ message: Message; isOwn: boolean }> = ({
  message,
  isOwn,
}) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.messageBubbleContainer, isOwn && styles.ownMessageContainer]}>
      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {message.mediaUrl && (
          <Image
            source={{ uri: message.mediaUrl }}
            style={styles.messageMedia}
          />
        )}
        {message.text && (
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {message.text}
          </Text>
        )}
      </View>
      <View style={[styles.messageFooter, isOwn && styles.ownMessageFooter]}>
        <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
        {isOwn && (
          <Text style={styles.readReceipt}>
            {message.isRead ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </View>
  );
};

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { chatId } = route.params;
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { messages, loadMessages, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    loadMessages(chatId);
    socketService.on('message', handleNewMessage);
    return () => {
      socketService.off('message', handleNewMessage);
    };
  }, [chatId]);

  const handleNewMessage = (data: any) => {
    if (data.chatId === chatId) {
      loadMessages(chatId);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && chatMessages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    if (!isTyping) {
      setIsTyping(true);
      socketService.setTyping(chatId, true);
      setTimeout(() => {
        setIsTyping(false);
        socketService.setTyping(chatId, false);
      }, 3000);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSendingMessage(true);
    try {
      await sendMessage(chatId, {
        text: messageText,
        senderId: user?.id,
        timestamp: Date.now(),
      });
      setMessageText('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwn={item.senderId === user?.id}
          />
        )}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={messageText}
          onChangeText={handleTyping}
          multiline
          maxHeight={100}
          editable={!sendingMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!messageText.trim() || sendingMessage) && styles.disabledSendButton]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sendingMessage}
        >
          {sendingMessage ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageBubbleContainer: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  otherMessage: {
    backgroundColor: '#e0e0e0',
  },
  ownMessage: {
    backgroundColor: '#dcf8c6',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  ownMessageText: {
    color: '#000',
  },
  messageMedia: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    marginTop: 2,
    marginLeft: 8,
    alignItems: 'center',
  },
  ownMessageFooter: {
    marginRight: 8,
    marginLeft: 0,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  readReceipt: {
    fontSize: 12,
    color: '#075E54',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#075E54',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ChatDetailScreen;