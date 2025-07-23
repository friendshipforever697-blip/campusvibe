import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin, Users, Share2, Ticket, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const events = [
  {
    id: 1,
    title: 'Tech Fest 2024',
    club: 'IEEE Student Chapter',
    date: 'March 15, 2024',
    time: '10:00 AM - 6:00 PM',
    venue: 'Main Auditorium',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    logo: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Annual technical festival featuring workshops, competitions, and tech talks by industry experts.',
    attendees: 324,
    userStatus: 'registered',
    category: 'upcoming',
    hashtags: ['#TechFest', '#Innovation', '#Workshops', '#Competition'],
    college: 'IIT Delhi',
  },
  {
    id: 2,
    title: 'Coding Competition',
    club: 'Computer Science Department',
    date: 'March 20, 2024',
    time: '2:00 PM - 5:00 PM',
    venue: 'Computer Lab 1',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    logo: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Test your programming skills in this exciting coding competition with prizes worth ₹50,000.',
    attendees: 156,
    userStatus: 'interested',
    category: 'upcoming',
    hashtags: ['#Coding', '#Competition', '#Programming', '#Hackathon'],
    college: 'IIT Delhi',
  },
  {
    id: 3,
    title: 'Cultural Night',
    club: 'Cultural Committee',
    date: 'March 25, 2024',
    time: '7:00 PM - 11:00 PM',
    venue: 'College Ground',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    logo: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'An evening filled with music, dance, and cultural performances by talented students.',
    attendees: 892,
    userStatus: null,
    category: 'upcoming',
    hashtags: ['#Cultural', '#Music', '#Dance', '#Performance'],
    college: 'IIT Delhi',
  },
  {
    id: 4,
    title: 'Startup Pitch Day',
    club: 'Entrepreneurship Cell',
    date: 'March 10, 2024',
    time: '9:00 AM - 4:00 PM',
    venue: 'Innovation Hub',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    logo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Present your startup ideas to industry experts and win funding opportunities.',
    attendees: 67,
    userStatus: 'registered',
    category: 'ongoing',
    hashtags: ['#Startup', '#Entrepreneurship', '#Pitch', '#Innovation'],
    college: 'IIT Delhi',
  },
  {
    id: 5,
    title: 'Workshop: AI & Machine Learning',
    club: 'Data Science Society',
    date: 'March 28, 2024',
    time: '1:00 PM - 4:00 PM',
    venue: 'Seminar Hall B',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
    logo: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Hands-on workshop covering fundamentals of AI and machine learning with practical examples.',
    attendees: 89,
    userStatus: null,
    category: 'upcoming',
    hashtags: ['#AI', '#MachineLearning', '#Workshop', '#Tech'],
    college: 'IIT Delhi',
  },
  {
    id: 6,
    title: 'Annual Sports Meet',
    club: 'Sports Committee',
    date: 'April 2, 2024',
    time: '8:00 AM - 6:00 PM',
    venue: 'Sports Complex',
    image: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=400',
    logo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Inter-department sports competition featuring cricket, football, basketball, and athletics.',
    attendees: 456,
    userStatus: 'interested',
    category: 'upcoming',
    hashtags: ['#Sports', '#Competition', '#Fitness', '#TeamWork'],
    college: 'IIT Delhi',
  },
];

export default function EventsPage() {
  const handleShare = async (event: typeof events[0]) => {
    try {
      await Share.share({
        message: `Check out ${event.title} at ${event.venue} on ${event.date}! 🎉\n\n${event.description}\n\n#${event.hashtags.join(' #')}`,
        title: event.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleRegister = (eventId: number) => {
    console.log('Registering for event:', eventId);
  };

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'registered':
        return { text: 'Registered', color: '#10B981', bgColor: '#D1FAE5' };
      case 'interested':
        return { text: 'Interested', color: '#F59E0B', bgColor: '#FEF3C7' };
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>College Events</Text>
          <Text style={styles.headerSubtitle}>{events.length} events available</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {events.map((event) => {
          const statusDisplay = getStatusDisplay(event.userStatus);
          
          return (
            <View key={event.id} style={styles.eventCard}>
              {/* Compact Event Image */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.imageGradient}
                />
                
                {/* College Logo */}
                <View style={styles.logoContainer}>
                  <Image source={{ uri: event.logo }} style={styles.collegeLogo} />
                </View>

                {/* Status Badge */}
                {statusDisplay && (
                  <View style={[styles.statusBadge, { backgroundColor: statusDisplay.bgColor }]}>
                    <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                      {statusDisplay.text}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Event Info */}
              <View style={styles.eventInfo}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventClub}>{event.club}</Text>
                </View>
                
                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={14} color="#6366F1" strokeWidth={2} />
                    <Text style={styles.detailText}>{event.date}</Text>
                    <Text style={styles.detailTime}>{event.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin size={14} color="#6366F1" strokeWidth={2} />
                    <Text style={styles.detailText}>{event.venue}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Users size={14} color="#10B981" strokeWidth={2} />
                    <Text style={styles.attendeesText}>{event.attendees} students interested</Text>
                  </View>
                </View>
                
                <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>
                
                {/* Hashtags */}
                <View style={styles.hashtagsContainer}>
                  {event.hashtags.slice(0, 3).map((hashtag, index) => (
                    <View key={index} style={styles.hashtagButton}>
                      <Text style={styles.hashtagText}>{hashtag}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.registerButton}
                    onPress={() => handleRegister(event.id)}
                    activeOpacity={0.8}
                  >
                    <Ticket size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.registerButtonText}>
                      {event.userStatus === 'registered' ? 'Registered' : 'Register'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={() => handleShare(event)}
                    activeOpacity={0.8}
                  >
                    <Share2 size={16} color="#6B7280" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* Admin Note */}
        <View style={styles.adminNote}>
          <View style={styles.adminNoteContent}>
            <Text style={styles.adminNoteEmoji}>📝</Text>
            <Text style={styles.adminNoteText}>
              Only admins can create events. Students can view and register for events.
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  logoContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collegeLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  eventInfo: {
    padding: 12,
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  eventClub: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  eventDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 6,
    flex: 1,
  },
  detailTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  attendeesText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginLeft: 6,
  },
  eventDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  hashtagButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  hashtagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  registerButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adminNote: {
    marginBottom: 16,
    marginTop: 8,
  },
  adminNoteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  adminNoteEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  adminNoteText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    lineHeight: 14,
  },
});