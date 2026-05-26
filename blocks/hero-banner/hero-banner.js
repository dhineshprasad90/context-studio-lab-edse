export default function decorate(block) {
  const rows = [...block.children];
  
  // First row is the main heading
  if (rows[0]) {
    const heading = rows[0].querySelector('div');
    heading.classList.add('hero-banner-title');
  }
  
  // Second row is the description
  if (rows[1]) {
    const description = rows[1].querySelector('div');
    description.classList.add('hero-banner-description');
  }
}

// Made with Bob
