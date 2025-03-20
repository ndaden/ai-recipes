"use client";

import { useState } from "react";
import { X, Clock, Printer, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Ingredient {
  name: string;
  amount: string;
  isMatched?: boolean;
}

interface Instruction {
  step: number;
  text: string;
}

interface RecipeDetailProps {
  recipe: {
    id: string;
    title: string;
    image?: string;
    matchedIngredients: string[];
    missingIngredients: string[];
    cookTime: string;
    servings?: number;
    calories?: number;
    difficulty?: string;
  };
  onClose: () => void;
}

export default function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  const [activeTab, setActiveTab] = useState("ingredients");

  // Generate mock detailed data based on the recipe
  const ingredients: Ingredient[] = [
    ...recipe.matchedIngredients.map((name) => ({
      name,
      amount: generateRandomAmount(name),
      isMatched: true,
    })),
    ...recipe.missingIngredients.map((name) => ({
      name,
      amount: generateRandomAmount(name),
      isMatched: false,
    })),
  ];

  const instructions: Instruction[] = generateMockInstructions(recipe);
  const nutritionFacts = generateMockNutrition();

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <div className="relative h-48 w-full">
          <img
            src={
              recipe.image ||
              `/placeholder.svg?height=200&width=500&text=${encodeURIComponent(
                recipe.title
              )}`
            }
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <DialogClose className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <X className="h-5 w-5 text-white" />
          </DialogClose>
        </div>

        <div className="px-6 pt-4 pb-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {recipe.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mt-2 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {recipe.cookTime}
                </span>
              </div>
              {recipe.servings && (
                <div className="text-sm text-muted-foreground">
                  {recipe.servings} servings
                </div>
              )}
              {recipe.difficulty && (
                <div className="text-sm text-muted-foreground">
                  {recipe.difficulty}
                </div>
              )}
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" title="Save Recipe">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Share Recipe">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Print Recipe">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ingredients</h3>
                <ul className="space-y-2">
                  {ingredients.map((ingredient, idx) => (
                    <li
                      key={idx}
                      className={`flex justify-between p-2 rounded-md ${
                        ingredient.isMatched
                          ? "bg-green-50 text-green-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      <span>{ingredient.name}</span>
                      <span className="text-sm">{ingredient.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Kitchen Equipment</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {generateMockEquipment().map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <h3 className="font-medium mb-2">Preparation Steps</h3>
              <ol className="space-y-4">
                {instructions.map((instruction) => (
                  <li key={instruction.step} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                      {instruction.step}
                    </div>
                    <p>{instruction.text}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md">
                <h4 className="font-medium mb-1">Chef's Tip</h4>
                <p className="text-sm">{generateChefTip(recipe.title)}</p>
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <h3 className="font-medium mb-2">Nutrition Facts</h3>
              <div className="border rounded-md p-3">
                <div className="border-b pb-2 mb-2">
                  <div className="flex justify-between font-bold">
                    <span>Calories</span>
                    <span>{nutritionFacts.calories}</span>
                  </div>
                </div>

                {Object.entries(nutritionFacts.macros).map(([name, value]) => (
                  <div
                    key={name}
                    className="flex justify-between py-1 border-b text-sm"
                  >
                    <span>{name}</span>
                    <span>{value}</span>
                  </div>
                ))}

                <div className="mt-3 pt-2 border-t">
                  <h4 className="font-medium mb-1 text-sm">
                    Vitamins & Minerals
                  </h4>
                  {Object.entries(nutritionFacts.vitamins).map(
                    ([name, value]) => (
                      <div
                        key={name}
                        className="flex justify-between py-1 text-xs text-muted-foreground"
                      >
                        <span>{name}</span>
                        <span>{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic">
                * Percent Daily Values are based on a 2,000 calorie diet. Your
                daily values may be higher or lower depending on your calorie
                needs.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t">
          <Button className="w-full" onClick={onClose}>
            Back to Recipes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions to generate mock data
function generateRandomAmount(ingredient: string): string {
  const units = ["g", "cups", "tbsp", "tsp", "oz", "ml"];
  const unit = units[Math.floor(Math.random() * units.length)];

  let amount;
  if (unit === "g" || unit === "ml") {
    amount = (Math.floor(Math.random() * 500) + 50).toString();
  } else if (unit === "cups") {
    amount = (Math.floor(Math.random() * 3) + 1).toString();
  } else {
    amount = (Math.floor(Math.random() * 4) + 1).toString();
  }

  return `${amount} ${unit}`;
}

function generateMockInstructions(recipe: any): Instruction[] {
  // Generate 4-6 mock instructions based on the recipe title and ingredients
  const steps = [];
  const numSteps = Math.floor(Math.random() * 3) + 4; // 4-6 steps

  const prepSteps = [
    `Prepare all ingredients. Wash and chop the vegetables.`,
    `Measure out all ingredients and set aside.`,
    `Preheat your oven to 375°F (190°C).`,
    `Heat a large pan over medium heat with olive oil.`,
  ];

  const cookingSteps = [
    `Add the ${
      recipe.matchedIngredients[0] || "ingredients"
    } to the pan and cook for 5 minutes.`,
    `Combine ${recipe.matchedIngredients[1] || "ingredients"} with ${
      recipe.matchedIngredients[0] || "other ingredients"
    } and mix well.`,
    `Simmer for 10-15 minutes until the flavors meld together.`,
    `Season with salt and pepper to taste.`,
    `Add the ${
      recipe.missingIngredients[0] || "remaining ingredients"
    } and stir to combine.`,
  ];

  const finishingSteps = [
    `Serve hot, garnished with fresh herbs.`,
    `Let rest for 5 minutes before serving.`,
    `Divide evenly among plates and enjoy immediately.`,
    `Garnish with ${
      recipe.missingIngredients[1] || "fresh herbs"
    } before serving.`,
  ];

  steps.push(prepSteps[Math.floor(Math.random() * prepSteps.length)]);

  for (let i = 0; i < numSteps - 2; i++) {
    steps.push(cookingSteps[i % cookingSteps.length]);
  }

  steps.push(finishingSteps[Math.floor(Math.random() * finishingSteps.length)]);

  return steps.map((text, index) => ({
    step: index + 1,
    text,
  }));
}

function generateMockEquipment(): string[] {
  const equipment = [
    "Large skillet or frying pan",
    "Cutting board",
    "Chef's knife",
    "Measuring cups and spoons",
    "Mixing bowl",
    "Wooden spoon",
  ];

  // Return a random subset of 3-5 items
  return equipment
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);
}

function generateMockNutrition() {
  return {
    calories: `${Math.floor(Math.random() * 400) + 200} kcal`,
    macros: {
      "Total Fat": `${Math.floor(Math.random() * 20) + 5}g`,
      "Saturated Fat": `${Math.floor(Math.random() * 8) + 2}g`,
      Carbohydrates: `${Math.floor(Math.random() * 40) + 20}g`,
      Fiber: `${Math.floor(Math.random() * 5) + 1}g`,
      Sugars: `${Math.floor(Math.random() * 10) + 1}g`,
      Protein: `${Math.floor(Math.random() * 25) + 10}g`,
      Sodium: `${Math.floor(Math.random() * 500) + 100}mg`,
    },
    vitamins: {
      "Vitamin A": `${Math.floor(Math.random() * 20) + 5}%`,
      "Vitamin C": `${Math.floor(Math.random() * 40) + 10}%`,
      Calcium: `${Math.floor(Math.random() * 15) + 5}%`,
      Iron: `${Math.floor(Math.random() * 20) + 5}%`,
    },
  };
}

function generateChefTip(recipeTitle: string): string {
  const tips = [
    `For the best flavor in this ${recipeTitle}, use fresh herbs instead of dried whenever possible.`,
    `This ${recipeTitle} can be prepared up to a day in advance and refrigerated until ready to cook.`,
    `For a spicier version of this ${recipeTitle}, add a pinch of red pepper flakes or a diced jalapeño.`,
    `To make this ${recipeTitle} more filling, consider adding some protein like grilled chicken or tofu.`,
    `The key to a perfect ${recipeTitle} is not to overcook the vegetables - they should still have some bite to them.`,
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}
