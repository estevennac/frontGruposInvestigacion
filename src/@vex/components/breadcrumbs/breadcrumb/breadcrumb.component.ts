import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'vex-breadcrumb',
  template: ` <ng-content></ng-content> `,
  styles: []
})
export class BreadcrumbComponent {
  @HostBinding('class') class =
    'vex-breadcrumb body-2 text-hint leading-none hover:text-primary no-underline trans-ease-out ltr:mr-2 rtl:ml-2';

  constructor() {}
}
