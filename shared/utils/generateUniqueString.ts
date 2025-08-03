export function generateUniqueString(length: number = 12): string {
  const characters = "abdeghijklmnopqrstvwxyz0123456789ABDEGHIJKLMNOPQRSTVWXYZ"; // removed FCU for civility
  let uniqueString = "";

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    const value = array[i] ?? 0;
    const index = value % characters.length;
    uniqueString += characters.charAt(index);
  }

  return uniqueString;
}
