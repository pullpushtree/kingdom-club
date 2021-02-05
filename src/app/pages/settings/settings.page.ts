import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private render: Renderer2,
    private router: Router,
    private afauth: AngularFireAuth
    ) { }

  ngOnInit() {
  }

  onToggleColorTheme(ev: any){
    if(ev.detail.checked){
      this.render.setAttribute(document.body, 'color-theme', 'dark')      
    } else {
      this.render.setAttribute(document.body, 'color-theme', 'light')      
    }
  }

  logout(){
    this.afauth.signOut()
    .then(() => {
      this.router.navigate(['/login']);
    });
  }
}
