import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { HomeService } from '../home/home.service';
import { DataService } from '../../services/data.servicee';
import { first } from '../../../node_modules/rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	loginForm: FormGroup;
	loginError: string;

	constructor(
		private navCtrl: NavController,
		private auth: AuthService,
		fb: FormBuilder,
		private homeService: HomeService,
		private dataService: DataService,
	) {
		this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
  }
  
  login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signInWithEmail(credentials)
			.then(
				async (r) => {
					localStorage.setItem('uid', r.uid)
					const onlineData = await this.dataService.getData().pipe(first()).toPromise()
					if (onlineData) {
						for (const d of onlineData) {
							await this.homeService.setValue(d.key, d.value);
						}
					}
								
					this.navCtrl.setRoot(HomePage)
				},
				error => this.loginError = error.message
			);
	}

	signup(){
		this.navCtrl.push(SignupPage);
	}

}