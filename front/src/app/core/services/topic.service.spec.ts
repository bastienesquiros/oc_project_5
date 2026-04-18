import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TopicService } from './topic.service';
import { environment } from '../../../environments/environment';

describe('TopicService', () => {
  let service: TopicService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TopicService],
    });
    service = TestBed.inject(TopicService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getAll() should GET /topics and return topics', () => {
    const mockTopics = [
      { id: 1, title: 'JavaScript', description: 'JS topic', created: '2024-01-01' },
      { id: 2, title: 'Java', description: 'Java topic', created: '2024-01-01' },
    ];
    service.getAll().subscribe(topics => {
      expect(topics.length).toBe(2);
      expect(topics[0].title).toBe('JavaScript');
    });
    http.expectOne(`${environment.apiUrl}/topics`).flush(mockTopics);
  });
});
