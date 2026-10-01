export const features = {
  shape: false,
  flythrough: false,
  preloader: false,
  bloom: false,
  blog: false,
  contactForm: false,
  analytics: false,
  viewTransitions: false,
} as const;

export type Feature = keyof typeof features;
