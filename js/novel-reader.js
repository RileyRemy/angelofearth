// Simple novel reader that auto-paginates
document.addEventListener('DOMContentLoaded', async () => {
  const leftPage = document.getElementById('leftPage');
  const rightPage = document.getElementById('rightPage');
  let currentChapter = 1;
  
  // Load chapter
  async function loadChapter(num) {
    const response = await fetch(`chapters/${num}.txt`);
    const text = await response.text();
    
    // Simple formatting
    const formatted = text
      .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-russo mb-4">$1</h1>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="images/$1" alt="$2" class="my-4 mx-auto max-w-full">');
    
    // Auto-split into pages
    const words = formatted.split(' ');
    const midPoint = Math.floor(words.length / 2);
    
    leftPage.innerHTML = words.slice(0, midPoint).join(' ');
    rightPage.innerHTML = words.slice(midPoint).join(' ');
  }
  
  // Navigation
  document.getElementById('nextBtn').addEventListener('click', () => {
    currentChapter++;
    loadChapter(currentChapter);
  });
  
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentChapter > 1) currentChapter--;
    loadChapter(currentChapter);
  });
  
  // Start with first chapter
  loadChapter(1);
});

function formatText(text) {
  return text
    .replace(/\_(.*?)\_/g, '<em>$1</em>')       // _italics_
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>') // *bold*
    .replace(/\n/g, '<br>');                     // New lines
}
