import { DiscordMessageDmService } from './discord-message-dm.service';
import { DiscordMessageTextService } from './discord-message-text.service';
import { ServiceNameEnum } from '../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../core/services/core-event.service';
import { ILoggerLog } from '../../../../logger/interfaces/logger-log';
import { IAnyDiscordMessage } from '../../types/any-discord-message';
import { createMock } from 'ts-auto-mock';

jest.mock(`../../../../logger/services/chalk/chalk.service`);

describe(`DiscordMessageTextService`, (): void => {
  let service: DiscordMessageTextService;
  let coreEventService: CoreEventService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageText service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageTextService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageTextService));
    });

    it(`should return the created DiscordMessageText service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageTextService.getInstance();

      expect(result).toStrictEqual(service);
    });
  });

  describe(`constructor()`, (): void => {
    let coreEventServiceNotifyServiceCreatedSpy: jest.SpyInstance;

    beforeEach((): void => {
      coreEventServiceNotifyServiceCreatedSpy = jest
        .spyOn(coreEventService, `notifyServiceCreated`)
        .mockImplementation();
    });

    it(`should notify the DiscordMessageText service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageTextService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_TEXT_SERVICE
      );
    });
  });

  describe(`getMessage()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;

    let discordAuthorServiceIsValidSpy: jest.SpyInstance;
    let getMessageResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageDmService();
      anyDiscordMessage = createMock<IAnyDiscordMessage>({
        author: {
          id: `dummy-author-id`,
        },
      });

      discordAuthorServiceIsValidSpy = jest.spyOn(discordAuthorService, `isValid`).mockImplementation();
      getMessageResponseSpy = jest
        .spyOn(service, `getMessageResponse`)
        .mockRejectedValue(new Error(`getMessageResponse error`));
    });

    it(`should check if the author of the message is valid`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.getMessage(anyDiscordMessage)).rejects.toThrow(new Error(`Invalid author`));

      expect(discordAuthorServiceIsValidSpy).toHaveBeenCalledTimes(1);
      expect(discordAuthorServiceIsValidSpy).toHaveBeenCalledWith(anyDiscordMessage.author);
    });

    describe(`when the author of the message is not valid`, (): void => {
      beforeEach((): void => {
        discordAuthorServiceIsValidSpy.mockReturnValue(false);
      });

      it(`should throw an error`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(service.getMessage(anyDiscordMessage)).rejects.toThrow(new Error(`Invalid author`));
      });
    });

    describe(`when the author of the message is valid`, (): void => {
      beforeEach((): void => {
        discordAuthorServiceIsValidSpy.mockReturnValue(true);
      });

      it(`should get a message response`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.getMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessageResponse error`));

        expect(getMessageResponseSpy).toHaveBeenCalledTimes(1);
        expect(getMessageResponseSpy).toHaveBeenCalledWith(anyDiscordMessage);
      });
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;

    let discordMessageContentServiceHasContentSpy: jest.SpyInstance;
    let discordMessageAuthorServiceReplySpy: jest.SpyInstance;
    let discordMessageCommandServiceHasCommandSpy: jest.SpyInstance;
    let discordMessageCommandServiceHandleCommandsSpy: jest.SpyInstance;
    let loggerServiceDebugSpy: jest.SpyInstance;
    let discordMessagePingPongServiceHasCriteriaSpy: jest.SpyInstance;
    let discordMessagePingPongServiceReplySpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageDmService();
      anyDiscordMessage = createMock<IAnyDiscordMessage>({
        content: `dummy-content`,
        id: `dummy-id`,
      });

      discordMessageContentServiceHasContentSpy = jest
        .spyOn(discordMessageContentService, `hasContent`)
        .mockImplementation();
      discordMessageAuthorServiceReplySpy = jest
        .spyOn(discordMessageAuthorService, `reply`)
        .mockRejectedValue(new Error(`reply error`));
      discordMessageCommandServiceHasCommandSpy = jest
        .spyOn(discordMessageCommandService, `hasCommand`)
        .mockImplementation();
      discordMessageCommandServiceHandleCommandsSpy = jest
        .spyOn(discordMessageCommandService, `handleCommands`)
        .mockRejectedValue(new Error(`handleCommands error`));
      loggerServiceDebugSpy = jest.spyOn(loggerService, `debug`).mockImplementation();
      discordMessagePingPongServiceHasCriteriaSpy = jest
        .spyOn(discordMessagePingPongService, `hasCriteria`)
        .mockImplementation();
      discordMessagePingPongServiceReplySpy = jest
        .spyOn(discordMessagePingPongService, `reply`)
        .mockRejectedValue(new Error(`ping pong reply error`));
    });

    it(`should check if the given Discord message is empty`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(new Error(`reply error`));

      expect(discordMessageContentServiceHasContentSpy).toHaveBeenCalledTimes(1);
      expect(discordMessageContentServiceHasContentSpy).toHaveBeenCalledWith(anyDiscordMessage.content);
    });

    describe(`when the given Discord message is empty`, (): void => {
      beforeEach((): void => {
        discordMessageContentServiceHasContentSpy.mockReturnValue(false);
      });

      it(`should respond with the default replay`, async (): Promise<void> => {
        expect.assertions(5);

        await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(new Error(`reply error`));

        expect(discordMessageAuthorServiceReplySpy).toHaveBeenCalledTimes(1);
        expect(discordMessageAuthorServiceReplySpy).toHaveBeenCalledWith(anyDiscordMessage);
        expect(discordMessageCommandServiceHandleCommandsSpy).not.toHaveBeenCalled();
        expect(discordMessagePingPongServiceReplySpy).not.toHaveBeenCalled();
      });
    });

    describe(`when the given Discord message is not empty`, (): void => {
      beforeEach((): void => {
        discordMessageContentServiceHasContentSpy.mockReturnValue(true);
      });

      it(`should check if the given Discord message contains a command`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(new Error(`reply error`));

        expect(discordMessageCommandServiceHasCommandSpy).toHaveBeenCalledTimes(1);
        expect(discordMessageCommandServiceHasCommandSpy).toHaveBeenCalledWith(anyDiscordMessage.content);
      });

      describe(`when the given Discord message do not contains a command`, (): void => {
        beforeEach((): void => {
          discordMessageCommandServiceHasCommandSpy.mockReturnValue(false);
        });

        it(`should check if the given Discord message contains the criteria for a ping pong response`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(new Error(`reply error`));

          expect(discordMessagePingPongServiceHasCriteriaSpy).toHaveBeenCalledTimes(1);
          expect(discordMessagePingPongServiceHasCriteriaSpy).toHaveBeenCalledWith(anyDiscordMessage.content);
        });

        describe(`when the given Discord message do not contains the criteria for a ping pong response`, (): void => {
          beforeEach((): void => {
            discordMessagePingPongServiceHasCriteriaSpy.mockReturnValue(false);
          });

          it(`should respond with the default replay`, async (): Promise<void> => {
            expect.assertions(5);

            await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(new Error(`reply error`));

            expect(discordMessageAuthorServiceReplySpy).toHaveBeenCalledTimes(1);
            expect(discordMessageAuthorServiceReplySpy).toHaveBeenCalledWith(anyDiscordMessage);
            expect(discordMessageCommandServiceHandleCommandsSpy).not.toHaveBeenCalled();
            expect(discordMessagePingPongServiceReplySpy).not.toHaveBeenCalled();
          });
        });

        describe(`when the given Discord message contains the criteria for a ping pong response`, (): void => {
          beforeEach((): void => {
            discordMessagePingPongServiceHasCriteriaSpy.mockReturnValue(true);
          });

          it(`should log about responding to ping`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(
              new Error(`ping pong reply error`)
            );

            expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
            expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
              context: `DiscordMessageDmService`,
              hasExtendedContext: true,
              message: `context-[dummy-id] text-message ping pong`,
            } as ILoggerLog);
          });

          it(`should respond with pong`, async (): Promise<void> => {
            expect.assertions(5);

            await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(
              new Error(`ping pong reply error`)
            );

            expect(discordMessagePingPongServiceReplySpy).toHaveBeenCalledTimes(1);
            expect(discordMessagePingPongServiceReplySpy).toHaveBeenCalledWith(anyDiscordMessage);
            expect(discordMessageCommandServiceHandleCommandsSpy).not.toHaveBeenCalled();
            expect(discordMessageAuthorServiceReplySpy).not.toHaveBeenCalled();
          });
        });
      });

      describe(`when the given Discord message contains a command`, (): void => {
        beforeEach((): void => {
          discordMessageCommandServiceHasCommandSpy.mockReturnValue(true);
        });

        it(`should log about handling the commands`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(
            new Error(`handleCommands error`)
          );

          expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
          expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
            context: `DiscordMessageDmService`,
            hasExtendedContext: true,
            message: `context-[dummy-id] text-message with command`,
          } as ILoggerLog);
        });

        it(`should respond with the appropriate message for the command`, async (): Promise<void> => {
          expect.assertions(5);

          await expect(service.getMessageResponse(anyDiscordMessage)).rejects.toThrow(
            new Error(`handleCommands error`)
          );

          expect(discordMessageCommandServiceHandleCommandsSpy).toHaveBeenCalledTimes(1);
          expect(discordMessageCommandServiceHandleCommandsSpy).toHaveBeenCalledWith(anyDiscordMessage);
          expect(discordMessagePingPongServiceReplySpy).not.toHaveBeenCalled();
          expect(discordMessageAuthorServiceReplySpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
