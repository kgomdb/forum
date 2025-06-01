import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../services/forum/forum.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments-tree',
  templateUrl: './comments-tree.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CommentsTreeComponent {
  @Input() comments: Comment[] = [];
  @Output() addComment = new EventEmitter<{ parentComment: Comment | null, body: string }>();
  @Output() deleteComment = new EventEmitter<Comment>();

  newReplies: { [id: number]: string } = {};

  handleReply(parent: Comment) {
    const body = this.newReplies[parent.id]?.trim();
    if (!body) return;
    this.addComment.emit({ parentComment: parent, body });
    this.newReplies[parent.id] = '';
  }
}
