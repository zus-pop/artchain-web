export type ArtPost = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
  likes: number;
  comments: number;
  category: 'Digital Art' | 'Photography' | 'Illustration' | '3D' | 'Painting';
};

export const mockArtPosts: ArtPost[] = [
  {
    id: '1',
    title: 'Dreamscape',
    imageUrl: 'https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A surreal digital landscape representing dreams.',
    createdAt: '2025-09-28T10:30:00Z',
    likes: 124,
    comments: 12,
    category: 'Digital Art',
  },
  {
    id: '2',
    title: 'Urban Silence',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
    description: 'A calm city captured in early morning light.',
    createdAt: '2025-09-27T14:10:00Z',
    likes: 85,
    comments: 6,
    category: 'Photography',
  },
  {
    id: '3',
    title: 'Inner Child',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    description: 'An abstract illustration reflecting emotions.',
    createdAt: '2025-09-25T09:45:00Z',
    likes: 147,
    comments: 22,
    category: 'Illustration',
  },
  {
    id: '4',
    title: 'Cyber Samurai',
    imageUrl: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A futuristic samurai rendered in 3D.',
    createdAt: '2025-09-23T17:30:00Z',
    likes: 203,
    comments: 33,
    category: '3D',
  },
  {
    id: '5',
    title: 'Quiet Forest',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    description: 'An oil painting inspired by calm woods.',
    createdAt: '2025-09-20T12:00:00Z',
    likes: 98,
    comments: 9,
    category: 'Painting',
  },
];
