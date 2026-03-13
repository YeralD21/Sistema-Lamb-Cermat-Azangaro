import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.css']
})
export class TeacherScheduleComponent implements OnInit, AfterViewInit {
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  blocks = [
    { time: '08:00 - 08:45', monday: 'Matemáticas (1ro A)', tuesday: 'Comunicación (2do B)', wednesday: 'Tutoría', thursday: '', friday: 'Matemáticas (1ro A)' },
    { time: '08:45 - 09:30', monday: 'Matemáticas (1ro A)', tuesday: 'Comunicación (2do B)', wednesday: 'Tutoría', thursday: '', friday: 'Matemáticas (1ro A)' },
    { time: '09:30 - 10:00', monday: 'RECREO', tuesday: 'RECREO', wednesday: 'RECREO', thursday: 'RECREO', friday: 'RECREO' },
    { time: '10:00 - 10:45', monday: '', tuesday: 'Matemáticas (3ro C)', wednesday: '', thursday: 'Matemáticas (1ro A)', friday: '' },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  printSchedule() {
    window.print();
  }
}
