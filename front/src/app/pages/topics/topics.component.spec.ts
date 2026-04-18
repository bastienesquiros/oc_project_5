import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TopicsComponent } from './topics.component';
import { TopicService } from '../../core/services/topic.service';
import { UserService } from '../../core/services/user.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';

import { TopicResponse, SubscriptionResponse } from '../../core/models';

const mockTopic = (id: number): TopicResponse => ({ id, title: `Topic ${id}`, description: `Desc ${id}`, created: '2024-01-01' });
const mockSub = (id: number, topicId: number): SubscriptionResponse => ({ id, userId: 1, topicId, topicTitle: `Topic ${topicId}`, created: '2024-01-01' });
const mockUser = (subs: SubscriptionResponse[]) => ({ id: 1, displayName: 'alice', email: 'a@a.com', subscriptions: subs, created: '2024-01-01' });

describe('TopicsComponent', () => {
  let fixture: ComponentFixture<TopicsComponent>;
  let component: TopicsComponent;
  let topicSvc: jest.Mocked<Pick<TopicService, 'getAll'>>;
  let userSvc: jest.Mocked<Pick<UserService, 'getMe'>>;
  let subSvc: jest.Mocked<Pick<SubscriptionService, 'subscribe' | 'unsubscribe'>>;

  beforeEach(async () => {
    topicSvc = { getAll: jest.fn().mockReturnValue(of([mockTopic(1), mockTopic(2)])) };
    userSvc = { getMe: jest.fn().mockReturnValue(of(mockUser([mockSub(10, 1)]))) };
    subSvc = { subscribe: jest.fn().mockReturnValue(of({})), unsubscribe: jest.fn().mockReturnValue(of(void 0)) };
    const authSpy = { isAuthenticated: jest.fn().mockReturnValue(true), getToken: jest.fn().mockReturnValue('token') };

    await TestBed.configureTestingModule({
      imports: [TopicsComponent],
      providers: [
        provideRouter([]),
        { provide: TopicService, useValue: topicSvc },
        { provide: UserService, useValue: userSvc },
        { provide: SubscriptionService, useValue: subSvc },
        { provide: AuthService, useValue: authSpy },
      ],
    })
    .overrideComponent(NavbarComponent, { set: { template: '<nav></nav>' } })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load topics and user on init', () => {
    expect(component.topics().length).toBe(2);
    expect(component.user()).not.toBeNull();
    expect(component.loading()).toBe(false);
  });

  it('isSubscribed() should return true for subscribed topic', () => {
    expect(component.isSubscribed(1)).toBe(true);
    expect(component.isSubscribed(2)).toBe(false);
  });

  it('subscribe() should call service and refresh user', () => {
    userSvc.getMe.mockReturnValue(of(mockUser([mockSub(10, 1), mockSub(11, 2)])));
    component.subscribe(2);
    expect(subSvc.subscribe).toHaveBeenCalledWith({ topicId: 2 });
    expect(component.isSubscribed(2)).toBe(true);
  });

  it('unsubscribe() should call service with subscription id', () => {
    userSvc.getMe.mockReturnValue(of(mockUser([])));
    component.unsubscribe(1);
    expect(subSvc.unsubscribe).toHaveBeenCalledWith(10);
  });
});
