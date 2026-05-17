export const ResultEnum = Object.freeze({
  SuccessCode: '10000',
  AuthErrorCode: '30001',
  AuthInvalidCode: '30002',
  AuthAccessExpiredCode: '30003',
  AuthRefreshExpiredCode: '30004',
  InternalServiceErrorCode: '50000',
})

export const SuccessCodeList = Object.freeze([ResultEnum.SuccessCode])

export const RejectEnum = Object.freeze({
  AuthFailed: '10001',
  BizFailed: '10002',
  InternalFailed: '10003',
  Timeout: '10004',
  NetworkError: '10005',
})
