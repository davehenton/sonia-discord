import {
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedOptions,
  MessageEmbedThumbnail,
} from "discord.js";
import _ from "lodash";
import moment from "moment-timezone";
import { AbstractService } from "../../../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../../../enums/service-name.enum";
import { getRandomValueFromEnum } from "../../../../../../functions/randoms/get-random-value-from-enum";
import { LoggerService } from "../../../../../logger/services/logger.service";
import { DiscordSoniaService } from "../../../../users/services/discord-sonia.service";
import { DiscordMessageCommandEnum } from "../../../enums/command/discord-message-command.enum";
import { DiscordMessageCommandLunchDescriptionEnum } from "../../../enums/command/lunch/discord-message-command-lunch-description.enum";
import { DiscordMessageCommandLunchTitleEnum } from "../../../enums/command/lunch/discord-message-command-lunch-title.enum";
import { discordHasThisCommand } from "../../../functions/commands/checks/discord-has-this-command";
import { IDiscordMessageResponse } from "../../../interfaces/discord-message-response";
import { IAnyDiscordMessage } from "../../../types/any-discord-message";
import { DiscordMessageConfigService } from "../../config/discord-message-config.service";

export class DiscordMessageCommandLunchService extends AbstractService {
  private static _instance: DiscordMessageCommandLunchService;

  public static getInstance(): DiscordMessageCommandLunchService {
    if (_.isNil(DiscordMessageCommandLunchService._instance)) {
      DiscordMessageCommandLunchService._instance = new DiscordMessageCommandLunchService();
    }

    return DiscordMessageCommandLunchService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_LUNCH_SERVICE);
  }

  public handleResponse({
    id,
  }: Readonly<IAnyDiscordMessage>): Promise<IDiscordMessageResponse> {
    LoggerService.getInstance().debug({
      context: this._serviceName,
      hasExtendedContext: true,
      message: LoggerService.getInstance().getSnowflakeContext(
        id,
        `lunch command detected`
      ),
    });

    return this.getMessageResponse();
  }

  public getMessageResponse(): Promise<IDiscordMessageResponse> {
    return Promise.resolve({
      options: {
        embed: this._getMessageEmbed(),
        split: true,
      },
      response: ``,
    });
  }

  public hasCommand(message: Readonly<string>): boolean {
    return discordHasThisCommand({
      commands: [DiscordMessageCommandEnum.LUNCH, DiscordMessageCommandEnum.L],
      message,
      prefixes: DiscordMessageConfigService.getInstance().getMessageCommandPrefix(),
    });
  }

  private _getMessageEmbed(): MessageEmbedOptions {
    return {
      author: this._getMessageEmbedAuthor(),
      color: this._getMessageEmbedColor(),
      description: this._getMessageDescription(),
      footer: this._getMessageEmbedFooter(),
      thumbnail: this._getMessageEmbedThumbnail(),
      timestamp: this._getMessageEmbedTimestamp(),
      title: this._getMessageEmbedTitle(),
    };
  }

  private _getMessageEmbedAuthor(): MessageEmbedAuthor {
    return DiscordSoniaService.getInstance().getCorporationMessageEmbedAuthor();
  }

  private _getMessageEmbedColor(): number {
    return DiscordMessageConfigService.getInstance().getMessageCommandLunchImageColor();
  }

  private _getMessageDescription(): string {
    return (
      getRandomValueFromEnum(DiscordMessageCommandLunchDescriptionEnum) ||
      `Cool.`
    );
  }

  private _getMessageEmbedFooter(): MessageEmbedFooter {
    const soniaImageUrl:
      | string
      | null = DiscordSoniaService.getInstance().getImageUrl();

    return {
      iconURL: soniaImageUrl || undefined,
      text: `Bon appétit`,
    };
  }

  private _getMessageEmbedThumbnail(): MessageEmbedThumbnail {
    return {
      url: DiscordMessageConfigService.getInstance().getMessageCommandLunchImageUrl(),
    };
  }

  private _getMessageEmbedTimestamp(): Date {
    return moment().toDate();
  }

  private _getMessageEmbedTitle(): string {
    return (
      getRandomValueFromEnum(DiscordMessageCommandLunchTitleEnum) ||
      `Lunch time!`
    );
  }
}
