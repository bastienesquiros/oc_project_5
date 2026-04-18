import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedComponent } from './feed.component';
import { FeedService } from '../../core/services/feed.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';

import { PostResponse, Page } from '../../core/models';

const mockPage = (posts: PostResponse[]): Page<PostResponse> => ({
  content: posts, totalElements: posts.length, totalPages: 1,
  size: 50, number: 0, first: true, last: true, empty: posts.length === 0,
});

const mockPost = (id: number): PostResponse => ({
  id, title: `Post ${id}`, content: 'Content', authorId: 1,
  authorUsername: 'alice', topicId: 1, topicTitle: 'JS',
  created: '2024-01-01', lastModified: '2024-01-01',
});

describe('FeedComponent', () => {
  let fixture: ComponentFixture<FeedComponent>;
  let component: FeedComponent;
  let feedService: jest.Mocked<FeedService>;

  beforeEach(async () => {
    const feedSpy = { getFeed: jest.fn().mockReturnValue(of(mockPage([mockPost(1), mockPost(2)]))) } as jest.Mocked<Pick<FeedService, 'getFeed'>>;
    const authSpy = { isAuthenticated: jest.fn().mockReturnValue(true), getToken: jest.fn().mockReturnValue('token') } as jest.Mocked<Pick<AuthService, 'isAuthenticated' | 'getToken'>>;

    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        provideRouter([]),
        { provide: FeedService, useValue: feedSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    })
    .overrideComponent(NavbarComponent, { set: { template: '<nav></nav>' } })
    .compileComponents();

    feedService = TestBed.inject(FeedService) as jest.Mocked<FeedService>;
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load posts on init', () => {
    expect(feedService.getFeed).toHaveBeenCalledWith(0, 50, 'desc');
    expect(component.posts().length).toBe(2);
    expect(component.loading()).toBe(false);
  });

  it('should toggle sort from desc to asc and reload', () => {
    feedService.getFeed.mockReturnValue(of(mockPage([mockPost(1)])));
    component.toggleSort();
    expect(component.sort()).toBe('asc');
    expect(feedService.getFeed).toHaveBeenCalledWith(0, 50, 'asc');
  });

  it('should toggle sort back to desc', () => {
    feedService.getFeed.mockReturnValue(of(mockPage([])));
    component.toggleSort();
    component.toggleSort();
    expect(component.sort()).toBe('desc');
  });
});
