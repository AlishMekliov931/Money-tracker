import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../pages/home/home.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService,
    public homeService: HomeService,
  ) {
    this.initializeApp();
    this.setRootPage();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Track History', component: ListPage }
    ];

  }

  get uId() {
    return localStorage.getItem('uid')
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    // this.auth.afAuth.authState
    // .subscribe(
    //   user => {
    //     if (user) {
    //       this.rootPage = HomePage;
    //     } else {
    //       this.rootPage = LoginPage;
    //     }
    //   },
    //   () => {
    //     this.rootPage = LoginPage;
    //   }
    // );
  }


  async logout() {
    await this.auth.signOut();
    localStorage.clear()
    await this.homeService.clearAllData()
    this.nav.setRoot(LoginPage);
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component === ListPage) {
      this.nav.push(page.component)
    } else {
      this.nav.setRoot(page.component);
    }
  }

  setRootPage() {
      if (this.uId) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
  }
}
