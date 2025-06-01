import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService, User } from '../../services/user/user.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass1 = group.get('password1')?.value;
  const pass2 = group.get('password2')?.value;
  return pass1 === pass2 ? null : { mismatch: true };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  user?: User;
  userId = 7;

  loading = false;
  error = '';

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group(
    {
      password1: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/), Validators.pattern(/[a-z]/), Validators.pattern(/\d/)]],
      password2: [''],
    },
    { validators: passwordMatchValidator }
  );

  roleNames: Record<number, string> = {
    0: 'Admin',
    1: 'Guest',
    2: 'Silver',
    3: 'Gold'
  }

  permissions = [1, 2, 4, 8];
  permissionLabels: Record<number, string> = {
    1: 'Read comments',
    2: 'Add/delete comments',
    4: 'Add/delete topics',
    8: "Delete others' comments/topics"
  };

  rolePermissions: Record<number, number> = {
    1: 1,           // Guest
    2: 1 | 2,       // Silver
    3: 1 | 2 | 4,   // Gold
    0: 1 | 2 | 4 | 8 // Admin
  };

  ngOnInit() {
    this.loading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user['data'];
        this.userService.setCurrentUser(user['data']);
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load user data';
        this.loading = false;
      },
    });
  }

  onProfileSubmit() {
    if (this.profileForm.invalid) return;

    const updatePayload = {
      name: this.profileForm.value.name ?? '',
      email: this.profileForm.value.email ?? '',
    };

    this.loading = true;
    this.userService.updateUser(this.userId, updatePayload).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        alert('Profile updated successfully.');
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to update profile.';
        this.loading = false;
      },
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;

    const { password1, password2 } = this.passwordForm.value;

    this.loading = true;
    this.userService.updatePassword(this.userId, password1!, password2!).subscribe({
      next: () => {
        alert('Password updated successfully.');
        this.passwordForm.reset();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to update password.';
        this.loading = false;
      },
    });
  }

  getRoleName(role: number): string {
    return this.roleNames[role];
  }

  getAllPermissions(): number[] {
    return this.permissions;
  }

  hasPermission(role: number, permission: number): boolean {
    return (this.rolePermissions[role] & permission) === permission;
  }

  getPermissionLabel(permission: number): string {
    return this.permissionLabels[permission];
  }
}
