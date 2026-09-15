# GTM GOAT Movers: чистка контейнера без потери аналитики

Контейнер: GTM-W5VQHNGV, сайт thegoatmovers.net. Разбор сделан по опубликованной версии контейнера (gtm.js) 14.09.2026. Имена тегов в опубликованный код не попадают, поэтому каждый тег ниже описан фрагментом его кода: откройте тег в GTM и сверьте.

# 0. Контейнер в чужом аккаунте: готовый файл для импорта

Проверено 15.09.2026: в аккаунте GTM Goat_Movers контейнеров нет, GTM-W5VQHNGV лежит в аккаунте другого человека, экспорт и правка из UI недоступны.

Поэтому контейнер собран заново из опубликованного gtm.js (версия 76) уже в чистом виде: файл docs/gtm/container-import.json, собирает его scripts/gtm-build-container.py, проверяет scripts/gtm-inventory.py. Шаги 3.1-3.5 ниже в нём уже сделаны, вручную по ним ходить не нужно. Файл один и тот же для обоих путей.

## Путь А: получить доступ к старому контейнеру

1. Попросить владельца: GTM → контейнер GTM-W5VQHNGV → Admin → User Management → добавить почту с правами Publish на контейнер (Publish включает Edit и экспорт).
2. Admin → Export Container → версия Live: резервная копия старой версии, положить рядом с этим файлом.
3. Admin → Import Container → Choose container file: docs/gtm/container-import.json → Existing workspace → Default Workspace → Overwrite → Confirm. Overwrite заменяет рабочую область целиком: остаются только теги, триггеры и переменные из файла, все 32 старых тега, 58 переменных, 13 триггеров и шаблон Clarity из галереи удаляются (Clarity заменяет Custom HTML).
4. Preview на thegoatmovers.net по чек-листу из раздела 4, затем Submit → Publish. Сайт менять не нужно, он уже грузит этот контейнер.

## Путь Б: свой контейнер в аккаунте Goat_Movers

1. GTM → аккаунт Goat_Movers → Create container: имя thegoatmovers.net, платформа Web. Записать новый GTM-XXXXXXX.
2. Admin → Import Container → тот же файл → Existing workspace → Default Workspace → Overwrite → Confirm.
3. Preview до публикации: Vercel → проект → Settings → Environment Variables → NEXT_PUBLIC_GTM_ID для окружения Preview = новый ID, пуш любой ветки даёт preview-URL, на нём Tag Assistant по чек-листу из раздела 4.
4. Submit → Publish. Затем NEXT_PUBLIC_GTM_ID для Production = новый ID, Redeploy. Старый контейнер сайт больше не загружает, трогать его не нужно.

## Проверка события без заявки в CRM

Тестовую заявку через форму не отправлять: она уйдёт в CRM MoveBoard. Событие эмулировать в консоли браузера на странице сайта в режиме Preview:

```js
dataLayer.push({event:"generate_lead",form_location:"test",city:"",lead_name:"Test Lead",lead_email:"test@example.com",lead_phone:"+10000000000"})
```

В Tag Assistant на событии generate_lead должны сработать: Ads - Conversion - Lead, Ads - User-Provided Data, GA4 - Event - GTM - Send Form, Sheet - Lead. Одна тестовая конверсия в Ads и одна строка в таблице появятся, это ожидаемо.

## Что внутри файла

18 тегов, 9 триггеров, 25 переменных, 13 встроенных переменных, мёртвых ссылок нет.

- Без изменений: GA4 (Google Tag G-ZWKYKS6SB2 и четыре события с прежними именами, чтобы ключевые события и отчёты в GA4 не сломались), Google Ads (Google Tag AW-303316957, ремаркетинг, conversion linker, конверсия giGdCIj-2LEZEN3_0JAB с enhanced conversions, user-provided data), CallRail swap.js.
- Clarity: Custom HTML со стандартным сниппетом проекта md9tf0il0l (шаблон из галереи в файл импорта не переносится). По желанию: добавить шаблон Microsoft Clarity из галереи с тем же Project ID и удалить Custom HTML.
- Конверсия Ads, user-provided data, GA4 «GTM - Send Form» и запись заявки в таблицу висят на триггере «Lead - generate_lead» (раздел 3.4). В GA4 уходят параметры form_location и city. Enhanced conversions берут email и телефон из переменной «UPD - Lead» (DL - lead_email, DL - lead_phone).
- Кнопка «Request a Quote»: условие заменено на matches RegEx без учёта регистра, чтобы не зависеть от CSS uppercase.
- Google-таблица: четыре веб-хука вместо пяти. «Sheet - Lead» (основной хук заявки, к прежним колонкам добавлены City и Form), «Sheet - Phone click» (клик по tel: в рекламном визите, один триггер вместо трёх), «Sheet - Abandoned form» (событие abandoned_form), «Sheet - Page view» (просмотры страниц рекламных визитов с gclid, gbraid или wbraid, как и раньше, но на Window Loaded; если журнал просмотров никто не смотрит, удалить этот тег). Колонка User_IP больше не заполняется: тег getIP удалён.
- sourcebuster на DOM Ready, слежение за формами (input + beforeunload одним тегом) на Window Loaded.
- Удалено: синхронный getIP, дубль веб-хука заявки на «Continue», тег с sessionStorage, триггер «Continue», переменные старых полей #modal-*, все 23 переменные без ссылок и константы, которые нигде не использовались.

Живая проверка 15.09.2026 (scripts/analytics-probe.js, запрос в CRM перехвачен). Основной сайт: после отправки формы сайт шлёт generate_lead, GA4 получает page_view страницы /thank-you через enhanced measurement, Ads получает автоматические события form_submit и page_view с URL /thank-you; тег конверсии с label, «GTM - Send Form», user-provided data и запись в таблицу не срабатывают. Лендинги /lp/*: всё это срабатывает, но при клике «Continue to move details» на первом шаге, до отправки заявки; на саму отправку контейнер не реагирует. Тег «GTM_View_Confirmation Page» срабатывает только при прямой загрузке /thank-you, при переходе с формы нет: переход клиентский, без события gtm.js. Итог переноса на generate_lead: на лендингах конверсий станет меньше, но это будут реальные отправки; на основном сайте они появятся впервые.

Если импорт не принимает файл: экспортировать целевой контейнер как есть (Admin → Export Container) и прислать файл, в него подставляются accountId и containerId.

Разделы 1-5 ниже описывают старый контейнер и ручную чистку; они остаются как справка о том, что и почему изменено.

# 1. Что сейчас в контейнере

32 тега, 58 переменных, 13 правил. Вес 532 КБ, при загрузке на телефоне выполняется одной задачей около 2 секунд. Lighthouse из-за контейнера теряет 14 баллов по производительности и 10 по «рекомендациям».

## Работает и остаётся как есть
- GA4 (G-ZWKYKS6SB2): конфигурация, события «Phone Link Clicks», «Click Button - REQUEST A QUOTE», «GTM_View_Confirmation Page».
- Google Ads (AW-303316957): конфигурация, ремаркетинг, conversion linker, конверсия с label giGdCIj-2LEZEN3_0JAB, user-provided data.
- Microsoft Clarity (проект md9tf0il0l, шаблон из галереи).
- CallRail (swap.js, компания 250387318).

## Сломано прямо сейчас
Все теги, которые фиксируют отправку формы, висят на одном триггере: клик по элементу с текстом «Continue», при этом переменные «имя» и «телефон» должны быть непустыми. Эти переменные читают поля #modal-fullName, #lp-input-fullName, #modal-phone, #lp-input-phone. Живая проверка 15.09.2026 (scripts/analytics-probe.js, запрос в CRM перехвачен в браузере) показала две разные картины.

Лендинги /lp/* (вариант lp4): поля получают id lp-input-* и modal-*, кнопка первого шага называется «Continue to move details», и триггер срабатывает при клике по ней, то есть до отправки заявки. В этот момент уходят конверсия Ads с label giGdCIj-2LEZEN3_0JAB, событие GA4 «GTM - Send Form», user-provided data и два веб-хука в таблицу. Считается каждый, кто ввёл имя и телефон и нажал «Continue», даже если заявку не отправил. При самой отправке на втором шаге не уходит ничего.

Основной сайт (главная, /contacts, страницы городов и услуг): у полей нет таких id, кнопка первого шага «Continue» есть, но условие по полям не выполняется. Здесь не срабатывают:
- конверсия Google Ads (label giGdCIj-2LEZEN3_0JAB);
- событие GA4 «GTM - Send Form»;
- Ads user-provided data;
- запись заявки в Google-таблицу (Apps Script).

Заявки при этом доходят: сайт отправляет их в CRM MoveBoard напрямую с сервера (api.goatmovers.org). Теряется только аналитика конверсий, и Google Ads оптимизируется вслепую.

Отдельно: событие «Click Button - REQUEST A QUOTE» ищет в тексте клика «REQUEST A QUOTE» заглавными, а в разметке кнопка называется «Request a Quote» (заглавные добавляет CSS). Проверить в режиме Preview, срабатывает ли; если нет, заменить условие на «contains Request a Quote».

## Вредит производительности
- Тег Custom HTML с кодом function getIP(){var a=new XMLHttpRequest;a.open("GET","https://api.ipify.org?format=json",!1) ... window.userIP=getIP(). Синхронный запрос, триггер Initialization: замораживает страницу до ответа чужого сервера на самом старте загрузки. Это же даёт провал «Uses deprecated APIs».
- Пять веб-хуков Google Apps Script (четыре тега Custom Image и один Custom HTML), все начинаются с https://script.google.com/macros/s/. Один из них (тег Custom Image с триггером DOM Ready) стреляет на каждой странице рекламного визита (в URL есть gclid, gbraid или wbraid).
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
- Тег Custom Image с триггером DOM Ready (три триггера: gclid, gbraid или wbraid в URL не равно undefined) пишет просмотры страниц рекламных визитов. Если журнал просмотров никто не смотрит, удалить вместе с триггерами. Если смотрят, оставить, но триггер один.
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
