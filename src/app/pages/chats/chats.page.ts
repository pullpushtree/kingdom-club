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

  messages: Observable<Message[]>;
  newMsg = '' ;

  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
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
