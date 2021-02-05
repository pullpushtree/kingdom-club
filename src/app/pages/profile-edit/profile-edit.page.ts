import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,  
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ProfileSetupService } from "src/app/services/profile-setup.service";


@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.page.html",
  styleUrls: ["./profile-edit.page.scss"],
})
export class ProfileEditPage implements OnInit {
  @Input() text: string;
  
  currentUser: any;
  user: any;
  data: any;

  profileQuestion1: string;
  profileQuestion2: string;
  profileQuestion3: string;

  profileAnswer1: string;
  profileAnswer2: string;
  profileAnswer3: string;

  constructor(
    private router: Router,
    private afauthSrv: AuthService,
    private afs: AngularFirestore,
    private profSrv: ProfileSetupService
  ) {}

  ngOnInit() {    
    this.afauthSrv.user$.subscribe((user) => {
      this.currentUser = user;       
      
      this.profileQuestion1 = this.currentUser.profileAnswer1.text
      this.profileQuestion2 = this.currentUser.profileAnswer2.text
      this.profileQuestion3 = this.currentUser.profileAnswer3.text

      this.profileAnswer1 = this.currentUser.profileAnswer1.answer      
      this.profileAnswer2 = this.currentUser.profileAnswer2.answer
      this.profileAnswer3 = this.currentUser.profileAnswer3.answer


    });
  }

  ionViewWillEnter() {
    this.data = this.profSrv.getProfData();

    if (this.data != null || undefined) {
      if (this.data.id == "profileAnswer1") {
        this.profileQuestion1 = this.data.text;
      } else if (this.data.id == "profileAnswer2") {
        this.profileQuestion2 = this.data.text;
      } else if (this.data.id == "profileAnswer3") {
        this.profileQuestion3 = this.data.text;
      } else {
        return;
      }
    }   
  }


  userSelectedQuestion(ev: any) {    
    this.router.navigate(["home/prompts", ev.target.id]);
  }

  async saveSelectedProfileAnswers() {
    let submitedValues = {
      profileAnswer1: {
        text: this.profileQuestion1,
        answer: this.profileAnswer1,
      },
      profileAnswer2: {
        text: this.profileQuestion2,
        answer: this.profileAnswer2
      },
      profileAnswer3: {
        text: this.profileQuestion3,
        answer: this.profileAnswer3,
      },
    };
    await this.afs
      .collection("users").doc(`${this.currentUser.uid}`)
      .update(submitedValues);    
    this.router.navigate(["home/profile"]);
  }
}
