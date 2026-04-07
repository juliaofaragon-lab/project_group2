import aboutDesc1 from '../../img/about/img-about-desc1.jpg';
import aboutDesc2 from '../../img/about/img-about-desc2.jpg';
import aboutMobile1 from '../../img/about/img-about-mobile1.jpg';
import aboutMobile2 from '../../img/about/img-about-mobile2.jpg';
import aboutTablet1 from '../../img/about/img-about-tablet1.jpg';
import aboutTablet2 from '../../img/about/img-about-tablet2.jpg';

export function initAbout() {
  return `
    <div class="container about-container">
      <div class="context-about">
        <h2 class="title-about">Про Меблерію</h2>
        <p class="text-about">
          У Меблерії ми прагнемо створювати затишок та функціональність у
          кожному домі. Наша місія - пропонувати високоякісні меблі, що
          поєднують у собі сучасний дизайн, довговічність та доступність.
          Ми віримо, що ідеальний інтер'єр починається з правильних меблів.
        </p>
      </div>

      <picture class="pict-about">
        <source
          srcset="${aboutDesc1} 1x, ${aboutDesc2} 2x"
          media="(min-width: 1440px)"
        />
        <source
          srcset="${aboutTablet1} 1x, ${aboutTablet2} 2x"
          media="(min-width: 768px)"
        />
        <source
          srcset="${aboutMobile1} 1x, ${aboutMobile2} 2x"
          media="(max-width: 767px)"
        />
        <img
          class="img-about"
          src="${aboutMobile1}"
          alt="Про Меблерію"
          loading="lazy"
          width="436"
          height="644"
        />
      </picture>
    </div>
  `;
}
