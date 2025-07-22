# 📚 Google Books Search App  

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)  
![API](https://img.shields.io/badge/API-Google%20Books%20API-orange?logo=google)  
![CSS](https://img.shields.io/badge/Style-CSS-green)  
![Deploy](https://img.shields.io/badge/Deployed%20On-Vercel-black?logo=vercel)  

A **React-based web application** that allows users to **search for books** using the [Google Books API](https://developers.google.com/books/docs/v1/using).  
The app supports **filters, pagination**, and displays essential book details like **title, author, and cover image**.

---

## 🚀 **Features**
- 🔍 Search for books using keywords (title, author, or general query).  
- 🎯 Filter by availability (Free eBooks, Paid eBooks, etc.).  
- 📄 Pagination for easy navigation.  
- 🖼 Display book cover images, titles, and authors.  
- ⚠ Error handling for no results or API errors.  
- 📱 Fully responsive and clean UI.  

---

## 🛠 **Tech Stack**
- **Frontend:** React.js  
- **Styling:** CSS (custom styles)  
- **API:** [Google Books API](https://developers.google.com/books/docs/v1/using)  
- **Deployment:** Vercel  

---

## ⚙ **Setup & Installation**

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/book-search.git
   cd book-search 

2. **Install dependencies**
```bash npm install
npm start
The app will run on http://localhost:3000


🌐 Google Books API Integration**
The app fetches data from the Google Books API. Example endpoint:

```bash
https://www.googleapis.com/books/v1/volumes?q=harry+potter&startIndex=0&maxResults=10
Optional: API Key
To avoid quota issues:

Generate a key from Google Cloud Console.

Replace your API call with:

javascript
Copy
Edit
https://www.googleapis.com/books/v1/volumes?q=${query}&key=YOUR_API_KEY

📂 Project Structure
pgsql
Copy
Edit
# 🚢 Deployment
Build the app for production:

bash
Copy
Edit
npm run build
Deploy the build/ folder to Vercel, Netlify, or GitHub Pages.

    ```bash

book-search/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── components/ (for reusable components)
├── package.json
└── README.md

