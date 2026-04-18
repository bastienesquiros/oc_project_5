import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PostService } from '../../core/services/post.service';
import { CommentService } from '../../core/services/comment.service';
import { PostResponse, CommentResponse } from '../../core/models';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  post = signal<PostResponse | null>(null);
  comments = signal<CommentResponse[]>([]);
  loading = signal(true);
  submittingComment = signal(false);

  commentForm = this.fb.group({
    content: ['', Validators.required],
  });

  constructor() {
    const id = Number(this.route.snapshot.params['id']);
    if (isNaN(id)) {
      this.router.navigate(['/feed']);
      return;
    }
    this.postService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (post) => {
          this.post.set(post);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });

    this.postService.getComments(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(comments => this.comments.set(comments));
  }

  goBack(): void {
    this.location.back();
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.post()) return;
    this.submittingComment.set(true);
    const postId = this.post()!.id;
    const { content } = this.commentForm.value;
    this.commentService.create({ content: content!, postId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (comment) => {
          this.comments.update(list => [...list, comment]);
          this.commentForm.reset();
          this.submittingComment.set(false);
        },
        error: () => this.submittingComment.set(false),
      });
  }
}
