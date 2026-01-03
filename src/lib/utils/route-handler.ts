import { NextResponse } from "next/server";
import { AppError } from "@/lib/utils/errors";
import { ZodError } from "zod";

export function withErrorHandling(
  handler: (...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Validation failed",
              errors: error.flatten(),
            },
          },
          { status: 422 }
        );
      }

      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: { message: error.message },
          },
          { status: error.statusCode }
        );
      }

      console.error("Unhandled API Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: { message: "Internal server error" },
        },
        { status: 500 }
      );
    }
  };
}
