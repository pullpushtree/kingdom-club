import { 
  Component,
  Input,
  OnInit,  
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { ModalController, PopoverController } from "@ionic/angular";
import { Observable } from "rxjs";
import { SelectImageComponent } from "../../components/select-image/select-image.component";
import { AuthService } from "src/app/services/auth.service";
import { ProfileSetupService } from "src/app/services/profile-setup.service";
import { MediaService } from "../../services/media.service";


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

  photos: string[];

  
  image = "https://dummyimage.com/100";

  profilePic1: Observable<any>;
  profilePic2: string;
  profilePic3: string;
  profilePic4: string;
  profilePic5: string;
  profilePic6: string;

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
    private profSrv: ProfileSetupService,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private media: MediaService,
  ) { 
  }

  ngOnInit() {    
    this.afauthSrv.user$.subscribe((user) => {
      this.currentUser = user; 
      console.log("profile-edit.ts ngOnInit()", this.currentUser)      
      
      this.profileQuestion1 = this.currentUser.profileAnswer1.text
      this.profileQuestion2 = this.currentUser.profileAnswer2.text
      this.profileQuestion3 = this.currentUser.profileAnswer3.text

      this.profileAnswer1 = this.currentUser.profileAnswer1.answer      
      this.profileAnswer2 = this.currentUser.profileAnswer2.answer
      this.profileAnswer3 = this.currentUser.profileAnswer3.answer

      this.profilePic1 = this.currentUser.profilePic1
      this.profilePic2 = this.currentUser.profilePic2
      this.profilePic3 = this.currentUser.profilePic3
      this.profilePic4 = this.currentUser.profilePic4
      this.profilePic5 = this.currentUser.profilePic5
      this.profilePic6 = this.currentUser.profilePic6

    });
  }


  clearLocalStorage(){   
   localStorage.removeItem('newImage')
   localStorage.removeItem('picSelectedHolder')
    console.log("LOCAL STORAGE WAS CLEARED!!!!");
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
    
    console.log("1WillEnter")
    console.log("IONVIEW LOADED")
  }
  

  async showModal(){
    const modal = await this.modalCtrl.create({
      component:  SelectImageComponent,
      componentProps: {
        data: 5
      }
    })
    await modal.present();
    modal.onDidDismiss().then(res => alert(JSON.stringify(res)))
  
  }

  createPopOver(ev: any){
    console.log("^ event value : " + JSON.stringify(ev.target.value))

    if(!ev.target.id == null || !ev.target.id == undefined || ev.target.id !== '' )  {      
      localStorage.setItem('picSelectedHolder', ev.target.id); 

      console.log("^ TARGE.ID : " + ev.target.id + '\n' + " & PATH.ID : " + ev.path[1].id);
      console.log("^ TARGET.ID was used profile-edit.page.ts creaePopOver() : ", ev.target.id) 

    } else if  (!ev.path[1].id === null || !ev.path[1].id === undefined || ev.path[1].id !== '') {
      localStorage.setItem('picSelectedHolder', ev.path[1].id);   

      console.log("^ TARGE.ID : " + ev.target.id + '\n' + " & PATH.ID : " + ev.path[1].id);
      console.log("^ PATH.ID was used profile-edit.ts createPopOver() : ", ev.path[1].id)

    } else {
      console.log("^ TARGE.ID : " + ev.target.id + '\n' + " & PATH.ID : " + ev.path[1].id);      
      console.log("^ ev.target.id + ev.path[1].id value : ", ev.target.id + ev.path[1].id  )
    }       
    
    
    this.popoverCtrl.create({
      component: SelectImageComponent, showBackdrop: true
    })
    .then((popoverElement) =>{
      popoverElement.present();
    })
  }


   deletePic(ev: any){
    console.log("delete clicked ev value : ", ev)
    console.log("delete clicked ev.target.id value : ", ev.target.id)
    console.log("deletePic clicked")
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
    this.media.uploadFirebase();
    await this.afs
      .collection("users").doc(`${this.currentUser.uid}`)
      .update(submitedValues);    
    this.router.navigate(["home/profile"]);
  }
}
