import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-communications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './apoderado-communications.component.html',
  styleUrls: ['./apoderado-communications.component.css']
})
export class ApoderadoCommunicationsComponent implements OnInit, AfterViewInit {
  communications = [
    { title: 'Reunión de Padres', sender: 'Dirección General', date: 'Hace 2 horas', status: 'Nuevo' },
    { title: 'Material para el proyecto', sender: 'Prof. Ana Díaz', date: 'Ayer', status: 'Leído' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }
}
