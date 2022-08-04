import parsePhoneNumber from 'libphonenumber-js';

export const formatPhoneNum = (number: string) => {
  if (!number) return '';

  const phoneNumber = parsePhoneNumber(number);

  return `+${phoneNumber?.countryCallingCode} ${phoneNumber?.format(
    'NATIONAL'
  )}`;
};
