import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apoderado-finance.component.html',
  styleUrls: ['./apoderado-finance.component.css']
})
export class ApoderadoFinanceComponent implements OnInit, AfterViewInit {
  payments = [
    { id: 1, concept: 'Matrícula 2025', date: '2025-01-15', amount: 'S/ 250.00', status: 'Pagado' },
    { id: 2, concept: 'Mensualidad - Marzo', date: '2025-03-05', amount: 'S/ 180.00', status: 'Pagado' },
    { id: 3, concept: 'Mensualidad - Abril', date: '2025-04-05', amount: 'S/ 180.00', status: 'Pendiente' },
    { id: 4, concept: 'Mensualidad - Mayo', date: '2025-05-05', amount: 'S/ 180.00', status: 'Pendiente' }
  ];

  isPaymentModalOpen = false;
  selectedPaymentId: number | null = null;
  paymentMethod = 'tarjeta';
  isProcessing = false;

  get pendingPayments() {
    return this.payments.filter(p => p.status === 'Pendiente');
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;
    this.selectedPaymentId = this.pendingPayments.length > 0 ? this.pendingPayments[0].id : null;
    setTimeout(() => createIcons({ icons }), 50);
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
    this.isProcessing = false;
  }

  processPayment() {
    if (!this.selectedPaymentId) return;
    this.isProcessing = true;
    setTimeout(() => {
        const payment = this.payments.find(p => p.id === Number(this.selectedPaymentId));
        if (payment) {
          payment.status = 'Pagado';
        }
        this.closePaymentModal();
        alert('Pago procesado correctamente, ¡gracias!');
        setTimeout(() => createIcons({ icons }), 50);
    }, 2000);
  }
}
