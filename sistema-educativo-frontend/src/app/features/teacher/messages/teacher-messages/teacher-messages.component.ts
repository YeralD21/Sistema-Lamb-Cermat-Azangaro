import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-messages.component.html',
  styleUrls: ['./teacher-messages.component.css']
})
export class TeacherMessagesComponent implements OnInit, AfterViewInit {
  messages = [
    { sender: 'Apoderado: María Gómez', preview: 'Consulta sobre el avance de mi hija...', time: '10:00 AM', unread: true },
    { sender: 'Dirección Académica', preview: 'Invitación a claustro de profesores...', time: 'Ayer', unread: false }
  ];

  isComposeOpen = false;
  newMessage = {
    to: '',
    subject: '',
    body: ''
  };

  parentsAndStaff = ['María Gómez', 'Juan Pérez', 'Dirección Académica'];

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
           sender: 'Yo (Docente)', 
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
