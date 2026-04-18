import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateSubscriptionRequest, SubscriptionResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/subscriptions`;

  subscribe(request: CreateSubscriptionRequest) {
    return this.http.post<SubscriptionResponse>(this.baseUrl, request);
  }

  unsubscribe(subscriptionId: number) {
    return this.http.delete<void>(`${this.baseUrl}/${subscriptionId}`);
  }
}
