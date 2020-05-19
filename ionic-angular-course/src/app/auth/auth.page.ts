import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false; // state when the app is resting

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
    })
  }

}
