import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: number;
}

export interface Comment {
  id: number;
  body: string;
  author: User;
  parentId: number | null;
  comments: Comment[];
  removed: boolean;
}

export interface Topic {
  id: number;
  title: string;
  body: string;
  author: User;
  comments: Comment[];
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private baseUrl = 'http://localhost:8888/api';

  constructor(private http: HttpClient) {}

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.baseUrl}/topics`);
  }

  addTopic(topic: { author: User, title: string; body: string }): Observable<Topic> {
    return this.http.post<Topic>(`${this.baseUrl}/topic/add`, topic);
  }

  deleteTopic(topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/topic/${topicId}`);
  }

  addComment(topicId: number, body: string, parentId: number | null, author: User): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/topic/${topicId}/comment/add`, { body, parentId, author });
  }

  deleteComment(topicId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/topic/${topicId}/comment/${commentId}`);
  }
}
