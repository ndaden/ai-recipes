import { RecipesStoreContext } from "@/providers/recipes-store-provider"
import { useContext } from "react"
import { useStore } from "zustand"
import { createStore } from "zustand/vanilla"


export type Recipe = {
    id: string
    title: string
    description?: string
    possibleIngredients?: string[]
    matchedIngredients: string[]
    missingIngredients: string[]
    cookTime: string
    image?: string
    servings?: number
    difficulty?: string
    calories?: number
    isFavorite?: boolean
}

export type RecipesState = {
    recipes: Recipe[]
}

export type RecipesActions = {
    setRecipes: (recipes: Recipe[]) => void
    addToFavorites: (id: string) => void
}

export type RecipesStore = RecipesState & RecipesActions

export const initRecipesStore = (): RecipesState => {
    return { recipes: [] }
}

export const createRecipesStore = (initState: RecipesState = { recipes: [] }) => {
    return createStore<RecipesStore>()((set) => ({
        ...initState,
        setRecipes: (recipes) => set((state) => ({ ...state, recipes: recipes })),
        addToFavorites: (id: string) => set((state) => {
            const recipe = state.recipes.find(r => r.id === id)
            if (recipe) {
                recipe.isFavorite = true
            }

            return state
        })
    }))
}

export const useRecipesStore = <T,>(
    selector: (store: RecipesStore) => T,
): T => {
    const recipesStoreContext = useContext(RecipesStoreContext)

    if (!recipesStoreContext) {
        throw new Error(`useRecipesStore must be used within CounterStoreProvider`)
    }

    return useStore(recipesStoreContext, selector)
}