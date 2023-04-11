import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipesServcie: RecipeService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.recipes = this.recipesServcie.getRecipes();
    this.subscription = this.recipesServcie.recipesChanged.subscribe((data: Recipe[]) => {
      this.recipes = data;
    })
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
