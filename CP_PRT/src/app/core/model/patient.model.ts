export interface Patient {
  id: number;
  cabinetId: string;
  firstName: string;
  lastName: string;
  cnp: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: boolean;
  updatedAt: boolean;
}

export interface PatientFilter {
  name?: string;
  cnp?: string;
  cabinetId?: string | null;
}
