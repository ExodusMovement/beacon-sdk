import {
  PermissionResponse,
  PermissionRequest,
  OperationRequest,
  OperationResponse,
  SignPayloadRequest,
  SignPayloadResponse,
  // EncryptPayloadRequest,
  // EncryptPayloadResponse,
  BroadcastRequest,
  BroadcastResponse,
  AcknowledgeResponse,
  DisconnectMessage,
  ErrorResponse
} from '@exodus/airgap-beacon-types'

/**
 * @internalapi
 */
export type BeaconMessage =
  | PermissionRequest
  | PermissionResponse
  | OperationRequest
  | OperationResponse
  | SignPayloadRequest
  | SignPayloadResponse
  // | EncryptPayloadRequest
  // | EncryptPayloadResponse
  | BroadcastRequest
  | BroadcastResponse
  | AcknowledgeResponse
  | DisconnectMessage
  | ErrorResponse
