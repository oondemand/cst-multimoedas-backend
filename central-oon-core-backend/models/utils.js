const resolveEnumValues = (values) => {
  if (!Array.isArray(values) || values.length === 0) {
    return undefined;
  }

  return values.filter((value) => value !== undefined && value !== null);
};

module.exports = {
  resolveEnumValues,
};
