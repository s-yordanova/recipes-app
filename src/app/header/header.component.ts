import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthSerevice } from "../auth/auth.service";
import { DataStorage } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    private userSub: Subscription;
    isAuthenticated = false;

    constructor(private dataStorage: DataStorage, private authService: AuthSerevice) { }

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    onSaveData() {
        this.dataStorage.storeRecipes();
    }

    onFetchData() {
        this.dataStorage.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }
}