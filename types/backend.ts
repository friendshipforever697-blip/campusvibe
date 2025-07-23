// Backend integration types for manual setup
// These types can be used when connecting to your backend

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  college?: string;
  branch?: string;
  year?: string;
  graduation_year?: number;
  verified?: boolean;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content?: string;
  image_urls?: string[];
  video_url?: string;
  hashtags?: string[];
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: User;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  content?: string;
  expires_at: string;
  views_count?: number;
  created_at?: string;
  user?: User;
}

export interface Reel {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string;
  content?: string;
  hashtags?: string[];
  sound_id?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  views_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at?: string;
  user?: User;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  subject: string;
  branch: string;
  year: string;
  semester: string;
  downloads_count?: number;
  rating?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  user?: User;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  organizer_id: string;
  category: string;
  max_attendees?: number;
  attendees_count?: number;
  is_attending?: boolean;
  is_interested?: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  organizer?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image' | 'video' | 'file' | 'voice';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_read: boolean;
  created_at?: string;
  sender?: User;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message_id?: string;
  last_message_at?: string;
  is_group: boolean;
  group_name?: string;
  group_image?: string;
  created_at?: string;
  updated_at?: string;
  last_message?: Message;
  participants_data?: User[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  college?: string;
  branch?: string;
  year?: string;
  graduation_year?: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}