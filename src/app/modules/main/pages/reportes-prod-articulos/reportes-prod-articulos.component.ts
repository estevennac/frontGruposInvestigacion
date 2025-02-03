import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { InvGroupForm } from 'src/app/types/invGroup.types';
import { SolCreaGiService } from 'src/app/core/http/sol-crea-gi/sol-crea-gi.service';
import { InvgActiService } from 'src/app/core/http/invg-acti/invg-acti.service';
import { MagazinesService } from 'src/app/core/http/magazines/magazines.service';
import { BookChapterService } from 'src/app/core/http/book-chapter/book-chapter.service';
import { FormGroup } from '@angular/forms';
import { CongressService } from 'src/app/core/http/congress/congress.service';
import { ResearchProjectService } from 'src/app/core/http/research-project/research-project.service';
import { DegreeTesisService } from 'src/app/core/http/degree-tesis/degree-tesis.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes-prod-articulos',
  templateUrl: './reportes-prod-articulos.component.html',
  styleUrls: ['./reportes-prod-articulos.component.scss']
})
export class ReportesProdArticulosComponent implements OnInit, OnDestroy {
  grupos: InvGroupForm[] = [];
  groups: InvGroupForm[] = [];
  grupoForm: FormGroup;
  revistasPorGrupo: { [groupId: number]: number } = {};
  librosPorGrupo: { [groupId: number]: number } = {};
  congresosPorGrupo: { [groupId: number]: number } = {};
  proyectosPorGrupo: { [groupId: number]: number } = {};
  tesisGradoPorGrupo: { [groupId: number]: number } = {};
  pieChart: any;
  totalPublicacionesChart: any;
  nombreGrupo: string;
  grupoSeleccionado: InvGroupForm;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private grupoService: SolCreaGiService,
    private invgActiService: InvgActiService,
    private revistasService: MagazinesService,
    private librosService: BookChapterService,
    private congresosService: CongressService,
    private proyectosService: ResearchProjectService,
    private tesisGradoService: DegreeTesisService
  ) {}

  ngOnInit(): void {
    this.loadGrupos();
    this.updateTotalPublicacionesChart();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  loadGrupos(): void {
    this.grupoService.getAll().subscribe(grupos => {
      this.grupos = grupos;
      if (this.grupos.length > 0) {
        this.handleGrupoSelectionChange(this.grupos[0]);
        // this.handleGrupoSelectionChange({ target: { value: this.grupos[0].nombreGrupoInv } });
        // const primerGrupo = this.grupos[0];
        //this.nombreGrupo = primerGrupo.nombreGrupoInv;
      }
    });

    this.grupoService.getAll().subscribe(groups => {
      this.groups = groups;
      if (this.grupos.length > 0) {
        this.handleGrupoSelectionChange({
          target: { value: this.groups[0].nombreGrupoInv }
        });
        const primerGrupo = this.groups[0];
        this.nombreGrupo = primerGrupo.nombreGrupoInv;
      }
    });
  }

  handleGrupoSelectionChange(event: any) {
    console.log('Seleccionando nuevo grupo...');
    const selectedGrupoName = (event.target as HTMLSelectElement).value;
    const grupoSeleccionado = this.grupos.find(
      grupo => grupo.nombreGrupoInv === selectedGrupoName
    );
    this.grupoSeleccionado = grupoSeleccionado;

    this.revistasPorGrupo = {};
    this.librosPorGrupo = {};
    this.congresosPorGrupo = {};
    this.proyectosPorGrupo = {};
    this.tesisGradoPorGrupo = {};
    this.calcularRevistasPorGrupo(grupoSeleccionado);
    this.calcularLibrosPorGrupo(grupoSeleccionado);
    this.calcularCongresosPorGrupo(grupoSeleccionado);
    this.calcularProyectosPorGrupo(grupoSeleccionado);
    this.calcularTesisGradoPorGrupo(grupoSeleccionado);
    this.updateTotalPublicacionesChart();
    this.updatePieChart();
  }

  /*
  handleGrupoSelectionChange(event: any) {
    console.log('Seleccionando nuevo grupo...');
    const selectedGrupoName = (event.target as HTMLSelectElement).value;
    const grupoSeleccionado = this.grupos.find(
      grupo => grupo.nombreGrupoInv === selectedGrupoName
    );
    this.grupoSeleccionado = grupoSeleccionado; 
    this.revistasPorGrupo = {};
    this.librosPorGrupo = {};
    this.congresosPorGrupo = {};
    this.proyectosPorGrupo ={};
    this.tesisGradoPorGrupo={};
    this.updatePieChart();

    this.grupos.forEach(grupo => {
        this.calcularRevistasPorGrupo(grupo);
        this.calcularLibrosPorGrupo(grupo);
        this.calcularCongresosPorGrupo(grupo);
        this.calcularProyectosPorGrupo(grupo);
        this.calcularTesisGradoPorGrupo(grupo);
    });

    this.updateTotalPublicacionesChart();
    
}*/

  calcularRevistasPorGrupo(grupoSeleccionado: InvGroupForm): void {
    this.invgActiService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(invgActis => {
        const relevantInvgActis = invgActis.filter(
          invgActi => invgActi.idGrupoInv === grupoSeleccionado.idGrupoInv
        );
        console.log(
          'InvgActis para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          relevantInvgActis
        );
        const activityReportIds = relevantInvgActis.map(
          invgActi => invgActi.idInformeActividades
        );
        console.log(
          'IDs de Informe de Actividades para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          activityReportIds
        );
        this.revistasService
          .getAll()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(revistas => {
            const revistasGrupo = revistas.filter(revista =>
              activityReportIds.includes(revista.idInformeActividades)
            );
            console.log(
              'Revistas para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              revistasGrupo
            );
            this.revistasPorGrupo[grupoSeleccionado.idGrupoInv] =
              revistasGrupo.length;
            console.log(
              'Número de Revistas para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              this.revistasPorGrupo[grupoSeleccionado.idGrupoInv]
            );
            this.updateTotalPublicacionesChart();
            this.updatePieChart();
          });
      });
  }

  calcularLibrosPorGrupo(grupoSeleccionado: InvGroupForm): void {
    this.invgActiService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(invgActis => {
        const relevantInvgActis = invgActis.filter(
          invgActi => invgActi.idGrupoInv === grupoSeleccionado.idGrupoInv
        );
        console.log(
          'InvgActis para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          relevantInvgActis
        );
        const activityReportIds = relevantInvgActis.map(
          invgActi => invgActi.idInformeActividades
        );
        console.log(
          'IDs de Informe de Actividades para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          activityReportIds
        );
        this.librosService
          .getAll()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(libros => {
            const librosGrupo = libros.filter(libro =>
              activityReportIds.includes(libro.idInformeActividades)
            );
            console.log(
              'Libros para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              librosGrupo
            );
            this.librosPorGrupo[grupoSeleccionado.idGrupoInv] =
              librosGrupo.length;
            console.log(
              'Número de Libros para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              this.librosPorGrupo[grupoSeleccionado.idGrupoInv]
            );
            this.updateTotalPublicacionesChart();
            this.updatePieChart();
          });
      });
  }

  calcularCongresosPorGrupo(grupoSeleccionado: InvGroupForm): void {
    this.invgActiService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(invgActis => {
        const relevantInvgActis = invgActis.filter(
          invgActi => invgActi.idGrupoInv === grupoSeleccionado.idGrupoInv
        );
        console.log(
          'InvgActis para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          relevantInvgActis
        );
        const activityReportIds = relevantInvgActis.map(
          invgActi => invgActi.idInformeActividades
        );
        console.log(
          'IDs de Informe de Actividades para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          activityReportIds
        );
        this.congresosService
          .getAll()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(congresos => {
            const congresosGrupo = congresos.filter(congreso =>
              activityReportIds.includes(congreso.idInformeActividad)
            );
            console.log(
              'Congresos para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              congresosGrupo
            );
            this.congresosPorGrupo[grupoSeleccionado.idGrupoInv] =
              congresosGrupo.length;
            console.log(
              'Número de Congresos para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              this.congresosPorGrupo[grupoSeleccionado.idGrupoInv]
            );
            this.updateTotalPublicacionesChart();
            this.updatePieChart();
          });
      });
  }

  calcularProyectosPorGrupo(grupoSeleccionado: InvGroupForm): void {
    this.invgActiService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(invgActis => {
        const relevantInvgActis = invgActis.filter(
          invgActi => invgActi.idGrupoInv === grupoSeleccionado.idGrupoInv
        );
        const activityReportIds = relevantInvgActis.map(
          invgActi => invgActi.idInformeActividades
        );
        this.proyectosService
          .getAll()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(proyectos => {
            const proyectosGrupo = proyectos.filter(proyecto =>
              activityReportIds.includes(proyecto.idInformeActividades)
            );
            this.proyectosPorGrupo[grupoSeleccionado.idGrupoInv] =
              proyectosGrupo.length;
            this.updateTotalPublicacionesChart();
            this.updatePieChart();
          });
      });
  }

  calcularTesisGradoPorGrupo(grupoSeleccionado: InvGroupForm): void {
    this.invgActiService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(invgActis => {
        const relevantInvgActis = invgActis.filter(
          invgActi => invgActi.idGrupoInv === grupoSeleccionado.idGrupoInv
        );
        console.log(
          'InvgActis para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          relevantInvgActis
        );
        const activityReportIds = relevantInvgActis.map(
          invgActi => invgActi.idInformeActividades
        );
        console.log(
          'IDs de Informe de Actividades para el grupo',
          grupoSeleccionado.nombreGrupoInv + ':',
          activityReportIds
        );
        this.tesisGradoService
          .getAll()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(tesis => {
            const tesisGrupo = tesis.filter(t =>
              activityReportIds.includes(t.idInformeActividades)
            );
            console.log(
              'Tesis de Grado para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              tesisGrupo
            );
            this.tesisGradoPorGrupo[grupoSeleccionado.idGrupoInv] =
              tesisGrupo.length;
            console.log(
              'Número de Tesis de Grado para el grupo',
              grupoSeleccionado.nombreGrupoInv + ':',
              this.tesisGradoPorGrupo[grupoSeleccionado.idGrupoInv]
            );
            this.updateTotalPublicacionesChart();
            this.updatePieChart();
          });
      });
  }

  updatePieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const canvas = document.getElementById(
      'pieChartCanvas'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const grupos = Object.keys(this.revistasPorGrupo);
    const revistasData = Object.values(this.revistasPorGrupo);
    const librosData = Object.values(this.librosPorGrupo);
    const congresosData = Object.values(this.congresosPorGrupo);
    const proyectosData = Object.values(this.proyectosPorGrupo);
    const tesisGradoData = Object.values(this.tesisGradoPorGrupo);
    const totalRevistas = revistasData.reduce((acc, curr) => acc + curr, 0);
    const totalProyectos = proyectosData.reduce((acc, curr) => acc + curr, 0);
    const totalLibros = librosData.reduce((acc, curr) => acc + curr, 0);
    const totalCongresos = congresosData.reduce((acc, curr) => acc + curr, 0);
    const totalTesisGrado = tesisGradoData.reduce((acc, curr) => acc + curr, 0);

    const totalData = [
      ...revistasData,
      ...librosData,
      ...congresosData,
      ...proyectosData,
      ...tesisGradoData
    ];
    const colores = this.generateUniqueColors(grupos.length * 5);

    const data = {
      labels: [],
      datasets: [
        {
          label: 'Artículos',
          data: totalData,
          backgroundColor: colores
        }
      ]
    };

    let offset = 0;

    for (let i = 0; i < grupos.length; i++) {
      const grupo = grupos[i];

      const revistasCount = this.revistasPorGrupo[grupo];
      const librosCount = this.librosPorGrupo[grupo];
      const congresosCount = this.congresosPorGrupo[grupo];
      const proyectosCount = this.proyectosPorGrupo[grupo];
      const tesisGradoCount = this.tesisGradoPorGrupo[grupo];

      data.labels.push(`Revistas (${revistasCount})`);
      data.labels.push(`Libros (${librosCount})`);
      data.labels.push(`Congresos (${congresosCount})`);
      data.labels.push(`Proyectos (${proyectosCount})`);
      data.labels.push(`Tesis Grado (${tesisGradoCount})`);

      data.datasets[0].data[i * 5] = revistasCount;
      data.datasets[0].data[i * 5 + 1] = librosCount;
      data.datasets[0].data[i * 5 + 2] = congresosCount;
      data.datasets[0].data[i * 5 + 3] = proyectosCount;
      data.datasets[0].data[i * 5 + 4] = tesisGradoCount;

      offset +=
        ((revistasCount +
          librosCount +
          congresosCount +
          proyectosCount +
          tesisGradoCount) /
          (totalRevistas +
            totalLibros +
            totalCongresos +
            totalProyectos +
            totalTesisGrado)) *
        360;
    }

    const options: any = {
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: '#fff',
          precision: 2
        }
      }
    };

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: options
    });
  }

  generateUniqueColors(count: number): string[] {
    const colors: string[] = [];
    const letters = '0123456789ABCDEF';
    for (let i = 0; i < count; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
    return colors;
  }

  getTotalPublicaciones(groupId: number): number {
    const revistasCount = this.revistasPorGrupo[groupId] || 0;
    const librosCount = this.librosPorGrupo[groupId] || 0;
    const congresosCount = this.congresosPorGrupo[groupId] || 0;
    const proyectosCount = this.proyectosPorGrupo[groupId] || 0;
    const tesisGradoCount = this.tesisGradoPorGrupo[groupId] || 0;

    return (
      revistasCount +
      librosCount +
      congresosCount +
      proyectosCount +
      tesisGradoCount
    );
  }

  getTotalPublicacionesTodosGrupos(): number {
    let total = 0;
    for (const groupId in this.grupos) {
      total += this.getTotalPublicaciones(+groupId);
    }
    return total;
  }

  /*
updateTotalPublicacionesChart(): void {
  if (this.totalPublicacionesChart) {
    this.totalPublicacionesChart.destroy();
  }

  const canvas = document.getElementById('totalPublicacionesCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  const totalData = [];
  const grupos = [];

  // Calcular el total de publicaciones para todos los grupos
  let totalPublicacionesTodosGrupos = 0;

  this.grupos.forEach(grupo => {
    const totalRevistas = this.revistasPorGrupo[grupo.idGrupoInv] || 0;
    const totalLibros = this.librosPorGrupo[grupo.idGrupoInv] || 0;
    const totalCongresos = this.congresosPorGrupo[grupo.idGrupoInv] || 0;
    const totalProyectos = this.proyectosPorGrupo[grupo.idGrupoInv] || 0;
    const totalTesisGrado = this.tesisGradoPorGrupo[grupo.idGrupoInv] || 0;

    const totalGrupo = totalRevistas + totalLibros + totalCongresos + totalProyectos + totalTesisGrado;
    
    totalData.push(totalGrupo);
    grupos.push(`Grupo ${grupo.idGrupoInv}`); // O utiliza alguna otra propiedad que identifique al grupo

    totalPublicacionesTodosGrupos += totalGrupo;
  });

  // Agregar una entrada adicional para mostrar el total de publicaciones de todos los grupos
  grupos.push('Total');
  totalData.push(totalPublicacionesTodosGrupos);

  const data = {
    labels: grupos,
    datasets: [{
      label: 'Total de Publicaciones por Grupo',
      data: totalData,
      backgroundColor: [
        'red',
        'blue',
        'green',
        'yellow',
        'orange',
        'purple' // Color para la entrada del total
      ]
    }]
  };

  this.totalPublicacionesChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
*/

  updateTotalPublicacionesChart(): void {
    if (this.totalPublicacionesChart) {
      this.totalPublicacionesChart.destroy();
    }

    const canvas = document.getElementById(
      'totalPublicacionesCanvas'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const totalData = [];
    const grupos = [];

    this.groups.forEach(grupo => {
      // Cambiar a this.groups
      const totalRevistas = this.revistasPorGrupo[grupo.idGrupoInv] || 0;
      const totalLibros = this.librosPorGrupo[grupo.idGrupoInv] || 0;
      const totalCongresos = this.congresosPorGrupo[grupo.idGrupoInv] || 0;
      const totalProyectos = this.proyectosPorGrupo[grupo.idGrupoInv] || 0;
      const totalTesisGrado = this.tesisGradoPorGrupo[grupo.idGrupoInv] || 0;

      const totalGrupo =
        totalRevistas +
        totalLibros +
        totalCongresos +
        totalProyectos +
        totalTesisGrado;

      totalData.push(totalGrupo);
      grupos.push(`Grupo ${grupo.idGrupoInv}`); // O utiliza alguna otra propiedad que identifique al grupo
    });

    const data = {
      labels: grupos,
      datasets: [
        {
          label: 'Total de Publicaciones por Grupo',
          data: totalData,
          backgroundColor: this.generateUniqueColors(grupos.length) // Usar colores únicos para cada grupo
        }
      ]
    };

    this.totalPublicacionesChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  /*
updateTotalPublicacionesChart(): void {
  if (this.totalPublicacionesChart) {
    this.totalPublicacionesChart.destroy();
  }

  const canvas = document.getElementById('totalPublicacionesCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  const totalData = [];
  const grupos = [];

  this.groups.forEach(grupo => {
    const totalRevistas = this.revistasPorGrupo[grupo.idGrupoInv] || 0;
    const totalLibros = this.librosPorGrupo[grupo.idGrupoInv] || 0;
    const totalCongresos = this.congresosPorGrupo[grupo.idGrupoInv] || 0;
    const totalProyectos = this.proyectosPorGrupo[grupo.idGrupoInv] || 0;
    const totalTesisGrado = this.tesisGradoPorGrupo[grupo.idGrupoInv] || 0;

    console.log(`Grupo ${grupo.idGrupoInv}: Revistas ${totalRevistas}, Libros ${totalLibros}, Congresos ${totalCongresos}, Proyectos ${totalProyectos}, Tesis Grado ${totalTesisGrado}`);

    const totalGrupo = totalRevistas + totalLibros + totalCongresos + totalProyectos + totalTesisGrado;

    console.log(`Total de publicaciones para Grupo ${grupo.idGrupoInv}: ${totalGrupo}`);

    totalData.push(totalGrupo);
    grupos.push(`Grupo ${grupo.idGrupoInv}`); 
  });

  console.log('Total Data:', totalData);
  console.log('Grupos:', grupos);
  const data = {
    labels: grupos,
    datasets: [{
      label: 'Total de Publicaciones por Grupo',
      data: totalData,
      backgroundColor: this.generateUniqueColors(grupos.length), 
    }]
  };

  console.log('Data:', data);


  this.totalPublicacionesChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  console.log('Total Publicaciones Chart:', this.totalPublicacionesChart);

}

*/

  getTotalRevistas(): number {
    return Object.values(this.revistasPorGrupo).reduce(
      (acc, curr) => acc + curr,
      0
    );
  }

  getTotalLibros(): number {
    return Object.values(this.librosPorGrupo).reduce(
      (acc, curr) => acc + curr,
      0
    );
  }

  getTotalCongresos(): number {
    return Object.values(this.congresosPorGrupo).reduce(
      (acc, curr) => acc + curr,
      0
    );
  }

  getTotalProyectos(): number {
    return Object.values(this.proyectosPorGrupo).reduce(
      (acc, curr) => acc + curr,
      0
    );
  }

  getTotalTesisGrado(): number {
    return Object.values(this.tesisGradoPorGrupo).reduce(
      (acc, curr) => acc + curr,
      0
    );
  }
}
