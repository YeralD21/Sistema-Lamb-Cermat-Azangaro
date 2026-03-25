import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeeConcept {
  id: string;
  name: string;
  type: 'matricula' | 'pension' | 'interes' | 'certificado' | 'taller' | 'servicio' | 'otro';
  base_amount: number;
  periodicity: 'unico' | 'mensual' | 'anual' | 'opcional';
  is_active: boolean;
  description?: string;
  created_at?: string;
}

export interface FinancialPlan {
  id: string;
  name: string;
  academic_year_id: string;
  concept_id: string;
  total_amount: number;
  installments_count: number;
  is_active: boolean;
  academic_year?: any;
  concept?: FeeConcept;
  installments?: any[];
}

export interface Discount {
  id: string;
  name: string;
  type: 'porcentaje' | 'monto_fijo';
  value: number;
  scope: 'todos' | 'pension' | 'matricula' | 'especifico';
  specific_concept_id?: string;
  is_active: boolean;
  description?: string;
  concept?: FeeConcept;
}
export interface CashClosure {
  id: string;
  closure_date: string;
  opening_time: string;
  closing_time?: string;
  opening_balance: number;
  cash_received: number;
  expected_balance: number;
  actual_balance: number;
  difference: number;
  notes?: string;
  closed_by: string;
  cashier_id?: string;
  total_cash: number;
  total_cards: number;
  total_transfers: number;
  total_yape: number;
  total_plin: number;
  total_amount: number;
  payments_count: number;
  created_at?: string;
  cashier?: any;
  closed_by_user?: any;
}

export interface Payment {
  id: string;
  charge_id: string;
  student_id: string;
  amount: number;
  method: string;
  reference?: string;
  paid_at: string;
  notes?: string;
  student?: any;
  charge?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // --- Fee Concepts ---
  getConcepts(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/fee-concepts`, { params });
  }

  createConcept(concept: Partial<FeeConcept>): Observable<FeeConcept> {
    return this.http.post<FeeConcept>(`${this.apiUrl}/fee-concepts`, concept);
  }

  updateConcept(id: string, concept: Partial<FeeConcept>): Observable<FeeConcept> {
    return this.http.put<FeeConcept>(`${this.apiUrl}/fee-concepts/${id}`, concept);
  }

  deleteConcept(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fee-concepts/${id}`);
  }

  // --- Financial Plans ---
  getPlans(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/financial-plans`, { params });
  }

  createPlan(plan: Partial<FinancialPlan>): Observable<FinancialPlan> {
    return this.http.post<FinancialPlan>(`${this.apiUrl}/financial-plans`, plan);
  }

  updatePlan(id: string, plan: Partial<FinancialPlan>): Observable<FinancialPlan> {
    return this.http.put<FinancialPlan>(`${this.apiUrl}/financial-plans/${id}`, plan);
  }

  deletePlan(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/financial-plans/${id}`);
  }

  // --- Plan Installments ---
  getInstallments(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/plan-installments`, { params });
  }

  createInstallment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/plan-installments`, data);
  }

  updateInstallment(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/plan-installments/${id}`, data);
  }

  deleteInstallment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/plan-installments/${id}`);
  }

  // --- Discounts ---
  getDiscounts(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/discounts`, { params });
  }

  createDiscount(discount: Partial<Discount>): Observable<Discount> {
    return this.http.post<Discount>(`${this.apiUrl}/discounts`, discount);
  }

  updateDiscount(id: string, discount: Partial<Discount>): Observable<Discount> {
    return this.http.put<Discount>(`${this.apiUrl}/discounts/${id}`, discount);
  }

  deleteDiscount(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/discounts/${id}`);
  }

  // --- Charges ---
  getCharges(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/charges`, { params });
  }

  emitBatchCharges(data: { academic_year_id: string, financial_plan_id: string, grade_level_id?: string, section_id?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/charges/batch`, data);
  }

  // --- Payments ---
  getPayments(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/payments`, { params });
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments`, payment);
  }

  // --- Cash Closures ---
  getClosures(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(`${this.apiUrl}/cash-closures`, { params });
  }

  getClosure(id: string): Observable<CashClosure> {
    return this.http.get<CashClosure>(`${this.apiUrl}/cash-closures/${id}`);
  }

  createClosure(data: any): Observable<CashClosure> {
    return this.http.post<CashClosure>(`${this.apiUrl}/cash-closures`, data);
  }

  updateClosure(id: string, data: any): Observable<CashClosure> {
    return this.http.put<CashClosure>(`${this.apiUrl}/cash-closures/${id}`, data);
  }

  deleteClosure(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cash-closures/${id}`);
  }

  // --- Students Search (Helpers for Finance) ---
  searchStudents(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/students`, { params: new HttpParams().set('q', query) });
  }
}
