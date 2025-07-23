import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit, Settings, Grid3x3, BookOpen, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/hooks/supabase';
import { useProfile } from '../../lib/hooks/useProfile';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState('Posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userNotes, setUserNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, []);

  const { profile, loading, refetch } = useProfile(session);

  useFocusEffect(
    useCallback(() => {
      if (refetch) refetch();
    }, [refetch])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchUserPosts = async () => {
        if (!profile?.id) return;
        setPostsLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        if (!error) setUserPosts(data);
        setPostsLoading(false);
      };

      fetchUserPosts();
    }, [profile?.id])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchUserNotes = async () => {
        if (!profile?.id) return;
        setNotesLoading(true);
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        if (!error) setUserNotes(data);
        setNotesLoading(false);
      };

      fetchUserNotes();
    }, [profile?.id])
  );

  const tabs = [
    { name: 'Posts', icon: Grid3x3 },
    { name: 'Notes', icon: BookOpen },
    { name: 'Events', icon: Calendar },
  ];

  const handleEditProfile = () => router.push('../modal/edit-profile');
  const handleSettings = () => console.log('Settings');

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    else if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              style={styles.storyRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.profileImageWrapper}>
                <Image
                  source={{ uri: profile.avatar_url?.trim() || 'https://via.placeholder.com/100' }}
                  style={styles.profileImage}
                />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.fullName}>{profile.full_name?.trim() || 'Your Name'}</Text>
            <Text style={styles.username}>@{profile.username?.trim() || profile.email?.split('@')[0]}</Text>
            <View style={styles.collegeInfo}>
              <Text style={styles.collegeText}>
                {(profile.college?.trim() || 'N/A')} • {(profile.branch?.trim() || 'N/A')} • {(profile.year?.trim() || 'N/A')}
              </Text>
            </View>
            <Text style={styles.bio}>{profile.bio?.trim() || 'No bio yet'}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(profile.posts_count || 0)}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(profile.followers_count || 0)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(profile.following_count || 0)}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit size={16} color="#374151" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
              <Settings size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.name)}
              >
                <IconComponent size={18} color={isActive ? '#111827' : '#9CA3AF'} />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ padding: 2 }}>
          {activeTab === 'Posts' && (
            <>
              {postsLoading ? (
                <Text style={{ color: '#6B7280', textAlign: 'center' }}>Loading posts...</Text>
              ) : userPosts.length === 0 ? (
                <Text style={{ color: '#6B7280', textAlign: 'center' }}>No posts yet.</Text>
              ) : (
                <View style={styles.grid}>
                  {userPosts.map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      style={styles.gridItem}
                      onPress={() => router.push(`/post/${post.id}`)}
                    >
                      <Image
                        source={{ uri: post.image_url }}
                        style={styles.gridImage}
                      />
                      {post.type === 'video' && (
                        <View style={styles.reelBadge}>
                          <Text style={styles.reelBadgeText}>Reel</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === 'Notes' && (
            <>
              {notesLoading ? (
                <Text style={{ color: '#6B7280', textAlign: 'center' }}>Loading notes...</Text>
              ) : userNotes.length === 0 ? (
                <Text style={{ color: '#6B7280', textAlign: 'center' }}>No notes available.</Text>
              ) : (
                userNotes.map((note) => (
                  <View
                    key={note.id}
                    style={{
                      marginBottom: 16,
                      backgroundColor: '#F3F4F6',
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 }}>
                      {note.subject || 'Untitled Note'}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>{note.description}</Text>
                    <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
                      {new Date(note.created_at).toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </>
          )}

          {activeTab === 'Events' && (
            <Text style={{ color: '#6B7280', textAlign: 'center' }}>
              No events participated. (Fetch from `events` table)
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#fff' },
  profileHeader: { paddingHorizontal: 24, paddingVertical: 32 },
  profileImageContainer: { alignSelf: 'center', marginBottom: 20 },
  storyRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageWrapper: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: '#fff',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: { width: 90, height: 90, borderRadius: 45 },
  userInfo: { alignItems: 'center', marginBottom: 24 },
  fullName: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  username: { fontSize: 14, color: '#6B7280', marginBottom: 10 },
  collegeInfo: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  collegeText: { fontSize: 13, color: '#4F46E5' },
  bio: { fontSize: 14, color: '#374151', textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  statItem: { alignItems: 'center', marginHorizontal: 32 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editButtonText: { fontSize: 15, fontWeight: '600', color: '#374151', marginLeft: 8 },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#111827' },
  tabText: { fontSize: 15, color: '#9CA3AF', marginLeft: 8 },
  activeTabText: { color: '#111827' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -2,
  },
  gridItem: {
    width: (width / 3) - 4,
    aspectRatio: 1,
    margin: 2,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  reelBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reelBadgeText: {
    color: '#fff',
    fontSize: 10,
  }
});
