import { Client, Collection, GatewayIntentBits } from "discord.js";
import { token } from "./config.json";
import { join } from "path";
import { readdirSync } from "fs";
import { Handler } from "./@types";
import { printError, printInfo, printSucess } from "./utils/printutils";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.slashCommands = new Collection();

let handlers: Handler[] = [];

function loadHandler() {
  const handlersPath = join(__dirname, "./handlers");
  const handlersFiles = readdirSync(handlersPath).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
  );
  for (const file of handlersFiles) {
    const filePath = join(handlersPath, file);
    const handler: Handler = require(filePath);
    if (handler.name != null) {
      handlers.push(handler);
      printSucess(`Loaded the handler ${file}.`);
    } else {
      printError(`Can't load the handler ${file}.`);
    }
  }
  printInfo(`Loaded ${handlers.length} handlers.`);
}

function executeHandler(name?: string) {
  for (const handler of handlers) {
    if (name == undefined) handler.execute(client);
    else if (name == handler.name) handler.execute(client);
  }
}

loadHandler();
executeHandler();

client.login(token);
