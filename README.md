# ChatterBox - Modern Messaging App

A powerful, feature-rich messaging application similar to WhatsApp but with enhanced UI/UX and advanced features.

## Features

### Messaging
- ✅ Text messaging with real-time delivery
- ✅ Media sharing (photos, videos, files, audio)
- ✅ Message reactions with emojis
- ✅ Message editing and deletion
- ✅ Message replies/quoting
- ✅ Typing indicators
- ✅ Read receipts
- ✅ End-to-end encryption support

### User Features
- ✅ User authentication (phone/email)
- ✅ User profiles with avatar and status
- ✅ Contact synchronization
- ✅ Online/offline status
- ✅ User blocking and reporting
- ✅ Two-factor authentication

### Group Features
- ✅ Group chat creation
- ✅ Group chat administration
- ✅ Member management
- ✅ Group customization
- ✅ Group notifications

### Call Features
- ✅ Voice calls
- ✅ Video calls
- ✅ Group calls
- ✅ Call recording (planned)

### Additional Features
- ✅ Push notifications
- ✅ Dark mode
- ✅ Search functionality
- ✅ Message backup
- ✅ Status/Stories support
- ✅ Call history
- ✅ Message history

## Tech Stack

### Frontend
- React Native with Expo
- TypeScript
- React Navigation
- Zustand for state management
- Socket.io for real-time communication
- Axios for API calls

### Backend
- Node.js/Express
- MongoDB
- Socket.io
- JWT Authentication
- Twilio for voice/video calls (optional)

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on Android:
```bash
npm run android
```

4. Run on iOS:
```bash
npm run ios
```

## Project Structure

```
src/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── ChatsScreen.tsx
│   ├── ChatDetailScreen.tsx
│   ├── ContactsScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── CallScreen.tsx
│   ├── GroupChatScreen.tsx
│   ├── StatusScreen.tsx
│   └── SplashScreen.tsx
├── store/
│   ├── authStore.ts
│   └── chatStore.ts
├── services/
│   ├── api.ts
│   └── socketService.ts
└── App.tsx
```

## API Integration

The app connects to a backend API. Configure your API endpoint in `.env`:

```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SOCKET_URL=http://localhost:3000
```

## Configuration

### Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://your-api-url.com/api
REACT_APP_SOCKET_URL=http://your-api-url.com
```

## Features Details

### Real-time Messaging
Messages are delivered in real-time using WebSocket (Socket.io) for instant updates across all connected clients.

### Media Sharing
Support for sharing images, videos, audio files, and documents. Files are uploaded to the server and accessible through CDN links.

### Encryption
Messages support end-to-end encryption using industry-standard protocols (optional).

### Calls
Voice and video calls are powered by Twilio or similar services with peer-to-peer WebRTC support.

## Performance

- Optimized message loading with pagination
- Image caching and optimization
- Efficient state management with Zustand
- Minimal re-renders with React.memo

## Security

- JWT-based authentication
- Secure token storage in AsyncStorage
- HTTPS/TLS encryption in transit
- Optional end-to-end encryption

## Future Enhancements

- [ ] Message encryption
- [ ] Call recording
- [ ] Message search
- [ ] Advanced filters
- [ ] Custom themes
- [ ] AI-powered features
- [ ] Payment integration
- [ ] Marketplace integration

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@chatterbox.com or open an issue on GitHub.