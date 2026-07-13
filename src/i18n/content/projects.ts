import { projects as base, type Project } from '../../data/projects';
import { useLang } from '../LanguageContext';
import type { Lang } from '../index';

/** Übersetzbare Textfelder eines Projekts (Bilder/Layout bleiben sprachneutral). */
type ProjectText = Pick<Project, 'title' | 'category' | 'teaser' | 'facts' | 'story'>;

/**
 * EN/LA-Übersetzungen der Projekte, je id. Deutsch kommt aus der Basis
 * (src/data/projects.ts). Latein ist sorgfältig, aber maschinell erstellt
 * und zur muttersprachlichen Prüfung gedacht; für Glas-Fachbegriffe stehen
 * sinngemäße Umschreibungen.
 */
const overlay: Record<'en' | 'la', Record<string, ProjectText>> = {
  en: {
    'dusche-schulstrasse': {
      title: 'Shower under the roof',
      category: 'Shower glazing · Merkendorf',
      teaser: 'Two panes, not a single right angle – grey glass follows the old timberwork.',
      facts: [
        { label: 'Glass', value: 'Parsol grey ESG, 8 + 10 mm' },
        { label: 'Door leaf', value: '753 × 1455 mm, corner bevel' },
        { label: 'Side panel', value: '705 × 1158 mm, 5 angles' },
        { label: 'Edges', value: 'polished, R8 / R10' },
      ],
      story: [
        'A bathroom in the attic, an exposed beam from 1780 running across the room – and a shower meant to fit exactly into it. Not one angle in this niche is a right angle: the roof slope drops over the bench, the walls lean slightly out of true.',
        'It starts with the survey. Every edge is measured on site to the millimetre and translated into a technical drawing: the door leaf gets a corner bevel for the beam and milled recesses for the hinges, the side panel follows the slope with five angles – 101.7°, 129.3°, 87.5° instead of 90°.',
        'It was made in grey-tinted toughened safety glass (Parsol grey), edges polished, inner radii CNC-milled. With tinted ESG there is no second attempt: once toughened, nothing can be reworked.',
        'The installation is almost unspectacular then – if the drawing is right. Both panes sat at the first fitting. What remains is a shower that looks as if it had always been part of the old roof structure.',
      ],
    },
    'walk-in-dusche': {
      title: 'Walk-in from a single piece',
      category: 'Shower enclosure',
      teaser: 'A frameless real-glass shower – one clean cut through the bathroom.',
      facts: [
        { label: 'Glass', value: 'ESG to DIN EN 12150' },
        { label: 'Type', value: 'frameless, walk-in' },
        { label: 'Fittings', value: 'stainless steel' },
      ],
      story: [
        'A walk-in shower thrives on barely being seen: no frame, no profiles, just a glass surface that orders the room without dividing it.',
        'For that to work, everything else has to be right – the survey at wall and floor, the glass thickness for the free-standing edge, the position of the stabilisers. Every detail is planned in advance; installation takes only a few hours.',
        'The result: a bathroom that feels larger than before, and a shower you can clean with a single wipe.',
      ],
    },
    'treppen-bruestung': {
      title: 'Stairs without bars',
      category: 'Fall protection · Stairs',
      teaser: 'A frameless glass balustrade as fall protection – the view stays open, the stairs free.',
      facts: [
        { label: 'Function', value: 'fall protection, stairs' },
        { label: 'Type', value: 'balustrade glazing, frameless' },
        { label: 'Structure', value: 'to DIN 18008' },
      ],
      story: [
        'Where the stairs lead into the open living level, the building code requires fall protection – classic railing bars would have cut up the view. Here a frameless glass balustrade takes on that task.',
        'The pane is designed as fall protection to DIN 18008, cleanly held at the top and fitted to stairs and wall to the millimetre. The sightline across both levels remains – the stairs look as if they had never needed a railing.',
      ],
    },
    vordach: {
      title: 'Canopy with a clean edge',
      category: 'Canopy & roofing',
      teaser: 'Grey-tinted laminated glass on powder-coated steel – weather protection without frills.',
      facts: [
        { label: 'Glass', value: 'laminated glass, grey-tinted' },
        { label: 'Structure', value: 'steel, deep matt black' },
        { label: 'Scope', value: 'incl. structural design & installation' },
      ],
      story: [
        'A canopy is the first thing visitors touch of a house – and often the last thing thought of during construction.',
        'Here it became a statement: grey-tinted laminated safety glass on a powder-coated steel structure, fixing and drainage hidden in the façade. The grey tone takes the hardness out of the glass and softens the incoming light. Planned including structural design, installed in a single morning.',
      ],
    },
    kuechenrueckwand: {
      title: 'Print behind glass',
      category: 'Kitchen splashback',
      teaser: 'Printed glass instead of a tiled splashback – seamless and wipe-clean.',
      facts: [
        { label: 'Glass', value: 'ESG, reverse-printed (glass print)' },
        { label: 'Cut-outs', value: 'sockets CNC-milled' },
      ],
      story: [
        'A kitchen splashback in printed glass replaces the tiled wall with a single seamless surface – the colour or motif is printed directly behind the glass, not painted on.',
        'Sockets and transitions are measured in advance and cut out with CNC precision. It is bonded over the full surface: no visible brackets, nothing for grease to settle in.',
      ],
    },
    vitrine: {
      title: 'Display case made to measure',
      category: 'Furniture & special builds',
      teaser: 'Glass on a mitre – craftsmanship from the workshop.',
      facts: [
        { label: 'Type', value: 'all-glass, UV-bonded' },
        { label: 'Made in', value: 'our own workshop' },
      ],
      story: [
        'Not everything we build is a component – some of it is furniture. This display case was made entirely in the workshop: cutting, edge polishing, UV bonding on a mitre.',
        'No frames, no screws. Just glass surfaces meeting so precisely that the adhesive stays invisible.',
      ],
    },
    gelaender: {
      title: 'A balustrade without barrier',
      category: 'Stair railing',
      teaser: 'An all-glass railing – safety that opens up the room.',
      facts: [
        { label: 'Structure', value: 'to DIN 18008' },
        { label: 'Fixing', value: 'stainless-steel point holders' },
      ],
      story: [
        'A gallery with a glass balustrade instead of wooden balusters: daylight falls unbroken right down to the ground floor, and the safety is structurally proven.',
        'Glass thickness and fixing were calculated for the fall height, the panes mounted on stainless-steel point holders – slender in appearance, uncompromising in substance.',
      ],
    },
    'dusche-musterwand': {
      title: 'Walk-in before a patterned wall',
      category: 'Walk-in shower',
      teaser: 'Frameless glass before a playfully patterned wall – the pattern stays the star.',
      facts: [
        { label: 'Glass', value: 'ESG, clear – frameless' },
        { label: 'Type', value: 'walk-in, floor-level' },
        { label: 'Fittings', value: 'matt black' },
        { label: 'Edges', value: 'polished' },
      ],
      story: [
        'This shower lives off its back wall: a large, vividly and playfully veined surface that works like a painting. A framed enclosure would have cut up the pattern – so the glass stays frameless and clear, a single pane that holds the water and shows the pattern.',
        'Made of toughened safety glass with polished edges, the fittings matt black, matched to the rain shower. Built in at floor level, without a threshold: you simply step in, the room flows on.',
        'Frameless also means hardly any profiles for limescale and dirt to settle in. One surface, one wipe – and the playful patterned wall stays centre stage.',
      ],
    },
    'dusche-aus-alt-mach-neu': {
      title: 'Out with the old',
      category: 'Shower glazing · Modernisation',
      teaser: 'A new real-glass shower in the existing bathroom – modernised, not torn out.',
      facts: [
        { label: 'Glass', value: 'ESG, clear' },
        { label: 'Type', value: 'corner enclosure, real glass' },
        { label: 'Fittings', value: 'polished chrome' },
        { label: 'Benefit', value: 'modernisation without a full refit' },
      ],
      story: [
        'Not every bathroom has to come out to feel new. Here the tiles and the room stayed – what changed everything was the new shower: a clear real-glass corner with polished-chrome fittings that gives the familiar bathroom a fresh, modern look.',
        'The toughened safety glass is measured to the existing build so the panes meet wall and tile grid cleanly. Old and new come together into a coherent whole – without rubble and weeks of building site.',
        'Low entry, hardly any profiles, easy to clean: the shower brings today’s comfort into yesterday’s bathroom.',
      ],
    },
    'dusche-holzoptik': {
      title: 'Shower in a wood look',
      category: 'Walk-in shower',
      teaser: 'Frameless glass before wood-effect tiles – a natural feel that copes with water.',
      facts: [
        { label: 'Glass', value: 'ESG, clear – frameless' },
        { label: 'Type', value: 'walk-in with window' },
        { label: 'Fittings', value: 'matt black' },
      ],
      story: [
        'Everyone wants wood in the bathroom, but the water does not. Wood-effect tiles resolve that – and the frameless glass shower in front lets the warm grain work undisturbed, right up to the window.',
        'Clear toughened safety glass, matt black fittings, a floor-level entry: the shower orders the room without blocking it. The daylight from the window falls unbroken across the whole surface.',
      ],
    },
    'dusche-holz-verbindung': {
      title: 'Natural wood holds the glass',
      category: 'Shower glazing · Attic',
      teaser: 'A natural-wood strut connects glass and roof slope – support and eye-catcher in one.',
      facts: [
        { label: 'Connection', value: 'strut of solid natural wood' },
        { label: 'Glass', value: 'ESG, clear' },
        { label: 'Type', value: 'made to measure, fitted to the slope' },
        { label: 'Edges', value: 'polished' },
      ],
      story: [
        'The eye-catcher of this shower is not a fitting but a piece of nature: a strut of solid wood connects the glass pane to the wall and braces it under the roof slope. Where a stainless-steel bar usually sits, a grown piece of wood takes over – warm, distinctive, a true one-off.',
        'For that to carry, the glass has to be measured exactly to wood and slope: the pane of toughened safety glass is made to measure, the edges polished, the seat for the wooden strut set to the millimetre. The wood both carries and shapes.',
        'So a difficult corner under the roof slope becomes a full shower place – and the union of clear glass and warm wood becomes the character of the whole bathroom.',
      ],
    },
    'dusche-grau-wanne': {
      title: 'Bath and shower behind glass',
      category: 'Shower glazing',
      teaser: 'A clear pane orders a bathroom with bath and shower – dry stays dry.',
      facts: [
        { label: 'Glass', value: 'ESG, clear' },
        { label: 'Type', value: 'shower screen' },
        { label: 'Fittings', value: 'stainless steel / black' },
      ],
      story: [
        'Bath and shower in the same room, plus a window that sets the space: here a clear glass pane sorts the bathroom, holds the spray where it belongs, and still lets the light reach everywhere.',
        'The toughened safety glass stands slim and almost invisible between the zones. No curtain, no broad profiles – just glass you barely see and clean with a single wipe.',
      ],
    },
    'dusche-naturstein': {
      title: 'Walk-in in a natural-stone look',
      category: 'Walk-in shower',
      teaser: 'Large-format stone-look tiles, frameless glass in front – calm and generous.',
      facts: [
        { label: 'Glass', value: 'ESG, clear – frameless' },
        { label: 'Type', value: 'walk-in, floor-level' },
        { label: 'Fittings', value: 'stainless-steel look, PVD-coated' },
        { label: 'Edges', value: 'polished' },
      ],
      story: [
        'Large-format tiles in a natural-stone and marble look give this bathroom its calm generosity. The shower should not interrupt them – so in front stands a frameless pane of clear glass, floor-level and without a threshold.',
        'Toughened safety glass with polished edges, stainless-steel-look fittings (PVD-coated), few joints: not only beautiful, but practical too – large surfaces that are quick to clean, and an entry without a trip edge.',
      ],
    },
    'dusche-holzrahmen': {
      title: 'Glass in a timber frame',
      category: 'Walk-in shower · Attic',
      teaser: 'Heavy beams hold the panes – planned without dirt-prone seals.',
      facts: [
        { label: 'Glass', value: 'ESG, clear – frameless' },
        { label: 'Installation', value: 'in a solid timber frame' },
        { label: 'Special feature', value: 'without rubber seals' },
        { label: 'Edges', value: 'polished' },
      ],
      story: [
        'Heavy timber beams frame this walk-in shower – clear toughened safety glass with polished edges, fitted into wood rather than aluminium profiles.',
        'With a little planning, dirt-prone seals can be dispensed with entirely: every edge was calculated in advance so glass, wood and tile meet without rubber profiles.',
      ],
    },
    'loft-schiebetuer': {
      title: 'Sliding door in loft style',
      category: 'Glass sliding door · Living space',
      teaser: 'Black-framed glass divides hallway and living space – without taking the light.',
      facts: [
        { label: 'Type', value: 'sliding door, black-framed (loft style)' },
        { label: 'Glass', value: 'ESG, clear' },
        { label: 'Running', value: 'top-hung, no floor track' },
        { label: 'Benefit', value: 'divides rooms without darkening them' },
      ],
      story: [
        'An open home gains from openness – and loses it to cooking smells and draughts. This loft-style sliding door closes off the hallway from the living and cooking area without building a wall: black-framed clear glass that passes view and daylight on.',
        'The glass is toughened safety glass; the black bars give the calm industrial look that suits bright new builds in particular. The door runs quietly in its rail above, while the floor stays free – no threshold to trip over.',
        'Measured, made and installed from a single source. What remains is a door that looks good open or closed.',
      ],
    },
    'loft-glastuer': {
      title: 'Glass door to the living space',
      category: 'Glass swing door · Living space',
      teaser: 'A black-framed swing door opens the hallway to the bright living space.',
      facts: [
        { label: 'Type', value: 'swing door, black-framed' },
        { label: 'Glass', value: 'ESG, clear' },
        { label: 'Function', value: 'light & view between hall and living space' },
      ],
      story: [
        'Internal hallways are often the darkest spot in the house. Here a black-framed glass door opens the way into the bright living space – and brings its daylight right into the hall.',
        'Clear toughened safety glass in a slim black frame: the door separates the zones where sound and warmth require it, but keeps light and the sightline. Against the green-painted wall the black becomes an accent.',
      ],
    },
    'glasgelaender-galerie': {
      title: 'Glass balustrade on the gallery',
      category: 'Fall protection · Gallery',
      teaser: 'Frameless glass secures the gallery – the view through the void stays open.',
      facts: [
        { label: 'Function', value: 'fall protection, gallery' },
        { label: 'Type', value: 'glass balustrade, frameless' },
        { label: 'Structure', value: 'designed to DIN 18008' },
        { label: 'Handrail', value: 'continuous' },
      ],
      story: [
        'Where a gallery juts into the open void, the code requires fall protection. Bars or grids would have cut up the tall, bright room – here frameless glass takes on the task.',
        'The panes are designed as fall protection to DIN 18008 and held by a continuous handrail. The view through the void and across the large windows stays open – the safety is structurally proven.',
      ],
    },
    'spiegel-nach-mass': {
      title: 'Mirror before the floral wallpaper',
      category: 'Mirror made to measure · Bathroom',
      teaser: 'A frameless mirror, fitted to the wall to the millimetre – depth for a small bathroom.',
      facts: [
        { label: 'Type', value: 'crystal mirror made to measure' },
        { label: 'Edges', value: 'polished' },
        { label: 'Mounting', value: 'seamless, no visible brackets' },
      ],
      story: [
        'A dark floral wallpaper makes the bathroom cosy – and swallows light. A mirror made to measure gives it back: it doubles the window, widens the room and stages the wallpaper at the same time.',
        'The mirror is cut to the wall surface to the millimetre, the edges polished, mounted without visible brackets. A calm glass surface, edgeless – nothing distracts from the reflection.',
      ],
    },
    'kamin-bodenplatte': {
      title: 'Spark protection in glass',
      category: 'Stove floor plate · Glass',
      teaser: 'A clear glass plate protects the wooden floor in front of the stove – and stays almost invisible.',
      facts: [
        { label: 'Glass', value: 'ESG, clear – toughened' },
        { label: 'Shape', value: 'made to measure, rounded corners' },
        { label: 'Edges', value: 'polished' },
        { label: 'Benefit', value: 'protects the floor without hiding it' },
      ],
      story: [
        'A wood stove needs a fireproof surface in front of its door – classically of steel or stone, which hides the beautiful wooden floor. In glass this protection almost disappears: the clear plate shows the boards beneath and still catches every spark and ember.',
        'Made of toughened safety glass, cut to measure, the corners rounded and the edges polished – nothing to catch on. It is laid in minutes and cleaned with a single wipe.',
      ],
    },
  },
  la: {
    'dusche-schulstrasse': {
      title: 'Cella sub tecto',
      category: 'Vitratio balnei · Merkendorf',
      teaser: 'Duae laminae, nullus angulus rectus – vitrum canum trabem veterem sequitur.',
      facts: [
        { label: 'Vitrum', value: 'Parsol canum ESG, 8 + 10 mm' },
        { label: 'Valva', value: '753 × 1455 mm, angulus obliquus' },
        { label: 'Latus', value: '705 × 1158 mm, 5 anguli' },
        { label: 'Margines', value: 'politi, R8 / R10' },
      ],
      story: [
        'Balneum sub tecto, trabs anni 1780 per conclave transiens – et cella quae illuc apte inserenda est. Nullus angulus huius loci rectus est: tectum supra scamnum cadit, parietes leviter ex perpendiculo vergunt.',
        'Initium est mensura. Quaeque ora in loco ad unguem capitur et in descriptionem technicam transfertur: valva angulum obliquum trabi accipit et cavernas cardinibus excisas, latus quinque angulis declivitatem sequitur – 101,7°, 129,3°, 87,5° pro 90°.',
        'Confecta est ex vitro securitatis cano tincto (Parsol canum), marginibus politis, radiis internis machina excisis. In vitro tincto ESG secundus conatus non datur: post indurationem nihil reficitur.',
        'Collocatio paene sine spectaculo est – si descriptio recta est. Ambae laminae primo statim insederunt. Manet cella quae videtur semper pars veteris tecti fuisse.',
      ],
    },
    'walk-in-dusche': {
      title: 'Adeunda ex uno',
      category: 'Cella balnearis',
      teaser: 'Cella ex vero vitro sine margine – sectio una munda per balneum.',
      facts: [
        { label: 'Vitrum', value: 'ESG secundum DIN EN 12150' },
        { label: 'Genus', value: 'sine margine, adeunda' },
        { label: 'Ferramenta', value: 'chalybs inoxidabilis' },
      ],
      story: [
        'Cella adeunda eo vivit quod vix cernitur: nullus margo, nulla regula, sola superficies vitrea quae conclave ordinat neque dividit.',
        'Ut id fiat, cetera recta esse debent – mensura ad parietem et solum, crassitudo vitri orae liberae, locus fulcrorum. Singula ante disponuntur, collocatio paucis horis fit.',
        'Eventus: balneum quod maius quam antea videtur, et cella quae uno detersu purgatur.',
      ],
    },
    'treppen-bruestung': {
      title: 'Scalae sine virgis',
      category: 'Tutela casus · Scalae',
      teaser: 'Pluteus vitreus sine margine ut tutela casus – prospectus liber, scalae apertae.',
      facts: [
        { label: 'Munus', value: 'tutela casus, scalae' },
        { label: 'Genus', value: 'vitratio plutealis, sine margine' },
        { label: 'Statica', value: 'secundum DIN 18008' },
      ],
      story: [
        'Ubi scalae in tabulatum apertum ferunt, lex tutelam casus poscit – virgae usitatae prospectum discidissent. Hic pluteus vitreus sine margine hoc munus suscipit.',
        'Lamina ut tutela casus secundum DIN 18008 instructa est, supra munde comprehensa et ad scalas parietemque ad unguem inserta. Linea prospectus per ambo tabulata manet – scalae videntur numquam cancellis eguisse.',
      ],
    },
    vordach: {
      title: 'Protectum margine claro',
      category: 'Protectum & tegmen',
      teaser: 'Vitrum compactum canum tinctum super chalybe pulvere obducto – tutela tempestatis sine ornatu.',
      facts: [
        { label: 'Vitrum', value: 'vitrum compactum, canum tinctum' },
        { label: 'Compages', value: 'chalybs, nigrum profundum mattum' },
        { label: 'Opera', value: 'incl. statica & collocatio' },
      ],
      story: [
        'Protectum primum est quod hospites domus tangunt – et saepe ultimum de quo inter aedificandum cogitatur.',
        'Hic factum est testimonium: vitrum compactum securitatis canum tinctum super compage chalybea pulvere obducta, fixura et aquae deductio in fronte occultae. Color canus duritiem vitro adimit et lucem incidentem mitigat. Dispositum cum statica, collocatum uno mane.',
      ],
    },
    kuechenrueckwand: {
      title: 'Impressio post vitrum',
      category: 'Paries culinae',
      teaser: 'Vitrum impressum pro pariete tessellato – sine iuncturis et facile detergendum.',
      facts: [
        { label: 'Vitrum', value: 'ESG, a tergo impressum (impressio vitrea)' },
        { label: 'Excisiones', value: 'receptacula machina excisa' },
      ],
      story: [
        'Paries culinae ex vitro impresso parietem tessellatum una superficie sine iunctura mutat – color vel figura post vitrum directe imprimitur, non illinitur.',
        'Receptacula et transitus ante metiuntur et machinae subtilitate exciduntur. Tota superficie conglutinatur: nulla fulcra conspicua, nihil ubi pinguedo insidat.',
      ],
    },
    vitrine: {
      title: 'Armarium vitreum ad mensuram',
      category: 'Supellex & opera propria',
      teaser: 'Vitrum in obliquo iunctum – ars ex officina.',
      facts: [
        { label: 'Genus', value: 'totum vitreum, UV-conglutinatum' },
        { label: 'Confectio', value: 'officina propria' },
      ],
      story: [
        'Non omnia quae facimus pars sunt aedificii – quaedam supellex est. Hoc armarium totum in officina factum est: sectio, marginum politio, conglutinatio UV in obliquo.',
        'Nulli margines, nullae claves. Solae superficies vitreae tam subtiliter coniunctae ut gluten invisibile maneat.',
      ],
    },
    gelaender: {
      title: 'Pluteus sine obice',
      category: 'Cancelli scalarum',
      teaser: 'Cancelli toti vitrei – securitas quae conclave aperit.',
      facts: [
        { label: 'Statica', value: 'secundum DIN 18008' },
        { label: 'Fixura', value: 'fulcra punctalia ex chalybe inoxidabili' },
      ],
      story: [
        'Podium cum pluteo vitreo pro stipitibus ligneis: lux diurna ad imum tabulatum impedita cadit, securitas statice comprobata est.',
        'Crassitudo vitri et fixura pro altitudine casus computatae sunt, laminae fulcris punctalibus ex chalybe inoxidabili collocatae – tenues aspectu, integrae substantia.',
      ],
    },
    'dusche-musterwand': {
      title: 'Adeunda ante parietem pictum',
      category: 'Cella adeunda',
      teaser: 'Vitrum sine margine ante parietem lascive pictum – figura stella manet.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum – sine margine' },
        { label: 'Genus', value: 'adeunda, ad solum' },
        { label: 'Ferramenta', value: 'nigra matta' },
        { label: 'Margines', value: 'politi' },
      ],
      story: [
        'Haec cella pariete tergi vivit: superficies ampla, vivide ac lascive venis distincta, quae ut pictura agit. Cella marginata figuram discidisset – itaque vitrum sine margine et clarum manet, lamina una quae aquam tenet et figuram ostendit.',
        'Facta ex vitro securitatis marginibus politis, ferramentis nigris mattis, ad imbrem pluvialem aptatis. Ad solum inserta, sine limine: simpliciter intras, conclave pergit.',
        'Sine margine etiam significat vix regulas ubi calx et sordes insidant. Una superficies, unus detersus – et paries pictus lascivus in medio manet.',
      ],
    },
    'dusche-aus-alt-mach-neu': {
      title: 'Ex vetere novum',
      category: 'Vitratio balnei · Renovatio',
      teaser: 'Cella nova ex vero vitro in balneo exsistente – renovata, non eruta.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum' },
        { label: 'Genus', value: 'cella angularis, verum vitrum' },
        { label: 'Ferramenta', value: 'chromate nitida' },
        { label: 'Utilitas', value: 'renovatio sine integra refectione' },
      ],
      story: [
        'Non omne balneum erui debet ut novum videatur. Hic tessellae et conclave manserunt – omnia mutavit cella nova: angulus clarus ex vero vitro cum ferramentis chromatis nitidis qui balneo noto speciem recentem ac modernam dat.',
        'Vitrum securitatis ad exsistentia metitur ut laminae parieti et ordini tessellarum munde adhaereant. Vetus et novum in totum congruum coeunt – sine rudere et hebdomadibus operis.',
        'Aditus humilis, vix regulae, facile purgandum: cella commoditatem hodiernam in balneum hesternum infert.',
      ],
    },
    'dusche-holzoptik': {
      title: 'Cella specie lignea',
      category: 'Cella adeunda',
      teaser: 'Vitrum sine margine ante tessellas ligni speciem ferentes – sensus naturae qui aquam fert.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum – sine margine' },
        { label: 'Genus', value: 'adeunda cum fenestra' },
        { label: 'Ferramenta', value: 'nigra matta' },
      ],
      story: [
        'Omnes lignum in balneo cupiunt, aqua non. Tessellae ligni speciem ferentes hoc solvunt – et cella vitrea sine margine ante eas venam calidam intactam agere sinit, usque ad fenestram.',
        'Vitrum securitatis clarum, ferramenta nigra matta, aditus ad solum: cella conclave ordinat neque obstruit. Lux diurna e fenestra impedita per totam superficiem cadit.',
      ],
    },
    'dusche-holz-verbindung': {
      title: 'Lignum naturale vitrum tenet',
      category: 'Vitratio balnei · Sub tecto',
      teaser: 'Tigillum ligni naturalis vitrum et tectum coniungit – fulcrum et oculorum esca simul.',
      facts: [
        { label: 'Coniunctio', value: 'tigillum ligni naturalis solidi' },
        { label: 'Vitrum', value: 'ESG, clarum' },
        { label: 'Genus', value: 'ad mensuram, declivitati aptatum' },
        { label: 'Margines', value: 'politi' },
      ],
      story: [
        'Oculorum esca huius cellae non ferramentum est sed pars naturae: tigillum ligni solidi laminam vitream parieti coniungit et sub declivitate fulcit. Ubi virga chalybea solet sedere, lignum natum succedit – calidum, proprium, vere unicum.',
        'Ut id ferat, vitrum exacte ad lignum et declivitatem metiendum est: lamina ex vitro securitatis ad mensuram facta, margines politi, sedes tigilli lignei ad unguem posita. Lignum et fert et format.',
        'Ita ex angulo difficili sub tecto fit plenus locus cellae – et coniunctio vitri clari et ligni calidi indoles totius balnei fit.',
      ],
    },
    'dusche-grau-wanne': {
      title: 'Alveus et cella post vitrum',
      category: 'Vitratio balnei',
      teaser: 'Lamina clara balneum cum alveo et cella ordinat – siccum siccum manet.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum' },
        { label: 'Genus', value: 'paries cellae' },
        { label: 'Ferramenta', value: 'chalybs inoxidabilis / nigrum' },
      ],
      story: [
        'Alveus et cella in eodem conclavi, praeterea fenestra quae spatium praescribit: hic lamina vitrea clara balneum disponit, aspergines ubi decet tenet, et tamen lucem ubique transmittit.',
        'Vitrum securitatis tenue et paene invisibile inter regiones stat. Nullum velum, nullae regulae latae – solum vitrum quod vix cernis et uno detersu purgas.',
      ],
    },
    'dusche-naturstein': {
      title: 'Adeunda specie lapidis naturalis',
      category: 'Cella adeunda',
      teaser: 'Tessellae amplae lapidis speciem ferentes, vitrum sine margine ante eas – quietum et amplum.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum – sine margine' },
        { label: 'Genus', value: 'adeunda, ad solum' },
        { label: 'Ferramenta', value: 'specie chalybis inoxidabilis, PVD illita' },
        { label: 'Margines', value: 'politi' },
      ],
      story: [
        'Tessellae amplae specie lapidis naturalis et marmoris huic balneo amplitudinem quietam dant. Cella eas non interrumpere debet – itaque ante stat lamina sine margine ex vitro claro, ad solum et sine limine.',
        'Vitrum securitatis marginibus politis, ferramenta specie chalybis inoxidabilis (PVD illita), paucae iuncturae: non solum pulchrum, sed etiam utile – superficies amplae celeriter purgandae, et aditus sine offensione.',
      ],
    },
    'dusche-holzrahmen': {
      title: 'Vitrum in compage lignea',
      category: 'Cella adeunda · Sub tecto',
      teaser: 'Trabes graves lamina tenent – disposita sine sigillis sordibus obnoxiis.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum – sine margine' },
        { label: 'Insertio', value: 'in compage lignea solida' },
        { label: 'Insigne', value: 'sine sigillis gummosis' },
        { label: 'Margines', value: 'politi' },
      ],
      story: [
        'Trabes graves compagem huius cellae adeundae formant – vitrum securitatis clarum marginibus politis, in ligno insertum pro regulis aluminii.',
        'Cum aliqua dispositione sigillis sordibus obnoxiis omnino carere licet: quaeque ora ante computata est, ut vitrum, lignum et tessella sine regulis gummosis conveniant.',
      ],
    },
    'loft-schiebetuer': {
      title: 'Ostium labens more loft',
      category: 'Ostium vitreum labens · Habitatio',
      teaser: 'Vitrum margine nigro vestibulum et habitationem dividit – neque lucem aufert.',
      facts: [
        { label: 'Genus', value: 'ostium labens, margine nigro (more loft)' },
        { label: 'Vitrum', value: 'ESG, clarum' },
        { label: 'Cursus', value: 'supra pendens, sine tramite in solo' },
        { label: 'Utilitas', value: 'spatia dividit neque obscurat' },
      ],
      story: [
        'Domus aperta apertura crescit – et eam nidoribus coquinae et perflatu amittit. Hoc ostium labens more loft vestibulum a regione habitandi et coquendi claudit neque parietem exstruit: vitrum clarum margine nigro quod prospectum et lucem diurnam transmittit.',
        'Vitrum est vitrum securitatis; virgae nigrae speciem quietam industrialem dant quae praesertim aedificiis novis claris convenit. Ostium tacite in tramite suo supra currit, solum liberum manet – nullum limen in quod offendas.',
        'Mensum, factum et collocatum ex uno fonte. Manet ostium quod apertum clausumque bene videtur.',
      ],
    },
    'loft-glastuer': {
      title: 'Ostium vitreum ad habitationem',
      category: 'Ostium vitreum versatile · Habitatio',
      teaser: 'Ostium versatile margine nigro vestibulum ad habitationem claram aperit.',
      facts: [
        { label: 'Genus', value: 'ostium versatile, margine nigro' },
        { label: 'Vitrum', value: 'ESG, clarum' },
        { label: 'Munus', value: 'lux & prospectus inter vestibulum et habitationem' },
      ],
      story: [
        'Vestibula interiora saepe locus domus obscurissimus sunt. Hic ostium vitreum margine nigro viam in habitationem claram aperit – et lucem eius diurnam usque in vestibulum infert.',
        'Vitrum securitatis clarum in margine nigro tenui: ostium regiones dividit ubi sonus et calor poscunt, sed lucem et lineam prospectus servat. Ante parietem viridi pictum nigrum fit accentus.',
      ],
    },
    'glasgelaender-galerie': {
      title: 'Pluteus vitreus in podio',
      category: 'Tutela casus · Podium',
      teaser: 'Vitrum sine margine podium munit – prospectus per inane apertus manet.',
      facts: [
        { label: 'Munus', value: 'tutela casus, podium' },
        { label: 'Genus', value: 'pluteus vitreus, sine margine' },
        { label: 'Statica', value: 'instructa secundum DIN 18008' },
        { label: 'Manubrium', value: 'continuum' },
      ],
      story: [
        'Ubi podium in inane apertum prominet, lex tutelam casus poscit. Virgae aut craticulae conclave altum et clarum discidissent – hic vitrum sine margine munus suscipit.',
        'Laminae ut tutela casus secundum DIN 18008 instructae sunt et manubrio continuo comprehensae. Prospectus per inane et per fenestras amplas apertus manet – securitas statice comprobata est.',
      ],
    },
    'spiegel-nach-mass': {
      title: 'Speculum ante tapetum floridum',
      category: 'Speculum ad mensuram · Balneum',
      teaser: 'Speculum sine margine, ad parietem ad unguem aptatum – profunditas balneo parvo.',
      facts: [
        { label: 'Genus', value: 'speculum crystallinum ad mensuram' },
        { label: 'Margines', value: 'politi' },
        { label: 'Affixio', value: 'sine iunctura, sine fulcris conspicuis' },
      ],
      story: [
        'Tapetum floridum obscurum balneum gratum reddit – et lucem absorbet. Speculum ad mensuram eam reddit: fenestram geminat, conclave dilatat et tapetum simul ostentat.',
        'Speculum ad superficiem parietis ad unguem sectum est, margines politi, sine fulcris conspicuis affixum. Superficies vitrea quieta, sine ora – nihil ab imagine avocat.',
      ],
    },
    'kamin-bodenplatte': {
      title: 'Tutela scintillarum ex vitro',
      category: 'Lamina foci · Vitrum',
      teaser: 'Lamina vitrea clara solum ligneum ante focum tuetur – et paene invisibilis manet.',
      facts: [
        { label: 'Vitrum', value: 'ESG, clarum – induratum' },
        { label: 'Forma', value: 'ad mensuram, anguli rotundati' },
        { label: 'Margines', value: 'politi' },
        { label: 'Utilitas', value: 'solum tuetur neque occultat' },
      ],
      story: [
        'Focus ligni superficie ignifuga ante ianuam eget – more solito ex chalybe vel lapide, quae solum ligneum pulchrum occultat. Ex vitro haec tutela paene evanescit: lamina clara tabulas infra ostendit et tamen omnem scintillam et prunam excipit.',
        'Facta ex vitro securitatis indurato, ad mensuram secta, angulis rotundatis et marginibus politis – nihil in quod haereas. Minutis imponitur et uno detersu purgatur.',
      ],
    },
  },
};

export function localizeProject(p: Project, lang: Lang): Project {
  if (lang === 'de') return p;
  const o = overlay[lang]?.[p.id];
  return o ? { ...p, ...o } : p;
}

/** Alle Projekte in der aktuellen Sprache. */
export function useLocalizedProjects(): Project[] {
  const lang = useLang();
  return base.map((p) => localizeProject(p, lang));
}

/** Ein einzelnes (deutsches Basis-)Projekt in der aktuellen Sprache. */
export function useLocalizedProject(p: Project): Project {
  return localizeProject(p, useLang());
}
