import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-apoderado-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apoderado-messages.component.html',
  styleUrls: ['./apoderado-messages.component.css']
})
export class ApoderadoMessagesComponent implements OnInit, AfterViewInit {
  messages = [
    { sender: 'Tutor: Prof. Luis Arce', preview: 'El alumno Juan necesita refuerzo en...', time: '10:00 AM', unread: true },
    { sender: 'Dirección Académica', preview: 'Recordatorio mensualidades...', time: 'Ayer', unread: false }
  ];

  isComposeOpen = false;
  newMessage = {
    to: '',
    subject: '',
    body: ''
  };

  teachers = ['Prof. Luis Arce', 'Prof. Ana Díaz', 'Dirección Académica'];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  openCompose() {
    this.isComposeOpen = true;
    setTimeout(() => createIcons({ icons }), 50);
  }

  closeCompose() {
    this.isComposeOpen = false;
    this.newMessage = { to: '', subject: '', body: '' };
  }

  sendMessage() {
    // Simulando el envío
    setTimeout(() => {
        this.messages.unshift({
           sender: 'Yo (Apoderado)', 
           preview: this.newMessage.subject + ' - ' + this.newMessage.body, 
           time: 'Ahora', 
           unread: false
        });
        alert("Mensaje enviado correctamente.");
        this.closeCompose();
        setTimeout(() => createIcons({ icons }), 50);
    }, 500);
  }
}
