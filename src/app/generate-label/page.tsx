

import { GenerateLabelForm } from "./generate-label-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GenerateLabelPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background p-4 font-body">
      <div className="w-full max-w-md mx-auto">
        <header className="flex justify-start items-center w-full mb-6">
            <Link href="/" passHref>
              <Button variant="ghost" size="icon" aria-label="Home">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground font-headline w-full text-center -ml-10">
                Generate Location Label
            </h1>
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
