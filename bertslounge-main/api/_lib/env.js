function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) throw new Error(`Server configuration is missing ${name}.`);
  return value.trim();
}

module.exports = { getRequiredEnv };
