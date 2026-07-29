import { services as base, type Service } from '../../data/services';
import { useLang } from '../LanguageContext';
import type { Lang } from '../index';

/** Übersetzbare Textfelder einer Leistung (Bilder/Slug bleiben sprachneutral). */
type ServiceText = Pick<Service, 'title' | 'short' | 'intro' | 'description' | 'bullets'>;

/**
 * EN/LA-Übersetzungen der Leistungen, je Slug. Deutsch kommt aus der Basis
 * (src/data/services.ts). Latein ist sorgfältig, aber maschinell erstellt
 * und zur muttersprachlichen Prüfung gedacht.
 */
const overlay: Record<'en' | 'la', Record<string, ServiceText>> = {
  en: {
    duschkabinen: {
      title: 'Shower enclosures',
      short: 'Custom-made, frameless, uncompromisingly sealed.',
      intro:
        'Generous walk-in showers or slender corner enclosures – made to the millimetre for your room.',
      description: [
        'Every shower is one of a kind. We measure on site, plan glass thickness, fittings and surface finish with you – and install cleanly, with no compromise on the seal.',
        'On request with clear glass, a satin-etched surface or tinted grey glass for a calm, modern look. Toughened safety glass (ESG) is standard.',
      ],
      bullets: [
        'Walk-in, corner or U-shaped solutions',
        'Real-glass showers – frameless, fully bonded',
        'Clear, satin-etched, tinted, digital print, partial or full mirroring',
        'Stainless-steel or black fittings',
        'Toughened safety glass (ESG) to DIN EN 12150',
        'Replacement panes for existing shower doors',
      ],
    },
    glastueren: {
      title: 'Glass doors & partitions',
      short: 'Divide rooms without taking the light.',
      intro:
        'Glass swing doors, double-action doors and room-height partitions – elegant, robust and perfectly fitted.',
      description: [
        'A glass door creates structure without making the room smaller. We plan the fitting position, closing direction and handle variant together with you.',
        'Whether a swing door for the office, a double-action door for the reception area or a room-height fixed glazing as a stairwell screen – we supply and install the complete solution.',
      ],
      bullets: [
        'Swing and double-action doors with high-quality fittings',
        'All-glass doors incl. fitting a wooden or aluminium frame',
        'Glass sliding doors with ceiling- or wall-mounted track',
        'All-glass systems for offices, practices and shops',
        'Room-height fixed glazing and partitions',
        'Clear, satin-etched or with individual motifs',
        'ESG / laminated glass to structural requirements',
      ],
    },
    vordaecher: {
      title: 'Canopies & roofing',
      short: 'A clean edge. Weatherproof. For years.',
      intro:
        'Front-door canopies and terrace roofs in powder-coated steel with laminated safety glass.',
      description: [
        'A canopy protects your front door and gives the entrance character. We plan the structural design, drainage and fixing individually for your façade.',
        'Laminated safety glass (VSG) is used, clear or satin-etched. The structure is powder-coated in the colour of your choice – the standard is deep matt black.',
      ],
      bullets: [
        'Front-door canopies in any width',
        'Terrace and entrance roofs in real glass or acrylic glass',
        'Powder-coated steel structure',
        'Laminated safety glass (VSG), clear or satin-etched',
        'Including structural design, fixing and drainage',
      ],
    },
    treppengelaender: {
      title: 'Stair railings & balustrades',
      short: 'Safety that opens up the room.',
      intro:
        'All-glass railings for stairs, galleries and balustrades – with or without a wooden handrail.',
      description: [
        'Glass railings make rooms feel airy and let daylight through unhindered. We calculate the permissible glass thickness according to railing type and fall height.',
        'Point fixing via stainless-steel glass holders or lateral profile clamping – depending on the architecture and your wishes. Wooden handrails in oak, beech or walnut are possible.',
      ],
      bullets: [
        'All-glass railings with point fixing',
        'French balconies as a slender glass solution',
        'Balustrade glazing for galleries and stairwells',
        'Lateral clamping-profile solutions',
        'Optional wooden handrail (oak, beech, walnut)',
        'Structurally verified to DIN 18008',
      ],
    },
    'antike-fenster': {
      title: 'Restoring antique windows',
      short: 'Keep the character, regain the warmth.',
      intro:
        'Glazing-bar windows, barn windows and historic glazing – expertly renewed.',
      description: [
        'Antique windows are part of a building’s history. We replace blind or cracked panes, renew glazing bars and adapt the glazing to today’s requirements – without losing the original character.',
        'We also make complete reproductions of old barn windows, loft windows or church windows to measure.',
      ],
      bullets: [
        'Glazing of historic glazing-bar windows',
        'Barn and loft windows after the old model',
        'Repairing and cleaning leaded glazing',
        'Careful handling of listed heritage fabric',
      ],
    },
  },
  la: {
    duschkabinen: {
      title: 'Cellae balneares vitreae',
      short: 'Ad mensuram factae, sine margine, perfecte imperviae.',
      intro:
        'Cellae amplae adeundae vel angulares tenues – ad unguem spatio tuo factae.',
      description: [
        'Unaquaeque cella unica est. In loco metimur, crassitudinem vitri, ferramenta et superficiem tecum deliberamus – et munde collocamus, sine ulla de impervietate transactione.',
        'Pro voluntate vitro claro, superficie satinata vel vitro cano tincto ad speciem quietam ac modernam. Vitrum securitatis (ESG) usitatum est.',
      ],
      bullets: [
        'Solutiones adeundae, angulares vel U-formes',
        'Cellae ex vero vitro – sine margine, plene conglutinatae',
        'Clarum, satinatum, tinctum, impressio digitalis, speculatio partim vel tota',
        'Ferramenta ex chalybe inoxidabili vel nigra',
        'Vitrum securitatis unius laminae (ESG) secundum DIN EN 12150',
        'Laminae substitutae pro ostiis balneis exsistentibus',
      ],
    },
    glastueren: {
      title: 'Ostia vitrea & parietes',
      short: 'Spatia divide neque lucem aufer.',
      intro:
        'Ostia vitrea versatilia, ostia utrimque patentia et parietes ad altitudinem conclavis – elegantes, firmi, apte inserti.',
      description: [
        'Ostium vitreum ordinem creat neque conclave minuit. Locum ferramentorum, partem claudendi et formam manubrii tecum disponimus.',
        'Sive ostium versatile officio, sive ostium utrimque patens vestibulo, sive vitrum fixum ad altitudinem conclavis ut scalarum saeptum – integrum praebemus et collocamus.',
      ],
      bullets: [
        'Ostia versatilia et utrimque patentia cum ferramentis pretiosis',
        'Ostia tota vitrea incluso margine ligneo vel aluminio',
        'Ostia vitrea labentia cum tramite in tecto vel pariete',
        'Systemata tota vitrea officiis, medicis, tabernis',
        'Vitra fixa ad altitudinem conclavis et parietes',
        'Clarum, satinatum vel propriis figuris',
        'ESG / vitrum compactum pro postulatione statica',
      ],
    },
    vordaecher: {
      title: 'Protecta & tegmina',
      short: 'Margo clarus. Tempestatibus impervium. Per annos.',
      intro:
        'Protecta ianuae et tegmina subdialia ex chalybe pulvere obducto cum vitro compacto securitatis.',
      description: [
        'Protectum ianuam tuam tuetur et introitui indolem dat. Staticam, aquae deductionem et fixuram proprie frontis tuae causa disponimus.',
        'Adhibetur vitrum compactum securitatis (VSG), clarum vel satinatum. Compages pulvere obducta colore quem eligis – usitatum est nigrum profundum mattum.',
      ],
      bullets: [
        'Protecta ianuae omni latitudine',
        'Tegmina subdialia et introituum ex vero vitro vel acrylo',
        'Compages ex chalybe pulvere obducta',
        'Vitrum compactum securitatis (VSG), clarum vel satinatum',
        'Inclusa statica, fixura et aquae deductio',
      ],
    },
    treppengelaender: {
      title: 'Cancelli scalarum & plutei',
      short: 'Securitas quae spatium aperit.',
      intro:
        'Cancelli toti vitrei scalis, podiis et pluteis – cum manubrio ligneo vel sine eo.',
      description: [
        'Cancelli vitrei conclavia aëria reddunt et lucem diurnam impeditam non transmittunt. Crassitudinem vitri licitam pro genere cancellorum et altitudine casus computamus.',
        'Fixura punctalis per fulcra vitri ex chalybe inoxidabili vel comprehensio lateralis – pro architectura et voluntate. Manubria lignea ex quercu, fago vel iuglande fieri possunt.',
      ],
      bullets: [
        'Cancelli toti vitrei cum fixura punctali',
        'Maeniana Gallica ut solutio vitrea tenuis',
        'Vitra plutealia podiis et scalarum aedibus',
        'Solutiones lateralis comprehensionis',
        'Manubrium ligneum pro arbitrio (quercus, fagus, iuglans)',
        'Statice comprobatum secundum DIN 18008',
      ],
    },
    'antike-fenster': {
      title: 'Fenestrae antiquae restitutae',
      short: 'Indolem serva, calorem recipe.',
      intro:
        'Fenestrae cancellatae, fenestrae stabuli et vitra historica – perite renovata.',
      description: [
        'Fenestrae antiquae pars historiae domus sunt. Laminas caecas vel ruptas mutamus, cancellos renovamus et vitrum ad hodierna postulata accommodamus – sine indolis pristinae iactura.',
        'Etiam integras fenestras stabuli, horrei vel templi veteris ad exemplum vetus ad mensuram conficimus.',
      ],
      bullets: [
        'Vitratio fenestrarum cancellatarum historicarum',
        'Fenestrae stabuli et horrei ad exemplum vetus',
        'Vitra plumbea reficere et purgare',
        'Cura substantiae monumento tutae',
      ],
    },
  },
};

export function localizeService(s: Service, lang: Lang): Service {
  if (lang === 'de') return s;
  const o = overlay[lang]?.[s.slug];
  return o ? { ...s, ...o } : s;
}

/** Alle Leistungen in der aktuellen Sprache. */
export function useServices(): Service[] {
  const lang = useLang();
  return base.map((s) => localizeService(s, lang));
}

/** Eine Leistung per Slug in der aktuellen Sprache. */
export function useService(slug: string | undefined): Service | undefined {
  const lang = useLang();
  const s = base.find((x) => x.slug === slug);
  return s ? localizeService(s, lang) : undefined;
}
