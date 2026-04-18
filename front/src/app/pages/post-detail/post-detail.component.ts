import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
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
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    NavbarComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  private route = inject(ActivatedRoute);
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
