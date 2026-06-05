import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/tryout', cors: { origin: '*' } })
export class TryoutGateway {
  // TODO: implement
}
