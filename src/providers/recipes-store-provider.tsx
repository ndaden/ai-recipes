"use client";

import { createRecipesStore, initRecipesStore } from "@/stores/recipes-store";
import { createContext, ReactNode, useRef } from "react";


export type RecipesStoreApi = ReturnType<typeof createRecipesStore>

export const RecipesStoreContext = createContext<RecipesStoreApi | undefined>(undefined)

export interface RecipesStoreProviderProps {
    children: ReactNode
}

export const RecipesStoreProvider = ({ children }: RecipesStoreProviderProps) => {
    const storeRef = useRef<RecipesStoreApi | null>(null)
    if (storeRef.current === null) {
        storeRef.current = createRecipesStore(initRecipesStore())
    }
    return <RecipesStoreContext.Provider value={storeRef.current}>{children}</RecipesStoreContext.Provider>
}