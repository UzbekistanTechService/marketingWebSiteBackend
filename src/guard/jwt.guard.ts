import {
    Injectable,
    ExecutionContext,
    CanActivate,
    UnauthorizedException,
    HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const auth_header = req.headers.authorization;
        if (!auth_header) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Unauthorizated!',
            });
        }
        const bearer = auth_header.split(' ')[0];
        const token = auth_header.split(' ')[1];
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Unauthorizated!',
            });
        }
        let user: any;
        try {
            user = this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_KEY,
            });
            req.user = user;
        } catch (error) {
            throw new UnauthorizedException({
                message: 'Token expired!',
            });
        }
        return true;
    }
}