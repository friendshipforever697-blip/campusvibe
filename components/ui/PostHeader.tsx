import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface PostHeaderProps {
  onBackPress: () => void;
  onOptionsPress: () => void;
}

export function PostHeader({ onBackPress, onOptionsPress }: PostHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Post</Text>
      
      <TouchableOpacity onPress={onOptionsPress} style={styles.optionsButton}>
        <MoreHorizontal size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  optionsButton: {
    padding: 8,
  },
});