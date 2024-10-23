import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareBottomSheetComponent } from '../../share-bottom-sheet/share-bottom-sheet.component';
import { scaleInOutAnimation } from '../../../animations/scale-in-out.animation';

@Component({
  selector: 'vex-widget-quick-value-center',
  templateUrl: './widget-quick-value-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation]
})
export class WidgetQuickValueCenterComponent {
  @Input() icon: string;
  @Input() value: string;
  @Input() label: string;
  @Input() change: number;
  @Input() helpText: string;
  @Input() iconClass: string;

  showButton: boolean;

  constructor(private _bottomSheet: MatBottomSheet) {}

  openSheet() {
    this._bottomSheet.open(ShareBottomSheetComponent);
  }
}
