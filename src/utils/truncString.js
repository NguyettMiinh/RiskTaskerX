export const truncateString = (str, maxLength) => {
  if (str && str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return str;
}