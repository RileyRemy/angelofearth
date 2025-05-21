document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const leftPage = document.getElementById('leftPage');
  const rightPage = document.getElementById('rightPage');
  const chapterSelect = document.getElementById('chapterSelect');
  const pageSelect = document.getElementById('pageSelect');
  
  // Configuration
  const WORDS_PER_PAGE = 250; // Adjust this number as needed
  const chapterTitles = {
    1: "The Cathedral of Chaos",
    2: "Shadow's Whisper",
    3: "Echoes of the Forgotten",
    4: "The Crimson Pact",
    5: "Whispers in the Dark",
    6: "The Obsidian Throne",
    7: "Veil of Shadows",
    8: "The Last Sanctuary",
    9: "Ashes of Time",
    10: "The Final Reckoning"
  };

  // State
  let currentChapter = 1;
  let allPages = [];
  let currentPageIndex = 0; // Tracks individual pages

  // Format text with enhanced image support
  function formatText(text) {
    return text
      .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-russo mb-4">$1</h1>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        return `<div class="image-container my-4 mx-auto flex justify-center">
          <img src="${src}" alt="${alt}" class="max-w-full max-h-96 object-contain">
        </div>`;
      })
      .replace(/\_(.*?)\_/g, '<em>$1</em>')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  // Split text into pages based on word count
  function paginateContent(text) {
    const pages = [];
    const words = text.split(/\s+/);
    let currentPage = [];
    let wordCount = 0;
    
    words.forEach(word => {
      if (wordCount >= WORDS_PER_PAGE) {
        pages.push(currentPage.join(' '));
        currentPage = [];
        wordCount = 0;
      }
      currentPage.push(word);
      wordCount++;
    });
    
    if (currentPage.length > 0) {
      pages.push(currentPage.join(' '));
    }
    
    return pages;
  }

  // Initialize dropdowns
  function initDropdowns() {
    // Chapter dropdown
    chapterSelect.innerHTML = '';
    Object.entries(chapterTitles).forEach(([num, title]) => {
      const option = document.createElement('option');
      option.value = num;
      option.textContent = `${num}. ${title}`;
      chapterSelect.appendChild(option);
    });
  }

  // Load chapter with proper pagination
  async function loadChapter(num) {
    try {
      const response = await fetch(`chapters/${num}.txt`);
      if (!response.ok) throw new Error("Chapter not found");
      
      const text = await response.text();
      const formatted = formatText(text);
      allPages = paginateContent(formatted);
      
      currentPageIndex = 0;
      updateUI();
      
    } catch (error) {
      leftPage.innerHTML = `<p class="text-red-500 p-4">Error loading chapter: ${error.message}</p>`;
      rightPage.innerHTML = '';
      console.error(error);
    }
  }

  // Update all UI elements
  function updateUI() {
    // Always show two pages (even if second is blank)
    leftPage.innerHTML = allPages[currentPageIndex] || '<div class="p-4"></div>';
    rightPage.innerHTML = allPages[currentPageIndex + 1] || '<div class="p-4"></div>';
    
    // Update dropdowns
    updatePageDropdown();
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  // Update page dropdown (shows individual pages but navigation is by spread)
  function updatePageDropdown() {
    pageSelect.innerHTML = '';
    allPages.forEach((_, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `Page ${index + 1}`;
      option.selected = (index === currentPageIndex);
      pageSelect.appendChild(option);
    });
  }

  // Navigate to specific page (always shows as left page of spread)
  function goToPage(pageIndex) {
    // Ensure we don't go beyond the last page
    currentPageIndex = Math.min(pageIndex, allPages.length - 1);
    updateUI();
  }

  // Navigation between pages (always moves by one page at a time)
  function navigate(direction) {
    if (direction === 'next') {
      if (currentPageIndex + 1 < allPages.length) {
        currentPageIndex += 1;
      } else {
        // Go to next chapter if available
        const nextChapter = currentChapter + 1;
        if (chapterTitles[nextChapter]) {
          currentChapter = nextChapter;
          loadChapter(nextChapter);
          return;
        }
      }
    } else {
      if (currentPageIndex > 0) {
        currentPageIndex -= 1;
      } else if (currentChapter > 1) {
        // Go to previous chapter
        currentChapter--;
        loadChapter(currentChapter);
        return;
      }
    }
    updateUI();
  }

  // Initialize everything
  initDropdowns();
  loadChapter(1);

  // Event listeners
  chapterSelect.addEventListener('change', (e) => {
    currentChapter = parseInt(e.target.value);
    loadChapter(currentChapter);
  });

  pageSelect.addEventListener('change', (e) => {
    goToPage(parseInt(e.target.value));
  });

  document.getElementById('nextBtn').addEventListener('click', () => navigate('next'));
  document.getElementById('prevBtn').addEventListener('click', () => navigate('prev'));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') navigate('next');
    if (e.key === 'ArrowLeft') navigate('prev');
  });
});
