import { SubscriptionResponse } from './subscription.model';

export interface UserResponse {
  id: number;
  displayName: string;
  email: string;
  subscriptions: SubscriptionResponse[];
  created: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}
