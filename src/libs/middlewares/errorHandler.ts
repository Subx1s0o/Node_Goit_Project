import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'routing-controllers';
import { ValidationError } from 'class-validator';

interface CustomHttpError extends HttpError {
  errors?: ValidationError[];
}

interface CustomError {
  status?: number;
  message: string | string[];
  errors?: Array<{ path: string; message: string }>;
}

export const errorHandler = (
  err: HttpError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof HttpError) {
    const httpError = err as CustomHttpError;

    if (httpError.errors && Array.isArray(httpError.errors)) {
      const validationErrors = httpError.errors as ValidationError[];

      const errors = validationErrors.map((e) => ({
        path: e.property,
        message: Object.values(e.constraints || {})[0]
      }));

      res.status(httpError.httpCode || 500).json({
        status: httpError.httpCode || 500,
        message: httpError.message || 'Error',
        errors: errors
      });
    } else {
      res.status(httpError.httpCode || 500).json({
        status: httpError.httpCode || 500,
        message: httpError.message || 'Error'
      });
    }
  } else if ((err as CustomError).status) {
    res.status((err as CustomError).status || 500).json({
      status: (err as CustomError).status,
      message: (err as CustomError).message || 'Error',
      errors: (err as CustomError).errors || []
    });
  } else {
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};