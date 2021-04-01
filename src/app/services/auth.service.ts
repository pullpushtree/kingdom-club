import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { BehaviorSubject, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthConstants } from "../config/auth-constant";
import { User } from "../models/User";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<User>;
  user: User;
  userData$ = new BehaviorSubject<any>("");

  currentUser: any;
  logingUserData: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private localStorageService: StorageService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
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

  getUserData() {
    this.localStorageService.get(AuthConstants.AUTH).then((res) => {
      this.userData$.next(res);
    });
  }

  async login(email, password) {
    const loading = await this.loadingCtrl.create({
      message: "Authenticating..",
      spinner: "crescent",
      showBackdrop: true,
    });

    loading.present();
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (data) => {
        this.localStorageService.set(AuthConstants.AUTH, JSON.stringify(data));
        localStorage.setItem(AuthConstants.AUTH, JSON.stringify(data));

        if (!data.user.emailVerified) {
          loading.dismiss();
          this.toast("Please confirm your email", "warning");
          this.logout();
        } else {
          //If user profile value is not set, send user to setup page
          //else send user to profile page
          let docValRef = this.afs.collection('users').doc(`${data.user.uid}`).valueChanges()
          docValRef.subscribe((res) => { 
            this.currentUser = res;
            
            if (this.currentUser.photoURL == null) {
              loading.dismiss();
              this.router.navigate(["/home/setup"]);
            } else {
              loading.dismiss();
              this.router.navigate(["/home/messages"]);
            }
          });
        }
      })

      .catch((error) => {
        this.toast(error.message, "danger");
        console.dir( "auth.service.ts login() An error happened - localStorage userCredentials set to null", error);
        this.localStorageService.set("userCredential", null);
        localStorage.setItem("userCredential", null);
        this.logout();

        console.dir(error);
        if (error.code === "auth/user-not-found") {
          console.log("User not found");
        } else {
          console.log(error)
          console.dir(error)
          console.error(error)
        }
        loading.dismiss();
      });
  }

  async logout() {
    this.afAuth.signOut().then(() => {
      this.localStorageService.removeItem(AuthConstants.AUTH);
      this.localStorageService.clear();    
      localStorage.clear();

      this.userData$.next("");
      this.user$ = null;
      this.router.navigate([""]);
    });
  }

  async signup(username, email, password, dob) {
    const loading = await this.loadingCtrl.create({
      message: "loading",
      spinner: "crescent",
      showBackdrop: true,
    });
    loading.present();
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        // TODO: verify that there are no other user with the same username
        this.afs.collection(`users`).doc(data.user.uid).set({
          uid: data.user.uid,
          displayName: username,
          email: email,
          timeStamp: Date.now(),
          dob: dob,
        });

        
        const userName = username;
        console.log("auth.service.ts signup() SAVE SET firebase user displayName username value : ", userName);
        data.user.updateProfile({ displayName: userName });
        data.user.sendEmailVerification();
      })
      .then(() => {
        console.log("success");
        loading.dismiss();
        this.toast("Please confirm your email", "warning");
        this.router.navigate(["/login"]);
      });
  }

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      position: "bottom",
      color: status,
      duration: 5000,
    });
    toast.present();
  }

  async updateUserProfileImage(pUrl: string) {
    return (await this.afAuth.currentUser).updateProfile({
      photoURL: pUrl,
    });
  }
  async updatePhotoURLAndUsername(dispNam, imgURL){    
    return  (await this.afAuth.currentUser).updateProfile({
      displayName: dispNam,
      photoURL: imgURL
      
    });
  } 
}
