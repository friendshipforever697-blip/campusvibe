export interface User {
  id: string;
  username: string;
  avatar: string;
  displayName: string;
  collegeName: string; // ✅ NEW
}

  
  export interface Comment {
    id: string;
    user: User;
    text: string;
    timestamp: Date;
    likesCount?: number;
    isLiked?: boolean;
  }
  
  export interface Post {
    id: string;
    user: User;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    caption: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    timestamp: Date;
    comments: Comment[];
    aspectRatio?: number;
  }