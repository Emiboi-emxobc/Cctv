exports.generateReferralCode = (firstName, lastName) => {
  const prefix = (firstName[0] + lastName[0]).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return prefix + random;
};
