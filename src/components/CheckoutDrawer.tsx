import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { CONTACT_LINKS } from './ContactOrderModal';
import {
  HEIGHT_ORDER,
  PRICE_TIERS,
  TreeHeight,
  TreeOffer,
  formatUAH,
} from '../data/trees';

export interface CartItem {
  tree: TreeOffer;
  height: TreeHeight;
  quantity: number;
}

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (treeId: string, height: TreeHeight, delta: number) => void;
  onChangeHeight: (treeId: string, oldHeight: TreeHeight, newHeight: TreeHeight) => void;
  onRemoveItem: (treeId: string, height: TreeHeight) => void;
  onClearCart: () => void;
}

const MESSAGE_TEMPLATE_HEADER = [
  "Ваше ім'я: ",
  '',
  'Ваш номер телефону: ',
  '',
  'Ваше місто/село: ',
  '',
  'Відділення Нової Пошти: ',
  '',
  'Коментар: ',
].join('\n');

const AUTO_TREE_SECTION_HEADER = 'Обрана ялинка (знижка −25%, оплата при отриманні):';

function buildAutoTreeSection(items: CartItem[], totalSale: number): string {
  if (items.length === 0) return '';

  const lines = items.map((item) => {
    const lineTotal = PRICE_TIERS[item.height].salePrice * item.quantity;
    return `• ${item.tree.name} (${item.height}) × ${item.quantity} — ${formatUAH(lineTotal)} грн`;
  });

  return [
    AUTO_TREE_SECTION_HEADER,
    ...lines,
    `Разом до сплати: ${formatUAH(totalSale)} грн`,
  ].join('\n');
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onChangeHeight,
  onRemoveItem,
  onClearCart,
}: CheckoutDrawerProps) {
  const totalSale = items.reduce(
    (sum, item) => sum + PRICE_TIERS[item.height].salePrice * item.quantity,
    0
  );
  const totalOriginal = items.reduce(
    (sum, item) => sum + PRICE_TIERS[item.height].originalPrice * item.quantity,
    0
  );
  const totalSaved = totalOriginal - totalSale;

  const itemsSignature = items
    .map((item) => `${item.tree.id}:${item.height}:${item.quantity}`)
    .join('|');

  const [messageText, setMessageText] = useState<string>(() => {
    const treeSection = buildAutoTreeSection(items, totalSale);
    return treeSection
      ? `${MESSAGE_TEMPLATE_HEADER}\n\n${treeSection}`
      : MESSAGE_TEMPLATE_HEADER;
  });
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Sync the auto-generated tree section whenever cart items, heights, or quantities change
  useEffect(() => {
    const treeSection = buildAutoTreeSection(items, totalSale);
    setMessageText((prev) => {
      const markerIndex = prev.indexOf(AUTO_TREE_SECTION_HEADER);
      const userPart = (
        markerIndex !== -1 ? prev.slice(0, markerIndex) : prev
      ).replace(/\n+$/, '');

      if (!treeSection) {
        return userPart || MESSAGE_TEMPLATE_HEADER;
      }
      return `${userPart || MESSAGE_TEMPLATE_HEADER}\n\n${treeSection}`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsSignature, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedOrder(true);
      window.setTimeout(() => setCopiedOrder(false), 2200);
    } catch {
      // Clipboard unavailable in restricted contexts
    }
  };

  const telegramHref = `${CONTACT_LINKS.telegram}?text=${encodeURIComponent(messageText)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#09170f]/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Оформлення замовлення"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#f8f6f1] text-[#112217] h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0e2216] text-[#f3ead3]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-display text-xl font-bold">
              Оформлення зі знижкою 25%
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#0e2216]/30 mb-3" />
              <p className="font-display text-xl font-bold text-[#112217]">
                Кошик порожній
              </p>
              <p className="text-sm text-[#112217]/70 mt-1 max-w-xs">
                Оберіть одну з 5 моделей ялинок зі знижкою 25% у каталозі або серед оферів.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-[#0e2216] text-[#f3ead3] text-sm font-semibold rounded-lg cursor-pointer"
              >
                Обрати ялинку
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#112217]/65">
                  <span className="font-semibold">Обрані моделі ({items.length})</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="hover:text-[#b81d24] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Очистити кошик
                  </button>
                </div>

                {items.map((item) => {
                  const tier = PRICE_TIERS[item.height];
                  const maxStock = item.tree.stockByHeight[item.height];

                  return (
                    <div
                      key={`${item.tree.id}-${item.height}`}
                      className="bg-white border border-[#0e2216]/10 rounded-xl p-4 flex gap-4"
                    >
                      <img
                        src={item.tree.image}
                        alt={item.tree.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-24 object-cover rounded-lg bg-[#0e2216] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-lg font-bold text-[#112217]">
                              {item.tree.name}
                            </h3>
                            <p className="text-xs text-[#b81d24] font-semibold tabular-nums">
                              Залишилось {maxStock} шт. · −25%
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.tree.id, item.height)}
                            aria-label={`Видалити ${item.tree.name}`}
                            className="p-1.5 text-[#112217]/45 hover:text-[#b81d24] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Height switcher right inside cart */}
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {HEIGHT_ORDER.map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() =>
                                h !== item.height &&
                                onChangeHeight(item.tree.id, item.height, h)
                              }
                              className={`px-2 py-1 text-[11px] font-semibold rounded cursor-pointer tabular-nums ${
                                h === item.height
                                  ? 'bg-[#0e2216] text-[#f3ead3]'
                                  : 'bg-[#f8f6f1] text-[#112217]/75 hover:bg-[#efeae0]'
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center border border-[#0e2216]/15 rounded-lg bg-[#f8f6f1]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(item.tree.id, item.height, -1)
                              }
                              aria-label="Зменшити кількість"
                              className="p-1.5 hover:bg-[#efeae0] rounded-l-lg cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                item.quantity < maxStock &&
                                onUpdateQuantity(item.tree.id, item.height, 1)
                              }
                              disabled={item.quantity >= maxStock}
                              aria-label="Збільшити кількість"
                              className="p-1.5 hover:bg-[#efeae0] rounded-r-lg cursor-pointer disabled:opacity-40"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="block text-[11px] text-[#112217]/50 line-through tabular-nums">
                              {formatUAH(tier.originalPrice * item.quantity)} грн
                            </span>
                            <span className="font-display text-lg font-bold text-[#112217] tabular-nums">
                              {formatUAH(tier.salePrice * item.quantity)} грн
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery tip for 1.8m */}
              <div className="bg-white border border-[#0e2216]/12 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#112217]/80">
                <Truck className="w-4 h-4 text-[#0e2216] shrink-0 mt-0.5" />
                <span>
                  {items.some((i) => i.height === '1,8 м')
                    ? 'Чудовий вибір! Висота 1,8 м пакується у компактний короб — діє дешева доставка Новою Поштою (200–300 грн).'
                    : 'Порада: висота 1,8 м (5 580 грн) має найвигідніший тариф доставки у стандартне відділення (200–300 грн).'}
                </span>
              </div>

              {/* Single-textarea Order Message Builder */}
              <div className="space-y-4 bg-white border border-[#0e2216]/12 rounded-xl p-5">
                <div>
                  <label
                    htmlFor="order-message-box"
                    className="block font-display text-lg font-bold text-[#112217] leading-snug mb-2"
                  >
                    Сформуйте повідомлення і скопіюйте для відправки в месенджер
                  </label>
                  <textarea
                    id="order-message-box"
                    rows={13}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm leading-relaxed bg-[#f8f6f1] text-[#112217] border border-[#0e2216]/20 rounded-lg focus:outline-none focus:border-[#0e2216] resize-y"
                  />
                  <p className="mt-1.5 text-xs text-[#112217]/65 italic">
                    *інформація про вибрану ялинку підставиться автоматично.
                  </p>
                </div>

                {/* Summary */}
                <div className="pt-3 border-t border-[#0e2216]/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#112217]/70">
                    <span>Ваша економія (−25%):</span>
                    <span className="font-semibold text-[#166534] tabular-nums">
                      −{formatUAH(totalSaved)} грн
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-[#112217]">
                    <span>Разом до сплати:</span>
                    <span className="font-display text-2xl tabular-nums">
                      {formatUAH(totalSale)} грн
                    </span>
                  </div>
                </div>

                {/* Primary Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 font-semibold text-sm rounded-xl transition-colors cursor-pointer ${
                    copiedOrder
                      ? 'bg-[#166534] text-white'
                      : 'bg-[#0e2216] hover:bg-[#153120] text-[#f3ead3]'
                  }`}
                >
                  {copiedOrder ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Повідомлення скопійовано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>Скопіювати повідомлення</span>
                    </>
                  )}
                </button>

                {/* Send via Messengers */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-semibold text-[#112217]/75">
                    Відправити сформоване замовлення:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={telegramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <span>Надіслати в Telegram</span>
                    </a>

                    <a
                      href={CONTACT_LINKS.viber}
                      onClick={handleCopyMessage}
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#7360f2] hover:bg-[#5f4ce0] text-white text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <span>Надіслати у Viber</span>
                    </a>
                  </div>

                  <a
                    href={CONTACT_LINKS.viberAlt}
                    onClick={handleCopyMessage}
                    className="block text-center text-[11px] font-medium text-[#112217]/65 hover:text-[#7360f2] underline underline-offset-2 pt-0.5 transition-colors"
                  >
                    Альтернативне посилання на Viber (якщо основне не відкрилось)
                  </a>

                  <a
                    href={CONTACT_LINKS.phone}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#b81d24] hover:bg-[#99151b] text-white text-xs font-semibold transition-colors tabular-nums"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Подзвонити для замовлення {CONTACT_LINKS.phoneDisplay}</span>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#112217]/65">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Огляд ялинки на пошті перед оплатою · Гарантія 5 років</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
