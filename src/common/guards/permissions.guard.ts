import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums/permissions.enum';
import { UserRole } from '../enums/user-role.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    const userPermissions = this.getUserPermissions(user.role);

    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
  }

  private getUserPermissions(role: UserRole): Permission[] {
    const rolePermissions = {
      [UserRole.ADMIN]: [
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.USER_DELETE,
        Permission.ADMIN_READ,
        Permission.ADMIN_WRITE,
        Permission.PROFILE_READ,
        Permission.PROFILE_WRITE,
        Permission.SETTINGS_READ,
        Permission.SETTINGS_WRITE,
      ],
      [UserRole.USER]: [
        Permission.USER_READ,
        Permission.PROFILE_READ,
        Permission.PROFILE_WRITE,
      ],
    };

    return rolePermissions[role] || [];
  }
}