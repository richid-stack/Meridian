/** True while the web app runs on built-in sample data (no backend URL). Interactions are then saved in this browser only. */
export const SAMPLE_MODE = !process.env.NEXT_PUBLIC_API_BASE_URL;
