import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthSerevice } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthSerevice, private router: Router, private componentFactoryRes: ComponentFactoryResolver) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }
    const email = authForm.value.email;
    const pass = authForm.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, pass);
    } else {
      authObs = this.authService.signup(email, pass);
    }

    authObs.subscribe((resData) => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorResponse => {
      this.error = errorResponse;
      this.showErrorAlert(errorResponse);
      this.isLoading = false;
    });

    authForm.reset();
  }


  onHandleError() {
    this.error = null;
  }


  private showErrorAlert(message: string) {
    const alert = this.componentFactoryRes.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alert);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear()
    })
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
