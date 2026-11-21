import { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Plus,
  ShoppingBag,
  Trees,
  Truck,
} from 'lucide-react';
import {
  DEFAULT_TARGET_HEIGHT,
  HEIGHT_ORDER,
  TreeHeight,
  TreeOffer,
  formatUAH,
  getTreePriceTier,
} from '../data/trees';

interface TreeOfferCatalogCardProps {
  tree: TreeOffer;
  onQuickOrder: (tree: TreeOffer, height: TreeHeight) => void;
  onAddToCart: (tree: TreeOffer, height: TreeHeight) => void;
  onOpenGallery: (tree: TreeOffer, photoIndex: number, height: TreeHeight) => void;
}

export function TreeOfferCatalogCard({
  tree,
  onQuickOrder,
  onAddToCart,
  onOpenGallery,
}: TreeOfferCatalogCardProps) {
  const [selectedHeight, setSelectedHeight] = useState<TreeHeight>(DEFAULT_TARGET_HEIGHT);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const tier = getTreePriceTier(tree, selectedHeight);
  const stock = tree.stockByHeight[selectedHeight];
  const activePhoto = tree.gallery[photoIndex] ?? tree.gallery[0];

  const handlePrevPhoto = () => {
    setImgFailed(false);
    setPhotoIndex((prev) => (prev - 1 + tree.gallery.length) % tree.gallery.length);
  };

  const handleNextPhoto = () => {
    setImgFailed(false);
    setPhotoIndex((prev) => (prev + 1) % tree.gallery.length);
  };

  return (
    <article className="group flex flex-col bg-white border border-[#0e2216]/10 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Studio Tree Image (3:4) with angle controls & zoom */}
      <div className="relative aspect-[3/4] w-full bg-[#0e2216] overflow-hidden">
        {!imgFailed ? (
          <img
            src={activePhoto.src}
            alt={`Штучна ялинка ${tree.name} — ${activePhoto.label}`}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            onClick={() => onOpenGallery(tree, photoIndex, selectedHeight)}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] cursor-zoom-in"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0e2216] to-[#1a3a26] text-[#f3ead3] p-6 text-center">
            <Trees className="w-12 h-12 mb-3 opacity-80" />
            <span className="font-display text-xl font-bold">{tree.name}</span>
          </div>
        )}

        {/* Top-right Video & Zoom Lightbox Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {tree.video && (
            <button
              type="button"
              onClick={() => onOpenGallery(tree, tree.gallery.length, selectedHeight)}
              aria-label={`Дивитись відео ${tree.name}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#09170f]/80 hover:bg-[#b81d24] text-[#f3ead3] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Відео</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenGallery(tree, photoIndex, selectedHeight)}
            aria-label={`Збільшити фото ${tree.name}`}
            className="p-2 rounded-lg bg-[#09170f]/70 hover:bg-[#09170f] text-[#f3ead3] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Left / Right Photo Angle Switcher */}
        <button
          type="button"
          onClick={handlePrevPhoto}
          aria-label="Попередній ракурс"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#09170f]/65 hover:bg-[#09170f] text-[#f3ead3] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNextPhoto}
          aria-label="Наступний ракурс"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#09170f]/65 hover:bg-[#09170f] text-[#f3ead3] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Subtle scrim at bottom for photo caption */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#09170f]/85 via-[#09170f]/35 to-transparent"
        />

        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-end justify-between text-[#f3ead3]">
          <span className="text-xs font-medium tracking-wide text-[#f3ead3]/95">
            {activePhoto.label} · {tree.name} {selectedHeight}
          </span>
          <span className="text-xs font-bold bg-[#b81d24] text-white px-2 py-0.5 rounded tabular-nums">
            −{tier.discountPercent}%
          </span>
        </div>
      </div>

      {/* Close-up & Angles Thumbnail Strip (up to 4 highlights) */}
      <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-[#f8f6f1] border-b border-[#0e2216]/10">
        {tree.gallery.slice(0, 4).map((photo, idx) => {
          const active = idx === photoIndex;
          return (
            <button
              key={photo.src}
              type="button"
              onClick={() => {
                setImgFailed(false);
                setPhotoIndex(idx);
              }}
              className={`relative rounded-md overflow-hidden border transition-all cursor-pointer ${
                active
                  ? 'border-[#b81d24] ring-1 ring-[#b81d24]'
                  : 'border-[#0e2216]/15 opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={photo.src}
                alt={`${tree.name} — ${photo.label}`}
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover"
              />
              <span className="block py-0.5 px-1 text-[10px] font-semibold text-[#112217] bg-white truncate text-center">
                {photo.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-[#0e2216]/65 mb-1.5">
          <span>{tree.materialTag}</span>
          <span aria-hidden="true">·</span>
          <span>Оплата при отриманні</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-[#112217] tracking-tight">
          {tree.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#112217]/75">
          {tree.description}
        </p>

        {/* Height Selector */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#112217]/80">Оберіть висоту:</span>
            <span
              className={`font-semibold tabular-nums ${
                stock > 0 ? 'text-[#b81d24]' : 'text-[#112217]/50'
              }`}
            >
              {stock > 0 ? `Залишилось ${stock} шт.` : 'Немає в наявності'}
            </span>
          </div>

          <div
            className="grid grid-cols-5 gap-1.5"
            role="group"
            aria-label={`Висота для ${tree.name}`}
          >
            {HEIGHT_ORDER.map((height) => {
              const active = selectedHeight === height;
              const isTarget = height === '1,8 м';
              const heightStock = tree.stockByHeight[height];
              const isOut = heightStock === 0;
              return (
                <button
                  key={height}
                  type="button"
                  onClick={() => setSelectedHeight(height)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                    active
                      ? 'bg-[#0e2216] text-[#f3ead3]'
                      : isOut
                        ? 'bg-[#f8f6f1] text-[#112217]/40 border border-[#0e2216]/10 line-through'
                        : 'bg-[#f8f6f1] text-[#112217] border border-[#0e2216]/12 hover:border-[#0e2216]/35'
                  }`}
                >
                  <span className="block">{height}</span>
                  {isTarget && (
                    <span
                      className={`block text-[9px] font-bold leading-none mt-0.5 ${
                        active ? 'text-[#e5d3a3]' : 'text-[#b81d24]'
                      }`}
                    >
                      Хіт
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Note */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-[#0e2216]/80 bg-[#f8f6f1] px-3 py-2 rounded-lg">
          <Truck className="w-4 h-4 shrink-0 text-[#0e2216]" />
          <span className="truncate">
            {selectedHeight === '1,8 м'
              ? `Хіт продажів · Дешева доставка (${tier.estimatedDeliveryCost})`
              : `${tier.deliveryLabel} (${tier.estimatedDeliveryCost})`}
          </span>
        </div>

        {/* Pricing + CTA */}
        <div className="mt-auto pt-5 border-t border-[#0e2216]/10 mt-5">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#112217]/50 line-through decoration-[#b81d24] tabular-nums">
                  {formatUAH(tier.originalPrice)} грн
                </span>
                <span className="text-xs font-bold text-[#b81d24] tabular-nums">
                  Економія {formatUAH(tier.originalPrice - tier.salePrice)} грн
                </span>
              </div>
              <div className="font-display text-3xl font-bold text-[#112217] tabular-nums leading-tight mt-0.5">
                {formatUAH(tier.salePrice)}{' '}
                <span className="text-lg font-semibold">грн</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={stock === 0}
              onClick={() => stock > 0 && onQuickOrder(tree, selectedHeight)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#b81d24] hover:bg-[#99151b] disabled:bg-[#112217]/20 disabled:text-[#112217]/50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{stock > 0 ? 'Забрати по знижці' : 'Розмір розпродано'}</span>
              {stock > 0 && <ArrowRight className="w-4 h-4 shrink-0" />}
            </button>
            <button
              type="button"
              disabled={stock === 0}
              onClick={() => stock > 0 && onAddToCart(tree, selectedHeight)}
              aria-label={`Додати ${tree.name} ${selectedHeight} у кошик`}
              title={stock > 0 ? 'Додати в кошик' : 'Немає в наявності'}
              className="inline-flex items-center justify-center p-3 rounded-lg border border-[#0e2216]/15 bg-[#f8f6f1] hover:bg-[#efeae0] disabled:opacity-40 disabled:cursor-not-allowed text-[#112217] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <ShoppingBag className="w-4 h-4 -ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
