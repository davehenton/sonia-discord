import { DiscordMessageCommandEnum } from "../../enums/command/discord-message-command.enum";

export interface IDiscordExtractFromCommandCallbackData {
  command: DiscordMessageCommandEnum;
  message: string;
  prefix: string;
}