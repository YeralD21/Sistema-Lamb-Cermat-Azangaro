import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { STUDENT_MODULES_LIST, StudentModuleEntry } from '@core/constants/student-modules';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="relative min-h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat"
      style="background-image: url('assets/images/fondo-dashboards-colegio.jpg');">

      <!-- Dark overlay for contrast -->
      <div class="absolute inset-0 bg-black/45 pointer-events-none"></div>

      <!-- MAIN MODULE GRID -->
      <div class="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Grid optimized for 4 top / 2 center-bottom layout -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <a *ngFor="let module of modules; let i = index"
               [routerLink]="module.path"
               class="group relative flex flex-col items-center justify-center p-8 h-64 w-full bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-[#1e3a8a]/90 hover:scale-[1.02] hover:border-blue-400/50 transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer animate-slide-up"
               [style.animation-delay]="(i * 0.05) + 's'"
               [class.lg:col-start-2]="i === 4"
               [class.lg:col-start-3]="i === 5"
               style="animation-fill-mode: forwards; opacity: 0;">

              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-400/20 transition-colors"></div>

              <div class="flex flex-col items-center text-center z-10 space-y-6 w-full">
                <div class="p-5 rounded-3xl border-2 border-white/10 group-hover:border-blue-400/80 bg-transparent transition-colors duration-300 text-white shadow-inner">
                  <div class="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.2]" [innerHTML]="sanitizeSvg(module.icon)"></div>
                </div>
                <div class="space-y-1 w-full">
                  <h3 class="text-base font-black text-white tracking-[0.2em] uppercase group-hover:text-blue-100 transition-colors italic">
                    {{ module.title }}
                  </h3>
                  <p class="text-[0.65rem] text-slate-300/80 uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-6 left-0 right-0 mx-auto px-4 line-clamp-1">
                    {{ module.description }}
                  </p>
                </div>
              </div>
            </a>

          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-slide-up {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  modules: StudentModuleEntry[] = STUDENT_MODULES_LIST;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

