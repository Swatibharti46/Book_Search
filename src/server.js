// backend/server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;
const GOOGLE_API = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = "YOUR_API_KEY"; // Optional if you have a Google API key.

app.use(cors());

/**
 * API endpoint to search Google Books
 * Example: /api/search?q=flowers&startIndex=0&maxResults=10&filter=free-ebooks
 */
app.get("/api/search", async (req, res) => {
  try {
    const { q, startIndex = 0, maxResults = 10, filter, download } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const params = new URLSearchParams({
      q,
      startIndex,
      maxResults,
      key: API_KEY || "",
    });

    if (filter) params.append("filter", filter);
    if (download) params.append("download", download);

    const url = `${GOOGLE_API}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
