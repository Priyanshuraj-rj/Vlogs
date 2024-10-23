import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Post, AdminSettings } from '../types';

interface BlogContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments'>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  adminSettings: AdminSettings;
  updateAdminPassword: (newPassword: string) => void;
  loading: boolean;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('admin_settings');
    return saved ? JSON.parse(saved) : { password: '7264' };
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (post: Omit<Post, 'id' | 'likes' | 'comments'>) => {
    try {
      const newPost = await api.createPost(post);
      setPosts(prev => [...prev, newPost]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const comment = {
        id: Date.now().toString(),
        content,
        date: new Date().toISOString()
      };
      await api.addComment(postId, comment);
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const updateAdminPassword = (newPassword: string) => {
    setAdminSettings(prev => ({ ...prev, password: newPassword }));
  };

  return (
    <BlogContext.Provider value={{
      posts,
      addPost,
      deletePost,
      addComment,
      adminSettings,
      updateAdminPassword,
      loading
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within a BlogProvider');
  return context;
};