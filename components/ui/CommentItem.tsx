// components/ui/CommentItem.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
  onUserPress: () => void;
  onLikePress: () => void;
}

export function CommentItem({ comment, onUserPress, onLikePress }: CommentItemProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onUserPress}>
        <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity onPress={onUserPress}>
          <Text style={styles.username}>{comment.user.username}</Text>
        </TouchableOpacity>

        <Text style={styles.text}>{comment.text}</Text>

        <View style={styles.footer}>
          <Text style={styles.time}>{formatTimeAgo(comment.timestamp)}</Text>
          <TouchableOpacity onPress={onLikePress}>
            <Text style={styles.like}>{comment.isLiked ? '❤️' : '🤍'} {comment.likesCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  text: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  like: {
    fontSize: 12,
    color: '#e74c3c',
  },
});
