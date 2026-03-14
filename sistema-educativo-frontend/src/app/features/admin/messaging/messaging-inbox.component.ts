import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { MessagingService, Message } from '@core/services/messaging.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-messaging-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Bandeja de Entrada</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Comunicación directa por estudiante</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
        
        <!-- Conversation List (Students) -->
        <div class="lg:col-span-4 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-50 bg-slate-50/10 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-700 uppercase tracking-widest">Estudiantes (Contactos)</h2>
            <button class="p-2 text-slate-400 hover:text-blue-900 transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
          
          <div *ngIf="loadingStudents" class="p-8 text-center text-slate-400 text-sm font-medium">
            Cargando estudiantes...
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <div *ngFor="let student of students" 
                 (click)="selectStudent(student)"
                 [class]="'p-4 rounded-2xl cursor-pointer transition-all group scale-100 active:scale-[0.98] ' + 
                          (selectedStudent?.id === student.id ? 'bg-blue-900 text-white shadow-lg selected-chat' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100')">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ' + 
                               (selectedStudent?.id === student.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-900 group-hover:bg-blue-50')">
                    {{ getInitials(student.profile?.first_name, student.profile?.last_name) }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="font-bold text-sm truncate uppercase tracking-tight">{{ student.profile?.first_name }} {{ student.profile?.last_name }}</h3>
                  </div>
                  <div class="flex items-center justify-between gap-2 mt-1">
                    <p [class]="'text-xs truncate font-medium ' + 
                               (selectedStudent?.id === student.id ? 'text-blue-100/80' : 'text-slate-500')">
                      Ver historial de chat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
          <div *ngIf="selectedStudent; else noChat" class="contents">
            
            <!-- Chat Header -->
            <div class="p-6 border-b border-slate-50 bg-slate-50/10 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900 font-bold">
                   {{ getInitials(selectedStudent.profile?.first_name, selectedStudent.profile?.last_name) }}
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900 tracking-tight uppercase">{{ selectedStudent.profile?.first_name }} {{ selectedStudent.profile?.last_name }}</h3>
                  <p class="text-[10px] font-semibold text-green-500 uppercase tracking-widest flex items-center gap-1">
                    Historial de mensajes
                  </p>
                </div>
              </div>
            </div>

            <!-- Messages Area -->
            <div *ngIf="loadingMessages" class="p-8 text-center text-slate-400 text-sm font-medium">
              Cargando mensajes...
            </div>
            
            <div *ngIf="!loadingMessages && messages.length === 0" class="flex-1 flex flex-col items-center justify-center space-y-2">
               <svg class="w-12 h-12 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               <p class="text-sm text-slate-400 font-medium">No hay mensajes aún.</p>
            </div>

            <div class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/5">
              <div *ngFor="let msg of messages" 
                   [class]="'flex ' + (msg.sender_id === simulatedSenderId ? 'justify-end' : 'justify-start')">
                <div [class]="'max-w-[80%] rounded-2xl p-4 shadow-sm relative group '"
                     [ngClass]="msg.sender_id === simulatedSenderId ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'">
                  <p class="text-sm font-medium leading-relaxed">{{ msg.content }}</p>
                  <div [class]="'flex items-center gap-1 mt-2 ' + (msg.sender_id === simulatedSenderId ? 'justify-end text-blue-100' : 'text-slate-400')">
                    <span class="text-[9px] font-bold uppercase tracking-widest">{{ msg.created_at | date:'shortTime' }}</span>
                    <svg *ngIf="msg.sender_id === simulatedSenderId" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="p-6 border-t border-slate-50 bg-white">
              <div class="flex items-end gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200/60 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                <textarea 
                  [(ngModel)]="newMessage"
                  [disabled]="sendingMessage"
                  placeholder="Escribe un mensaje..."
                  rows="1"
                  class="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium py-3 px-3 resize-none custom-scrollbar"
                  (keydown.enter)="$event.preventDefault(); sendMessage()"
                ></textarea>
                <button 
                  (click)="sendMessage()"
                  class="p-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100"
                  [disabled]="!newMessage.trim() || sendingMessage">
                  <svg *ngIf="!sendingMessage" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  <span *ngIf="sendingMessage" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                </button>
              </div>
            </div>

          </div>
          
          <ng-template #noChat>
            <div class="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 animate-fade-in">
              <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 tracking-tight">Tu centro de mensajes</h3>
                <p class="text-slate-500 text-sm mt-2 max-w-xs mx-auto font-medium leading-relaxed">
                  Selecciona un estudiante para ver el historial de comunicación.
                </p>
              </div>
            </div>
          </ng-template>

        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
    
    .selected-chat {
      transform: scale(1.02);
    }
  `]
})
export class MessagingInboxComponent implements OnInit {
  newMessage = '';
  selectedStudent: any = null;
  
  students: any[] = [];
  messages: Message[] = [];
  
  loadingStudents = false;
  loadingMessages = false;
  sendingMessage = false;
  
  // To simulate sending messages since the API requires a sender_id and sender_role
  simulatedSenderId = '';

  constructor(
    private messagingService: MessagingService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.fetchSimulatorSenderId();
  }
  
  // Fetches any valid profile ID to use as a generic "Teacher/Admin" sender
  fetchSimulatorSenderId() {
    this.http.get<any>(`${environment.apiUrl}/profiles`).subscribe(res => {
      const profiles = res.data || res;
      if (profiles && profiles.length > 0) {
        this.simulatedSenderId = profiles[0].id;
      }
    });
  }

  loadStudents() {
    this.loadingStudents = true;
    this.http.get<any>(`${environment.apiUrl}/students`).subscribe({
      next: (res) => {
        this.students = res.data || res;
        this.loadingStudents = false;
      },
      error: () => this.loadingStudents = false
    });
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
    this.loadMessages();
  }

  loadMessages() {
    if (!this.selectedStudent) return;
    this.loadingMessages = true;
    this.messagingService.getMessages({ student_id: this.selectedStudent.id }).subscribe({
      next: (res) => {
        // Reverse so deepest is bottom
        const fetchedMessages = res.data || res;
        this.messages = fetchedMessages.reverse();
        this.loadingMessages = false;
      },
      error: () => this.loadingMessages = false
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedStudent || !this.simulatedSenderId) return;
    
    this.sendingMessage = true;
    
    const payload = {
      student_id: this.selectedStudent.id,
      sender_role: 'teacher' as 'teacher', // Valid backend enum
      sender_id: this.simulatedSenderId,
      content: this.newMessage.trim()
    };
    
    this.messagingService.sendMessage(payload).subscribe({
      next: (res) => {
        // Append newly created message to UI immediately
        const createdMsg = res.message || res;
        this.messages.push(createdMsg);
        
        this.newMessage = '';
        this.sendingMessage = false;
        
        // Auto-scroll logic would go here in a real app
      },
      error: () => this.sendingMessage = false
    });
  }

  getInitials(first = '', last = ''): string {
    return (first.charAt(0) + last.charAt(0)).toUpperCase() || 'ST';
  }
}

