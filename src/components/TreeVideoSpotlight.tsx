import { useRef, useState } from 'react';
import { Maximize2, Play } from 'lucide-react';
import { TreeOffer } from '../data/trees';

interface TreeVideoSpotlightProps {
  tree: TreeOffer;
  onOpenModalVideo: (tree: TreeOffer) => void;
}

export function TreeVideoSpotlight({ tree, onOpenModalVideo }: TreeVideoSpotlightProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!tree.video) return null;

  const handleStartPlay = () => {
    setIsPlaying(true);
    window.setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 0);
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#0e2216]/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
      <div className="lg:col-span-7 relative aspect-video rounded-lg overflow-hidden bg-[#0e2216]">
        <video
          ref={videoRef}
          src={tree.video.src}
          poster={tree.video.poster}
          muted
          playsInline
          loop
          controls={isPlaying}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          className="w-full h-full object-cover"
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={handleStartPlay}
            aria-label={`Відтворити відеоогляд ${tree.name}`}
            className="group absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#09170f]/40 hover:bg-[#09170f]/30 transition-colors cursor-pointer text-white p-4"
          >
            <span className="inline-flex items-center gap-2.5 bg-[#b81d24] group-hover:bg-[#99151b] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-[1.03]">
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>Дивитись відеоогляд (42 сек)</span>
            </span>
            <span className="mt-2.5 text-xs font-medium text-[#f3ead3]/90">
              {tree.video.caption}
            </span>
          </button>
        )}
      </div>

      <div className="lg:col-span-5 space-y-2.5">
        <p className="text-xs font-semibold text-[#b81d24]">Живе відео · Додатковий огляд</p>
        <h4 className="font-display text-xl sm:text-2xl font-bold text-[#112217]">
          {tree.name} у домашньому інтерʼєрі
        </h4>
        <p className="text-sm text-[#112217]/75 leading-relaxed">
          На відео видно реальну текстуру 100% литої хвої PE та глибокий смарагдовий відлив із гірляндою й декором біля каміна — без фоторетуші та фільтрів.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onOpenModalVideo(tree)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0e2216] hover:text-[#b81d24] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Відкрити відео разом із фотогалереєю</span>
          </button>
        </div>
      </div>
    </div>
  );
}
