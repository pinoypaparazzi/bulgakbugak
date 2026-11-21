import Icon from './Icon.jsx';
import { COVERAGE } from '../content/site.js';

/* Free OpenStreetMap embed: no API key, no extra JavaScript library.
   It only sets the area the map opens on. We deliberately draw no
   boundary or markers; exact coverage is confirmed per request. */
const { map } = COVERAGE;
const EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${map.bbox.join('%2C')}&layer=mapnik`;
const LARGE_MAP_URL = `https://www.openstreetmap.org/#map=${map.zoom}/${map.center[0]}/${map.center[1]}`;

export default function Coverage({ soft = false }) {
  return (
    <section id="coverage" className={`section${soft ? ' section-soft' : ''}`} aria-labelledby="coverage-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Service area</p>
          <h2 id="coverage-title">{COVERAGE.title}</h2>
          <p className="section-lead">{COVERAGE.intro}</p>
        </header>

        <div className="coverage-grid">
          <figure className="map-frame">
            <iframe title="Map of central Quezon City, the general area of our pilot program" src={EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <figcaption>
              <span>General area view of central Quezon City, not a service boundary. Map © OpenStreetMap contributors.</span>
              <a href={LARGE_MAP_URL} target="_blank" rel="noopener noreferrer">
                Open larger map <Icon name="external" size={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </figcaption>
          </figure>

          <div className="coverage-list-card">
            <h3><Icon name="pin" size={22} /> Pilot coverage: streets &amp; areas</h3>
            <p className="coverage-sub">We currently focus on requests along and around these {COVERAGE.areas.length} streets, avenues and local areas:</p>
            <ul className="coverage-list">
              {COVERAGE.areas.map((place) => <li key={place}>{place}</li>)}
            </ul>
            <p className="note note-compact">
              <Icon name="info" size={18} />
              <span>{COVERAGE.note}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
