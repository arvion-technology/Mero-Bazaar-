import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/**
 * Global filter for Prisma client errors so a database constraint violation is
 * never serialized raw to the caller (no table/column metadata, no stack trace).
 *
 * - P2002 unique violation            -> 409 Conflict
 * - P2025 record-not-found on update/delete -> 404 Not Found
 *   (this is also how ownership checks that use `where { id, userId }` surface:
 *   a non-owner cannot distinguish "not found" from "not yours", which is the
 *   intended anti-enumeration behaviour).
 * - P2003 foreign-key violation        -> 409 Conflict
 * - anything else                      -> generic 500 (logged, not leaked)
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'A record with the same unique value already exists.';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'The requested resource was not found.';
        break;
      case 'P2003':
        status = HttpStatus.CONFLICT;
        message = 'The operation violates a data relationship constraint.';
        break;
      default:
        this.logger.error(
          `Unhandled Prisma error ${exception.code}: ${exception.message}`,
        );
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
