import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import {
  MAX_ENTERPRISE_AGENTS,
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
  MAX_PRO_AGENTS,
  MAX_PRO_MEETINGS,
  PERIOD_WINDOW_DAYS,
} from "@/modules/premium/constants";
import { and, count, eq, gte, lt } from "drizzle-orm";

export type PlanType = "free" | "monthly" | "yearly" | "enterprise";

type PolarSubscription = {
  createdAt?: string | Date;
  startedAt?: string | Date;
  currentPeriodStart?: string | Date;
  metadata?: Record<string, unknown>;
  productId?: string;
};

type PolarProduct = {
  id?: string;
  name?: string;
  slug?: string;
  metadata?: Record<string, unknown>;
  prices?: Array<{
    recurringInterval?: string;
  }>;
};

export type UsageContext = {
  planType: PlanType;
  maxAgents: number;
  maxMeetings: number | null;
  showMeetingsCounter: boolean;
  agentCount: number;
  meetingCount: number;
};

const toDate = (value?: string | Date) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getSubscriptionStart = (subscription?: PolarSubscription | null) => {
  if (!subscription) return null;
  return (
    toDate(subscription.currentPeriodStart) ??
    toDate(subscription.startedAt) ??
    toDate(subscription.createdAt)
  );
};

const getPlanType = (product: PolarProduct | null): PlanType => {
  if (!product) return "free";

  const metadataPlan = [
    String(product.metadata?.plan ?? ""),
    String(product.metadata?.planType ?? ""),
    String(product.metadata?.tier ?? ""),
  ]
    .join(" ")
    .toLowerCase();

  const recurringInterval = product.prices?.[0]?.recurringInterval?.toLowerCase() ?? "";

  const searchable = [product.name, product.slug, metadataPlan]
    .join(" ")
    .toLowerCase();

  if (searchable.includes("enterprise")) return "enterprise";
  if (recurringInterval === "year" || recurringInterval === "yearly") return "yearly";
  if (recurringInterval === "month" || recurringInterval === "monthly") return "monthly";
  if (searchable.includes("year")) return "yearly";
  if (searchable.includes("month")) return "monthly";

  return "monthly";
};

const getCurrentMeetingWindow = (subscriptionStart: Date, now: Date) => {
  const windowMs = PERIOD_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const elapsed = Math.max(0, now.getTime() - subscriptionStart.getTime());
  const periodIndex = Math.floor(elapsed / windowMs);
  const start = new Date(subscriptionStart.getTime() + periodIndex * windowMs);
  const end = new Date(start.getTime() + windowMs);
  return { start, end };
};

const getMostRecentSubscriptionStart = (customer: Record<string, unknown>) => {
  const allSubscriptions = [
    ...(((customer.activeSubscriptions as PolarSubscription[] | undefined) ?? [])),
    ...(((customer.subscriptions as PolarSubscription[] | undefined) ?? [])),
  ];

  const starts = allSubscriptions
    .map((subscription) => getSubscriptionStart(subscription))
    .filter((date): date is Date => !!date)
    .sort((a, b) => b.getTime() - a.getTime());

  return starts[0] ?? null;
};

const countAgents = async (userId: string) => {
  const [result] = await db
    .select({ count: count(agents.id) })
    .from(agents)
    .where(eq(agents.userId, userId));
  return result.count;
};

const countMeetings = async (userId: string) => {
  const [result] = await db
    .select({ count: count(meetings.id) })
    .from(meetings)
    .where(eq(meetings.userId, userId));
  return result.count;
};

const countAgentsBeforeDate = async (userId: string, date: Date) => {
  const [result] = await db
    .select({ count: count(agents.id) })
    .from(agents)
    .where(and(eq(agents.userId, userId), lt(agents.createdAt, date)));
  return result.count;
};

const countMeetingsBeforeDate = async (userId: string, date: Date) => {
  const [result] = await db
    .select({ count: count(meetings.id) })
    .from(meetings)
    .where(and(eq(meetings.userId, userId), lt(meetings.createdAt, date)));
  return result.count;
};

const countMeetingsInWindow = async (userId: string, start: Date, end: Date) => {
  const [result] = await db
    .select({ count: count(meetings.id) })
    .from(meetings)
    .where(
      and(
        eq(meetings.userId, userId),
        gte(meetings.createdAt, start),
        lt(meetings.createdAt, end),
      ),
    );
  return result.count;
};

export const getUsageContext = async (userId: string): Promise<UsageContext> => {
  const customer = await polarClient.customers.getStateExternal({ externalId: userId });
  const activeSubscription = customer.activeSubscriptions[0] as PolarSubscription | undefined;

  if (activeSubscription) {
    const product = activeSubscription.productId
      ? ((await polarClient.products.get({ id: activeSubscription.productId })) as PolarProduct)
      : null;

    const planType = getPlanType(product);
    const agentCount = await countAgents(userId);

    if (planType === "enterprise") {
      return {
        planType,
        maxAgents: MAX_ENTERPRISE_AGENTS,
        maxMeetings: null,
        showMeetingsCounter: false,
        agentCount,
        meetingCount: 0,
      };
    }

    const subscriptionStart = getSubscriptionStart(activeSubscription) ?? new Date();
    const { start, end } = getCurrentMeetingWindow(subscriptionStart, new Date());
    const meetingCount = await countMeetingsInWindow(userId, start, end);

    return {
      planType,
      maxAgents: MAX_PRO_AGENTS,
      maxMeetings: MAX_PRO_MEETINGS,
      showMeetingsCounter: true,
      agentCount,
      meetingCount,
    };
  }

  const lastSubscriptionStart = getMostRecentSubscriptionStart(customer as unknown as Record<string, unknown>);

  if (lastSubscriptionStart) {
    const [agentCount, meetingCount] = await Promise.all([
      countAgentsBeforeDate(userId, lastSubscriptionStart),
      countMeetingsBeforeDate(userId, lastSubscriptionStart),
    ]);

    return {
      planType: "free",
      maxAgents: MAX_FREE_AGENTS,
      maxMeetings: MAX_FREE_MEETINGS,
      showMeetingsCounter: true,
      agentCount,
      meetingCount,
    };
  }

  const [agentCount, meetingCount] = await Promise.all([countAgents(userId), countMeetings(userId)]);

  return {
    planType: "free",
    maxAgents: MAX_FREE_AGENTS,
    maxMeetings: MAX_FREE_MEETINGS,
    showMeetingsCounter: true,
    agentCount,
    meetingCount,
  };
};

export const isLimitReached = (
  usageContext: UsageContext,
  entity: "meetings" | "agents",
): boolean => {
  if (entity === "agents") {
    return usageContext.agentCount >= usageContext.maxAgents;
  }

  if (!usageContext.showMeetingsCounter || usageContext.maxMeetings === null) {
    return false;
  }

  return usageContext.meetingCount >= usageContext.maxMeetings;
};
