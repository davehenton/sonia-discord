import _ from 'lodash';
import { Client } from 'src/features/discord/discord-service.js';
import { chalkText } from '../logger/chalk';
import { LoggerService } from '../logger/logger-service';

export class DiscordClientService {
  private static _instance: DiscordClientService;

  public static getInstance(): DiscordClientService {
    if (_.isNil(DiscordClientService._instance)) {
      DiscordClientService._instance = new DiscordClientService();
    }

    return DiscordClientService._instance;
  }

  private readonly _loggerService = LoggerService.getInstance();
  private readonly _client = new Client();
  private readonly _className = 'DiscordClientService';

  public constructor() {
    this._loggerService.debug(this._className, chalkText(`client created`));
  }

  public getClient(): Client {
    return this._client;
  }
}

