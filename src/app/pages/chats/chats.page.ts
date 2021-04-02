import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService, Message } from 'src/app/services/chat.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  image = "../../../assets/images/defaultProfile.png"
  messages: Observable<Message[]>;
  newMsg = '' ;
  currentUser: any;
  o_userRef = {
    uid: "",
    photoURL: "",
    displayName: ""
  }  

  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    let msgId = localStorage.getItem('selectedConversationId'); 
    this.messages = this.chatService.getConversationHistory(msgId);  
    this.currentUser = JSON.parse(localStorage.getItem("userCredKey"));    
    this.o_userRef = this.chatService.getOtherUserDetailsForChat()
  }

  ionViewDidEnter() {    
    this.scrollToBottomOnInit();
  }
  scrollToBottomOnInit() {    
    setTimeout(() => {      
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(0);
      }
    }, 200);
  }

  viewSelectedProfile(){   
    this.router.navigate(['home/profile-view/']);
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg)
    .then(()=> {
      this.newMsg = '';
      this.content.scrollToBottom();
    })
  }

}
