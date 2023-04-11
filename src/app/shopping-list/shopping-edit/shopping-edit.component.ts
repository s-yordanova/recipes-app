import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('f', { static: false }) shoppingListForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) { }


  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe((id: number) => {
      this.editMode = true;
      this.editedItemIndex = id;
      this.editedItem = this.shoppingListService.getIngredient(id);
      this.shoppingListForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(data: NgForm) {
    const value = data.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
