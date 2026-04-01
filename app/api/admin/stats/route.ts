import { NextRequest, NextResponse } from "next/server";
import { stripe, PRODUCT_ID } from "@/lib/stripe";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "colorshift2026";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all subscriptions for this product
    const subscriptions = await stripe.subscriptions.list({
      status: "all",
      limit: 100,
      expand: ["data.customer"],
    });

    // Filter to our product
    const ourSubs = subscriptions.data.filter((sub) =>
      sub.items.data.some((item) => item.price.product === PRODUCT_ID)
    );

    // Build subscriber list
    const subscribers = await Promise.all(
      ourSubs.map(async (sub) => {
        const customer = sub.customer as import("stripe").Stripe.Customer;

        // Get usage from meter events (last 30 days)
        let usageCount = 0;
        try {
          const now = Math.floor(Date.now() / 1000);
          const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
          const summary = await stripe.billing.meters.listEventSummaries(
            "mtr_61UQruw7irc0Ut5PW41EJAWe8oXZ1Qd6",
            {
              customer: customer.id,
              start_time: thirtyDaysAgo,
              end_time: now,
            }
          );
          usageCount = summary.data.reduce(
            (sum, s) => sum + s.aggregated_value,
            0
          );
        } catch {
          // meter may not have data yet
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subAny = sub as any;
        const periodStart = subAny.current_period_start ?? sub.created;
        const periodEnd = subAny.current_period_end ?? sub.created;

        return {
          id: customer.id,
          name: customer.name || customer.email || "Unknown",
          email: customer.email || "",
          status: sub.status,
          plan: "$50/mo + usage",
          currentPeriodStart: new Date(periodStart * 1000).toISOString(),
          currentPeriodEnd: new Date(periodEnd * 1000).toISOString(),
          usageThisPeriod: usageCount,
          usageCost: (usageCount * 0.75).toFixed(2),
          created: new Date(sub.created * 1000).toISOString(),
        };
      })
    );

    // Sum up total visualizations from all subscribers
    const totalVisualizations = subscribers.reduce(
      (sum, s) => sum + s.usageThisPeriod,
      0
    );

    const activeSubs = subscribers.filter((s) => s.status === "active").length;
    const mrr = activeSubs * 50;

    return NextResponse.json({
      summary: {
        totalSubscribers: subscribers.length,
        activeSubscribers: activeSubs,
        mrr,
        totalVisualizations,
        totalUsageRevenue: (totalVisualizations * 0.75).toFixed(2),
      },
      subscribers,
    });
  } catch (error: unknown) {
    console.error("Admin stats error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
