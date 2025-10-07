/**
 * Logging utility for the application
 * Provides structured logging with different levels and contexts
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private currentLevel: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.currentLevel = level;
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  /**
   * Log info message
   */
  info(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  /**
   * Log error message
   */
  error(message: string, context?: string, data?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, userId?: string, requestId?: string): void {
    this.info(`API Request: ${method} ${url}`, "API", {
      method,
      url,
      userId,
      requestId
    });
  }

  /**
   * Log API response
   */
  logResponse(method: string, url: string, status: number, duration: number, userId?: string, requestId?: string): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, `API Response: ${method} ${url} - ${status} (${duration}ms)`, "API", {
      method,
      url,
      status,
      duration,
      userId,
      requestId
    });
  }

  /**
   * Log database operation
   */
  logDatabase(operation: string, table: string, duration?: number, error?: Error): void {
    const level = error ? LogLevel.ERROR : LogLevel.INFO;
    const message = error 
      ? `Database Error: ${operation} on ${table}`
      : `Database Operation: ${operation} on ${table}`;
    
    this.log(level, message, "DATABASE", {
      operation,
      table,
      duration,
      error: error?.message
    });
  }

  /**
   * Log authentication event
   */
  logAuth(event: string, userId?: string, success: boolean = true): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    this.log(level, `Auth Event: ${event}`, "AUTH", {
      event,
      userId,
      success
    });
  }

  /**
   * Log business logic event
   */
  logBusiness(event: string, context: string, data?: Record<string, any>): void {
    this.info(`Business Event: ${event}`, context, data);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: string, data?: Record<string, any>): void {
    if (level < this.currentLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data
    };

    // Format log entry based on environment
    if (process.env.NODE_ENV === "development") {
      this.logToConsole(entry);
    } else {
      this.logToStructured(entry);
    }
  }

  /**
   * Log to console (development)
   */
  private logToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const context = entry.context ? `[${entry.context}]` : "";
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : "";
    
    const logMessage = `${timestamp} ${levelName} ${context} ${entry.message}${data}`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
    }
  }

  /**
   * Log to structured format (production)
   */
  private logToStructured(entry: LogEntry): void {
    // In production, you might want to send logs to a service like:
    // - Winston with transports
    // - CloudWatch
    // - Datadog
    // - Sentry
    console.log(JSON.stringify(entry));
  }
}

// Create singleton logger instance
export const logger = new Logger(
  process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO
);

/**
 * Request ID generator for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Performance timing utility
 */
export class PerformanceTimer {
  private startTime: number;
  private context: string;

  constructor(context: string) {
    this.context = context;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    logger.debug(`Performance: ${this.context} completed`, "PERFORMANCE", {
      context: this.context,
      duration: Math.round(duration)
    });
    return duration;
  }
}

/**
 * Logging middleware for API routes
 */
export function createLoggingMiddleware() {
  return async (context: any, next: any) => {
    const requestId = generateRequestId();
    const timer = new PerformanceTimer(`API ${context.request.method} ${context.url.pathname}`);
    
    // Add request ID to context
    context.locals.requestId = requestId;
    
    // Log request
    logger.logRequest(
      context.request.method,
      context.url.pathname,
      context.locals.user?.id,
      requestId
    );
    
    try {
      const response = await next();
      
      // Log response
      const duration = timer.end();
      logger.logResponse(
        context.request.method,
        context.url.pathname,
        response.status,
        duration,
        context.locals.user?.id,
        requestId
      );
      
      return response;
    } catch (error) {
      const duration = timer.end();
      logger.error(
        `API Error: ${context.request.method} ${context.url.pathname}`,
        "API",
        {
          method: context.request.method,
          url: context.url.pathname,
          status: 500,
          duration,
          error: error instanceof Error ? error.message : String(error),
          userId: context.locals.user?.id,
          requestId
        }
      );
      
      throw error;
    }
  };
}
