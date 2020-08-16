import { createMock } from "ts-auto-mock";
import { DiscordMessageCommandEnum } from "../../enums/command/discord-message-command.enum";
import { IDiscordGetCommandRegexp } from "../../interfaces/commands/discord-get-command-regexp";
import { discordGetCommandRegexp } from "./discord-get-command-regexp";
import xregexp from "xregexp";

describe(`discordGetCommandRegexp()`, (): void => {
  let data: IDiscordGetCommandRegexp;
  let message: string;

  beforeEach((): void => {
    data = createMock<IDiscordGetCommandRegexp>();
  });

  describe(`when the given prefix is !`, (): void => {
    beforeEach((): void => {
      data.prefix = `!`;
    });

    describe(`when the given command is help`, (): void => {
      beforeEach((): void => {
        data.command = DiscordMessageCommandEnum.HELP;
      });

      it(`should return a regexp`, (): void => {
        expect.assertions(1);

        const result = discordGetCommandRegexp(data);

        // eslint-disable-next-line no-useless-escape
        expect(result).toStrictEqual(/(\!)(?:)(help)(?:)(?=$|\s)(?:)/gim);
      });

      describe(`when tested with "!help"`, (): void => {
        beforeEach((): void => {
          message = `!help`;
        });

        it(`should find "!" as prefix`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.prefix).toStrictEqual(`!`);
        });

        it(`should find "help" as command`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.command).toStrictEqual(`help`);
        });
      });

      describe(`when tested with "!helpp"`, (): void => {
        beforeEach((): void => {
          message = `!helpp`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "!feature"`, (): void => {
        beforeEach((): void => {
          message = `!feature`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "-help"`, (): void => {
        beforeEach((): void => {
          message = `-help`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });
    });

    describe(`when the given command is cookie`, (): void => {
      beforeEach((): void => {
        data.command = DiscordMessageCommandEnum.COOKIE;
      });

      it(`should return a regexp`, (): void => {
        expect.assertions(1);

        const result = discordGetCommandRegexp(data);

        expect(result).toStrictEqual(
          // eslint-disable-next-line no-useless-escape
          /(\!)(?:)(cookie)(?:)(?=$|\s)(?:)/gim
        );
      });

      describe(`when tested with "!cookie"`, (): void => {
        beforeEach((): void => {
          message = `!cookie`;
        });

        it(`should find "!" as prefix`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.prefix).toStrictEqual(`!`);
        });

        it(`should find "cookie" as command`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.command).toStrictEqual(
            `cookie`
          );
        });
      });

      describe(`when tested with "!cookiee"`, (): void => {
        beforeEach((): void => {
          message = `!cookiee`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "!feature"`, (): void => {
        beforeEach((): void => {
          message = `!feature`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "-cookie"`, (): void => {
        beforeEach((): void => {
          message = `-cookie`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });
    });
  });

  describe(`when the given prefix is -`, (): void => {
    beforeEach((): void => {
      data.prefix = `-`;
    });

    describe(`when the given command is help`, (): void => {
      beforeEach((): void => {
        data.command = DiscordMessageCommandEnum.HELP;
      });

      it(`should return a regexp`, (): void => {
        expect.assertions(1);

        const result = discordGetCommandRegexp(data);

        expect(result).toStrictEqual(
          // eslint-disable-next-line no-useless-escape
          /(\-)(?:)(help)(?:)(?=$|\s)(?:)/gim
        );
      });

      describe(`when tested with "-help"`, (): void => {
        beforeEach((): void => {
          message = `-help`;
        });

        it(`should find "-" as prefix`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.prefix).toStrictEqual(`-`);
        });

        it(`should find "help" as command`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.command).toStrictEqual(`help`);
        });
      });

      describe(`when tested with "-helpp"`, (): void => {
        beforeEach((): void => {
          message = `-helpp`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "-feature"`, (): void => {
        beforeEach((): void => {
          message = `-feature`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "!cookie"`, (): void => {
        beforeEach((): void => {
          message = `!cookie`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });
    });

    describe(`when the given command is cookie`, (): void => {
      beforeEach((): void => {
        data.command = DiscordMessageCommandEnum.COOKIE;
      });

      it(`should return a regexp`, (): void => {
        expect.assertions(1);

        const result = discordGetCommandRegexp(data);

        expect(result).toStrictEqual(
          // eslint-disable-next-line no-useless-escape
          /(\-)(?:)(cookie)(?:)(?=$|\s)(?:)/gim
        );
      });

      describe(`when tested with "-cookie"`, (): void => {
        beforeEach((): void => {
          message = `-cookie`;
        });

        it(`should find "-" as prefix`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.prefix).toStrictEqual(`-`);
        });

        it(`should find "cookie" as command`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)?.command).toStrictEqual(
            `cookie`
          );
        });
      });

      describe(`when tested with "-cookiee"`, (): void => {
        beforeEach((): void => {
          message = `-cookiee`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "-feature"`, (): void => {
        beforeEach((): void => {
          message = `-feature`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });

      describe(`when tested with "!cookie"`, (): void => {
        beforeEach((): void => {
          message = `!cookie`;
        });

        it(`should find nothing`, (): void => {
          expect.assertions(1);

          const result = discordGetCommandRegexp(data);

          expect(xregexp.exec(message, result)).toBeNull();
        });
      });
    });
  });
});