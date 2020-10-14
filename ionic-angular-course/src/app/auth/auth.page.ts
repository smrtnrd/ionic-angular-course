import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false; // state when the app is resting
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
    this.isLoading = true;
    this.loadingCtrl.create({ // set up the loading screen
      keyboardClose: true,
      message: 'Logging in ...'
    }).then(loadingEl => {
      loadingEl.present(); // show the loading screen
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      } , 2500);
    });
  }

  onSubmit(form:NgForm) {
    if (!form.valid){
      return;
    }
    const email  = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    if (this.isLogin){
      // Send a request to login servers
      console.log('Send a request to login servers');
    } else {
      // Send a request to signup servers
      console.log('Send a request to signup servers');
    }
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }
}
