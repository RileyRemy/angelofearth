// TEST SCRIPT - REPLACE YOUR CURRENT novel-reader.js WITH THIS
document.addEventListener('DOMContentLoaded', () => {
  // Hardcoded test content
  const testContent = {
    chapters: [{
      title: "TEST CHAPTER",
      pages: [{
        left: "THIS IS LEFT PAGE TEXT - SEE THIS?",
        right: { 
          image: "images/cart.png", 
          alt: "Test image (your shopping cart icon)" 
        }
      }]
    }]
  };

  // Display test content
  document.getElementById('leftPage').innerHTML = 
    `<p style="color:red;font-size:24px;">${testContent.chapters[0].pages[0].left}</p>`;
  
  document.getElementById('rightPage').innerHTML = 
    `<img src="${testContent.chapters[0].pages[0].right.image}" 
          alt="${testContent.chapters[0].pages[0].right.alt}"
          style="max-width:100%">`;

  alert("TEST: Script is working! Check for red text and cart image.");
});
