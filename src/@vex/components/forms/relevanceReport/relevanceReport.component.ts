import { Component, Input, OnInit } from '@angular/core';
import { RelevanceReportService } from 'src/app/core/http/relevance-report/relevance-report.service';
import { RelevanceReport } from 'src/app/types/relevancereport.types';
//import {InvGroupService} from 'src/app/core/http/inv-group/inv-group.service';
@Component({
    selector: 'app-relevanceReportForm-component',
    templateUrl: './relevanceReport.component.html',
    styleUrls: ['./relevanceReport.component.scss']
  })
export class InformePertinenciaComponent implements OnInit {
    @Input() id!: number;
    loading: boolean = true;
    report: RelevanceReport; // Variable para almacenar los datos
    currentDate: Date = new Date();
  
    constructor(private relevaceReportService: RelevanceReportService) {}
  
    ngOnInit() {
      this.loadReport();
    }
  
    loadReport() {
      this.relevaceReportService.getByGroup(this.id).subscribe((data: RelevanceReport) => {
        this.report = data;
        this.loading = false;
      }, error => {
        console.error("Error al cargar el informe:", error);
        this.loading = false;
      });
    }
  }
  