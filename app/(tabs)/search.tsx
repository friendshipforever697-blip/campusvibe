import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Heart, MessageSquare, Bookmark, TrendingUp, Users, BookOpen, Sparkles, Filter } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with padding

const trendingTopics = [
  { id: 1, name: '#CollegeLife', posts: '12.5K', color: '#667eea' },
  { id: 2, name: '#TechFest2024', posts: '8.2K', color: '#f093fb' },
  { id: 3, name: '#StudyTips', posts: '15.7K', color: '#43e97b' },
  { id: 4, name: '#CampusVibes', posts: '9.8K', color: '#4facfe' },
];

const explorePosts = [
  {
    id: 1,
    type: 'meme',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 1247,
    comments: 89,
    username: 'rahul_memes',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    caption: 'When the professor says "This will be in the exam" 😂',
  },
  {
    id: 2,
    type: 'post',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 892,
    comments: 67,
    username: 'priya_tech',
    userImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    caption: 'Debugging at 3 AM hits different 💻',
  },
  {
    id: 3,
    type: 'reel',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 2103,
    comments: 156,
    username: 'arjun_engineering',
    userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    caption: 'When you finally understand that concept 🤯',
  },
  {
    id: 4,
    type: 'post',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 756,
    comments: 43,
    username: 'sneha_design',
    userImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    caption: 'UI/UX design inspiration from nature 🌿',
  },
  {
    id: 5,
    type: 'meme',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 1456,
    comments: 98,
    username: 'college_memes',
    userImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    caption: 'Group project reality check 📚',
  },
  {
    id: 6,
    type: 'reel',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 987,
    comments: 76,
    username: 'tech_tutorials',
    userImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    caption: 'Quick coding tip of the day! 💡',
  },
];

const searchResults = {
  students: [
    { id: 1, name: 'Rahul Sharma', college: 'IIT Delhi', branch: 'CSE', year: '3rd Year', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', following: false, verified: true },
    { id: 2, name: 'Priya Patel', college: 'NIT Trichy', branch: 'ECE', year: '2nd Year', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', following: true, verified: false },
  ],
  posts: explorePosts.slice(0, 4),
  notes: [
    { id: 1, title: 'Data Structures & Algorithms', branch: 'CSE', year: '2nd Year', downloads: 245 },
    { id: 2, title: 'Digital Electronics', branch: 'ECE', year: '3rd Year', downloads: 156 },
  ],
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const renderTrendingSection = () => (
    <View style={styles.trendingSection}>
      <View style={styles.sectionHeader}>
        <TrendingUp size={24} color="#667eea" strokeWidth={2.5} />
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <Sparkles size={20} color="#F59E0B" />
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
        {trendingTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.trendingCard} activeOpacity={0.8}>
            <LinearGradient
              colors={[topic.color, `${topic.color}80`]}
              style={styles.trendingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.trendingName}>{topic.name}</Text>
              <Text style={styles.trendingPosts}>{topic.posts} posts</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderExploreGrid = () => (
    <View style={styles.exploreSection}>
      <View style={styles.sectionHeader}>
        <Sparkles size={24} color="#667eea" strokeWidth={2.5} />
        <Text style={styles.sectionTitle}>Discover</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.exploreGrid}>
        {explorePosts.map((post, index) => (
          <TouchableOpacity key={post.id} style={[styles.exploreItem, { width: itemWidth }]} activeOpacity={0.95}>
            <View style={styles.exploreImageContainer}>
              <Image source={{ uri: post.image }} style={styles.exploreImage} />
              
              {/* Content Type Indicator */}
              <View style={styles.contentTypeIndicator}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
                  style={styles.contentTypeGradient}
                >
                  <Text style={styles.contentTypeText}>
                    {post.type === 'reel' ? '🎬' : post.type === 'meme' ? '😂' : '📷'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Engagement Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.exploreOverlay}
              >
                <View style={styles.exploreStats}>
                  <View style={styles.statItem}>
                    <Heart size={14} color="#FFFFFF" fill="#FFFFFF" strokeWidth={1.5} />
                    <Text style={styles.statText}>{post.likes > 999 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MessageSquare size={14} color="#FFFFFF" strokeWidth={1.5} />
                    <Text style={styles.statText}>{post.comments}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSearchResults = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.resultsContainer}>
      {/* Students Results */}
      {searchResults.students.length > 0 && (
        <View style={styles.resultSection}>
          <View style={styles.resultSectionHeader}>
            <Users size={22} color="#667eea" strokeWidth={2.5} />
            <Text style={styles.resultSectionTitle}>Students</Text>
          </View>
          {searchResults.students.map((student) => (
            <Card key={student.id} style={styles.studentCard}>
              <View style={styles.studentContent}>
                <View style={styles.studentLeft}>
                  <Avatar source={{ uri: student.image }} size={48} />
                  <View style={styles.studentInfo}>
                    <View style={styles.studentNameRow}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      {student.verified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedIcon}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.studentCollege}>{student.college}</Text>
                    <Text style={styles.studentDetails}>{student.branch} • {student.year}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.followButton, student.following && styles.followingButton]}>
                  <LinearGradient
                    colors={student.following ? ['#F3F4F6', '#E5E7EB'] : ['#667eea', '#764ba2']}
                    style={styles.followGradient}
                  >
                    <Text style={[styles.followButtonText, student.following && styles.followingButtonText]}>
                      {student.following ? 'Following' : 'Follow'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Posts Results */}
      {searchResults.posts.length > 0 && (
        <View style={styles.resultSection}>
          <View style={styles.resultSectionHeader}>
            <Sparkles size={22} color="#667eea" strokeWidth={2.5} />
            <Text style={styles.resultSectionTitle}>Posts</Text>
          </View>
          <View style={styles.postsGrid}>
            {searchResults.posts.map((post) => (
              <TouchableOpacity key={post.id} style={[styles.postItem, { width: itemWidth }]} activeOpacity={0.9}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.postOverlay}
                >
                  <Text style={styles.postLikes}>{post.likes > 999 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Notes Results */}
      {searchResults.notes.length > 0 && (
        <View style={styles.resultSection}>
          <View style={styles.resultSectionHeader}>
            <BookOpen size={22} color="#667eea" strokeWidth={2.5} />
            <Text style={styles.resultSectionTitle}>Study Notes</Text>
          </View>
          {searchResults.notes.map((note) => (
            <Card key={note.id} style={styles.noteCard}>
              <View style={styles.noteContent}>
                <View style={styles.noteIcon}>
                  <LinearGradient
                    colors={['#43e97b', '#38f9d7']}
                    style={styles.noteIconGradient}
                  >
                    <BookOpen size={24} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <Text style={styles.noteDetails}>{note.branch} • {note.year}</Text>
                  <Text style={styles.noteDownloads}>{note.downloads} downloads</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Search Header */}
      <View style={styles.searchHeader}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.searchHeaderGradient}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <LinearGradient
                colors={['#F8FAFC', '#F1F5F9']}
                style={styles.searchBarGradient}
              >
                <SearchIcon size={24} color="#667eea" strokeWidth={2.5} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search students, posts, notes..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor="#9CA3AF"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isSearching ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsTitle}>
              Search Results for "{searchQuery}"
            </Text>
            {renderSearchResults()}
          </View>
        ) : (
          <View style={styles.exploreContainer}>
            {renderTrendingSection()}
            {renderExploreGrid()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchHeader: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchHeaderGradient: {
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchBar: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
  },
  exploreContainer: {
    paddingTop: 8,
  },
  trendingSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  trendingCard: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendingGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minWidth: 140,
  },
  trendingName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trendingPosts: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  exploreSection: {
    paddingHorizontal: 20,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exploreItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreImageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  exploreImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentTypeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentTypeGradient: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTypeText: {
    fontSize: 12,
  },
  exploreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  exploreStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  searchResultsContainer: {
    paddingTop: 16,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  resultSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  studentCard: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  verifiedBadge: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  studentCollege: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#667eea',
    marginTop: 2,
  },
  studentDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  followButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  followingButton: {
    // Additional styling if needed
  },
  followGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  followingButtonText: {
    color: '#6B7280',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  postLikes: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  noteCard: {
    marginBottom: 12,
  },
  noteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  noteIcon: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  noteIconGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  noteDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  noteDownloads: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});