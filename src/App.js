import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("intitle");
  const [filter, setFilter] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Advanced filters
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [orderBy, setOrderBy] = useState("relevance");
  const [language, setLanguage] = useState("");

  // Pagination / Infinite Scroll
  const [page, setPage] = useState(0);
  const maxResults = 10;
  const [totalItems, setTotalItems] = useState(0);

  // Favorites
  const [favorites, setFavorites] = useState([]);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const saveToFavorites = (book) => {
    const updated = [...favorites, book];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const removeFromFavorites = (id) => {
    const updated = favorites.filter((b) => b.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const buildQuery = () => {
    let q = `${filterType}:${encodeURIComponent(query)}`;
    if (fromYear || toYear)
      q += `+after:${fromYear || "0000"}+before:${toYear || "9999"}`;
    return q;
  };

  const handleSearch = async (pageIndex = 0) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const startIndex = pageIndex * maxResults;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${buildQuery()}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=${orderBy}${
        language ? `&langRestrict=${language}` : ""
      }${filter ? `&filter=${filter}` : ""}`;

      console.log("Fetching:", url);
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
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>Google Books Finder</h1>
        <button onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="intitle">Title</option>
          <option value="inauthor">Author</option>
          <option value="subject">Genres</option>
          <option value="inpublisher">Publisher</option>
        </select>

        {/* Google filter */}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="free-ebooks">Free eBooks</option>
          <option value="paid-ebooks">Paid eBooks</option>
          <option value="ebooks">All eBooks</option>
          <option value="partial">Partial Preview</option>
          <option value="full">Full View</option>
        </select>

        {/* Year range */}
        <input
          type="number"
          placeholder="From Year"
          value={fromYear}
          onChange={(e) => setFromYear(e.target.value)}
        />
        <input
          type="number"
          placeholder="To Year"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
        />

        {/* Sorting */}
        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
        </select>

        {/* Language */}
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Any Language</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>

        <button onClick={() => handleSearch(0)}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Results */}
      <div className="results">
        {books.map((book) => {
          const info = book.volumeInfo;
          return (
            <div key={book.id} className="book-card">
              {info.imageLinks && (
                <img
                  src={info.imageLinks.thumbnail}
                  alt={info.title}
                  onClick={() => setSelectedBook(book)}
                />
              )}
              <h3>{info.title}</h3>
              <p>{info.authors?.join(", ")}</p>
              {info.averageRating && (
                <p>⭐ {info.averageRating} ({info.ratingsCount} reviews)</p>
              )}
              {info.publishedDate && (
                <p><b>Year:</b> {info.publishedDate}</p>
              )}
              {info.categories && (
                <p><b>Genres:</b> {info.categories.join(", ")}</p>
              )}
              <button onClick={() => saveToFavorites(book)}>+ Favorite</button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
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

      {/* Favorites */}
      <div className="favorites">
        <h2>My Library</h2>
        {favorites.length === 0 && <p>No favorites yet.</p>}
        {favorites.map((book) => (
          <div key={book.id} className="favorite-card">
            <span>{book.volumeInfo.title}</span>
            <button onClick={() => removeFromFavorites(book.id)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setSelectedBook(null)}>
              ×
            </button>
            <h2>{selectedBook.volumeInfo.title}</h2>
            <p><b>Author:</b> {selectedBook.volumeInfo.authors?.join(", ")}</p>
            <p><b>Publisher:</b> {selectedBook.volumeInfo.publisher}</p>
            <p><b>Description:</b> {selectedBook.volumeInfo.description}</p>
            {selectedBook.accessInfo?.webReaderLink && (
              <a href={selectedBook.accessInfo.webReaderLink} target="_blank" rel="noreferrer">
                Read Online
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
