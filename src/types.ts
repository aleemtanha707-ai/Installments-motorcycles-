import { Timestamp } from 'firebase/firestore';

export interface Bike {
  id: string;
  name: string;
  company: string;
  price: number;
  down_payment: number;
  monthly: number;
  duration: number;
  image: string;
  description?: string;
}

export interface Application {
  id: string;
  userId: string;
  bikeId: string;
  bikeName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  fullName: string;
  cnic: string;
  phone: string;
  city: string;
  income: number;
  address: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
