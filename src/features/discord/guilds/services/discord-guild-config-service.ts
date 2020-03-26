import _ from 'lodash';
import { wrapInQuotes } from '../../../../functions/wrap-in-quotes';
import { PartialNested } from '../../../../types/partial-nested';
import { ChalkService } from '../../../logger/services/chalk-service';
import { LoggerService } from '../../../logger/services/logger-service';
import { IDiscordConfig } from '../../interfaces/discord-config';
import { IDiscordGuildConfig } from '../../interfaces/discord-guild-config';
import { DISCORD_GUILD_CONFIG } from '../constants/discord-guild-config';

export class DiscordGuildConfigService {
  private static _instance: DiscordGuildConfigService;

  public static getInstance(config?: Readonly<PartialNested<IDiscordConfig>>): DiscordGuildConfigService {
    if (_.isNil(DiscordGuildConfigService._instance)) {
      DiscordGuildConfigService._instance = new DiscordGuildConfigService(config);
    }

    return DiscordGuildConfigService._instance;
  }

  private readonly _loggerService = LoggerService.getInstance();
  private readonly _chalkService = ChalkService.getInstance();
  private readonly _className = `DiscordGuildConfigService`;

  public constructor(config?: Readonly<PartialNested<IDiscordConfig>>) {
    this.updateConfig(config);
  }

  public updateConfig(config?: Readonly<PartialNested<IDiscordConfig>>): void {
    if (!_.isNil(config)) {
      this.updateGuild(config.guild);

      this._loggerService.debug({
        context: this._className,
        message: this._chalkService.text(`configuration updated`)
      });
    }
  }

  public getGuild(): IDiscordGuildConfig {
    return DISCORD_GUILD_CONFIG;
  }

  public updateGuild(guild?: Readonly<PartialNested<IDiscordGuildConfig>>): void {
    if (!_.isNil(guild)) {
      this.updateWelcomeNewMembersState(guild.shouldWelcomeNewMembers);
    }
  }

  public shouldWelcomeNewMembers(): boolean {
    return DISCORD_GUILD_CONFIG.shouldWelcomeNewMembers;
  }

  public updateWelcomeNewMembersState(welcomeNewMembers?: Readonly<boolean>): void {
    if (_.isBoolean(welcomeNewMembers)) {
      DISCORD_GUILD_CONFIG.shouldWelcomeNewMembers = welcomeNewMembers;

      this._loggerService.log({
        context: this._className,
        message: this._chalkService.text(`welcome new members state updated to: ${this._chalkService.value(DISCORD_GUILD_CONFIG.shouldWelcomeNewMembers)}`)
      });
    }
  }

  public getSoniaPermanentGuildInviteUrl(): string {
    return DISCORD_GUILD_CONFIG.soniaPermanentGuildInviteUrl;
  }

  public updateSoniaPermanentGuildInviteUrl(soniaPermanentGuildInviteUrl?: Readonly<string>): void {
    if (_.isString(soniaPermanentGuildInviteUrl)) {
      DISCORD_GUILD_CONFIG.soniaPermanentGuildInviteUrl = soniaPermanentGuildInviteUrl;

      this._loggerService.log({
        context: this._className,
        message: this._chalkService.text(`sonia permanent guild invite url updated to: ${this._chalkService.value(wrapInQuotes(DISCORD_GUILD_CONFIG.soniaPermanentGuildInviteUrl))}`)
      });
    }
  }
}