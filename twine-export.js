// This script handles exporting from Twine and converting to your format
function exportTwineStory(story) {
  const chapters = [];
  
  // Group passages into chapters
  story.passages.forEach(passage => {
    if (passage.tags.includes('chapter')) {
      chapters.push({
        title: passage.text,
        passages: []
      });
    } else if (chapters.length > 0) {
      chapters[chapters.length - 1].passages.push({
        pid: passage.pid,
        content: passage.text,
        links: passage.links.map(link => ({
          pid: link.pid,
          name: link.name
        }))
      });
    }
  });
  
  return { chapters };
}

// Usage when exporting from Twine:
// 1. In Twine, go to "Build > Export Story"
// 2. Choose "JSON"
// 3. Paste the output into this converter
// 4. Copy the result into your HTML file
