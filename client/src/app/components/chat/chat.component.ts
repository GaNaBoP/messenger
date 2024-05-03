import { Component, OnInit, signal } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IMessage, IUser, ActiveStatus } from '../../utils/types';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  constructor(private socketService: SocketService, private route: ActivatedRoute) { }
  private chatId: number 
  message: string = ''

  online: ActiveStatus = ActiveStatus.ONLINE
  offline: ActiveStatus = ActiveStatus.OFFLINE

  member = signal<IUser>({} as IUser)
  messages = signal<IMessage[]>([] as IMessage[])

  ngOnInit(): void {
    this.chatId = Number(this.route.snapshot.params["id"])
    this.socketService.socket.emit('connecting to rooms', localStorage.getItem('accessToken'))

    this.socketService.socket.emit('get member', {
      chatId: this.chatId, token: localStorage.getItem('accessToken')
    })

    this.socketService.socket.emit('get messages', {chatId: this.chatId, token: localStorage.getItem('accessToken')})

    this.socketService.socket.on('get member', (member: IUser) => {
      this.member.set(member)
    })

    this.socketService.socket.on('get messages', (data: IMessage[]) => {
      this.messages.set(data)
    })
  }

  public sendMessage() {
    this.socketService.socket.emit('chat message', {
      chatId: this.chatId, token: localStorage.getItem('accessToken'), message: this.message
    })
    this.message = ''
  }

  public deleteMessage(msgId: number) {
    this.socketService.socket.emit('delete message', {msgId, chatId: this.chatId, token: localStorage.getItem('accessToken')})
  }
}
