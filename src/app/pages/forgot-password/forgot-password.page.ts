import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email: string;
  constructor(
    private afauth: AngularFireAuth, 
    private toastr: ToastController, 
    private router: Router, 
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  async sendEmailReset(){
    if(this.email)
    {
      const loading = await this.loadingCtrl.create({
        message: 'Please wait..',
        spinner: 'crescent',
        showBackdrop: true
      });

      loading.present();

      this.afauth.sendPasswordResetEmail(this.email)
      .then(()=> {
        loading.dismiss();
        this.toast('Please check your email','success')
        console.log('success');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        loading.dismiss();
        this.toast(error.message, 'danger');
        console.dir(error.message);
      })
    } else {
      console.log('Please enter your email', this.email);

    }
  }
  async toast(message,status){
    const toast = await this.toastr.create({
      message: message,
      position: 'top',
      color: status, 
      duration: 5000
    });
    toast.present();
  }
  
}
