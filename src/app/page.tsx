import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container p-2">
      <Avatar>
        <AvatarFallback className="bg-black text-white">ND</AvatarFallback>
      </Avatar>
      <div className="text-3xl font-bold antialiased">
        Bienvenue sur AI-Recipes
      </div>

      <div className="mt-3 space-y-3">
      <Card style={{ backgroundImage: "url('https://cache.marieclaire.fr/data/photo/w1000_ci/1h2/colombo-de-veau.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "darken" }} className="text-white font-bold">
        <CardHeader>
          <CardTitle>Recipe title number 1</CardTitle>
          <CardDescription>Ingredients : toto, titi, tata</CardDescription>
        </CardHeader>
        <CardContent>
        
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-tl from-sky-100 to-sky-400">
        <CardHeader>
          <CardTitle>Recipe title number 2</CardTitle>
          <CardDescription>Ingredients : toto, titi, tata</CardDescription>
        </CardHeader>
        <CardContent>
        
        </CardContent>
      </Card>
      </div>

      <div className="h-screen flex items-center justify-center">
        <Button size={"lg"} className="w-72 h-14 text-xl">
          Nouvelle recette
        </Button>
      </div>
    </main>
  );
}
