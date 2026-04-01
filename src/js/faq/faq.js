import Accordion from 'accordion-js';
import { refs } from '../helpers/refs.js';

let faqAccordion = null;

export function initFaq() {
  const hasItems = refs.faqAccordion?.querySelector('.ac');

  if (!refs.faqAccordion || !hasItems) {
    return faqAccordion;
  }

  faqAccordion = new Accordion(refs.faqAccordion, {
    duration: 300,
    showMultiple: false,
  });

  return faqAccordion;
}
