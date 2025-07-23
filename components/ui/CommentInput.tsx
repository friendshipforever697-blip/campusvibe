import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform 
} from 'react-native';

interface CommentInputProps {
  userAvatar: string;
  onSubmit: (comment: string) => void;
}

export function CommentInput({ userAvatar, onSubmit }: CommentInputProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <View style={styles.container}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          onPress={handleSubmit}
          style={[styles.postButton, { opacity: comment.trim() ? 1 : 0.5 }]}
          disabled={!comment.trim()}
        >
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3897f0',
  },
});