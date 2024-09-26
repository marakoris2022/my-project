import { SignUpDataProps } from "@/app/_interface/interface";

export function validateSignUpData(data: SignUpDataProps) {
  const errors: string[] = [];

  // Name validation: minimum 4 letters, only letters
  if (!/^[A-Za-z]{4,}$/.test(data.name)) {
    errors.push("Name must contain at least 4 letters and only letters.");
  }

  // Email validation: standard email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format.");
  }

  // Password validation: minimum 6 symbols
  if (data.password.length < 6) {
    errors.push("Password must contain at least 6 characters.");
  }

  // Confirm Password validation: must match the password
  if (data.confirmPassword !== data.password) {
    errors.push("Confirm password must match the password.");
  }

  // Return errors if any exist, otherwise return success
  return errors;
}
