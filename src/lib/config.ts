const DEFAULT_PROD_API_URL = "https://imagingpedia-testing-production.up.railway.app";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_PROD_API_URL
).replace(/\/+$/, "");
