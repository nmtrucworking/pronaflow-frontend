export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
} as const;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePasswordByPolicy = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters.`);
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter.');
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter.');
  }

  if (PASSWORD_POLICY.requireNumber && !/\d/.test(password)) {
    errors.push('Password must include at least one number.');
  }

  if (PASSWORD_POLICY.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must include at least one special character.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
