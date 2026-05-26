export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('cta-container');
  
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('buttons-wrapper');
  
  const rows = [...block.children];
  
  // Process button rows (first two rows)
  rows.slice(0, 2).forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const link = cells[1].querySelector('a');
      if (link) {
        // Button already created by decorateButtons in scripts.js
        const buttonWrapper = link.closest('.button-wrapper');
        if (buttonWrapper) {
          buttonsWrapper.append(buttonWrapper);
        }
      }
    }
  });
  
  container.append(buttonsWrapper);
  
  // Process scroll text (third row)
  if (rows[2]) {
    const scrollText = document.createElement('div');
    scrollText.classList.add('scroll-text');
    scrollText.textContent = rows[2].textContent.trim();
    container.append(scrollText);
  }
  
  block.textContent = '';
  block.append(container);
}

// Made with Bob
