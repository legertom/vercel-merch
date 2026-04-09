export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in cents
  images: string[];
  category: "apparel" | "accessories" | "stickers";
  sizes?: string[];
  featured: boolean;
};

export const products: Product[] = [
  {
    id: "ship-it-tee",
    slug: "ship-it-tee",
    name: '"Ship It" Tee',
    description:
      "A black t-shirt for developers who ship. Features the iconic Vercel triangle and \"Ship It\" on the front. 100% cotton, pre-shrunk, comfortable fit.",
    price: 3500,
    images: ["/products/ship-it-tee.svg"],
    category: "apparel",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "nextjs-hoodie",
    slug: "nextjs-hoodie",
    name: "Next.js Hoodie",
    description:
      "Stay warm while you build. Premium black hoodie with the Next.js logo embroidered on the chest. Heavyweight fleece, kangaroo pocket, ribbed cuffs.",
    price: 7500,
    images: ["/products/nextjs-hoodie.svg"],
    category: "apparel",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "edge-function-tee",
    slug: "edge-function-tee",
    name: "Edge Function Tee",
    description:
      'White tee with "Running on the Edge" tagline. For developers who deploy globally. 100% organic cotton, relaxed fit.',
    price: 3500,
    images: ["/products/edge-function-tee.svg"],
    category: "apparel",
    sizes: ["S", "M", "L", "XL"],
    featured: false,
  },
  {
    id: "vercel-triangle-cap",
    slug: "vercel-triangle-cap",
    name: "Vercel Triangle Cap",
    description:
      "Black snapback with the embroidered Vercel triangle. Adjustable strap, structured crown, curved brim. One size fits all.",
    price: 3000,
    images: ["/products/vercel-triangle-cap.svg"],
    category: "accessories",
    sizes: undefined,
    featured: true,
  },
  {
    id: "framework-sticker-pack",
    slug: "framework-sticker-pack",
    name: "Framework Sticker Pack",
    description:
      "Pack of 6 die-cut vinyl stickers featuring Next.js, Vercel, Turborepo, v0, AI SDK, and SWR logos. Waterproof, UV-resistant. Perfect for laptops.",
    price: 1200,
    images: ["/products/framework-sticker-pack.svg"],
    category: "stickers",
    featured: false,
  },
  {
    id: "deploy-friday-mug",
    slug: "deploy-friday-mug",
    name: '"Deploy Friday" Mug',
    description:
      'Black ceramic mug with "I Deploy on Fridays" in white text. 11oz, microwave and dishwasher safe. For the brave.',
    price: 2000,
    images: ["/products/deploy-friday-mug.svg"],
    category: "accessories",
    featured: true,
  },
  {
    id: "v0-crewneck",
    slug: "v0-crewneck",
    name: "v0 Crewneck",
    description:
      'Charcoal crewneck sweater with minimalist "v0" branding. French terry fabric, ribbed trim, relaxed fit. The AI-powered developer\'s uniform.',
    price: 6500,
    images: ["/products/v0-crewneck.svg"],
    category: "apparel",
    sizes: ["S", "M", "L", "XL"],
    featured: false,
  },
  {
    id: "serverless-socks",
    slug: "serverless-socks",
    name: "Serverless Socks",
    description:
      "Black crew socks with a subtle pattern of tiny Vercel triangles. Cushioned sole, reinforced toe and heel. No servers required.",
    price: 1500,
    images: ["/products/serverless-socks.svg"],
    category: "accessories",
    sizes: ["S/M", "L/XL"],
    featured: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
