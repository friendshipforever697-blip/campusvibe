import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Camera,
  FileText,
  Upload,
  ChevronDown,
  Plus,
} from 'lucide-react-native';

type FormDataKeys = 'caption' | 'branch' | 'year' | 'semester' | 'subject';

interface FormData {
  caption: string;
  branch: string;
  year: string;
  semester: string;
  subject: string;
}

const { width } = Dimensions.get('window');
const graduationYears = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];
const semesters = [
  '1st Sem',
  '2nd Sem',
  '3rd Sem',
  '4th Sem',
  '5th Sem',
  '6th Sem',
  '7th Sem',
  '8th Sem',
];

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('Post');
  const [formData, setFormData] = useState<FormData>({
    caption: '',
    branch: '',
    year: '',
    semester: '',
    subject: '',
  });

  const [postDescription, setPostDescription] = useState('');
  const [tagPeople, setTagPeople] = useState('');
  const [fileChosen, setFileChosen] = useState(false);
  const [settings, setSettings] = useState({
    commentsEnabled: true,
    showLikeCount: true,
    showShareCount: true,
    visibility: 'Followers',
  });

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showSemesterPicker, setShowSemesterPicker] = useState(false);

  const tabs = [
    {
      name: 'Post',
      icon: Image,
      gradient: ['#667eea', '#764ba2'],
      emoji: '📸',
      description: 'Share moments',
      accent: '#667eea',
    },
    {
      name: 'Story',
      icon: Camera,
      gradient: ['#f093fb', '#f5576c'],
      emoji: '📱',
      description: '24h stories',
      accent: '#f093fb',
    },
    {
      name: 'Notes',
      icon: FileText,
      gradient: ['#43e97b', '#38f9d7'],
      emoji: '📚',
      description: 'Study materials',
      accent: '#43e97b',
    },
  ];

  const updateField = (field: FormDataKeys, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = () => {
    if (!fileChosen) {
      Alert.alert('File Required', 'Please choose a file to upload.');
      return;
    }

    if (activeTab === 'Notes') {
      const requiredFields: FormDataKeys[] = [
        'branch',
        'year',
        'semester',
        'subject',
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        Alert.alert(
          'Missing Information',
          'Please fill in all required fields for notes'
        );
        return;
      }
    } else {
      if (!formData.caption.trim()) {
        Alert.alert('Caption Required', 'Please add a caption to your post');
        return;
      }
    }

    Alert.alert(
      'Success! 🎉',
      `Your ${activeTab.toLowerCase()} has been uploaded successfully!`
    );
    setFormData({ caption: '', branch: '', year: '', semester: '', subject: '' });
    setPostDescription('');
    setTagPeople('');
    setFileChosen(false);
    setSettings({
      commentsEnabled: true,
      showLikeCount: true,
      showShareCount: true,
      visibility: 'Followers',
    });
  };

  const getActiveTabData = () => {
    return tabs.find((tab) => tab.name === activeTab) || tabs[0];
  };

  const renderCompactMediaUpload = () => {
    const tabData = getActiveTabData();
    const IconComponent = tabData.icon;

    return (
      <View style={styles.compactUploadSection}>
        <View style={styles.uploadHeader}>
          <View style={styles.uploadIconWrapper}>
            <View
              style={[styles.uploadIcon, { backgroundColor: tabData.accent }]}
            >
              <IconComponent size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.uploadInfo}>
              <Text style={styles.uploadTitle}>Choose File *</Text>
              <Text style={styles.uploadSubtitle}>
                {activeTab === 'Story' ? 'Photo/video, 24h limit' : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => setFileChosen(true)}
          >
            <Plus size={16} color={tabData.accent} strokeWidth={2.5} />
            <Text style={[styles.browseButtonText, { color: tabData.accent }]}>
              Browse
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPostSettings = () => (
    <View style={styles.formCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>⚙️ Post Settings</Text>
      </View>

      <View style={styles.inputGroupRow}>
        <Text style={styles.inputLabel}>Allow Comments</Text>
        <Switch
          value={settings.commentsEnabled}
          onValueChange={(value) =>
            setSettings((prev) => ({ ...prev, commentsEnabled: value }))
          }
        />
      </View>

      <View style={styles.inputGroupRow}>
        <Text style={styles.inputLabel}>Show Like Count</Text>
        <Switch
          value={settings.showLikeCount}
          onValueChange={(value) =>
            setSettings((prev) => ({ ...prev, showLikeCount: value }))
          }
        />
      </View>

      <View style={styles.inputGroupRow}>
        <Text style={styles.inputLabel}>Show Share Count</Text>
        <Switch
          value={settings.showShareCount}
          onValueChange={(value) =>
            setSettings((prev) => ({ ...prev, showShareCount: value }))
          }
        />
      </View>

      <View style={styles.inputGroupRow}>
        <Text style={styles.inputLabel}>Who can see your post</Text>
      </View>
      <View style={styles.visibilityOptions}>
        <TouchableOpacity
          onPress={() =>
            setSettings((prev) => ({ ...prev, visibility: 'Followers' }))
          }
          style={[
            styles.visibilityOption,
            settings.visibility === 'Followers' && styles.visibilityOptionActive,
          ]}
        >
          <Text style={styles.visibilityOptionText}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setSettings((prev) => ({ ...prev, visibility: 'Close Friends' }))
          }
          style={[
            styles.visibilityOption,
            settings.visibility === 'Close Friends' &&
              styles.visibilityOptionActive,
          ]}
        >
          <Text style={styles.visibilityOptionText}>Close Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPostUpload = () => (
    <View style={styles.uploadForm}>
      {renderCompactMediaUpload()}

      <View style={styles.formCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>✨ Post Details</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Caption *</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="What's on your mind? Share your story..."
              value={formData.caption}
              onChangeText={(value) => updateField('caption', value)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Add more details about your post..."
              value={postDescription}
              onChangeText={setPostDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tag People</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="@username"
              value={tagPeople}
              onChangeText={setTagPeople}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      <View style={{ height: 20 }} />

      {renderPostSettings()}
    </View>
  );

  const renderStoryUpload = () => (
  <View style={styles.uploadForm}>
    {/* Step 1: Media Picker */}
    <View style={styles.formCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>✨ Create Vibe</Text>
      </View>

      <View style={styles.inputGroupRow}>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => Alert.alert('Camera Open', 'Launch camera here')}
        >
          <Camera size={16} color="#f093fb" strokeWidth={2.5} />
          <Text style={[styles.browseButtonText, { color: '#f093fb' }]}>
            Open Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => Alert.alert('Gallery Open', 'Launch gallery picker here')}
        >
          <Image size={16} color="#f093fb" strokeWidth={2.5} />
          <Text style={[styles.browseButtonText, { color: '#f093fb' }]}>
            Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Step 2: Preview & Edit Area */}
    <View style={styles.formCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>🖌️ Preview & Edit</Text>
      </View>

      <View style={styles.inputGroupRow}>
        <Text>Add Text, Stickers, Location, Music, Tags...</Text>
        <Text>(Coming soon... Hook your editor here)</Text>
      </View>
    </View>
  </View>
);

  const renderNotesUpload = () => <View />; // unchanged

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create</Text>
        <Text style={styles.headerSubtitle}>Share your college moments</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.name)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.tabContent, isActive && { backgroundColor: tab.accent }]}
                >
                  <IconComponent
                    size={16}
                    color={isActive ? '#FFFFFF' : '#6B7280'}
                    strokeWidth={2}
                  />
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {tab.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Post' && renderPostUpload()}
        {activeTab === 'Story' && renderStoryUpload()}
        {activeTab === 'Notes' && renderNotesUpload()}

        <View style={styles.uploadButtonSection}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
            activeOpacity={0.9}
          >
            <View
              style={[
                styles.uploadButtonContent,
                { backgroundColor: getActiveTabData().accent },
              ]}
            >
              <Upload size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.uploadButtonText}>Publish {activeTab}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    marginRight: 12,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  uploadForm: {
    padding: 16,
  },
  compactUploadSection: {
    marginBottom: 16,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  uploadIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  uploadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  uploadSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  browseButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  textAreaContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    minHeight: 80,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  storyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  storyNoteEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  storyNoteContent: {
    flex: 1,
  },
  storyNoteTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 2,
  },
  storyNoteText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 14,
  },
  uploadButtonSection: {
    padding: 16,
  },
  uploadButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  inputGroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  visibilityOptions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  visibilityOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  visibilityOptionActive: {
    backgroundColor: '#E2E8F0',
  },
  visibilityOptionText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  } 
});