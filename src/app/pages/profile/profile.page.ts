import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  currentUser: any;
  user:any;
  
  constructor( 
    private router: Router,
    private afauthSrv: AuthService,   
    ) { }

  ngOnInit() {

    this.afauthSrv.user$.subscribe(user => {
      this.currentUser = user;
      console.log("afauthSrv value : ", this.user)      
    });
  }
   editProfile(){
      this.router.navigate(['home/profile/edit/']);
  }

  followProfile(){
    console.log("follow was clicked")
  }
}
