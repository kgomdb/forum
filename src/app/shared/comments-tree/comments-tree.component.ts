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
  @Output() addComment = new EventEmitter<{ parentComment: Comment | null, content: string }>();
  @Output() deleteComment = new EventEmitter<Comment>();

  newReplies: { [id: number]: string } = {};

  handleReply(parent: Comment) {
    const content = this.newReplies[parent.id]?.trim();
    if (!content) return;
    this.addComment.emit({ parentComment: parent, content });
    this.newReplies[parent.id] = '';
  }
}
