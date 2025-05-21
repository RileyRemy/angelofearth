// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load story content
   const response = await fetch('content.json');
    if (!response.ok) throw new Error("Couldn't load story");
    const story = await response.json();
    
    // Set up navigation
    setupChapterSelect(story.chapters);
    renderPage(story.chapters[0].pages[0]);
    
    // Event listeners
    document.getElementById('prevBtn').addEventListener('click', () => navigate(-1));
    document.getElementById('nextBtn').addEventListener('click', () => navigate(1));
    
  } catch (error) {
    console.error("Error:", error);
    document.getElementById('leftPage').innerHTML = `
      <div class="text-red-500 p-4">
        Error loading content: ${error.message}
      </div>
    `;
  }
});

// Current reading position
let currentState = {
  chapterIndex: 0,
  pageIndex: 0,
  story: null
};

function setupChapterSelect(chapters) {
  const select = document.getElementById('chapterSelect');
  select.innerHTML = chapters.map((chap, i) => 
    `<option value="${i}">${chap.title}</option>`
  );
  
  select.addEventListener('change', (e) => {
    currentState.chapterIndex = parseInt(e.target.value);
    currentState.pageIndex = 0;
    renderCurrentPage();
  });
}

function renderPage(page) {
  // Left page
  renderContent('leftPage', page.left);
  
  // Right page
  renderContent('rightPage', page.right);
}

function renderContent(elementId, content) {
  const element = document.getElementById(elementId);
  
  if (typeof content === 'string') {
    element.innerHTML = `<p class="leading-relaxed p-4">${content}</p>`;
  } else if (content?.image) {
    element.innerHTML = `
      <div class="h-full flex items-center justify-center p-4">
        <img src="${content.image}" alt="${content.alt}" 
             class="max-h-full max-w-full object-contain">
      </div>
    `;
  }
}

function navigate(direction) {
  const chapter = currentState.story.chapters[currentState.chapterIndex];
  const newIndex = currentState.pageIndex + direction;
  
  if (newIndex >= 0 && newIndex < chapter.pages.length) {
    currentState.pageIndex = newIndex;
    renderCurrentPage();
  }
}

function renderCurrentPage() {
  const chapter = currentState.story.chapters[currentState.chapterIndex];
  renderPage(chapter.pages[currentState.pageIndex]);
}
