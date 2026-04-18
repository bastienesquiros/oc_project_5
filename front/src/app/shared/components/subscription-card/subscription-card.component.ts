import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss',
})
export class SubscriptionCardComponent {
  title = input.required<string>();
  description = input<string>();

  unsubscribe = output<void>();
}
