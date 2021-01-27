import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthConstants } from '../config/auth-constant';
import { User } from '../models/User';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  user: User
  userData$ = new BehaviorSubject<any>('')

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,    
    private localStorageService: StorageService,
    
  ) {
    this.user$= this.afAuth.authState.pipe(
      switchMap(user => {
        if(user)
        { 
          this.localStorageService.set(AuthConstants.AUTH, JSON.stringify(user));
          return this.afs.doc(`users/${user.uid}`).valueChanges();
        } else {
          this.localStorageService.set(AuthConstants.AUTH, null);
          return of(null);
        }
      })
    );
   }

   getUserData(){
     this.localStorageService.get(AuthConstants.AUTH).then(res =>{
       this.userData$.next(res);
     })
   }

   async login(email, password){
    const loading = await this.loadingCtrl.create({
      message: 'Authenticating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
    this.afAuth.signInWithEmailAndPassword(email, password)
    .then((data)=> {
      console.log("auth.service", data)
      if(!data.user.emailVerified)
      {        
        loading.dismiss();        
        this.toast('Please confirm your email', 'warning');
        this.logout();       
      
      } else {
        if (data.user.photoURL == null){
          loading.dismiss();
          this.router.navigate(['/set-profile-images']);
        } else {
          loading.dismiss();
          this.localStorageService.set(AuthConstants.AUTH, JSON.stringify(data.user));
          this.router.navigate(['/home/chats']);
        }        
      }
    })
    .catch((error) => {
      this.toast(error.message, 'danger');
      this.logout();    
      console.dir(error);
      if(error.code === "auth/user-not-found") {
        console.log("User not found");
      }
      loading.dismiss();
    });
   }

   async logout(){
     this.afAuth.signOut().then(()=> {
       //this.localStorageService.clear();
       //localStorage.setItem(AuthConstants.AUTH, null);
       this.localStorageService.removeItem(AuthConstants.AUTH);

       this.userData$.next('');
       this.router.navigate(['']);
     })
   }

   async signup(username, email, password, dob){
    const loading = await this.loadingCtrl.create({
      message: 'loading',
       spinner: 'crescent',
       showBackdrop: true
    });
    loading.present();
    this.afAuth.createUserWithEmailAndPassword(email, password)
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
