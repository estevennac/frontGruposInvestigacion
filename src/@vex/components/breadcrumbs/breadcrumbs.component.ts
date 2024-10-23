import { Component, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'src/@vex/interfaces/breadcrumb.interface';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';

@Component({
  selector: 'vex-breadcrumbs',
  template: `
    <div class="flex items-center">
      <vex-breadcrumb>
        <a [routerLink]="['/']">
          <mat-icon svgIcon="mat:home" class="icon-sm"></mat-icon>
        </a>
      </vex-breadcrumb>
      <ng-container *ngFor="let crumb of crumbs">
        <div class="w-1 h-1 bg-gray rounded-full ltr:mr-2 rtl:ml-2"></div>
        <vex-breadcrumb>
          <a *ngIf="crumb.routerLink" [routerLink]="crumb.routerLink">
            {{ crumb.label }}
          </a>
          <ng-container *ngIf="!crumb.routerLink">
            {{ crumb.label }}
          </ng-container>
        </vex-breadcrumb>
      </ng-container>
    </div>
  `
})
export class BreadcrumbsComponent implements OnDestroy {
  subscription: Subscription;

  crumbs: Breadcrumb[] = [];

  constructor(public breadcrumbService: BreadcrumbService) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.crumbs = response;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
