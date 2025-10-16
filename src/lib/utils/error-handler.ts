/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-extraneous-class */

import type { ApiErrorResponse, ValidationErrorResponse } from "../../types";

/**
 * Custom error classes for better error handling
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends ApiError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

/**
 * Error handler utility functions
 */
export class ErrorHandler {
  /**
   * Create standardized API error response
   */
  static createErrorResponse(error: Error): Response {
    let status = 500;
    let errorResponse: ApiErrorResponse | ValidationErrorResponse;

    if (error instanceof ApiError) {
      status = error.status;
      errorResponse = {
        error: error.code,
        message: error.message,
        status: error.status,
      };

      // Add validation errors if it's a ValidationError
      if (error instanceof ValidationError) {
        (errorResponse as ValidationErrorResponse).errors = error.errors;
      }
    } else {
      // Log unexpected errors
      console.error("Unexpected error:", error);

      errorResponse = {
        error: "INTERNAL_ERROR",
        message: "Wystąpił nieoczekiwany błąd serwera",
        status: 500,
      };
    }

    return new Response(JSON.stringify(errorResponse), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * Handle Supabase errors and convert to appropriate API errors
   */
  static handleSupabaseError(error: { code: string; message: string }, context: string): ApiError {
    console.error(`Supabase error in ${context}:`, error);

    // Handle specific Supabase error codes
    switch (error.code) {
      case "PGRST116":
        return new NotFoundError("Resource not found");

      case "23505": // Unique constraint violation
        return new ConflictError("Resource already exists");

      case "23503": // Foreign key constraint violation
        return new ValidationError("Invalid reference", {
          reference: ["Referenced resource does not exist"],
        });

      case "23502": // Not null constraint violation
        return new ValidationError("Required field missing", {
          field: ["This field is required"],
        });

      case "42501": // Insufficient privilege
        return new AuthorizationError("Insufficient permissions");

      default:
        return new ApiError(`Database error: ${error.message}`, 500, "DATABASE_ERROR");
    }
  }

  /**
   * Handle Supabase Auth errors and convert to appropriate API errors
   */
  static handleSupabaseAuthError(error: { message: string }, context: string): ApiError {
    console.error(`Supabase Auth error in ${context}:`, error);

    // Handle specific Supabase Auth error messages
    if (error.message) {
      if (error.message.includes("Invalid login credentials")) {
        return new AuthenticationError("Nieprawidłowy email lub hasło");
      } else if (error.message.includes("Email not confirmed")) {
        return new AuthenticationError("Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową.");
      } else if (error.message.includes("User already registered")) {
        return new ConflictError("Użytkownik z tym adresem email już istnieje");
      } else if (error.message.includes("Password should be at least")) {
        return new ValidationError("Hasło musi mieć co najmniej 8 znaków", {
          password: ["Hasło musi mieć co najmniej 8 znaków"],
        });
      } else if (error.message.includes("Invalid email")) {
        return new ValidationError("Niepoprawny format emaila", {
          email: ["Niepoprawny format emaila"],
        });
      } else if (error.message.includes("Signup is disabled")) {
        return new ApiError("Rejestracja jest obecnie wyłączona", 503, "SERVICE_UNAVAILABLE");
      } else if (error.message.includes("Too many requests")) {
        return new RateLimitError("Zbyt wiele prób. Spróbuj ponownie za chwilę.");
      } else if (error.message.includes("User not found")) {
        // Dla bezpieczeństwa nie ujawniamy czy email istnieje
        return new AuthenticationError("Jeśli podany email istnieje w systemie, otrzymasz link do resetowania hasła");
      }
    }

    // Default auth error
    return new AuthenticationError("Wystąpił błąd autentykacji. Spróbuj ponownie.");
  }

  /**
   * Log error with context information
   */
  static logError(error: Error, context: string, additionalInfo?: Record<string, any>): void {
    const logData = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...additionalInfo,
    };

    if (error instanceof ApiError && error.status >= 500) {
      // Log server errors with full details
      console.error("Server Error:", logData);
    } else {
      // Log client errors with less detail
      console.warn("Client Error:", {
        timestamp: logData.timestamp,
        context: logData.context,
        error: logData.error.message,
      });
    }
  }

  /**
   * Create validation error from Zod validation result
   */
  static createValidationError(zodError: { issues: { path: string[]; message: string }[] }): ValidationError {
    const errors: Record<string, string[]> = {};

    zodError.issues.forEach((issue: { path: string[]; message: string }) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });

    return new ValidationError("Validation failed", errors);
  }
}

/**
 * Async error wrapper for API routes
 * Catches errors and returns appropriate HTTP responses
 */
export function withErrorHandling<T extends any[]>(handler: (...args: T) => Promise<Response>) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      ErrorHandler.logError(error as Error, "API Route");
      return ErrorHandler.createErrorResponse(error as Error);
    }
  };
}

/**
 * Rate limiting error
 */
export class RateLimitError extends ApiError {
  constructor(message = "Too many requests", retryAfter?: number) {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";

    if (retryAfter) {
      (this as any).retryAfter = retryAfter;
    }
  }
}

/**
 * Create standardized error response for API endpoints
 */
export function createErrorResponse(
  status: number,
  error: string,
  message: string,
  additionalData?: Record<string, any>
): Response {
  const errorResponse: ApiErrorResponse | ValidationErrorResponse = {
    error,
    message,
    status,
    ...additionalData,
  };

  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
