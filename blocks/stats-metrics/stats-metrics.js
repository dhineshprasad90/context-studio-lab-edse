export default function decorate(block) {
  const stats = document.createElement('div');
  stats.classList.add('stats-container');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const statItem = document.createElement('div');
      statItem.classList.add('stat-item');

      const value = document.createElement('div');
      value.classList.add('stat-value');
      value.textContent = cells[0].textContent.trim();

      const label = document.createElement('div');
      label.classList.add('stat-label');
      label.textContent = cells[1].textContent.trim();

      statItem.append(value, label);
      stats.append(statItem);
    }
  });

  block.textContent = '';
  block.append(stats);
}

// Made with Bob
