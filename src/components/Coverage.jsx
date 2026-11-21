import Icon from './Icon.jsx';
import { COVERAGE, MAP_VIEW } from '../data/site.js';

/* Free OpenStreetMap embed — no API key, no extra JavaScript library.
   It only sets the area the map opens on; we deliberately do not draw
   a boundary or place markers, because exact coverage is confirmed per request. */
const bbox = MAP_VIEW.bbox.join('%2C');
const EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
const LARGE_MAP_URL = `https://www.openstreetmap.org/#map=${MAP_VIEW.zoom}/${MAP_VIEW.center[0]}/${MAP_VIEW.center[1]}`;

export default function Coverage() {
  return (
    <section id="coverage" className="section" aria-labelledby="coverage-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Service area</p>
          <h2 id="coverage-title">Serving Quezon City</h2>
          <p className="section-lead">
            AT YOUR SERVICE is currently operating its pilot program in Quezon City. Contact us to confirm
            availability for your specific location and requested service.
          </p>
        </header>

        <div className="coverage-grid">
          <figure className="map-frame">
            <iframe
              title="Map of central Quezon City, the general area of our pilot program"
              src={EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <figcaption>
              <span>
                General area view of central Quezon City. Zoom and drag to find your street.
                Map © OpenStreetMap contributors.
              </span>
              <a href={LARGE_MAP_URL} target="_blank" rel="noopener noreferrer">
                Open larger map <Icon name="external" size={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </figcaption>
          </figure>

          <div className="coverage-list-card">
            <h3>
              <Icon name="pin" size={22} /> Pilot coverage: streets &amp; areas
            </h3>
            <p className="coverage-sub">
              We currently focus on requests along and around these {COVERAGE.length} streets, avenues and
              local areas:
            </p>
            <ul className="coverage-list">
              {COVERAGE.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
            <p className="note note-compact">
              <Icon name="info" size={18} />
              <span>
                Coverage and provider availability must be confirmed before booking. Nearby locations may
                be possible. Just ask.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
