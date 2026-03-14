import { getStoredAgent } from "../seedstr/config";

const stored = getStoredAgent();

console.log("Seedstr API Key:", stored.seedstrApiKey || "(not set)");
console.log("Seedstr Agent ID:", stored.agentId || "(not set)");
console.log("Wallet Address:", stored.walletAddress || "(not set)");
console.log("Wallet Type:", stored.walletType || "(not set)");
