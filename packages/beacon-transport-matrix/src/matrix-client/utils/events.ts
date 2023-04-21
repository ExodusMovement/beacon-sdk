import { MatrixStateEvent, MatrixStateEventMessageText } from '../models/MatrixStateEvent'
import { MatrixMessageType } from '../models/MatrixMessage'

/**
 * Check if an event is a create event
 *
 * @param event MatrixStateEvent
 */
export const isCreateEvent = (event: MatrixStateEvent): boolean =>
  event.type === 'm.room.create' && !!event.content && typeof event.content === 'object' && 'creator' in event.content

/**
 * Check if an event is a join event
 *
 * @param event MatrixStateEvent
 */
export const isJoinEvent = (event: MatrixStateEvent): boolean =>
  event.type === 'm.room.member' &&
  !!event.content &&
  typeof event.content === 'object' &&
  'membership' in event.content &&
  // eslint-disable-next-line dot-notation
  (event.content as any)['membership'] === 'join'

/**
 * Check if an event is a message event
 *
 * @param event MatrixStateEvent
 */
export const isMessageEvent = (event: MatrixStateEvent): boolean => event.type === 'm.room.message'

/**
 * Check if an event is a text message event
 *
 * @param event MatrixStateEvent
 */
export const isTextMessageEvent = (event: MatrixStateEvent): event is MatrixStateEventMessageText =>
  isMessageEvent(event) &&
  !!event.content &&
  typeof event.content === 'object' &&
  'msgtype' in event.content &&
  // eslint-disable-next-line dot-notation
  (event.content as any)['msgtype'] === MatrixMessageType.TEXT
