# CampusVibe - College Social Network

A modern college social networking app built with Expo and React Native.

## Features

- 📱 **Social Feed** - Share posts, images, and videos
- 📚 **Study Notes** - Upload and download study materials
- 🎉 **Events** - Discover and join college events
- 💬 **Messaging** - Real-time chat with classmates
- 🎬 **Reels** - Short-form video content
- 📖 **Stories** - 24-hour disappearing content
- 👥 **Profile** - Customizable user profiles

## Tech Stack

- **Framework**: Expo SDK 52
- **Navigation**: Expo Router 4
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **Fonts**: Inter (Google Fonts)
- **Platform**: Web-first (iOS/Android compatible)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Backend Integration

This app is ready for backend integration. To connect your backend:

1. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Fill in your backend configuration

2. **Available Integration Points**:
   - Authentication (login/register)
   - User profiles and management
   - Posts, stories, and reels
   - Real-time messaging
   - File uploads
   - Push notifications

3. **Type Definitions**:
   - Backend types are available in `types/backend.ts`
   - Use these for TypeScript integration

### Recommended Backend Options

- **Supabase** - PostgreSQL with real-time features
- **Firebase** - Google's mobile platform
- **Custom API** - Node.js/Express with your preferred database

## Project Structure

```
app/                    # App routes (Expo Router)
├── (tabs)/            # Tab navigation
├── auth/              # Authentication screens
├── events.tsx         # Events page
├── messages/          # Messaging screens
└── notes.tsx          # Study notes page

components/            # Reusable components
├── ui/               # UI components
└── ...

lib/                  # Utilities and hooks
├── hooks/            # Custom React hooks
└── ...

types/                # TypeScript definitions
└── backend.ts        # Backend integration types
```

## Key Features

### Authentication
- Email/password login and registration
- Profile management
- Session handling

### Social Features
- Post creation with images/videos
- Like, comment, and share functionality
- User following system
- Real-time notifications

### Academic Features
- Study notes upload/download
- Subject and semester organization
- College event discovery
- Academic profile information

### Messaging
- Real-time chat
- Group conversations
- File sharing
- Typing indicators

## Development

### Adding New Features

1. Create new routes in the `app/` directory
2. Add reusable components in `components/`
3. Use TypeScript for type safety
4. Follow the existing design patterns

### Styling Guidelines

- Use `StyleSheet.create` for all styles
- Follow the existing color scheme
- Ensure responsive design
- Test on multiple screen sizes

### Backend Integration

When ready to connect a backend:

1. Install required packages (axios, @supabase/supabase-js, etc.)
2. Create API service files in `lib/services/`
3. Update the mock data with real API calls
4. Implement proper error handling
5. Add loading states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.# CampusVibe
