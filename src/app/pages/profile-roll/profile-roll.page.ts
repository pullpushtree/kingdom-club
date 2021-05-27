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
    
    let index = this.activatedRoute.snapshot.paramMap.get("id");    
    let indexNumber = +index;   
    setTimeout(() => {    
      //Multiply card height by index 
      this.content.scrollByPoint(0, indexNumber*464, 250)      
    }, 1);
  }

  getSelectedRoll(){
    this.roll = this.profileSetup.getSelectedRoll();
  }
}
