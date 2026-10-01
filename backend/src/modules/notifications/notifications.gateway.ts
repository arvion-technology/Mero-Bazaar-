import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/database/prisma.service';

interface JwtPayload {
  sub: string;
  sid?: string;
  purpose?: string;
}

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string;
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        issuer: process.env.JWT_ISSUER ?? 'mero-bazaar-api',
        audience: process.env.JWT_AUDIENCE ?? 'mero-bazaar-web',
      });

      // JwtStrategy: access tokens only, never the 2FA hand-off token
      if (!payload.sid) throw new Error('no sid');
      if (payload.purpose && payload.purpose !== 'access') {
        throw new Error('not access token');
      }

      const [user, session] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: payload.sub } }),
        this.prisma.session.findUnique({ where: { id: payload.sid } }),
      ]);
      if (
        !user ||
        !user.isActive ||
        !session ||
        session.userId !== user.id ||
        session.revokedAt ||
        session.expiresAt < new Date()
      ) {
        throw new Error('invalid session');
      }

      client.data.userId = user.id;
      await client.join(`user:${user.id}`);
    } catch {
      client.disconnect(true);
    }
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}