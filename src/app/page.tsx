"use client";

import CameraCapture from "@/components/camera-capture";
import RecipeDetail from "@/components/recipe-detail";
import RecipeList from "@/components/recipe-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analyzeImage } from "@/lib/analyze-image";
import { Camera, Loader2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<
    "initial" | "camera" | "analyzing" | "results"
  >("initial");
  const [image, setImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  const handleCapture = async (imageSrc: string) => {
    setImage(imageSrc);
    setStep("analyzing");

    try {
      // Analyze the image to identify ingredients
      const detectedIngredients = await analyzeImage(imageSrc);
      setIngredients(detectedIngredients);

      // Get recipe suggestions based on ingredients
      const recipeResults = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: detectedIngredients }),
      }).then((res) => res.json());

      setRecipes(recipeResults);
      setStep("results");
    } catch (error) {
      console.error("Error processing image:", error);
      // Handle error state
      setStep("initial");
    }
  };

  const resetApp = () => {
    setImage(null);
    setIngredients([]);
    setRecipes([]);
    setStep("initial");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Recipe Finder</h1>

        {step === "initial" && (
          <Card className="p-6 flex flex-col items-center">
            <UtensilsCrossed className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Find Recipes from Ingredients
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Take a photo or upload an image of your ingredients and we'll
              suggest recipes you can make.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setStep("camera")}
            >
              <Camera className="mr-2 h-4 w-4" /> Add Ingredients
            </Button>
          </Card>
        )}

        {step === "camera" && (
          <CameraCapture
            onCapture={handleCapture}
            onCancel={() => setStep("initial")}
          />
        )}

        {step === "analyzing" && (
          <Card className="p-6 flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Analyzing Ingredients
            </h2>
            <p className="text-center text-muted-foreground">
              Our AI is identifying ingredients in your photo...
            </p>
          </Card>
        )}

        {step === "results" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Detected Ingredients</h2>
                <Button variant="ghost" size="sm" onClick={resetApp}>
                  Take New Photo
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
              {image && (
                <div className="relative w-full h-40 rounded-md overflow-hidden mb-4">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Captured ingredients"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </Card>

            <RecipeList
              recipes={recipes}
              onViewRecipe={(recipe) => setSelectedRecipe(recipe)}
            />
          </div>
        )}
      </div>
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </main>
  );
}
