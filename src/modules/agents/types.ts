import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import App from "next/app";



export type AgentsGetMany=inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"]
export type AgentGetOne=inferRouterOutputs<AppRouter>["agents"]["getOne"]
