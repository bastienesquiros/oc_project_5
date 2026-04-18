import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TopicService } from '../../core/services/topic.service';
import { PostService } from '../../core/services/post.service';
import { TopicResponse } from '../../core/models';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private topicService = inject(TopicService);
  private postService = inject(PostService);
  private destroyRef = inject(DestroyRef);

  topics = signal<TopicResponse[]>([]);
  loading = signal(false);

  form = this.fb.group({
    topicId: [null as number | null, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(50)]],
    content: ['', Validators.required],
  });

  constructor() {
    this.topicService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(topics => this.topics.set(topics));
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { topicId, title, content } = this.form.value;
    this.postService.create({ topicId: topicId!, title: title!, content: content! })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/feed']),
        error: () => this.loading.set(false),
      });
  }
}
