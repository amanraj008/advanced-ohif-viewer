import lodash from 'lodash';
/**
 * check if given domain or url is https enabled or not
 * @param url
 */
function ensureHTTPS(url: string | null) {
  if (!url) {
    return '';
  }
  return url;
  /*    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    } else if (/^http:\/\//i.test(url)) {
        url = url.replace(/^http:/i, 'https:');
    }
    return url;*/
}

/**
 * check if given string is non empty valid string
 * @param str
 */
function isValidString(str: any): boolean {
  return str !== undefined && str !== null && str?.length > 0;
}

/**
 * check if given string is non empty valid string
 * @param str
 */
function isStr(str: any): boolean {
  return str !== undefined && str !== null && str?.length > 0;
}

/**
 * check is an array is non-empty valid array
 * @param array
 */

function isArray(array: any[] | undefined | null): boolean {
  return array !== undefined && array !== null && array?.length > 0;
}

/**
 * converts string to lowercase
 * @param str
 */
function convertToLower(str: string) {
  if (str?.length <= 0) {
    return str;
  }
  return str?.toLowerCase();
}

/**
 * formats string to lowercase to compare with each other
 * @param str
 */

function strcmp(str: string | undefined) {
  str = str?.replace(/\s/g, '-');
  str = str?.replace(/[^a-zA-Z ]/g, '-');
  return convertToLower(str ?? '');
}

function filterDigits(inputString: string): string {
  return inputString.replace(/\D/g, '');
}

/**
 * check if given string is non-empty valid number
 * @param num
 */
function isNum(num: number | undefined | null): boolean {
  return num !== undefined && num !== null && num > 0;
}

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function humanTimeDiff(date: string) {
  const givenDate = new Date(date);
  // Current date
  const currentDate = new Date();
  // Calculate the difference in milliseconds
  const timeDifference = currentDate.getTime() - givenDate.getTime();
  // Convert milliseconds to days
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return isNum(days) ? days : 1;
}

function formatTitle(title: string) {
  return lodash.startCase(title);
}

function formatDate(date: any) {
  // Extract day, month, and year
  date = new Date(date);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: January is 0
  const year = date.getFullYear();

  // Pad day and month with leading zeros if needed
  const paddedDay = day < 10 ? '0' + day : day;
  const paddedMonth = month < 10 ? '0' + month : month;

  // Format the date as dd/mm/yyyy
  return `${paddedDay}/${paddedMonth}/${year}`;
}

function isEncodedURIComponent(html: string) {
  // Check if the string contains typical URI encoded patterns like %20, %21, etc.
  return /%[0-9A-Fa-f]{2}/.test(html);
}

function formatContent(html: string) {
  try {
    if (isEncodedURIComponent(html)) {
      return decodeURIComponent(html);
    }
    return html;
  } catch (e) {
    return html;
  }
}

export {
  isNum,
  isStr,
  strcmp,
  isArray,
  formatDate,
  isValidUrl,
  filterDigits,
  ensureHTTPS,
  formatTitle,
  humanTimeDiff,
  isValidString,
  formatContent,
};
