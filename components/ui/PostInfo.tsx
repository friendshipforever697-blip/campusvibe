import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle } from 'lucide-react-native';
import { Post } from '@/types';

interface PostInfoProps {
  post: Post;
  onLikePress: () => void;
  onUserPress: () => void;
}

export function PostInfo({ post, onLikePress, onUserPress }: PostInfoProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <TouchableOpacity onPress={onUserPress} style={styles.userInfo}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onLikePress} style={styles.actionButton}>
          <Heart 
            size={24} 
            color={post.isLiked ? '#ff3040' : '#000'} 
            fill={post.isLiked ? '#ff3040' : 'none'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Likes Count */}
      <Text style={styles.likesCount}>
        {post.likesCount.toLocaleString()} likes
      </Text>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{post.user.username}</Text>
          {' '}
          {post.caption}
        </Text>
      </View>

      {/* Comments Count */}
      {post.commentsCount > 0 && (
        <Text style={styles.commentsCount}>
          View all {post.commentsCount} comments
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  captionContainer: {
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    color: '#000',
  },
  captionUsername: {
    fontWeight: '600',
  },
  commentsCount: {
    fontSize: 14,
    color: '#666',
  },
});