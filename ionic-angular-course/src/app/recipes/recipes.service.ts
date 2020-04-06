import { Injectable } from '@angular/core';
import { Recipe } from './recipes.model';

@Injectable({
  providedIn: 'root' // can use it on any page on the application
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl: 'https://www.thespruceeats.com/thmb/dFLHcwFFtDguBZGylUlDN8KaNaw=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/wiener-schnitzel-recipe-1447089-Hero-5b587d6c46e0fb0071b0059d.jpg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'lasagna',
      imageUrl: 'https://www.modernhoney.com/wp-content/uploads/2019/08/Classic-Lasagna-Recipe.jpg',
      ingredients: ['Pasta', 'Meat', 'Cheeze', 'Tomato']
    }
  ];
  constructor() { }

  getAllRecipes(){
    return [... this.recipes]; // copy the content of an array and put it in another array
  }

  getRecipe(recipeId: string){
    return {
      ... this.recipes.find( recipe => { // create a copy of the objet
      return recipe.id === recipeId;
      })
    };
  }
}
