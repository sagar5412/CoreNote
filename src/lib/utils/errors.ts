export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public errors?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You are not authorized to access this resource") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors?: any) {
    super(message, 422, errors);
    this.name = "ValidationError";
  }
}
