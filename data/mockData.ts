export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  status: 'active' | 'banned';
  joinedDate: string;
  postsCount: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  caption: string;
  image: string;
  status: 'active' | 'reported' | 'deleted';
  likes: number;
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    username: '@emmarodriguez',
    email: 'emma.rodriguez@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
    status: 'active',
    joinedDate: '2024-01-15',
    postsCount: 142
  },
  {
    id: '2',
    name: 'Marcus Chen',
    username: '@marcuschen',
    email: 'marcus.chen@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
    status: 'active',
    joinedDate: '2024-02-20',
    postsCount: 89
  },
  {
    id: '3',
    name: 'Sophia Williams',
    username: '@sophiaw',
    email: 'sophia.williams@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100',
    status: 'banned',
    joinedDate: '2023-12-10',
    postsCount: 234
  },
  {
    id: '4',
    name: 'Liam Johnson',
    username: '@liamj',
    email: 'liam.johnson@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
    status: 'active',
    joinedDate: '2024-03-05',
    postsCount: 67
  },
  {
    id: '5',
    name: 'Ava Martinez',
    username: '@avamartinez',
    email: 'ava.martinez@example.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100',
    status: 'active',
    joinedDate: '2024-01-28',
    postsCount: 156
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    username: '@emmarodriguez',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
    caption: 'Beautiful sunset at the beach',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?w=400',
    status: 'active',
    likes: 1243,
    createdAt: '2024-10-18'
  },
  {
    id: '2',
    userId: '2',
    username: '@marcuschen',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
    caption: 'Coffee and code',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=400',
    status: 'reported',
    likes: 892,
    createdAt: '2024-10-19'
  },
  {
    id: '3',
    userId: '5',
    username: '@avamartinez',
    userAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100',
    caption: 'Mountain hiking adventure',
    image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?w=400',
    status: 'active',
    likes: 2134,
    createdAt: '2024-10-17'
  },
  {
    id: '4',
    userId: '4',
    username: '@liamj',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
    caption: 'Urban photography',
    image: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?w=400',
    status: 'active',
    likes: 567,
    createdAt: '2024-10-20'
  },
  {
    id: '5',
    userId: '1',
    username: '@emmarodriguez',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
    caption: 'Food photography',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400',
    status: 'deleted',
    likes: 423,
    createdAt: '2024-10-16'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    postId: '2',
    reportedBy: '@sophiaw',
    reason: 'Inappropriate content',
    status: 'pending',
    createdAt: '2024-10-19'
  },
  {
    id: '2',
    postId: '1',
    reportedBy: '@liamj',
    reason: 'Spam',
    status: 'resolved',
    createdAt: '2024-10-18'
  },
  {
    id: '3',
    postId: '3',
    reportedBy: '@marcuschen',
    reason: 'Misleading information',
    status: 'dismissed',
    createdAt: '2024-10-17'
  }
];

export const weeklyUserGrowth = [
  { day: 'Mon', users: 45 },
  { day: 'Tue', users: 52 },
  { day: 'Wed', users: 61 },
  { day: 'Thu', users: 58 },
  { day: 'Fri', users: 70 },
  { day: 'Sat', users: 85 },
  { day: 'Sun', users: 78 }
];
