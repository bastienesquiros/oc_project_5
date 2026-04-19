import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { AuthService } from './core/services/auth.service';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [guestGuard] },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },
  { path: 'feed', loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent), canActivate: [authGuard] },
  { path: 'topics', loadComponent: () => import('./pages/topics/topics.component').then(m => m.TopicsComponent), canActivate: [authGuard] },
  { path: 'posts/create', loadComponent: () => import('./pages/create-post/create-post.component').then(m => m.CreatePostComponent), canActivate: [authGuard] },
  { path: 'posts/:id', loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: () => inject(AuthService).isAuthenticated() ? '/feed' : '/' }
];

