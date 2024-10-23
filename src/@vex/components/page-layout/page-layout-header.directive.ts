import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[vexPageLayoutHeader],vex-page-layout-header'
})
export class PageLayoutHeaderDirective {
  @HostBinding('class') class = 'vex-page-layout-header';

  constructor() {}
}
