import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
  ListRenderItem,
  Text,
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
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserAvatar = 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400';

  const loadInitialData = useCallback(() => {
    const initialPosts = Array.from({ length: 5 }, (_, index) =>
      generateMockPost(parseInt(id || '1') + index - 2)
    );

    console.log('✅ Generated initial posts:', initialPosts);

    setPosts(initialPosts);
    setCurrentPostIndex(2);
    buildFeedItems(initialPosts, 2);
  }, [id]);

  const buildFeedItems = (allPosts: Post[], currentIndex: number) => {
    const currentPost = allPosts[currentIndex];
    console.log('🔍 Building feedItems — currentPost:', currentPost);

    if (!currentPost || !currentPost.user) {
      console.log('❌ No currentPost or user!');
      return;
    }

    const items: FeedItem[] = [
      { type: 'post', data: currentPost },
    ];

    currentPost.comments.forEach(comment => {
      items.push({ type: 'comment', data: comment, postId: currentPost.id });
    });

    console.log('✅ New feedItems:', items);

    setFeedItems(items);
  };

  const loadOlderPosts = useCallback(() => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      const newPosts = Array.from({ length: 3 }, (_, index) =>
        generateMockPost(posts.length + index)
      );

      const updatedPosts = [...posts, ...newPosts];
      setPosts(updatedPosts);
      setLoading(false);
    }, 500);
  }, [posts, loading]);

  const loadNewerPosts = useCallback(() => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      const newPosts = Array.from({ length: 3 }, (_, index) =>
        generateMockPost(-3 + index)
      );

      const updatedPosts = [...newPosts, ...posts];
      setPosts(updatedPosts);
      setCurrentPostIndex(currentPostIndex + 3);
      setLoading(false);
    }, 500);
  }, [posts, currentPostIndex, loading]);

  const navigateToPost = (direction: 'next' | 'previous') => {
    let newIndex = currentPostIndex;

    if (direction === 'next' && currentPostIndex < posts.length - 1) {
      newIndex = currentPostIndex + 1;
    } else if (direction === 'previous' && currentPostIndex > 0) {
      newIndex = currentPostIndex - 1;
    } else if (direction === 'next' && currentPostIndex >= posts.length - 2) {
      loadOlderPosts();
      return;
    } else if (direction === 'previous' && currentPostIndex <= 1) {
      loadNewerPosts();
      return;
    }

    if (newIndex !== currentPostIndex) {
      setCurrentPostIndex(newIndex);
      buildFeedItems(posts, newIndex);
    }
  };

  const handleLikePost = useCallback(() => {
    const updatedPosts = [...posts];
    const currentPost = updatedPosts[currentPostIndex];

    if (currentPost) {
      currentPost.isLiked = !currentPost.isLiked;
      currentPost.likesCount += currentPost.isLiked ? 1 : -1;
      setPosts(updatedPosts);
      buildFeedItems(updatedPosts, currentPostIndex);
    }
  }, [posts, currentPostIndex]);

  const handleLikeComment = useCallback((commentId: string) => {
    const updatedPosts = [...posts];
    const currentPost = updatedPosts[currentPostIndex];

    if (currentPost) {
      const comment = currentPost.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likesCount = (comment.likesCount || 0) + (comment.isLiked ? 1 : -1);
        setPosts(updatedPosts);
        buildFeedItems(updatedPosts, currentPostIndex);
      }
    }
  }, [posts, currentPostIndex]);

  const handleAddComment = useCallback((commentText: string) => {
    const updatedPosts = [...posts];
    const currentPost = updatedPosts[currentPostIndex];

    if (currentPost) {
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        user: {
          id: 'current_user',
          username: 'you',
          avatar: currentUserAvatar,
        },
        text: commentText,
        timestamp: new Date(),
        likesCount: 0,
        isLiked: false,
      };

      currentPost.comments.push(newComment);
      currentPost.commentsCount += 1;
      setPosts(updatedPosts);
      buildFeedItems(updatedPosts, currentPostIndex);
    }
  }, [posts, currentPostIndex, currentUserAvatar]);

  const handleBackPress = () => router.back();
  const handleOptionsPress = () => Alert.alert('Options', 'Post options menu');
  const handleUserPress = () => Alert.alert('User Profile', 'Navigate to user profile');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadInitialData();
      setRefreshing(false);
    }, 1000);
  }, [loadInitialData]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const isNearTop = scrollPosition < 100;
    const isNearBottom = scrollPosition > contentSize.height - layoutMeasurement.height - 100;

    if (isNearTop && !loading) navigateToPost('previous');
    else if (isNearBottom && !loading) navigateToPost('next');
  }, [loading]);

  const renderItem: ListRenderItem<FeedItem> = ({ item }) => {
    if (!item?.data) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red' }}>⚠️ Empty feed item!</Text>
        </View>
      );
    }

    if (item.type === 'post') {
      const post = item.data as Post;

      if (!post?.user) {
        return (
          <View style={{ padding: 20 }}>
            <Text style={{ color: 'red' }}>⚠️ Missing user on post!</Text>
          </View>
        );
      }

      return (
        <View>
          <PostMedia post={post} />
          <PostInfo
            post={post}
            onLikePress={handleLikePost}
            onUserPress={handleUserPress}
          />
        </View>
      );
    } else {
      const comment = item.data as Comment;
      return (
        <CommentItem
          comment={comment}
          onUserPress={handleUserPress}
          onLikePress={() => handleLikeComment(comment.id)}
        />
      );
    }
  };

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
        keyExtractor={(item, index) => `${item.type}_${index}`}
        style={styles.feed}
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
  feed: {
    flex: 1,
  },
});
