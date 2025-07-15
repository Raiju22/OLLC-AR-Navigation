"use server";

import { generateLocationLabels, GenerateLocationLabelsInput } from "@/ai/flows/generate-location-labels";
import { z } from "zod";

const formSchema = z.object({
  buildingName: z.string(),
  floorNumber: z.number(),
  roomDescription: z.string(),
});

type FormState = {
    success: boolean;
    label?: string;
    error?: string;
}

export async function handleLabelGeneration(
  data: GenerateLocationLabelsInput
): Promise<FormState> {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: "Invalid input data." };
  }

  try {
    const result = await generateLocationLabels(validation.data);
    return { success: true, label: result.locationLabel };
  } catch (error) {
    console.error("Error generating label:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during label generation.",
    };
  }
}
