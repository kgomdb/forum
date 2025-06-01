import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  role: number;
  commentsCount: number;
  topicsCount: number;
}

export interface UserResponse {
  data: User;
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8888/api/user';
  private readonly currentUserSignal = signal<User | null>(null);

  setCurrentUser(user: User) {
    this.currentUserSignal.set(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  readonly currentUser = this.currentUserSignal;

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<any> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  updatePassword(id: number, password1: string, password2: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/password`, { password1, password2 });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
