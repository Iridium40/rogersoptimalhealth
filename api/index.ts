import { createServer } from "../server";

// Export the Express app directly for Vercel Serverless Functions
const app = createServer();
export default app;
