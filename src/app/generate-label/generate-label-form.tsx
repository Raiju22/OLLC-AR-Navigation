
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleLabelGeneration } from "./actions";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  buildingName: z.string().min(1, "Building name is required."),
  floorNumber: z.coerce.number().int("Floor number must be an integer."),
  roomDescription: z.string().min(1, "Room description is required."),
});

type FormData = z.infer<typeof formSchema>;

export function GenerateLabelForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLabel, setGeneratedLabel] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingName: "",
      floorNumber: 1,
      roomDescription: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setGeneratedLabel(null);
    try {
      const result = await handleLabelGeneration(data);
      if (result.success && result.label) {
        setGeneratedLabel(result.label);
        toast({
            title: "Label Generated!",
            description: "A new label has been created successfully.",
        });
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: errorMessage,
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="buildingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SHS Building" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floorNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor Number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., The main office on the first floor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full rounded-full h-12 text-base">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Label
        </Button>
      </form>
      {generatedLabel && (
        <Card className="mt-6 bg-accent/50">
            <CardHeader>
                <CardTitle className="text-accent-foreground text-lg">Generated Label</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xl font-semibold text-accent-foreground">{generatedLabel}</p>
            </CardContent>
        </Card>
      )}
    </Form>
  );
}
