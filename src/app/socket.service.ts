import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
@Injectable()
export class SocketService {
  private url = 'https://chatapi.edwisor.com';

  private socket;

  constructor(public http: HttpClient) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);

  }
//listening events
  //method to listen to verify user event
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      }); //end socket
    });//end observable

  }//end verify user event


  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList

 
  // end events to be listened

//emit events
public setUser=(authToken)=>{
  this.socket.emit('set-user',authToken);
}//end of this event

//message sending
public SendChatMessage = (chatMsgObject) => {

  this.socket.emit('chat-msg', chatMsgObject);

} // end SendChatMessage

public chatByUserId = (userId) => {

  return Observable.create((observer) => {
    
    this.socket.on(userId, (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable

} // end chatByUserId

public markChatAsSeen = (userDetails) => {

  this.socket.emit('mark-chat-as-seen', userDetails);

} // end markChatAsSeen

public getChat(senderId, receiverId, skip): Observable<any> {

  return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
    .do(data => console.log('Data Received'))
    .catch(this.handleError);

} 

//method to get unread messages user list
public unreadList=(id):any =>{
  return this.http.get(`${this.url}/api/v1/chat/unseen/user/list?userId=${id}&authToken=${Cookie.get('authtoken')}`)
} //end

//method to get count of unread messages user list
public countunread=(userid,senderId):any =>{
 return this.http.get(`${this.url}/api/v1/chat/count/unseen?userId=${userid}&senderId=${senderId}&authToken=${Cookie.get('authtoken')}`)
} //end

public handleError(err: HttpErrorResponse) {

  let errorMessage = '';

  if (err.error) {

    errorMessage = `${err.error.message}`;

  } else {

    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

  } // end condition *if

  
 
  return errorMessage;

}  // END handleError


public exitSocket = () : any =>{
  return Observable.create((observer) => {

    this.socket.on("disconnect", () => {

      observer.next();

    }); // end Socket

  }); // end Observable


}// end exit socket





}
