function formatString(string, length) {
  if (string.length > length) {
    const newString = string.substring(0, length);
    return `${newString}...`;
  }
  return string;
}
export default formatString;
