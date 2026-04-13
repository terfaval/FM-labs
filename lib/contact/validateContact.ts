export type ContactValidationInput = {
  message: string;
  email?: string;
};

export type ContactValidationResult = {
  valid: boolean;
  errors: { message?: string; email?: string };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(
  input: ContactValidationInput
): ContactValidationResult {
  const errors: ContactValidationResult["errors"] = {};

  if (!input.message || input.message.trim().length === 0) {
    errors.message = "Az üzenet megadása kötelező.";
  }

  if (input.email && !EMAIL_REGEX.test(input.email.trim())) {
    errors.email = "Kérlek, érvényes email címet adj meg.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
