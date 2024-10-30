// @ts-nocheck
export enum USER_ROLE_ENUM {
  ibo = 'IBO_OWNER',
  tc = 'TC_OWNER',
}

export enum STATUS_ENUM {
  all = 'ALL',
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  available = 'AVAILABLE',
  outOfStock = 'OUT_OF_STOCK',
  unpaid = 'UNPAID',
  waitingConfirmation = 'WAITING_CONFIRMATION',
  paid = 'PAID',
  partialPaid = 'PARTIAL_PAID',
  damaged = 'DAMAGED',
  taken = 'TAKEN',
  redeemed = 'REDEMEED',
  expired = 'EXPIRED ',
  accepted = 'ACCEPTED',
  rejected = 'REJECTED',
  pending = 'PENDING',
  approved = 'APPROVED',
  complete = 'COMPLETE',
  sold = 'SOLD',
  receivedByTC = 'RECEIVED_BY_TC',
}

export enum DATETIME_FORMATTER_ENUM {
  primary = 'DD MMMM YYYY',
  primaryWithTime = 'DD MMMM YYYY HH:mm',
  time = 'HH:mm',
  payloadPrimary = 'YYYY-MM-DD',
}

export enum TEACHER_STATUS_ENUM {
  all = 'ALL',
  active = 'ACTIVE',
  inactive = 'INACTIVE',
  resign = 'RESIGN',
}

export enum DAYS_OF_WEEK_NAME_ENUM {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum ANT_STEP_STATUS_ENUM {
  process = 'process',
  wait = 'wait',
  finish = 'finish',
  error = 'error',
}

export enum SALES_INVOICE_DETAIL_TYPE {
  equipment = 'equipment',
  monthlyFee = 'monthly-fee',
  registration = 'registration',
  book = 'book',
  courseVoucher = 'course-voucher',
}

export enum SUPPLIER_ORDER_TYPE {
  courseVoucher = 'COURSE_VOUCHER',
  book = 'BOOK',
  equipment = 'EQUIPMENT',
}

export enum COURSE_VOUCHER_BUNDLE {
  quantity = 25,
}

export enum STOCK_ORDER_TYPE {
  courseVoucher = 'COURSE_VOUCHER',
  book = 'BOOK',
  equipment = 'EQUIPMENT',
}

export enum PAYMENT_METHOD_TYPE_ENUM {
  cashless = 'CASHLESS',
  cash = 'CASH',
}
