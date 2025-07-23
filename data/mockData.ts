import { Post, User, Comment } from '@/types';

// ------------------------------
// ✅ Mock users
// ------------------------------
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'alex_campus',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    displayName: 'Alex Johnson',
  },
  {
    id: '2',
    username: 'sarah_student',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    displayName: 'Sarah Chen',
  },
  {
    id: '3',
    username: 'mike_studies',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    displayName: 'Mike Rodriguez',
  },
  {
    id: '4',
    username: 'emma_college',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    displayName: 'Emma Davis',
  },
  {
    id: '5',
    username: 'david_uni',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    displayName: 'David Kim',
  },
];

// ------------------------------
// ✅ Sample images & captions
// ------------------------------
const sampleImages = [
  'https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1438348/pexels-photo-1438348.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const sampleCaptions = [
  'Perfect day on campus! 🌟 #CampusLife #StudentLife',
  'Study session vibes in the library 📚✨ #Studying #Finals',
  'Beautiful sunset from the quad 🌅 #Campus #Nature',
  'Coffee and coding session ☕💻 #Programming #StudentLife',
  'Game day energy! 🏈 #College #Sports',
  'Art exhibition opening tonight! 🎨 #Art #Culture',
  'New semester, new goals! 📝 #Education #Growth',
  'Campus architecture never gets old 🏛️ #Architecture #Beauty',
];

// ------------------------------
// ✅ Safe helper for mod index
// ------------------------------
const safeMod = (value: number, mod: number) => {
  if (isNaN(value)) return 0;
  return ((value % mod) + mod) % mod;
};

// ------------------------------
// ✅ Generate single safe post
// ------------------------------
export function generateMockPost(index: number): Post {
  const safeIndex = isNaN(index) ? 0 : index;

  const user = mockUsers[safeMod(safeIndex, mockUsers.length)];
  const imageIndex = safeMod(safeIndex, sampleImages.length);
  const captionIndex = safeMod(safeIndex, sampleCaptions.length);

  const comments = generateMockComments(`post_${safeIndex}`, Math.floor(Math.random() * 3) + 1);

  return {
    id: `post_${safeIndex}`,
    user,
    mediaType: 'image',
    mediaUrl: sampleImages[imageIndex],
    caption: sampleCaptions[captionIndex],
    likesCount: Math.floor(Math.random() * 500) + 10,
    commentsCount: comments.length,
    isLiked: Math.random() > 0.7,
    timestamp: new Date(Date.now() - safeIndex * 2 * 60 * 60 * 1000),
    comments,
    aspectRatio: 1, // square by default
  };
}

// ------------------------------
// ✅ Generate comments for a post
// ------------------------------
export function generateMockComments(postId: string, count: number): Comment[] {
  return Array.from({ length: count }, (_, index) => {
    const safeIndex = safeMod(index, mockUsers.length);

    return {
      id: `comment_${postId}_${index}`,
      user: mockUsers[safeIndex],
      text: `Great insight on this! ${['😄', '👍', '🔥', '💯', '✨'][index % 5]}`,
      timestamp: new Date(Date.now() - (index + 1) * 30 * 60 * 1000),
      likesCount: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.8,
    };
  });
}
