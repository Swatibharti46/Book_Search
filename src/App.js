import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const maxResults = 10;
  const [totalItems, setTotalItems] = useState(0);
  const handleSearch = async (pageIndex = 0) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const startIndex = pageIndex * maxResults;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&startIndex=${startIndex}&maxResults=${maxResults}${
        filter ? `&filter=${filter}` : ""
      }`;

      console.log("Fetching:", url); // Debugging
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch books");

      const data = await response.json();
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0);
      setPage(pageIndex);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / maxResults);

  return (
    <div className="app">
      <h1>Google Books Finder</h1>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="free-ebooks">Free eBooks</option>
          <option value="paid-ebooks">Paid eBooks</option>
          <option value="ebooks">All eBooks</option>
          <option value="partial">Partial Preview</option>
          <option value="full">Full View</option>
        </select>
        <button onClick={() => handleSearch(0)}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="results">
        {books.map((book) => {
          const info = book.volumeInfo;
          return (
            <div key={book.id} className="book-card">
              {info.imageLinks && (
                <img src={info.imageLinks.thumbnail} alt={info.title} />
              )}
              <h3>{info.title}</h3>
              <p>{info.authors?.join(", ")}</p>
            </div>
          );
        })}
      </div>

      {totalItems > maxResults && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => handleSearch(page - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => handleSearch(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
