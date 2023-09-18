export type UDLOptions = {
  useUdl: boolean
  useDerivationCredit?: boolean
  useDerivationIndication?: boolean
  useDerivationPassthrough?: boolean
  useDerivationRevenueShare?: boolean
  commercialUse?: boolean
  commercialUseWithCredit?: boolean
  monthlyLicenseFee?: boolean
  monthlyFeeNumber?: number
  oneTimeLicenseFee?: boolean
  oneTimeFeeNumber?: number
  currency?: string
  licenseDuration?: boolean
  paymentAddress?: boolean
  paymentModeRandom?: boolean
  paymentModeGlobal?: boolean
}
