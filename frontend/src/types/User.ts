export interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
  email_verified_at?: string | null;
  created_at?: string | null;
}
