import { useEffect, useState } from 'react';
import { Check, Copy, Phone, ShoppingBag, X } from 'lucide-react';
import {
  DEFAULT_TARGET_HEIGHT,
  HEIGHT_ORDER,
  PRICE_TIERS,
  TreeHeight,
  TreeOffer,
  formatUAH,
} from '../data/trees';

export const CONTACT_LINKS = {
  viber: 'viber://chat?number=+380996584484',
  viberAdd: 'viber://add?number=380996584484',
  viberDisplay: '+38 (099) 658-44-84',
  viberRawNumber: '+380996584484',
  telegram: 'https://t.me/yalynochka_com',
  telegramHandle: '@yalynochka_com',
  phone: 'tel:+380972438419',
  phoneDisplay: '+38 (097) 243-84-19',
};

interface ContactOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTree: TreeOffer | null;
  selectedHeight?: TreeHeight;
  onOpenCartCheckout?: (tree: TreeOffer, height: TreeHeight) => void;
}

export function ContactOrderModal({
  isOpen,
  onClose,
  selectedTree,
  selectedHeight = DEFAULT_TARGET_HEIGHT,
  onOpenCartCheckout,
}: ContactOrderModalProps) {
  const [height, setHeight] = useState<TreeHeight>(selectedHeight);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    setHeight(selectedHeight);
  }, [selectedHeight, selectedTree?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tier = PRICE_TIERS[height];
  const orderText = selectedTree
    ? `Добрий день! Хочу замовити ялинку ${selectedTree.name} (${height}) по знижці −25% за ${formatUAH(tier.salePrice)} грн (оплата при отриманні).`
    : 'Добрий день! Підкажіть, будь ласка, по замовленню литої ялинки зі знижкою 25%.';

  const telegramHref = `${CONTACT_LINKS.telegram}?text=${encodeURIComponent(orderText)}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable in restricted contexts; ignore silently
    }
  };

  const handleCopyViberPhone = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_LINKS.viberRawNumber);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // Clipboard may be unavailable in restricted contexts; ignore silently
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09170f]/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={selectedTree ? 'Оберіть спосіб замовлення' : 'Контакти Ялиночка'}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#f8f6f1] text-[#112217] rounded-2xl overflow-hidden shadow-2xl border border-[#0e2216]/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0e2216] text-[#f3ead3] px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-[#e5d3a3]">
              {selectedTree ? 'Швидке оформлення замовлення' : 'Звʼязок з виробництвом'}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight">
              {selectedTree ? 'Як зручніше замовити?' : 'Контакти Ялиночка'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити вікно"
            className="p-2 rounded-lg text-[#f3ead3]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Selected Tree Offer Context */}
          {selectedTree && (
            <div className="bg-white border border-[#0e2216]/12 rounded-xl p-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedTree.image}
                  alt={selectedTree.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-20 object-cover rounded-lg bg-[#0e2216] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#112217] truncate">
                      {selectedTree.name}
                    </h3>
                    <span className="text-xs font-bold text-[#b81d24] shrink-0">
                      −25%
                    </span>
                  </div>
                  <p className="text-xs text-[#112217]/65 mt-0.5 tabular-nums">
                    Залишилось {selectedTree.stockByHeight[height]} шт. · Оплата при отриманні
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-display text-xl font-bold text-[#112217] tabular-nums">
                      {formatUAH(tier.salePrice)} грн
                    </span>
                    <span className="text-xs text-[#112217]/50 line-through tabular-nums">
                      {formatUAH(tier.originalPrice)} грн
                    </span>
                  </div>
                </div>
              </div>

              {/* Height Switcher right inside order picker */}
              <div className="mt-3.5 pt-3 border-t border-[#0e2216]/10 grid grid-cols-5 gap-1.5">
                {HEIGHT_ORDER.map((h) => {
                  const active = h === height;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHeight(h)}
                      className={`py-1.5 px-1 rounded-md text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
                        active
                          ? 'bg-[#0e2216] text-[#f3ead3]'
                          : 'bg-[#f8f6f1] text-[#112217] border border-[#0e2216]/12'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3 Primary Contact / Order Channels */}
          <div className="space-y-2.5">
            {/* 1. Viber */}
            <a
              href={CONTACT_LINKS.viber}
              onClick={handleCopyText}
              className="flex items-center justify-between gap-3 w-full px-4 py-3.5 rounded-xl bg-[#7360f2] hover:bg-[#5f4ce0] text-white transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M11.4 1.5C6.2 1.5 2.5 5 2.5 9.8c0 2.7 1.3 5.1 3.5 6.6v3.4l3.2-1.8c.7.2 1.4.3 2.2.3 5.2 0 9.1-3.5 9.1-8.5 0-4.8-3.9-8.3-9.1-8.3zm4.5 11.7c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.4-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.7.8 2 .9.3.2.5.2.5.4.1.2.1.7-.1 1.3z" />
                </svg>
                <div>
                  <span className="block text-sm font-bold leading-tight">
                    Написати у Viber
                  </span>
                  <span className="block text-xs text-white/85 tabular-nums">
                    {CONTACT_LINKS.viberDisplay}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-md whitespace-nowrap">
                Обрати
              </span>
            </a>

            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-[#112217]/70">
              <a
                href={CONTACT_LINKS.viberAdd}
                className="underline underline-offset-2 hover:text-[#112217]"
              >
                Відкрити через додавання контакту у Viber
              </a>
              <button
                type="button"
                onClick={handleCopyViberPhone}
                className="inline-flex items-center gap-1 font-semibold text-[#7360f2] hover:underline cursor-pointer"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Номер скопійовано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Скопіювати номер</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Telegram */}
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 w-full px-4 py-3.5 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                </svg>
                <div>
                  <span className="block text-sm font-bold leading-tight">
                    Написати в Telegram
                  </span>
                  <span className="block text-xs text-white/85">
                    {CONTACT_LINKS.telegramHandle}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-md whitespace-nowrap">
                Обрати
              </span>
            </a>

            {/* 3. Замовити по телефону */}
            <a
              href={CONTACT_LINKS.phone}
              className="flex items-center justify-between gap-3 w-full px-4 py-3.5 rounded-xl bg-[#b81d24] hover:bg-[#99151b] text-white transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <div>
                  <span className="block text-sm font-bold leading-tight">
                    Замовити по телефону
                  </span>
                  <span className="block text-xs text-white/90 tabular-nums">
                    {CONTACT_LINKS.phoneDisplay}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-md whitespace-nowrap">
                Подзвонити
              </span>
            </a>
          </div>

          {/* Helpful Copy-Text + Optional Site Form link */}
          {selectedTree && (
            <div className="pt-2 border-t border-[#0e2216]/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#112217]/80 hover:text-[#112217] bg-white border border-[#0e2216]/12 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#166534]" />
                    <span>Текст замовлення скопійовано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Скопіювати деталі замовлення для Viber</span>
                  </>
                )}
              </button>

              {onOpenCartCheckout && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCartCheckout(selectedTree, height);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#0e2216]/75 hover:text-[#0e2216] underline underline-offset-4 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Або оформити через форму на сайті</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
