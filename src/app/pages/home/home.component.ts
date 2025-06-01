import { Component, effect, OnInit } from '@angular/core';
import { ForumService, Topic, Comment } from '../../services/forum/forum.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsTreeComponent } from '../../shared/comments-tree/comments-tree.component';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, CommentsTreeComponent, ReactiveFormsModule],
})
export class HomeComponent implements OnInit {
  topics: (Topic & { expanded: boolean })[] = [];
  topicForm!: FormGroup;
  commentForms: { [topicId: number]: FormGroup } = {};
  user!: User;

  constructor(private forumService: ForumService, private fb: FormBuilder, private userService: UserService) {
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
    this.topicForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });

    this.forumService.getTopics().subscribe((res: any) => {
      const topics = res.data as Topic[];
      this.topics = topics.map(t => ({ ...t, expanded: false }));
      this.topics.forEach(t => {
        this.commentForms[t.id] = this.fb.group({
          content: ['', Validators.required],
        });
      });
    });
  }

  trackByTopicId(index: number, topic: Topic & { expanded: boolean }) {
    return topic.id;
  }

  toggleExpand(id: number): void {
    const topic = this.topics.find(t => t.id === id);
    if (topic) {
      topic.expanded = !topic.expanded;
    }
  }

  addTopic(): void {
    if (this.topicForm.invalid) return;
    const author = this.user;
    const { title, body } = this.topicForm.value;
    this.forumService.addTopic({ author, title, body }).subscribe((newTopic) => {
      this.topics.push({ ...newTopic, expanded: true });
      this.commentForms[newTopic.id] = this.fb.group({
        content: ['', Validators.required],
      });
      this.topicForm.reset();
    });
  }

  addComment(topic: Topic, parentComment: Comment | null, content: string) {
    if (!content.trim()) return;
    this.forumService.addComment(topic.id, content, parentComment?.id ?? null).subscribe((newComment) => {
      newComment.replies = [];
      if (parentComment) {
        parentComment.replies.push(newComment);
      } else {
        topic.comments.push(newComment);
      }
    });
  }

  deleteComment(topic: Topic, comment: Comment) {
    this.forumService.deleteComment(topic.id, comment.id).subscribe(() => {
      comment.removed = true;
    });
  }

  deleteTopic(topic: Topic) {
    this.forumService.deleteTopic(topic.id).subscribe((response) => {
      console.log(response)
    });
  }
}
