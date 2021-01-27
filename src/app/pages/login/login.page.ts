import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { error } from 'protractor';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    
    private toastr: ToastController,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }
  validateInputs(){
    let email = this.email.trim();
    let password = this.password.trim();

    return (email && password && email.length > 0 && password.length > 0)
  }

  async loginAction(){    
    if(this.validateInputs())
    {     
      this.auth.login(this.email.trim(), this.password.trim())
      .catch((error) =>{      
        this.toast(error.message, 'danger');
        console.dir(error);
        
        if(error.code === "auth/user-not-found") {
          console.log("Loging.ts - User not found")
        }
      });
    } else {
      this.toast('Please try again!', 'danger')
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
