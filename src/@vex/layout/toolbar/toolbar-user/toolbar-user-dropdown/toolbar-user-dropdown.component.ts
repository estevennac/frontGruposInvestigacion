import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from 'src/@vex/utils/track-by';
import { PopoverRef } from 'src/@vex/components/popover/popover-ref';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { TokenClaim } from 'src/app/types/token-claim.types';

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserDropdownComponent {
  // items: MenuItem[] = [
  //   {
  //     id: '1',
  //     icon: 'mat:account_circle',
  //     label: 'Mi perfil',
  //     description: 'Información personal',
  //     colorClass: 'text-teal',
  //     route: '/mi-perfil'
  //   }
  // ];

  trackById = trackById;
  tokenClaims: TokenClaim = this.authService.tokenClaims;

  constructor(
    private cd: ChangeDetectorRef,
    private popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
    private authService: AuthService
  ) {}

  logout() {
    this.popoverRef.close();
    this.authService.logout();
  }

  close() {
    this.popoverRef.close();
  }
}
