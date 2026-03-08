export type UserRole = 'admin' | 'teacher' | 'student' | 'guardian' | 'cashier' | 'administrative';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
