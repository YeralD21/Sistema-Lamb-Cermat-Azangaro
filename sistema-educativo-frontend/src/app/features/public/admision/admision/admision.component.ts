import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SeoService } from '@core/services/seo/seo.service';
import { DataService } from '@core/services/data_general/data.service';
@Component({
  selector: 'app-admision',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admision.component.html',
  styleUrl: './admision.component.css'
})
export class AdmisionComponent implements OnInit {

  private readonly seoService = inject(SeoService);
  private readonly dataService = inject(DataService);
  private readonly fb = inject(FormBuilder);

  readonly openFaqIndex = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);

  admissionForm: FormGroup;

  readonly admissionSteps = [
    { step: 1, title: 'Solicitud de información', description: 'Contacta con nosotros vía WhatsApp, formulario web o visítanos personalmente' },
    { step: 2, title: 'Entrevista personal', description: 'Conoce nuestras instalaciones, enfoque pedagógico y resuelve tus dudas' },
    { step: 3, title: 'Evaluación del estudiante', description: 'Diagnóstico académico y socioemocional según el nivel' },
    { step: 4, title: 'Matrícula', description: 'Formaliza la inscripción y bienvenida a la familia CERMAT' }
  ];

  readonly faqs = [
    {
      question: '¿Cuál es el proceso de admisión?',
      answer: 'El proceso consta de 4 pasos: solicitud de información, entrevista personal, evaluación del estudiante y matrícula. Todo el proceso toma aproximadamente 2 semanas.'
    },
    {
      question: '¿Qué documentos necesito?',
      answer: 'Necesitas: partida de nacimiento del estudiante, DNI del estudiante y padres, boletas de notas del colegio anterior (si aplica), y fotos tamaño carnet.'
    },
    {
      question: '¿Hay becas o descuentos disponibles?',
      answer: 'Sí, ofrecemos descuentos por hermanos y becas por excelencia académica. También contamos con facilidades de pago.'
    },
    {
      question: '¿Puedo visitar el colegio antes de inscribir a mi hijo?',
      answer: 'Por supuesto, puedes agendar una visita guiada llamando al teléfono o escribiendo por WhatsApp. Te mostraremos todas nuestras instalaciones.'
    },
    {
      question: '¿Hasta cuándo están abiertas las inscripciones?',
      answer: 'Las inscripciones están abiertas todo el año, pero te recomendamos inscribirte antes de febrero para asegurar tu vacante.'
    }
  ];

  constructor() {
    this.admissionForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      nombreEstudiante: ['', Validators.required],
      edadEstudiante: ['', [Validators.required, Validators.min(3), Validators.max(18)]],
      nivel: ['', Validators.required],
      mensaje: ['']
    });
  }

  ngOnInit(): void {
    this.seoService.updateTitle('Proceso de Admisión 2026 - CERMAT SCHOOL');
    this.seoService.updateMetaTags({
      description: 'Conoce nuestro proceso de admisión, requisitos, fechas y costos. Inscribe a tu hijo en el mejor colegio de Azángaro.',
      keywords: 'admisión colegio Azángaro, matrícula 2026, inscripciones abiertas'
    });
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === index ? null : index);
  }

  onSubmit(): void {
    if (this.admissionForm.valid) {
      this.isSubmitting.set(true);
      
      this.dataService.submitAdmissionForm(this.admissionForm.value).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.submitSuccess.set(true);
          this.admissionForm.reset();
          
          setTimeout(() => {
            this.submitSuccess.set(false);
          }, 5000);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }

}

