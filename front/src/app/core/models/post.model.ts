export interface PostResponse {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorUsername: string;
  topicId: number;
  topicTitle: string;
  created: string;
  lastModified: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  topicId: number;
}
