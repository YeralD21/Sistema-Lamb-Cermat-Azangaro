import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './apoderado-tasks.component.html',
  styleUrls: ['./apoderado-tasks.component.css']
})
export class ApoderadoTasksComponent implements OnInit, AfterViewInit {
  tasks = [
    { title: 'Resolver ejercicios de fracciones', subject: 'Matemáticas', dueDate: 'Hoy, 23:59', status: 'Entregado' },
    { title: 'Ensayo sobre Don Quijote', subject: 'Comunicación', dueDate: 'Mañana', status: 'Pendiente' },
    { title: 'Maqueta del Sistema Solar', subject: 'Ciencia', dueDate: 'En 3 días', status: 'Pendiente' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }
}
