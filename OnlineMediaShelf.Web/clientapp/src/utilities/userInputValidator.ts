export class UserInputValidator {
  public static validateEmail(email: string): string | undefined {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email))
      return "Invalid email address";
  }

  public static validatePassword(password: string): string | undefined {
    let errorMessage: string = "";

    if (password.length < 8)
      errorMessage += "Password must be at least 8 characters long.\n";

    if (password.search(/\p{Ll}/u) < 0)
      errorMessage += "Password must contain at least one lowercase letter.\n";

    if (password.search(/\p{Lu}/u) < 0)
      errorMessage += "Password must contain at least one uppercase letter.\n";

    if (password.search(/\d/) < 0)
      errorMessage += "Password must contain at least one number.\n";

    if (password.search(/[^\p{Lu}\p{Ll}\d]/u) < 0)
      errorMessage += "Password must contain at least one special character.\n";

    return errorMessage === "" ? undefined : errorMessage;
  }

  public static validateUserName(userName: string): string | undefined {
    if (!/^[a-zA-Z0-9._\-]+$/.test(userName))
      return "Username can only contain letters, numbers, dashes, points and underscores. " + userName;
  }
}