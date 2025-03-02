import './style.css';
import typescriptLogo from '@/assets/typescript.svg';
import viteLogo from '/wxt.svg';
import { setupMainButton } from '@/components/main-button';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://wxt.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="WXT logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>WXT + TypeScript</h1>
    <div class="card">
      <button id="main-button" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the WXT and TypeScript logos to learn more
    </p>
  </div>
`;

setupMainButton(document.querySelector<HTMLButtonElement>('#main-button')!);
