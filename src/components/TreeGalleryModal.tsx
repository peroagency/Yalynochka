import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  DEFAULT_TARGET_HEIGHT,
  HEIGHT_ORDER,
  PRICE_TIERS,
  TreeHeight,
  TreeOffer,
  formatUAH,
} from '../data/trees';

interface TreeGalleryModalProps {
  tree: TreeOffer | null;
  initialIndex?: number;
  initialHeight?: TreeHeight;
  onClose: () => void;
  onOrder: (tree: TreeOffer, height: TreeHeight) => void;
}

export function TreeGalleryModal({
  tree,
  initialIndex = 0,
  initialHeight = DEFAULT_TARGET_HEIGHT,
  onClose,
  onOrder,
}: TreeGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [selectedHeight, setSelectedHeight] = useState<TreeHeight>(initialHeight);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, tree?.id]);

  useEffect(() => {
    setSelectedHeight(initialHeight);
  }, [initialHeight, tree?.id]);

  useEffect(() => {
    if (!tree) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % tree.gallery.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + tree.gallery.length) % tree.gallery.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tree, onClose]);

  if (!tree) return null;

  const currentPhoto = tree.gallery[activeIndex] ?? tree.gallery[0];
  const tier = PRICE_TIERS[selectedHeight];
  const stock = tree.stockByHeight[selectedHeight];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#09170f]/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`Фотогалерея ${tree.name}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#f8f6f1] text-[#112217] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Large Photo Viewer */}
        <div className="md:col-span-7 relative bg-[#0e2216] flex items-center justify-center min-h-[340px] md:min-h-[540px]">
          <img
            src={currentPhoto.src}
            alt={`${tree.name} — ${currentPhoto.label}`}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[60vh] md:max-h-[82vh] object-contain"
          />

          {/* Prev / Next arrows */}
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev - 1 + tree.gallery.length) % tree.gallery.length)
            }
            aria-label="Попереднє фото"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#09170f]/75 text-[#f3ead3] hover:bg-[#09170f] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % tree.gallery.length)}
            aria-label="Наступне фото"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#09170f]/75 text-[#f3ead3] hover:bg-[#09170f] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 bg-[#09170f]/80 text-[#f3ead3] text-xs font-semibold px-3 py-1.5 rounded-md">
            {currentPhoto.label} · {activeIndex + 1}/{tree.gallery.length}
          </div>
        </div>

        {/* Right: Thumbnails + Quick Purchase */}
        <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[#0e2216]/65">
                  {tree.materialTag} · Оплата при отриманні
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#112217] mt-0.5">
                  {tree.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити галерею"
                className="p-2 rounded-lg text-[#112217]/60 hover:text-[#112217] hover:bg-[#efeae0] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-[#112217]/75 leading-relaxed">
              {tree.needleNote}
            </p>

            {/* Thumbnail Grid */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#112217]/80 mb-2">
                Усі ракурси та макро хвої:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {tree.gallery.map((photo, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`group flex flex-col items-center rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        active
                          ? 'border-[#b81d24] ring-2 ring-[#b81d24]/30'
                          : 'border-[#0e2216]/15 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.label}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <span className="w-full py-1 px-1 text-[10px] font-semibold text-center bg-white truncate">
                        {photo.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Height Selection inside modal */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#112217]/80">Висота:</span>
                <span className="font-semibold text-[#b81d24] tabular-nums">
                  Залишилось {stock} шт.
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {HEIGHT_ORDER.map((h) => {
                  const active = selectedHeight === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedHeight(h)}
                      className={`py-2 px-1 rounded-md text-xs font-semibold cursor-pointer tabular-nums ${
                        active
                          ? 'bg-[#0e2216] text-[#f3ead3]'
                          : 'bg-white text-[#112217] border border-[#0e2216]/15'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#0e2216]/12">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-xs text-[#112217]/50 line-through tabular-nums mr-2">
                  {formatUAH(tier.originalPrice)} грн
                </span>
                <span className="text-xs font-bold text-[#b81d24]">
                  −{tier.discountPercent}%
                </span>
                <div className="font-display text-3xl font-bold text-[#112217] tabular-nums">
                  {formatUAH(tier.salePrice)} <span className="text-lg">грн</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onOrder(tree, selectedHeight);
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#b81d24] hover:bg-[#99151b] text-white font-semibold text-sm py-3.5 px-5 rounded-lg transition-colors cursor-pointer"
            >
              <span>Забрати {tree.name} {selectedHeight} по знижці</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
