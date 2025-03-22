"use client";

import RecipeDetail from "@/components/recipe-detail"
import RecipeList from "@/components/recipe-list"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Recipe, useRecipesStore } from "@/stores/recipes-store";
import { useRouter } from "next/navigation"
import { useState } from "react"

const resultsPage = () => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe|null>(null)
    const {recipes} = useRecipesStore((state)=> state)
    const router = useRouter()
    const ingredients: string[] = []
    // const recipes: object[] = []
    const image: string = ""
    const resetApp = () => null
    return <div>
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

        {
            selectedRecipe && (
                <RecipeDetail
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                />
            )
        }</div >
}

export default resultsPage