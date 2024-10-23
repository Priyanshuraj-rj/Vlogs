import React from 'react';
import { PostList } from '../components/PostList';

export const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostList />
    </div>
  );
};