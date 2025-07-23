import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageSquare, Share, Bookmark, MoveHorizontal as MoreHorizontal, Play, Sparkles, Eye } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = height - 88; // Account for tab bar height

const reels = [
  {
    id: 1,
    username: 'rahul_memes',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    caption: 'When the professor says attendance is mandatory 😂 This is such a relatable moment for every college student. We all know that feeling when you hear those dreaded words and suddenly your weekend plans are ruined. But hey, at least we get to see our classmates suffer together! #CollegeStruggles #AttendanceProblems',
    hashtags: '#CollegeLife #Memes #Attendance #StudentLife #Relatable',
    likes: 12470,
    comments: 892,
    shares: 456,
    views: 45600,
    hasSound: true,
    liked: false,
    saved: false,
    college: 'IIT Delhi',
    timeAgo: '2h',
    isVerified: true,
  },
  {
    id: 2,
    username: 'priya_tech',
    userImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    caption: 'Me after submitting assignment at 11:59 PM 😅 The adrenaline rush is real! Nothing beats the satisfaction of hitting that submit button with just seconds to spare. Procrastination level: Expert. But somehow we always manage to pull it off at the last minute!',
    hashtags: '#LastMinute #StudentLife #Assignment #Procrastination #NightOwl',
    likes: 8920,
    comments: 674,
    shares: 234,
    views: 23400,
    hasSound: false,
    liked: true,
    saved: true,
    college: 'NIT Trichy',
    timeAgo: '4h',
    isVerified: false,
  },
  {
    id: 3,
    username: 'arjun_engineering',
    userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    caption: 'When you finally understand that one concept 🤯 After hours of struggling, watching YouTube tutorials, and questioning your life choices, it finally clicks! That eureka moment is worth all the confusion and frustration. Engineering life in a nutshell!',
    hashtags: '#Engineering #Study #Breakthrough #EurekaMonent #StudentStruggles',
    likes: 21030,
    comments: 1560,
    shares: 780,
    views: 67800,
    hasSound: true,
    liked: false,
    saved: false,
    college: 'BITS Pilani',
    timeAgo: '6h',
    isVerified: true,
  },
];

export default function ReelsPage() {
  const [reelsState, setReelsState] = useState(reels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{[key: number]: boolean}>({});
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const sparkleAnimation = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const toggleLike = (id: number) => {
    // Enhanced like animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(likeAnimation, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(likeAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setReelsState(prev => prev.map(reel => 
      reel.id === id 
        ? { 
            ...reel, 
            liked: !reel.liked,
            likes: reel.liked ? reel.likes - 1 : reel.likes + 1
          }
        : reel
    ));
  };

  const toggleSave = (id: number) => {
    setReelsState(prev => prev.map(reel => 
      reel.id === id 
        ? { ...reel, saved: !reel.saved }
        : reel
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleDescriptionScroll = (reelId: number, event: any) => {
    const { contentOffset } = event.nativeEvent;
    const isExpanded = contentOffset.y > 10; // Expand when scrolled up more than 10px
    
    setExpandedDescriptions(prev => ({
      ...prev,
      [reelId]: isExpanded
    }));
  };

  const getTruncatedCaption = (caption: string, maxLines: number = 2) => {
    const words = caption.split(' ');
    const wordsPerLine = 8; // Approximate words per line
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return caption;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const renderReel = ({ item: reel, index }: { item: typeof reels[0], index: number }) => {
    const isExpanded = expandedDescriptions[reel.id] || false;
    
    return (
      <View style={styles.reelContainer}>
        {/* Background Image */}
        <Image source={{ uri: reel.image }} style={styles.reelImage} />
        
        {/* Subtle Gradient Overlays */}
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.mainGradient}
          locations={[0, 0.3, 1]}
        />

        {/* Minimal Top Actions */}
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topActionButton}>
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}
              style={styles.topActionGradient}
            >
              <MoreHorizontal size={20} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Refined Play Button */}
        <TouchableOpacity style={styles.playButtonContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
            style={styles.playButton}
          >
            <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Medium-sized Side Actions */}
        <View style={styles.sideActions}>
          <View style={styles.actionGroup}>
            {/* Like Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleLike(reel.id)}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContainer}>
                <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
                  <LinearGradient
                    colors={reel.liked ? ['#FF6B6B', '#FF8E53'] : ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}
                    style={styles.actionButtonGradient}
                  >
                    <Heart 
                      size={20} 
                      color="#FFFFFF" 
                      fill={reel.liked ? "#FFFFFF" : "none"}
                      strokeWidth={2}
                    />
                  </LinearGradient>
                </Animated.View>
                
                {/* Sparkle Animation */}
                {reel.liked && (
                  <Animated.View 
                    style={[
                      styles.sparkleContainer,
                      {
                        opacity: sparkleAnimation,
                        transform: [{ scale: sparkleAnimation }]
                      }
                    ]}
                  >
                    <Sparkles size={16} color="#FFD700" />
                  </Animated.View>
                )}
              </View>
              <Text style={styles.actionText}>{formatNumber(reel.likes)}</Text>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}
                style={styles.actionButtonGradient}
              >
                <MessageSquare size={20} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.actionText}>{formatNumber(reel.comments)}</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}
                style={styles.actionButtonGradient}
              >
                <Share size={20} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.actionText}>{formatNumber(reel.shares)}</Text>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleSave(reel.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={reel.saved ? ['#F59E0B', '#F97316'] : ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)']}
                style={styles.actionButtonGradient}
              >
                <Bookmark 
                  size={20} 
                  color="#FFFFFF"
                  fill={reel.saved ? "#FFFFFF" : "none"}
                  strokeWidth={2}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Avatar 
                  source={{ uri: reel.userImage }} 
                  size={40}
                  showOnlineStatus={false}
                />
              </LinearGradient>
              
              {/* Follow Button */}
              <TouchableOpacity style={styles.followButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.followGradient}
                >
                  <Text style={styles.followText}>+</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Content with Smart Description Display */}
        <View style={styles.bottomContent}>
          {/* Views Counter */}
          <View style={styles.viewsContainer}>
            <Eye size={14} color="rgba(255,255,255,0.8)" strokeWidth={2} />
            <Text style={styles.viewsText}>{formatNumber(reel.views)} views</Text>
          </View>

          {/* User Info - Always Visible */}
          <View style={styles.userHeader}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>@{reel.username}</Text>
              {reel.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.timeAgo}>{reel.timeAgo}</Text>
          </View>
          
          <Text style={styles.college}>{reel.college}</Text>

          {/* Scrollable Content Area */}
          <ScrollView 
            style={styles.scrollableContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onScroll={(event) => handleDescriptionScroll(reel.id, event)}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollableContentContainer}
          >
            {/* Caption - Truncated by default, full when expanded */}
            <Text style={styles.caption}>
              {isExpanded ? reel.caption : getTruncatedCaption(reel.caption)}
            </Text>
            
            {/* Show scroll hint if not expanded */}
            {!isExpanded && reel.caption.length > getTruncatedCaption(reel.caption).length && (
              <Text style={styles.scrollHint}>↑ Scroll up to read more</Text>
            )}
            
            {/* Hashtags - Only show when expanded */}
            {isExpanded && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.hashtagsScrollView}
                contentContainerStyle={styles.hashtagsContainer}
              >
                {reel.hashtags.split(' ').map((hashtag, index) => (
                  <TouchableOpacity key={index} style={styles.hashtagButton} activeOpacity={0.8}>
                    <Text style={styles.hashtag}>{hashtag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </ScrollView>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={[styles.progressFill, { width: `${((index + 1) / reelsState.length) * 100}%` }]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reelsState}
        renderItem={renderReel}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />

      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        {reelsState.map((_, index) => (
          <View key={index} style={styles.indicatorContainer}>
            <View 
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot
              ]}
            />
            {index === currentIndex && (
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.activeDotGradient}
              />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  reelContainer: {
    width: width,
    height: ITEM_HEIGHT,
    position: 'relative',
  },
  reelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topActions: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  topActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  topActionGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sideActions: {
    position: 'absolute',
    right: 20,
    bottom: 200,
    alignItems: 'center',
  },
  actionGroup: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileSection: {
    marginTop: 20,
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  profileGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButton: {
    position: 'absolute',
    bottom: -4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  followGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  followText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 100,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verifiedBadge: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  timeAgo: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  college: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#60A5FA',
    marginBottom: 6,
  },
  scrollableContent: {
    maxHeight: 120,
  },
  scrollableContentContainer: {
    paddingBottom: 20,
  },
  caption: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scrollHint: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  hashtagsScrollView: {
    marginTop: 8,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashtagButton: {
    marginRight: 8,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hashtag: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#60A5FA',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  progressBar: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressFill: {
    height: '100%',
  },
  pageIndicator: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -60 }],
    alignItems: 'center',
  },
  indicatorContainer: {
    position: 'relative',
    marginVertical: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: 'transparent',
  },
  activeDotGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: 20,
    borderRadius: 1.5,
  },
});