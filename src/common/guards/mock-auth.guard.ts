import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleEnum } from '../enums/role.enum';

interface UserPayload {
  id: string;
  role: RoleEnum;
  email: string;
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

/**
 * Mock Auth Guard for Testing
 * Injects a mock user with admin role for development/testing
 */
@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Inject mock user with admin role
    request.user = {
      id: 'test-user-id',
      role: RoleEnum.admin,
      email: 'test@example.com',
    };

    return true;
  }
}
