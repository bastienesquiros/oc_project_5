import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatPaginatorModule,
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
  totalElements = signal(0);
  currentPage = signal(0);
  pageSize = signal(10);
  sort = signal<FeedSort>('desc');

  constructor() {
    this.loadFeed();
  }

  loadFeed(): void {
    this.loading.set(true);
    this.feedService.getFeed(this.currentPage(), this.pageSize(), this.sort())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.posts.set(page.content);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSortChange(value: FeedSort): void {
    this.sort.set(value);
    this.currentPage.set(0);
    this.loadFeed();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadFeed();
  }
}
