import type { ApiErrorResponse, ValidationErrorResponse } from "../schemas/deck.schemas";

/**
 * Custom error classes for better error handling
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status: number = 500, code: string = "INTERNAL_ERROR") {
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
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Resource conflict") {
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
        status: error.status
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
        status: 500
      };
    }

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  /**
   * Handle Supabase errors and convert to appropriate API errors
   */
  static handleSupabaseError(error: any, context: string): ApiError {
    console.error(`Supabase error in ${context}:`, error);

    // Handle specific Supabase error codes
    switch (error.code) {
      case "PGRST116":
        return new NotFoundError("Resource not found");
      
      case "23505": // Unique constraint violation
        return new ConflictError("Resource already exists");
      
      case "23503": // Foreign key constraint violation
        return new ValidationError("Invalid reference", {
          reference: ["Referenced resource does not exist"]
        });
      
      case "23502": // Not null constraint violation
        return new ValidationError("Required field missing", {
          field: ["This field is required"]
        });
      
      case "42501": // Insufficient privilege
        return new AuthorizationError("Insufficient permissions");
      
      default:
        return new ApiError(
          `Database error: ${error.message}`,
          500,
          "DATABASE_ERROR"
        );
    }
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
        stack: error.stack
      },
      ...additionalInfo
    };

    if (error instanceof ApiError && error.status >= 500) {
      // Log server errors with full details
      console.error("Server Error:", logData);
    } else {
      // Log client errors with less detail
      console.warn("Client Error:", {
        timestamp: logData.timestamp,
        context: logData.context,
        error: logData.error.message
      });
    }
  }

  /**
   * Create validation error from Zod validation result
   */
  static createValidationError(zodError: any): ValidationError {
    const errors: Record<string, string[]> = {};
    
    zodError.issues.forEach((issue: any) => {
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
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<Response>
) {
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
  constructor(message: string = "Too many requests", retryAfter?: number) {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
    
    if (retryAfter) {
      (this as any).retryAfter = retryAfter;
    }
  }
}
