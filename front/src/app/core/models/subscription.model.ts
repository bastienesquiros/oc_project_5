export interface SubscriptionResponse {
  id: number;
  userId: number;
  topicId: number;
  topicTitle: string;
  created: string;
}

export interface CreateSubscriptionRequest {
  topicId: number;
}
