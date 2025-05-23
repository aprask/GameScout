export function isDigit(str: string): boolean {
    if (str.length === 0) {
      return false;
    }
    for (let i = 0; i < str.length; i++) {
      if (str[i] < '0' || str[i] > '9') {
        return false;
      }
    }
    return true;
  }