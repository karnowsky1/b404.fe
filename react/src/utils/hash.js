import sjcl from 'sjcl';

export const hash = string => {
  const output = sjcl.hash.sha256.hash(string)
  const hashValue = sjcl.codec.hex.fromBits(output)
  return hashValue
}