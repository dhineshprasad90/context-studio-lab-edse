export default function decorate(block) {
  const rows = [...block.children];

  const title = rows[0]?.textContent?.trim() || 'Default Title';

  const description = rows[1]?.textContent?.trim() || 'Default Description';

  const buttonText = rows[2]?.textContent?.trim() || 'Click';

  block.innerHTML = `
    <div class="test-wrapper">
      <h2>${title}</h2>
      <p>${description}</p>
      <button>${buttonText}</button>
    </div>
  `;
}
