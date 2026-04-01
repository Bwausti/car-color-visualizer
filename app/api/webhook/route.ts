import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`[Webhook] Received: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        `[Webhook] Checkout completed: customer=${session.customer}, email=${session.customer_email}`
      );

      // Add the metered usage price to the subscription
      if (session.subscription && session.customer) {
        try {
          const stripe = getStripe();
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Check if usage price already attached
          const hasUsagePrice = sub.items.data.some(
            (item) => item.price.id === "price_1THTxaEJAWe8oXZ1ZtH47w7n"
          );

          if (!hasUsagePrice) {
            await stripe.subscriptionItems.create({
              subscription: session.subscription as string,
              price: "price_1THTxaEJAWe8oXZ1ZtH47w7n", // metered usage price
            });
            console.log(
              `[Webhook] Added metered usage price to subscription ${session.subscription}`
            );
          }
        } catch (err) {
          console.error("[Webhook] Failed to add usage price:", err);
        }
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[Webhook] Subscription ${event.type}: id=${sub.id}, status=${sub.status}, customer=${sub.customer}`
      );
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[Webhook] Subscription canceled: id=${sub.id}, customer=${sub.customer}`
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
