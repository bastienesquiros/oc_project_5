import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommentResponse, CreatePostRequest, Page, PostResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/posts`;

  getById(id: number) {
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreatePostRequest) {
    return this.http.post<PostResponse>(this.baseUrl, request);
  }

  getComments(postId: number) {
    return this.http.get<CommentResponse[]>(`${this.baseUrl}/${postId}/comments`);
  }
}
