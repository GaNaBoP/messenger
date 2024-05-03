import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
import { SocketService } from '../../services/socket.service';

interface LoginResponse {
  token: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private socketService: SocketService) { }

  loginForm: FormGroup = new FormGroup({
    "email": new FormControl('', [Validators.email, Validators.required]),
    "username": new FormControl('', [Validators.minLength(5), Validators.required]),
    "password": new FormControl('', [Validators.minLength(5), Validators.required])
  })

  public submit(path: string) {
    this.http.post<LoginResponse>(`${environment.apiUrl}/${path}`, this.loginForm.value)
    .subscribe((res) => {
      if (localStorage.getItem('accessToken')) {
        this.socketService.socket.emit('user disconnect', localStorage.getItem('accessToken'))
      }
      if (res.token) {
        localStorage.setItem('accessToken', res.token)
        this.router.navigate(['/home'])
      }
    }, (error) => console.log(error))
  }

}
