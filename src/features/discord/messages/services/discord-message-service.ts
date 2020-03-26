import _ from 'lodash';
import { wrapInQuotes } from '../../../../functions/wrap-in-quotes';
import { ChalkService } from '../../../logger/services/chalk-service';
import { LoggerService } from '../../../logger/services/logger-service';
import { DiscordChannelService } from '../../channels/services/discord-channel-service';
import { DiscordClientService } from '../../services/discord-client-service';
import { DiscordAuthorService } from '../../users/services/discord-author-service';
import { IDiscordMessageResponse } from '../interfaces/discord-message-response';
import { AnyDiscordMessage } from '../types/any-discord-message';
import { DiscordMessageDmService } from './discord-message-dm-service';
import { DiscordMessageErrorService } from './discord-message-error-service';
import { DiscordMessageTextService } from './discord-message-text-service';

export class DiscordMessageService {
  private static _instance: DiscordMessageService;

  public static getInstance(): DiscordMessageService {
    if (_.isNil(DiscordMessageService._instance)) {
      DiscordMessageService._instance = new DiscordMessageService();
    }

    return DiscordMessageService._instance;
  }

  private readonly _loggerService = LoggerService.getInstance();
  private readonly _discordClientServiceClient = DiscordClientService.getInstance().getClient();
  private readonly _discordChannelService = DiscordChannelService.getInstance();
  private readonly _discordMessageDmService = DiscordMessageDmService.getInstance();
  private readonly _discordMessageTextService = DiscordMessageTextService.getInstance();
  private readonly _discordMessageErrorService = DiscordMessageErrorService.getInstance();
  private readonly _discordAuthorService = DiscordAuthorService.getInstance();
  private readonly _chalkService = ChalkService.getInstance();
  private readonly _className = `DiscordMessageService`;

  public constructor() {
    this._init();
  }

  private _init(): void {
    this._listen();
  }

  private _listen(): void {
    this._discordClientServiceClient.on(`message`, (message: Readonly<AnyDiscordMessage>): void => {
      this._handleMessage(message);
    });

    this._loggerService.debug({
      context: this._className,
      message: this._chalkService.text(`listen ${wrapInQuotes(`message`)} event`)
    });
  }

  private _handleMessage(message: Readonly<AnyDiscordMessage>): void {
    this._loggerService.log({
      context: this._className,
      extendedContext: true,
      message: this._loggerService.getSnowflakeContext(message.id, message.content)
    });

    if (this._discordAuthorService.isValid(message.author)) {
      if (this._discordAuthorService.isBot(message.author)) {
        return;
      }
    }

    if (this._discordChannelService.isValid(message.channel)) {
      if (this._discordChannelService.isDm(message.channel)) {
        this._dmMessage(message);
      } else if (this._discordChannelService.isText(message.channel)) {
        this._textMessage(message);
      }
    }
  }

  private _dmMessage(message: Readonly<AnyDiscordMessage>): void {
    this._loggerService.debug({
      context: this._className,
      extendedContext: true,
      message: this._loggerService.getSnowflakeContext(message.id, `dm message`)
    });

    const response: IDiscordMessageResponse | null = this._discordMessageDmService.getMessage(message);

    if (!_.isNil(response)) {
      this._sendMessage(message, response);
    }
  }

  private _textMessage(message: Readonly<AnyDiscordMessage>): void {
    this._loggerService.debug({
      context: this._className,
      extendedContext: true,
      message: this._loggerService.getSnowflakeContext(message.id, `text message`)
    });

    const response: IDiscordMessageResponse | null = this._discordMessageTextService.getMessage(message);

    if (!_.isNil(response)) {
      this._sendMessage(message, response);
    }
  }

  private _sendMessage(
    message: Readonly<AnyDiscordMessage>,
    messageResponse: Readonly<IDiscordMessageResponse>
  ): void {
    this._loggerService.debug({
      context: this._className,
      extendedContext: true,
      message: this._loggerService.getSnowflakeContext(message.id, `sending message...`)
    });

    if (this._discordChannelService.isValid(message.channel)) {
      message.channel.send(messageResponse.response, messageResponse.options).then((): void => {
        this._loggerService.log({
          context: this._className,
          extendedContext: true,
          message: this._loggerService.getSnowflakeContext(message.id, `message sent`)
        });
      }).catch((error: unknown): void => {
        this._discordMessageErrorService.handleError(error, message);
      });
    }
  }
}