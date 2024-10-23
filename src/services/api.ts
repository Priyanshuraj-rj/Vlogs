import axios from 'axios';
import type { Post, Comment } from '../types';

const API_URL = 'https://sheetdb.io/api/v1/3yccid3j0840s';

export const api = {
  async getPosts(): Promise<Post[]> {
    const { data } = await axios.get(API_URL);
    return data.map((post: any) => ({
      ...post,
      likes: Number(post.likes),
      comments: JSON.parse(post.comments || '[]')
    }));
  },

  async createPost(post: Omit<Post, 'id' | 'likes' | 'comments'>): Promise<Post> {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: '[]'
    };
    await axios.post(API_URL, newPost);
    return { ...newPost, comments: [] };
  },

  async updatePost(post: Post): Promise<void> {
    await axios.patch(`${API_URL}/id/${post.id}`, {
      ...post,
      comments: JSON.stringify(post.comments)
    });
  },

  async deletePost(id: string): Promise<void> {
    await axios.delete(`${API_URL}/id/${id}`);
  },

  async addComment(postId: string, comment: Comment): Promise<void> {
    const { data: [post] } = await axios.get(`${API_URL}/id/${postId}`);
    const comments = JSON.parse(post.comments || '[]');
    comments.push(comment);
    await axios.patch(`${API_URL}/id/${postId}`, {
      comments: JSON.stringify(comments)
    });
  }
};