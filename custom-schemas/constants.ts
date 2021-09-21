export enum Frequency {
  Marketing = 'marketing',
  Monthly = 'monthly',
  OneTime = 'one-time',
  Yearly = 'yearly',
}

export enum MemberType {
  Yearly = 'subscribe_yearly',
  Monthly = 'subscribe_monthly',
  OneTime = 'subscribe_one_time',
  Marketing = 'marketing',
  None = 'none',
}

export enum PeriodInterval {
  OneTime = 10,
  Yearly = 365,
  Monthly = 30,
  DelayBufferInSecs = 3 * 24 * 60 * 60 * 1000, // 3 days in ms
  DelayBufferInDays = 3
}

export enum Status {
  Stopped = 'stopped',
  Fail = 'fail',
  Paid = 'paid',
  Paying = 'paying',
  Invalid = 'invalid',
}

export enum NewebpayStatus {
  Success = 'SUCCESS',
}
