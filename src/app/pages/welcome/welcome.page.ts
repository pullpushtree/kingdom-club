import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild('slides', {static:true}) slides:IonSlides;

  slideOpts = {
    initialSlide: 0,
    effect: 'fade',
    speed: 500

  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getStarted(){
    this.slides.getActiveIndex().then(index => {      
      this.slides.slideTo(3)
    }) 
   
  }
  loginAction(){
    this.router.navigate(['login'])
  }
  signupAction(){
    this.router.navigate(['signup'])
  }

}
