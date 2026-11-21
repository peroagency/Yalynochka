import { TreeHeight, TreeOffer, getTreePriceTier } from '../data/trees';

export const META_PIXEL_ID = '1171402865090300';

export type ContactChannel = 'viber' | 'telegram' | 'phone';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

let lastLeadTimestamp = 0;
const LEAD_DEDUP_WINDOW_MS = 10_000;

function trackStandardEvent(
  eventName: 'AddToCart' | 'InitiateCheckout' | 'Lead',
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    return;
  }
  window.fbq('track', eventName, params);
}

export function trackMetaAddToCart(tree: TreeOffer, height: TreeHeight) {
  const tier = getTreePriceTier(tree, height);
  trackStandardEvent('AddToCart', {
    content_ids: [tree.id],
    content_name: `${tree.name} (${height})`,
    content_type: 'product',
    value: tier.salePrice,
    currency: 'UAH',
  });
}

export function trackMetaInitiateCheckout(params: {
  contentName: string;
  contentIds: string[];
  numItems: number;
  value: number;
}) {
  trackStandardEvent('InitiateCheckout', {
    content_ids: params.contentIds,
    content_name: params.contentName,
    content_type: 'product',
    num_items: params.numItems,
    value: params.value,
    currency: 'UAH',
  });
}

export function trackMetaLead(params: {
  channel: ContactChannel;
  source: 'order_modal' | 'checkout_drawer' | 'section_contacts' | 'footer_contacts';
  contentName?: string;
  contentIds?: string[];
  value?: number;
}) {
  const now = Date.now();
  if (now - lastLeadTimestamp < LEAD_DEDUP_WINDOW_MS) {
    return;
  }
  lastLeadTimestamp = now;

  const payload: Record<string, unknown> = {
    content_name: params.contentName ?? 'Консультація / замовлення ялинки',
    content_category: params.channel,
    lead_source: params.source,
  };

  if (params.contentIds && params.contentIds.length > 0) {
    payload.content_ids = params.contentIds;
    payload.content_type = 'product';
  }
  if (typeof params.value === 'number' && params.value > 0) {
    payload.value = params.value;
    payload.currency = 'UAH';
  }

  trackStandardEvent('Lead', payload);
}
