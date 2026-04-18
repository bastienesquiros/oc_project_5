import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TopicResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/topics`;

  getAll() {
    return this.http.get<TopicResponse[]>(this.baseUrl);
  }
}
