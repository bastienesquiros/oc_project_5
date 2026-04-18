import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FeedService, FeedSort } from '../../core/services/feed.service';
import { PostResponse } from '../../core/models';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  private feedService = inject(FeedService);
  private destroyRef = inject(DestroyRef);

  posts = signal<PostResponse[]>([]);
  loading = signal(true);
  sort = signal<FeedSort>('desc');

  constructor() {
    this.loadFeed();
  }

  loadFeed(): void {
    this.loading.set(true);
    this.feedService.getFeed(0, 50, this.sort())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.posts.set(page.content);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  toggleSort(): void {
    this.sort.set(this.sort() === 'desc' ? 'asc' : 'desc');
    this.loadFeed();
  }
}
