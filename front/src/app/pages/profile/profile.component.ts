import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SubscriptionCardComponent } from '../../shared/components/subscription-card/subscription-card.component';
import { UserService } from '../../core/services/user.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { UserResponse } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent,
    SubscriptionCardComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private userService = inject(UserService);
  private subscriptionService = inject(SubscriptionService);
  private destroyRef = inject(DestroyRef);

  user = signal<UserResponse | null>(null);
  loading = signal(true);
  saving = signal(false);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    username: [''],
    email: [''],
    password: [''],
  });

  constructor() {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.form.patchValue({ username: user.displayName, email: user.email, password: '' });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (!this.form.dirty) return;

    this.saving.set(true);
    this.successMessage.set(null);
    const { username, email, password } = this.form.value;
    const request: { username?: string; email?: string; password?: string } = {};
    if (username) request.username = username;
    if (email) request.email = email;
    if (password) request.password = password;

    this.userService.updateMe(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.successMessage.set('Profil mis à jour');
          this.saving.set(false);
        },
        error: () => this.saving.set(false),
      });
  }

  unsubscribe(subscriptionId: number): void {
    this.subscriptionService.unsubscribe(subscriptionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadUser());
  }
}
