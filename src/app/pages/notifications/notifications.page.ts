import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FollowService } from 'src/app/services/follow.service';
import { ChatService } from 'src/app/services/chat.service';
import { Notifications } from '../../models/Notifications';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: Observable<Notifications[]>;
  image = "../../../assets/images/defaultProfile.jpg";  
  currentUser: any;
  

  constructor(
    private followService: FollowService,
    private chatService: ChatService
  ) { }

  ngOnInit() { }

  ionViewWillEnter(){
    this.followService.getCurrentUser()
    .subscribe((user) => {
      this.currentUser = user;      
      this.notifications = this.followService.getNotifications() as Observable<Notifications[]>;
    });
  }

  approveReqest(followerObj: any){    
    this.followService.approveFollowRequest(followerObj);
  }
  
  rejectRequest(notificationToDelete){
    this.followService.removeNotifcation(notificationToDelete);
  }

  cancelRequest(){
    this.followService.cancelFollowRequest();
  }

  messageNewContact(notification){
    this.chatService.startNewChatFormater(notification)
  }
}
