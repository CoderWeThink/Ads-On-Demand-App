import type { DockConfiguration, DockContent, DockFormat, DockPlacement } from './types';

export const defaultPlacement: DockPlacement = {
  displayId: 'primary',
  preset: 'top-right',
  normalizedX: 0.98,
  normalizedY: 0.04,
  scale: 1,
};

export const dockConfigurations: DockConfiguration[] = [
  { id: 'image', format: 'image', name: 'Image Dock', placement: { ...defaultPlacement } },
  { id: 'video', format: 'video', name: 'Video Dock', placement: { ...defaultPlacement } },
  { id: 'question', format: 'question', name: 'Quick Question', placement: { ...defaultPlacement } },
  { id: 'survey', format: 'survey', name: 'Survey Dock', placement: { ...defaultPlacement } },
];

export const dockContent: Record<DockFormat, DockContent> = {
  image: {
    id: 'creative-image-001', format: 'image', campaignId: 'local-outdoors-001', advertiser: 'Example campaign', sponsoredLabel: 'Sponsored',
    title: 'Find your next trail.', body: 'A little inspiration for your next day outside.', ctaLabel: 'Explore', ctaUrl: 'https://example.com/',
  },
  video: {
    id: 'creative-video-001', format: 'video', campaignId: 'local-video-001', advertiser: 'Example campaign', sponsoredLabel: 'Sponsored',
    title: 'A new perspective.', body: 'A local video-format demonstration.', ctaLabel: 'Learn more', ctaUrl: 'https://example.com/',
  },
  question: {
    id: 'creative-question-001', format: 'question', campaignId: 'local-question-001', advertiser: 'Example question', sponsoredLabel: 'Sponsored question',
    title: "What's your next adventure?", promptId: 'question-adventure-001', options: [
      { id: 'mountains', label: 'Mountains' }, { id: 'beaches', label: 'Beaches' },
    ],
  },
  survey: {
    id: 'creative-survey-001', format: 'survey', campaignId: 'local-survey-001', advertiser: 'Example survey', sponsoredLabel: 'Sponsored survey',
    title: 'Which topics interest you most?', promptId: 'survey-interests-001', multiple: true, options: [
      { id: 'technology', label: 'Technology' }, { id: 'gaming', label: 'Gaming' }, { id: 'outdoors', label: 'Outdoors' },
    ],
  },
};

