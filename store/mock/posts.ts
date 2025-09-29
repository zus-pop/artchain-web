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
    imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde',
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
    imageUrl: 'https://images.unsplash.com/photo-1508923567004-3a6b8004f3d3',
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
