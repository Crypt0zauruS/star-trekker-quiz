export default function handler(req, res) {
  res.status(200).json({
    wcProjectId: process.env.WC_PROJECT_ID,
    polygonApiKey: process.env.POLYGON_API_KEY,
  });
}
