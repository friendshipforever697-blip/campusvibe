import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X,
  Type,
  Smile,
  MapPin,
  Music,
  Upload,
  Palette,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  color: string;
  fontSize: number;
}

interface StickerOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
}

interface StoryEditorProps {
  mediaUri: string;
  mediaType: 'photo' | 'video';
  onClose: () => void;
  onUpload: (storyData: any) => void;
}

const colors = ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
const emojis = ['😀', '😍', '🔥', '💯', '✨', '🎉', '❤️', '👍', '🙌', '💪', '🌟', '🎊'];

export const StoryEditor: React.FC<StoryEditorProps> = ({
  mediaUri,
  mediaType,
  onClose,
  onUpload,
}) => {
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [stickerOverlays, setStickerOverlays] = useState<StickerOverlay[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [location, setLocation] = useState('');
  const [music, setMusic] = useState('');

  const addTextOverlay = () => {
    if (currentText.trim()) {
      const newOverlay: TextOverlay = {
        id: Date.now().toString(),
        text: currentText,
        x: screenWidth / 2 - 50,
        y: screenHeight / 2 - 100,
        scale: 1,
        color: selectedColor,
        fontSize: 24,
      };
      setTextOverlays([...textOverlays, newOverlay]);
      setCurrentText('');
      setShowTextInput(false);
    }
  };

  const addStickerOverlay = (emoji: string) => {
    const newSticker: StickerOverlay = {
      id: Date.now().toString(),
      emoji,
      x: screenWidth / 2 - 25,
      y: screenHeight / 2 - 100,
      scale: 1,
    };
    setStickerOverlays([...stickerOverlays, newSticker]);
    setShowEmojiPicker(false);
  };

  const handleUpload = () => {
    const storyData = {
      mediaUri,
      mediaType,
      textOverlays,
      stickerOverlays,
      location,
      music,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    onUpload(storyData);
  };

  const DraggableText: React.FC<{ overlay: TextOverlay; index: number }> = ({ overlay, index }) => {
    const translateX = useSharedValue(overlay.x);
    const translateY = useSharedValue(overlay.y);
    const scale = useSharedValue(overlay.scale);

    const panGestureHandler = useAnimatedGestureHandler({
      onStart: (_, context: any) => {
        context.startX = translateX.value;
        context.startY = translateY.value;
      },
      onActive: (event, context) => {
        translateX.value = context.startX + event.translationX;
        translateY.value = context.startY + event.translationY;
      },
      onEnd: () => {
        runOnJS(updateTextPosition)(index, translateX.value, translateY.value);
      },
    });

    const pinchGestureHandler = useAnimatedGestureHandler({
      onStart: (_, context: any) => {
        context.startScale = scale.value;
      },
      onActive: (event, context) => {
        scale.value = context.startScale * event.scale;
      },
      onEnd: () => {
        runOnJS(updateTextScale)(index, scale.value);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    const updateTextPosition = (idx: number, x: number, y: number) => {
      setTextOverlays(prev => prev.map((item, i) => 
        i === idx ? { ...item, x, y } : item
      ));
    };

    const updateTextScale = (idx: number, newScale: number) => {
      setTextOverlays(prev => prev.map((item, i) => 
        i === idx ? { ...item, scale: newScale } : item
      ));
    };

    return (
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.draggableText, animatedStyle]}>
              <Text
                style={[
                  styles.overlayText,
                  {
                    color: overlay.color,
                    fontSize: overlay.fontSize,
                    textShadowColor: overlay.color === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  },
                ]}
              >
                {overlay.text}
              </Text>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    );
  };

  const DraggableSticker: React.FC<{ overlay: StickerOverlay; index: number }> = ({ overlay, index }) => {
    const translateX = useSharedValue(overlay.x);
    const translateY = useSharedValue(overlay.y);
    const scale = useSharedValue(overlay.scale);

    const panGestureHandler = useAnimatedGestureHandler({
      onStart: (_, context: any) => {
        context.startX = translateX.value;
        context.startY = translateY.value;
      },
      onActive: (event, context) => {
        translateX.value = context.startX + event.translationX;
        translateY.value = context.startY + event.translationY;
      },
      onEnd: () => {
        runOnJS(updateStickerPosition)(index, translateX.value, translateY.value);
      },
    });

    const pinchGestureHandler = useAnimatedGestureHandler({
      onStart: (_, context: any) => {
        context.startScale = scale.value;
      },
      onActive: (event, context) => {
        scale.value = context.startScale * event.scale;
      },
      onEnd: () => {
        runOnJS(updateStickerScale)(index, scale.value);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    const updateStickerPosition = (idx: number, x: number, y: number) => {
      setStickerOverlays(prev => prev.map((item, i) => 
        i === idx ? { ...item, x, y } : item
      ));
    };

    const updateStickerScale = (idx: number, newScale: number) => {
      setStickerOverlays(prev => prev.map((item, i) => 
        i === idx ? { ...item, scale: newScale } : item
      ));
    };

    return (
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.draggableSticker, animatedStyle]}>
              <Text style={styles.stickerEmoji}>{overlay.emoji}</Text>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Media Background */}
      <View style={styles.mediaContainer}>
        <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="cover" />
        
        {/* Overlays */}
        {textOverlays.map((overlay, index) => (
          <DraggableText key={overlay.id} overlay={overlay} index={index} />
        ))}
        
        {stickerOverlays.map((overlay, index) => (
          <DraggableSticker key={overlay.id} overlay={overlay} index={index} />
        ))}
      </View>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.controlsGradient}
        >
          <View style={styles.toolsContainer}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => setShowTextInput(true)}
            >
              <Type size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => setShowEmojiPicker(true)}
            >
              <Smile size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => Alert.alert('Location', 'Add location feature')}
            >
              <MapPin size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
            
            {mediaType === 'video' && (
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => Alert.alert('Music', 'Add music feature')}
              >
                <Music size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.uploadGradient}
            >
              <Upload size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.uploadText}>Upload Vibe</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Text Input Modal */}
      {showTextInput && (
        <View style={styles.modalOverlay}>
          <View style={styles.textInputModal}>
            <Text style={styles.modalTitle}>Add Text</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your text..."
              value={currentText}
              onChangeText={setCurrentText}
              multiline
              autoFocus
            />
            
            <View style={styles.colorPicker}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowTextInput(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={addTextOverlay}>
                <Text style={styles.addButtonText}>Add Text</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.emojiModal}>
            <Text style={styles.modalTitle}>Add Sticker</Text>
            <ScrollView contentContainerStyle={styles.emojiGrid}>
              {emojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiOption}
                  onPress={() => addStickerOverlay(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEmojiPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

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
    width: screenWidth,
    height: screenHeight,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  controlsGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toolButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  draggableText: {
    position: 'absolute',
  },
  overlayText: {
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  draggableSticker: {
    position: 'absolute',
  },
  stickerEmoji: {
    fontSize: 40,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: screenWidth - 40,
    maxHeight: 400,
  },
  emojiModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: screenWidth - 40,
    maxHeight: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  colorPicker: {
    marginBottom: 20,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#667eea',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emojiOption: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emojiText: {
    fontSize: 32,
  },
});