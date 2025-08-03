import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  MoveHorizontal as MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface StoryData {
  id: string;
  username: string;
  avatar: string;
  media: string;
  type: 'photo' | 'video' | 'text';
  timestamp: string;
  likes: number;
  liked: boolean;
  caption?: string;
  textContent?: string;
  duration?: number;
}

const mockStoryData: StoryData = {
  id: '1',
  username: 'sarah_campus',
  avatar:
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  media:
    'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
  type: 'photo',
  timestamp: '2h ago',
  likes: 24,
  liked: false,
  caption: 'Beautiful sunset from the campus library! 📚✨',
  duration: 5000,
};

export default function StoryViewerScreen() {
  const { storyId, username } = useLocalSearchParams();
  const [story, setStory] = useState<StoryData>(mockStoryData);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isPaused) {
      const duration = story.type === 'video' ? 15000 : 5000;

      Animated.timing(progress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start((finished) => {
        if (finished) {
          handleClose();
        }
      });
    }

    return () => {
      progress.stopAnimation();
    };
  }, [isPaused, story]);

  const handleClose = () => {
    router.replace('/(tabs)');
  };

  const handleLike = () => {
    setStory((prev) => ({
      ...prev,
      liked: !prev.liked,
      likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
    }));

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleShare = () => {
    console.log('Share story');
  };

  const togglePlayPause = () => {
  if (isPaused) {
    // If paused, resume
    progress.stopAnimation((currentValue) => {
      const duration = story.type === 'video' ? 15000 : 5000;
      const remainingDuration = duration * (1 - currentValue);

      Animated.timing(progress, {
        toValue: 1,
        duration: remainingDuration,
        useNativeDriver: false,
      }).start((finished) => {
        if (finished) {
          handleClose();
        }
      });
    });
    setIsPaused(false);
    if (story.type === 'video') {
      setIsPlaying(true);
    }
  } else {
    // If playing, pause
    setIsPaused(true);
    if (story.type === 'video') {
      setIsPlaying(false);
    }
    progress.stopAnimation();
  }
};


  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderMedia = () => {
    if (story.type === 'text') {
      return (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.textStoryBackground}
        >
          <Text style={styles.textStoryContent}>
            {story.textContent || story.caption || 'Campus Life! 🎓'}
          </Text>
        </LinearGradient>
      );
    }

    if (story.type === 'video') {
      return (
        <Video
          source={{ uri: story.media }}
          style={styles.media}
          shouldPlay={isPlaying && !isPaused}
          isLooping
          isMuted={isMuted}
          resizeMode={ResizeMode.COVER} // ✅ fix
        />
      );
    }

    return (
      <Image source={{ uri: story.media }} style={styles.media} resizeMode="cover" />
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.mediaContainer}
          activeOpacity={1}
          onPress={togglePlayPause}
        >
          {renderMedia()}

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: story.avatar }} style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.username}>{story.username}</Text>
                <Text style={styles.timestamp}>{story.timestamp}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              {story.type === 'video' && (
                <TouchableOpacity style={styles.headerButton} onPress={toggleMute}>
                  {isMuted ? (
                    <VolumeX size={18} color="white" />
                  ) : (
                    <Volume2 size={18} color="white" />
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.headerButton}>
                <MoreHorizontal size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
                <X size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {isPaused && (
            <View style={styles.playPauseIndicator}>
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
                style={styles.playPauseBackground}
              >
                <Play size={50} color="white" fill="rgba(255, 255, 255, 0.9)" />
              </LinearGradient>
            </View>
          )}

          {story.caption && story.type !== 'text' && (
            <View style={styles.captionContainer}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.captionGradient}
              >
                <Text style={styles.caption}>{story.caption}</Text>
              </LinearGradient>
            </View>
          )}

          <View style={styles.bottomActions}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Heart
                  size={28}
                  color={story.liked ? '#ff6b6b' : 'white'}
                  fill={story.liked ? '#ff6b6b' : 'transparent'}
                />
                <Text style={styles.actionText}>{story.likes}</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={28} color="white" />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Send size={28} color="white" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.topGradient}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.bottomGradient}
          pointerEvents="none"
        />
      </View>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  mediaContainer: {
    flex: 1,
  },
  media: {
    width: width,
    height: height,
  },
  textStoryBackground: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  textStoryContent: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
  },
  progressContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  progressBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'white',
    borderRadius: 1.5,
  },
  header: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    borderRadius: 50,
    overflow: 'hidden',
    zIndex: 10,
  },
  playPauseBackground: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  captionGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  caption: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    gap: 20,
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 5,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 5,
  },
});