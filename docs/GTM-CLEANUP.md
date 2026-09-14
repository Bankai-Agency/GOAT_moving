# GTM GOAT Movers: чистка контейнера без потери аналитики

Контейнер: GTM-W5VQHNGV, сайт thegoatmovers.net. Разбор сделан по опубликованной версии контейнера (gtm.js) 14.09.2026. Имена тегов в опубликованный код не попадают, поэтому каждый тег ниже описан фрагментом его кода: откройте тег в GTM и сверьте.

# 1. Что сейчас в контейнере

32 тега, 58 переменных, 13 правил. Вес 532 КБ, при загрузке на телефоне выполняется одной задачей около 2 секунд. Lighthouse из-за контейнера теряет 14 баллов по производительности и 10 по «рекомендациям».

## Работает и остаётся как есть
- GA4 (G-ZWKYKS6SB2): конфигурация, события «Phone Link Clicks», «Click Button - REQUEST A QUOTE», «GTM_View_Confirmation Page».
- Google Ads (AW-303316957): конфигурация, ремаркетинг, conversion linker, конверсия с label giGdCIj-2LEZEN3_0JAB, user-provided data.
- Microsoft Clarity (проект md9tf0il0l, шаблон из галереи).
- CallRail (swap.js, компания 250387318).

## Сломано прямо сейчас
Все теги, которые фиксируют отправку формы, висят на одном триггере: клик по элементу с текстом «Continue», при этом переменные «имя» и «телефон» должны быть непустыми. Эти переменные читают поля #modal-fullName, #lp-input-fullName, #modal-phone, #lp-input-phone. На текущем сайте таких элементов нет (это селекторы старой версии), а кнопка отправки называется «Submit Request». Поэтому на thegoatmovers.net не срабатывают:
- конверсия Google Ads (label giGdCIj-2LEZEN3_0JAB);
- событие GA4 «GTM - Send Form»;
- Ads user-provided data;
- запись заявки в Google-таблицу (Apps Script).

Заявки при этом доходят: сайт отправляет их в CRM MoveBoard напрямую с сервера (api.goatmovers.org). Теряется только аналитика конверсий, и Google Ads оптимизируется вслепую.

Отдельно: событие «Click Button - REQUEST A QUOTE» ищет в тексте клика «REQUEST A QUOTE» заглавными, а в разметке кнопка называется «Request a Quote» (заглавные добавляет CSS). Проверить в режиме Preview, срабатывает ли; если нет, заменить условие на «contains Request a Quote».

## Вредит производительности
- Тег Custom HTML с кодом function getIP(){var a=new XMLHttpRequest;a.open("GET","https://api.ipify.org?format=json",!1) ... window.userIP=getIP(). Синхронный запрос, триггер Initialization: замораживает страницу до ответа чужого сервера на самом старте загрузки. Это же даёт провал «Uses deprecated APIs».
- Пять веб-хуков Google Apps Script (четыре тега Custom Image и один Custom HTML), все начинаются с https://script.google.com/macros/s/. Один из них (тег Custom Image с триггером DOM Ready) стреляет при каждом просмотре каждой страницы.
- Custom HTML с библиотекой sourcebuster (14 КБ кода, заканчивается на sbjs.init()), триггер All Pages.
- 23 переменные, на которые ничего не ссылается.

# 2. Что не трогать

Ни один тег GA4, Ads, Clarity и CallRail не удаляем и не меняем, кроме триггера у тегов из раздела 3.4. Встроенные переменные (Click Text, Click URL, Page URL, Referrer и т.д.) не трогаем.

# 3. Шаги

Делайте в рабочей области (Workspace), после каждого шага проверяйте в Preview, публикуйте одной версией в конце.

## 3.1. Убрать синхронный запрос IP
Найти: Tags → тип Custom HTML → код содержит api.ipify.org и new XMLHttpRequest.
Вариант А (рекомендую): удалить тег и переменную «userIP» (тип JavaScript Variable, имя переменной userIP). IP уходил только в Google-таблицу вместе с заявкой.
Вариант Б, если IP в таблице нужен: заменить код тега на асинхронный:
```html
<script>
(function(){
  try{
    fetch("https://api.ipify.org?format=json").then(function(r){return r.json()}).then(function(d){window.userIP=d.ip}).catch(function(){});
  }catch(e){}
})();
</script>
```
и перевести триггер с Initialization на Window Loaded. Заявка, отправленная раньше ответа, уйдёт без IP, это допустимо.

## 3.2. Оставить один веб-хук Apps Script
Найти: Tags → типы Custom Image и Custom HTML, URL начинается с https://script.google.com/macros/s/AKfycb.
Их пять, у каждого свой адрес скрипта (AKfycbwiVp..., AKfycbyZPF..., AKfycbzrZY..., AKfycbwPNj..., AKfycbzpmr...). Открыть каждый, посмотреть, в какую таблицу он пишет (адрес скрипта ведёт в Apps Script владельца таблицы).
- Тег Custom Image с триггером DOM Ready (три одинаковых триггера с условием Page URL не равно undefined) пишет просмотры страниц. Если журнал просмотров никто не смотрит, удалить вместе с триггерами. Если смотрят, оставить, но триггер один.
- Тег Custom HTML с var name=..., var email=..., var phone=..., if(!name||!email||!phone)return; пишет заявку. Это основной, оставить.
- Custom Image на «Continue» (та же заявка вторым способом) удалить: дубль основного.
- Custom Image на клик по tel: (три триггера с Click URL contains tel:) пишет звонки. Оставить один триггер вместо трёх, если журнал звонков нужен; иначе удалить.
- Custom Image на событие abandoned_form пишет брошенные формы. Оставить, если журнал нужен.

## 3.3. Удалить мёртвые переменные
Variables → User-Defined. Удалить те, на которые ничего не ссылается (GTM покажет предупреждение, если ссылка есть, тогда не удалять):
- Custom JavaScript с document.querySelectorAll("#modal-email, #lp-input-email") - поля не существуют.
- Constant со значением giGdCIj-2LEZEN3_0JAB, если конверсия Ads использует label напрямую, а не через эту переменную.
- Все Data Layer Variable вида gtm.element, gtm.elementClasses, gtm.elementId, gtm.elementTarget, gtm.elementUrl, gtm.errorMessage, gtm.errorUrl, gtm.errorLineNumber, созданные вручную (по одной копии каждой не используется).
- Лишние копии URL, Auto-Event Variable, Random Number, Container ID, HTML ID, Event.
Правило простое: перед удалением открыть переменную, вкладка «References» должна быть пустой.

## 3.4. Починить конверсию с формы
Сайт отправляет в dataLayer событие generate_lead после того, как сервер принял заявку. Это делают все двенадцать форм (главный сайт, лендинги lp, lp1, lp4: встроенная, модальная и короткая) через один общий модуль src/lib/analytics/submit-quote.ts. Поля события:

| Ключ | Что внутри | Пример |
| --- | --- | --- |
| event | всегда generate_lead | generate_lead |
| form_location | какая форма: embedded_hero, modal, embedded_form | modal |
| city | город страницы, если есть, иначе пусто | portland |
| lead_name | имя как ввели | Jane Doe |
| lead_email | email в нижнем регистре | jane@example.com |
| lead_phone | телефон, только цифры и плюс | +13605240846 |

Событие уходит только при ответе сервера 2xx, то есть заявка реально дошла до CRM.

1. Triggers → New → Custom Event, имя события generate_lead, «All Custom Events». Назвать «Lead - generate_lead».
2. Variables → New → Data Layer Variable для каждого поля: form_location, city, lead_name, lead_email, lead_phone. Назвать DL - form_location и т.д.
3. Тег GA4 «GTM - Send Form»: триггер заменить на «Lead - generate_lead». В параметры события можно добавить form_location и city. lead_name, lead_email, lead_phone в GA4 НЕ передавать, это персональные данные.
4. Тег Ads Conversion (label giGdCIj...): триггер заменить на «Lead - generate_lead».
5. Тег Ads User-Provided Data: Variables → New → User-Provided Data → Manual configuration: Email = DL - lead_email, Phone = DL - lead_phone, First name = DL - lead_name. Указать эту переменную в теге, триггер «Lead - generate_lead».
6. Основной тег записи в таблицу: триггер «Lead - generate_lead»; переменные имени, email и телефона заменить на DL - lead_name, DL - lead_email, DL - lead_phone. Тег с записью lead_name в sessionStorage после этого не нужен, удалить.
7. Старый триггер (Click, текст содержит Continue, две переменные matches RegEx .+) удалить вместе с переменными «имя из #modal-fullName» и «телефон из #modal-phone».

Запасной вариант, если dataLayer по какой-то причине не подходит: триггер Page View с условием Page Path equals /thank-you. Он проще, но считает и прямые заходы на страницу спасибо, поэтому основной вариант выше.

## 3.5. Не запускать тяжёлое до загрузки страницы
У тегов sourcebuster, «слежение за формами» (document.addEventListener("input" ...) и window.addEventListener("beforeunload" ...)) сменить триггер All Pages на Window Loaded. Аналитика не меняется: эти скрипты нужны только к моменту отправки формы.

## 3.6. Опционально: sourcebuster
Если источник визита нужен только для записи в таблицу, его можно заменить встроенными переменными Referrer и URL с utm_source, utm_medium, utm_campaign, а библиотеку удалить. Если нет уверенности, оставить, после шага 3.5 он уже не мешает.

# 4. Проверка перед публикацией

1. Preview (Tag Assistant): открыть главную, /local-moving, /portland-movers, /lp/movers-portland. На каждой странице должны сработать: GA4 config, Ads config, Ads remarketing, conversion linker, Clarity, CallRail. Не должно быть тега getIP.
2. Отправить тестовую заявку: в Preview на событии generate_lead должны сработать GA4 «GTM - Send Form», Ads conversion, Ads user data, запись в таблицу. В GA4 DebugView появляется событие, в таблице появляется строка.
3. Клик по номеру телефона: срабатывает «Phone Link Clicks».
4. Клик по «Request a Quote» в шапке: срабатывает «Click Button - REQUEST A QUOTE».
5. После публикации: Lighthouse на thegoatmovers.net, вкладка Best Practices не должна показывать «Uses deprecated APIs»; общий вес контейнера ожидаемо 250-300 КБ вместо 532.

# 5. Что не изменится

Провал «Uses third-party cookies» в Lighthouse останется: cookies ставят Google Ads и Clarity, без них они не работают. Это нормально для сайта с рекламой.
