import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { saveResult } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, targetColor } = body as {
      image: string;
      targetColor: string;
    };

    if (!image || !targetColor) {
      return NextResponse.json(
        { error: "Missing required fields: image and targetColor" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Strip data URL prefix if present
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `Change only the exterior paint color of this vehicle to ${targetColor}. Keep absolutely everything else exactly the same — same car model, same angle, same background scenery, same wheels and tires, same trim, same glass, same interior, same lighting, same shadows, same reflections. Only the body paint color should change to ${targetColor}. Do not alter the composition, perspective, or any other element of the image.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Extract image from response
    let resultImageBase64: string | null = null;

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            resultImageBase64 = part.inlineData.data;
            break;
          }
        }
      }
    }

    if (!resultImageBase64) {
      return NextResponse.json(
        {
          error:
            "No image returned from AI. The model may not support image editing for this input.",
        },
        { status: 500 }
      );
    }

    // Save result for sharing
    const id = uuidv4();
    const resultData = {
      id,
      originalImage: base64Data,
      resultImage: resultImageBase64,
      targetColor,
      createdAt: new Date().toISOString(),
    };

    saveResult(resultData);

    // Report usage to Stripe meter (fire-and-forget)
    try {
      const { getStripe, METER_EVENT_NAME, PRODUCT_ID } = await import("@/lib/stripe");
      const stripe = getStripe();

      // Find the first active subscriber to bill usage against
      const subs = await stripe.subscriptions.list({ status: "active", limit: 10 });
      const activeSub = subs.data.find((s) =>
        s.items.data.some((item) => item.price.product === PRODUCT_ID)
      );

      if (activeSub) {
        const customerId = typeof activeSub.customer === "string"
          ? activeSub.customer
          : activeSub.customer.id;

        await stripe.billing.meterEvents.create({
          event_name: METER_EVENT_NAME,
          payload: {
            value: "1",
            stripe_customer_id: customerId,
          },
        });
        console.log(`[Usage] Reported 1 visualization for customer ${customerId}`);
      } else {
        console.warn("[Usage] No active subscriber found — visualization not billed");
      }
    } catch (meterErr) {
      console.warn("Stripe meter report failed (non-blocking):", meterErr);
    }

    return NextResponse.json({
      success: true,
      resultImage: resultImageBase64,
      resultId: id,
    });
  } catch (error: unknown) {
    console.error("Visualize API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
