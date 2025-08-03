import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, PanGestureHandler, State } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Heart, Send, MoveHorizontal as MoreHorizontal, Pause, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  username: string;
  avatar: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  timestamp: Date;
  viewed: boolean;
}

const mockStories: Story[] = [
  {
    id: '1',
    username: 'Rahul',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    mediaUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaType: 'photo',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    viewed: false,
  },
  {
    id: '2',
    username: 'Priya',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    mediaUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaType: 'photo',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    viewed: true,
  },
  {
    id: '3',
    username: 'Arjun',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
    mediaUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    mediaType: 'photo',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    viewed: false,
  },
];

export default function ViewerScreen() {
  const { storyId, username } = useLocalSearchParams<{ storyId: string; username: string }>();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState(mockStories);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const progressRef = useRef<any>(null);

  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    // Find initial story index
    const initialIndex = stories.findIndex(story => story.id === storyId);
    if (initialIndex !== -1) {
      setCurrentIndex(initialIndex);
    }
  }, [storyId, stories]);

  useEffect(() => {
    if (!isPaused) {
      startProgress();
    } else {
      pauseProgress();
    }

    return () => {
      if (progressRef.current) {
        progressRef.current.stop();
      }
    };
  }, [currentIndex, isPaused]);

  const startProgress = () => {
    progressAnimation.setValue(0);
    progressRef.current = Animated.timing(progressAnimation, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    
    progressRef.current.start(({ finished }) => {
      if (finished && !isPaused) {
        nextStory();
      }
    });
  };

  const pauseProgress = () => {
    if (progressRef.current) {
      progressRef.current.stop();
    }
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.back();
    }
  };

  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.back();
    }
  };

  const handleTap = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenMiddle = width / 2;
    
    if (locationX < screenMiddle) {
      previousStory();
    } else {
      nextStory();
    }
  };

  const handleLongPress = () => {
    setIsPaused(true);
    Animated.spring(scaleAnimation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPressEnd = () => {
    setIsPaused(false);
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Animate heart
    Animated.sequence([
      Animated.spring(scaleAnimation, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const currentStory = stories[currentIndex];

  if (!currentStory) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.storyContainer, { transform: [{ scale: scaleAnimation }] }]}>
          {/* Background Image */}
          <TouchableOpacity
            style={styles.mediaContainer}
            onPress={handleTap}
            onLongPress={handleLongPress}
            onPressOut={handleLongPressEnd}
            activeOpacity={1}
          >
            <Image source={{ uri: currentStory.mediaUrl }} style={styles.media} />
            
            {/* Gradient Overlays */}
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.4)']}
              style={styles.mediaGradient}
              locations={[0, 0.3, 1]}
            />
          </TouchableOpacity>

          {/* Progress Bars */}
          <View style={styles.progressContainer}>
            {stories.map((_, index) => (
              <View key={index} style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground} />
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: index === currentIndex 
                        ? progressAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : index < currentIndex ? '100%' : '0%'
                    }
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Top Controls */}
          <View style={styles.topControls}>
            <View style={styles.userInfo}>
              <Image source={{ uri: currentStory.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.username}>{currentStory.username}</Text>
                <Text style={styles.timestamp}>{formatTimeAgo(currentStory.timestamp)}</Text>
              </View>
            </View>

            <View style={styles.topActions}>
              {isPaused ? (
                <TouchableOpacity style={styles.topButton} onPress={() => setIsPaused(false)}>
                  <Play size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.topButton} onPress={() => setIsPaused(true)}>
                  <Pause size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.topButton}>
                <MoreHorizontal size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.topButton} onPress={() => router.back()}>
                <X size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.replyButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.replyButtonGradient}
              >
                <Text style={styles.replyButtonText}>Reply to {currentStory.username}...</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <LinearGradient
                colors={isLiked ? ['#FF6B6B', '#FF8E53'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.actionButtonGradient}
              >
                <Heart 
                  size={24} 
                  color="#FFFFFF" 
                  fill={isLiked ? "#FFFFFF" : "none"}
                  strokeWidth={2}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.actionButtonGradient}
              >
                <Send size={24} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Navigation Hints */}
          <View style={styles.navigationHints}>
            <View style={styles.navigationHint}>
              <Text style={styles.navigationHintText}>← Tap</Text>
            </View>
            <View style={styles.navigationHint}>
              <Text style={styles.navigationHintText}>Tap →</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  storyContainer: {
    flex: 1,
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    height: 3,
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 2,
    position: 'relative',
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  topControls: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 25,
    overflow: 'hidden',
  },
  replyButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  replyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  actionButton: {
    marginLeft: 8,
    borderRadius: 22,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationHints: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    transform: [{ translateY: -20 }],
  },
  navigationHint: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navigationHintText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.6)',
  },
});