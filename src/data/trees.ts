export type TreeHeight = '1,5 м' | '1,8 м' | '2,1 м' | '2,3 м' | '2,5 м';

export interface PriceTier {
  height: TreeHeight;
  shortLabel: string;
  originalPrice: number;
  discountPercent: number;
  salePrice: number;
  deliveryLabel: string;
  estimatedDeliveryCost: string;
  recommended?: boolean;
}

export interface TreeGalleryPhoto {
  src: string;
  label: string;
}

export interface TreeOffer {
  id: string;
  name: string;
  materialTag: string;
  description: string;
  needleNote: string;
  image: string;
  gallery: TreeGalleryPhoto[];
  stockByHeight: Record<TreeHeight, number>;
}

export const HEIGHT_ORDER: TreeHeight[] = ['1,5 м', '1,8 м', '2,1 м', '2,3 м', '2,5 м'];

export const DEFAULT_TARGET_HEIGHT: TreeHeight = '1,8 м';

export const PRICE_TIERS: Record<TreeHeight, PriceTier> = {
  '1,5 м': {
    height: '1,5 м',
    shortLabel: '1,5м',
    originalPrice: 4680,
    discountPercent: 25,
    salePrice: 3510,
    deliveryLabel: 'Стандартна коробка до 15 кг',
    estimatedDeliveryCost: 'від 135 грн',
  },
  '1,8 м': {
    height: '1,8 м',
    shortLabel: '1,8м',
    originalPrice: 7620,
    discountPercent: 25,
    salePrice: 5715,
    deliveryLabel: 'Хіт · Дешева доставка у відділення',
    estimatedDeliveryCost: 'від 165 грн',
    recommended: true,
  },
  '2,1 м': {
    height: '2,1 м',
    shortLabel: '2,1м',
    originalPrice: 9840,
    discountPercent: 25,
    salePrice: 7380,
    deliveryLabel: 'Великогабаритне відділення',
    estimatedDeliveryCost: 'від 280 грн',
  },
  '2,3 м': {
    height: '2,3 м',
    shortLabel: '2,3м',
    originalPrice: 11880,
    discountPercent: 25,
    salePrice: 8910,
    deliveryLabel: 'Вантажне відділення / курʼєр',
    estimatedDeliveryCost: 'від 360 грн',
  },
  '2,5 м': {
    height: '2,5 м',
    shortLabel: '2,5м',
    originalPrice: 15840,
    discountPercent: 25,
    salePrice: 11880,
    deliveryLabel: 'Вантажне відділення / курʼєр',
    estimatedDeliveryCost: 'від 450 грн',
  },
};

export const TREE_OFFERS: TreeOffer[] = [
  {
    id: 'alaska',
    name: 'Аляска',
    materialTag: '100% лита хвоя PE',
    description:
      'Класична лісова красуня з густими мʼякими гілочками, які не обсипаються і не колються. Максимально наближена до живої карпатської смереки.',
    needleNote: 'Насичений природний зелений відтінок, металева підставка в комплекті.',
    image: '/assets/trees/alaska_01.jpg',
    gallery: [
      { src: '/assets/trees/alaska_01.jpg', label: 'Біля каміна' },
      { src: '/assets/trees/alaska_04.jpg', label: 'Хвоя зблизька' },
      { src: '/assets/trees/alaska_05.jpg', label: 'Гілка макро' },
      { src: '/assets/trees/alaska_06.jpg', label: 'Денне світло' },
    ],
    stockByHeight: {
      '1,5 м': 8,
      '1,8 м': 3,
      '2,1 м': 6,
      '2,3 м': 4,
      '2,5 м': 2,
    },
  },
  {
    id: 'alaska-snow',
    name: 'Аляска сніг',
    materialTag: 'Лита хвоя + засніження',
    description:
      'Модель Аляска з преміальним щільним напиленням білого штучного снігу. Безпечний фіксуючий склад без запаху, тримається роками.',
    needleNote: 'Ефект свіжого зимового інею, густа крона до самої підлоги.',
    image: '/assets/trees/07_alaska_snih_01.jpg',
    gallery: [
      { src: '/assets/trees/07_alaska_snih_01.jpg', label: 'Загальний вигляд' },
      { src: '/assets/trees/07_alaska_snih_04.jpg', label: 'Хвоя зблизька' },
      { src: '/assets/trees/07_alaska_snih_05.jpg', label: 'Сніг макро' },
      { src: '/assets/trees/07_alaska_snih_02.jpg', label: 'Інший ракурс' },
    ],
    stockByHeight: {
      '1,5 м': 6,
      '1,8 м': 2,
      '2,1 м': 5,
      '2,3 м': 3,
      '2,5 м': 2,
    },
  },
  {
    id: 'finnish-green',
    name: 'Фінська зелена',
    materialTag: '100% лита хвоя PE',
    description:
      'Ялинка з виразними ярусними горизонтальними гілками у скандинавському стилі. Зручно розвішувати великі іграшки та гірлянди.',
    needleNote: 'Свіжий хвойний зелений тон, посилений сталевий каркас.',
    image: '/assets/trees/finska_green_01.jpg',
    gallery: [
      { src: '/assets/trees/finska_green_01.jpg', label: 'Біля каміна' },
      { src: '/assets/trees/finska_green_03.jpg', label: 'Хвоя зблизька' },
      { src: '/assets/trees/finska_green_05.jpg', label: 'Гілки макро' },
      { src: '/assets/trees/finska_green_06.jpg', label: 'Денне світло' },
    ],
    stockByHeight: {
      '1,5 м': 9,
      '1,8 м': 4,
      '2,1 м': 7,
      '2,3 м': 5,
      '2,5 м': 3,
    },
  },
  {
    id: 'finnish-emerald',
    name: 'Фінська Смарагдова',
    materialTag: '100% лита хвоя PE',
    description:
      'Шляхетний смарагдово-блакитний відтінок хвої, натхненний північними ялинами. Виглядає ефектно навіть без декору.',
    needleNote: 'Глибокий смарагдовий колір з легким сріблястим переливом.',
    image: '/assets/trees/finska_smarahd_07.jpg',
    gallery: [
      { src: '/assets/trees/finska_smarahd_07.jpg', label: 'Без декору' },
      { src: '/assets/trees/finska_smarahd_01.jpg', label: 'З декором' },
      { src: '/assets/trees/finska_smarahd_03.jpg', label: 'Хвоя зблизька' },
      { src: '/assets/trees/finska_smarahd_08.jpg', label: 'Денне світло' },
    ],
    stockByHeight: {
      '1,5 м': 5,
      '1,8 м': 3,
      '2,1 м': 4,
      '2,3 м': 2,
      '2,5 м': 1,
    },
  },
  {
    id: 'pine',
    name: 'Сосна',
    materialTag: 'Пухнаста довга хвоя',
    description:
      'Пишна традиційна сосна з довгими шовковистими голками насиченого зеленого кольору. Обʼємний силует, який заповнює простір затишком.',
    needleNote: 'Подовжені гнучкі голки, стійка розбірна конструкція.',
    image: '/assets/trees/sosna_06.jpg',
    gallery: [
      { src: '/assets/trees/sosna_06.jpg', label: 'Загальний вигляд' },
      { src: '/assets/trees/sosna_07.jpg', label: 'Хвоя зблизька' },
      { src: '/assets/trees/sosna_04.jpg', label: 'Боковий ракурс' },
      { src: '/assets/trees/sosna_01.jpg', label: 'В інтерʼєрі' },
    ],
    stockByHeight: {
      '1,5 м': 7,
      '1,8 м': 4,
      '2,1 м': 8,
      '2,3 м': 5,
      '2,5 м': 3,
    },
  },
];

export const LOGO_PATH = '/assets/aistudio/image_98a6d909.png';

export function formatUAH(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
