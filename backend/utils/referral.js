exports.generateReferralCode = (firstname, lastname) => {
  const prefix = (firstname[0] + lastname[0]).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return prefix + random;
};
