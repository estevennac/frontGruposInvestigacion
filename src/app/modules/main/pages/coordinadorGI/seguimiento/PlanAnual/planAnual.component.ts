import { Component, OnInit } from '@angular/core';
import { Annexes } from 'src/app/types/annexes.types';
import { AnnexesService } from 'src/app/core/http/annexes/annexes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { DocumentsService } from 'src/app/core/http/documentos/documents.service';
import { InvGroupService } from 'src/app/core/http/inv-group/inv-group.service';
import { CreationReqService } from 'src/app/core/http/creation-req/creation-req.service';
import { CreationReqForm } from 'src/app/types/creationReq.types';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DevelopmentPlanService } from 'src/app/core/http/develop-plan-form/develop-plan-form.service';
@Component({
    selector: 'app-carga-anexo',
    templateUrl: './planAnual.component.html',
    styleUrls: ['./planAnual.component.scss']
})
export class AnnualPlanComponent implements OnInit {
    currentDate: Date = new Date();
    currentUser: string;
    groupId: number;
    token: string
    constructor(
        private annexesService: AnnexesService,
        private router: Router,
        private authService: AuthService,
        private documentService: DocumentsService,
        private invGroupService: InvGroupService,
        private creationReqService: CreationReqService,
        private matSnackBar:MatSnackBar,
        private developmentPlanService:DevelopmentPlanService
    ) { }

    ngOnInit(): void {
        this.groupId = Number(sessionStorage.getItem("invGroup"));
        this.loadDevelopmentPlan();
    }
   loadDevelopmentPlan(){
        this.developmentPlanService.getAllByIdGroupStateType(this.groupId,"c","a").subscribe(
            (response) => {
                console.log(response);
            }
        )
}
}
