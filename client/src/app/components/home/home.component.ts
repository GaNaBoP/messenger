import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { IChat, IUser, ActiveStatus } from '../../utils/types';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private socketService: SocketService) { }
  search: string = ''

  online: ActiveStatus = ActiveStatus.ONLINE
  offline: ActiveStatus = ActiveStatus.OFFLINE

  users = signal<IUser[]>([])
  chats = signal<IChat[]>([])

  ngOnInit(): void {
    this.socketService.socket.on('users found', (users: IUser[]) => {
      this.users.set(users)
    })

    this.socketService.socket.on('get my chats', (rooms: IChat[]) => {
      this.chats.set(rooms)
    })

    this.socketService.socket.emit('connecting to my chats', localStorage.getItem('accessToken'))
    this.socketService.socket.emit('get my chats', localStorage.getItem('accessToken'))
  }

  public changeSearch() {
    this.socketService.socket.emit('search', {token: localStorage.getItem('accessToken'), search: this.search})
  }

  public createRoom(userId: number) {
    this.socketService.socket.emit('create chat', {token: localStorage.getItem('accessToken'), invitedUserId: userId})
  }

  public generateLink(id: number) {
    return `/chat/${id}`
  }
}
