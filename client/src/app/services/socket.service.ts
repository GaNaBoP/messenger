import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket
}
