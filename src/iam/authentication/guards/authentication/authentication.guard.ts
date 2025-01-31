import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../../decorators/auth.decorator';
import { AuthType } from '../../enums/auth-type.enums';
import { AccessTokenGuard } from '../access-token/access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the authentication types defined for the current handler or class
    // If none are defined, use the default authentication type (Bearer)
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    // Map the authentication types to their corresponding guards and flatten the array
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    // Initialize an UnauthorizedException to be thrown if no guard allows access
    let error = new UnauthorizedException();

    // Iterate over each guard instance
    for (const instance of guards) {
      // Check if the current guard allows access
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        // If an error occurs, store it to be thrown later if no guard allows access
        error = err;
      });

      // If the guard allows access, return true
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
