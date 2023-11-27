import { Events, Client } from "discord.js";
import { Event } from "../@types";
import { printInfo } from "../utils/printutils";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client<true>) {
    printInfo(`Ready! Logged in as ${client.user.tag}`);
  },
};

module.exports = event;
