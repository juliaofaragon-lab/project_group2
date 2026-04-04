import '../css/furniture-modal-preview.css';
import { initFurnitureModal } from './modals/furniture-modal.js';

function initPreviewPage() {
  initFurnitureModal({ forcePreview: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPreviewPage);
} else {
  initPreviewPage();
}
