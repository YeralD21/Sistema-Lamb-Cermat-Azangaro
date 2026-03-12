import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ADMIN_MODULES_LIST, AdminModuleEntry, SubModuleSection } from '../../../core/constants/admin-modules';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  modules: AdminModuleEntry[] = ADMIN_MODULES_LIST;
  activeModule: AdminModuleEntry | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  openModule(module: AdminModuleEntry, event: Event): void {
    if (module.submodules && module.submodules.length > 0) {
      event.preventDefault();
      this.activeModule = module;
    }
  }

  backToMain(): void {
    this.activeModule = null;
  }
}
