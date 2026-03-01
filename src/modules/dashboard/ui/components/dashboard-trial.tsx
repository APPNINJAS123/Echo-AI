import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

const planTitleMap: Record<string, string> = {
  free: "Free Plan",
  monthly: "Monthly Plan",
  yearly: "Yearly Plan",
  enterprise: "Enterprise Plan",
};

export const DashboardTrial = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

  if (!data) {
    return null;
  }

  const planTitle = planTitleMap[data.planType] ?? "Current Plan";
  const agentProgress = (data.agentCount / data.maxAgents) * 100;

  return (
    <div className="border border-border/10 rounded-lg w-full bg-white/5 flex flex-col gap-y-2">
      <div className="p-3 flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <RocketIcon className="size-4" />
          <p className="text-sm font-medium">{planTitle}</p>
        </div>

        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            {data.agentCount}/{data.maxAgents} Agents
          </p>
          <Progress value={agentProgress} />
        </div>

        {data.showMeetingsCounter && data.maxMeetings !== null && (
          <div className="flex flex-col gap-y-2">
            <p className="text-xs">
              {data.meetingCount}/{data.maxMeetings} Meetings
            </p>
            <Progress value={(data.meetingCount / data.maxMeetings) * 100} />
          </div>
        )}
      </div>

      <Button
        asChild
        className="bg-transparent border-t border-border/10 hover:bg-white/10 rounded-t-none"
      >
        <Link href="/upgrade">Upgrade</Link>
      </Button>
    </div>
  );
};
