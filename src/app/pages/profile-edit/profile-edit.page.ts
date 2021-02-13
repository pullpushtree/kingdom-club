import {   
  Component,
  Input,
  OnInit,  
} from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { ModalController, PopoverController } from "@ionic/angular";
import { SelectImageComponent } from "../../components/select-image/select-image.component";
import { AuthService } from "src/app/services/auth.service";
import { MediaService } from "../../services/media.service";
import { first } from "rxjs/operators";


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

  profilePic1: string;
  profilePic2: string; 
  profilePic3: string;
  profilePic4: string;
  profilePic5: string;
  profilePic6: string;

  searchTerm: string;  
  school: any;  
  schoolList: any;
  showSearchBar: boolean = false;
  showList: boolean = false;

  programSearchTerm: string;  
  program: any;
  programList: any;
  showProgramSearchBar: boolean = false;
  showProgramList: boolean = false;

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
    private popoverCtrl: PopoverController,
    private media: MediaService,
  ) { 
  }

  async ngOnInit() {
    this.schoolList = await this.initializeSchoolDirectory();
    this.programList = await this.initializeProgramDirectory();    

    this.afauthSrv.user$.subscribe((user) => {
      this.currentUser = user; 
      
      this.profileQuestion1 = this.currentUser.profileAnswer1.text;
      this.profileQuestion2 = this.currentUser.profileAnswer2.text;
      this.profileQuestion3 = this.currentUser.profileAnswer3.text;

      this.profileAnswer1 = this.currentUser.profileAnswer1.answer;      
      this.profileAnswer2 = this.currentUser.profileAnswer2.answer;
      this.profileAnswer3 = this.currentUser.profileAnswer3.answer;  

      this.profilePic1 = this.currentUser.profilePic1 ? this.currentUser.profilePic1 : this.image;
      this.profilePic2 = this.currentUser.profilePic2 ? this.currentUser.profilePic2 : this.image;
      this.profilePic3 = this.currentUser.profilePic3 ? this.currentUser.profilePic3 : this.image;
      this.profilePic4 = this.currentUser.profilePic4 ? this.currentUser.profilePic4 : this.image;
      this.profilePic5 = this.currentUser.profilePic5 ? this.currentUser.profilePic5 : this.image;
      this.profilePic6 = this.currentUser.profilePic6 ? this.currentUser.profilePic6 : this.image;      
      
    });
  }
  clearLocalStorage(){ 
  
    localStorage.removeItem('profilePic1');
    localStorage.removeItem('profilePic2');
    localStorage.removeItem('profilePic3');
    localStorage.removeItem('profilePic4');
    localStorage.removeItem('profilePic5');
    localStorage.removeItem('profilePic6');
    localStorage.removeItem('picSelectedHolder');
    localStorage.removeItem('newImage');
    localStorage.removeItem('schoolSelected');
  }

  async createPopOver(ev: any){
      if (!ev.target.id == null || !ev.target.id == undefined || ev.target.id !== '' )  {      
      localStorage.setItem('picSelectedHolder', ev.target.id); 

    } else{
      console.log("event target didn't set any profile slot id");
    }
    
    await this.popoverCtrl.create({
      component: SelectImageComponent, showBackdrop: true,
    })
    .then((popoverElement) =>{
      return popoverElement.present();
    })
  }

  async deletePic(ev: any){
    localStorage.setItem('picSelectedHolder', ev.target.id);
    await this.media.delete();
  }

  async initializeSchoolDirectory(): Promise<any>{
     this.schoolList = await this.afs.collection('schools').valueChanges()
    .pipe(first()).toPromise();    
    return this.schoolList;  
  }

  showSchoolField(){    
    this.showSearchBar=true;
    
    if(this.searchTerm == undefined) {
      this.showList = false;      
    } else {
      this.showList = true;      
    }    
  }
  
  async filterList(ev: any){
    this.showList = true;
    this.schoolList = await this.initializeSchoolDirectory();
    this.searchTerm = ev.srcElement.value;
    
    if (!this.searchTerm){      
      this.showList = false;
      return;
    }
    this.schoolList = this.schoolList.filter(currentSchool => {     
      if( currentSchool.name && this.searchTerm){
        return (currentSchool.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1)
      }
    });
  }
  
  schoolSelected(ev: any) :void {
    this.school = this.schoolList;
    this.searchTerm = ev.target.innerText;
    this.showList = false;
    this.showSearchBar=false;   
  }

  async initializeProgramDirectory(): Promise<any>{
    this.programList = await this.afs.collection('school-programs').valueChanges()
   .pipe(first()).toPromise();    
   return this.programList;  
  }

  showProgramField(){    
    this.showProgramSearchBar=true;
    
    if(this.programSearchTerm == undefined) {
      this.showProgramList = false;      
    } else {
      this.showProgramList = true;      
    }    
  }

  async filterProgramList(ev: any){
    this.showProgramList = true;
    this.programList = await this.initializeProgramDirectory();
    
    this.programSearchTerm = ev.srcElement.value;
  
  if (!this.programSearchTerm){      
    this.showProgramList = false;
    return;
  }
  this.programList = this.programList.filter(currentProgram => {     
    if( currentProgram.name && this.programSearchTerm){
      return (currentProgram.name.toLowerCase().indexOf(this.programSearchTerm.toLowerCase()) > -1)
    }
  });
  }

  programSelected(ev: any) :void {
    this.program = this.programList;
    this.programSearchTerm = ev.target.innerText;
    this.showProgramList = false;
    this.showProgramSearchBar=false;   
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
