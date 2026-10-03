export const features = {
  world: true,
  flythrough: false,
  preloader: true,
  bloom: false,
  blog: false,
  contactForm: false,
  analytics: false,
  viewTransitions: false,
} as const;

export type Feature = keyof typeof features;
