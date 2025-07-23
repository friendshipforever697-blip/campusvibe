import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/hooks/supabase';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Session } from '@supabase/supabase-js';

export default function EditProfile() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      setSession(data.session);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (!error && profile) {
        setFullName(profile.full_name || '');
        setUsername(profile.username || '');
        setBio(profile.bio || '');
        setCollege(profile.college || '');
        setBranch(profile.branch || '');
        setYear(profile.year || '');
        setWebsite(profile.website || '');
        setAvatarUrl(profile.avatar_url || '');
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Here you’d upload to Supabase Storage and get the URL
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!session) return;

    const updates = {
      id: session.user.id,
      full_name: fullName,
      username,
      bio,
      college,
      branch,
      year,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Update Failed', error.message);
    } else {
      Alert.alert('Success', 'Profile updated!');
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>FULL NAME</Text>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <Text style={styles.label}>USERNAME</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={styles.label}>COLLEGE</Text>
      <TextInput
        placeholder="College"
        value={college}
        onChangeText={setCollege}
        style={styles.input}
      />

      <Text style={styles.label}>BRANCH</Text>
      <TextInput
        placeholder="Branch"
        value={branch}
        onChangeText={setBranch}
        style={styles.input}
      />

      <Text style={styles.label}>YEAR</Text>
      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        style={styles.input}
      />

      <Text style={styles.label}>BIO</Text>
      <TextInput
        placeholder="Tell us about you"
        value={bio}
        onChangeText={setBio}
        style={[styles.input, styles.bio]}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>WEBSITE</Text>
      <TextInput
        placeholder="https://"
        value={website}
        onChangeText={setWebsite}
        style={styles.input}
      />

      <Button title="Save Profile" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#666',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  bio: {
    minHeight: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
