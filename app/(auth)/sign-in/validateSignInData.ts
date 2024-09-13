import { SignInDataProps } from "@/app/_interface/interface";

export function validateSignInData(data: SignInDataProps) {
  const errors: string[] = [];

  // Email validation: standard email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format.");
  }

  // Password validation: minimum 6 symbols
  if (data.password.length < 6) {
    errors.push("Password must contain at least 6 characters.");
  }

  // Return errors if any exist, otherwise return success
  return errors;
}
