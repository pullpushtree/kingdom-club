import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService, Message } from 'src/app/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {  
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg = '' ;

  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    //this.messages = this.chatService.getChatMessages();
    this.messages = this.chatService.getConversationsListToPutInMessagesInBox();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg).then(()=> {
      this.newMsg = '';
      this.content.scrollToBottom();
    })
  }

  goToContacts(){
    this.router.navigate(['/home/contacts'])
  }

  

}


