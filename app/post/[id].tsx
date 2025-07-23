import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PostHeader } from '@/components/ui/PostHeader';
import { PostMedia } from '@/components/ui/PostMedia';
import { PostInfo } from '@/components/ui/PostInfo';
import { CommentItem } from '@/components/ui/CommentItem';
import { CommentInput } from '@/components/ui/CommentInput';

import { Post, Comment } from '@/types';
import { generateMockPost } from '@/data/mockData';

interface FeedItem {
  type: 'post' | 'comment';
  data: Post | Comment;
  postId?: string;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserAvatar = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400';

  const buildFeedItems = useCallback((allPosts: Post[]) => {
    const items: FeedItem[] = [];

    allPosts.forEach(post => {
      items.push({ type: 'post', data: post });
      post.comments.forEach(comment => {
        items.push({ type: 'comment', data: comment, postId: post.id });
      });
    });

    setFeedItems(items);
  }, []);

  const loadInitialData = useCallback(() => {
    const initialPosts = Array.from({ length: 5 }, (_, index) =>
      generateMockPost(parseInt(id || '1') + index)
    );
    setPosts(initialPosts);
    buildFeedItems(initialPosts);
  }, [id, buildFeedItems]);

  const loadOlderPosts = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newPosts = Array.from({ length: 3 }, (_, index) =>
        generateMockPost(posts.length + index)
      );
      const updated = [...posts, ...newPosts];
      setPosts(updated);
      buildFeedItems(updated);
      setLoading(false);
    }, 600);
  }, [posts, loading, buildFeedItems]);

  const loadNewerPosts = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newPosts = Array.from({ length: 3 }, (_, index) =>
        generateMockPost(-3 - index)
      );
      const updated = [...newPosts, ...posts];
      setPosts(updated);
      buildFeedItems(updated);
      setLoading(false);
    }, 600);
  }, [posts, loading, buildFeedItems]);

 const handleScroll = useCallback(
  (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;

    if (scrollY < 50 && !loading) {
      loadNewerPosts();
    } else if (
      scrollY + layoutMeasurement.height >= contentSize.height - 50 &&
      !loading
    ) {
      loadOlderPosts();
    }
  },
  [loadOlderPosts, loadNewerPosts, loading]
);


  const handleLikePost = useCallback((postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const liked = !p.isLiked;
        return {
          ...p,
          isLiked: liked,
          likesCount: p.likesCount + (liked ? 1 : -1),
        };
      }
      return p;
    });
    setPosts(updated);
    buildFeedItems(updated);
  }, [posts, buildFeedItems]);

  const handleLikeComment = useCallback((commentId: string) => {
    const updated = posts.map(post => ({
      ...post,
      comments: post.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: (comment.likesCount || 0) + (comment.isLiked ? -1 : 1),
            }
          : comment
      ),
    }));
    setPosts(updated);
    buildFeedItems(updated);
  }, [posts, buildFeedItems]);

  const handleAddComment = useCallback((text: string) => {
    const updated = [...posts];
    const firstPost = updated[0];

    const newComment: Comment = {
  id: `comment_${Date.now()}`,
  user: {
    id: 'current',
    username: 'you',
    displayName: 'You',
    collegeName: 'Your College Name',
    avatar: currentUserAvatar,
  },
  text,
  timestamp: new Date(),
  likesCount: 0,
  isLiked: false,
};


    firstPost.comments.push(newComment);
    firstPost.commentsCount += 1;

    setPosts(updated);
    buildFeedItems(updated);
  }, [posts, buildFeedItems]);

  const renderItem: ListRenderItem<FeedItem> = ({ item }) => {
    if (item.type === 'post') {
      const post = item.data as Post;
      return (
        <View>
          <PostMedia post={post} />
          <PostInfo
            post={post}
            onLikePress={() => handleLikePost(post.id)}
            onUserPress={() => Alert.alert('Profile')}
          />
        </View>
      );
    }
    const comment = item.data as Comment;
    return (
      <CommentItem
        comment={comment}
        onUserPress={() => Alert.alert('Profile')}
        onLikePress={() => handleLikeComment(comment.id)}
      />
    );
  };

  const handleBackPress = () => router.back();
  const handleOptionsPress = () => Alert.alert('Options', 'Options menu');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadInitialData();
      setRefreshing(false);
    }, 1000);
  }, [loadInitialData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <PostHeader onBackPress={handleBackPress} onOptionsPress={handleOptionsPress} />
      <FlatList
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}_${item.postId || ''}_${index}`}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#999" />
        }
        showsVerticalScrollIndicator={false}
      />
      <CommentInput userAvatar={currentUserAvatar} onSubmit={handleAddComment} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
