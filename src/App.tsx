import React, { useState, useMemo, useEffect } from 'react';

// --- Types ---
interface Bonus {
  minAmount: number;
  description: string;
}

interface Campaign {
  id: string;
  title: string;
  author: string;
  genre: string;
  vibe: string;
  description: string;
  coverUrl: string;
  targetFunding: number;
  currentFunding: number;
  price: number;
  daysLeft: number;
  preordersCount: number;
  status: 'funding' | 'printing' | 'shipped';
  pages: number;
  coverType: 'soft' | 'hard';
  paperType: 'white' | 'cream';
  authorBio: string;
  samplePages: string[];
  bonuses: Bonus[];
  crossSells: string[]; // campaign IDs
  createdByUser?: boolean;
  trackingNumber?: string;
  deliveryCarrier?: string;
}

interface Preorder {
  id: string;
  campaignId: string;
  bookTitle: string;
  author: string;
  coverUrl: string;
  price: number;
  amountPaid: number;
  date: string;
  status: 'funding' | 'printing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  deliveryCarrier?: string;
  bonusClaimed?: string;
  receiptId: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'processed';
  taxStatus: 'self_employed' | 'ip';
  taxId: string;
  paymentDetails: string;
}

// --- Sample Page Contents for Reader ---
const SAMPLES = {
  echoes: [
    "Дождь над Балтийским побережьем никогда не начинался внезапно. Сначала небо над морем тяжелело, приобретая оттенок мокрого шифера, а чайки с тревожными криками тянулись к песчаным дюнам. Местные знали: это время тишины перед штормом.",
    "Эрик сидел на застекленной веранде своего дома, слушая, как первые тяжелые капли бьют по металлическому карнизу. В руках он держал чашку остывающего травяного чая. На дубовом столе перед ним лежала посылка — деревянный ящичек, обернутый в плотную мешковину.",
    "Посылку доставили утром. Без обратного адреса, без имени отправителя. Лишь размашистая надпись тушью на латыни: «Veritas vos liberabit» — «Истина сделает вас свободными». Эрик долго не решался перерезать просмоленную бечевку.",
    "Внутри коробки, утопая в сухой соломе, лежал старый кожаный блокнот. Его края обгорели, а страницы пожелтели от времени и влаги. Это был дневник его деда, пропавшего без вести в глухих лесах Карелии осенью сорок первого.",
    "Эрик открыл первую страницу. Чернила местами выцвели, но почерк оставался узнаваемым — твердым, с наклоном влево. «24 октября. Мы вышли к старой заброшенной шахте. Карты врут. Здесь есть то, о чем молчат все отчеты...»",
    "Шорох шагов снаружи заставил его вздрогнуть. Он поднял глаза от дневника и посмотрел через залитое дождем стекло веранды. В сумерках сада стоял человек в темном длинном плаще. Его лицо скрывал глубокий капюшон.",
    "Эрик быстро вышел в прихожую, накинул куртку и повернул ключ в замочной скважине. Ветер швырнул ему в лицо пригоршню холодных брызг. Сад был пуст. Лишь мокрые ветки яблонь качались под порывами ветра.",
    "На деревянной ступени крыльца лежал свежий лист клена. На нем черным маркером было выведено всего одно слово: «Не читай». Эрик поднял лист, чувствуя, как холод проникает под воротник. Игра началась.",
    "Он вернулся в дом, запер дверь на все задвижки и задернул плотные шторы. Дневник на столе казался теперь источником осязаемой угрозы. Но любопытство и жажда разгадать семейную тайну были сильнее страха.",
    "Эрик сел к столу, включил настольную лампу и перевернул следующую страницу дневника. «25 октября. Мы нашли первые образцы. Металл ведет себя странно в присутствии органики. Кажется, мы открыли нечто живое...»"
  ],
  midnight: [
    "Неоновый свет вывески «Кафе Океан» моргал с ленивой регулярностью неисправного кардиостимулятора, окрашивая мокрый асфальт в багровые тона. Было без пяти минут полночь. Время, когда приличные люди уже спят, а неприличные — начинают жить.",
    "Я сидел за угловым столиком у окна, медленно цедя дешевый бурбон. Напротив меня на кожаном диванчике лежала моя шляпа. В воздухе пахло табачным дымом, жареным луком и безысходностью портового города.",
    "Дверь скрипнула, и колокольчик над ней хрипло звякнул. В зал вошла женщина. На ней был плащ цвета грозового облака, мокрый от дождя, и темные очки, которые она не сняла даже в полумраке кафе. Она огляделась и сразу направилась к моему столику.",
    "«Вы Марк?» — спросила она. Голос у нее был низкий, с легкой хрипотцой. Я просто кивнул и указал ей на место напротив себя. Она села, стянула перчатки из тонкой кожи и положила на стол конверт.",
    "«Здесь половина суммы. Вторая половина — когда принесете мне оригинал соглашения. У вас три дня», — сказала она без лишних предисловий. Я придвинул конверт к себе, почувствовав его приятный вес. Там было не меньше пяти тысяч.",
    "«А если я откажусь?» — спросил я, глядя на ее отражение в темных очках. Она слегка наклонила голову: «Тогда вам придется сменить не только город, но и имя. И то не факт, что поможет. В этой папке то, за что люди готовы убивать».",
    "Я открыл конверт под столом. Внутри лежала фотография старинного особняка на холме и ключ с выгравированной цифрой «12». Никаких документов. «Где это?» — спросил я. «Вы знаете это место. Старый архив на окраине».",
    "Она поднялась, застегнула воротник плаща и вышла так же быстро, как и вошла. На моем столе остался лишь легкий аромат дорогих духов с нотами сандала и жасмина. Я допил бурбон, спрятал конверт во внутренний карман и поднялся.",
    "На улице дождь перешел в морось. Портовые краны вдали высились как скелеты доисторических чудовищ. Я поправил шляпу и пошел к своей старой «Волге», припаркованной под разбитым фонарем.",
    "Заводя мотор, я еще не знал, что эта женщина мертва уже трое суток, а ключ в моем кармане открывает дверь в склеп, где покоится тайна основания этого проклятого города."
  ],
  structure: [
    "Введение. Системные парадоксы внимания в цифровую эпоху. Человеческий мозг эволюционировал в условиях дефицита информации, из-за чего любой новый стимул воспринимается нами как потенциально критический для выживания.",
    "Сегодня мы сталкиваемся с обратной проблемой — информационным избытком, при котором дефицитным ресурсом становится само внимание. Системы доставки контента оптимизированы под удержание нашего фокуса с помощью быстрых дофаминовых петель.",
    "В результате современный субъект находится в состоянии перманентной когнитивной фрагментации. Способность к глубокому линейному чтению и длительной концентрации вытесняется мозаичным, клиповым восприятием реальности.",
    "Данное исследование ставит целью изучить механизмы деконструкции внимания и предложить методологию восстановления когнитивной автономии. Мы рассмотрим внимание не как пассивный ресурс, а как активную структуру мысли.",
    "Глава 1. Архитектура фильтрации. Первым барьером на пути хаоса данных является информационный гигиенический фильтр. Мы склонны доверять алгоритмам отбора информации, делегируя им функции суждения и оценки.",
    "Однако алгоритм преследует цель максимизации вовлечения, а не качества усвоения. Происходит подмена понятий: «важное» заменяется на «вирусное». Это ведет к формированию эхо-камер и когнитивных тупиков.",
    "Чтобы противостоять этому, субъект должен выстроить внутреннюю структуру мета-внимания — внимания, направленного на сам процесс фильтрации. Мы должны научиться спрашивать: «Почему я читаю это именно сейчас?»",
    "Практический аспект данной методологии заключается в создании искусственных зон информационной тишины. Эксперименты показывают, что даже 48 часов полной детоксикации восстанавливают синаптическую пластичность.",
    "В последующих главах мы детально опишем математическую модель распределения внимания и приведем когнитивные упражнения для тренировки глубокого фокуса, применимые в повседневной рабочей практике.",
    "В конечном счете, возвращение контроля над собственным вниманием — это не просто вопрос продуктивности. Это базовое условие сохранения субъектности и свободы воли в алгоритмизированном мире будущего."
  ],
  default: [
    "Глава первая. В мастерской снов Альфреда всегда пахло сушеной лавандой, бумажной пылью и немного озоном. Здесь, на третьем этаже старого дома с винтовой лестницей, создавались сны для всего квартала.",
    "Каждый сон начинался с чертежа. На плотных листах верже Альфред аккуратно выводил тушью очертания будущих грез: кружевные облака, замки из теплого тумана, шелестящие аллеи и голоса из далекого детства.",
    "Сны бывали простыми — например, сон о теплом дожде для уставшего садовника, или сложными, многослойными — вроде сна-приключения с поиском сокровищ для десятилетнего мечтателя.",
    "Сегодня Альфред работал над особым заказом. Старый часовщик попросил сон, в котором он снова мог бы поговорить со своей женой, ушедшей много лет назад. Это была тончайшая работа, требовавшая абсолютной точности деталей.",
    "«Главное — не перепутать тональность воспоминаний», — бормотал Альфред, настраивая стеклянную колбу с золотистым туманом ностальгии. Один лишний грамм — и сон превратится в тяжелую, удушающую тоску.",
    "Он аккуратно перелил каплю эссенции смеха в общий котел. Смесь тихо зашипела и окрасилась в нежный янтарный цвет. На кончике пера возник образ: весеннее утро, запах свежеиспеченного хлеба и тихий смех на залитой солнцем кухне.",
    "Вдруг в дверь мастерской громко постучали. От неожиданности Альфред пролил каплю синего тумана грусти на чертеж. Бумага мгновенно впитала влагу, и контур нарисованного дома подернулся дымкой.",
    "На пороге стоял почтальон в форменной фуражке. «Вам срочное письмо из Центрального Департамента Сновидений, господин Альфред! Лично в руки». Письмо было запечатано тяжелым сургучом с оттиском песочных часов.",
    "Альфред расписался в журнале доставки и вскрыл конверт. Текст письма был кратким и тревожным: «В связи с введением Единого Цифрового Наркоза все частные мастерские снов объявляются вне закона. Вам предписано сдать оборудование до пятницы».",
    "Мир Альфреда пошатнулся. Сдать реторты, колбы, рецепты? Лишить людей настоящих, живых снов, заменив их стандартизированным пластиковым контентом? Он посмотрел на янтарный сон часовщика. «Нет, — тихо сказал он. — Мы еще поборемся»."
  ]
};

// --- Initial Preset Campaigns ---
const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Тихое Эхо',
    author: 'Мария Громова',
    genre: 'Детективный роман / Драма',
    vibe: 'Меланхолия',
    description: 'Атмосферный детектив о тайнах заброшенного прибалтийского городка. Старый обгоревший блокнот деда, пропавшего полвека назад, запускает цепь загадочных событий. Линейный сюжет переплетается с семейными драмами и холодными морскими пейзажами. Качественная проза для тех, кто любит неспешные расследования и психологическую глубину.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADyFfYRqd0geczzJge1asDN-_sx6L293vXtV17NyYQVcN8RPOZ4PfLIMslNRrBaF5YcMUA3gtdfqCUBacxQFvfPd62JubYpj1G3JqTVlEGEOXU0Uq4sHbP_YgifoYjz8INUhzKDbdlblDUvkswXMS-3vW9E7JS86XIEV8KfGuAYpethJy3SWjIF3yNLaMvpRsSGFLzzKFgyxPMg9h6gKuOOwmggppid9ectiWGNZS0yQMokqEDy3YsT_tK6iSl2nHIS9dpoXEgoWY',
    targetFunding: 120000,
    currentFunding: 110400, // 92%
    price: 1200,
    daysLeft: 4,
    preordersCount: 92,
    status: 'funding',
    pages: 320,
    coverType: 'hard',
    paperType: 'cream',
    authorBio: 'Мария Громова — писательница, лауреат литературных премий за малую прозу. Родилась в Риге, долгое время изучала архивы прибалтийских маяков, что вдохновило ее на создание дебютного романа.',
    samplePages: SAMPLES.echoes,
    bonuses: [
      { minAmount: 1200, description: '1 экз. книги «Тихое Эхо» с доставкой + цифровой доступ.' },
      { minAmount: 2000, description: '1 экз. книги с личной благодарностью автора на форзаце и цифровым автографом в макете.' },
      { minAmount: 5000, description: 'Подарочный комплект: книга в тканевом слипкейсе, набор открыток с видами Балтики и имя спонсора в разделе благодарностей книги.' }
    ],
    crossSells: ['2', '3']
  },
  {
    id: '2',
    title: 'Полночь в Саду',
    author: 'Алексей Рейн',
    genre: 'Нуар-детектив',
    vibe: 'Нуар',
    description: 'Портовый город, непрекращающийся дождь, неоновые блики на мокром асфальте и циничный детектив с тяжелым прошлым. Когда на пороге его офиса появляется женщина в плаще цвета грозового облака, он соглашается на простое дело. Но уже к утру оказывается, что заказчица мертва, а в его кармане лежит ключ к древнему заговору.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKyDf-_EDmiERUy5b1QHS6Y_E_JepxhHo5giA6oRn5yqj3NFB9fOYfV2jDuF-Oqf3qKhABlu1EccSZQcrFLA_piqHOYUXxI0fy2nDgpfE3zuhwl5M9F8eNn97D1U7J6BEtx7bAlantqXm9nBJuS2lhmNNLPMwrqEKkyMCPl4bxF-tpHwAbEMU2xa7iycc_szFY3o4Vuu640Yc_Mj3C7iUpf2algECp9TVfiHgvGJrcE8qGfNEzLbvOGlKRcahe9akQWW0Ph1YykIE',
    targetFunding: 180000,
    currentFunding: 153000, // 85%
    price: 1450,
    daysLeft: 12,
    preordersCount: 105,
    status: 'funding',
    pages: 280,
    coverType: 'hard',
    paperType: 'white',
    authorBio: 'Алексей Рейн — сценарист и переводчик классических американских детективов. В своем творчестве возрождает традиции классического нуара, сочетая их с колоритным языком.',
    samplePages: SAMPLES.midnight,
    bonuses: [
      { minAmount: 1450, description: '1 экз. книги «Полночь в Саду» с доставкой.' },
      { minAmount: 2200, description: 'Печатное издание с фирменной закладкой-ножом и благодарственным письмом.' },
      { minAmount: 4000, description: 'Эксклюзив: книга в кожаном переплете с тиснением серебром + имя в списке меценатов.' }
    ],
    crossSells: ['1', '3']
  },
  {
    id: '3',
    title: 'Структура Мысли',
    author: 'Елена Берг',
    genre: 'Философия / Когнитивные науки',
    vibe: 'Интеллект',
    description: 'Интеллектуальное эссе о парадоксах внимания в цифровую эпоху. Как защитить свой разум от фрагментации контентом? Автор предлагает строгую когнитивную модель фильтрации информационного шума и восстановления субъектности, подкрепленную новейшими нейробиологическими исследованиями.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8g3c9r6TGtiHHSAGJrIwPVCXy9xqSLdlRGcZzfySq0GnOQluIUvfd_qz0gWiZH6zV-5Rq_3mVJG58j8b3AVCf6EYJFuPMShXgrlGQTX8Tvtx5VMmBY0Mo1fslD1fJy3GWu8g6AX0MeEbV7OWGnWG84SPWNCmL4ijq4PQZkTIZmlCcMC5tC23RKSCOa8FQBzn6YKOK6YKTfY3pYLB0zvnJNzQ2W9XPU0NC9_h570CnxCxc48ivj-V1-cVFcdihDp7HPRCHJpNiYNk',
    targetFunding: 100000,
    currentFunding: 98000, // 98%
    price: 990,
    daysLeft: 2,
    preordersCount: 99,
    status: 'funding',
    pages: 200,
    coverType: 'soft',
    paperType: 'white',
    authorBio: 'Елена Берг — кандидат когнитивных наук, лектор, исследователь медиа-технологий. Автор статей об искусственном интеллекте и влиянии сетей на эволюцию человеческого мозга.',
    samplePages: SAMPLES.structure,
    bonuses: [
      { minAmount: 990, description: '1 экз. книги «Структура Мысли» с доставкой.' },
      { minAmount: 1800, description: 'Книга + доступ к онлайн-воркшопу Елены Берг по цифровой гигиене.' },
      { minAmount: 3000, description: 'Коллекционный комплект: книга, рабочая тетрадь ментальных практик и благодарность в книге.' }
    ],
    crossSells: ['1', '2']
  },
  {
    id: '4',
    title: 'Архитектура Сна',
    author: 'Д. Меньшиков',
    genre: 'Уютное Фэнтези',
    vibe: 'Уют',
    description: 'Невероятно теплая сказочная повесть об Альфреде — мастере снов, который собирает грезы из лавандового тумана и детских улыбок. Когда суровый закон запрещает ручные сны в пользу цифрового наркоза, Альфред вступает в тихую борьбу за право дарить людям волшебство.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ35-Eu11sNUeEaPdNHq8lGam2UvBRbXRKxkiEGofbkP4p7yEFw0mBHr6AiXWHAZo7jKSbZ3zZCTh7kK5RehxgBKRpe23DM-ZBzyAl6y2aUV93-4AtjWLw7ZDhENZB1gZuCo1KGTYd4zDRdJChoryz6p9WX9_DGV7L7rFmcqFFUhWKcSUqK6RgkmJXOxkKCzSJuxBvz60NOVtggZuP_8k7vhw8Cm2VP7FPMEBcPd4BTqp_GoSKXYviWP9bdi-mJYykCKM-W5Mc7uA',
    targetFunding: 90000,
    currentFunding: 92000, // 102% - Successful/Printed
    price: 850,
    daysLeft: 0,
    preordersCount: 108,
    status: 'shipped',
    pages: 180,
    coverType: 'soft',
    paperType: 'cream',
    authorBio: 'Дмитрий Меньшиков — детский писатель, иллюстратор. Увлекается пчеловодством и коллекционированием старинных часов, что отражается на уютной атмосфере его произведений.',
    samplePages: SAMPLES.default,
    bonuses: [
      { minAmount: 850, description: '1 экз. книги с доставкой.' }
    ],
    crossSells: ['1', '2']
  },
  {
    id: '5',
    title: 'Глина и Свет',
    author: 'О. Коваль',
    genre: 'Стихи / Эссе',
    vibe: 'Уют',
    description: 'Лирический сборник стихотворений и короткой прозы об осязаемой красоте быта. О глиняной посуде, о старых деревянных половицах, о лучах солнца в пыльной комнате. Книга оформлена с особым вниманием к деталям — тиснение на переплете и плотная фактурная бумага.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhevZ3BomrFosq2T_m2wRUl-AudShIXV3geJOWKvBmYPqio1aVe9mo4JmuJ2lbMB5ER8ogYzlSJW82z8q--5rz2LOn_W5u1pvDDnL0la54uZWep4Z8TktYDi_Gzq5M8CTL9muZqJyyzR1UwtjBWxg2_vlbNf4MRDEzTW4_KVRzLdVLDnjEyY6x0smzRUgtRDeruACy9WP2M9Kq0m1xHcdYdKMcS52t4KdB4h6MkF2Kytxq-3AuY0yrCCgK_cIvdhSD9cCjeSjRc8Y',
    targetFunding: 110000,
    currentFunding: 112000,
    price: 1100,
    daysLeft: 0,
    preordersCount: 102,
    status: 'printing',
    pages: 160,
    coverType: 'hard',
    paperType: 'cream',
    authorBio: 'Ольга Коваль — поэтесса, керамист. Живет и работает в деревне, где лепит посуду из глины и пишет тексты на механической пишущей машинке.',
    samplePages: SAMPLES.default,
    bonuses: [{ minAmount: 1100, description: '1 экз. книги с доставкой.' }],
    crossSells: ['4', '1']
  }
];

// --- Initial Pre-orders for Demo ---
const INITIAL_PREORDERS: Preorder[] = [
  {
    id: 'pre-101',
    campaignId: '4',
    bookTitle: 'Архитектура Сна',
    author: 'Д. Меньшиков',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ35-Eu11sNUeEaPdNHq8lGam2UvBRbXRKxkiEGofbkP4p7yEFw0mBHr6AiXWHAZo7jKSbZ3zZCTh7kK5RehxgBKRpe23DM-ZBzyAl6y2aUV93-4AtjWLw7ZDhENZB1gZuCo1KGTYd4zDRdJChoryz6p9WX9_DGV7L7rFmcqFFUhWKcSUqK6RgkmJXOxkKCzSJuxBvz60NOVtggZuP_8k7vhw8Cm2VP7FPMEBcPd4BTqp_GoSKXYviWP9bdi-mJYykCKM-W5Mc7uA',
    price: 850,
    amountPaid: 850,
    date: '12.05.2026',
    status: 'shipped',
    trackingNumber: 'RU789234812CN',
    deliveryCarrier: 'СДЭК',
    receiptId: 'REC-2026-9812'
  }
];

export default function App() {
  // --- Navigation & Role Routing States ---
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'buyer' | 'author'>('buyer');
  const [isDevOpen, setIsDevOpen] = useState<boolean>(false);

  const handlePromoNav = (anchorId: string) => {
    if (currentPage !== 'home' || selectedCampaignId !== null) {
      setCurrentPage('home');
      setSelectedCampaignId(null);
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // --- Data States ---
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [preorders, setPreorders] = useState<Preorder[]>(INITIAL_PREORDERS);
  const [walletBalance, setWalletBalance] = useState<number>(42500);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    {
      id: 'w-1',
      amount: 15000,
      date: '10.05.2026',
      status: 'processed',
      taxStatus: 'self_employed',
      taxId: '772498120421',
      paymentDetails: 'СБП +7 (903) 123-45-67'
    }
  ]);

  // --- UI Filter States ---
  const [selectedVibe, setSelectedVibe] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // --- Modals State ---
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [readerCampaign, setReaderCampaign] = useState<Campaign | null>(null);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutCampaign, setCheckoutCampaign] = useState<Campaign | null>(null);
  const [checkoutTier, setCheckoutTier] = useState<{ minAmount: number; description: string } | null>(null);
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);

  // --- Smooth scroll helper ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedCampaignId]);

  // --- Navigation Router ---
  const navigateTo = (page: string, campaignId: string | null = null) => {
    setCurrentPage(page);
    setSelectedCampaignId(campaignId);
  };

  const selectedCampaign = useMemo(() => {
    return campaigns.find(c => c.id === selectedCampaignId) || null;
  }, [campaigns, selectedCampaignId]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchVibe = selectedVibe === 'Все' || c.vibe === selectedVibe;
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchVibe && matchSearch;
    });
  }, [campaigns, selectedVibe, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-on-surface paper-texture selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col font-sans">
      
      {/* --- Header / TopAppBar --- */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-outline-variant transition-all duration-200">
        <div className="flex justify-between items-center w-full px-5 md:px-8 max-w-[1280px] mx-auto h-20">
          <div className="flex items-center gap-8">
            <button onClick={() => navigateTo('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Издательство СТАРТ" className="h-11 w-auto object-contain" />
              <span className="group/nav-tooltip relative bg-primary/5 border border-primary/10 text-primary font-mono text-[8px] sm:text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase ml-1 cursor-help">
                Автоматическая печать
                <span className="absolute left-1/2 -translate-x-1/2 top-6 hidden group-hover/nav-tooltip:block bg-slate-900 text-white text-[10px] rounded p-2 w-48 shadow-lg z-20 font-sans leading-normal normal-case font-medium">
                  🖨️ Print-on-Demand: книга отправляется в печать автоматически при 100% сборов.
                </span>
              </span>
            </button>
            
            <div className="hidden md:flex items-center gap-8 font-sans text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              <button 
                onClick={() => handlePromoNav('catalog')} 
                className="hover:text-primary transition-colors py-1 cursor-pointer"
              >
                Кампании
              </button>
              <button 
                onClick={() => handlePromoNav('how-it-works')} 
                className="hover:text-primary transition-colors py-1 cursor-pointer"
              >
                Как это работает
              </button>
              <button 
                onClick={() => handlePromoNav('calculator')} 
                className="hover:text-primary transition-colors py-1 cursor-pointer"
              >
                Авторам
              </button>
              <button 
                onClick={() => handlePromoNav('about-us')} 
                className="hover:text-primary transition-colors py-1 cursor-pointer"
              >
                О нас
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setUserRole('author');
                navigateTo('author-dashboard');
              }}
              className="hidden sm:block bg-primary text-on-primary hover:opacity-90 px-6 py-2.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider scale-98 transition-all cursor-pointer"
            >
              Запустить
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Contents Router --- */}
      <main className="flex-1">
        {currentPage === 'home' && !selectedCampaignId && (
          <HomeView 
            campaigns={filteredCampaigns}
            allCampaigns={campaigns}
            selectedVibe={selectedVibe}
            setSelectedVibe={setSelectedVibe}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectCampaign={(id) => navigateTo('campaign', id)}
            onLaunchCampaign={() => {
              setUserRole('author');
              navigateTo('author-dashboard');
            }}
          />
        )}

        {currentPage === 'campaign' && selectedCampaign && (
          <CampaignDetailView 
            campaign={selectedCampaign}
            allCampaigns={campaigns}
            onBack={() => navigateTo('home')}
            onSelectCampaign={(id) => navigateTo('campaign', id)}
            onReadFirstPages={(camp) => {
              setReaderCampaign(camp);
              setIsReaderOpen(true);
            }}
            onTriggerPreorder={(camp, tier) => {
              setCheckoutCampaign(camp);
              setCheckoutTier(tier);
              setIsCheckoutOpen(true);
            }}
          />
        )}

        {currentPage === 'author-dashboard' && (
          <AuthorDashboardView 
            campaigns={campaigns}
            walletBalance={walletBalance}
            withdrawals={withdrawals}
            onSelectCampaign={(id) => navigateTo('campaign', id)}
            onOpenWithdrawal={() => setIsWithdrawOpen(true)}
            onCreateCampaign={(newCamp) => {
              setCampaigns(prev => [newCamp, ...prev]);
              navigateTo('campaign', newCamp.id);
            }}
          />
        )}

        {currentPage === 'buyer-dashboard' && (
          <BuyerDashboardView 
            preorders={preorders}
            campaigns={campaigns}
            onSelectCampaign={(id) => navigateTo('campaign', id)}
          />
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="bg-primary text-surface py-16 border-t border-outline">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-8 max-w-[1280px] mx-auto">
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-sm inline-block border border-outline-variant/30">
              <img src="/logo.png" alt="Издательство СТАРТ" className="h-10 w-auto object-contain" />
            </div>
            <p className="font-sans text-[14px] text-slate-400 leading-relaxed">
              Собери цель — книга автоматически уходит в печать и к читателям. Без риска, без стартовых вложений автора.
            </p>
            <div className="flex gap-4 text-xs font-semibold text-slate-300">
              <a href="#" className="hover:underline">ВКонтакте</a>
              <a href="#" className="hover:underline">Telegram</a>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Кампании</h4>
            <ul className="space-y-2 text-[14px] text-slate-300">
              <li><button onClick={() => { setSelectedVibe('Все'); navigateTo('home'); }} className="hover:text-white transition-colors text-left">Все сборы</button></li>
              <li><button onClick={() => { setSelectedVibe('Нуар'); navigateTo('home'); }} className="hover:text-white transition-colors text-left">Нуар проза</button></li>
              <li><button onClick={() => { setSelectedVibe('Интеллект'); navigateTo('home'); }} className="hover:text-white transition-colors text-left">Интеллектуальная проза</button></li>
              <li><button onClick={() => { setSelectedVibe('Уют'); navigateTo('home'); }} className="hover:text-white transition-colors text-left">Уютные книги</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Авторам</h4>
            <ul className="space-y-2 text-[14px] text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Как работает POD 2.0</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Калькулятор печати</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Требования к PDF-файлам</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Лицензионный договор</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Поддержка</h4>
            <ul className="space-y-3 text-[14px] text-slate-300">
              <li className="text-slate-400">support@bookstart.ru</li>
              <li className="text-slate-400">Москва, Волоколамское шоссе, д. 2, стр. 1</li>
              <li>
                <div className="border-b border-slate-700 py-1.5 flex justify-between items-center mt-2">
                  <input type="email" placeholder="EMAIL АВТОРА" className="bg-transparent text-white border-none outline-none text-xs placeholder:text-slate-600 focus:ring-0 p-0 w-full" />
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-white">arrow_forward</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <span>© 2026 BookStart. Автоматическое издательство Print-on-Demand. Все права защищены.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Условия обслуживания</a>
            <a href="#" className="hover:underline">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>

      {/* --- 1. Reader Modal --- */}
      {isReaderOpen && readerCampaign && (
        <ReaderModal 
          campaign={readerCampaign} 
          onClose={() => {
            setIsReaderOpen(false);
            setReaderCampaign(null);
          }} 
        />
      )}

      {/* --- 2. Checkout Modal --- */}
      {isCheckoutOpen && checkoutCampaign && checkoutTier && (
        <CheckoutModal 
          campaign={checkoutCampaign}
          tier={checkoutTier}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutCampaign(null);
            setCheckoutTier(null);
          }}
          onSuccess={(paidAmount, bonusName) => {
            // Update campaign funding in global state
            setCampaigns(prev => prev.map(c => {
              if (c.id === checkoutCampaign.id) {
                const updatedFunding = c.currentFunding + paidAmount;
                const isGoalMet = updatedFunding >= c.targetFunding;
                let newStatus = c.status;
                if (isGoalMet && c.status === 'funding') {
                  newStatus = 'printing'; // automatic print trigger!
                }
                return {
                  ...c,
                  currentFunding: updatedFunding,
                  preordersCount: c.preordersCount + 1,
                  status: newStatus
                };
              }
              return c;
            }));

            // Add to User's Pre-orders
            const newPreorder: Preorder = {
              id: 'pre-' + Math.floor(Math.random() * 900000 + 100000),
              campaignId: checkoutCampaign.id,
              bookTitle: checkoutCampaign.title,
              author: checkoutCampaign.author,
              coverUrl: checkoutCampaign.coverUrl,
              price: checkoutCampaign.price,
              amountPaid: paidAmount,
              date: new Date().toLocaleDateString('ru-RU'),
              status: checkoutCampaign.currentFunding + paidAmount >= checkoutCampaign.targetFunding ? 'printing' : 'funding',
              bonusClaimed: bonusName,
              receiptId: 'REC-2026-' + Math.floor(Math.random() * 9000 + 1000)
            };
            setPreorders(prev => [newPreorder, ...prev]);

            setIsCheckoutOpen(false);
            setCheckoutCampaign(null);
            setCheckoutTier(null);
            navigateTo('buyer-dashboard');
          }}
        />
      )}

      {/* --- 3. Withdrawal Modal --- */}
      {isWithdrawOpen && (
        <WithdrawalModal 
          balance={walletBalance}
          onClose={() => setIsWithdrawOpen(false)}
          onSubmit={(amount, reqDetails) => {
            setWalletBalance(prev => prev - amount);
            setWithdrawals(prev => [
              {
                id: 'w-' + Math.floor(Math.random() * 900 + 100),
                amount,
                date: new Date().toLocaleDateString('ru-RU'),
                status: 'pending',
                taxStatus: reqDetails.taxStatus,
                taxId: reqDetails.taxId,
                paymentDetails: reqDetails.paymentDetails
              },
              ...prev
            ]);
            setIsWithdrawOpen(false);
          }}
        />
      )}

      {/* Floating Dev Panel for Demo Presentations */}
      <div className="fixed bottom-6 left-6 z-50 font-sans">
        {!isDevOpen ? (
          <button 
            onClick={() => setIsDevOpen(true)}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-full book-shadow text-xs font-bold uppercase tracking-wider scale-98 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">build</span>
            Демо-панель
          </button>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-md book-shadow max-w-xs space-y-3.5 relative text-left">
            <button 
              onClick={() => setIsDevOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-primary material-symbols-outlined text-sm cursor-pointer"
            >
              close
            </button>
            <div className="border-b border-outline-variant pb-2 pr-6">
              <h5 className="font-sans text-xs font-bold text-primary uppercase">Панель тестирования</h5>
              <p className="font-sans text-[10px] text-slate-500 mt-0.5 leading-snug">Внутренние экраны приложения для заказчика.</p>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Выбрать роль:</label>
                <select 
                  value={userRole} 
                  onChange={(e) => {
                    const val = e.target.value as 'buyer' | 'author';
                    setUserRole(val);
                    navigateTo(val === 'author' ? 'author-dashboard' : 'buyer-dashboard');
                  }}
                  className="w-full bg-surface-container border border-outline-variant rounded p-1.5 font-sans text-xs font-semibold text-primary outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="buyer">Читатель / Покупатель</option>
                  <option value="author">Автор / Издатель</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button 
                  onClick={() => { setUserRole('buyer'); navigateTo('buyer-dashboard'); }}
                  className={`py-1.5 rounded text-[10px] font-bold text-center border font-sans uppercase cursor-pointer ${currentPage === 'buyer-dashboard' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface-container-low text-slate-600'}`}
                >
                  ЛК Покупателя
                </button>
                <button 
                  onClick={() => { setUserRole('author'); navigateTo('author-dashboard'); }}
                  className={`py-1.5 rounded text-[10px] font-bold text-center border font-sans uppercase cursor-pointer ${currentPage === 'author-dashboard' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface-container-low text-slate-600'}`}
                >
                  ЛК Издателя
                </button>
              </div>
              
              {currentPage !== 'home' && (
                <button 
                  onClick={() => navigateTo('home')}
                  className="w-full bg-surface-container-high hover:bg-surface-container-highest py-1.5 rounded text-[10px] font-bold text-center border border-outline-variant text-slate-700 font-sans uppercase cursor-pointer"
                >
                  Вернуться на Главную
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// ==========================================
// --- VIEW 1: HOME PAGE ---
// ==========================================
interface HomeViewProps {
  campaigns: Campaign[];
  allCampaigns: Campaign[];
  selectedVibe: string;
  setSelectedVibe: (vibe: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCampaign: (id: string) => void;
  onLaunchCampaign: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  campaigns,
  allCampaigns,
  selectedVibe,
  setSelectedVibe,
  searchQuery,
  setSearchQuery,
  onSelectCampaign,
  onLaunchCampaign
}) => {
  const vibes = ['Все', 'Меланхолия', 'Интеллект', 'Уют', 'Высокие ставки', 'Нуар'];

  const [sortBy, setSortBy] = useState<'default' | 'proximity' | 'popularity' | 'daysLeft'>('default');

  const getVibeCount = (vibe: string) => {
    if (vibe === 'Все') {
      return allCampaigns.filter(c => c.status === 'funding').length;
    }
    return allCampaigns.filter(c => c.status === 'funding' && c.vibe === vibe).length;
  };

  // Cost estimation state inside calculator
  const [calcPages, setCalcPages] = useState<number>(220);
  const [calcCoverType, setCalcCoverType] = useState<'soft' | 'hard'>('soft');
  const [calcPaperType, setCalcPaperType] = useState<'white' | 'cream'>('cream');
  const [calcVolume, setCalcVolume] = useState<number>(100);

  // Live print calculation formulas
  const printingCalculations = useMemo(() => {
    const baseCoverPrice = calcCoverType === 'hard' ? 250 : 100;
    const pageCost = calcPaperType === 'cream' ? 1.5 : 1.0;
    const unitProductionCost = baseCoverPrice + (calcPages * pageCost);
    
    // Scale discount by print size volume
    let scaleFactor = 1.0;
    if (calcVolume >= 300 && calcVolume < 500) scaleFactor = 0.85;
    else if (calcVolume >= 500) scaleFactor = 0.75;
    
    const unitDiscountedCost = Math.ceil(unitProductionCost * scaleFactor);
    const totalPrintPrice = unitDiscountedCost * calcVolume;
    
    // Platform takes 15% commission, so required campaign goal is PrintPrice / 0.85
    const targetGoal = Math.ceil(totalPrintPrice / 0.85);
    
    // Break-even cost per buyer pre-order: goal / volume
    const minViablePrice = Math.ceil(targetGoal / calcVolume);
    const recommendedPrice = Math.ceil(minViablePrice * 1.35); // 35% author royalty margin

    return {
      unitDiscountedCost,
      totalPrintPrice,
      targetGoal,
      minViablePrice,
      recommendedPrice
    };
  }, [calcPages, calcCoverType, calcPaperType, calcVolume]);

  const ongoingCampaigns = useMemo(() => {
    return campaigns.filter(c => c.status === 'funding');
  }, [campaigns]);

  const sortedCampaigns = useMemo(() => {
    const list = [...ongoingCampaigns];
    if (sortBy === 'proximity') {
      list.sort((a, b) => {
        const pctA = a.currentFunding / a.targetFunding;
        const pctB = b.currentFunding / b.targetFunding;
        return pctB - pctA;
      });
    } else if (sortBy === 'popularity') {
      list.sort((a, b) => b.preordersCount - a.preordersCount);
    } else if (sortBy === 'daysLeft') {
      list.sort((a, b) => a.daysLeft - b.daysLeft);
    }
    return list;
  }, [ongoingCampaigns, sortBy]);

  const printedCampaigns = useMemo(() => {
    return allCampaigns.filter(c => c.status === 'printing' || c.status === 'shipped');
  }, [allCampaigns]);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-8 overflow-hidden px-5 md:px-8 max-w-[1280px] mx-auto gap-8 grid grid-cols-1 md:grid-cols-12 mb-16">
        <div className="md:col-span-6 flex flex-col justify-center z-10">
          <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-widest mb-4 block">Платформа предзаказов для независимых авторов</span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-6 leading-[1.2] tracking-tight">
            Для авторов: собери на тираж. <br />
            <span className="text-secondary font-serif">Для читателей: поддержи книгу, которой ещё нет.</span>
          </h1>
          <p className="font-sans text-base md:text-[17px] text-on-surface-variant mb-8 leading-relaxed max-w-[500px]">
            Загрузите готовый PDF. Запустите предпродажи за 5 минут. Как только сумма сборов будет достигнута, мы автоматически напечатаем и доставим книги покупателям. Без финансовых рисков.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onLaunchCampaign}
              className="bg-primary text-on-primary hover:opacity-90 px-8 py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all scale-98 active:scale-95 flex items-center gap-2 group cursor-pointer"
            >
              Запустить кампанию
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <a 
              href="#catalog"
              className="border border-outline hover:bg-surface-container-low px-8 py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer text-primary"
            >
              Найти книгу
            </a>
          </div>
          
          <div className="mt-12 flex gap-12 border-t border-outline-variant pt-8">
            <div>
              <div className="font-serif text-3xl font-bold text-primary">0 ₽</div>
              <div className="font-sans text-xs text-secondary mt-1 font-medium">Стартовых вложений автора</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-primary">15%</div>
              <div className="font-sans text-xs text-secondary mt-1 font-medium font-sans">Комиссия (включая доставку)</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-primary">Автоматически</div>
              <div className="font-sans text-xs text-secondary mt-1 font-medium font-sans">Триггер Печать &rarr; СДЭК</div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-6 relative h-[380px] md:h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 bg-surface-container-highest rounded-lg transform translate-x-4 translate-y-4 -z-10 opacity-60"></div>
          <div className="w-full h-full border border-outline-variant bg-[#F0F0EB] p-8 flex items-center justify-center relative rounded">
            <img 
              alt="Book mockup" 
              className="max-h-[85%] object-contain book-shadow rotate-[-2deg] hover:rotate-0 transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADyFfYRqd0geczzJge1asDN-_sx6L293vXtV17NyYQVcN8RPOZ4PfLIMslNRrBaF5YcMUA3gtdfqCUBacxQFvfPd62JubYpj1G3JqTVlEGEOXU0Uq4sHbP_YgifoYjz8INUhzKDbdlblDUvkswXMS-3vW9E7JS86XIEV8KfGuAYpethJy3SWjIF3yNLaMvpRsSGFLzzKFgyxPMg9h6gKuOOwmggppid9ectiWGNZS0yQMokqEDy3YsT_tK6iSl2nHIS9dpoXEgoWY" 
            />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-outline-variant p-3.5 rounded shadow-sm text-left max-w-xs flex gap-3.5 items-center">
              <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-2 rounded-full">local_shipping</span>
              <div>
                <h5 className="font-sans text-xs font-bold text-primary">Автоматизация POD 2.0</h5>
                <p className="font-sans text-[11px] text-slate-500 leading-snug mt-0.5">Книги отправляются в печать и СДЭК в течение 24 часов после успеха сбора.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-5 md:px-8 py-20 bg-surface-container border-y border-outline-variant scroll-mt-24 mb-16" id="how-it-works">
        <div className="max-w-[1280px] mx-auto text-center">
          <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-widest block mb-3">Простой и безопасный процесс</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mb-12">Как работает BookStart</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-sm shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-serif text-3xl font-bold text-secondary mb-4 block font-mono">01</span>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">Создание кампании</h3>
                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                  Автор рассчитывает тираж в калькуляторе и загружает PDF-макет книги. Мы проверяем файл на соответствие техническим стандартам печати (препресс).
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-sm shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-serif text-3xl font-bold text-secondary mb-4 block font-mono">02</span>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">Предзаказ читателями</h3>
                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                  Мы открываем страницу сбора. Читатели выбирают интересные уровни поддержки (книга, автограф, мерч) и оплачивают предзаказ на сайте.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-sm shadow-sm border-amber-500/30 bg-amber-50/20 flex flex-col justify-between h-full relative">
              <span className="absolute top-3 right-3 bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-sm font-sans text-[9px] font-bold uppercase tracking-wider">Гарантия</span>
              <div>
                <span className="font-serif text-3xl font-bold text-amber-600 mb-4 block font-mono">03</span>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">Безопасная сделка</h3>
                <p className="font-sans text-xs text-slate-700 leading-relaxed font-medium">
                  Все средства хранятся на защищенном эскроу-счете. <strong>Если цель сбора не будет достигнута к концу срока, все деньги автоматически вернутся читателям в полном объеме.</strong>
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-sm shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="font-serif text-3xl font-bold text-secondary mb-4 block font-mono">04</span>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">Печать и доставка</h3>
                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                  При достижении 100% сборов заказ моментально улетает в автоматическую печать по технологии Print-on-Demand и рассылается покупателям через СДЭК/Boxberry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Vibe Filters */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto mb-8 border-b border-outline-variant pb-4" id="catalog">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex gap-2 items-center overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0">
            <span className="font-sans text-[11px] font-bold text-secondary uppercase mr-2 shrink-0">Атмосфера:</span>
            {vibes.map(v => {
              const count = getVibeCount(v);
              return (
                <button
                  key={v}
                  onClick={() => setSelectedVibe(v)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${selectedVibe === v ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-slate-600'}`}
                >
                  <span>{v}</span>
                  <span className={`text-[10px] rounded-full px-1.5 font-bold ${selectedVibe === v ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            {/* Sort Select */}
            <div className="relative w-full sm:w-auto shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-surface-container-lowest border border-outline-variant focus:border-primary px-3.5 py-2 rounded font-sans text-xs outline-none cursor-pointer text-slate-700 font-semibold"
              >
                <option value="default">Сортировка: По умолчанию</option>
                <option value="proximity">По близости к цели (%)</option>
                <option value="popularity">По популярности (кол-во предзаказов)</option>
                <option value="daysLeft">По дате окончания (осталось дней)</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-sm">search</span>
              </span>
              <input
                type="text"
                placeholder="Поиск по названию или автору..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary pl-9 pr-4 py-2 rounded font-sans text-xs outline-none text-slate-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Campaign Grid */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-serif text-3xl text-primary font-bold">Активные сборы</h2>
            <p className="font-sans text-xs text-slate-500 mt-1">Оформите предзаказ, чтобы помочь книгам увидеть свет.</p>
          </div>
        </div>

        {sortedCampaigns.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-outline-variant bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-slate-300 text-5xl mb-3">book</span>
            <p className="font-sans text-sm text-slate-500">Книги по выбранным критериям не найдены.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCampaigns.map(camp => {
              const percent = Math.min(Math.round((camp.currentFunding / camp.targetFunding) * 100), 100);
              return (
                <div 
                  key={camp.id}
                  onClick={() => onSelectCampaign(camp.id)}
                  className="group bg-surface-container-lowest border border-outline-variant p-4 rounded-sm hover:border-primary hover:book-shadow-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Book Cover Container */}
                    <div className="relative aspect-[4/5] bg-surface-container-low border border-outline-variant/30 flex items-center justify-center p-8 overflow-hidden mb-5">
                      <img 
                        src={camp.coverUrl} 
                        alt={camp.title} 
                        className="h-full object-contain book-shadow group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-sm font-sans text-[10px] uppercase font-bold tracking-wider">
                        {camp.vibe}
                      </span>
                      {percent >= 90 && (
                        <div className="group/hot relative absolute top-3 right-3 z-10 cursor-help">
                          <span className="bg-error text-on-error px-2 py-0.5 rounded-sm font-sans text-[10px] uppercase font-bold tracking-wider animate-pulse flex items-center gap-0.5 shadow-sm">
                            🔥 Горячо
                          </span>
                          <span className="absolute right-0 top-6 hidden group-hover/hot:block bg-slate-900 text-white text-[10px] rounded p-2.5 w-44 shadow-lg z-20 font-sans leading-normal normal-case font-medium text-center">
                            Высокая скорость сборов! Кампания собрала уже более 90% средств.
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-primary mb-1 line-clamp-1 group-hover:text-secondary transition-colors">{camp.title}</h3>
                    <p className="font-sans text-xs text-slate-500 mb-4">{camp.author}</p>
                    <p className="font-sans text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                      {camp.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                    {/* Progress details */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-700">
                        <span>{percent}% Собрано</span>
                        <span className="text-error font-bold font-sans">Осталось дней: {camp.daysLeft}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 border border-slate-300/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block font-sans uppercase">Цена предзаказа</span>
                        <span className="font-serif text-lg font-bold text-primary">{camp.price} ₽</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCampaign(camp.id);
                        }}
                        className="bg-primary text-on-primary px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider rounded-sm scale-98 hover:opacity-95 transition-all cursor-pointer"
                      >
                        Поддержать
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Cost Calculator */}
      <section className="bg-surface-container border-y border-outline-variant py-20 px-5 md:px-8 mb-20 scroll-mt-24" id="calculator">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-widest">Прозрачная экономика</span>
            <h2 className="font-serif text-3xl font-bold text-primary mt-2">Калькулятор предпродаж</h2>
            <p className="font-sans text-xs text-slate-500 mt-2">Введите параметры вашей будущей книги и узнайте примерную финансовую цель кампании.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Input Form Column */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-6 sm:p-8 rounded flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-sans text-xs font-bold text-primary uppercase">1. Объем книги (страниц)</label>
                    <span className="font-sans text-sm font-bold text-secondary">{calcPages} стр.</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="800" 
                    step="10"
                    value={calcPages}
                    onChange={(e) => setCalcPages(parseInt(e.target.value))}
                    className="w-full accent-primary bg-surface-container cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>50 стр.</span>
                    <span>400 стр.</span>
                    <span>800 стр.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-xs font-bold text-primary uppercase mb-2 block">2. Переплет</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCalcCoverType('soft')}
                        className={`flex-1 border py-2.5 rounded text-xs font-semibold font-sans transition-colors ${calcCoverType === 'soft' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
                      >
                        Мягкая обложка
                      </button>
                      <button 
                        onClick={() => setCalcCoverType('hard')}
                        className={`flex-1 border py-2.5 rounded text-xs font-semibold font-sans transition-colors ${calcCoverType === 'hard' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
                      >
                        Твердый переплет
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-sans text-xs font-bold text-primary uppercase mb-2 block">3. Тип Бумаги</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCalcPaperType('white')}
                        className={`flex-1 border py-2.5 rounded text-xs font-semibold font-sans transition-colors ${calcPaperType === 'white' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
                      >
                        Белая офсетная
                      </button>
                      <button 
                        onClick={() => setCalcPaperType('cream')}
                        className={`flex-1 border py-2.5 rounded text-xs font-semibold font-sans transition-colors ${calcPaperType === 'cream' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
                      >
                        Кремовая пухлая
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs font-bold text-primary uppercase mb-2 block">4. Минимальный тираж печати (экз.)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 300, 500].map(vol => (
                      <button
                        key={vol}
                        onClick={() => setCalcVolume(vol)}
                        className={`py-2 rounded text-xs font-bold font-mono transition-colors border ${calcVolume === vol ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
                      >
                        {vol} шт.{vol === 100 && ' (POD)'}{vol === 300 && ' (-15%)'}{vol === 500 && ' (-25%)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between text-xs text-slate-400">
                <span>* Расчет носит ориентировочный характер. Цены включают базовый контроль ОТК типографии.</span>
              </div>
            </div>

            {/* Calculations Result Column */}
            <div className="lg:col-span-5 bg-primary text-surface p-8 rounded flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Финансовые показатели</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-xs font-medium uppercase font-sans">Себестоимость 1 книги:</span>
                    <span className="text-white text-lg font-bold font-mono">{printingCalculations.unitDiscountedCost} ₽</span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-xs font-medium uppercase font-sans">Чистая печать ({calcVolume} экз):</span>
                    <span className="text-white text-lg font-bold font-mono">{new Intl.NumberFormat('ru-RU').format(printingCalculations.totalPrintPrice)} ₽</span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 text-xs font-medium uppercase font-sans">Комиссия BookStart (15%):</span>
                    <span className="text-slate-400 text-sm font-bold font-mono">{Math.ceil(printingCalculations.targetGoal * 0.15)} ₽</span>
                  </div>

                  <hr className="border-slate-800" />

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-slate-300 text-sm font-semibold uppercase font-sans">Цель сбора на тираж:</span>
                      <span className="text-white text-3xl font-bold font-mono text-amber-500">{new Intl.NumberFormat('ru-RU').format(printingCalculations.targetGoal)} ₽</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-sans text-right italic leading-snug">
                      (Минимальная окупаемость = Стоимость печати + Комиссия платформы)
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded border border-slate-800 space-y-2 mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-sans">Миним. цена предзаказа:</span>
                      <span className="text-slate-200 font-bold font-mono">{printingCalculations.minViablePrice} ₽</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-sans">Рекоменд. цена (роялти +35%):</span>
                      <span className="text-amber-400 font-bold font-mono">{printingCalculations.recommendedPrice} ₽</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={onLaunchCampaign}
                  className="w-full bg-amber-500 text-primary py-4 rounded-sm text-xs font-bold uppercase tracking-wider scale-98 hover:opacity-90 active:scale-95 transition-all"
                >
                  Запустить сбор с этими параметрами
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archive / Already Printed Section */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto mb-24">
        <div className="mb-12">
          <h2 className="font-serif text-3xl text-primary font-bold">Уже напечатаны</h2>
          <p className="font-sans text-xs text-slate-500 mt-1">Эти книги прошли путь от сбора средств до физического тиража.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {printedCampaigns.map(camp => (
            <div 
              key={camp.id} 
              onClick={() => onSelectCampaign(camp.id)}
              className="space-y-3 cursor-pointer group"
            >
              <div className="aspect-[3/4] bg-white p-5 border border-outline-variant/60 book-shadow overflow-hidden flex items-center justify-center relative">
                <img 
                  src={camp.coverUrl} 
                  alt={camp.title} 
                  className="max-h-[90%] object-contain grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-300" 
                />
                <span className="absolute bottom-2 right-2 bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-sm font-sans text-[9px] uppercase font-bold tracking-wider">
                  {camp.status === 'printing' ? 'В печати' : 'У авторов'}
                </span>
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-primary truncate group-hover:text-secondary transition-colors">{camp.title}</h4>
                <p className="font-sans text-[11px] text-slate-500">{camp.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto py-20 border-t border-outline-variant scroll-mt-24 animate-fade-in" id="about-us">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-widest block mb-3">Почему выбирают нас</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mb-4">Сравнение платформ</h2>
          <p className="font-sans text-xs text-slate-500">Посмотрите, чем BookStart отличается от традиционных издательских сервисов и самиздата.</p>
        </div>

        <div className="overflow-x-auto border border-outline-variant rounded bg-surface-container-lowest shadow-sm">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container/60">
                <th className="py-4 px-6 font-semibold text-slate-700 w-1/4">Возможности и условия</th>
                <th className="py-4 px-6 font-bold text-primary bg-amber-50/50 border-x border-amber-500/10 w-1/4">BookStart (Мы)</th>
                <th className="py-4 px-6 font-semibold text-slate-500 w-1/6">Ridero</th>
                <th className="py-4 px-6 font-semibold text-slate-500 w-1/6">LitRes / Самиздат</th>
                <th className="py-4 px-6 font-semibold text-slate-500 w-1/6">Bookmate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">Стартовые вложения автора</td>
                <td className="py-4 px-6 font-bold text-green-700 bg-amber-50/50 border-x border-amber-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600 font-bold">check_circle</span>
                    <span>0 ₽ (Абсолютно бесплатно)</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">0 ₽ / Платные услуги верстки и обложки</td>
                <td className="py-4 px-6 text-slate-600">0 ₽</td>
                <td className="py-4 px-6 text-slate-600">Нет опции самиздата напрямую</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">Встроенный краудфандинг сборов</td>
                <td className="py-4 px-6 font-bold text-green-700 bg-amber-50/50 border-x border-amber-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600 font-bold">check_circle</span>
                    <span>Да (Предзаказы на платформе)</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">Нет (Только готовая дистрибуция)</td>
                <td className="py-4 px-6 text-slate-600">Нет (Только готовая продажа)</td>
                <td className="py-4 px-6 text-slate-600">Нет (Только чтение по подписке)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">Безопасность (Эскроу-гарантия)</td>
                <td className="py-4 px-6 font-bold text-green-700 bg-amber-50/50 border-x border-amber-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600 font-bold">check_circle</span>
                    <span>Да (100% возврат при неуспехе)</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">&mdash;</td>
                <td className="py-4 px-6 text-slate-600">&mdash;</td>
                <td className="py-4 px-6 text-slate-600">&mdash;</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">Автоматическая печать тиража</td>
                <td className="py-4 px-6 font-bold text-green-700 bg-amber-50/50 border-x border-amber-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600 font-bold">check_circle</span>
                    <span>Да (Авто-запуск Print-on-Demand)</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">Только под заказ автора или покупателя</td>
                <td className="py-4 px-6 text-slate-600">Печать по требованию после модерации</td>
                <td className="py-4 px-6 text-slate-600">Нет (Только электронный формат)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-700">Автоматическая доставка под ключ</td>
                <td className="py-4 px-6 font-bold text-green-700 bg-amber-50/50 border-x border-amber-500/10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600 font-bold">check_circle</span>
                    <span>Да (СДЭК / Boxberry интегрированы)</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600">Доставка силами автора или магазинов</td>
                <td className="py-4 px-6 text-slate-600">Только через маркетплейсы партнеров</td>
                <td className="py-4 px-6 text-slate-600">&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 md:px-8 max-w-[1280px] mx-auto py-12 border-t border-outline-variant">
        <h2 className="font-serif text-2xl text-primary font-bold text-center mb-12">Отзывы наших авторов</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-sm text-left">
            <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed">
              «Загрузил PDF, собрал 110 тыс. рублей на сборник стихов за месяц. Деньги выплатили на следующий день после запроса через ЛК, книги напечатали и разослали за 2 недели. СДЭК все доставил!»
            </p>
            <span className="font-sans text-[11px] font-bold text-primary block mt-4 uppercase">— Олег Коваль, автор «Глины и Света»</span>
          </div>
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-sm text-left">
            <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed">
              «Раньше сама бегала по типографиям, упаковывала посылки на почте. BookStart решил всю логистику. Платформа просто автоматически забрала макет, напечатала и отправила. Рекомендую всем!»
            </p>
            <span className="font-sans text-[11px] font-bold text-primary block mt-4 uppercase">— Елена Берг, автор «Структуры Мысли»</span>
          </div>
          <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-sm text-left">
            <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed">
              «Идея автоматического триггера гениальна. Мои читатели предзаказывали книгу, шкала росла в реальном времени, а при достижении 100% заказ улетел в типографию. Полная автоматизация сбыта».
            </p>
            <span className="font-sans text-[11px] font-bold text-primary block mt-4 uppercase">— Мария Громова, автор «Тихого Эха»</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// --- VIEW 2: CAMPAIGN DETAIL PAGE ---
// ==========================================
interface CampaignDetailViewProps {
  campaign: Campaign;
  allCampaigns: Campaign[];
  onBack: () => void;
  onSelectCampaign: (id: string) => void;
  onReadFirstPages: (campaign: Campaign) => void;
  onTriggerPreorder: (campaign: Campaign, tier: { minAmount: number; description: string }) => void;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  allCampaigns,
  onBack,
  onSelectCampaign,
  onReadFirstPages,
  onTriggerPreorder
}) => {
  const percent = Math.min(Math.round((campaign.currentFunding / campaign.targetFunding) * 100), 100);
  
  const recommendations = useMemo(() => {
    return allCampaigns.filter(c => campaign.crossSells.includes(c.id));
  }, [allCampaigns, campaign]);

  return (
    <div className="py-12 px-5 md:px-8 max-w-[1280px] mx-auto">
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider mb-8"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Назад к списку
      </button>

      {/* Split Hero Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left Side: Visuals */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-md p-10 flex items-center justify-center book-shadow aspect-[4/5]">
            <img 
              src={campaign.coverUrl} 
              alt={campaign.title} 
              className="max-h-[90%] object-contain book-shadow rotate-[-1deg]" 
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onReadFirstPages(campaign)}
              className="flex-1 bg-surface-container-lowest border border-outline hover:bg-surface-container-low text-primary py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all scale-98 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              Читать первые 10 страниц
            </button>
          </div>

          <div className="bg-surface-container p-5 rounded border border-outline-variant">
            <h4 className="font-sans text-xs font-bold text-primary uppercase mb-2">Об авторе</h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-1">
              {campaign.authorBio}
            </p>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex gap-2.5 items-center mb-3">
              <span className="bg-primary/5 text-primary border border-primary/20 px-2.5 py-0.5 rounded font-sans text-[10px] uppercase font-bold tracking-wider">
                {campaign.genre}
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded font-sans text-[10px] uppercase font-bold tracking-wider">
                Атмосфера: {campaign.vibe}
              </span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-primary leading-tight">{campaign.title}</h1>
            <p className="font-sans text-sm text-slate-500 mt-2">Автор: <span className="font-semibold text-primary">{campaign.author}</span></p>
          </div>

          {/* Funding Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-md space-y-6 shadow-sm">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block font-sans uppercase">Собрано средств</span>
                <span className="font-serif text-3xl font-bold text-primary">{new Intl.NumberFormat('ru-RU').format(campaign.currentFunding)} ₽</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block font-sans uppercase">Цель сбора</span>
                <span className="font-sans text-sm font-semibold text-slate-600">{new Intl.NumberFormat('ru-RU').format(campaign.targetFunding)} ₽</span>
              </div>
            </div>

            {/* Sleek thin progress bar */}
            <div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{percent}% завершено</span>
                <span>{campaign.preordersCount} предзаказов</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded text-xs text-slate-600 border border-outline-variant/30 justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">hourglass_empty</span>
                <span>Таймер кампании:</span>
              </div>
              {campaign.daysLeft > 0 ? (
                <span className="font-bold text-primary font-sans">{campaign.daysLeft} дней осталось</span>
              ) : (
                <span className="font-bold text-green-600 font-sans uppercase">Сбор успешно завершен</span>
              )}
            </div>

            {campaign.status !== 'funding' && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600 mt-0.5">check_circle</span>
                <div className="text-xs">
                  <h5 className="font-bold">Кампания успешно профинансирована!</h5>
                  <p className="mt-0.5 opacity-90 leading-relaxed">
                    Проект достиг цели. Заказ автоматически отправлен в партнерскую типографию. 
                    Статус: <strong>{campaign.status === 'printing' ? 'Книга печатается' : 'Книга передана в доставку (СДЭК)'}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-primary border-b border-outline-variant/50 pb-2">О книге</h3>
            <p className="font-sans text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>
          </div>

          {/* Reward Tiers / Pre-order widget */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-xl font-bold text-primary border-b border-outline-variant/50 pb-2">Уровни поддержки</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {campaign.bonuses.map((tier, idx) => (
                <div 
                  key={idx} 
                  className="bg-surface-container-lowest border border-outline-variant hover:border-primary p-5 rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex gap-2 items-center">
                      <span className="font-serif text-lg font-bold text-primary font-mono">{new Intl.NumberFormat('ru-RU').format(tier.minAmount)} ₽</span>
                      <span className="bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded font-sans text-[9px] uppercase font-bold tracking-wider">
                        {idx === 0 ? 'Базовый' : idx === 1 ? 'С автографом' : 'Коллекционный'}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">{tier.description}</p>
                  </div>
                  <button 
                    onClick={() => onTriggerPreorder(campaign, tier)}
                    disabled={campaign.daysLeft <= 0 && campaign.status === 'funding'}
                    className={`px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider scale-98 active:scale-95 transition-all text-center rounded-sm shrink-0 ${campaign.daysLeft <= 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-95'}`}
                  >
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Timeline */}
          <div className="bg-surface-container p-6 rounded-md border border-outline-variant space-y-4">
            <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">Логистический пайплайн BookStart</h4>
            
            <div className="relative border-l border-outline-variant pl-6 space-y-6 text-xs text-slate-600">
              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-4 h-4 bg-primary border-4 border-background rounded-full"></span>
                <h5 className="font-bold text-primary">Сбор предзаказов читателями</h5>
                <p className="mt-1 leading-snug">Средства собираются на защищенный эскроу-счет платформы.</p>
              </div>

              <div className="relative">
                <span className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border-4 border-background ${percent >= 100 ? 'bg-primary' : 'bg-slate-300'}`}></span>
                <h5 className={`font-bold ${percent >= 100 ? 'text-primary' : 'text-slate-500'}`}>Проверка макета и препресс</h5>
                <p className="mt-1 leading-snug">Издательство автоматически верифицирует PDF-макет в соответствии с техническими стандартами печати.</p>
              </div>

              <div className="relative">
                <span className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border-4 border-background ${campaign.status === 'printing' || campaign.status === 'shipped' ? 'bg-primary' : 'bg-slate-300'}`}></span>
                <h5 className={`font-bold ${campaign.status === 'printing' || campaign.status === 'shipped' ? 'text-primary' : 'text-slate-500'}`}>Автоматический запуск печати</h5>
                <p className="mt-1 leading-snug">Заказ передается в типографию на рулонную или листовую печать с ОТК контролем качества.</p>
              </div>

              <div className="relative">
                <span className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border-4 border-background ${campaign.status === 'shipped' ? 'bg-primary' : 'bg-slate-300'}`}></span>
                <h5 className={`font-bold ${campaign.status === 'shipped' ? 'text-primary' : 'text-slate-500'}`}>Доставка в СДЭК / Boxberry</h5>
                <p className="mt-1 leading-snug">Готовые книги снабжаются трек-номером и рассылаются покупателям автоматически.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Up-Sell Panel ("С этим заказывают") */}
      {recommendations.length > 0 && (
        <section className="border-t border-outline-variant pt-16 mt-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-primary">С этим заказывают</h3>
              <p className="font-sans text-xs text-slate-500 mt-1">Другие интересные кампании, которые могут вам понравиться.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {recommendations.map(camp => (
              <div 
                key={camp.id}
                onClick={() => onSelectCampaign(camp.id)}
                className="group border border-outline-variant hover:border-primary p-4 rounded bg-surface-container-lowest cursor-pointer transition-colors"
              >
                <div className="aspect-[4/5] bg-surface-container-low flex items-center justify-center p-6 mb-4">
                  <img src={camp.coverUrl} alt={camp.title} className="max-h-full object-contain book-shadow group-hover:scale-103 transition-transform" />
                </div>
                <h4 className="font-serif text-sm font-bold text-primary truncate">{camp.title}</h4>
                <p className="font-sans text-[11px] text-slate-500">{camp.author}</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                  <span className="font-mono text-xs font-bold text-primary">{camp.price} ₽</span>
                  <span className="font-sans text-[10px] text-slate-400">{Math.round((camp.currentFunding/camp.targetFunding)*100)}% собрано</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

// ==========================================
// --- VIEW 3: PUBLISHER (AUTHOR) DASHBOARD ---
// ==========================================
interface AuthorDashboardViewProps {
  campaigns: Campaign[];
  walletBalance: number;
  withdrawals: WithdrawalRequest[];
  onSelectCampaign: (id: string) => void;
  onOpenWithdrawal: () => void;
  onCreateCampaign: (newCampaign: Campaign) => void;
}

const AuthorDashboardView: React.FC<AuthorDashboardViewProps> = ({
  campaigns,
  walletBalance,
  withdrawals,
  onSelectCampaign,
  onOpenWithdrawal,
  onCreateCampaign
}) => {
  const authorCampaigns = useMemo(() => {
    // Show only user created campaigns, or we can show all as mock for convenience in demo
    return campaigns;
  }, [campaigns]);

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Wizard form state
  const [wizTitle, setWizTitle] = useState('');
  const [wizAuthor, setWizAuthor] = useState('');
  const [wizGenre, setWizGenre] = useState('Художественная литература');
  const [wizVibe, setWizVibe] = useState('Меланхолия');
  const [wizDesc, setWizDesc] = useState('');
  const [wizCoverUrl, setWizCoverUrl] = useState('');
  const [wizPages, setWizPages] = useState<number>(200);
  const [wizCoverType, setWizCoverType] = useState<'soft' | 'hard'>('soft');
  const [wizPaperType, setWizPaperType] = useState<'white' | 'cream'>('cream');
  const [wizVolume, setWizVolume] = useState<number>(100);
  const [wizPrice, setWizPrice] = useState<number>(0);
  const [wizDuration, setWizDuration] = useState<number>(30);
  const [wizBonusName, setWizBonusName] = useState('');
  const [wizBonusAmount, setWizBonusAmount] = useState<number>(1000);
  
  // Simulation of PDF Upload
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Auto Calculations for Wizard
  const wizardCalculations = useMemo(() => {
    const baseCoverPrice = wizCoverType === 'hard' ? 250 : 100;
    const pageCost = wizPaperType === 'cream' ? 1.5 : 1.0;
    const unitCost = baseCoverPrice + (wizPages * pageCost);
    
    let scaleFactor = 1.0;
    if (wizVolume >= 300 && wizVolume < 500) scaleFactor = 0.85;
    else if (wizVolume >= 500) scaleFactor = 0.75;
    
    const unitDiscounted = Math.ceil(unitCost * scaleFactor);
    const totalPrintPrice = unitDiscounted * wizVolume;
    const targetGoal = Math.ceil(totalPrintPrice / 0.85); // 15% platform commission
    const minViablePrice = Math.ceil(targetGoal / wizVolume);
    const recommendedPrice = Math.ceil(minViablePrice * 1.35);

    return {
      unitDiscounted,
      totalPrintPrice,
      targetGoal,
      minViablePrice,
      recommendedPrice
    };
  }, [wizPages, wizCoverType, wizPaperType, wizVolume]);

  // Handle PDF upload simulator
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setIsPdfUploaded(true);
        setPdfFileName(file.name);
        setIsUploading(false);
        // Autofill default metadata based on mockup
        if (!wizTitle) setWizTitle(file.name.replace('.pdf', ''));
      }, 1500);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizTitle || !wizAuthor || !wizDesc) {
      alert('Пожалуйста, заполните основные поля книги.');
      return;
    }
    if (!isPdfUploaded) {
      alert('Пожалуйста, загрузите PDF макет вашей книги.');
      return;
    }
    if (wizPrice < wizardCalculations.minViablePrice) {
      alert(`Минимально рентабельная розничная цена для этой книги: ${wizardCalculations.minViablePrice} ₽. Укажите цену выше.`);
      return;
    }

    const defaultCovers = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADyFfYRqd0geczzJge1asDN-_sx6L293vXtV17NyYQVcN8RPOZ4PfLIMslNRrBaF5YcMUA3gtdfqCUBacxQFvfPd62JubYpj1G3JqTVlEGEOXU0Uq4sHbP_YgifoYjz8INUhzKDbdlblDUvkswXMS-3vW9E7JS86XIEV8KfGuAYpethJy3SWjIF3yNLaMvpRsSGFLzzKFgyxPMg9h6gKuOOwmggppid9ectiWGNZS0yQMokqEDy3YsT_tK6iSl2nHIS9dpoXEgoWY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKyDf-_EDmiERUy5b1QHS6Y_E_JepxhHo5giA6oRn5yqj3NFB9fOYfV2jDuF-Oqf3qKhABlu1EccSZQcrFLA_piqHOYUXxI0fy2nDgpfE3zuhwl5M9F8eNn97D1U7J6BEtx7bAlantqXm9nBJuS2lhmNNLPMwrqEKkyMCPl4bxF-tpHwAbEMU2xa7iycc_szFY3o4Vuu640Yc_Mj3C7iUpf2algECp9TVfiHgvGJrcE8qGfNEzLbvOGlKRcahe9akQWW0Ph1YykIE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8g3c9r6TGtiHHSAGJrIwPVCXy9xqSLdlRGcZzfySq0GnOQluIUvfd_qz0gWiZH6zV-5Rq_3mVJG58j8b3AVCf6EYJFuPMShXgrlGQTX8Tvtx5VMmBY0Mo1fslD1fJy3GWu8g6AX0MeEbV7OWGnWG84SPWNCmL4ijq4PQZkTIZmlCcMC5tC23RKSCOa8FQBzn6YKOK6YKTfY3pYLB0zvnJNzQ2W9XPU0NC9_h570CnxCxc48ivj-V1-cVFcdihDp7HPRCHJpNiYNk'
    ];
    const chosenCover = wizCoverUrl || defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const created: Campaign = {
      id: 'camp-' + Date.now(),
      title: wizTitle,
      author: wizAuthor,
      genre: wizGenre,
      vibe: wizVibe,
      description: wizDesc,
      coverUrl: chosenCover,
      targetFunding: wizardCalculations.targetGoal,
      currentFunding: 0,
      price: wizPrice,
      daysLeft: wizDuration,
      preordersCount: 0,
      status: 'funding',
      pages: wizPages,
      coverType: wizCoverType,
      paperType: wizPaperType,
      authorBio: `${wizAuthor} — независимый автор BookStart, создавший свою кампанию предпродаж.`,
      samplePages: SAMPLES.default,
      bonuses: [
        { minAmount: wizPrice, description: `1 экз. книги «${wizTitle}» с автоматической доставкой читателю.` },
        ...(wizBonusName ? [{ minAmount: wizBonusAmount, description: wizBonusName }] : [])
      ],
      crossSells: ['1', '2'],
      createdByUser: true
    };

    onCreateCampaign(created);
    setIsWizardOpen(false);
  };

  return (
    <div className="py-12 px-5 md:px-8 max-w-[1280px] mx-auto">
      
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Кабинет Издателя</h1>
          <p className="font-sans text-xs text-slate-500 mt-1">Панель управления сборами, печатью и вашим балансом.</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="bg-primary text-on-primary hover:opacity-95 px-6 py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider scale-98 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Запустить новую кампанию
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-md shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Баланс (Доступно)</span>
            <span className="font-serif text-3xl font-bold text-primary block mt-2">{new Intl.NumberFormat('ru-RU').format(walletBalance)} ₽</span>
            <span className="font-sans text-[10px] text-slate-500 mt-1 block">Для самозанятых авторов и ИП</span>
          </div>
          <button 
            onClick={onOpenWithdrawal}
            disabled={walletBalance <= 0}
            className="w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary py-2.5 rounded text-xs font-bold font-sans mt-6 tracking-wide scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Вывести средства по заявке
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-md shadow-sm flex flex-col justify-center">
          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Всего привлечено</span>
          <span className="font-serif text-3xl font-bold text-primary block mt-2">
            {new Intl.NumberFormat('ru-RU').format(authorCampaigns.reduce((acc, c) => acc + c.currentFunding, 0))} ₽
          </span>
          <span className="font-sans text-[10px] text-green-600 mt-2 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            Из средств предзаказов читателей
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-md shadow-sm flex flex-col justify-center">
          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Книг в тиражировании</span>
          <span className="font-serif text-3xl font-bold text-primary block mt-2">
            {authorCampaigns.filter(c => c.status === 'printing' || c.status === 'shipped').length}
          </span>
          <span className="font-sans text-[10px] text-slate-500 mt-2">
            Автоматическая передача в печать и СДЭК
          </span>
        </div>
      </div>

      {/* Campaigns Listing */}
      <section className="mb-16">
        <h2 className="font-serif text-xl font-bold text-primary border-b border-outline-variant/60 pb-3 mb-6">Ваши проекты книг</h2>
        
        <div className="space-y-4">
          {authorCampaigns.map(camp => {
            const percent = Math.min(Math.round((camp.currentFunding / camp.targetFunding) * 100), 100);
            return (
              <div 
                key={camp.id}
                className="bg-surface-container-lowest border border-outline-variant p-5 rounded-sm flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between hover:border-primary transition-all duration-300"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-surface-container-low border border-outline-variant/40 flex items-center justify-center p-2 rounded shrink-0">
                    <img src={camp.coverUrl} alt={camp.title} className="max-h-full object-contain book-shadow" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary">{camp.title}</h3>
                    <p className="font-sans text-xs text-slate-500">{camp.genre}</p>
                    <div className="flex gap-2 items-center mt-2.5">
                      <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] font-bold uppercase tracking-wider ${camp.status === 'funding' ? 'bg-blue-100 text-blue-800' : camp.status === 'printing' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-green-100 text-green-800'}`}>
                        {camp.status === 'funding' ? 'Идет сбор' : camp.status === 'printing' ? 'В печати' : 'Отправлено'}
                      </span>
                      <span className="font-sans text-[10px] text-slate-400">
                        {camp.pages} стр. • {camp.coverType === 'hard' ? 'Твердый' : 'Мягкий'} переплет
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar inside row */}
                <div className="w-full lg:w-72 space-y-1">
                  <div className="flex justify-between font-sans text-[11px] font-semibold text-slate-600">
                    <span>{new Intl.NumberFormat('ru-RU').format(camp.currentFunding)} ₽</span>
                    <span>из {new Intl.NumberFormat('ru-RU').format(camp.targetFunding)} ₽</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-sans text-[10px] text-slate-400">
                    <span>{percent}% собрано</span>
                    <span>{camp.preordersCount} предзаказов</span>
                  </div>
                </div>

                {/* Manage buttons */}
                <div className="flex gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-none border-outline-variant/40">
                  <button 
                    onClick={() => onSelectCampaign(camp.id)}
                    className="flex-1 lg:flex-none border border-outline hover:bg-surface-container-low text-primary px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Лендинг книги
                  </button>
                  <button 
                    onClick={() => alert(`Загружен макет: ${camp.title}.pdf\nОбъем: ${camp.pages} страниц.\nКонтроль ОТК: Успешно пройден.\nВ случае сбора суммы, автопечать начнется мгновенно.`)}
                    className="flex-1 lg:flex-none bg-primary text-on-primary hover:opacity-95 px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all text-center"
                  >
                    Макет PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Withdrawal Logs */}
      <section>
        <h2 className="font-serif text-xl font-bold text-primary border-b border-outline-variant/60 pb-3 mb-6">История заявок на вывод средств</h2>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant text-slate-500 font-bold">
                <th className="p-4 uppercase tracking-wider">Дата</th>
                <th className="p-4 uppercase tracking-wider">Сумма</th>
                <th className="p-4 uppercase tracking-wider">Налоговый Статус</th>
                <th className="p-4 uppercase tracking-wider">Реквизиты</th>
                <th className="p-4 uppercase tracking-wider text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-medium text-slate-700">{w.date}</td>
                  <td className="p-4 font-bold text-primary font-mono">{new Intl.NumberFormat('ru-RU').format(w.amount)} ₽</td>
                  <td className="p-4 text-slate-600 font-semibold">{w.taxStatus === 'self_employed' ? 'Самозанятый (НПД)' : 'ИП (УСН)'} <span className="text-[10px] text-slate-400 block font-mono">ИНН: {w.taxId}</span></td>
                  <td className="p-4 text-slate-500">{w.paymentDetails}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-0.5 rounded font-sans text-[10px] font-bold uppercase tracking-wider ${w.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {w.status === 'processed' ? 'Исполнено' : 'В обработке'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Launch Campaign Wizard Modal --- */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-outline rounded w-full max-w-3xl max-h-[90vh] overflow-y-auto book-shadow flex flex-col justify-between">
            <div className="border-b border-outline-variant p-6 flex justify-between items-center bg-surface-container">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">Новая кампания за 5 минут</h2>
                <p className="font-sans text-xs text-slate-500 mt-1">Создайте страницу сбора предзаказов книги с автопечатью.</p>
              </div>
              <button 
                onClick={() => setIsWizardOpen(false)}
                className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer p-1"
              >
                close
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 sm:p-8 space-y-6 flex-1">
              
              {/* Stepper block: PDF Drag and Drop */}
              <div className="space-y-2">
                <label className="font-sans text-xs font-bold text-primary uppercase block">Шаг 1: Загрузка PDF макета книги (Обязательно)</label>
                <div className="border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low rounded-md p-6 flex flex-col items-center justify-center text-center relative transition-colors">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {isUploading ? (
                    <div className="space-y-2">
                      <span className="material-symbols-outlined animate-spin text-secondary text-4xl">autorenew</span>
                      <p className="font-sans text-xs text-slate-600 font-semibold">Анализ макета и страниц...</p>
                    </div>
                  ) : isPdfUploaded ? (
                    <div className="space-y-1">
                      <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                      <p className="font-sans text-xs text-green-800 font-bold">Файл успешно загружен!</p>
                      <p className="font-sans text-[11px] text-slate-500 font-mono">{pdfFileName}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="material-symbols-outlined text-slate-400 text-4xl">upload_file</span>
                      <p className="font-sans text-xs text-slate-600 font-bold">Нажмите или перетащите PDF файл книги сюда</p>
                      <p className="font-sans text-[11px] text-slate-400">Платформа автоматически прочитает объем страниц и обложку</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Form Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-sans text-xs font-bold text-primary uppercase mb-1.5 block">Название книги</label>
                  <input 
                    type="text" 
                    placeholder="Введите название..."
                    value={wizTitle}
                    onChange={(e) => setWizTitle(e.target.value)}
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-bold text-primary uppercase mb-1.5 block">Автор (Имя на обложке)</label>
                  <input 
                    type="text" 
                    placeholder="Мария Громова"
                    value={wizAuthor}
                    onChange={(e) => setWizAuthor(e.target.value)}
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs font-bold text-primary uppercase mb-1.5 block">Жанр книги</label>
                  <select 
                    value={wizGenre}
                    onChange={(e) => setWizGenre(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none cursor-pointer"
                  >
                    <option value="Художественная литература">Художественная литература</option>
                    <option value="Нуар детектив">Нуар детектив</option>
                    <option value="Когнитивные науки / Философия">Когнитивные науки / Философия</option>
                    <option value="Уютное Фэнтези / Сказка">Уютное Фэнтези / Сказка</option>
                    <option value="Лирика / Поэзия">Лирика / Поэзия</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans text-xs font-bold text-primary uppercase mb-1.5 block">Атмосфера (Фильтр на сайте)</label>
                  <select 
                    value={wizVibe}
                    onChange={(e) => setWizVibe(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none cursor-pointer"
                  >
                    <option value="Меланхолия">Меланхолия</option>
                    <option value="Интеллект">Интеллект</option>
                    <option value="Уют">Уют</option>
                    <option value="Высокие ставки">Высокие ставки</option>
                    <option value="Нуар">Нуар</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-sans text-xs font-bold text-primary uppercase mb-1.5 block">Ссылка на изображение обложки (Необязательно)</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/cover.jpg (или останется по умолчанию)"
                    value={wizCoverUrl}
                    onChange={(e) => setWizCoverUrl(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-xs font-bold text-primary uppercase mb-1.5 block">Описание книги (Аннотация до 300 слов)</label>
                <textarea 
                  rows={3}
                  placeholder="О чем ваша книга? Почему читатели захотят сделать предзаказ..."
                  value={wizDesc}
                  onChange={(e) => setWizDesc(e.target.value)}
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none resize-none"
                />
              </div>

              {/* Printing Specifiers inside form */}
              <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/60 space-y-4">
                <h4 className="font-sans text-[11px] font-bold text-primary uppercase tracking-wider">Шаг 2: Параметры печати тиража (Калькуляция)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Количество страниц</label>
                    <input 
                      type="number" 
                      min="50" 
                      max="1000"
                      value={wizPages}
                      onChange={(e) => setWizPages(Math.max(50, parseInt(e.target.value) || 50))}
                      className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded font-sans text-xs outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Переплет книги</label>
                    <select
                      value={wizCoverType}
                      onChange={(e) => setWizCoverType(e.target.value as 'soft' | 'hard')}
                      className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="soft">Мягкая обложка</option>
                      <option value="hard">Твердый переплет</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Бумага внутреннего блока</label>
                    <select
                      value={wizPaperType}
                      onChange={(e) => setWizPaperType(e.target.value as 'white' | 'cream')}
                      className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="white">Белая офсетная</option>
                      <option value="cream">Кремовая пухлая</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-sans text-[10px] font-bold text-slate-500 uppercase block mb-1">Тираж для запуска (Копий)</label>
                    <select
                      value={wizVolume}
                      onChange={(e) => setWizVolume(parseInt(e.target.value))}
                      className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="100">100 шт. (Базовый POD-заказ)</option>
                      <option value="300">300 шт. (Скидка типографии -15%)</option>
                      <option value="500">500 шт. (Опт типографии -25%)</option>
                    </select>
                  </div>

                  <div className="bg-primary text-surface p-3 rounded flex flex-col justify-center">
                    <span className="font-sans text-[9px] text-slate-400 block uppercase font-medium">Цель сбора на тираж (Автоподсказка):</span>
                    <span className="font-serif text-sm font-bold text-amber-500 mt-0.5 font-mono">
                      {new Intl.NumberFormat('ru-RU').format(wizardCalculations.targetGoal)} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps 3: Pricing and safety constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold text-primary uppercase block">Шаг 3: Розничная цена для читателей</label>
                  <input 
                    type="number" 
                    placeholder="₽"
                    value={wizPrice || ''}
                    onChange={(e) => setWizPrice(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none font-mono"
                  />
                  {wizPrice > 0 && wizPrice < wizardCalculations.minViablePrice ? (
                    <span className="text-[11px] text-error font-semibold block leading-tight">
                      ⚠️ Цена ниже себестоимости ({wizardCalculations.minViablePrice} ₽). Кампания принесет убытки платформе и автору. Запуск заблокирован.
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Минимально рентабельный порог: <strong>{wizardCalculations.minViablePrice} ₽</strong>. Рекомендуемая цена с учетом вашего роялти: <strong>{wizardCalculations.recommendedPrice} ₽</strong>.
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold text-primary uppercase block">Длительность сбора (Дней)</label>
                  <select 
                    value={wizDuration}
                    onChange={(e) => setWizDuration(parseInt(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none cursor-pointer"
                  >
                    <option value="30">30 дней (Оптимально)</option>
                    <option value="45">45 дней (Для привлечения блогов)</option>
                    <option value="60">60 дней (Максимально)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block leading-tight">Рекомендуется не менее 30-60 дней для раскрутки в социальных сетях.</span>
                </div>
              </div>

              {/* Step 4: Bonuses config */}
              <div className="bg-surface-container p-4 rounded-md border border-outline-variant/60 space-y-3">
                <label className="font-sans text-xs font-bold text-primary uppercase block">Шаг 4: Бонус за предзаказ спонсорам от 1000 ₽</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <input 
                      type="text" 
                      placeholder="Например: Имя спонсора в книге + цифровой автограф в PDF"
                      value={wizBonusName}
                      onChange={(e) => setWizBonusName(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded font-sans text-xs outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Мин. сумма (₽)"
                      value={wizBonusAmount || ''}
                      onChange={(e) => setWizBonusAmount(parseInt(e.target.value) || 1000)}
                      className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded font-sans text-xs outline-none font-mono"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Поскольку автограф ставится на этапе POD печати, автор может загрузить страницу цифровой подписи, которая напечатается на первой странице у спонсоров данной категории.
                </span>
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3.5">
                <button 
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="border border-outline hover:bg-surface-container-low px-6 py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={!isPdfUploaded || wizPrice < wizardCalculations.minViablePrice || !wizTitle || !wizAuthor}
                  className="bg-primary text-on-primary hover:opacity-95 px-6 py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all scale-98 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Запустить Кампанию
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// ==========================================
// --- VIEW 4: BUYER DASHBOARD ---
// ==========================================
interface BuyerDashboardViewProps {
  preorders: Preorder[];
  campaigns: Campaign[];
  onSelectCampaign: (id: string) => void;
}

const BuyerDashboardView: React.FC<BuyerDashboardViewProps> = ({
  preorders,
  campaigns,
  onSelectCampaign
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<Preorder | null>(null);

  return (
    <div className="py-12 px-5 md:px-8 max-w-[1280px] mx-auto">
      
      <div className="mb-12">
        <h1 className="font-serif text-3xl font-bold text-primary">Ваши предзаказы</h1>
        <p className="font-sans text-xs text-slate-500 mt-1">История ваших инвестиций в книги и статусы доставки посылок.</p>
      </div>

      {preorders.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest border border-outline-variant rounded-md">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">shopping_bag</span>
          <p className="font-sans text-sm text-slate-500">У вас пока нет активных предзаказов.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {preorders.map(order => {
            // Find corresponding campaign in state
            const campaign = campaigns.find(c => c.id === order.campaignId);
            const campaignProgress = campaign ? Math.min(Math.round((campaign.currentFunding / campaign.targetFunding) * 100), 100) : 0;
            
            return (
              <div 
                key={order.id} 
                className="bg-surface-container-lowest border border-outline-variant p-6 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-stretch"
              >
                
                {/* Left block - info */}
                <div className="flex gap-4 items-start">
                  <div 
                    onClick={() => onSelectCampaign(order.campaignId)}
                    className="w-16 h-20 bg-surface-container-low border border-outline-variant/30 flex items-center justify-center p-2 rounded cursor-pointer shrink-0"
                  >
                    <img src={order.coverUrl} alt={order.bookTitle} className="max-h-full object-contain book-shadow" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 
                      onClick={() => onSelectCampaign(order.campaignId)}
                      className="font-serif text-lg font-bold text-primary cursor-pointer hover:text-secondary truncate line-clamp-1"
                    >
                      {order.bookTitle}
                    </h3>
                    <p className="font-sans text-xs text-slate-500">Автор: {order.author}</p>
                    <div className="text-[11px] text-slate-400 font-sans">
                      Заказ от {order.date} • Оплачено: <strong className="text-primary font-mono">{order.amountPaid} ₽</strong>
                      {order.bonusClaimed && <span className="block text-slate-600 font-semibold mt-0.5">🎁 Бонус: {order.bonusClaimed}</span>}
                    </div>
                  </div>
                </div>

                {/* Middle block: Shipped Step Progress Timeline */}
                <div className="w-full md:w-80 flex flex-col justify-center space-y-4">
                  <div>
                    <div className="flex justify-between font-sans text-[11px] font-bold mb-2">
                      <span className="text-slate-600">Статус заказа:</span>
                      <span className={`uppercase font-sans ${order.status === 'delivered' ? 'text-green-600' : 'text-primary'}`}>
                        {order.status === 'funding' ? 'Идет сбор средств' : order.status === 'printing' ? 'В печати' : order.status === 'shipped' ? 'Отправлено перевозчиком' : 'Доставлено'}
                      </span>
                    </div>

                    {/* Step bar */}
                    <div className="grid grid-cols-3 gap-1 h-1.5 rounded-full overflow-hidden bg-surface-container">
                      <div className={`h-full ${order.status !== 'funding' || campaignProgress >= 100 ? 'bg-primary' : 'bg-amber-500 animate-pulse'}`} />
                      <div className={`h-full ${order.status === 'printing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-primary' : 'bg-surface-container'}`} />
                      <div className={`h-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-primary' : 'bg-surface-container'}`} />
                    </div>

                    <div className="flex justify-between font-sans text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      <span>1. Сбор ({campaignProgress}%)</span>
                      <span className="text-center">2. Печать</span>
                      <span className="text-right">3. Доставка</span>
                    </div>
                  </div>

                  {/* Tracking details */}
                  {order.status === 'shipped' && order.trackingNumber && (
                    <div className="bg-surface-container-low border border-outline-variant/40 p-3 rounded flex gap-2.5 items-center text-xs text-slate-600">
                      <span className="material-symbols-outlined text-amber-600">local_shipping</span>
                      <div className="text-[11px]">
                        <span>Трек-номер СДЭК: <strong className="text-primary font-mono">{order.trackingNumber}</strong></span>
                        <a href="#" className="text-slate-500 underline font-semibold block hover:text-primary transition-colors">Отследить посылку &rarr;</a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right block: Action buttons */}
                <div className="flex flex-col justify-between items-end gap-3 h-full self-stretch pt-4 md:pt-0 border-t md:border-none border-outline-variant/40 w-full md:w-auto shrink-0">
                  <span className="font-mono text-xs text-slate-400 font-bold hidden md:inline">ID заказа: #{order.id}</span>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => setSelectedReceipt(order)}
                      className="flex-1 md:flex-none border border-outline hover:bg-surface-container-low text-primary px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">receipt_long</span>
                      Чек / Документы
                    </button>
                    <button 
                      onClick={() => onSelectCampaign(order.campaignId)}
                      className="flex-1 md:flex-none bg-primary text-on-primary hover:opacity-95 px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all text-center"
                    >
                      Страница книги
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- Printable Invoice / Receipt Dialog --- */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 text-slate-800 max-w-md w-full p-8 rounded book-shadow space-y-6 font-serif relative">
            <button 
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer material-symbols-outlined"
            >
              close
            </button>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">КВИТАНЦИЯ ОБ ОПЛАТЕ</h2>
              <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest">BookStart Crowdfunding Ltd.</p>
              <div className="border-b-2 border-slate-950 pt-2"></div>
            </div>

            <div className="font-sans text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Чек ID:</span>
                <span className="font-mono font-bold text-slate-950">{selectedReceipt.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Дата транзакции:</span>
                <span className="text-slate-950">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Покупатель:</span>
                <span className="text-slate-950">Пользователь платформы</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Проект книги:</span>
                <span className="text-slate-950 font-semibold">{selectedReceipt.bookTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Автор / Правообладатель:</span>
                <span className="text-slate-950">{selectedReceipt.author}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Назначение платежа:</span>
                <span className="text-slate-950">Предзаказ печатного издания</span>
              </div>
              {selectedReceipt.bonusClaimed && (
                <div className="flex justify-between bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 font-semibold">Уровень поддержки:</span>
                  <span className="text-slate-800 font-semibold">{selectedReceipt.bonusClaimed}</span>
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-slate-300 pt-4">
              <div className="flex justify-between items-baseline font-sans">
                <span className="text-slate-950 font-bold text-sm">ИТОГО ОПЛАЧЕНО:</span>
                <span className="text-xl font-bold font-mono text-slate-950">{selectedReceipt.amountPaid} ₽</span>
              </div>
              <p className="font-sans text-[10px] text-slate-400 text-center mt-6">
                Операция произведена по протоколу СБП. <br />
                Физическая печать запускается автоматически при завершении сбора. <br />
                НДС не облагается в соответствии с НК РФ.
              </p>
            </div>

            <div className="flex justify-end pt-4 font-sans">
              <button 
                onClick={() => window.print()}
                className="bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 scale-98 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-xs">print</span>
                Печать чека
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ==========================================
// --- SUB-COMPONENT 1: READER MODAL ---
// ==========================================
const ReaderModal = ({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) => {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  
  const pagesText = useMemo(() => {
    return campaign.samplePages || SAMPLES.default;
  }, [campaign]);

  return (
    <div className="fixed inset-0 z-50 bg-primary/45 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fcfcfa] border border-outline w-full max-w-4xl max-h-[92vh] flex flex-col justify-between book-shadow rounded">
        
        {/* Header toolbar */}
        <div className="border-b border-outline-variant bg-surface-container px-6 py-4 flex justify-between items-center shrink-0">
          <div className="text-left">
            <h4 className="font-serif text-sm font-bold text-primary">{campaign.title}</h4>
            <p className="font-sans text-[11px] text-slate-500 uppercase tracking-widest">Ознакомительный фрагмент (Первые 10 страниц)</p>
          </div>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer p-1"
          >
            close
          </button>
        </div>

        {/* Book pages frame */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex items-center justify-center paper-texture">
          {/* Double page layout simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-3xl items-start">
            
            {/* Left Page (Odd Page index) */}
            <div className="space-y-4 text-left border-r border-outline-variant/20 pr-0 md:pr-8 min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="font-serif text-[11px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 block">Глава I</span>
                <p className="font-serif text-slate-800 leading-relaxed text-[15px] indent-6 mt-4 whitespace-pre-line">
                  {pagesText[currentPageIdx * 2] || "Конец фрагмента."}
                </p>
              </div>
              <span className="font-sans text-[10px] text-slate-400 font-bold block mt-6 text-center font-mono">стр. {currentPageIdx * 2 + 1}</span>
            </div>

            {/* Right Page (Even Page index) */}
            <div className="space-y-4 text-left pl-0 md:pl-4 min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="font-serif text-[11px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 block">{campaign.author}</span>
                <p className="font-serif text-slate-800 leading-relaxed text-[15px] indent-6 mt-4 whitespace-pre-line">
                  {pagesText[currentPageIdx * 2 + 1] || "Конец ознакомительного фрагмента. Поддержите проект, чтобы книга была напечатана!"}
                </p>
              </div>
              <span className="font-sans text-[10px] text-slate-400 font-bold block mt-6 text-center font-mono">стр. {currentPageIdx * 2 + 2}</span>
            </div>

          </div>
        </div>

        {/* Footer pagination */}
        <div className="border-t border-outline-variant bg-surface-container px-6 py-4 flex justify-between items-center shrink-0 font-sans text-xs">
          <button 
            disabled={currentPageIdx === 0}
            onClick={() => setCurrentPageIdx(p => p - 1)}
            className="flex items-center gap-1 border border-outline hover:bg-surface-container-low text-primary px-3 py-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold"
          >
            <span className="material-symbols-outlined text-sm">arrow_left</span>
            Назад
          </button>

          <span className="font-sans text-slate-500 font-semibold font-mono">
            {currentPageIdx + 1} / {Math.ceil(pagesText.length / 2)}
          </span>

          <button 
            disabled={currentPageIdx >= Math.ceil(pagesText.length / 2) - 1}
            onClick={() => setCurrentPageIdx(p => p + 1)}
            className="flex items-center gap-1 border border-outline hover:bg-surface-container-low text-primary px-3 py-1.5 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold"
          >
            Вперед
            <span className="material-symbols-outlined text-sm">arrow_right</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// --- SUB-COMPONENT 2: CHECKOUT MODAL ---
// ==========================================
interface CheckoutModalProps {
  campaign: Campaign;
  tier: { minAmount: number; description: string };
  onClose: () => void;
  onSuccess: (amount: number, bonusName: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ campaign, tier, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'card'>('sbp');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(tier.minAmount, tier.description);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-outline w-full max-w-md book-shadow rounded flex flex-col overflow-hidden">
        
        <div className="border-b border-outline-variant bg-surface-container p-5 flex justify-between items-center">
          <div>
            <h4 className="font-serif text-lg font-bold text-primary">Безопасная оплата предзаказа</h4>
            <p className="font-sans text-[11px] text-slate-500">Поддержка проекта: «{campaign.title}»</p>
          </div>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer p-1"
          >
            close
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-6">
          <div className="bg-surface-container p-4 rounded border border-outline-variant/60 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wide text-[10px] block font-sans">Сумма к оплате:</span>
              <span className="font-sans text-[13px] text-slate-600 leading-snug font-semibold block">{tier.description}</span>
            </div>
            <span className="font-serif text-xl font-bold text-primary shrink-0 font-mono">{tier.minAmount} ₽</span>
          </div>

          {/* Payment Methods Tabs */}
          <div>
            <label className="font-sans text-[11px] font-bold text-slate-500 uppercase block mb-2">Выберите способ оплаты</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setPaymentMethod('sbp')}
                className={`flex-1 border py-2.5 rounded text-xs font-bold font-sans transition-colors ${paymentMethod === 'sbp' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
              >
                Система быстрых платежей (СБП)
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 border py-2.5 rounded text-xs font-bold font-sans transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
              >
                Банковская карта
              </button>
            </div>
          </div>

          {/* Payment Fields */}
          {paymentMethod === 'sbp' ? (
            <div className="text-center py-6 bg-slate-50 border border-slate-200 rounded space-y-4">
              <div className="w-32 h-32 mx-auto bg-white border border-slate-300 p-2 flex items-center justify-center">
                {/* Mock QR code container */}
                <div className="w-full h-full bg-[radial-gradient(#121a21_20%,transparent_20%),radial-gradient(#121a21_20%,transparent_20%)] bg-[size:10px_10px] bg-[position:0_0,5px_5px] opacity-70"></div>
              </div>
              <p className="font-sans text-[11px] text-slate-500 max-w-xs mx-auto">
                Отсканируйте QR-код в мобильном приложении банка или нажмите кнопку ниже для оплаты.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-500 uppercase mb-1 block">Номер карты</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  required
                  maxLength={19}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase mb-1 block">Срок действия</label>
                  <input 
                    type="text" 
                    placeholder="ММ/ГГ"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    maxLength={5}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none font-mono text-center"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] font-bold text-slate-500 uppercase mb-1 block">CVV/CVC</label>
                  <input 
                    type="password" 
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    required
                    maxLength={3}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none font-mono text-center"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-outline-variant/60 flex flex-col gap-2">
            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary text-on-primary hover:opacity-95 py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-wider scale-98 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                  Обработка платежа...
                </>
              ) : (
                `Подтвердить платеж на ${tier.minAmount} ₽`
              )}
            </button>
            <p className="font-sans text-[9px] text-slate-400 text-center leading-normal">
              Нажимая кнопку, вы принимаете условия Лицензионного договора-оферты и даете согласие на обработку персональных данных.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

// ==========================================
// --- SUB-COMPONENT 3: WITHDRAWAL MODAL ---
// ==========================================
interface WithdrawalModalProps {
  balance: number;
  onClose: () => void;
  onSubmit: (amount: number, details: { taxStatus: 'self_employed' | 'ip'; taxId: string; paymentDetails: string }) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ balance, onClose, onSubmit }) => {
  const [taxStatus, setTaxStatus] = useState<'self_employed' | 'ip'>('self_employed');
  const [taxId, setTaxId] = useState('');
  const [amount, setAmount] = useState<number>(balance);
  const [paymentDetails, setPaymentDetails] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > balance) {
      alert('Укажите корректную сумму для вывода в пределах баланса.');
      return;
    }
    if (taxId.length < 10) {
      alert('Пожалуйста, введите корректный ИНН (10 или 12 цифр).');
      return;
    }
    if (!paymentDetails) {
      alert('Укажите реквизиты для зачисления средств.');
      return;
    }

    onSubmit(amount, {
      taxStatus,
      taxId,
      paymentDetails
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-outline w-full max-w-md book-shadow rounded flex flex-col overflow-hidden">
        
        <div className="border-b border-outline-variant bg-surface-container p-5 flex justify-between items-center">
          <div>
            <h4 className="font-serif text-lg font-bold text-primary">Заявка на вывод средств</h4>
            <p className="font-sans text-[11px] text-slate-500">Доступно к выводу: {balance} ₽</p>
          </div>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-slate-400 hover:text-primary cursor-pointer p-1"
          >
            close
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold text-primary uppercase block">1. Налоговый статус автора</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setTaxStatus('self_employed')}
                className={`flex-1 border py-2.5 rounded text-xs font-bold font-sans transition-colors ${taxStatus === 'self_employed' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
              >
                Самозанятый (НПД)
              </button>
              <button 
                type="button"
                onClick={() => setTaxStatus('ip')}
                className={`flex-1 border py-2.5 rounded text-xs font-bold font-sans transition-colors ${taxStatus === 'ip' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:bg-surface-container-low text-slate-600'}`}
              >
                Индивид. предприниматель (ИП)
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block leading-tight">
              {taxStatus === 'self_employed' 
                ? 'Вывод доступен на карту физлица. Сервис автоматически сгенерирует чек в приложении «Мой Налог».' 
                : 'Вывод производится на расчетный счет ИП. Потребуется выставить счет на платформу.'}
            </span>
          </div>

          <div>
            <label className="font-sans text-[10px] font-bold text-slate-500 uppercase mb-1 block">2. Ваш ИНН</label>
            <input 
              type="text" 
              placeholder="12-значный ИНН физлица или 10-значный ИНН организации"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value.replace(/\D/g, ''))}
              required
              maxLength={12}
              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-[10px] font-bold text-slate-500 uppercase mb-1 block">3. Сумма к выводу (₽)</label>
              <input 
                type="number" 
                min="100" 
                max={balance}
                value={amount}
                onChange={(e) => setAmount(Math.min(balance, parseInt(e.target.value) || 0))}
                required
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none font-mono"
              />
            </div>

            <div className="bg-surface-container p-3 rounded border border-outline-variant flex flex-col justify-center">
              <span className="text-[9px] text-slate-400 font-sans block uppercase">Остаток на балансе:</span>
              <span className="font-sans text-sm font-bold text-primary font-mono">{balance - amount} ₽</span>
            </div>
          </div>

          <div>
            <label className="font-sans text-[10px] font-bold text-slate-500 uppercase mb-1 block">4. Реквизиты для перевода</label>
            <input 
              type="text" 
              placeholder={taxStatus === 'self_employed' ? 'Номер телефона СБП и банк (напр. Сбер)' : 'БИК Банка и Номер Расчетного счета'}
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary p-3 rounded font-sans text-xs outline-none"
            />
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3 font-sans">
            <button 
              type="button"
              onClick={onClose}
              className="border border-outline hover:bg-surface-container-low px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
            >
              Отмена
            </button>
            <button 
              type="submit"
              disabled={amount <= 0 || amount > balance || taxId.length < 10 || !paymentDetails}
              className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider scale-98 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить заявку
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
