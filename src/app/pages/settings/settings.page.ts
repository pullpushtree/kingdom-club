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
  isThemeFlagSet: any;
  constructor(
    private render: Renderer2,
    private router: Router,
    private afauth: AngularFireAuth,
  ) { }

  ngOnInit() {
    const isThemeSet = localStorage.getItem("themeSelected")
    if (isThemeSet == "light") {
      this.isThemeFlagSet = false;     
    } else if (isThemeSet == "dark") {
      this.isThemeFlagSet = true;
    } else {
      this.isThemeFlagSet = false;
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
      this.router.navigate(["/login"]);
    });
  }
}
