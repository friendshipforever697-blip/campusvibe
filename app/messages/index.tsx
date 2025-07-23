import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const conversations = [
  {
    id: 1,
    name: 'Rahul Sharma',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    lastMessage: 'Hey! Did you check out the new meme I posted? 😂',
    time: '2m',
    unread: 2,
    online: true,
    isTyping: false,
  },
  {
    id: 2,
    name: 'Study Group - CSE 3rd Year',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150',
    lastMessage: 'Priya: Can someone share the DSA notes?',
    time: '15m',
    unread: 5,
    online: false,
    isGroup: true,
    isTyping: true,
    typingUser: 'Arjun',
  },
  {
    id: 3,
    name: 'Priya Patel',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    lastMessage: 'Thanks for sharing the notes! 📚',
    time: '1h',
    unread: 0,
    online: false,
    isTyping: false,
  },
  {
    id: 4,
    name: 'Arjun Singh',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    lastMessage: 'Are you coming to the tech fest tomorrow?',
    time: '3h',
    unread: 0,
    online: true,
    isTyping: false,
  },
  {
    id: 5,
    name: 'Event Organizers',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150',
    lastMessage: 'Reminder: Tech Fest registration closes tonight!',
    time: '5h',
    unread: 1,
    online: false,
    isGroup: true,
    isTyping: false,
  },
  {
    id: 6,
    name: 'Sneha Gupta',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    lastMessage: 'Let\'s meet at the library tomorrow',
    time: '1d',
    unread: 0,
    online: false,
    isTyping: false,
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv =>
        conv.name.toLowerCase().includes(query.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  };

  const navigateToChat = (conversationId: number, name: string) => {
    router.push(`/messages/${conversationId}?name=${encodeURIComponent(name)}`);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingDot} />
      <View style={[styles.typingDot, styles.typingDot2]} />
      <View style={[styles.typingDot, styles.typingDot3]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Clean Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#1F2937" strokeWidth={2.5} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>{conversations.length} conversations</Text>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color="#9CA3AF" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.conversationsList}
        contentContainerStyle={styles.conversationsContent}
      >
        {filteredConversations.map((conversation, index) => (
          <TouchableOpacity 
            key={conversation.id} 
            style={[
              styles.conversationCard,
              index === 0 && styles.firstConversationCard,
              conversation.unread > 0 && styles.unreadConversationCard
            ]}
            onPress={() => navigateToChat(conversation.id, conversation.name)}
            activeOpacity={0.7}
          >
            <View style={styles.conversationLeft}>
              <View style={styles.avatarContainer}>
                <View style={[
                  styles.avatarWrapper,
                  conversation.online && styles.onlineAvatarWrapper
                ]}>
                  <Image source={{ uri: conversation.image }} style={styles.conversationImage} />
                  {conversation.online && <View style={styles.onlineIndicator} />}
                </View>
                
                {conversation.isGroup && (
                  <View style={styles.groupBadge}>
                    <Text style={styles.groupBadgeText}>👥</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={[
                    styles.conversationName,
                    conversation.unread > 0 && styles.unreadConversationName
                  ]}>
                    {conversation.name}
                  </Text>
                  <View style={styles.timeContainer}>
                    <Text style={[
                      styles.conversationTime,
                      conversation.unread > 0 && styles.unreadTime
                    ]}>
                      {formatTime(conversation.time)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.messagePreview}>
                  {conversation.isTyping ? (
                    <View style={styles.typingIndicatorContainer}>
                      <Text style={styles.typingText}>
                        {conversation.isGroup ? `${conversation.typingUser} is typing` : 'typing'}
                      </Text>
                      {renderTypingIndicator()}
                    </View>
                  ) : (
                    <Text 
                      style={[
                        styles.lastMessage,
                        conversation.unread > 0 && styles.unreadMessage
                      ]}
                      numberOfLines={1}
                    >
                      {conversation.lastMessage}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.conversationRight}>
              {conversation.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.unreadBadgeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.unreadText}>
                      {conversation.unread > 99 ? '99+' : conversation.unread}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <LinearGradient
                colors={['#F3F4F6', '#E5E7EB']}
                style={styles.emptyStateIconGradient}
              >
                <Search size={32} color="#9CA3AF" strokeWidth={1.5} />
              </LinearGradient>
            </View>
            <Text style={styles.emptyStateTitle}>No messages found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try searching with different keywords' : 'Start connecting with your classmates!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingTop: 8,
  },
  conversationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  firstConversationCard: {
    marginTop: 8,
  },
  unreadConversationCard: {
    backgroundColor: '#FEFEFE',
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
    shadowOpacity: 0.08,
  },
  conversationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  onlineAvatarWrapper: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  groupBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupBadgeText: {
    fontSize: 10,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  unreadConversationName: {
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  timeContainer: {
    marginLeft: 8,
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  unreadTime: {
    color: '#667eea',
    fontFamily: 'Inter-SemiBold',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    flex: 1,
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#667eea',
    marginRight: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#667eea',
    marginRight: 2,
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
    marginRight: 0,
  },
  conversationRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  unreadBadge: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 20,
    height: 20,
  },
  unreadBadgeGradient: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
  },
  unreadText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});