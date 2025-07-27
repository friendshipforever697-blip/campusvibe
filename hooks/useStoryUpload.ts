import { useState } from 'react';
import { Alert } from 'react-native';

interface StoryData {
  mediaUri: string;
  mediaType: 'photo' | 'video';
  textOverlays: any[];
  stickerOverlays: any[];
  location?: string;
  music?: string;
  timestamp: string;
  expiresAt: string;
}

export const useStoryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadStory = async (storyData: StoryData): Promise<boolean> => {
    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Upload media to cloud storage (AWS S3, Cloudinary, etc.)
      // 2. Save story metadata to database
      // 3. Set expiration timer for 24 hours
      
      console.log('Story uploaded:', storyData);
      
      Alert.alert(
        'Vibe Uploaded! 🎉',
        'Your story has been shared successfully and will be visible for 24 hours.',
        [{ text: 'Awesome!', style: 'default' }]
      );
      
      setIsUploading(false);
      return true;
    } catch (error) {
      console.error('Story upload failed:', error);
      Alert.alert(
        'Upload Failed',
        'Something went wrong while uploading your story. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      setIsUploading(false);
      return false;
    }
  };

  return {
    uploadStory,
    isUploading,
  };
};