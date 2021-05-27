import { Component, OnInit, ViewChild } from "@angular/core";
import { IonContent } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { ProfileSetupService } from "src/app/services/profile-setup.service";

@Component({
  selector: "app-profile-roll",
  templateUrl: "./profile-roll.page.html",
  styleUrls: ["./profile-roll.page.scss"],
})
export class ProfileRollPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  image = "../../../assets/images/logo_square.png";  
  currentUser: any;
  roll: any;  
  
  constructor(
    private profileSetup: ProfileSetupService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  
  ngOnInit() { }

  ionViewDidEnter() {
    this.profileSetup.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.getSelectedRoll();
    });    
    
  }
  ionViewWillEnter(){
    let picId = this.activatedRoute.snapshot.paramMap.get("id");    
    this.content.scrollByPoint(0, parseInt(picId)*514, 250) 
  }

  getSelectedRoll(){
    this.roll = this.profileSetup.getSelectedRoll();
  }

  goToUserProfile(){   
    this.router.navigate(['home/profile/']);
  }

  ionViewWillLeave(){
    this.content.scrollToTop();
  }
}
