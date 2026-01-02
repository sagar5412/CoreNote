import { error } from "console";
import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status: number) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
    }
  );
}

export function errorResponse(message: string, status: number, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(errors && { errors }),
      },
    },
    {
      status,
    }
  );
}

export function notFoundResponse(message: string) {
  return errorResponse(message, 404);
}

export function unauthorizedResponse() {
  return errorResponse("Unauthorized", 401);
}

export function forbiddenResponse() {
  return errorResponse("Forbidden", 403);
}
