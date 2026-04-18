import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../core/services/user.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { SubscriptionResponse } from '../../core/models';

const mockSub = (id: number): SubscriptionResponse => ({ id, userId: 1, topicId: id, topicTitle: `Topic ${id}`, created: '2024-01-01' });
const mockUser = (subs = [mockSub(1)]) => ({ id: 1, displayName: 'alice', email: 'alice@test.com', subscriptions: subs, created: '2024-01-01' });

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let userSvc: jest.Mocked<Pick<UserService, 'getMe' | 'updateMe'>>;
  let subSvc: jest.Mocked<Pick<SubscriptionService, 'unsubscribe'>>;

  beforeEach(async () => {
    userSvc = {
      getMe: jest.fn().mockReturnValue(of(mockUser())),
      updateMe: jest.fn().mockReturnValue(of(mockUser())),
    };
    subSvc = { unsubscribe: jest.fn().mockReturnValue(of(void 0)) };
    const authSpy = { isAuthenticated: jest.fn().mockReturnValue(true), getToken: jest.fn().mockReturnValue('token') };

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userSvc },
        { provide: SubscriptionService, useValue: subSvc },
        { provide: AuthService, useValue: authSpy },
      ],
    })
    .overrideComponent(NavbarComponent, { set: { template: '<nav></nav>' } })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load user and patch form on init', () => {
    expect(component.user()).not.toBeNull();
    expect(component.form.value.username).toBe('alice');
    expect(component.form.value.email).toBe('alice@test.com');
    expect(component.loading()).toBe(false);
  });

  it('save() should call updateMe and set success message', () => {
    component.form.setValue({ username: 'alice', email: 'alice@test.com', password: '' });
    component.form.markAsDirty();
    component.save();
    expect(userSvc.updateMe).toHaveBeenCalled();
    expect(component.successMessage()).toBe('Profil mis à jour');
    expect(component.saving()).toBe(false);
  });

  it('unsubscribe() should call service and reload user', () => {
    userSvc.getMe.mockReturnValue(of(mockUser([])));
    component.unsubscribe(1);
    expect(subSvc.unsubscribe).toHaveBeenCalledWith(1);
    expect(component.user()?.subscriptions.length).toBe(0);
  });
});
