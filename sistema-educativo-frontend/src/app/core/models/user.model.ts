export type UserRole = 'admin' | 'teacher' | 'student' | 'apoderado' | 'cashier' | 'administrative';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
