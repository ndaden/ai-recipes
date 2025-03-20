"use client"

import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Recipe {
  id: string
  title: string
  image?: string
  matchedIngredients: string[]
  missingIngredients: string[]
  cookTime: string
}

interface RecipeListProps {
  recipes: Recipe[]
  onViewRecipe: (recipe: Recipe) => void
}

export default function RecipeList({ recipes, onViewRecipe }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No recipes found with these ingredients.</p>
        <p className="text-sm mt-2">Try adding more ingredients or taking a clearer photo.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recipe Suggestions</h2>

      {recipes.map((recipe) => (
        <Card key={recipe.id} className="overflow-hidden">
          <div className="relative h-40 w-full">
            {recipe.image ? (
              <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <img
                src={`/placeholder.svg?height=160&width=400`}
                alt="Recipe placeholder"
                className="w-full h-full object-cover bg-muted"
              />
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">{recipe.title}</h3>

            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <span>{recipe.cookTime}</span>
              <span className="mx-2">•</span>
              <span>{recipe.matchedIngredients.length} ingredients matched</span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-1">You have:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.matchedIngredients.map((ingredient, idx) => (
                  <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {recipe.missingIngredients.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">You need:</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.missingIngredients.map((ingredient, idx) => (
                    <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full mt-2" variant="outline" onClick={() => onViewRecipe(recipe)}>
              View Recipe <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

