const postsContainer = document.getElementById('blog-posts');
const searchInput = document.getElementById('blog-search');
const categoryButtons = Array.from(document.querySelectorAll('.category-chip'));
const storageKey = 'austin-emdr-blog-posts';
let activeCategory = 'all';
let activeSearch = '';

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(storageKey, JSON.stringify(posts));
}

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getFilteredPosts(posts) {
  const searchText = activeSearch.toLowerCase();

  return posts.filter((post) => {
    const categoryMatches = activeCategory === 'all' || post.category === activeCategory;
    const searchableContent = [post.title, post.excerpt, post.content, post.category]
      .join(' ')
      .toLowerCase();
    const searchMatches = !searchText || searchableContent.includes(searchText);

    return categoryMatches && searchMatches;
  });
}

function renderPosts() {
  const posts = loadPosts();
  const filteredPosts = getFilteredPosts(posts);

  if (!filteredPosts.length) {
    postsContainer.innerHTML = '<p class="empty-state">No posts match that search yet.</p>';
    return;
  }

  postsContainer.innerHTML = filteredPosts
    .map((post) => {
      const safeContent = escapeHtml(post.content).replace(/\n/g, '<br />');
      return `
        <article class="blog-card">
          <div class="blog-meta">
            <span class="blog-category-pill">${escapeHtml(post.category || 'General')}</span>
            <span>${formatDate(post.date)}</span>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="blog-excerpt">${escapeHtml(post.excerpt)}</p>
          <p>${safeContent}</p>
        </article>
      `;
    })
    .join('');
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    activeSearch = event.target.value.trim();
    renderPosts();
  });
}

if (categoryButtons.length) {
  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category || 'all';
      categoryButtons.forEach((chip) => chip.classList.toggle('is-active', chip === button));
      renderPosts();
    });
  });
}

if (postsContainer) {
  renderPosts();
}
