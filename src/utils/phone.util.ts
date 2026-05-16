import { AppError } from "../errors/AppError.js";
import { RESPONSE_MESSAGE } from "../configs/index.js";

export interface ParsedPhoneNumber {
  countryCode: string;
  mobileNumber: string;
}

export function parsePhoneNumber(input: {
  phoneNumber: string;
  countryCode?: string;
}): ParsedPhoneNumber {
  const raw = input.phoneNumber.trim();
  let digits = raw.replace(/\D/g, "");

  let countryCode = input.countryCode?.replace(/\D/g, "") ?? "";

  if (raw.startsWith("+") && digits.length > 10) {
    if (!countryCode && digits.startsWith("91") && digits.length === 12) {
      countryCode = "91";
      digits = digits.slice(2);
    }
  }

  if (!countryCode && digits.length > 10) {
    if (digits.startsWith("91") && digits.length === 12) {
      countryCode = "91";
      digits = digits.slice(2);
    }
  }

  if (!countryCode) {
    throw new AppError(400, RESPONSE_MESSAGE.COUNTRY_CODE_REQUIRED, "INVALID_PHONE");
  }

  if (!/^\d{1,4}$/.test(countryCode)) {
    throw new AppError(400, RESPONSE_MESSAGE.INVALID_COUNTRY_CODE, "INVALID_COUNTRY_CODE");
  }

  if (digits.startsWith(countryCode) && digits.length > countryCode.length + 6) {
    digits = digits.slice(countryCode.length);
  }

  if (!/^\d{7,15}$/.test(digits)) {
    throw new AppError(400, RESPONSE_MESSAGE.INVALID_MOBILE_NUMBER, "INVALID_PHONE");
  }

  return { countryCode, mobileNumber: digits };
}
