import { Component, OnInit, ViewContainerRef,ViewChild, ElementRef } from '@angular/core';
import { SocketService } from './../../socket.service';
import { AppService } from './../../app.service';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit {
  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public unreadMsgList:any=[];
  public disconnectedSocket: boolean;
  public messageText: any; 
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;
  public scrollToChatTop:boolean= false;
  public unreadList:any =[];
  public unreadOfflineList:any=[];
  public count;

  constructor( public AppService: AppService,
    public SocketService: SocketService,
    public router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {
      this.receiverId = Cookie.get('receiverId');

      this.receiverName = Cookie.get('receiverName');
      
      this.toastr.setRootViewContainerRef(vcr);
  
     }

  ngOnInit() {
    this.authToken = Cookie.get('authtoken');
    this.receiverId = Cookie.get("receiverId");

    this.receiverName =  Cookie.get('receiverName');
    console.log(this.authToken)
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=''){
      this.userSelectedToChat(this.receiverId,this.receiverName,"online")
    }

 
    this.verifyUserConfirmation();
   
    this.getMessageFromAUser();
  }

  

  public verifyUserConfirmation: any = () => {
     this.SocketService.verifyUser().subscribe(
      (data) => {
        
        this.disconnectedSocket = false;
        this.SocketService.setUser(this.authToken);
        this.getOnlineUserList();
      });
}//end

//  Online user list methdlist start 
public getOnlineUserList :any =()=>{

  this.SocketService.onlineUserList()
    .subscribe((userList) => {
     
      this.userList = [];

      for (let x in userList) {

        let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

        this.userList.push(temp);  
      

      }
     
      this.unreadMessages(); 

    }); // end online-user-list
    
} //online userlist methd end

//method to get unread messages as well as offline members unread messages 
public unreadMessages=():any =>{
 
  this.SocketService.unreadList(this.userInfo.userId).subscribe(
    (data) =>{
      this.unreadList=[];
      this.unreadList=data.data;
     
     
    });
    this.countUnread();
 

}//end
 
//method of making api reust counting unread message
public apiUnreadCount=(k,id):any =>{
 
  this.SocketService.countunread(this.userInfo.userId,id).subscribe(
    (data)=>{
      
      this.count=data.data;
      
      this.unreadMsgList[k].unread=this.count;
      this.userList.map((val)=>{
       
           if(val.userId==id){
        
             val.unread=this.count;
           }
      });
     
    });
}//end

//method to get count of unread messages
public countUnread=():any=>{
 this.unreadMsgList=[];
 let k=0;
 if(this.unreadList!=null) {
  for(let i of this.unreadList){
    
    let t= {'userId':i.userId,
    'name':`${i.firstName} ${i.lastName}`,
    'unread':null,
    'chatting':false}
this.unreadMsgList.push(t);
    this.apiUnreadCount(k,i.userId);
    
    k++;
 
  }
 }
 let onlinelist=[];
 
  for(let i of this.userList){
  onlinelist.push(i.userId);
}
if(this.unreadMsgList.length>0){
 this.unreadOfflineList=this.unreadMsgList.filter((val) =>{
  
  return !onlinelist.includes(val.userId);
});
}
console.log(this.userList); 
}//end


//Method to select a user for chatting
public userSelectedToChat=(id,name,status) =>{
    // setting that user to chatting true   
    if(status=="online") {
    this.userList.map((user)=>{
      if(user.userId==id){
        user.chatting=true;
        user.unread=0;
      }
      else{
        user.chatting = false;
      }
  })
    }
    if(status=="offline"){
      this.unreadOfflineList.map((user)=>{
        if(user.userId==id){
          user.chatting=true;
          user.unread=0;
        }
        else{
          user.chatting = false;
        }
    });
    }
  Cookie.set('receiverId', id);

  Cookie.set('receiverName', name);


  this.receiverName = name;

  this.receiverId = id;

  this.messageList = [];

  this.pageValue = 0;
  let chatDetails = {
    userId: this.userInfo.userId,
    senderId: id
  }
  this.SocketService.markChatAsSeen(chatDetails);
  this.getPreviousChatWithAUser();
  
}//end



public sendMessageUsingKeypress: any = (event: any) => {
 
  if (event.keyCode === 13) { // 13 is keycode of enter.

    this.sendMessage();

  }

} // end sendMessageUsingKeypress



public sendMessage: any = () => {

  if(this.messageText){

    let chatMsgObject = {
      senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
      senderId: this.userInfo.userId,
      receiverName: Cookie.get('receiverName'),
      receiverId: Cookie.get('receiverId'),
      message: this.messageText,
      createdOn: new Date()
    } // end chatMsgObject
  
    this.SocketService.SendChatMessage(chatMsgObject);
    this.pushToChatWindow(chatMsgObject);
      
    

  }
  else{
    this.toastr.warning('text message can not be empty')

  }

} // end sendMessage

public pushToChatWindow : any =(data)=>{

  this.messageText="";
  this.messageList.push(data);
  this.scrollToChatTop = false;


}// end push to chat window

public getMessageFromAUser :any =()=>{

  this.SocketService.chatByUserId(this.userInfo.userId)
  .subscribe((data)=>{
    
    (this.receiverId==data.senderId)?this.messageList.push(data) : '';
    this.unreadMessages(); 
    this.toastr.success(`${data.senderName} says : ${data.message}`)
    this.scrollToChatTop=false;
  
  });//end subscribe

}// end get message from a user 


public getPreviousChatWithAUser :any = ()=>{
  let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
 
  this.SocketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
  .subscribe((apiResponse) => {


    if (apiResponse.status == 200) {

      this.messageList = apiResponse.data.concat(previousData);

    } else {

      this.messageList = previousData;
      this.toastr.warning('No Messages available')

     

    }

    this.loadingPreviousChat = false;

  }, (err) => {

    this.toastr.error('some error occured')


  });

}//end

public loadEarlierPageOfChat: any = () => {

  this.loadingPreviousChat = true;

  this.pageValue++;
  this.scrollToChatTop = true;

  this.getPreviousChatWithAUser() 

} // end loadPreviousChat

public logout: any = () => {

  this.AppService.logout()
    .subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called")
        Cookie.delete('authtoken');

        Cookie.delete('receiverId');

        Cookie.delete('receiverName');

        this.SocketService.exitSocket();

        this.router.navigate(['/']);

      } else {
        this.toastr.error(apiResponse.message)

      } // end condition

    }, (err) => {
      this.toastr.error('some error occured')


    });

} // end logout


}
