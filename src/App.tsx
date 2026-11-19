import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Maximize2,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { CheckoutDrawer, CartItem } from './components/CheckoutDrawer';
import { CONTACT_LINKS, ContactOrderModal } from './components/ContactOrderModal';
import { SnowOverlay } from './components/SnowOverlay';
import { TreeGalleryModal } from './components/TreeGalleryModal';
import { TreeOfferCatalogCard } from './components/TreeOfferCatalogCard';
import {
  DEFAULT_TARGET_HEIGHT,
  HEIGHT_ORDER,
  LOGO_PATH,
  PRICE_TIERS,
  TREE_OFFERS,
  TreeHeight,
  TreeOffer,
  formatUAH,
} from './data/trees';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [heroTreeId, setHeroTreeId] = useState<string>(TREE_OFFERS[0].id);
  const [heroPhotoIdx, setHeroPhotoIdx] = useState<number>(0);
  const [heroHeight, setHeroHeight] = useState<TreeHeight>(DEFAULT_TARGET_HEIGHT);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [galleryState, setGalleryState] = useState<{
    tree: TreeOffer | null;
    index: number;
    height: TreeHeight;
  }>({ tree: null, index: 0, height: DEFAULT_TARGET_HEIGHT });
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean;
    tree: TreeOffer | null;
    height: TreeHeight;
  }>({ isOpen: false, tree: null, height: DEFAULT_TARGET_HEIGHT });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 360);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openOrderChoice = (tree: TreeOffer | null, height: TreeHeight = DEFAULT_TARGET_HEIGHT) => {
    setContactModal({ isOpen: true, tree, height });
  };

  const heroTree = TREE_OFFERS.find((t) => t.id === heroTreeId) ?? TREE_OFFERS[0];
  const heroPhoto = heroTree.gallery[heroPhotoIdx] ?? heroTree.gallery[0];
  const heroTier = PRICE_TIERS[heroHeight];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const addItemToCart = (tree: TreeOffer, height: TreeHeight, openDrawer: boolean) => {
    setCart((prev) => {
      const maxStock = tree.stockByHeight[height];
      const existing = prev.find(
        (item) => item.tree.id === tree.id && item.height === height
      );
      if (existing) {
        if (existing.quantity >= maxStock) return prev;
        return prev.map((item) =>
          item.tree.id === tree.id && item.height === height
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { tree, height, quantity: 1 }];
    });

    if (openDrawer) {
      setIsDrawerOpen(true);
    } else {
      showToast(`Додано: ${tree.name} (${height})`);
    }
  };

  const handleUpdateQuantity = (treeId: string, height: TreeHeight, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.tree.id === treeId && item.height === height) {
            const nextQty = item.quantity + delta;
            const maxStock = item.tree.stockByHeight[height];
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(nextQty, maxStock) };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleChangeHeight = (
    treeId: string,
    oldHeight: TreeHeight,
    newHeight: TreeHeight
  ) => {
    setCart((prev) => {
      const moving = prev.find(
        (i) => i.tree.id === treeId && i.height === oldHeight
      );
      if (!moving) return prev;
      const targetExists = prev.find(
        (i) => i.tree.id === treeId && i.height === newHeight
      );
      const maxStock = moving.tree.stockByHeight[newHeight];

      if (targetExists) {
        return prev
          .filter((i) => !(i.tree.id === treeId && i.height === oldHeight))
          .map((i) =>
            i.tree.id === treeId && i.height === newHeight
              ? { ...i, quantity: Math.min(i.quantity + moving.quantity, maxStock) }
              : i
          );
      }

      return prev.map((i) =>
        i.tree.id === treeId && i.height === oldHeight
          ? { ...i, height: newHeight, quantity: Math.min(i.quantity, maxStock) }
          : i
      );
    });
  };

  const handleRemoveItem = (treeId: string, height: TreeHeight) => {
    setCart((prev) =>
      prev.filter((i) => !(i.tree.id === treeId && i.height === height))
    );
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#f8f6f1] text-[#112217]">
      <SnowOverlay />

      {/* Top Bar Contract: 3 zones, 1 row, single-line controls */}
      <header className="sticky top-0 z-40 h-16 bg-[#0e2216] text-[#f3ead3] border-b border-white/10">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3ead3]"
            aria-label="Ялиночка — на головну"
          >
            <img
              src={LOGO_PATH}
              alt="Ялиночка"
              referrerPolicy="no-referrer"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>

          <nav
            aria-label="Основна навігація"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#f3ead3]/85"
          >
            <a
              href="#catalog"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Каталог ялинок
            </a>
            <a
              href="#closeup"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Хвоя зблизька
            </a>
            <a
              href="#prices"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Ціни та 1,8 м
            </a>
            <button
              type="button"
              onClick={() => openOrderChoice(null)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Контакти
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() =>
                totalCartCount > 0 ? setIsDrawerOpen(true) : openOrderChoice(heroTree, heroHeight)
              }
              className="inline-flex items-center gap-2 bg-[#b81d24] hover:bg-[#99151b] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>
                {totalCartCount > 0 ? `Кошик (${totalCartCount})` : 'Забрати по знижці'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Section 1: Deep Pine Editorial Hero */}
        <section className="bg-[#0e2216] text-[#f3ead3] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Hero Left Column */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-medium text-[#e5d3a3] tracking-wide mb-3">
                  Переїжджаємо на нове виробництво · Оплата при отриманні
                </p>

                <h1 className="font-display text-[38px] sm:text-[50px] lg:text-[58px] font-bold leading-[1.04] tracking-tight text-[#f3ead3] text-balance">
                  Розпродаж литих ялинок зі знижкою 25%
                </h1>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#f3ead3]/85 max-w-2xl">
                  5 фірмових моделей із лімітованими залишками (до 9 шт. у кожному розмірі). Найвигідніший вибір сезону — висота{' '}
                  <strong className="text-white font-semibold">1,8 м за 5 715 грн</strong>{' '}
                  замість 7 620 грн: оптимальна для оселі та найдешевша доставка у стандартне відділення.
                </p>

                {/* Interactive Quick Preview Switcher */}
                <div className="mt-7 pt-6 border-t border-white/12">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-[#f3ead3]/75">
                      Оберіть модель для перегляду фото та ракурсів:
                    </span>
                    <span className="text-xs font-semibold text-[#e5d3a3] tabular-nums">
                      Залишилось {heroTree.stockByHeight[heroHeight]} шт. у розмірі {heroHeight}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {TREE_OFFERS.map((tree) => {
                      const active = tree.id === heroTree.id;
                      return (
                        <button
                          key={tree.id}
                          type="button"
                          onClick={() => {
                            setHeroTreeId(tree.id);
                            setHeroPhotoIdx(0);
                          }}
                          className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#f3ead3] text-[#112217]'
                              : 'bg-white/8 text-[#f3ead3] hover:bg-white/15 border border-white/10'
                          }`}
                        >
                          {tree.name}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {HEIGHT_ORDER.map((h) => {
                      const active = h === heroHeight;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHeroHeight(h)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                            active
                              ? 'bg-[#b81d24] text-white'
                              : 'bg-white/6 text-[#f3ead3]/80 hover:bg-white/12'
                          }`}
                        >
                          {h} {h === '1,8 м' ? '· Хіт' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Hero Action */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openOrderChoice(heroTree, heroHeight)}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#b81d24] hover:bg-[#99151b] text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums"
                  >
                    <span>
                      Забрати {heroTree.name} {heroHeight} — {formatUAH(heroTier.salePrice)} грн
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openOrderChoice(null)}
                    className="inline-flex items-center gap-2.5 px-4 py-3.5 rounded-lg border border-white/20 text-sm font-semibold text-[#f3ead3] hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Контакти</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4ade80] pl-2 border-l border-white/15">
                      <span className="animate-online-dot leading-none" aria-hidden="true">
                        ●
                      </span>
                      <span>online</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Hero Right Column: Interactive Photo + Angle/Close-Up Thumbnails */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="relative flex-1 w-full aspect-[4/5] lg:aspect-auto lg:min-h-[480px] rounded-xl overflow-hidden border border-white/12 bg-[#09170f]">
                  <img
                    src={heroPhoto.src}
                    alt={`${heroTree.name} — ${heroPhoto.label}`}
                    referrerPolicy="no-referrer"
                    onClick={() =>
                      setGalleryState({
                        tree: heroTree,
                        index: heroPhotoIdx,
                        height: heroHeight,
                      })
                    }
                    className="absolute inset-0 w-full h-full object-cover object-center cursor-zoom-in"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09170f]/95 via-[#09170f]/20 to-transparent"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setGalleryState({
                        tree: heroTree,
                        index: heroPhotoIdx,
                        height: heroHeight,
                      })
                    }
                    aria-label="Відкрити збільшену галерею"
                    className="absolute top-4 right-4 p-2 rounded-lg bg-[#09170f]/75 hover:bg-[#09170f] text-[#f3ead3] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#f3ead3] text-[#112217] text-xs font-bold px-3 py-1 rounded">
                        {heroTree.name} · {heroHeight}
                      </span>
                      <span className="bg-[#b81d24] text-white text-xs font-bold px-2.5 py-1 rounded tabular-nums">
                        −25%
                      </span>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-display text-3xl sm:text-4xl font-bold text-[#f3ead3] tabular-nums">
                          {formatUAH(heroTier.salePrice)} грн
                        </span>
                        <span className="text-base text-[#f3ead3]/70 line-through decoration-[#c92027] tabular-nums">
                          {formatUAH(heroTier.originalPrice)} грн
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[#f3ead3]/85">
                        {heroHeight === '1,8 м'
                          ? `Оплата при отриманні · Дешева доставка у відділення (${heroTier.estimatedDeliveryCost})`
                          : `Оплата при отриманні · ${heroTier.deliveryLabel} (${heroTier.estimatedDeliveryCost})`}
                      </p>
                      <p className="mt-1 text-[11px] text-[#f3ead3]/70">
                        {heroPhoto.label} · *на фото {heroTree.name} {heroHeight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Angle / Close-Up Thumbnails right in Hero */}
                <div className="grid grid-cols-4 gap-2">
                  {heroTree.gallery.map((photo, idx) => {
                    const active = idx === heroPhotoIdx;
                    return (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() => setHeroPhotoIdx(idx)}
                        className={`rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          active
                            ? 'border-[#e5d3a3] ring-2 ring-[#e5d3a3]/40'
                            : 'border-white/15 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo.src}
                          alt={photo.label}
                          referrerPolicy="no-referrer"
                          className="w-full aspect-[4/3] object-cover"
                        />
                        <span className="block py-1 px-1 text-[10px] font-semibold text-[#f3ead3] bg-[#09170f] truncate text-center">
                          {photo.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4-column Key Conditions Strip */}
            <div className="mt-10 pt-8 border-t border-white/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="font-semibold text-[#f3ead3]">Знижка 25% на всі висоти</p>
                <p className="text-xs text-[#f3ead3]/70 mt-1">
                  Від 3 510 грн за 1,5 м до 11 880 грн за 2,5 м без передоплат.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#f3ead3]">Кращий вибір: висота 1,8 м</p>
                <p className="text-xs text-[#f3ead3]/70 mt-1">
                  Оптимальна коробка — низький тариф доставки Новою Поштою.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#f3ead3]">Оплата при отриманні</p>
                <p className="text-xs text-[#f3ead3]/70 mt-1">
                  Оглядаєте якість хвої та комплектацію перед оплатою.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#f3ead3]">Лімітовані залишки (&lt; 10 шт.)</p>
                <p className="text-xs text-[#f3ead3]/70 mt-1">
                  У кожній моделі залишилось від 1 до 9 штук у наявності.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 5 Curated Tree Offers Storefront with Close-ups */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#b81d24] tracking-wide mb-2">
                Тільки 5 актуальних моделей
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#112217] tracking-tight text-balance">
                Каталог литих ялинок та сосни
              </h2>
            </div>
            <p className="text-sm text-[#112217]/75 max-w-md">
              Перемикайте ракурси та макро-фото хвої прямо на картці або натискайте на фото для збільшення. За замовчуванням обрано хітову висоту{' '}
              <strong className="font-semibold text-[#112217]">1,8 м (5 715 грн)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {TREE_OFFERS.map((tree) => (
              <TreeOfferCatalogCard
                key={tree.id}
                tree={tree}
                onQuickOrder={(t, h) => openOrderChoice(t, h)}
                onAddToCart={(t, h) => addItemToCart(t, h, false)}
                onOpenGallery={(t, idx, h) =>
                  setGalleryState({ tree: t, index: idx, height: h })
                }
              />
            ))}
          </div>
        </section>

        {/* Section 3: Real Close-Up & Multi-Angle Showcase */}
        <section id="closeup" className="bg-[#efeae0] border-y border-[#0e2216]/10 py-14 sm:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#b81d24] tracking-wide mb-2">
                Реальні фото без ретуші
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#112217] tracking-tight text-balance">
                Якість хвої зблизька та інші ракурси
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#112217]/75">
                Натисніть на будь-який кадр, щоб відкрити повну галерею моделі з усіма ракурсами, денним світлом і макро-зйомкою гілочок.
              </p>
            </div>

            <div className="space-y-8">
              {TREE_OFFERS.map((tree) => (
                <div
                  key={tree.id}
                  className="bg-white border border-[#0e2216]/10 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#112217]">
                        {tree.name}
                      </h3>
                      <p className="text-xs text-[#112217]/65">
                        {tree.materialTag} · {tree.needleNote}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openOrderChoice(tree, DEFAULT_TARGET_HEIGHT)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0e2216] hover:bg-[#153120] text-[#f3ead3] px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap tabular-nums"
                    >
                      <span>Забрати 1,8 м — 5 715 грн</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {tree.gallery.map((photo, idx) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() =>
                          setGalleryState({
                            tree,
                            index: idx,
                            height: DEFAULT_TARGET_HEIGHT,
                          })
                        }
                        className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-[#0e2216] cursor-zoom-in text-left"
                      >
                        <img
                          src={photo.src}
                          alt={`${tree.name} — ${photo.label}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#09170f]/85 to-transparent"
                        />
                        <span className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-semibold text-[#f3ead3]">
                          <span>{photo.label}</span>
                          <Maximize2 className="w-3.5 h-3.5 opacity-80" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Exact Pricing Table & Why 1.8m + Delivery */}
        <section id="prices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold text-[#b81d24] tracking-wide mb-2">
                Єдина акційна сітка для всіх 5 моделей
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#112217] tracking-tight mb-6 text-balance">
                Ціни зі знижкою 25%
              </h2>

              <div className="bg-white border border-[#0e2216]/12 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0e2216] text-[#f3ead3] text-xs font-semibold">
                        <th className="py-3.5 px-4">Висота</th>
                        <th className="py-3.5 px-4">Ціна</th>
                        <th className="py-3.5 px-4">Знижка</th>
                        <th className="py-3.5 px-4">Акційна ціна</th>
                        <th className="py-3.5 px-4">Доставка НП</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0e2216]/10 text-sm">
                      {HEIGHT_ORDER.map((height) => {
                        const tier = PRICE_TIERS[height];
                        const isTarget = height === '1,8 м';
                        return (
                          <tr
                            key={height}
                            className={
                              isTarget
                                ? 'bg-[#f3ead3]/45 font-semibold'
                                : 'hover:bg-[#f8f6f1] transition-colors'
                            }
                          >
                            <td className="py-3.5 px-4 tabular-nums whitespace-nowrap">
                              <span className="text-[#112217] font-bold">{tier.height}</span>
                              {isTarget && (
                                <span className="ml-2 text-xs font-bold text-[#b81d24]">
                                  Хіт продажів
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-[#112217]/55 line-through tabular-nums whitespace-nowrap">
                              {formatUAH(tier.originalPrice)} грн
                            </td>
                            <td className="py-3.5 px-4 text-[#b81d24] font-bold tabular-nums whitespace-nowrap">
                              −{tier.discountPercent}%
                            </td>
                            <td className="py-3.5 px-4 font-display text-lg font-bold text-[#112217] tabular-nums whitespace-nowrap">
                              {formatUAH(tier.salePrice)} грн
                            </td>
                            <td className="py-3.5 px-4 text-xs text-[#112217]/80 tabular-nums whitespace-nowrap">
                              {tier.estimatedDeliveryCost}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div id="delivery" className="lg:col-span-5 space-y-5">
              <div className="bg-[#0e2216] text-[#f3ead3] rounded-xl p-6 sm:p-7">
                <p className="text-xs font-semibold text-[#e5d3a3] mb-2">
                  Рекомендація виробництва
                </p>
                <h3 className="font-display text-2xl font-bold text-[#f3ead3] text-balance">
                  Чому 68% покупців обирають висоту 1,8 м?
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-[#f3ead3]/85">
                  <li className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-[#e5d3a3] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Дешева доставка:</strong> ялинка 1,8 м складається у компактний короб до 18 кг і їде у будь-яке стандартне відділення Нової Пошти без вантажної націнки.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <PackageCheck className="w-4 h-4 text-[#e5d3a3] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Ідеальна висота для оселі:</strong> гармонійно виглядає під стелями 2,5–2,8 м, залишаючи місце для верхівки.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#e5d3a3] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Оплата при отриманні:</strong> ви перевіряєте густоту хвої та колір на пошті й лише потім сплачуєте 5 715 грн.
                    </span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => openOrderChoice(TREE_OFFERS[0], '1,8 м')}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#b81d24] hover:bg-[#99151b] text-white font-semibold text-sm py-3 px-5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Замовити 1,8 м за 5 715 грн</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white border border-[#0e2216]/12 rounded-xl p-5 space-y-3">
                <p className="text-xs font-semibold text-[#b81d24]">
                  Прямий звʼязок без вихідних
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={CONTACT_LINKS.viber}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#7360f2] hover:bg-[#5f4ce0] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    Viber
                  </a>
                  <a
                    href={CONTACT_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    Telegram
                  </a>
                  <a
                    href={CONTACT_LINKS.phone}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0e2216] hover:bg-[#153120] text-[#f3ead3] text-xs font-semibold transition-colors whitespace-nowrap tabular-nums"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>097 243 84 19</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#0e2216] text-[#f3ead3] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <img
              src={LOGO_PATH}
              alt="Ялиночка"
              referrerPolicy="no-referrer"
              className="h-7 w-auto object-contain mb-2"
            />
            <p className="text-xs text-[#f3ead3]/70">
              Виробництво та розпродаж литих ялинок · Оплата при отриманні по всій Україні
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#f3ead3]/80">
            <a href={CONTACT_LINKS.viber} className="hover:text-white transition-colors">
              Viber
            </a>
            <a
              href={CONTACT_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Telegram
            </a>
            <a href={CONTACT_LINKS.phone} className="hover:text-white transition-colors tabular-nums">
              +38 (097) 243-84-19
            </a>
            <span className="text-[#f3ead3]/50">© 2026 Ялиночка</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Stack: Scroll-to-Top + Contacts Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {showScrollTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Прокрутити вгору"
            title="Вгору"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#0e2216]/95 hover:bg-[#153120] text-[#f3ead3] border border-white/15 shadow-xl transition-colors cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => openOrderChoice(null)}
          className="inline-flex items-center gap-2.5 bg-[#0e2216] hover:bg-[#153120] text-[#f3ead3] px-4 py-3 rounded-xl shadow-xl border border-white/15 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[#e5d3a3] shrink-0" />
          <span>Контакти</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4ade80] pl-2 border-l border-white/15">
            <span className="animate-online-dot leading-none" aria-hidden="true">
              ●
            </span>
            <span>online</span>
          </span>
        </button>
      </div>

      {toastMessage && (
        <div
          role="status"
          className={`fixed right-5 z-50 flex items-center gap-2.5 bg-[#0e2216] text-[#f3ead3] px-4 py-3 rounded-lg shadow-xl border border-white/15 text-sm font-medium ${
            showScrollTop ? 'bottom-34' : 'bottom-20'
          }`}
        >
          <Check className="w-4 h-4 text-[#4ade80] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="ml-2 text-xs font-bold text-[#e5d3a3] underline underline-offset-2 cursor-pointer"
          >
            Оформити
          </button>
        </div>
      )}

      {/* Photo Lightbox Gallery Modal */}
      <TreeGalleryModal
        tree={galleryState.tree}
        initialIndex={galleryState.index}
        initialHeight={galleryState.height}
        onClose={() => setGalleryState((prev) => ({ ...prev, tree: null }))}
        onOrder={(tree, height) => openOrderChoice(tree, height)}
      />

      {/* Contact / Order Channel Chooser Modal (Viber / Telegram / Phone) */}
      <ContactOrderModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal((prev) => ({ ...prev, isOpen: false }))}
        selectedTree={contactModal.tree}
        selectedHeight={contactModal.height}
        onOpenCartCheckout={(tree, height) => addItemToCart(tree, height, true)}
      />

      {/* Slide-over Cart & Checkout Drawer */}
      <CheckoutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onChangeHeight={handleChangeHeight}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}
