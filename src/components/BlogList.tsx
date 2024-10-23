import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThumbsUp, MessageCircle } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: string[];
}

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://sheetdb.io/api/v1/3yccid3j0840s');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      await axios.patch(`https://sheetdb.io/api/v1/3yccid3j0840s/id/${postId}`, {
        data: { likes: post.likes + 1 }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!comment.trim()) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updatedComments = [...post.comments, comment];
      await axios.patch(`https://sheetdb.io/api/v1/3yccid3j0840s/id/${postId}`, {
        data: { comments: JSON.stringify(updatedComments) }
      });
      setComment('');
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <ThumbsUp className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
            
            <button
              onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </button>
          </div>

          {selectedPost === post.id && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                {post.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded p-3">
                    {comment}
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BlogList;