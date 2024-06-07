export default function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).json({
      wcProjectId: process.env.WC_PROJECT_ID,
      polygonApiKey: process.env.POLYGON_API_KEY,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
