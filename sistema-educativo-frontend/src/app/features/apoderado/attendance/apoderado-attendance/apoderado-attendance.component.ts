import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apoderado-attendance.component.html',
  styleUrls: ['./apoderado-attendance.component.css']
})
export class ApoderadoAttendanceComponent implements OnInit, AfterViewInit {
  absences = [
    { date: '2025-10-15', subject: 'Matemáticas', reason: 'Enfermedad', status: 'Justificada' },
    { date: '2025-10-18', subject: 'Comunicación', reason: 'Pendiente', status: 'Injustificada' }
  ];

  isModalOpen = false;
  justification = {
    date: '',
    reason: '',
    file: null
  };

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
    this.justification = { date: '', reason: '', file: null };
  }

  submitJustification() {
    // Simulando el envío exitoso
    const newAbsence = {
      date: this.justification.date || '2025-10-20',
      subject: 'Todo el día',
      reason: this.justification.reason || 'Ausencia',
      status: 'Justificada'
    };
    this.absences.unshift(newAbsence);
    this.closeModal();
    setTimeout(() => createIcons({ icons }), 50);
  }
}
