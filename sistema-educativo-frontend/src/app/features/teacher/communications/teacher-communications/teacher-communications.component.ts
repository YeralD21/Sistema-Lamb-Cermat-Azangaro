import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-communications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-communications.component.html',
  styleUrls: ['./teacher-communications.component.css']
})
export class TeacherCommunicationsComponent implements OnInit, AfterViewInit {
  communications = [
    { title: 'Reunión de Apoderados', date: '2025-05-10', audience: 'Padres de 1ro A', status: 'Enviado', type: 'reunion' },
    { title: 'Material para el proyecto', date: '2025-05-12', audience: 'Estudiantes 2do B', status: 'Borrador', type: 'aviso' }
  ];

  isModalOpen = false;
  newComm = {
    title: '',
    audience: '',
    content: ''
  };

  audiences = ['Padres de 1ro A', 'Estudiantes 2do B', 'Todos los grados'];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  openModal() {
    this.isModalOpen = true;
    setTimeout(() => createIcons({ icons }), 50);
  }

  closeModal() {
    this.isModalOpen = false;
    this.newComm = { title: '', audience: '', content: '' };
  }

  submitComm() {
    this.communications.unshift({
      title: this.newComm.title,
      date: 'Ahora',
      audience: this.newComm.audience,
      status: 'Enviado',
      type: 'aviso' // Mock default
    });
    alert('Comunicado publicado exitosamente.');
    this.closeModal();
    setTimeout(() => createIcons({ icons }), 50);
  }
}
