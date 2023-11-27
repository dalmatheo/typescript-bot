import { Events, Client, ChatInputCommandInteraction } from "discord.js";
import { Event } from "../@types";
import { printError, printInfo } from "../utils/printutils";

const event: Event = {
  name: Events.InteractionCreate,
  once: true,
  async execute(client: Client<true>, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.slashCommands.get(interaction.commandName);

    if (!command) {
      printError(`No command matching the name ${interaction.commandName}.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      printError(`Error executing ${interaction.commandName}`);
      printError(error);
    }
  },
};

module.exports = event;
