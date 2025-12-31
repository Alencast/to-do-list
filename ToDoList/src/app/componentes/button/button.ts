import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-button',
  imports: [ButtonModule, RippleModule, TooltipModule],
  template: `
    <p-button 
      [label]="label()"
      [icon]="icon()"
      [class]="buttonClass()"
      (onClick)="handleClick()"
      [pTooltip]="tooltip()"
      tooltipPosition="top"
      pRipple>
    </p-button>
  `
})
export class Button {
  label = input<string>('');
  icon = input<string>('');
  buttonClass = input<string>('');
  tooltip = input<string>('');
  clicked = output<void>();

  handleClick() {
    this.clicked.emit();
  }
}
