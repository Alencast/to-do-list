import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  template: ` <p-button 
                  icon="pi pi-eye"
                  label="{{ label }}"
                  class="p-button-text p-button-info p-button-sm"             
                  tooltipPosition="top"
                  pRipple>
                </p-button>`
})
export class Button {
  @Input() label: string = 'Ver';
  @Output() onClick = new EventEmitter<void>();

}
