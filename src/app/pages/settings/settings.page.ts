import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  isDarkThemeTurnedOn: boolean;
  image = "../../../assets/images/defaultProfile.png"
  currentUser: any;  
  userData = {
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

  logout() {
    this.afauth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(["/login"]);
    });
  }
}
