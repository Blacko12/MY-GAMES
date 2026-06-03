# 🚀 Getting Started with ChatterBox

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** - Install globally: `npm install -g expo-cli`
- **Android Studio** (for Android) or **Xcode** (for iOS)
- A code editor like **VS Code**

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Blacko12/MY-GAMES.git
cd MY-GAMES
```

### 2. Switch to Messaging App Branch

```bash
git checkout messaging-app
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your API endpoints:

```env
REACT_APP_API_URL=http://your-backend-url.com/api
REACT_APP_SOCKET_URL=http://your-backend-url.com
```

## Running the App

### Option 1: Using Expo CLI (Easiest)

```bash
npm start
# or
expo start
```

This will show a QR code. You can:
- **Scan with your phone** using the Expo Go app (iOS/Android)
- **Press `a`** for Android emulator
- **Press `i`** for iOS simulator (Mac only)
- **Press `w`** for web preview

### Option 2: Android Development

**Prerequisites:**
- Android Studio installed
- Android SDK configured
- Emulator set up or physical device connected

```bash
npm run android
# or
expo run:android
```

### Option 3: iOS Development (Mac Only)

**Prerequisites:**
- Xcode installed
- CocoaPods installed

```bash
npm run ios
# or
expo run:ios
```

### Option 4: Web Preview

```bash
npm run web
# or
expo start --web
```

The app will open in your browser at `http://localhost:19006`

## Backend Setup

**The app requires a backend API server.** You need to set up:

### API Endpoints Required:

1. **Authentication**
   - `POST /api/auth/login` - User login
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/logout` - User logout

2. **Chats**
   - `GET /api/chats` - Get all chats
   - `GET /api/chats/:id/messages` - Get chat messages
   - `POST /api/chats/:id/messages` - Send message
   - `POST /api/chats/group` - Create group chat

3. **Calls**
   - `GET /api/calls/history` - Get call history
   - `POST /api/calls/initiate` - Start call

4. **Users**
   - `GET /api/users/contacts` - Get contacts
   - `GET /api/users/suggestions` - Get user suggestions
   - `PUT /api/users/profile` - Update profile

5. **Status**
   - `GET /api/statuses` - Get all statuses
   - `POST /api/statuses` - Create status

6. **Search**
   - `GET /api/search?q=query` - Search everything

### Recommended Backend Stack:

```javascript
// Backend (Node.js/Express example)
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/users', require('./routes/users'));
app.use('/api/statuses', require('./routes/statuses'));
app.use('/api/search', require('./routes/search'));

// Socket.io events
io.on('connection', (socket) => {
  socket.on('message', (data) => io.emit('message', data));
  socket.on('typing', (data) => io.emit('typing', data));
  socket.on('call-initiate', (data) => io.emit('call-incoming', data));
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

## Project Structure

```
MY-GAMES/
├── src/
│   ├── screens/          # All screen components
│   │   ├── auth/        # Login, Register
│   │   ├── ChatsScreen.tsx
│   │   ├── ChatDetailScreen.tsx
│   │   ├── CallScreen.tsx
│   │   ├── CallDetailScreen.tsx
│   │   ├── ContactsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── StatusScreen.tsx
│   │   ├── NewChatScreen.tsx
│   │   ├── GroupInfoScreen.tsx
│   │   └── SearchScreen.tsx
│   ├── store/           # Zustand stores
│   │   ├── authStore.ts
│   │   └── chatStore.ts
│   ├── services/        # API & Socket services
│   │   ├── api.ts
│   │   └── socketService.ts
│   ├── utils/          # Utility functions
│   │   ├── validators.ts
│   │   ├── stringUtils.ts
│   │   └── ErrorHandler.ts
│   ├── styles/         # Global styles
│   │   └── globalStyles.ts
│   ├── context/        # React Context
│   │   └── SocketContext.tsx
│   └── App.tsx         # Root component
├── package.json
├── .env                # Environment variables
├── .env.example        # Environment template
├── app.json            # Expo configuration
├── README.md
└── tsconfig.json       # TypeScript config
```

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Run `npm install` again and clear cache:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Issue: Port 19006 already in use
**Solution:** Kill the process or use different port:
```bash
expo start --port 19007
```

### Issue: CORS error from API
**Solution:** Ensure backend has CORS enabled:
```javascript
const cors = require('cors');
app.use(cors({ origin: '*' }));
```

### Issue: Socket connection fails
**Solution:** Check `.env` file has correct `REACT_APP_SOCKET_URL`

### Issue: Can't connect to Android emulator
**Solution:** Use machine IP instead of localhost:
```env
REACT_APP_API_URL=http://192.168.x.x:3000/api
```

## Development Tips

### Hot Reload
The app supports fast refresh. Just save your files and they'll automatically reload!

### Debug with React Native Debugger

```bash
npm install --save-dev react-native-debugger
```

Then press `j` in Expo CLI to open the debugger.

### View Logs

```bash
# In Expo CLI, press 'l' for logs
# Or use:
expo start --log-level verbose
```

## Building for Production

### Android APK

```bash
eas build --platform android
```

### iOS App

```bash
eas build --platform ios
```

### Web

```bash
npm run build
```

## Publishing to App Stores

### Expo EAS Submit

```bash
# First, create account
eas login

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## API Authentication

The app uses JWT tokens. Authentication flow:

1. User logs in with phone & password
2. Backend returns JWT token
3. Token is stored in AsyncStorage
4. Token is sent in Authorization header for all requests
5. If 401 response, app redirects to login

## Real-time Features

### Socket.io Events

```javascript
// Message events
socket.emit('message', { chatId, text, senderId });
socket.on('message', (data) => {});

// Typing indicator
socket.emit('typing', { chatId, isTyping });
socket.on('typing', (data) => {});

// Call events
socket.emit('call-initiate', { recipientId, callType });
socket.on('call-incoming', (data) => {});

// User status
socket.emit('user-online');
socket.on('user-offline', (data) => {});
```

## Performance Optimization

- ✅ Message pagination (load 20 at a time)
- ✅ Image caching with AsyncStorage
- ✅ Zustand for efficient state management
- ✅ React.memo for list items
- ✅ Lazy loading for media

## Security Best Practices

- ✅ JWT tokens in secure storage
- ✅ HTTPS/TLS in production
- ✅ Input validation on all forms
- ✅ No sensitive data in Redux
- ✅ Rate limiting on backend
- ✅ End-to-end encryption ready

## Next Steps

1. **Set up backend server** with API endpoints
2. **Update `.env` file** with your backend URL
3. **Run `npm install`** to install all dependencies
4. **Start the app** with `npm start`
5. **Test on device** or emulator
6. **Build and deploy** when ready

## Support & Documentation

- 📚 [React Native Docs](https://reactnative.dev/)
- 🎯 [Expo Documentation](https://docs.expo.dev/)
- 💬 [Socket.io Guide](https://socket.io/docs/v4/)
- 🗃️ [Zustand Guide](https://github.com/pmndrs/zustand)

## License

MIT License - Feel free to use this app for personal or commercial projects!

## Contributing

Want to contribute? Fork the repo and submit a pull request!

---

**Happy Coding! 🎉**