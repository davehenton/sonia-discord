import {
  GuildChannel,
  GuildMember,
  Role,
  User
} from 'discord.js';
import _ from 'lodash';
import { isDiscordMessageMentions } from './functions/is-discord-message-mentions';
import { AnyDiscordMessageMentions } from './types/any-discord-message-mentions';

export class DiscordMention {
  private static _instance: DiscordMention;

  public static getInstance(): DiscordMention {
    if (_.isNil(DiscordMention._instance)) {
      DiscordMention._instance = new DiscordMention();
    }

    return DiscordMention._instance;
  }

  public isValid(mention: unknown): mention is AnyDiscordMessageMentions {
    return isDiscordMessageMentions(mention);
  }

  public isForEveryone(mention: Readonly<AnyDiscordMessageMentions>): boolean {
    return _.isEqual(mention.everyone, true);
  }

  public isUserMentioned(
    mention: Readonly<AnyDiscordMessageMentions>,
    user: User | GuildMember | Role | GuildChannel
  ): boolean {
    return mention.has(user);
  }
}
