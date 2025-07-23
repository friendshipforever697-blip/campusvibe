import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Paperclip, Smile, MoveVertical as MoreVertical, Phone, Video, Info } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const messages = [
  {
    id: 1,
    text: 'Hey! Did you check out the new meme I posted? 😂',
    sender: 'other',
    timestamp: '10:30 AM',
    delivered: true,
    read: true,
  },
  {
    id: 2,
    text: 'Haha yes! That was hilarious 🤣',
    sender: 'me',
    timestamp: '10:32 AM',
    delivered: true,
    read: true,
  },
  {
    id: 3,
    text: 'I know right! College life is so memeable',
    sender: 'other',
    timestamp: '10:33 AM',
    delivered: true,
    read: true,
  },
  {
    id: 4,
    text: 'BTW, do you have the DSA notes from yesterday\'s class?',
    sender: 'me',
    timestamp: '10:35 AM',
    delivered: true,
    read: true,
  },
  {
    id: 5,
    text: 'Sure! Let me send them to you',
    sender: 'other',
    timestamp: '10:36 AM',
    delivered: true,
    read: true,
  },
  {
    id: 6,
    text: '📄 DSA_Chapter_5_Trees.pdf',
    sender: 'other',
    timestamp: '10:37 AM',
    delivered: true,
    read: true,
    isFile: true,
  },
  {
    id: 7,
    text: 'Thanks a lot! You\'re a lifesaver 🙏',
    sender: 'me',
    timestamp: '10:38 AM',
    delivered: true,
    read: false,
  },
];

export default function ChatPage() {
  const { id, name } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate typing indicator animation
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: messageText,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        delivered: false,
        read: false,
      };
      
      setChatMessages([...chatMessages, newMessage]);
      setMessageText('');
      
      // Simulate message delivery
      setTimeout(() => {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, delivered: true }
              : msg
          )
        );
      }, 1000);

      // Simulate typing response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Add a response message
          const responseMessage = {
            id: chatMessages.length + 2,
            text: 'Got it! 👍',
            sender: 'other',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            delivered: true,
            read: false,
          };
          setChatMessages(prev => [...prev, responseMessage]);
        }, 2000);
      }, 500);
    }
  };

  const renderMessage = (message: typeof messages[0]) => {
    const isMe = message.sender === 'me';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
        <View style={styles.messageWrapper}>
          {message.isFile ? (
            <TouchableOpacity style={[styles.messageBubble, styles.fileBubble, isMe ? styles.myMessageBubble : styles.otherMessageBubble]}>
              <LinearGradient
                colors={isMe ? ['#667eea', '#764ba2'] : ['#F3F4F6', '#E5E7EB']}
                style={styles.fileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                  {message.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={[styles.messageBubble, isMe ? styles.myMessageBubble : styles.otherMessageBubble]}>
              {isMe ? (
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.messageGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.messageText, styles.myMessageText]}>
                    {message.text}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.otherMessageContent}>
                  <Text style={[styles.messageText, styles.otherMessageText]}>
                    {message.text}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        <View style={[styles.messageInfo, isMe ? styles.myMessageInfo : styles.otherMessageInfo]}>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
          {isMe && (
            <View style={styles.messageStatus}>
              <Text style={[styles.deliveryStatus, message.delivered ? styles.delivered : styles.sending]}>
                {message.delivered ? (message.read ? '✓✓' : '✓✓') : '⏱'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.otherMessage]}>
        <View style={styles.messageWrapper}>
          <View style={[styles.messageBubble, styles.otherMessageBubble, styles.typingBubble]}>
            <View style={styles.typingIndicator}>
              <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
              <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
              <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={20} color="#1F2937" strokeWidth={2.5} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerInfo} activeOpacity={0.8}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }} 
                  style={styles.headerImage} 
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerName}>{name || 'User'}</Text>
                <Text style={styles.headerStatus}>
                  {isTyping ? 'typing...' : 'online'}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={18} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Video size={18} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Info size={18} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Messages Container with proper spacing */}
      <View style={styles.chatContainer}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatMessages.map(renderMessage)}
          {renderTypingIndicator()}
        </ScrollView>

        {/* Fixed Input Area */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputWrapper}
        >
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              style={styles.inputGradient}
            >
              <TouchableOpacity style={styles.attachButton}>
                <LinearGradient
                  colors={['#F3F4F6', '#E5E7EB']}
                  style={styles.attachGradient}
                >
                  <Paperclip size={18} color="#6B7280" strokeWidth={2} />
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message..."
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  maxLength={500}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity style={styles.emojiButton}>
                  <Smile size={18} color="#9CA3AF" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.sendButton, messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
                onPress={sendMessage}
                disabled={!messageText.trim()}
                activeOpacity={0.8}
              >
                {messageText.trim() ? (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.sendGradient}
                  >
                    <Send size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </LinearGradient>
                ) : (
                  <View style={styles.sendInactive}>
                    <Send size={16} color="#9CA3AF" strokeWidth={2} />
                  </View>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  headerGradient: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 120, // Extra space to prevent overlap with input
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageWrapper: {
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '100%',
  },
  myMessageBubble: {
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageGradient: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  otherMessageContent: {
    // No additional styling needed
  },
  fileBubble: {
    padding: 0,
    overflow: 'hidden',
  },
  fileGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginRight: 4,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myMessageInfo: {
    justifyContent: 'flex-end',
  },
  otherMessageInfo: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  messageStatus: {
    marginLeft: 6,
  },
  deliveryStatus: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  delivered: {
    color: '#10B981',
  },
  sending: {
    color: '#9CA3AF',
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20, // Extra padding for safe area
  },
  attachButton: {
    marginRight: 12,
  },
  attachGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    maxHeight: 80,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  emojiButton: {
    marginLeft: 8,
    padding: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonInactive: {
    // No additional styling
  },
  sendGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendInactive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});