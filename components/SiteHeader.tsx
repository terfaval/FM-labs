import { Meta } from "@/lib/content/types";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

export function SiteHeader({ meta }: { meta: Meta }) {
  return (
    <section className="section site-header">
      <div className="site-header__brand">
        <img
          className="site-header__photo"
          src="/personal/Slide3.JPG"
          alt="Portré"
        />
        <img
          className="site-header__photo-mark"
          src="/fm-labs_logo.svg"
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="site-header__intro">
        <div className="site-header__content">
          <div className="site-header__content-main">
            <div className="site-header__heading">
              <div className="site-header__title">{meta.title}</div>
              <p className="site-header__tagline">{meta.tagline}</p>
            </div>
            <div className="site-header__body">
              {renderParagraphs(meta.intro)}
            </div>
          </div>
          <div className="site-header__cta-group">
            <a
              className="site-header__cta site-header__cta--primary"
              href="#kiemelt-projektek"
            >
              Projektek
            </a>
            <a
              className="site-header__cta site-header__cta--inverse"
              href="#egyuttmukodes"
            >
              Kapcsolat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
