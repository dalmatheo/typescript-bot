import { Client } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import { printInfo, printError, printSucess } from "../utils/printutils";
import { Event, Handler } from "../@types";

const handler: Handler = {
  name: "EventHandlers",
  execute(client: Client<true>) {
    const eventsPath = join(__dirname, "../events");
    const eventFiles = readdirSync(eventsPath).filter(
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );
    let events: Event[] = [];
    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event: Event = require(filePath);
      if ("name" in event && "execute" in event) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
          client.on(event.name, (...args) => event.execute(client, ...args));
        }
        events.push(event);
        printSucess(`Loaded the event ${file}.`);
      } else {
        printError(`Can't load the event ${file}.`);
      }
    }
    printInfo(`Loaded ${events.length} events.`);
  },
};

module.exports = handler;
