import { Component, OnInit } from '@angular/core';
import { GlobalUser } from 'src/app/types/user.types';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vex-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  globalUser$: Observable<GlobalUser>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.globalUser$ = this.authService.globalUser$;
  }
}
