import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'vex-config-panel-toggle',
  templateUrl: './config-panel-toggle.component.html',
  styleUrls: ['./config-panel-toggle.component.scss']
})
export class ConfigPanelToggleComponent {
  @Output() openConfig = new EventEmitter();

  constructor() {}
}
