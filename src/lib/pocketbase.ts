import PocketBase from "pocketbase";

/**
 * PocketBase client instance
 * Uses environment variable for URL or defaults to localhost
 */
const pb = new PocketBase(
  import.meta.env.PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090"
);

// Disable auto cancellation for SSR compatibility
pb.autoCancellation(false);

export default pb;
