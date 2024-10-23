import React from 'react';
import { MessageCircle, Trash } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import type { Post } from '../types';

export const PostList: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const { posts, deletePost, addComment, loading } = useBlog();
  const [commentText, setCommentText] = React.useState<{ [key: string]: string }>({});

  const handleComment = async (postId: string) => {
    if (commentText[postId]?.trim()) {
      await addComment(postId, commentText[postId]);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post: Post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            {isAdmin && (
              <button
                onClick={() => deletePost(post.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash className="h-5 w-5" />
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-4">{post.content}</p>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-l-2 border-indigo-200 pl-4 space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded p-3">
                  <p className="text-gray-700">{comment.content}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={commentText[post.id] || ''}
                onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Add a comment..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button
                onClick={() => handleComment(post.id)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Comment
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};