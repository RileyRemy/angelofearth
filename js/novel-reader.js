document.addEventListener('DOMContentLoaded', async () => {
  const leftPage = document.getElementById('leftPage');
  const rightPage = document.getElementById('rightPage');
  let currentChapter = 1;
  let allPages = []; // Stores all formatted pages
  let currentPageIndex = 0;

  // Calculate how much text fits per page
  function getWordsPerPage() {
    const testEl = document.createElement('div');
    testEl.className = 'w-[500px] invisible absolute';
    testEl.innerHTML = '<p>test</p>';
    document.body.appendChild(testEl);
    const lineHeight = parseInt(getComputedStyle(testEl).lineHeight);
    const pageHeight = parseInt(getComputedStyle(leftPage).height);
    const linesPerPage = Math.floor(pageHeight / lineHeight);
    document.body.removeChild(testEl);
    return linesPerPage * 10; // Approx words per page
  }

  // Format text and split into pages
  async function prepareChapter(num) {
    const response = await fetch(`chapters/${num}.txt`);
    const text = await response.text();
    
    const formatted = formatText(text);
    const wordsPerPage = getWordsPerPage();
    const words = formatted.split(/(<[^>]+>|\s+)/).filter(w => w.trim());
    
    allPages = [];
    let currentPage = [];
    let currentLength = 0;

    words.forEach(word => {
      const wordLength = word.split(' ').length;
      if (currentLength + wordLength > wordsPerPage && currentPage.length > 0) {
        allPages.push(currentPage.join(' '));
        currentPage = [];
        currentLength = 0;
      }
      currentPage.push(word);
      currentLength += wordLength;
    });

    if (currentPage.length > 0) {
      allPages.push(currentPage.join(' '));
    }
  }

  // Show current page
  function showPage() {
    if (allPages.length === 0) return;
    
    leftPage.innerHTML = allPages[currentPageIndex] || '';
    rightPage.innerHTML = allPages[currentPageIndex + 1] || '';
  }

  // Navigation
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPageIndex + 2 < allPages.length) {
      currentPageIndex += 2;
      showPage();
    } else {
      // Load next chapter if available
    }
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPageIndex >= 2) {
      currentPageIndex -= 2;
      showPage();
    }
  });

  // Initialize
  prepareChapter(1).then(() => showPage());
});

function formatText(text) {
  return text
    .replace(/\_(.*?)\_/g, '<em>$1</em>')
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="images/$1" alt="$2" class="my-4 mx-auto max-w-full">')
    .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-russo mb-4">$1</h1>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}
