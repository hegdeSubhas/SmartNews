const apiKey = "pub_79501f94d85feddfc9f2a825e75a4f9970022"; // Replace with your actual NewsData.io API key
const newsContainer = document.getElementById("news-container");
const categorySelect = document.getElementById("category-select");
const countrySelect = document.getElementById("country-select");
const searchBox = document.getElementById("search-box");

async function fetchNews({ category = "", country = "in", query = "" } = {}) {
  newsContainer.innerHTML = `<div class="loader">Loading news...</div>`;

  let baseURL = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en`;

  if (country) baseURL += `&country=${country}`;
  if (category) baseURL += `&category=${category}`;
  if (query) baseURL += `&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(baseURL);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      newsContainer.innerHTML = `<div class="loader">No news found.</div>`;
      return;
    }

    renderArticles(data.results);
  } catch (err) {
    console.error(err);
    newsContainer.innerHTML = `<div class="loader">Error loading news.</div>`;
  }
}

function renderArticles(articles) {
  newsContainer.innerHTML = articles.map(article => {
    const category = article.category?.[0] || "news";
    const fallbackImg = `https://source.unsplash.com/featured/300x160/?${category}`;
    const imageUrl = article.image_url || fallbackImg;

    return `
      <div class="news-card">
        <img src="${imageUrl}" alt="${article.title}">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.link}" target="_blank">Read more</a>
        </div>
      </div>
    `;
  }).join('');
}

// Event Listeners
categorySelect.addEventListener("change", () => {
  fetchNews({
    category: categorySelect.value,
    country: countrySelect.value,
    query: searchBox.value
  });
});

countrySelect.addEventListener("change", () => {
  fetchNews({
    category: categorySelect.value,
    country: countrySelect.value,
    query: searchBox.value
  });
});

searchBox.addEventListener("input", debounce(() => {
  fetchNews({
    category: categorySelect.value,
    country: countrySelect.value,
    query: searchBox.value
  });
}, 600));

// Debounce to limit API calls
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Initial Load
fetchNews();
