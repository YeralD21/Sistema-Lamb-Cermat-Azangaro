import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleSquareComponent } from '../../../shared/components/module-square/module-square.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ModuleSquareComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  modules = [
    {
        title: 'Asistencia',
        description: 'Registro diario de asistencia por sección',
        icon: 'calendar-check',
        path: '/app/attendance/teacher',
        color: 'bg-[#1e40af]' // Blue 800
    },
    {
        title: 'Evaluación',
        description: 'Registro de calificaciones y competencias',
        icon: 'graduation-cap',
        path: '/app/evaluation/teacher',
        color: 'bg-[#1e3a8a]' // Blue 900 - Cermat Primary
    },
    {
        title: 'Tareas',
        description: 'Creación y gestión de actividades',
        icon: 'book-open',
        path: '/app/tasks/teacher',
        color: 'bg-[#1e40af]' // Blue 800 - Cermat Primary
    },
    {
        title: 'Calificar',
        description: 'Revisión de entregas de tareas',
        icon: 'check-circle',
        path: '/app/tasks/grading/teacher',
        color: 'bg-[#ca8a04]' // Yellow 600
    },
    {
        title: 'Comunicados',
        description: 'Envío de comunicados a padres y alumnos',
        icon: 'message-square',
        path: '/app/communications/teacher',
        color: 'bg-[#3b82f6]' // Blue 500 - Cermat Secondary
    },
    {
        title: 'Mensajería',
        description: 'Buzón de mensajes directos',
        icon: 'mail',
        path: '/app/messages/teacher',
        color: 'bg-[#0E3A8A]' // UPeU Blue
    },
    {
        title: 'Resumen',
        description: 'Estadísticas de cursos y alumnos',
        icon: 'activity',
        path: '/app/dashboard/metrics/teacher',
        color: 'bg-[#374151]' // Slate 700
    },
    {
        title: 'Reportes',
        description: 'Reportes académicos y exportación',
        icon: 'bar-chart',
        path: '/app/reports/academic',
        color: 'bg-[#ca8a04]' // Yellow 600
    },
    {
        title: 'Mi Horario',
        description: 'Ver mi horario de clases',
        icon: 'clock',
        path: '/app/schedule/teacher',
        color: 'bg-[#7c3aed]' // Violet 600
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
