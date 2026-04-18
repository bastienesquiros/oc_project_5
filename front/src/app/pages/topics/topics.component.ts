import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TopicService } from '../../core/services/topic.service';
import { UserService } from '../../core/services/user.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { TopicResponse, UserResponse } from '../../core/models';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent {
  private topicService = inject(TopicService);
  private userService = inject(UserService);
  private subscriptionService = inject(SubscriptionService);
  private destroyRef = inject(DestroyRef);

  topics = signal<TopicResponse[]>([]);
  user = signal<UserResponse | null>(null);
  loading = signal(true);
  loadingTopics = signal<Set<number>>(new Set());

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.topicService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(topics => this.topics.set(topics));

    this.userService.getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  getSubscriptionId(topicId: number): number | null {
    const sub = this.user()?.subscriptions.find(s => s.topicId === topicId);
    return sub ? sub.id : null;
  }

  isSubscribed(topicId: number): boolean {
    return this.getSubscriptionId(topicId) !== null;
  }

  subscribe(topicId: number): void {
    if (this.loadingTopics().has(topicId)) return;
    this.loadingTopics.update(s => new Set(s).add(topicId));
    this.subscriptionService.subscribe({ topicId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refreshUser();
          this.loadingTopics.update(s => { const n = new Set(s); n.delete(topicId); return n; });
        },
        error: () => this.loadingTopics.update(s => { const n = new Set(s); n.delete(topicId); return n; }),
      });
  }

  unsubscribe(topicId: number): void {
    if (this.loadingTopics().has(topicId)) return;
    const subId = this.getSubscriptionId(topicId);
    if (subId === null) return;
    this.loadingTopics.update(s => new Set(s).add(topicId));
    this.subscriptionService.unsubscribe(subId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.refreshUser();
          this.loadingTopics.update(s => { const n = new Set(s); n.delete(topicId); return n; });
        },
        error: () => this.loadingTopics.update(s => { const n = new Set(s); n.delete(topicId); return n; }),
      });
  }

  private refreshUser(): void {
    this.userService.getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.user.set(user));
  }
}
