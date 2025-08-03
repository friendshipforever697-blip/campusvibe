import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

interface StoryRingProps {
  avatar: string;
  username: string;
  hasStory?: boolean;
  viewed?: boolean;
  isYourStory?: boolean;
  onPress: () => void;
  size?: number;
}

export function StoryRing({ 
  avatar, 
  username, 
  hasStory = false, 
  viewed = false, 
  isYourStory = false, 
  onPress,
  size = 70 
}: StoryRingProps) {
  const ringColors = hasStory 
    ? (viewed ? ['#9CA3AF', '#D1D5DB'] : ['#667eea', '#764ba2', '#f093fb'])
    : ['#E5E7EB', '#F3F4F6'];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.storyRing, { width: size, height: size }]}>
        {hasStory || isYourStory ? (
          <LinearGradient
            colors={ringColors}
            style={[styles.gradient, { width: size, height: size, borderRadius: size / 2 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.imageWrapper, { 
              width: size - 6, 
              height: size - 6, 
              borderRadius: (size - 6) / 2 
            }]}>
              <Image 
                source={{ uri: avatar }} 
                style={[styles.avatar, { 
                  width: size - 10, 
                  height: size - 10, 
                  borderRadius: (size - 10) / 2 
                }]} 
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.noStoryContainer, { 
            width: size, 
            height: size, 
            borderRadius: size / 2 
          }]}>
            <Image 
              source={{ uri: avatar }} 
              style={[styles.avatar, { 
                width: size - 4, 
                height: size - 4, 
                borderRadius: (size - 4) / 2 
              }]} 
            />
          </View>
        )}
        
        {isYourStory && (
          <View style={[styles.addButton, { 
            bottom: -2, 
            right: -2, 
            width: size * 0.3, 
            height: size * 0.3,
            borderRadius: size * 0.15 
          }]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={[styles.addButtonGradient, { 
                width: size * 0.3, 
                height: size * 0.3,
                borderRadius: size * 0.15 
              }]}
            >
              <Plus size={size * 0.2} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>
        )}
      </View>
      
      <Text style={[styles.username, { width: size + 10 }]} numberOfLines={1}>
        {username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
  },
  storyRing: {
    position: 'relative',
    marginBottom: 6,
  },
  gradient: {
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noStoryContainer: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    resizeMode: 'cover',
  },
  addButton: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    textAlign: 'center',
  },
});