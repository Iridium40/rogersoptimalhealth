export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
};

export const posts: BlogPost[] = [
  {
    slug: "eating-right-on-glp1",
    title: "Eating Right on GLP-1s",
    excerpt:
      "Practical nutrition tips to feel great and sustain progress while on GLP‑1 medications.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "drinking-enough-water",
    title: "Drinking Enough Water",
    excerpt:
      "Why hydration matters for energy, appetite, and overall health—plus easy ways to hit your goal.",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2Fd0195bb19ac44a7a9e95332565ec3727?format=webp&width=800",
  },
  {
    slug: "getting-enough-sleep",
    title: "Getting Enough Sleep",
    excerpt:
      "Sleep is a superpower for weight loss and health—here’s how to improve your nightly routine.",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fa42b6f9ec53e4654a92af75aad56d14f%2F155c7ececc0848188255f02e0c732cc6?format=webp&width=800",
  },
  {
    slug: "right-portions",
    title: "Eating the Right Portions",
    excerpt:
      "Simple portion strategies that keep you satisfied and on‑plan without the guesswork.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "enough-protein",
    title: "Eating Enough Protein",
    excerpt:
      "How much protein you need, best sources, and easy ways to hit your target daily.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "meditation-healthy-movement",
    title: "Meditation and Healthy Movement",
    excerpt:
      "Reduce stress and build consistent movement with short, sustainable practices.",
    image:
      "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&w=1200&q=80",
  },
];
