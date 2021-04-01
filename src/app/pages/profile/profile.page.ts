import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  currentUser: any;
  user:any;

  image = "../../../assets/images/defaultProfile.png"; 
  
  constructor( 
    private router: Router,
    private afauthSrv: AuthService,
    ) {
      this.afauthSrv.user$.subscribe(user => {
        this.currentUser = user;
      })
    }

  ngOnInit() { }

  editProfile(){
      this.router.navigate(['home/profile/edit/']);
  }

  followProfile(){
    console.log("follow was clicked")
  }
}
