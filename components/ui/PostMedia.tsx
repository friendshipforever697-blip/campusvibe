import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Post } from '@/types';

interface PostMediaProps {
  post: Post;
}

export function PostMedia({ post }: PostMediaProps) {
  const screenWidth = Dimensions.get('window').width;
  const aspectRatio = post.aspectRatio || 1;
  const mediaHeight = screenWidth / aspectRatio;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: post.mediaUrl }}
        style={[styles.media, { width: screenWidth, height: mediaHeight }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  media: {
    backgroundColor: '#f0f0f0',
  },
});