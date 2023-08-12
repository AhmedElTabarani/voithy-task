module.exports = isPasswordChangeAfterJWTTimestamp = (
  passwordChangedAt,
  JWTTimestamp
) => {
  if (passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      passwordChangedAt.getTime() / 1000,
      10
    );
    // return true if jwt token time is (old) less than last time password changed
    return passwordChangedTimestamp > JWTTimestamp;
  }
  return false;
};
