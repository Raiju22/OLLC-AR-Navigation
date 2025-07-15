
import { GenerateLabelForm } from "./generate-label-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function GenerateLabelPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-background p-4 font-body">
      <div className="w-full max-w-md mx-auto">
        <header className="flex justify-center items-center w-full mb-6">
            <h1 className="text-xl font-bold text-foreground font-headline">
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
