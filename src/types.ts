export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  date: string;
}

export interface AdminSettings {
  password: string;
}