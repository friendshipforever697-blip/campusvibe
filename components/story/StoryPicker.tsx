import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary, MediaType, ImagePickerResponse } from 'react-native-image-picker';

interface StoryPickerProps {
  onMediaSelected: (uri: string, type: 'photo' | 'video') => void;
}

export const StoryPicker = React.forwardRef<any, StoryPickerProps>(({ onMediaSelected }, ref) => {
  const showMediaPicker = () => {
    Alert.alert(
      'Create Your Vibe',
      'Choose how you want to create your story',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      videoQuality: 'medium' as const,
      durationLimit: 30,
    };

    launchCamera(options, handleMediaResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'mixed' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, handleMediaResponse);
  };

  const handleMediaResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorMessage) {
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      const mediaType = asset.type?.startsWith('video') ? 'video' : 'photo';
      
      if (asset.uri) {
        onMediaSelected(asset.uri, mediaType);
      }
    }
  };

  React.useImperativeHandle(ref, () => ({
    showMediaPicker,
  }));

  // This component doesn't render anything visible - it's just for logic
  return <View style={styles.hidden} />;
});

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});