export interface CommentResponse {
  id: number;
  content: string;
  authorId: number;
  authorUsername: string;
  postId: number;
  created: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
}
