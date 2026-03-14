import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

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
          <p class="text-slate-500 text-sm mt-1 font-medium">Comunicación directa con apoderados y docentes</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-blue-100">
            {{ totalUnread }} Mensajes sin leer
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
        
        <!-- Conversation List -->
        <div class="lg:col-span-4 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div class="p-6 border-b border-slate-50 bg-slate-50/10 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-700 uppercase tracking-widest">Conversaciones</h2>
            <button class="p-2 text-slate-400 hover:text-blue-900 transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <div *ngFor="let chat of conversations" 
                 (click)="selectConversation(chat)"
                 [class]="'p-4 rounded-2xl cursor-pointer transition-all group scale-100 active:scale-[0.98] ' + 
                          (selectedChat?.id === chat.id ? 'bg-blue-900 text-white shadow-lg selected-chat' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100')">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ' + 
                               (selectedChat?.id === chat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-900 group-hover:bg-blue-50')">
                    {{ chat.avatar }}
                  </div>
                  <div *ngIf="chat.online" class="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="font-bold text-sm truncate uppercase tracking-tight">{{ chat.name }}</h3>
                    <span [class]="'text-[10px] font-semibold whitespace-nowrap ' + 
                                  (selectedChat?.id === chat.id ? 'text-blue-100' : 'text-slate-400')">{{ chat.time }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-2 mt-1">
                    <p [class]="'text-xs truncate font-medium ' + 
                               (selectedChat?.id === chat.id ? 'text-blue-100/80' : 'text-slate-500')">
                      {{ chat.lastMessage }}
                    </p>
                    <div *ngIf="chat.unread > 0" class="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-lg flex items-center justify-center shadow-sm">
                      {{ chat.unread }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
          <div *ngIf="selectedChat; else noChat" class="contents">
            
            <!-- Chat Header -->
            <div class="p-6 border-b border-slate-50 bg-slate-50/10 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900 font-bold">
                  {{ selectedChat.avatar }}
                </div>
                <div>
                  <h3 class="text-base font-bold text-slate-900 tracking-tight uppercase">{{ selectedChat.name }}</h3>
                  <p class="text-[10px] font-semibold text-green-500 uppercase tracking-widest flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    En línea ahora
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-2.5 text-slate-400 hover:text-blue-900 hover:bg-slate-50 rounded-xl transition-all"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
                <button class="p-2.5 text-slate-400 hover:text-blue-900 hover:bg-slate-50 rounded-xl transition-all"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 10 5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg></button>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/5">
              <div *ngFor="let msg of selectedChat.messages; let i = index" 
                   [class]="'flex ' + (msg.sent ? 'justify-end' : 'justify-start')">
                <div [class]="'max-w-[80%] rounded-2xl p-4 shadow-sm relative group '"
                     [ngClass]="msg.sent ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'">
                  <p class="text-sm font-medium leading-relaxed">{{ msg.content }}</p>
                  <div [class]="'flex items-center gap-1 mt-2 ' + (msg.sent ? 'justify-end text-blue-100' : 'text-slate-400')">
                    <span class="text-[9px] font-bold uppercase tracking-widest">{{ msg.time }}</span>
                    <svg *ngIf="msg.sent" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input Area -->
            <div class="p-6 border-t border-slate-50 bg-white">
              <div class="flex items-end gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200/60 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                <button class="p-3 text-slate-400 hover:text-blue-900 transition-all"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                <textarea 
                  [(ngModel)]="newMessage"
                  placeholder="Escribe un mensaje..."
                  rows="1"
                  class="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium py-3 px-2 resize-none custom-scrollbar"
                  (keydown.enter)="$event.preventDefault(); sendMessage()"
                ></textarea>
                <button 
                  (click)="sendMessage()"
                  class="p-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100"
                  [disabled]="!newMessage.trim()">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
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
                  Selecciona una conversación para ver los mensajes y responder a los apoderados.
                </p>
              </div>
              <button class="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
                Nueva Conversación
              </button>
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
export class MessagingInboxComponent {
  totalUnread = 2;
  newMessage = '';
  selectedChat: any = null;

  conversations = [
    {
      id: 1,
      name: 'María García',
      avatar: 'MG',
      online: true,
      lastMessage: 'Hola profesor, quería consultar sobre la tarea de matemáticas.',
      time: '10:30 AM',
      unread: 2,
      messages: [
        { content: 'Buen día profesor, ¿podría confirmarme la fecha del examen?', time: '09:15 AM', sent: false },
        { content: 'Hola María, el examen será el próximo viernes 20.', time: '09:20 AM', sent: true },
        { content: 'Hola profesor, quería consultar sobre la tarea de matemáticas pág 45.', time: '10:30 AM', sent: false },
      ]
    },
    {
      id: 2,
      name: 'José Rodríguez',
      avatar: 'JR',
      online: false,
      lastMessage: 'Muchas gracias por la información.',
      time: 'Ayer',
      unread: 0,
      messages: [
        { content: 'Muchas gracias por la información.', time: 'Ayer', sent: false },
      ]
    },
    {
      id: 3,
      name: 'Ana López',
      avatar: 'AL',
      online: true,
      lastMessage: '¿El material ya está disponible en el portal?',
      time: '08:45 AM',
      unread: 0,
      messages: [
        { content: '¿El material ya está disponible en el portal?', time: '08:45 AM', sent: false },
      ]
    }
  ];

  constructor() {
    this.selectedChat = this.conversations[0];
  }

  selectConversation(chat: any) {
    this.selectedChat = chat;
    chat.unread = 0;
    this.totalUnread = this.conversations.reduce((acc, c) => acc + c.unread, 0);
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedChat) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    this.selectedChat.messages.push({
      content: this.newMessage.trim(),
      time: time,
      sent: true
    });
    
    this.selectedChat.lastMessage = this.newMessage.trim();
    this.selectedChat.time = time;
    this.newMessage = '';
    
    // Auto-scroll logic would go here in a real app
  }
}
