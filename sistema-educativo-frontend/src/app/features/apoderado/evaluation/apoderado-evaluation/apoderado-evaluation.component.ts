import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apoderado-evaluation.component.html',
  styleUrls: ['./apoderado-evaluation.component.css']
})
export class ApoderadoEvaluationComponent implements OnInit, AfterViewInit {
  evaluations = [
    { period: '1er Bimestre', subject: 'Matemáticas', competence: 'Resuelve problemas de cantidad', grade: 'AD' },
    { period: '1er Bimestre', subject: 'Comunicación', competence: 'Lee diversos tipos de textos', grade: 'A' },
    { period: '1er Bimestre', subject: 'Matemáticas', competence: 'Resuelve problemas de regularidad', grade: 'B' }
  ];

  isDownloading = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  downloadBoletin() {
    this.isDownloading = true;
    setTimeout(() => createIcons({ icons }), 50); // reset icons
    
    setTimeout(() => {
      this.isDownloading = false;
      alert("¡Boletín PDF descargado exitosamente!");
      setTimeout(() => createIcons({ icons }), 50);
    }, 1500);
  }
}
