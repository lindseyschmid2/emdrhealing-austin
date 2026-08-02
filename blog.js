const form = document.getElementById('blog-form');
const postsContainer = document.getElementById('blog-posts');
const storageKey = 'austin-emdr-blog-posts';

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

function renderPosts() {
  const posts = loadPosts();

  if (!posts.length) {
    postsContainer.innerHTML = '<p class="empty-state">No posts yet. Publish the first one above.</p>';
    return;
  }

  postsContainer.innerHTML = posts
    .map((post) => {
      const safeContent = escapeHtml(post.content).replace(/\n/g, '<br />');
      return `
        <article class="blog-card">
          <div class="blog-meta">${formatDate(post.date)}</div>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="blog-excerpt">${escapeHtml(post.excerpt)}</p>
          <p>${safeContent}</p>
        </article>
      `;
    })
    .join('');
}

if (form) {
  const titleInput = document.getElementById('title');
  const excerptInput = document.getElementById('excerpt');
  const contentInput = document.getElementById('content');
  const dateInput = document.getElementById('date');

  const today = new Date().toISOString().split('T')[0];
  if (dateInput) {
    dateInput.value = today;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const post = {
      id: Date.now().toString(),
      title: titleInput.value.trim(),
      excerpt: excerptInput.value.trim(),
      content: contentInput.value.trim(),
      date: dateInput.value
    };

    if (!post.title || !post.excerpt || !post.content || !post.date) {
      return;
    }

    const posts = [post, ...loadPosts()];
    savePosts(posts);
    form.reset();
    dateInput.value = today;
    renderPosts();
  });
}

if (postsContainer) {
  renderPosts();
}
