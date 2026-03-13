import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apoderado-schedule.component.html',
  styleUrls: ['./apoderado-schedule.component.css']
})
export class ApoderadoScheduleComponent implements OnInit, AfterViewInit {
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  blocks = [
    { time: '08:00 - 08:45', monday: 'Matemáticas', tuesday: 'Comunicación', wednesday: 'Matemáticas', thursday: 'Ciencia', friday: 'Ed. Física' },
    { time: '08:45 - 09:30', monday: 'Matemáticas', tuesday: 'Comunicación', wednesday: 'Inglés', thursday: 'Ciencia', friday: 'Ed. Física' },
    { time: '09:30 - 10:00', monday: 'RECREO', tuesday: 'RECREO', wednesday: 'RECREO', thursday: 'RECREO', friday: 'RECREO' },
    { time: '10:00 - 10:45', monday: 'Historia', tuesday: 'Arte', wednesday: 'Inglés', thursday: 'Religión', friday: 'Computación' },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  printSchedule() {
    window.print();
  }
}
