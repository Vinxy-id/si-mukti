import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserPayload {
  userId: string;
  role: string;
  phoneNumber: string;
  fullName: string;
  workshopId?: string | null;
  offtakerId?: string | null;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUserPayload;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  }
);
