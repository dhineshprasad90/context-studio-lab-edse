/**
 * Car Finder block
 * Expected block structure (one row per card):
 *   | icon (picture or inline SVG) | label text | CTA link |
 */
export default function decorate(block) {
  const cards = [];

  [...block.children].forEach((row) => {
    const [iconCol, labelCol, ctaCol] = [...row.children];
    if (!labelCol) return;

    const card = document.createElement('div');
    card.className = 'car-finder-card';

    // icon
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'car-finder-icon';
    if (iconCol) iconWrapper.append(...iconCol.childNodes);
    card.append(iconWrapper);

    // label
    const label = document.createElement('p');
    label.className = 'car-finder-label';
    label.textContent = labelCol.textContent.trim();
    card.append(label);

    // CTA button
    if (ctaCol) {
      const anchor = ctaCol.querySelector('a');
      if (anchor) {
        const btn = document.createElement('a');
        btn.className = 'car-finder-btn';
        btn.href = anchor.href;
        btn.textContent = anchor.textContent.trim();
        card.append(btn);
      }
    }

    cards.push(card);
  });

  const grid = document.createElement('div');
  grid.className = 'car-finder-grid';
  cards.forEach((c) => grid.append(c));

  block.replaceChildren(grid);
}
