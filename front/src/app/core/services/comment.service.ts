import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommentResponse, CreateCommentRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/comments`;

  create(request: CreateCommentRequest) {
    return this.http.post<CommentResponse>(this.baseUrl, request);
  }
}
