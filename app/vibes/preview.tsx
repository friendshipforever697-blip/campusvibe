import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Dimensions, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Type, Smile, MapPin, Music, Palette, Upload, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStoryUpload } from '@/hooks/useStoryUpload';

const { width, height } = Dimensions.get('window');

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
}

interface StickerOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

const textColors = ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
const stickers = ['😂', '❤️', '🔥', '👏', '🎉', '💯', '✨', '🙌', '😍', '🤔', '💪', '🎯'];

export default function PreviewScreen() {
  const { mediaUri, mediaType } = useLocalSearchParams<{ mediaUri: string; mediaType: string }>();
  const { uploadStory, isUploading } = useStoryUpload();
  
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [stickerOverlays, setStickerOverlays] = useState<StickerOverlay[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [selectedTextColor, setSelectedTextColor] = useState('#FFFFFF');
  const [location, setLocation] = useState('');
  const [music, setMusic] = useState('');

  const textInputRef = useRef<TextInput>(null);

  const addTextOverlay = () => {
    if (currentText.trim()) {
      const newOverlay: TextOverlay = {
        id: Date.now().toString(),
        text: currentText,
        x: width / 2 - 50,
        y: height / 2 - 100,
        color: selectedTextColor,
        fontSize: 24,
        fontWeight: 'bold',
      };
      setTextOverlays([...textOverlays, newOverlay]);
      setCurrentText('');
      setShowTextInput(false);
    }
  };

  const addSticker = (emoji: string) => {
    const newSticker: StickerOverlay = {
      id: Date.now().toString(),
      emoji,
      x: width / 2 - 25,
      y: height / 2 - 100,
      size: 50,
    };
    setStickerOverlays([...stickerOverlays, newSticker]);
    setShowStickers(false);
  };

  const handleUpload = async () => {
    if (!mediaUri) {
      Alert.alert('Error', 'No media selected');
      return;
    }

    const storyData = {
      mediaUri,
      mediaType: mediaType as 'photo' | 'video',
      textOverlays,
      stickerOverlays,
      location,
      music,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    const success = await uploadStory(storyData);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Media Preview */}
      <View style={styles.mediaContainer}>
        <Image source={{ uri: mediaUri }} style={styles.media} />
        
        {/* Text Overlays */}
        {textOverlays.map((overlay) => (
          <View
            key={overlay.id}
            style={[
              styles.textOverlay,
              {
                left: overlay.x,
                top: overlay.y,
              }
            ]}
          >
            <Text
              style={[
                styles.overlayText,
                {
                  color: overlay.color,
                  fontSize: overlay.fontSize,
                  fontWeight: overlay.fontWeight,
                }
              ]}
            >
              {overlay.text}
            </Text>
          </View>
        ))}

        {/* Sticker Overlays */}
        {stickerOverlays.map((sticker) => (
          <View
            key={sticker.id}
            style={[
              styles.stickerOverlay,
              {
                left: sticker.x,
                top: sticker.y,
              }
            ]}
          >
            <Text style={[styles.stickerText, { fontSize: sticker.size }]}>
              {sticker.emoji}
            </Text>
          </View>
        ))}

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={() => router.back()}>
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
              style={styles.topButtonGradient}
            >
              <X size={24} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Editing Tools */}
        <View style={styles.editingTools}>
          <TouchableOpacity 
            style={styles.toolButton} 
            onPress={() => setShowTextInput(true)}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.toolButtonGradient}
            >
              <Type size={24} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolButton} 
            onPress={() => setShowStickers(true)}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.toolButtonGradient}
            >
              <Smile size={24} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.toolButtonGradient}
            >
              <MapPin size={24} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.toolButtonGradient}
            >
              <Music size={24} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Text Input Modal */}
      {showTextInput && (
        <View style={styles.textInputModal}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
            style={styles.textInputGradient}
          >
            <View style={styles.textInputContainer}>
              <TextInput
                ref={textInputRef}
                style={[styles.textInput, { color: selectedTextColor }]}
                placeholder="Add text..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={currentText}
                onChangeText={setCurrentText}
                multiline
                autoFocus
              />
              
              {/* Color Picker */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.colorPicker}
                contentContainerStyle={styles.colorPickerContent}
              >
                {textColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      selectedTextColor === color && styles.selectedColorButton
                    ]}
                    onPress={() => setSelectedTextColor(color)}
                  />
                ))}
              </ScrollView>

              <View style={styles.textInputActions}>
                <TouchableOpacity 
                  style={styles.textActionButton}
                  onPress={() => setShowTextInput(false)}
                >
                  <Text style={styles.textActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textActionButton}
                  onPress={addTextOverlay}
                >
                  <Text style={[styles.textActionText, styles.textActionDone]}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Stickers Modal */}
      {showStickers && (
        <View style={styles.stickersModal}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
            style={styles.stickersGradient}
          >
            <View style={styles.stickersContainer}>
              <Text style={styles.stickersTitle}>Add Stickers</Text>
              <ScrollView 
                contentContainerStyle={styles.stickersGrid}
                showsVerticalScrollIndicator={false}
              >
                {stickers.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.stickerButton}
                    onPress={() => addSticker(emoji)}
                  >
                    <Text style={styles.stickerEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={styles.closeStickerButton}
                onPress={() => setShowStickers(false)}
              >
                <Text style={styles.closeStickerText}>Close</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Upload Button */}
      <View style={styles.uploadContainer}>
        <TouchableOpacity 
          style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={isUploading}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.uploadButtonGradient}
          >
            <Upload size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>
              {isUploading ? 'Uploading...' : 'Share Vibe'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  textOverlay: {
    position: 'absolute',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayText: {
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  stickerOverlay: {
    position: 'absolute',
  },
  stickerText: {
    textAlign: 'center',
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topButton: {
    // No additional styles needed
  },
  topButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editingTools: {
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: [{ translateY: -100 }],
    alignItems: 'center',
  },
  toolButton: {
    marginBottom: 16,
  },
  toolButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textInputModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 20,
    minHeight: 60,
  },
  colorPicker: {
    marginBottom: 20,
  },
  colorPickerContent: {
    alignItems: 'center',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  textInputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textActionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textActionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  textActionDone: {
    color: '#4ECDC4',
  },
  stickersModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  stickersGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  stickersContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: '100%',
  },
  stickersTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  stickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerButton: {
    width: 60,
    height: 60,
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerEmoji: {
    fontSize: 32,
  },
  closeStickerButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeStickerText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  uploadContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});