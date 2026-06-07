export function smartApostrophe(str: string): string {
  return str.replaceAll("'", '’');
}

export function urlFriendly(str: string): string {
  return str.toLowerCase().replaceAll("'", '').replaceAll(' ', '-');
}
