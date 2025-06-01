import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsTreeComponent } from './comments-tree.component';

describe('CommentsTreeComponent', () => {
  let component: CommentsTreeComponent;
  let fixture: ComponentFixture<CommentsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
