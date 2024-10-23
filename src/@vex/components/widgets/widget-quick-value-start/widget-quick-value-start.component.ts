import { Component, Input } from '@angular/core';
import { scaleInOutAnimation } from '../../../animations/scale-in-out.animation';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareBottomSheetComponent } from '../../share-bottom-sheet/share-bottom-sheet.component';

@Component({
  selector: 'vex-widget-quick-value-start',
  templateUrl: './widget-quick-value-start.component.html',
  animations: [scaleInOutAnimation]
})
export class WidgetQuickValueStartComponent {
  @Input() icon: string;
  @Input() value: string;
  @Input() label: string;
  @Input() change: number;
  @Input() changeSuffix: string;
  @Input() helpText: string;

  showButton: boolean;

  constructor(private _bottomSheet: MatBottomSheet) {}

  openSheet() {
    this._bottomSheet.open(ShareBottomSheetComponent);
  }
}
