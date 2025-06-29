export function ellipsify(str: string, len = 6): string {
  if (str.length <= len * 2) {
    return str
  }
  return `${str.slice(0, len)}...${str.slice(-len)}`
}
