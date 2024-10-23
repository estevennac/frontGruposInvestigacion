import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[vexPageLayoutContent],vex-page-layout-content'
})
export class PageLayoutContentDirective {
  @HostBinding('class') class = 'vex-page-layout-content';

  constructor() {}
}
