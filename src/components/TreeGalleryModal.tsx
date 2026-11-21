import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import {
  DEFAULT_TARGET_HEIGHT,
  HEIGHT_ORDER,
  TreeHeight,
  TreeOffer,
  formatUAH,
  getTreePriceTier,
} from '../data/trees';

interface TreeGalleryModalProps {
  tree: TreeOffer | null;
  initialIndex?: number;
  initialHeight?: TreeHeight;
  onClose: () => void;
  onOrder: (tree: TreeOffer, height: TreeHeight) => void;
}

const MOBILE_BREAKPOINT = 768;

export function TreeGalleryModal({
  tree,
  initialIndex = 0,
  initialHeight = DEFAULT_TARGET_HEIGHT,
  onClose,
  onOrder,
}: TreeGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [selectedHeight, setSelectedHeight] = useState<TreeHeight>(initialHeight);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [mobileTop, setMobileTop] = useState(12);

  const cardRef = useRef<HTMLDivElement>(null);
  const openScrollYRef = useRef(0);

  const totalItems = tree ? tree.gallery.length + (tree.video ? 1 : 0) : 0;

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, tree?.id]);

  useEffect(() => {
    setSelectedHeight(initialHeight);
  }, [initialHeight, tree?.id]);

  // Anchor the non-fixed mobile popup to current scroll position on open
  useLayoutEffect(() => {
    if (!tree) return;
    const checkViewport = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) {
        const y = window.scrollY;
        openScrollYRef.current = y;
        setMobileTop(Math.max(12, y + 12));
      }
    };
    checkViewport();

    const onResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [tree]);

  // Auto-close mobile popup once user scrolls far enough away from it
  useEffect(() => {
    if (!tree || !isMobile) return;

    const handleScroll = () => {
      const el = cardRef.current;
      if (!el) return;
      if (Math.abs(window.scrollY - openScrollYRef.current) < 80) return;

      const rect = el.getBoundingClientRect();
      const exitMargin = Math.min(110, window.innerHeight * 0.16);
      if (rect.bottom < exitMargin || rect.top > window.innerHeight - exitMargin) {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tree, isMobile, onClose]);

  useEffect(() => {
    if (!tree || totalItems === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % totalItems);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tree, totalItems, onClose]);

  if (!tree) return null;

  const isVideoActive = Boolean(tree.video && activeIndex === tree.gallery.length);
  const currentPhoto = tree.gallery[activeIndex] ?? tree.gallery[0];
  const currentLabel = isVideoActive && tree.video ? tree.video.label : currentPhoto.label;
  const tier = getTreePriceTier(tree, selectedHeight);
  const stock = tree.stockByHeight[selectedHeight];

  return (
    <>
      {/* Mobile dimmed backdrop stays behind the non-fixed scrollable popup */}
      {isMobile && (
        <div
          className="fixed inset-0 z-[45] bg-[#09170f]/80 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Фотогалерея ${tree.name}`}
        style={isMobile ? { top: `${mobileTop}px` } : undefined}
        onClick={onClose}
        className={
          isMobile
            ? 'absolute inset-x-0 z-50 px-3 pb-6'
            : 'fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#09170f]/80 backdrop-blur-xs'
        }
      >
        <div
          ref={cardRef}
          className="relative mx-auto w-full max-w-4xl bg-[#f8f6f1] text-[#112217] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 md:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* High-contrast Close Button visible immediately at top-right on both mobile & desktop */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити галерею"
            className="absolute top-3 right-3 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#f8f6f1] hover:bg-white text-[#112217] border border-[#0e2216]/25 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Left: Large Photo / Video Viewer */}
          <div className="md:col-span-7 relative bg-[#0e2216] flex items-center justify-center min-h-[260px] md:min-h-[540px]">
            {isVideoActive && tree.video ? (
              <video
                key={tree.video.src}
                src={tree.video.src}
                poster={tree.video.poster}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full max-h-[54vh] md:max-h-[82vh] object-contain bg-[#09170f]"
              />
            ) : (
              <img
                src={currentPhoto.src}
                alt={`${tree.name} — ${currentPhoto.label}`}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[54vh] md:max-h-[82vh] object-contain"
              />
            )}

            {/* Prev / Next arrows */}
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)}
              aria-label="Попередній слайд"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#09170f]/75 text-[#f3ead3] hover:bg-[#09170f] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % totalItems)}
              aria-label="Наступний слайд"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#09170f]/75 text-[#f3ead3] hover:bg-[#09170f] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {!isVideoActive && (
              <div className="absolute bottom-3 left-4 bg-[#09170f]/80 text-[#f3ead3] text-xs font-semibold px-3 py-1.5 rounded-md tabular-nums">
                {currentLabel} · {activeIndex + 1}/{totalItems}
              </div>
            )}
          </div>

          {/* Right: Thumbnails + Quick Purchase */}
          <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between md:overflow-y-auto">
            <div>
              <div className="md:pr-11">
                <p className="text-xs font-medium text-[#0e2216]/65">
                  {tree.materialTag} · Оплата при отриманні
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#112217] mt-0.5">
                  {tree.name}
                </h3>
              </div>

              <p className="mt-2 text-sm text-[#112217]/75 leading-relaxed">
                {tree.needleNote}
              </p>

              {/* Thumbnail Grid */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#112217]/80 mb-2">
                  Усі ракурси{tree.video ? ', відеоогляд' : ''} та макро хвої:
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

                  {tree.video && (
                    <button
                      type="button"
                      onClick={() => setActiveIndex(tree.gallery.length)}
                      className={`group flex flex-col items-center rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        isVideoActive
                          ? 'border-[#b81d24] ring-2 ring-[#b81d24]/30'
                          : 'border-[#0e2216]/15 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="relative w-full aspect-[3/4] bg-[#0e2216]">
                        <img
                          src={tree.video.poster}
                          alt={`${tree.name} — ${tree.video.label}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-[#09170f]/35">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#b81d24] text-white shadow">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>
                      <span className="w-full py-1 px-1 text-[10px] font-semibold text-center bg-white text-[#b81d24] truncate">
                        {tree.video.label}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Height Selection inside modal */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#112217]/80">Висота:</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      stock > 0 ? 'text-[#b81d24]' : 'text-[#112217]/50'
                    }`}
                  >
                    {stock > 0 ? `Залишилось ${stock} шт.` : 'Немає в наявності'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {HEIGHT_ORDER.map((h) => {
                    const active = selectedHeight === h;
                    const isOut = tree.stockByHeight[h] === 0;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHeight(h)}
                        className={`py-2 px-1 rounded-md text-xs font-semibold cursor-pointer tabular-nums ${
                          active
                            ? 'bg-[#0e2216] text-[#f3ead3]'
                            : isOut
                              ? 'bg-white text-[#112217]/35 border border-[#0e2216]/10 line-through'
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
                disabled={stock === 0}
                onClick={() => {
                  if (stock === 0) return;
                  onOrder(tree, selectedHeight);
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#b81d24] hover:bg-[#99151b] disabled:bg-[#112217]/20 disabled:text-[#112217]/50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-5 rounded-lg transition-colors cursor-pointer"
              >
                <span>
                  {stock > 0
                    ? `Забрати ${tree.name} ${selectedHeight} по знижці`
                    : `${tree.name} ${selectedHeight} — немає в наявності`}
                </span>
                {stock > 0 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
