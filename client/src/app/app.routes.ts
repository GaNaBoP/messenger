import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { canActivate } from './guards/auth.guard';

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [canActivate]},
  {path: 'chat/:id', component: ChatComponent, canActivate: [canActivate]},
  {path: '*', redirectTo: ''} 
];
