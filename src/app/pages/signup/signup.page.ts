import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  username: string;
  email: string;
  password: string; 
  dob: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    //private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private router: Router
  ) { }

  ngOnInit() {    
  }

  async signupAction(){
    if(this.username && this.email && this.password && this.dob){
      this.auth.signup(this.username.trim(), this.email.trim(), this.password.trim(), this.dob.trim())
      .catch((error) => {        
        this.toast(error.message, 'danger');
        console.dir(error);
      })
    } else {      
      this.toast('Please try again!', 'danger');
    }
  }

  async toast(message, status){
    const toast = await this.toastr.create({
      message: message,
      position: 'bottom',
      color: status, 
      duration: 2000
    });

    toast.present();
  }

}
