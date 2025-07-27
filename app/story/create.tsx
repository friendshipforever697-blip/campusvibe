import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StoryPicker } from '@/components/story/StoryPicker';
import { StoryEditor } from '@/components/story/StoryEditor';
import { useStoryUpload } from '@/hooks/useStoryUpload';

export default function CreateStoryScreen() {
  const [selectedMedia, setSelectedMedia] = useState<{
    uri: string;
    type: 'photo' | 'video';
  } | null>(null);
  
  const { uploadStory, isUploading } = useStoryUpload();
  const storyPickerRef = useRef<any>(null);

  const handleMediaSelected = (uri: string, type: 'photo' | 'video') => {
    setSelectedMedia({ uri, type });
  };

  const handleUpload = async (storyData: any) => {
    const success = await uploadStory(storyData);
    if (success) {
      router.back();
    }
  };

  const handleClose = () => {
    setSelectedMedia(null);
    router.back();
  };

  // Auto-trigger media picker when screen loads
  React.useEffect(() => {
    if (!selectedMedia) {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        if (storyPickerRef.current) {
          storyPickerRef.current.showMediaPicker();
        }
      }, 100);
    }
  }, [selectedMedia]);

  return (
    <SafeAreaView style={styles.container}>
      {selectedMedia ? (
        <StoryEditor
          mediaUri={selectedMedia.uri}
          mediaType={selectedMedia.type}
          onClose={handleClose}
          onUpload={handleUpload}
        />
      ) : (
        <View style={styles.pickerContainer}>
          <StoryPicker
            ref={storyPickerRef}
            onMediaSelected={handleMediaSelected}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});