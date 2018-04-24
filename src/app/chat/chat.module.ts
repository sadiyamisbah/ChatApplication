import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ChatRouteGuardService } from './chat-route-guard.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([ 
      { path: 'chat', component: ChatBoxComponent,
      canActivate:[ChatRouteGuardService]}
    ]),
    SharedModule
  ],
  declarations: [ChatBoxComponent],
  providers:[ChatRouteGuardService]
})
export class ChatModule { }
