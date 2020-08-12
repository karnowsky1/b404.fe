import sjcl from 'sjcl';

export const hash = (value: string): string => {
  const output = sjcl.hash.sha256.hash(value);
  const hashValue = sjcl.codec.hex.fromBits(output);
  return hashValue;
};
