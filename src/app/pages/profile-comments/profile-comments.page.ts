import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProfileSetupService, Comment } from 'src/app/services/profile-setup.service';


@Component({
  selector: 'app-profile-comments',
  templateUrl: './profile-comments.page.html',
  styleUrls: ['./profile-comments.page.scss'],
})
export class ProfileCommentsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  comments: Observable<Comment[]>;
  newComment: string;
  currentUser: any;
  image = "../../../assets/images/defaultProfile.jpg"
  dateAgoRef: any;

  constructor(
    private profilePictureComment: ProfileSetupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() { }

  ionViewWillEnter(){
    let picId = this.activatedRoute.snapshot.paramMap.get("id");    
    this.profilePictureComment.getCurrentUser()
    .subscribe(user => {
      this.currentUser = user
      this.comments = this.profilePictureComment.getPictureComment(picId )     
   })  
  }

  submitComment(){
    let picId = this.activatedRoute.snapshot.paramMap.get("id");
    this.profilePictureComment.addPictureComment(picId, this.newComment)    
    .then(()=> {
      this.newComment = '';
      this.content.scrollToTop();
    })
  }
}

