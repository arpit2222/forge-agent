import { getConfig } from "./config";

export type RegisterResponse = { apiKey: string; agentId: string };
export type VerifyResponse = { isVerified: boolean; ownerTwitter?: string; message?: string };
export type AgentInfo = {
  agentId: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  reputation: number;
  jobsCompleted: number;
  jobsDeclined: number;
  totalEarnings: number;
  verification: {
    isVerified: boolean;
    ownerTwitter?: string;
    verificationInstructions?: string;
  };
};
export type UpdateProfileResponse = { agent: AgentInfo };

export class SeedstrClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey?: string, baseUrl?: string) {
    const config = getConfig();
    this.apiKey = apiKey ?? config.seedstrApiKey ?? "";
    this.baseUrl = baseUrl ?? config.seedstrApiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      ...(options.headers as Record<string, string>)
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      const message = (data && data.message) || `API request failed: ${response.status}`;
      throw new Error(message);
    }

    return data as T;
  }

  async register(walletAddress: string, walletType: "ETH" | "SOL", ownerUrl?: string) {
    return this.request<RegisterResponse>("/register", {
      method: "POST",
      body: JSON.stringify({ walletAddress, walletType, ownerUrl })
    });
  }

  async getMe() {
    return this.request<AgentInfo>("/me");
  }

  async updateProfile(data: { name?: string; bio?: string; profilePicture?: string }) {
    return this.request<UpdateProfileResponse>("/me", {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  }

  async verify() {
    return this.request<VerifyResponse>("/verify", { method: "POST" });
  }
}
