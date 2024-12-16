export const coreConstant = {
  ROLES: {
    ADMIN: 1,
    SUPER_ADMIN: 2,
    STUDENT: 3,
    INSTRUCTOR: 4,
  },
  COURSE_LEVEL: {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
  },
  COMMON_PASSWORD: '123456',
  STATUS_INACTIVE: 0,
  STATUS_ACTIVE: 1,
  STATUS_PENDING: 2,
  STATUS_REJECTED: 3,
  IS_VERIFIED: 1,
  IS_NOT_VERIFIED: 0,
  IS_REJECTED: 3,
  VERIFICATION_TYPE_EMAIL: 1,
  FILE_DESTINATION: 'storage',
  WITHDRAW_FILE_DESTINATION: 'storage/withdraw-request',
  INACTIVE: 0,
  ACTIVE: 1,
  PENDING: 2,
  GENDER: {
    MALE: 1,
    FEMALE: 2,
    OTHERS: 3,
  },
  PAYMENT_METHODS: {
    STRIPE: 1,
    PAYPAL: 2,
    BRAINTREE: 3,
    PAYSTACK: 4,
  },
};

export const modeStatusConstant = {
  LIVE: 1,
  SANDBOX: 2,
};

export const statusOnOffConstant = {
  DEACTIVE: 0,
  ACTIVE: 1,
};
export const LiveCLassStatus = {
  UPCOMING: 0,
  LIVE: 1,
  COMPLETED: 2,
  CANCELLED: 3,
}
export const DISCOUNT_TYPE = {
  PERCENTAGE: 0,
  AMOUNT: 1,
};

export const UPLOAD_SOURCE = {
  LOCAL: 1,
  YOUTUBE: 2,
  VIMEO: 3,
};

export const packageTypeConstant = {
  REGULAR: 1,
  PREMIUM: 2,
};

export const inputFieldTypeConstant = {
  INPUT_FIELD: 1,
  TEXTAREA_FIELD: 2,
};

export const faqTypeConstant = {
  LANDING_PAGE: 0,
};

export const DefaultPaginationMetaData = {
  total: 0,
  lastPage: 1,
  currentPage: 1,
  perPage: 0,
  prev: null,
  next: null,
};

export const DiscountConstant = {
  DISCOUNT_FIXED: 0,
  DISCOUNT_PERCENTAGE: 1,
};

export const CouponUsesTypeConstant = {
  LIMITED_USER: 0,
  UNLIMITED_USER: 1,
};
export const PaymentStatusConstant = {
  PAYMENT_FAILED: 0,
  PAYMENT_SUCCESS: 1,
  PAYMENT_NOT_INITIATED: 2,
};

export const FollowingStatusConstant = {
  UNFOLLOW: 0,
  FOLLOW: 1,
};
export const SeenUnseenStatusConstant = {
  UNSEEN: 0,
  SEEN: 1,
};

export const FileTypeConstant = {
  NONE: 0,
  IMAGE: 1,
  VIDEO: 2,
};

export const AnswerTypeConstant = {
  MULTIPLE_CHOICE: 0,
  DESCRIPTION: 1,
};

export const AnswerStatusConstant = {
  WRONG_ANSWER: 0,
  RIGHT_ANSWER: 1,
};

export const ReviewRatingConstant = {
  ONE_STAR: 1,
  TWO_STAR: 2,
  THREE_STAR: 3,
  FOUR_STAR: 4,
  FIVE_STAR: 5,
};

export const WithdrawStatusConstant = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
};
