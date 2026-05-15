export type Perfume = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  fragranceFamily: string;
  price: number;
  size: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  mood: string;
  heroAccent: string;
};

export const perfumes: Perfume[] = [
  {
    id: "p-001",
    slug: "nocturne-gold",
    name: "Nocturne Gold",
    tagline: "Amber light for evening rituals.",
    description:
      "A deep amber signature with saffron sparkle, midnight rose, and a warm suede trail.",
    story:
      "Crafted for candlelit dinners and black-tie entrances, Nocturne Gold opens with luminous spice before unfolding into a velvet floral core.",
    fragranceFamily: "Amber Floral",
    price: 185000,
    size: "100ml Extrait",
    topNotes: ["Saffron", "Pink pepper", "Bergamot"],
    heartNotes: ["Turkish rose", "Jasmine sambac", "Orris"],
    baseNotes: ["Amber resin", "Suede", "Vanilla bean"],
    mood: "Opulent, intimate, unforgettable",
    heroAccent: "rgba(255, 121, 176, 0.18)",
  },
  {
    id: "p-002",
    slug: "ivory-bloom",
    name: "Ivory Bloom",
    tagline: "A radiant white floral with restraint.",
    description:
      "Elegant and airy, blending neroli brightness with creamy tuberose and cashmere musk.",
    story:
      "Ivory Bloom captures the feeling of silk curtains, clean skin, and a bouquet arranged with architectural precision.",
    fragranceFamily: "White Floral Musk",
    price: 165000,
    size: "75ml Eau de Parfum",
    topNotes: ["Neroli", "Pear blossom", "Mandarin"],
    heartNotes: ["Tuberose", "Orange flower", "Magnolia"],
    baseNotes: ["Cashmere musk", "White sandalwood", "Benzoin"],
    mood: "Soft, refined, luminous",
    heroAccent: "rgba(255, 182, 213, 0.18)",
  },
  {
    id: "p-003",
    slug: "velvet-ember",
    name: "Velvet Ember",
    tagline: "Smoky woods wrapped in polished spice.",
    description:
      "A cinematic blend of incense, cocoa husk, cedar smoke, and aged patchouli.",
    story:
      "Velvet Ember was designed for collectors who want richness without noise, with smoke and spice settling into a tailored woody finish.",
    fragranceFamily: "Woody Spiced",
    price: 210000,
    size: "100ml Parfum Intense",
    topNotes: ["Cardamom", "Black tea", "Clove bud"],
    heartNotes: ["Incense", "Cacao husk", "Labdanum"],
    baseNotes: ["Atlas cedar", "Patchouli", "Tonka"],
    mood: "Bold, polished, cinematic",
    heroAccent: "rgba(255, 102, 163, 0.18)",
  },
  {
    id: "p-004",
    slug: "celestial-oud",
    name: "Celestial Oud",
    tagline: "Rare woods with a modern halo.",
    description:
      "A sleek oud interpretation cut with plum nectar, iris smoke, and mineral amber.",
    story:
      "Celestial Oud balances tradition and minimalism, bringing a rare wood accord into a cool, contemporary silhouette.",
    fragranceFamily: "Oud Amber",
    price: 240000,
    size: "100ml Extrait",
    topNotes: ["Plum nectar", "Elemi", "Cracked coriander"],
    heartNotes: ["Oud accord", "Iris smoke", "Violet leaf"],
    baseNotes: ["Mineral amber", "Guaiac wood", "Musk"],
    mood: "Rare, magnetic, modern",
    heroAccent: "rgba(255, 142, 194, 0.18)",
  },
];

export function getPerfumeBySlug(slug: string) {
  return perfumes.find((perfume) => perfume.slug === slug);
}
