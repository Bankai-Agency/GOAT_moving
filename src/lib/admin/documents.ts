import { f, type Schema } from "./schema";

/**
 * Registry of editable content documents.
 *
 * Each entry maps an admin URL (`/admin/content/<id>`) to a JSON file under
 * `src/content/` plus the field schema the editor renders. Collections
 * (`kind: "collection"`) store `{ items: [...] }` and are edited one item at
 * a time (`/admin/content/<id>/<itemKey>`), with add / delete.
 *
 * Pure data — safe to import from Server and Client Components.
 */

export type DocumentGroup = "general" | "pages" | "locations" | "lps";

export type DocumentDef = {
  id: string;
  file: string;
  label: string;
  description: string;
  group: DocumentGroup;
  /** Site URLs affected by this document (revalidated after save, shown as links). */
  urls: string[];
  kind: "single" | "collection";
  /** Field schema of the document (single) or of one item (collection). */
  schema: Schema;
  /** Collection: the unique key field (used in the admin URL). */
  itemKey?: string;
  /** Collection: field shown as the item title in the list. */
  itemTitle?: string;
  /** Collection: site URL template for one item, e.g. "/{slug}". */
  itemUrl?: string;
};

/* ───────────── reusable field groups ───────────── */

const metaFields: Schema = [
  f.text("title", "Title (заголовок вкладки)", { required: true }),
  f.textarea("description", "Meta description", { rows: 3, required: true }),
  f.strings("keywords", "Ключевые слова", { optional: true, itemLabel: "слово" }),
  f.text("ogTitle", "OG title (соцсети)", { optional: true }),
  f.textarea("ogDescription", "OG description (соцсети)", { rows: 2, optional: true }),
];

const meta = f.group("meta", "SEO (title / description)", metaFields, { collapsed: true });

const faqItemFields: Schema = [
  f.text("question", "Вопрос", { required: true }),
  f.textarea("answer", "Ответ", { rows: 3, required: true }),
];

const faqList = (key = "items", label = "Вопросы") =>
  f.list(key, label, faqItemFields, { itemLabel: "вопрос", titleKey: "question" });

const reviewFields: Schema = [
  f.text("name", "Имя", { required: true, placeholder: "Amanda J." }),
  f.text("location", "Город", { placeholder: "Portland, OR" }),
  f.number("rating", "Оценка (1-5)", { min: 1, max: 5 }),
  f.textarea("text", "Текст отзыва", { rows: 4, required: true }),
  f.select("source", "Источник", [
    { value: "yelp", label: "Yelp" },
    { value: "google", label: "Google" },
  ]),
  f.image("avatar", "Аватар", { optional: true, help: "Необязательно: без фото показываются инициалы (на странице отзывов)." }),
];

const reviewsList = (key = "items", label = "Отзывы") =>
  f.list(key, label, reviewFields, { itemLabel: "отзыв", titleKey: "name" });

const iconItemFields: Schema = [
  f.icon(),
  f.text("title", "Заголовок", { required: true, help: "Перенос строки в заголовке сохраняется." }),
  f.textarea("description", "Описание", { rows: 2 }),
];

const trustItemFields: Schema = [
  f.icon(),
  f.text("title", "Заголовок", { required: true }),
  f.text("subtitle", "Подпись", { required: true }),
];

const otherServiceFields: Schema = [
  f.text("title", "Название", { required: true }),
  f.text("description", "Описание"),
  f.text("href", "Ссылка", { required: true, placeholder: "/local-moving", mono: true }),
  f.image("image", "Картинка (появляется при наведении)", { optional: true }),
];

const heroGroup = f.group("hero", "Первый экран (hero)", [
  f.image("image", "Фоновое фото"),
  f.text("imageAlt", "Alt фото (для SEO)"),
  f.text("h1Highlight", "H1 · жёлтая часть", { required: true }),
  f.text("h1Rest", "H1 · белая часть (вторая строка)", { required: true }),
  f.textarea("subtitle", "Подзаголовок", { rows: 2 }),
]);

const whatsIncludedGroup = (withLabel: boolean) =>
  f.group("whatsIncluded", "What's Included (карточки)", [
    ...(withLabel ? [f.text("label", "Надпись над заголовком")] : []),
    f.text("title", "Заголовок", { required: true }),
    f.text("subtitle", "Подзаголовок"),
    f.list("items", "Карточки", iconItemFields, { itemLabel: "карточку", titleKey: "title" }),
  ]);

const whyTrustGroup = f.group("whyTrust", "Why Trust (блок с фото)", [
  f.text("title", "Заголовок", { required: true }),
  f.textarea("description", "Описание", { rows: 3 }),
  f.image("image", "Фоновое фото"),
  f.text("imageAlt", "Alt фото"),
  f.list("items", "Пункты", trustItemFields, { itemLabel: "пункт", titleKey: "title" }),
]);

const howItWorksGroup = f.group("howItWorks", "How It Works (шаги)", [
  f.text("title", "Заголовок", { required: true }),
  f.list("steps", "Шаги", iconItemFields, { itemLabel: "шаг", titleKey: "title" }),
]);

const faqGroup = f.group("faq", "FAQ", [f.text("title", "Заголовок", { required: true }), faqList()]);

const otherServicesGroup = f.group("otherServices", "Другие услуги (карточки внизу)", [
  f.text("title", "Заголовок", { required: true }),
  f.list("items", "Карточки", otherServiceFields, { itemLabel: "карточку", titleKey: "title" }),
]);

/* ───────────── documents ───────────── */

export const DOCUMENTS: DocumentDef[] = [
  {
    id: "site",
    file: "src/content/site.json",
    label: "Контакты и общие данные",
    description: "Телефон, email, адреса, рейтинги, футер. Используются на всех страницах и лендингах.",
    group: "general",
    urls: ["/", "/contacts"],
    kind: "single",
    schema: [
      f.text("brand", "Название компании", { required: true }),
      f.text("phone", "Телефон", {
        required: true,
        mono: true,
        placeholder: "+13605240846",
        help: "В международном формате без пробелов. Все варианты написания на сайте строятся из него.",
      }),
      f.text("email", "Email", { required: true, mono: true }),
      f.text("hours", "Часы работы", { placeholder: "Mon–Sun, 8 AM – 6 PM" }),
      f.text("usdot", "USDOT #", { mono: true }),
      f.text("mc", "MC #", { mono: true }),
      f.list(
        "addresses",
        "Адреса",
        [
          f.text("label", "Адрес", { required: true, placeholder: "1178 Dock St, Tacoma, WA 98402" }),
          f.text("mapUrl", "Ссылка на карту", { mono: true }),
        ],
        { itemLabel: "адрес", titleKey: "label", min: 1 },
      ),
      f.text("mapEmbedUrl", "Embed-ссылка карты (страница Contacts)", { mono: true }),
      f.group("social", "Соцсети и площадки", [
        f.text("yelp", "Yelp", { mono: true }),
        f.text("google", "Google Maps", { mono: true }),
        f.text("instagram", "Instagram", { mono: true }),
      ]),
      f.group("ratings", "Рейтинги и счётчики", [
        f.text("overall", "Общий рейтинг", { placeholder: "4.9" }),
        f.text("totalReviews", "Всего отзывов", { placeholder: "850+" }),
        f.text("google", "Рейтинг Google", { placeholder: "4.98" }),
        f.text("googleReviews", "Отзывов Google", { placeholder: "520+" }),
        f.text("yelp", "Рейтинг Yelp", { placeholder: "4.79" }),
        f.text("yelpReviews", "Отзывов Yelp", { placeholder: "330+" }),
        f.text("lpVerifiedReviews", "«Verified Reviews» на лендингах", { placeholder: "437+" }),
        f.text("fiveStarReviews", "«5-Star Reviews» в карусели отзывов", { placeholder: "500+" }),
      ]),
      f.group("footer", "Футер", [
        f.text("formHeading", "Заголовок над формой"),
        f.textarea("formText", "Текст над формой", { rows: 3 }),
        f.textarea("about", "About (текст о компании)", { rows: 3 }),
        f.text("copyright", "Копирайт"),
      ]),
    ],
  },
  {
    id: "shared",
    file: "src/content/shared.json",
    label: "Общие блоки",
    description: "Секции, которые повторяются на разных страницах: отзывы, What's Included, шаги, зона обслуживания, CTA.",
    group: "general",
    urls: ["/local-moving", "/portland-movers"],
    kind: "single",
    schema: [
      f.group("reviews", "Отзывы (карусель на страницах услуг, городов и лендингах)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        reviewsList(),
      ]),
      whatsIncludedGroup(true),
      f.group("howItWorks", "How It Works (шаги, Local Moving)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок", { required: true }),
        f.list("steps", "Шаги", iconItemFields, { itemLabel: "шаг", titleKey: "title" }),
      ]),
      f.group("whyTrust", "Why GOAT (страницы городов)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок по умолчанию"),
        f.textarea("description", "Описание по умолчанию", { rows: 3 }),
        f.image("image", "Фоновое фото по умолчанию"),
        f.text("imageAlt", "Alt фото"),
        f.list("items", "Пункты", trustItemFields, { itemLabel: "пункт", titleKey: "title" }),
      ]),
      f.group("serviceArea", "Service Area (Local Moving)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        f.textarea("subtitle", "Подзаголовок", { rows: 2 }),
        f.list(
          "areas",
          "Города",
          [
            f.text("city", "Город", { required: true }),
            f.text("state", "Штат", { optional: true, placeholder: "OR" }),
            f.text("href", "Ссылка на страницу города", { optional: true, mono: true, placeholder: "/portland-movers" }),
          ],
          { itemLabel: "город", titleKey: "city" },
        ),
      ]),
      f.group("otherServices", "Другие услуги (по умолчанию)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        f.list("items", "Карточки", otherServiceFields, { itemLabel: "карточку", titleKey: "title" }),
      ]),
      f.group("ctaBanner", "CTA-баннер (по умолчанию)", [
        f.text("heading", "Заголовок"),
        f.text("tagline", "Строка на жёлтой плашке"),
        f.text("buttonText", "Текст кнопки"),
        f.image("image", "Фото"),
      ]),
    ],
  },
  {
    id: "home",
    file: "src/content/home.json",
    label: "Главная",
    description: "Фразы hero-видео, миссия, услуги, шаги, цифры доверия, цитаты, FAQ.",
    group: "pages",
    urls: ["/"],
    kind: "single",
    schema: [
      meta,
      f.group("hero", "Hero (фразы поверх видео)", [
        f.strings("phrases", "Фразы (сменяются при прокрутке)", { itemLabel: "фразу" }),
      ]),
      f.textarea("mission", "Миссия (большой текст после hero)", { rows: 2 }),
      f.list(
        "services",
        "Услуги (липкий блок с видео)",
        [
          f.text("eyebrow", "Надпись", { placeholder: "Service 01" }),
          f.text("h2", "Заголовок", { required: true }),
          f.textarea("p", "Описание", { rows: 3 }),
          f.image("image", "Постер (первый кадр)"),
          f.video("video", "Видео (mp4)"),
          f.select(
            "fit",
            "Кадрирование видео на мобильном",
            [
              { value: "cover", label: "cover (заполнить)" },
              { value: "contain", label: "contain (вписать)" },
            ],
            { optional: true },
          ),
        ],
        { itemLabel: "услугу", titleKey: "h2", min: 1 },
      ),
      f.group("ctaBeat", "CTA-экран («Make the next move…»)", [
        f.text("eyebrow", "Надпись"),
        f.text("headline", "Заголовок"),
        f.text("mark", "Короткая надпись (появляется после)"),
        f.text("buttonLabel", "Текст кнопки"),
      ]),
      f.list(
        "steps",
        "Шаги (блок с большими фото)",
        [
          f.text("label", "Надпись", { placeholder: "Step 01" }),
          f.text("title", "Заголовок", { required: true }),
          f.textarea("body", "Текст", { rows: 3 }),
          f.image("image", "Фото"),
        ],
        { itemLabel: "шаг", titleKey: "title", min: 1 },
      ),
      f.group("trust", "Цифры доверия", [
        f.list(
          "items",
          "Плитки (показываются первые 4)",
          [f.text("eyebrow", "Надпись"), f.text("value", "Значение", { required: true }), f.text("label", "Подпись")],
          { itemLabel: "плитку", titleKey: "value" },
        ),
      ]),
      f.group("testimonials", "Цитаты (карусель на фото)", [
        f.image("photo", "Фото фона"),
        f.list(
          "quotes",
          "Цитаты",
          [
            f.textarea("quote", "Цитата", { rows: 3, required: true }),
            f.text("author", "Автор", { required: true }),
            f.text("role", "Подпись"),
            f.number("rating", "Оценка", { min: 1, max: 5 }),
          ],
          { itemLabel: "цитату", titleKey: "author", min: 1 },
        ),
      ]),
      f.group("faq", "FAQ", [f.text("label", "Надпись над заголовком"), f.text("title", "Заголовок"), faqList()]),
    ],
  },
  {
    id: "services/local-moving",
    file: "src/content/services/local-moving.json",
    label: "Local Moving",
    description: "Страница /local-moving. Карточки What's Included и шаги берутся из «Общих блоков».",
    group: "pages",
    urls: ["/local-moving"],
    kind: "single",
    schema: [
      meta,
      heroGroup,
      f.group("rates", "Блок цен", [f.text("title", "Заголовок"), f.textarea("subtitle", "Подзаголовок", { rows: 2 })]),
      faqGroup,
      otherServicesGroup,
    ],
  },
  {
    id: "services/long-distance-moving",
    file: "src/content/services/long-distance-moving.json",
    label: "Long Distance Moving",
    description: "Страница /long-distance-moving.",
    group: "pages",
    urls: ["/long-distance-moving"],
    kind: "single",
    schema: [
      meta,
      heroGroup,
      whatsIncludedGroup(false),
      whyTrustGroup,
      howItWorksGroup,
      f.group("routes", "Маршруты (Where We Move)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        f.list(
          "items",
          "Маршруты",
          [
            f.text("fromCode", "Код откуда", { placeholder: "PDX" }),
            f.text("fromName", "Откуда", { placeholder: "Portland, OR" }),
            f.text("toCode", "Код куда", { placeholder: "CA" }),
            f.text("toName", "Куда", { placeholder: "California" }),
            f.text("desc", "Описание"),
          ],
          { itemLabel: "маршрут", titleKey: "toName" },
        ),
      ]),
      faqGroup,
      otherServicesGroup,
    ],
  },
  {
    id: "services/commercial-moving",
    file: "src/content/services/commercial-moving.json",
    label: "Commercial Moving",
    description: "Страница /commercial-moving.",
    group: "pages",
    urls: ["/commercial-moving"],
    kind: "single",
    schema: [
      meta,
      heroGroup,
      whatsIncludedGroup(true),
      whyTrustGroup,
      howItWorksGroup,
      f.group("industries", "Отрасли (Industries We Move)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        f.list("items", "Карточки", iconItemFields, { itemLabel: "карточку", titleKey: "title" }),
      ]),
      faqGroup,
      otherServicesGroup,
    ],
  },
  {
    id: "services/packing-services",
    file: "src/content/services/packing-services.json",
    label: "Packing & Labor",
    description: "Страница /packing-services.",
    group: "pages",
    urls: ["/packing-services"],
    kind: "single",
    schema: [
      meta,
      heroGroup,
      f.group("serviceTypes", "Варианты услуги (What We Offer)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        f.text("subtitle", "Подзаголовок"),
        f.list(
          "items",
          "Варианты",
          [...iconItemFields, f.text("bestFor", "Best for", { optional: true, placeholder: "Best for: busy professionals…" })],
          { itemLabel: "вариант", titleKey: "title" },
        ),
      ]),
      whatsIncludedGroup(true),
      howItWorksGroup,
      f.group("fragile", "Хрупкие вещи (Items We Specialize In)", [
        f.text("label", "Надпись над заголовком"),
        f.text("title", "Заголовок"),
        f.text("subtitle", "Подзаголовок"),
        f.list("items", "Пункты", iconItemFields, { itemLabel: "пункт", titleKey: "title" }),
      ]),
      faqGroup,
      otherServicesGroup,
    ],
  },
  {
    id: "reviews",
    file: "src/content/reviews.json",
    label: "Отзывы (страница)",
    description: "Страница /reviews: заголовок и полный список отзывов.",
    group: "pages",
    urls: ["/reviews"],
    kind: "single",
    schema: [
      meta,
      f.group("hero", "Заголовок страницы", [
        f.text("h1Highlight", "H1 · жёлтая часть"),
        f.text("h1Rest", "H1 · белая часть"),
        f.text("subtitle", "Подзаголовок"),
      ]),
      reviewsList("items", "Отзывы (по 16 на страницу)"),
    ],
  },
  {
    id: "faq",
    file: "src/content/faq.json",
    label: "FAQ (страница)",
    description: "Страница /faq: категории вопросов.",
    group: "pages",
    urls: ["/faq"],
    kind: "single",
    schema: [
      meta,
      f.group("hero", "Заголовок страницы", [f.text("h1Highlight", "H1 · жёлтая часть"), f.text("h1Rest", "H1 · белая часть")]),
      f.list(
        "categories",
        "Категории",
        [
          f.text("id", "ID (латиницей, без пробелов)", { required: true, mono: true, placeholder: "pricing" }),
          f.text("label", "Название вкладки", { required: true }),
          faqList("faqs", "Вопросы"),
        ],
        { itemLabel: "категорию", titleKey: "label", min: 1 },
      ),
    ],
  },
  {
    id: "contacts",
    file: "src/content/contacts.json",
    label: "Contacts (страница)",
    description: "Страница /contacts: заголовок. Сами контакты берутся из «Контакты и общие данные».",
    group: "pages",
    urls: ["/contacts"],
    kind: "single",
    schema: [
      meta,
      f.group("hero", "Заголовок страницы", [
        f.text("h1Highlight", "H1 · жёлтая часть"),
        f.text("h1Rest", "H1 · белая часть"),
        f.text("subtitle", "Подзаголовок"),
      ]),
    ],
  },
  {
    id: "redirects",
    file: "src/content/redirects.json",
    label: "Редиректы (301)",
    description:
      "Старые адреса, которые ведут на другие страницы. Появляются сами при удалении страницы с редиректом; можно добавить и вручную. Применяются после пересборки.",
    group: "general",
    urls: [],
    kind: "collection",
    itemKey: "slug",
    itemTitle: "from",
    schema: [
      f.text("slug", "ID записи", {
        required: true,
        mono: true,
        placeholder: "old-page",
        help: "Только строчные латинские буквы, цифры и дефис. Удобно: старый адрес без «/», слэши заменить на дефис.",
      }),
      f.text("from", "Старый адрес", { required: true, mono: true, placeholder: "/old-page", help: "Путь на этом сайте, начиная с «/»." }),
      f.text("to", "Куда перенаправлять", { required: true, mono: true, placeholder: "/", help: "Путь на этом сайте, начиная с «/». Ответ 301." }),
    ],
  },
  {
    id: "locations",
    file: "src/content/locations.json",
    label: "Города (SEO-страницы)",
    description: "Страницы вида /portland-movers. Новый город появляется на сайте после пересборки.",
    group: "locations",
    urls: [],
    kind: "collection",
    itemKey: "slug",
    itemTitle: "cityDisplay",
    itemUrl: "/{slug}",
    schema: [
      f.text("slug", "Slug (адрес страницы)", {
        required: true,
        mono: true,
        placeholder: "portland-movers",
        help: "Только строчные латинские буквы, цифры и дефис. Страница будет доступна по /slug.",
      }),
      f.text("city", "Город", { required: true }),
      f.text("cityDisplay", "Город со штатом", { required: true, placeholder: "Portland, OR" }),
      f.select("state", "Штат (код)", [
        { value: "OR", label: "OR" },
        { value: "WA", label: "WA" },
      ]),
      f.select("stateLong", "Штат (полное название)", [
        { value: "Oregon", label: "Oregon" },
        { value: "Washington", label: "Washington" },
      ]),
      f.image("heroImage", "Фото первого экрана"),
      f.text("heroImagePosition", "Кадрирование фото на мобильном (Tailwind-класс)", {
        optional: true,
        mono: true,
        placeholder: "object-[25%_center]",
      }),
      f.text("metaTitle", "Title (заголовок вкладки)", { required: true }),
      f.textarea("metaDescription", "Meta description", { rows: 3, required: true }),
      f.strings("keywords", "Ключевые слова", { itemLabel: "слово" }),
      f.text("heroEyebrow", "Надпись над H1", { placeholder: "Portland, OR" }),
      f.text("h1Highlight", "H1 · жёлтая часть", { required: true }),
      f.text("h1Suffix", "H1 · остальная часть", { required: true }),
      f.textarea("heroSubtitle", "Подзаголовок hero", { rows: 3 }),
      f.textarea("servicesSubtitle", "Услуги · подзаголовок", { rows: 2 }),
      f.textarea("localMovingDescription", "Услуги · описание Local Moving", { rows: 3 }),
      f.textarea("longDistanceDescription", "Услуги · описание Long Distance", { rows: 3, optional: true }),
      f.textarea("commercialDescription", "Услуги · описание Commercial", { rows: 3, optional: true }),
      f.textarea("packingDescription", "Услуги · описание Packing", { rows: 3, optional: true }),
      f.text("whyTitle", "Why GOAT · заголовок", { required: true }),
      f.textarea("whyDescription", "Why GOAT · описание", { rows: 4 }),
      f.textarea("whatsIncludedSubtitle", "What's Included · подзаголовок", { rows: 2 }),
      f.text("ctaHeading", "CTA · заголовок"),
      f.text("ctaTagline", "CTA · строка на плашке"),
      faqList("faqs", "FAQ города"),
    ],
  },
  {
    id: "lp-cities",
    file: "src/content/lp-cities.json",
    label: "Лендинги (LP)",
    description: "Рекламные страницы /lp/movers-… (noindex). Новый лендинг появляется после пересборки.",
    group: "lps",
    urls: [],
    kind: "collection",
    itemKey: "slug",
    itemTitle: "city",
    itemUrl: "/lp/{slug}",
    schema: [
      f.text("slug", "Slug (адрес страницы)", {
        required: true,
        mono: true,
        placeholder: "movers-portland",
        help: "Страница будет доступна по /lp/slug.",
      }),
      f.text("city", "Город", { required: true }),
      f.select("state", "Штат (код)", [
        { value: "OR", label: "OR" },
        { value: "WA", label: "WA" },
      ]),
      f.select("licenseState", "Штат для «licensed and insured in …»", [
        { value: "Oregon", label: "Oregon" },
        { value: "Washington", label: "Washington" },
      ]),
      f.image("heroImage", "Фото первого экрана"),
      f.text("heroImagePosition", "Кадрирование фото на мобильном (Tailwind-класс)", {
        optional: true,
        mono: true,
        placeholder: "object-[25%_center]",
      }),
      f.text("metaTitle", "Title (заголовок вкладки)", { required: true }),
      f.textarea("metaDescription", "Meta description", { rows: 3, required: true }),
      f.textarea("aboutDescription", "Social Proof · описание", { rows: 3 }),
      f.group("solutionCopy", "Our Solution · тексты карточек", [
        f.textarea("truck", "Moving Truck & Fuel", { rows: 2 }),
        f.textarea("equipment", "Equipment", { rows: 2 }),
        f.textarea("floorProtection", "Floor & Door Protection", { rows: 2 }),
      ]),
      f.textarea("localMovingDescription", "Услуги · описание Local Moving", { rows: 3 }),
      f.textarea("commercialDescription", "Услуги · описание Commercial", { rows: 3, optional: true }),
      f.image("longDistanceImage", "Услуги · фото карточки Long Distance", { optional: true }),
      f.image("socialProofImage", "Social Proof · фото (постер видео)", { optional: true }),
      f.textarea("serviceAreaSubtitle", "Service Area · подзаголовок", { rows: 2 }),
      f.strings("neighborhoods", "Районы (Service Area)", { itemLabel: "район" }),
      faqList("faqs", "FAQ лендинга"),
      f.list("featuredReviews", "Отзывы этого города (показываются первыми)", reviewFields, {
        itemLabel: "отзыв",
        titleKey: "name",
        optional: true,
      }),
    ],
  },
];

export function findDocument(id: string): DocumentDef | undefined {
  return DOCUMENTS.find((d) => d.id === id);
}

export const GROUP_LABELS: Record<DocumentGroup, string> = {
  general: "Общее",
  pages: "Страницы",
  locations: "Города",
  lps: "Лендинги",
};
