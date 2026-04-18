import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { environment } from '../../../environments/environment';

describe('PostService', () => {
  let service: PostService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PostService],
    });
    service = TestBed.inject(PostService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getById() should GET /posts/:id', () => {
    const mockPost = { id: 1, title: 'Post 1', content: 'Content', authorId: 1, authorUsername: 'alice', topicId: 1, topicTitle: 'JS', created: '2024-01-01', lastModified: '2024-01-01' };
    service.getById(1).subscribe(post => expect(post.title).toBe('Post 1'));
    http.expectOne(`${environment.apiUrl}/posts/1`).flush(mockPost);
  });

  it('create() should POST /posts', () => {
    const payload = { title: 'New Post', content: 'Body', topicId: 1 };
    service.create(payload).subscribe(post => expect(post.id).toBe(42));
    const req = http.expectOne(`${environment.apiUrl}/posts`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...payload, id: 42, authorId: 1, authorUsername: 'alice', topicTitle: 'JS', created: '2024-01-01', lastModified: '2024-01-01' });
  });

  it('getComments() should GET /posts/:id/comments and unwrap page content', () => {
    const mockPage = { content: [{ id: 1, content: 'Nice', authorId: 1, authorUsername: 'bob', postId: 1, created: '2024-01-01' }], totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true, empty: false };
    service.getComments(1).subscribe(comments => {
      expect(comments.length).toBe(1);
      expect(comments[0].content).toBe('Nice');
    });
    http.expectOne(`${environment.apiUrl}/posts/1/comments`).flush(mockPage);
  });
});
