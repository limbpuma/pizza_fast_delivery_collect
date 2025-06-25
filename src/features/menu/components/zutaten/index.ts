// Phase 3 Zutaten Components - Ingredients System
export { default as ZutatenPreview } from './ZutatenPreview';
export { default as ZutatenExpanded } from './ZutatenExpanded';
export { default as ZutatenCategory } from './ZutatenCategory';

// Types
export type { 
  ZutatOption, 
  ZutatCategory, 
  ZutatenSelection,
  ZutatenCategoryGroup,
  ZutatenPreviewProps,
  ZutatenExpandedProps,
  ZutatenCategoryProps
} from './types';

// Mock Data
export { 
  mockZutatenData, 
  getPopularZutaten, 
  categorizeZutaten, 
  categoryLabels 
} from './mockData';
