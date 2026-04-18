import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UpdateUserRequest, UserResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getMe() {
    return this.http.get<UserResponse>(`${this.baseUrl}/me`);
  }

  updateMe(request: UpdateUserRequest) {
    return this.http.put<UserResponse>(`${this.baseUrl}/me`, request);
  }
}
