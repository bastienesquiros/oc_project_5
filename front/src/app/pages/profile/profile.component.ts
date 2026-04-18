import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { UserResponse } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
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
          this.form.patchValue({
            username: user.displayName,
            email: user.email,
            password: '',
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  save(): void {
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
          this.successMessage.set('Profil mis à jour avec succès');
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}
