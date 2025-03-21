import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid ingredients provided" },
        { status: 400 }
      );
    }

    // In a real app, you would use the AI SDK to generate recipes
    // For demo purposes, we'll return mock data

    /*
    const prompt = `
      Generate 3 recipe suggestions based on these ingredients: ${ingredients.join(', ')}.
      For each recipe, provide:
      1. Title
      2. List of ingredients that match from the provided list
      3. List of additional ingredients needed
      4. Approximate cooking time

      Format the response as a JSON array with objects containing:
      {
        "id": "unique-id",
        "title": "Recipe Title",
        "matchedIngredients": ["ingredient1", "ingredient2"],
        "missingIngredients": ["ingredient3", "ingredient4"],
        "cookTime": "30 minutes"
      }
    `;

    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt
    });

    const recipes = JSON.parse(text);
    */

    // Mock recipes based on the ingredients
    const mockRecipes = generateMockRecipes(ingredients);

    return NextResponse.json(mockRecipes);
  } catch (error) {
    console.error("Error generating recipes:", error);
    return NextResponse.json(
      { error: "Failed to generate recipes" },
      { status: 500 }
    );
  }
}

function generateMockRecipes(ingredients: string[]) {
  const recipeTemplates = [
    {
      title: "Pasta Primavera",
      possibleIngredients: [
        "pasta",
        "tomatoes",
        "bell peppers",
        "onions",
        "garlic",
        "olive oil",
        "cheese",
        "basil",
      ],
      cookTime: "25 minutes",
      image: "/placeholder.svg?height=160&width=400&text=Pasta+Primavera",
      servings: 4,
      difficulty: "Easy",
      calories: 420,
    },
    {
      title: "Vegetable Stir Fry",
      possibleIngredients: [
        "bell peppers",
        "onions",
        "garlic",
        "olive oil",
        "soy sauce",
        "rice",
        "carrots",
      ],
      cookTime: "20 minutes",
      image: "/placeholder.svg?height=160&width=400&text=Stir+Fry",
      servings: 3,
      difficulty: "Easy",
      calories: 380,
    },
    {
      title: "Caprese Salad",
      possibleIngredients: [
        "tomatoes",
        "basil",
        "olive oil",
        "cheese",
        "balsamic vinegar",
      ],
      cookTime: "10 minutes",
      image: "/placeholder.svg?height=160&width=400&text=Caprese+Salad",
      servings: 2,
      difficulty: "Easy",
      calories: 320,
    },
    {
      title: "Tomato Soup",
      possibleIngredients: [
        "tomatoes",
        "onions",
        "garlic",
        "olive oil",
        "basil",
        "cream",
        "vegetable stock",
      ],
      cookTime: "35 minutes",
      image: "/placeholder.svg?height=160&width=400&text=Tomato+Soup",
      servings: 4,
      difficulty: "Medium",
      calories: 280,
    },
    {
      title: "Cheese Omelette",
      possibleIngredients: [
        "eggs",
        "cheese",
        "onions",
        "bell peppers",
        "olive oil",
        "salt",
        "pepper",
      ],
      cookTime: "15 minutes",
      image: "/placeholder.svg?height=160&width=400&text=Cheese+Omelette",
      servings: 1,
      difficulty: "Easy",
      calories: 350,
    },
  ];

  return recipeTemplates
    .map((template) => {
      const matchedIngredients = ingredients.filter((ing) =>
        template.possibleIngredients.includes(ing)
      );

      const missingIngredients = template.possibleIngredients.filter(
        (ing) => !ingredients.includes(ing)
      );

      // Only include recipes that match at least 2 ingredients
      if (matchedIngredients.length < 2) return null;

      return {
        id: Math.random().toString(36).substring(2, 9),
        title: template.title,
        matchedIngredients,
        missingIngredients,
        cookTime: template.cookTime,
        image: template.image,
        servings: template.servings,
        difficulty: template.difficulty,
        calories: template.calories,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        b?.matchedIngredients.length ?? 0 - (a?.matchedIngredients.length ?? 0)
    );
}
