import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorage } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{

    constructor(private dataStorage: DataStorage, private recipesService: RecipeService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipesService.getRecipes();
        if (recipes.length === 0) {
            return this.dataStorage.fetchRecipes();
        } else {
            return recipes;
        }

    }

}