import crypto from 'crypto';

export const newGuestID = () => {
  return `Guest-${crypto.randomBytes(8).toString('hex')}`;
};
