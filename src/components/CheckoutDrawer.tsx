import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
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

interface SubmittedOrder {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  branch: string;
  paymentMethod: 'cod' | 'prepay';
  items: CartItem[];
  totalSale: number;
  totalSaved: number;
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

export function CheckoutDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onChangeHeight,
  onRemoveItem,
  onClearCart,
}: CheckoutDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+380');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepay'>('cod');
  const [error, setError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  if (!isOpen) return null;

  const totalSale = items.reduce(
    (sum, item) => sum + PRICE_TIERS[item.height].salePrice * item.quantity,
    0
  );
  const totalOriginal = items.reduce(
    (sum, item) => sum + PRICE_TIERS[item.height].originalPrice * item.quantity,
    0
  );
  const totalSaved = totalOriginal - totalSale;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Додайте хоча б одну ялинку до замовлення.');
      return;
    }

    const cleanName = customerName.trim();
    const digits = phone.replace(/\D/g, '');
    if (cleanName.length < 2) {
      setError('Вкажіть ваше імʼя та прізвище.');
      return;
    }
    if (digits.length < 10 || digits.length > 13) {
      setError('Введіть коректний номер телефону, наприклад +380 67 123 45 67.');
      return;
    }
    if (city.trim().length < 2 || branch.trim().length < 1) {
      setError('Вкажіть місто та номер відділення Нової Пошти або адресу.');
      return;
    }

    const orderNum = `YL-${Math.floor(2100 + Math.random() * 7800)}`;
    setSubmittedOrder({
      orderNumber: orderNum,
      customerName: cleanName,
      phone: phone.trim(),
      city: city.trim(),
      branch: branch.trim(),
      paymentMethod,
      items: [...items],
      totalSale,
      totalSaved,
    });
    onClearCart();
  };

  const handleClose = () => {
    setSubmittedOrder(null);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#09170f]/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Оформлення замовлення"
    >
      <div className="relative w-full max-w-lg bg-[#f8f6f1] text-[#112217] h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0e2216] text-[#f3ead3]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-display text-xl font-bold">
              {submittedOrder ? 'Замовлення прийнято' : 'Оформлення зі знижкою 25%'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Закрити вікно"
            className="p-2 rounded-lg text-[#f3ead3]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submittedOrder ? (
            <div className="space-y-6">
              <div className="bg-white border border-[#0e2216]/12 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#166534] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#166534]">
                      Замовлення №{submittedOrder.orderNumber}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-[#112217] mt-1">
                      Дякуємо, {submittedOrder.customerName}!
                    </h3>
                    <p className="text-sm text-[#112217]/75 mt-2">
                      Ми зарезервували вашу ялинку за акційною ціною зі знижкою 25%. Менеджер звʼяжеться за номером{' '}
                      <span className="font-semibold text-[#112217]">{submittedOrder.phone}</span>{' '}
                      протягом 15 хвилин для підтвердження відправки.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-[#0e2216]/10 space-y-2 text-sm">
                  {submittedOrder.items.map((item) => (
                    <div
                      key={`${item.tree.id}-${item.height}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <span>
                        {item.tree.name} ({item.height}) × {item.quantity}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {formatUAH(PRICE_TIERS[item.height].salePrice * item.quantity)} грн
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-[#0e2216]/10 font-bold text-base">
                    <span>До сплати</span>
                    <span className="tabular-nums text-[#b81d24]">
                      {formatUAH(submittedOrder.totalSale)} грн
                    </span>
                  </div>
                  <p className="text-xs text-[#112217]/65">
                    Доставка: {submittedOrder.city}, {submittedOrder.branch} ·{' '}
                    {submittedOrder.paymentMethod === 'cod'
                      ? 'Оплата при отриманні (накладений платіж)'
                      : 'Оплата за реквізитами ФОП'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 px-5 bg-[#0e2216] hover:bg-[#153120] text-[#f3ead3] font-semibold text-sm rounded-lg transition-colors cursor-pointer"
              >
                Повернутися до каталогу
              </button>
            </div>
          ) : items.length === 0 ? (
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
                onClick={handleClose}
                className="mt-5 px-5 py-2.5 bg-[#0e2216] text-[#f3ead3] text-sm font-semibold rounded-lg cursor-pointer"
              >
                Обрати ялинку
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items List */}
              <div className="space-y-3">
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
                    ? 'Чудовий вибір! Висота 1,8 м пакується у компактний короб — діє дешева доставка Новою Поштою.'
                    : 'Порада: висота 1,8 м (5 715 грн) має найвигідніший тариф доставки у стандартне відділення.'}
                </span>
              </div>

              {/* Direct Viber / Telegram / Phone quick order */}
              <div className="bg-white border border-[#0e2216]/12 rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold text-[#112217]">
                  Швидке замовлення без заповнення форми:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={CONTACT_LINKS.viber}
                    className="py-2.5 px-2 rounded-lg bg-[#7360f2] hover:bg-[#5f4ce0] text-white text-xs font-semibold text-center transition-colors whitespace-nowrap"
                  >
                    Viber
                  </a>
                  <a
                    href={`${CONTACT_LINKS.telegram}?text=${encodeURIComponent(
                      `Добрий день! Хочу замовити: ${items
                        .map((i) => `${i.tree.name} ${i.height} × ${i.quantity}`)
                        .join(', ')} на суму ${formatUAH(totalSale)} грн.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-lg bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-semibold text-center transition-colors whitespace-nowrap"
                  >
                    Telegram
                  </a>
                  <a
                    href={CONTACT_LINKS.phone}
                    className="inline-flex items-center justify-center gap-1 py-2.5 px-2 rounded-lg bg-[#b81d24] hover:bg-[#99151b] text-white text-xs font-semibold text-center transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Дзвінок</span>
                  </a>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-[#0e2216]/12 rounded-xl p-5">
                <h3 className="font-display text-lg font-bold text-[#112217]">
                  Або оформлення на сайті
                </h3>

                <div>
                  <label htmlFor="order-name" className="block text-xs font-semibold text-[#112217]/80 mb-1">
                    Імʼя та прізвище
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Олена Коваленко"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#f8f6f1] border border-[#0e2216]/15 rounded-lg focus:outline-none focus:border-[#0e2216]"
                  />
                </div>

                <div>
                  <label htmlFor="order-phone" className="block text-xs font-semibold text-[#112217]/80 mb-1">
                    Телефон (Viber / дзвінок)
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380 67 123 45 67"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#f8f6f1] border border-[#0e2216]/15 rounded-lg focus:outline-none focus:border-[#0e2216] tabular-nums"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="order-city" className="block text-xs font-semibold text-[#112217]/80 mb-1">
                      Місто / Село
                    </label>
                    <input
                      id="order-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Київ"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#f8f6f1] border border-[#0e2216]/15 rounded-lg focus:outline-none focus:border-[#0e2216]"
                    />
                  </div>
                  <div>
                    <label htmlFor="order-branch" className="block text-xs font-semibold text-[#112217]/80 mb-1">
                      Відділення Нової Пошти
                    </label>
                    <input
                      id="order-branch"
                      type="text"
                      required
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="Відділення №14"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#f8f6f1] border border-[#0e2216]/15 rounded-lg focus:outline-none focus:border-[#0e2216]"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#112217]/80 mb-1.5">
                    Оплата
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-left transition-colors cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-[#0e2216] text-[#f3ead3] border-[#0e2216]'
                          : 'bg-[#f8f6f1] text-[#112217] border-[#0e2216]/15'
                      }`}
                    >
                      Оплата при отриманні
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('prepay')}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-left transition-colors cursor-pointer ${
                        paymentMethod === 'prepay'
                          ? 'bg-[#0e2216] text-[#f3ead3] border-[#0e2216]'
                          : 'bg-[#f8f6f1] text-[#112217] border-[#0e2216]/15'
                      }`}
                    >
                      На рахунок ФОП
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-[#b81d24]">
                    {error}
                  </p>
                )}

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

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 bg-[#b81d24] hover:bg-[#99151b] text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Підтвердити замовлення — {formatUAH(totalSale)} грн
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#112217]/65">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Огляд ялинки на пошті перед оплатою · Гарантія 5 років</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
