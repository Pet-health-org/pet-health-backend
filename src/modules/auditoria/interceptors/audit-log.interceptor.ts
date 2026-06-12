import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, mergeMap } from 'rxjs';
import { AuditoriaService } from '../auditoria.service';
import { AUDIT_LOG_KEY } from '../decorators/audit-log.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<string>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );
    if (!action) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      mergeMap(async (result) => {
        const registroId =
          result?.id || request.params.id || request.body?.id || null;
        await this.auditoriaService.log({
          usuarioId: user?.id,
          accion: action,
          ip: request.ip,
          registroId,
        });
        return result;
      }),
    );
  }
}
