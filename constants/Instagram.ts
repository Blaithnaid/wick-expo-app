export interface InstagramProfile {
    username: string;
    fullName: string;
    biography: string;
    profilePicUrl: string;
    mediaCount: number;
    followersCount: number;
    followingCount: number;
    posts: InstagramPost[];
  }
  
  export interface InstagramPost {
    id: string;
    timestamp: string;
    mediaType: 'photo' | 'video' | 'carousel';
    mediaUrl: string;
    thumbnailUrl: string;
    caption?: string;
    likes: number;
    comments: number;
  }
  
  // Optional: Add utility type for import status
  export interface ImportStatus {
    success: boolean;
    profile?: InstagramProfile;
    error?: string;
  }