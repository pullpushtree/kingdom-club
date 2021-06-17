import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  isDarkThemeTurnedOn: boolean;
  image = "../../../assets/images/defaultProfile.jpg"
  currentUser: any;  
  userData = {
    uid: "",
    firstLastName: "",
    photoURL: ""
  }

  constructor(
    private render: Renderer2,
    private router: Router,
    private afauth: AngularFireAuth,
    private authSrv: AuthService,
  )  {

    this.authSrv.user$.subscribe(user => {
      this.currentUser = user    
      this.userData = {
        uid: this.currentUser.uid,
        firstLastName: this.currentUser.firstLastName,
        photoURL: this.currentUser.photoURL
      }
    })

  
  }

  ngOnInit() {
    const themeSelected = localStorage.getItem("themeSelected")
    if (themeSelected == "light") {
      this.isDarkThemeTurnedOn = false;      
    } else if (themeSelected == "dark") {
      this.isDarkThemeTurnedOn = true;      
    } else {
      this.isDarkThemeTurnedOn = false;      
    }
  }

  onToggleColorTheme(ev: any) { 
    if (ev.detail.checked) {
      let themeSelected = "dark";
      localStorage.setItem("themeSelected", themeSelected);
      this.render.setAttribute(document.body, "color-theme", "dark");      
    } else {
      let themeSelected = "light";
      localStorage.setItem("themeSelected", themeSelected);
      this.render.setAttribute(document.body, "color-theme", "light");
    }
  }

  clearLocalStorage(){ 
  
    localStorage.removeItem('selectedConversationId');
    localStorage.removeItem('otherUser');
    localStorage.removeItem('selectedConversation');
    localStorage.removeItem('otherUserObjectDetails');
    localStorage.removeItem('participantArray');
    localStorage.removeItem('selectedUserProfileView');
    localStorage.removeItem('selectedCommentPicIndex');
    localStorage.removeItem('activatedChat');
    localStorage.removeItem("otherUserDetails");
    localStorage.removeItem("otherUserId");
  }
  
  
  viewSelectedProfile(o_userRef : any){ 
    console.log(o_userRef)  
    this.router.navigate(['home/profile-view/', o_userRef.uid]);
  }

  logout() {
    this.afauth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(["/login"]);
    });
  }
}
