import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  X,
  Type,
  Smile,
  Palette,
  Send,
  Download,
  Music,
  AtSign,
  Hash,
  MapPin,
  Star,
  Sparkles,
  Heart,
  MessageCircle,
} from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av'; // ✅ Import ResizeMode

const { width, height } = Dimensions.get('window');

const filters = [
  { name: 'Original', value: 'none', preview: '#ffffff' },
  { name: 'Vintage', value: 'sepia', preview: '#d4a574' },
  { name: 'B&W', value: 'grayscale', preview: '#808080' },
  { name: 'Vibrant', value: 'saturate', preview: '#ff6b6b' },
  { name: 'Cool', value: 'cool', preview: '#74b9ff' },
  { name: 'Warm', value: 'warm', preview: '#fdcb6e' },
  { name: 'Dreamy', value: 'dreamy', preview: '#a29bfe' },
  { name: 'Sunset', value: 'sunset', preview: '#fd79a8' },
];

const textColors = [
  '#ffffff', '#000000', '#ff6b6b', '#74b9ff', 
  '#a29bfe', '#fd79a8', '#fdcb6e', '#00b894',
  '#e17055', '#6c5ce7', '#ffeaa7', '#fab1a0'
];

export default function PreviewScreen() {
  const { mediaUri, type } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [showTextInput, setShowTextInput] = useState(false);

  const handlePost = async () => {
    try {
      Alert.alert(
        '🎉 Story Posted Successfully!',
        'Your campus story has been shared and will be visible to your friends for 24 hours.',
        [
          {
            text: 'View Story',
            onPress: () => router.push('/stories/viewer'),
          },
          {
            text: 'Back to Home',
            onPress: () => router.replace('/(tabs)'),
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post story. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      Alert.alert('📱 Saved Successfully!', 'Story saved to your device gallery.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save story.');
    }
  };

  const renderMedia = () => {
    if (type === 'text') {
      return (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.textStoryBackground}
        >
          <Text style={styles.textStoryContent}>
            {text || 'Tap to add text...'}
          </Text>
        </LinearGradient>
      );
    }

    if (type === 'video') {
      return (
        <Video
          source={{ uri: mediaUri as string }}
          style={styles.media}
          shouldPlay
          isLooping
          resizeMode={ResizeMode.COVER} // ✅ FIXED
        />
      );
    }

    return (
      <Image
        source={{ uri: mediaUri as string }}
        style={styles.media}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Media Preview */}
      <View style={styles.mediaContainer}>
        {renderMedia()}

        {/* Text Overlay */}
        {text && type !== 'text' && (
          <View style={styles.textOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)']}
              style={styles.textOverlayGradient}
            >
              <Text style={[styles.overlayText, { color: textColor }]}>{text}</Text>
            </LinearGradient>
          </View>
        )}

        {/* Top Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.topGradient}
          pointerEvents="none"
        />

        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <X size={28} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Preview Story</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
          >
            <Download size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Story Preview Actions */}
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.previewActionButton}>
            <Heart size={24} color="white" />
            <Text style={styles.previewActionText}>124</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewActionButton}>
            <MessageCircle size={24} color="white" />
            <Text style={styles.previewActionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Text Input Modal */}
      {showTextInput && (
        <View style={styles.textInputModal}>
          <LinearGradient
            colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.98)']}
            style={styles.textInputContainer}
          >
            <View style={styles.textInputHeader}>
              <Sparkles size={24} color="#6366F1" />
              <Text style={styles.textInputTitle}>Add Text</Text>
            </View>
            
            <TextInput
              style={[styles.textInput, { color: textColor, borderColor: textColor }]}
              placeholder="Type your message..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={text}
              onChangeText={setText}
              multiline
              autoFocus
            />
            
            {/* Color Picker */}
            <View style={styles.colorPicker}>
              <Text style={styles.colorPickerTitle}>Text Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorOptions}>
                  {textColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        textColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setTextColor(color)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
            
            <View style={styles.textInputButtons}>
              <TouchableOpacity
                style={styles.textInputButton}
                onPress={() => setShowTextInput(false)}
              >
                <Text style={styles.textInputButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.textInputButton]}
                onPress={() => setShowTextInput(false)}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.textInputButtonGradient}
                >
                  <Text style={[styles.textInputButtonText, styles.textInputButtonTextPrimary]}>
                    Done
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Bottom Controls */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.95)']}
        style={styles.bottomControls}
      >
        {/* Filters */}
        {type !== 'text' && (
          <View style={styles.filtersContainer}>
            <Text style={styles.sectionTitle}>Filters</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filters}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.name}
                    style={[
                      styles.filterButton,
                      selectedFilter === filter.value && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedFilter(filter.value)}
                  >
                    <View style={[styles.filterPreview, { backgroundColor: filter.preview }]} />
                    <Text style={[
                      styles.filterText,
                      selectedFilter === filter.value && styles.filterTextActive,
                    ]}>
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Professional Tools */}
        <View style={styles.toolsContainer}>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => setShowTextInput(true)}
          >
            <LinearGradient
              colors={['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.2)']}
              style={styles.toolIcon}
            >
              <Type size={28} color="white" />
            </LinearGradient>
            <Text style={styles.toolText}>Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <LinearGradient
              colors={['rgba(245, 101, 101, 0.2)', 'rgba(247, 183, 49, 0.2)']}
              style={styles.toolIcon}
            >
              <Smile size={28} color="white" />
            </LinearGradient>
            <Text style={styles.toolText}>Stickers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.2)']}
              style={styles.toolIcon}
            >
              <Palette size={28} color="white" />
            </LinearGradient>
            <Text style={styles.toolText}>Draw</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(147, 51, 234, 0.2)']}
              style={styles.toolIcon}
            >
              <Music size={28} color="white" />
            </LinearGradient>
            <Text style={styles.toolText}>Music</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Professional Tools */}
        <View style={styles.additionalTools}>
          <TouchableOpacity style={styles.additionalTool}>
            <AtSign size={20} color="white" />
            <Text style={styles.additionalToolText}>Tag People</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalTool}>
            <Hash size={20} color="white" />
            <Text style={styles.additionalToolText}>Hashtag</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalTool}>
            <MapPin size={20} color="white" />
            <Text style={styles.additionalToolText}>Location</Text>
          </TouchableOpacity>
        </View>

        {/* Professional Post Button */}
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePost}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.postButtonGradient}
          >
            <Star size={24} color="white" />
            <Text style={styles.postButtonText}>Share to Story</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  media: {
    width: width,
    height: height * 0.65,
    resizeMode: 'cover',
  },
  textStoryBackground: {
    width: width,
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  textStoryContent: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    lineHeight: 44,
  },
  textOverlay: {
    position: 'absolute',
    top: '50%',
    left: 24,
    right: 24,
    transform: [{ translateY: -50 }],
  },
  textOverlayGradient: {
    borderRadius: 20,
    padding: 20,
  },
  overlayText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 1,
  },
  headerControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(20px)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  previewActions: {
    position: 'absolute',
    bottom: 280,
    right: 24,
    gap: 28,
    zIndex: 2,
  },
  previewActionButton: {
    alignItems: 'center',
    gap: 8,
  },
  previewActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  textInputModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  textInputContainer: {
    width: width * 0.9,
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  textInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  textInputTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
    borderWidth: 2,
  },
  colorPicker: {
    marginBottom: 24,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: 'white',
    transform: [{ scale: 1.1 }],
  },
  textInputButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  textInputButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  textInputButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  textInputButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '700',
    padding: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  textInputButtonTextPrimary: {
    color: 'white',
    backgroundColor: 'transparent',
    padding: 0,
  },
  bottomControls: {
    paddingTop: 24,
    paddingBottom: 44,
    paddingHorizontal: 24,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 16,
  },
  filterButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderColor: '#6366F1',
  },
  filterPreview: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 6,
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  toolButton: {
    alignItems: 'center',
    gap: 12,
  },
  toolIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toolText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  additionalTools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 28,
  },
  additionalTool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  additionalToolText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  postButton: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  postButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  postButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
});