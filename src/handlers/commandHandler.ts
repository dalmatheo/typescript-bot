import { Client, REST, Routes } from "discord.js";
import { Handler } from "../@types";
import { join } from "path";
import { readdirSync } from "fs";
import { token, client_id } from "../config.json";
import { printError, printInfo, printSucess } from "../utils/printutils";

const handler: Handler = {
  name: "CommandHandler",
  execute(client: Client<true>) {
    const foldersPath = join(__dirname, "../commands");
    const commandFolders = readdirSync(foldersPath);

    const slashCommands = [];

    for (const folder of commandFolders) {
      const commandsPath = join(foldersPath, folder);
      const commandFiles = readdirSync(commandsPath).filter(
        (file) => file.endsWith(".js") || file.endsWith(".ts")
      );
      for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          printSucess(`Loaded the command ${file}.`);
          slashCommands.push(command.data.toJSON());
          client.slashCommands.set(command.data.name, command);
        } else {
          printError(`Can't load the command ${file}.`);
        }
      }
      printInfo(`Loaded ${slashCommands.length} commands.`);
    }

    const rest = new REST().setToken(token);

    // and deploy your commands!
    (async () => {
      try {
        printInfo(`Trying to refresh ${slashCommands.length} slashCommands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(Routes.applicationCommands(client_id), {
          body: slashCommands,
        });

        printSucess(`Loaded ${data.length} slashCommands.`);
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        printError(error);
      }
    })();
  },
};
module.exports = handler;
