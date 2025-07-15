import { GenerateLabelForm } from "./generate-label-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function GenerateLabelPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background p-4 font-body">
      <div className="w-full max-w-md mx-auto">
        <header className="flex justify-between items-center w-full mb-6">
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" aria-label="Back to home">
                    <ChevronLeft className="w-6 h-6" />
                </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground font-headline">
                Generate Location Label
            </h1>
            <div className="w-8"></div>
        </header>

        <Card className="w-full shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="font-headline">AI Label Generator</CardTitle>
                <CardDescription>
                Create concise and distinct labels for campus locations using AI.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GenerateLabelForm />
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
