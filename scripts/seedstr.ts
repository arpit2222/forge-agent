import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { SeedstrClient } from "../seedstr/seedstr-client";
import {
  getConfig,
  getStoredAgent,
  isRegistered,
  isVerified,
  saveProfile,
  saveRegistration,
  saveVerification,
  validateConfig
} from "../seedstr/config";

const program = new Command();

program
  .name("seedstr")
  .description("Seedstr CLI for ForgeAgent")
  .version("0.1.0");

program
  .command("register")
  .option("--wallet <wallet>")
  .option("--walletType <walletType>")
  .option("--url <url>")
  .action(async (options) => {
    if (isRegistered()) {
      const stored = getStoredAgent();
      console.log(chalk.yellow("\nAgent is already registered"));
      console.log(chalk.gray(`  Agent ID: ${stored.agentId}`));
      console.log(chalk.gray(`  Wallet: ${stored.walletAddress}`));
      const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: "Register a new agent and overwrite local config?",
        initial: false
      });
      if (!confirm) return;
    }

    let walletType: "ETH" | "SOL" = "ETH";
    if (options.walletType === "ETH" || options.walletType === "SOL") {
      walletType = options.walletType;
    } else {
      const response = await prompts({
        type: "select",
        name: "walletType",
        message: "Which wallet type should be used for payments?",
        choices: [
          { title: "ETH (Ethereum)", value: "ETH" },
          { title: "SOL (Solana)", value: "SOL" }
        ],
        initial: 0
      });
      walletType = response.walletType;
    }

    if (!walletType) {
      console.log(chalk.red("Wallet type is required"));
      process.exit(1);
    }

    let walletAddress = options.wallet as string | undefined;
    if (!walletAddress) {
      const config = getConfig();
      walletAddress = config.walletAddress || undefined;
    }

    if (!walletAddress) {
      const addressLabel = walletType === "ETH" ? "Ethereum (0x...)" : "Solana";
      const response = await prompts({
        type: "text",
        name: "wallet",
        message: `Enter your ${addressLabel} wallet address:`,
        validate: (value: string) => {
          if (walletType === "ETH") {
            return /^0x[0-9a-fA-F]{40}$/.test(value)
              ? true
              : "Please enter a valid Ethereum address";
          }
          return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)
            ? true
            : "Please enter a valid Solana address";
        }
      });
      walletAddress = response.wallet;
    }

    if (!walletAddress) {
      console.log(chalk.red("Wallet address is required"));
      process.exit(1);
    }

    let ownerUrl = options.url as string | undefined;
    if (!ownerUrl) {
      const response = await prompts({
        type: "text",
        name: "url",
        message: "Agent homepage URL (optional):"
      });
      ownerUrl = response.url || undefined;
    }

    const spinner = ora("Registering agent...").start();
    try {
      const client = new SeedstrClient();
      const result = await client.register(walletAddress, walletType, ownerUrl);
      spinner.succeed("Agent registered successfully");

      saveRegistration({
        apiKey: result.apiKey,
        agentId: result.agentId,
        walletAddress,
        walletType
      });

      console.log(chalk.green("\nRegistration complete"));
      console.log(chalk.gray(`  Agent ID: ${result.agentId}`));
      console.log(chalk.gray(`  API Key:  ${result.apiKey}`));
      console.log(chalk.gray("\nNext steps:"));
      console.log(chalk.gray("  1. npm run verify"));
      console.log(chalk.gray("  2. npm run profile -- --name \"Your Agent Name\""));
    } catch (error) {
      spinner.fail("Registration failed");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

program
  .command("verify")
  .action(async () => {
    if (!isRegistered()) {
      console.log(chalk.red("\nAgent is not registered"));
      console.log(chalk.gray("Run `npm run register` first"));
      process.exit(1);
    }

    if (isVerified()) {
      console.log(chalk.green("\nAgent is already verified"));
      return;
    }

    const spinner = ora("Fetching verification instructions...").start();
    try {
      const client = new SeedstrClient();
      const agentInfo = await client.getMe();
      spinner.stop();

      if (agentInfo.verification.isVerified) {
        saveVerification(true);
        console.log(chalk.green("Agent is already verified"));
        return;
      }

      const instructions = agentInfo.verification.verificationInstructions;
      const stored = getStoredAgent();
      if (instructions) {
        console.log(chalk.yellow("To verify your agent, follow these steps:\n"));
        console.log(chalk.white(instructions));
      } else {
        const tweetText = `I just joined @seedstrio to earn passive income with my agent. Check them out: https://www.seedstr.io - Agent ID: ${stored.agentId}`;
        console.log(chalk.yellow("Post this tweet from your agent's Twitter account:\n"));
        console.log(chalk.cyan(tweetText));
      }

      await prompts({
        type: "confirm",
        name: "posted",
        message: "Have you posted the verification tweet?",
        initial: true
      });

      const verifySpinner = ora("Checking for verification tweet...").start();
      const result = await client.verify();
      if (result.isVerified) {
        verifySpinner.succeed("Verification successful");
        saveVerification(true);
        console.log(chalk.green("\nAgent verified"));
      } else {
        verifySpinner.fail("Verification failed");
        console.log(chalk.yellow(result.message || "Verification not found"));
      }
    } catch (error) {
      spinner.fail("Verification failed");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

program
  .command("profile")
  .option("--name <name>")
  .option("--bio <bio>")
  .option("--picture <url>")
  .action(async (options) => {
    if (!isRegistered()) {
      console.log(chalk.red("\nAgent is not registered"));
      console.log(chalk.gray("Run `npm run register` first"));
      process.exit(1);
    }

    const client = new SeedstrClient();

    if (!options.name && !options.bio && !options.picture) {
      const spinner = ora("Fetching profile...").start();
      try {
        const agentInfo = await client.getMe();
        spinner.stop();
        console.log(chalk.white("Current Profile:"));
        console.log(chalk.gray(`  Name: ${agentInfo.name || "(not set)"}`));
        console.log(chalk.gray(`  Bio: ${agentInfo.bio || "(not set)"}`));
        console.log(chalk.gray(`  Picture: ${agentInfo.profilePicture || "(default)"}`));

        const { update } = await prompts({
          type: "confirm",
          name: "update",
          message: "Update your profile?",
          initial: false
        });

        if (!update) return;

        const responses = await prompts([
          { type: "text", name: "name", message: "New name (optional):" },
          { type: "text", name: "bio", message: "New bio (optional):" },
          { type: "text", name: "picture", message: "New profile picture URL (optional):" }
        ]);

        options.name = responses.name || undefined;
        options.bio = responses.bio || undefined;
        options.picture = responses.picture || undefined;
      } catch (error) {
        spinner.fail("Failed to fetch profile");
        console.error(chalk.red(String(error)));
        process.exit(1);
      }
    }

    const updateData: { name?: string; bio?: string; profilePicture?: string } = {};
    if (options.name) updateData.name = options.name;
    if (options.bio) updateData.bio = options.bio;
    if (options.picture) updateData.profilePicture = options.picture;

    if (Object.keys(updateData).length === 0) {
      console.log(chalk.gray("No profile changes provided"));
      return;
    }

    const spinner = ora("Updating profile...").start();
    try {
      const result = await client.updateProfile(updateData);
      spinner.succeed("Profile updated");
      saveProfile(updateData);
      console.log(chalk.gray(`Name: ${result.agent.name}`));
    } catch (error) {
      spinner.fail("Profile update failed");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

program
  .command("status")
  .action(async () => {
    console.log(chalk.cyan("\nAgent Status"));

    const config = getConfig();
    const stored = getStoredAgent();
    const configErrors = validateConfig(config);

    console.log(chalk.gray("\nConfiguration"));
    console.log(config.openrouterApiKey ? "  OpenRouter API Key: set" : "  OpenRouter API Key: missing");
    console.log(config.walletAddress ? "  Wallet Address: set" : "  Wallet Address: missing");

    if (!isRegistered()) {
      console.log(chalk.red("\nNot registered"));
      if (configErrors.length) {
        console.log(chalk.yellow("Issues:"));
        for (const issue of configErrors) console.log(`  - ${issue}`);
      }
      return;
    }

    console.log(chalk.green("\nRegistered"));
    console.log(chalk.gray(`  Agent ID: ${stored.agentId}`));

    const spinner = ora("Checking verification status...").start();
    try {
      const client = new SeedstrClient();
      const agentInfo = await client.getMe();
      spinner.stop();
      console.log(agentInfo.verification.isVerified ? "  Verified: yes" : "  Verified: no");
    } catch (error) {
      spinner.fail("Failed to fetch status");
      console.error(chalk.red(String(error)));
    }
  });

program.parse();
