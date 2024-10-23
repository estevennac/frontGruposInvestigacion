import { Component, Input, TemplateRef } from '@angular/core';
import packageJson from '../../../../package.json';

@Component({
  selector: 'vex-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() customTemplate: TemplateRef<any>;
  public projectVersion = packageJson.version;
  public year = new Date().getFullYear();

  constructor() {}
}
