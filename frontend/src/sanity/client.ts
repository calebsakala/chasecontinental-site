import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "87a8gku7",
  dataset: "production", // or your dataset name
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: "2023-05-03", // use current date (YYYY-MM-DD) to target the latest API version
  token: "skgLTGK3VfiNOdV5dF3ryMThIhe1J97iTv8ZEfW4QZq1B8NrN3cX1bEvQmyFYiew9FUAAWJzbNFujanN7pGfXwN0bX5ppUyuSRB46YB2Ozc7hdV6mx4z9puywfeP7RkPyr5YpOLSdCLTEEbkI8JOkdxDh4xOBrh5BOsDmXbtbyr0ZrtAdNfG",
});
