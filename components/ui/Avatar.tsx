import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  source?: { uri: string };
  size?: number;
  name?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

export function Avatar({ 
  source, 
  size = 40, 
  name, 
  showOnlineStatus = false, 
  isOnline = false 
}: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {source ? (
        <Image 
          source={source} 
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} 
        />
      ) : (
        <View style={[
          styles.placeholder, 
          { width: size, height: size, borderRadius: size / 2 }
        ]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {name ? getInitials(name) : '?'}
          </Text>
        </View>
      )}
      
      {showOnlineStatus && (
        <View style={[
          styles.statusIndicator,
          { 
            width: size * 0.25, 
            height: size * 0.25, 
            borderRadius: size * 0.125,
            bottom: size * 0.05,
            right: size * 0.05,
            backgroundColor: isOnline ? '#10B981' : '#9CA3AF'
          }
        ]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  statusIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});