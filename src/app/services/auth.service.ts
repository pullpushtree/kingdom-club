import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  user: User

  constructor(
    private afauth: AngularFireAuth, 
    private afs: AngularFirestore, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController
    
  ) {
    this.user$= this.afauth.authState.pipe(
      switchMap(user => {
        if(user)
        {
          return this.afs.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
   }

   async login(email, password){
    const loading = await this.loadingCtrl.create({
      message: 'Authenticating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
    this.afauth.signInWithEmailAndPassword(email, password)
    .then((data)=> {

      console.log("auth.service", data)
      if(!data.user.emailVerified)
      {        
        loading.dismiss();        
        this.toast('Please confirm your email', 'warning');
        this.logout();       
      
      } else {
        loading.dismiss();
        this.router.navigate(['/home/chats']);
        console.log('email and password have now been verified');
      }
    })
    .catch((error) => {
      this.toast(error.message, 'danger');
      this.logout();    
      console.dir(error);
      if(error.code === "auth/user-not-found") {
        console.log("User not found")
      }
      loading.dismiss();
    });
   }

   logout(){
     this.afauth.signOut().then(()=> {
       this.router.navigate(['/login'])
     })
   }

   async signup(username, email, password, dob){
    const loading = await this.loadingCtrl.create({
      message: 'loading',
       spinner: 'crescent',
       showBackdrop: true
    });
    loading.present();
    this.afauth.createUserWithEmailAndPassword(email, password)
    .then((data)=> {
      this.afs.collection(`users`).doc(data.user.uid).set({
        'uid': data.user.uid,
        'displayName': username,
        'email': email,
        'timeStamp': Date.now(),
        'dob': dob
      });

      data.user.sendEmailVerification();
    })
    .then(()=> {
      console.log('success');
      loading.dismiss();
      this.toast('Please confirm your email', 'warning');
      this.router.navigate(['/login']);
    })

   }

   async toast(message, status){
     const toast = await this.toastr.create({
       message: message,
       position: 'bottom',
       color: status, 
       duration: 5000

     });
     toast.present();
   }
}
