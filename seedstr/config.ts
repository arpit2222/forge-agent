import { config as dotenvConfig } from "dotenv";
import path from "path";
import Conf from "conf";

export type WalletType = "ETH" | "SOL";

export type AgentConfig = {
  openrouterApiKey: string;
  seedstrApiKey: string;
  walletAddress: string;
  walletType: WalletType;
  seedstrApiUrl: string;
};

export type StoredConfig = {
  seedstrApiKey?: string;
  agentId?: string;
  walletAddress?: string;
  walletType?: WalletType;
  isVerified?: boolean;
  name?: string;
  bio?: string;
  profilePicture?: string;
};

dotenvConfig({ path: path.resolve(process.cwd(), ".env") });

export const configStore = new Conf<StoredConfig>({
  projectName: "forge-agent",
  projectVersion: "0.1.0",
  schema: {
    seedstrApiKey: { type: "string" },
    agentId: { type: "string" },
    walletAddress: { type: "string" },
    walletType: { type: "string" },
    isVerified: { type: "boolean" },
    name: { type: "string" },
    bio: { type: "string" },
    profilePicture: { type: "string" }
  }
});

export function getConfig(): AgentConfig {
  const stored = configStore.store;
  return {
    openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
    seedstrApiKey: process.env.SEEDSTR_API_KEY || stored.seedstrApiKey || "",
    walletAddress: process.env.WALLET_ADDRESS || stored.walletAddress || "",
    walletType: (process.env.WALLET_TYPE as WalletType) || stored.walletType || "ETH",
    seedstrApiUrl: process.env.SEEDSTR_API_URL || "https://www.seedstr.io/api/v1"
  };
}

export function validateConfig(config: AgentConfig): string[] {
  const errors: string[] = [];
  if (!config.openrouterApiKey) errors.push("OPENROUTER_API_KEY is required");
  if (!config.walletAddress) errors.push("WALLET_ADDRESS is required");
  return errors;
}

export function isRegistered(): boolean {
  return !!configStore.get("seedstrApiKey");
}

export function isVerified(): boolean {
  return configStore.get("isVerified") === true;
}

export function saveRegistration(data: {
  apiKey: string;
  agentId: string;
  walletAddress: string;
  walletType: WalletType;
}) {
  configStore.set("seedstrApiKey", data.apiKey);
  configStore.set("agentId", data.agentId);
  configStore.set("walletAddress", data.walletAddress);
  configStore.set("walletType", data.walletType);
}

export function saveVerification(verified: boolean) {
  configStore.set("isVerified", verified);
}

export function saveProfile(data: {
  name?: string;
  bio?: string;
  profilePicture?: string;
}) {
  if (data.name) configStore.set("name", data.name);
  if (data.bio) configStore.set("bio", data.bio);
  if (data.profilePicture) configStore.set("profilePicture", data.profilePicture);
}

export function getStoredAgent(): StoredConfig {
  return configStore.store;
}
