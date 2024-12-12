export const Config = {
  DB_URL:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_URL
      : process.env.PROD_DB_URL,
};
