import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ADMIN_MODULES_LIST } from '../../../core/constants/admin-modules';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  // Use the constant list
  modules = ADMIN_MODULES_LIST;

  constructor(private sanitizer: DomSanitizer) {}

  // Function to safely inject the SVG string
  sanitizeSvg(svgString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgString);
  }
}
