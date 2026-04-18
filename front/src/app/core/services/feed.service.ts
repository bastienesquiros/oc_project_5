import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Page, PostResponse } from '../models';

export type FeedSort = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/feed`;

  getFeed(page = 0, size = 20, sort: FeedSort = 'desc') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `created,${sort}`);

    return this.http.get<Page<PostResponse>>(this.baseUrl, { params });
  }
}
