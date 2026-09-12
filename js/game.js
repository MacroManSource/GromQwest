/* =========================================================
   LAST ASYLUM: THE LOST PROTOCOL — frontend prototype
   Pure vanilla JS, no backend, state persisted to localStorage.
========================================================= */

/* ---------------- GAME DATA ---------------- */
const DATA = {
  branches: [
    {
      id:'b1', order:1, title:'АРХИВ ВЫЖИВШИХ', stars:2,
      intro:'Первый повреждённый файл архива. Базовые механики убежища и героев — но записи уже подделаны местами.',
      finalCodeOrder:['4','7','R','Δ','Ω'],
      finalHints:[
        'Не все символы равны — раздели их на группы: числа, латинские буквы, греческие буквы.',
        'Внутри группы чисел выстрой их по возрастанию.',
        'Порядок групп: сначала числа (по возрастанию), затем латиница, затем греческий алфавит.'
      ],
      puzzles:[
        {
          id:'b1_p1', type:'text', trap:true,
          title:'ФРАГМЕНТ 01 — РОЛЬ БЕЗ ИМЕНИ',
          fileTag:'FILE #041',
          question:'В отчёте уцелевшего сказано: этот боец стоит в последнем ряду построения, ни разу не получил урон первым и не нанёс ни одного удара за весь бой. Однако именно благодаря ему отряд выжил.\n\nНазови не его класс, а роль, которую он выполняет для остальных.',
          accepted:['поддержка','support','саппорт'],
          hints:[
            'Речь не о том, кто лечит, а о том, кто помогает другим действовать лучше.',
            'Это слово в играх часто пишут английской калькой из четырёх букв — support.',
            "Ответ — общее название роли: 'поддержка'."
          ],
          reward:'Δ',
          lore:"Файл 041: 'Личность не установлена. Отмечен как SUPPORT-CLASS в трёх независимых отчётах.'"
        },
        {
          id:'b1_p2', type:'mc',
          title:'ФРАГМЕНТ 02 — НЕ ЕГО ФУНКЦИЯ',
          fileTag:'FILE #052',
          question:'Убежище (Sanctuary) — центр операций выжившего. В повреждённой записи перечислены его функции, но одна строка была подделана.\n\nКакая из функций НЕ относится к прямым задачам убежища?',
          options:['Хранение и обработка ресурсов','Прокачка героев и построек','Прямое участие в PvP-сражении','Проведение исследований (Research)'],
          correctIndex:2,
          hints:[
            'Три варианта описывают то, что происходит ВНУТРИ базы. Один — снаружи.',
            'Сам бой в PvP не отображается на экране убежища.',
            "Ответ — 'Прямое участие в PvP-сражении'."
          ],
          reward:'7',
          lore:"Файл 052: журнал операций Sanctuary за неделю заражения."
        },
        {
          id:'b1_p3', type:'order',
          title:'ФРАГМЕНТ 03 — ПОРЯДОК РОСТА',
          fileTag:'FILE #058',
          question:'Расставь стадии развития героя в правильном порядке, начиная с самой ранней.',
          items:['Пробуждение (Awakening)','Открытие героя','Повышение звёзд (Rarity Up)','Повышение уровня'],
          correctOrder:['Открытие героя','Повышение уровня','Повышение звёзд (Rarity Up)','Пробуждение (Awakening)'],
          hints:[
            'Сначала героя нужно получить, а уже потом развивать.',
            'Уровень — самый частый и ранний способ роста силы, задолго до пробуждения.',
            'Порядок: Открытие → Уровень → Звёзды → Пробуждение.'
          ],
          reward:'R',
          lore:"Файл 058: диаграмма прогрессии героя, обнаруженная в закладках исследователя."
        },
        {
          id:'b1_p4', type:'text',
          title:'ФРАГМЕНТ 04 — СМЕЩЕНИЕ',
          fileTag:'FILE #063',
          question:'Зашифрованное сообщение: XJHWJY\n\nКлюч сдвига уже назван в самом начале расследования — таков был уровень допуска: RESTRICTED, а у него ровно 5 положений смещения.\n\nСдвинь каждую букву шифра на 5 позиций НАЗАД по алфавиту и введи результат.',
          accepted:['secret','секрет'],
          hints:[
            'Ключ шифра уже написан в задании — это число 5.',
            'Сдвигай каждую букву на 5 позиций назад, не вперёд.',
            'Результат — английское слово SECRET.'
          ],
          reward:'4',
          lore:"Файл 063: обрывок переписки, зашифрованной простым смещением."
        },
        {
          id:'b1_p5', type:'truefalse',
          title:'ФРАГМЕНТ 05 — ПОВРЕЖДЁННЫЙ ОТЧЁТ',
          fileTag:'FILE #071',
          question:'Ниже — пять утверждений из архивного отчёта. Ровно одно из них ложно. Найди его.',
          statements:[
            'ATK повышает физический урон героя.',
            'CMD — это количество солдат в отряде героя напрямую.',
            'DEF снижает получаемый физический урон.',
            'Редкость снаряжения повышает шанс получить бонусный набор характеристик, но не гарантирует урон выше, чем у более прокачанного предмета низкой редкости.',
            'Sanctuary хранит ресурсы и позволяет проводить исследования.'
          ],
          falseIndex:1,
          hints:[
            'Утверждение №4 выглядит подозрительно сложным и похожим на ложь — но это правда, это и есть ловушка.',
            'Ищи утверждение, которое приравнивает параметр к простому числу солдат.',
            'Ложно утверждение №2: CMD — не есть количество солдат напрямую.'
          ],
          reward:'Ω',
          lore:"Файл 071: отчёт с пятью утверждениями, одно из которых было изменено намеренно."
        }
      ],
      sideTasks:[
        {
          id:'b1_t1', afterIndex:2,
          title:'ЗАДАНИЕ: ПОЛЕВЫЕ РАБОТЫ',
          description:'Раскопать 3 клумбы в игре Last Asylum: Plague.'
        }
      ]
    },
    {
      id:'b2', order:2, title:'ПРОТОКОЛ ГЕРОЕВ', stars:3,
      intro:'Углублённые записи о характеристиках, классах и снаряжении. Здесь формулировки становятся откровенно двуличными.',
      finalCodeOrder:['C','M','D','2','T','R'],
      finalHints:[
        'Три из шести символов — это буквы. Собери их в осмысленное игровое сокращение.',
        "Сокращение — 'CMD'. Поставь эти буквы первыми, именно в этом порядке.",
        'После CMD добавь оставшиеся три символа в порядке их получения: 2, T, R.'
      ],
      puzzles:[
        {
          id:'b2_p1', type:'text', trap:true,
          title:'ФРАГМЕНТ 06 — ПАРАМЕТР БЕЗ ЛИЦА',
          fileTag:'FILE #104',
          question:'Какой параметр героя увеличивает размер армии выжившего, но сам никогда не равен числу солдат в этой армии?',
          accepted:['cmd','командование','command'],
          hints:[
            'Это трёхбуквенное сокращение, часто встречающееся рядом с ATK, HP и DEF.',
            'Оно определяет ЁМКОСТЬ армии, а не её текущий состав.',
            'Ответ: CMD.'
          ],
          reward:'C',
          lore:"Файл 104: спецификация параметров боевой единицы."
        },
        {
          id:'b2_p2', type:'text',
          title:'ФРАГМЕНТ 07 — ЛИШНИЙ ФАКТ',
          fileTag:'FILE #111',
          question:'1) Герой A превосходит героя B по эффективности в PvE.\n2) Герой B расположен выше героя C в списке избранных на экране героев.\n3) Герой C использует энергетический тип урона, а не физический.\n\nОдно из этих утверждений не описывает боевую характеристику, а лишь то, как расположены иконки в интерфейсе. Введи номер этого факта.',
          accepted:['2','два','второй'],
          hints:[
            'Ищи факт, который говорит не о силе героя в бою, а о том, как ты сам разместил его на экране.',
            "Список 'избранное' пользователь настраивает вручную — это не боевая механика.",
            'Лишний факт — номер 2.'
          ],
          reward:'2',
          lore:"Файл 111: три разрозненных наблюдения из полевого журнала."
        },
        {
          id:'b2_p3', type:'mc',
          title:'ФРАГМЕНТ 08 — НЕ ОТ РЕДКОСТИ',
          fileTag:'FILE #119',
          question:'Редкость экипировки задаёт стартовые характеристики предмета.\n\nЧто из перечисленного растёт НЕ за счёт редкости, а за счёт отдельного улучшения, доступного на предмете любой редкости?',
          options:['Базовый ATK предмета при получении','Уровень зачарования / улучшения (Enhancement Level)','Набор бонусов, присвоенный при создании предмета','Слот, в который экипируется предмет'],
          correctIndex:1,
          hints:[
            'Ищи вариант, который можно поднимать многократно уже ПОСЛЕ получения предмета.',
            "Первый вариант звучит логично из-за слова 'ATK', но слово 'базовый' означает, что оно фиксировано редкостью.",
            'Ответ: Уровень зачарования / улучшения (Enhancement Level).'
          ],
          reward:'M',
          lore:"Файл 119: сравнительная таблица снаряжения по редкости."
        },
        {
          id:'b2_p4', type:'text',
          title:'ФРАГМЕНТ 09 — СМЕЩЕНИЕ НА ДВА',
          fileTag:'FILE #124',
          question:'Шифр: CTVJWT\n\nКлюч сдвига — это символ, полученный в Фрагменте 07 (интерфейсный факт): цифра 2.\n\nСдвинь каждую букву шифра на 2 позиции НАЗАД по алфавиту и введи результат — это имя героя.',
          accepted:['arthur','артур'],
          hints:[
            'Ключ уже у тебя в архиве символов — это цифра 2.',
            'Сдвигай назад, а не вперёд — иначе получится бессмыслица.',
            'Результат — имя героя ARTHUR.'
          ],
          reward:'D',
          lore:"Файл 124: досье героя, частично зашифровано смещением."
        },
        {
          id:'b2_p5', type:'text',
          title:'ФРАГМЕНТ 10 — ДВОИЧНЫЙ СЛЕД',
          fileTag:'FILE #131',
          question:'Индикаторы заражения показывают последовательность:\n\n■ □ □ ■ ■\n\nПрочти её как двоичное число слева направо (■=1, □=0) и переведи в десятичное. Затем найди букву под этим номером в русском алфавите (а=1, б=2, …) и введи её.',
          accepted:['т','t'],
          hints:[
            '■ □ □ ■ ■ слева направо — это 1 0 0 1 1.',
            'В десятичной системе это число 19.',
            "19-я буква русского алфавита — 'Т'."
          ],
          reward:'T',
          lore:"Файл 131: скан индикаторной панели терминала заражения."
        },
        {
          id:'b2_p6', type:'text',
          title:'ФРАГМЕНТ 11 — СОЮЗНИК НА БУКВУ R',
          fileTag:'FILE #140',
          question:"В обгоревших страницах архива раз за разом всплывает пятибуквенное имя союзника, приближённого к Sanctuary, начинающееся на 'R' и часто соседствующее со словом 'Honor Hall'.\n\nВведи только первую букву этого имени.",
          accepted:['r','р'],
          hints:[
            "Это имя часто соседствует со словом 'Honor Hall'.",
            'Имя состоит из пяти букв и начинается на R.',
            "Первая буква — 'R' (от имени Raven)."
          ],
          reward:'R',
          lore:"Файл 140: обгоревшая страница со списком союзников."
        }
      ],
      sideTasks:[
        {
          id:'b2_t1', afterIndex:1,
          title:'ЗАДАНИЕ: ЗАЧИСТКА',
          description:'Уничтожить 10 скверн уровня 20–60 в игре Last Asylum: Plague.'
        },
        {
          id:'b2_t2', afterIndex:4,
          title:'ЗАДАНИЕ: РАЗВЕДКА',
          description:'Провести разведку 5 раз в игре Last Asylum: Plague.'
        }
      ]
    },
    {
      id:'b3', order:3, title:'ТЕНЬ В ЛАБОРАТОРИИ', stars:4,
      intro:'Ветка, целиком посвящённая герою Shadow. Формулировки здесь построены на двойных отрицаниях — читай внимательно каждое слово.',
      finalCodeOrder:['S','H','A','D','O','W'],
      finalHints:[
        'Не ищи сложную математику — прочти полученные символы просто в порядке их получения.',
        'Они складываются в слово.',
        'Это слово ты видел с самого начала этой ветки — имя героя.'
      ],
      puzzles:[
        {
          id:'b3_p1', type:'text', trap:true,
          title:'ФРАГМЕНТ 12 — НЕ ТАНК, НО ЖИВОЙ',
          fileTag:'FILE #201',
          question:'Шедоу не является героем поддержки и не бьёт одну цель в первую очередь. Он не классический танк, но выживает дольше многих танков в затяжном бою.\n\nЗа счёт какого типа урона по нескольким целям сразу он ослабляет весь строй противника одновременно?',
          accepted:['aoe','урон по площади','площадной урон'],
          hints:[
            'Ищи не причину выживания, а способ атаки.',
            "Это английское сокращение из трёх букв, означающее 'урон по области'.",
            'Ответ: AoE.'
          ],
          reward:'S',
          lore:"Файл 201: боевой отчёт с описанием манеры боя Шедоу."
        },
        {
          id:'b3_p2', type:'mc',
          title:'ФРАГМЕНТ 13 — СВЯЗКА С АРТУРОМ',
          fileTag:'FILE #207',
          question:'Шедоу и Артур часто ставятся в один отряд. Что именно делает эту связку опасной для противника — не «они сильные герои вместе», а конкретный игровой эффект?',
          options:['Оба героя занимают позицию в первой линии','Снижение DEF противника от Шедоу усиливает урон, который наносит Артур','У обоих героев одинаковый тип урона','Оба героя имеют одинаковую редкость'],
          correctIndex:1,
          hints:[
            'Ищи эффект, который влияет на числа урона другого героя, а не на построение отряда.',
            'Шедоу умеет снижать защиту противника своим навыком.',
            'Ответ: снижение DEF от Шедоу усиливает урон Артура.'
          ],
          reward:'H',
          lore:"Файл 207: тактическая карта совместных построений."
        },
        {
          id:'b3_p3', type:'order',
          title:'ФРАГМЕНТ 14 — ПРИОРИТЕТ ПРОКАЧКИ',
          fileTag:'FILE #212',
          question:'Опытные командиры прокачивают Шедоу в особом порядке, отличном от обычного героя. Расставь шаги в порядке приоритета для героя с AoE и снижением DEF.',
          items:['Повышение звёзд (Rarity Up)','Открыть ключевой навык снижения DEF','Пробуждение (Awakening)','Повышение уровня героя'],
          correctOrder:['Открыть ключевой навык снижения DEF','Повышение уровня героя','Повышение звёзд (Rarity Up)','Пробуждение (Awakening)'],
          hints:[
            'Начни с того, что усиливает всю команду, а не только самого Шедоу.',
            'Навык снижения DEF ценнее общего роста уровня в самом начале.',
            'Порядок: навык DEF → уровень → звёзды → пробуждение.'
          ],
          reward:'A',
          lore:"Файл 212: рекомендации ветерана-командира."
        },
        {
          id:'b3_p4', type:'text',
          title:'ФРАГМЕНТ 15 — ОДИН ЛИШНИЙ ФАКТ',
          fileTag:'FILE #218',
          question:'1) Шедоу снижает DEF противника при попадании AoE-навыком.\n2) Марлена лечит союзника с наименьшим % HP.\n3) Значок Шедоу на экране команды подсвечивается золотой рамкой, если он выбран лидером отряда.\n\nОдин факт не относится к боевому взаимодействию Шедоу и Марлены. Введи его номер.',
          accepted:['3','три','третий'],
          hints:[
            'Ищи факт про интерфейс, а не про механику боя.',
            'Золотая рамка лидера — это визуальный индикатор, а не боевой эффект.',
            'Лишний факт — номер 3.'
          ],
          reward:'D',
          lore:"Файл 218: наблюдения за синергией отряда."
        },
        {
          id:'b3_p5', type:'text',
          title:'ФРАГМЕНТ 16 — СТАРЫЙ КЛЮЧ',
          fileTag:'FILE #225',
          question:'Шифр: CDKOP\n\nКлюч сдвига — число, которое ты получил ещё в Ветке I как один из первых фрагментов архива (символ «4»).\n\nНа этот раз сдвинь буквы шифра ВПЕРЁД на это число позиций и введи результат.',
          accepted:['ghost','призрак'],
          hints:[
            'Вспомни архив символов Ветки I — там есть цифра 4.',
            'На этот раз сдвигай буквы вперёд, а не назад — направление сменилось.',
            'Результат — английское слово GHOST.'
          ],
          reward:'O',
          lore:"Файл 225: старый шифр, использующий ключ из прошлой ветки."
        },
        {
          id:'b3_p6', type:'text',
          title:'ФРАГМЕНТ 17 — ИМЯ, КОТОРОЕ НЕ ПРОИЗНОСЯТ',
          fileTag:'FILE #230',
          question:'В самом повреждённом файле архива есть только одно целое слово, повторённое семь раз без объяснения. Это имя героя, которому посвящена вся эта ветка.\n\nНазови его.',
          accepted:['shadow','шедоу','тень'],
          hints:[
            'Не усложняй — ответ уже есть в заголовке этой ветки.',
            'Это имя героя, а не название механики.',
            'Ответ: SHADOW.'
          ],
          reward:'W',
          lore:"Файл 230: последняя уцелевшая страница ветки."
        }
      ],
      sideTasks:[
        {
          id:'b3_t1', afterIndex:3,
          title:'ЗАДАНИЕ: ЭКСПЕДИЦИЯ',
          description:'Сходить на раскопки корабля в игре Last Asylum: Plague.'
        }
      ]
    }
  ],
  achievements:[
    {id:'FIRST_STEPS', title:'ПЕРВЫЕ ШАГИ', desc:'Решить первую загадку архива.'},
    {id:'NO_MISTAKES', title:'БЕЗ ОШИБОК', desc:'Пройти ветку без единой ошибки.'},
    {id:'FALSE_TRAIL', title:'ЛОЖНЫЙ СЛЕД', desc:'Выбрать отвлекающий вариант ответа.'},
    {id:'WRONG_QUESTION', title:'НЕ ТОТ ВОПРОС', desc:'Решить загадку с намеренно вводящей в заблуждение формулировкой.'},
    {id:'ARCHIVIST', title:'АРХИВАРИУС', desc:'Собрать все известные символы архива.'},
    {id:'PARANOID', title:'ПАРАНОИК', desc:'Пройти всё расследование, использовав минимум подсказок.'},
    {id:'NOT_TRUST_EYES', title:'НЕ ДОВЕРЯЙ ГЛАЗАМ', desc:'Найти скрытую деталь там, где её не искали.'},
    {id:'COMPLETIONIST', title:'РАССЛЕДОВАНИЕ ЗАВЕРШЕНО', desc:'Пройти все известные ветки архива.'},
    {id:'LEVEL_5', title:'РАСТУЩАЯ УГРОЗА', desc:'Достичь 5 уровня.'},
    {id:'ALLY', title:'СОЮЗНИК', desc:'Указать тег альянса.'},
    {id:'SOCIAL', title:'НЕ ОДИН', desc:'Добавить первого друга в список.'},
    {id:'CHATTY', title:'НА СВЯЗИ', desc:'Отправить первое сообщение в мировом чате.'},
    {id:'NIGHT_OWL', title:'НОЧНОЙ ДОЗОР', desc:'Решить загадку глубокой ночью (00:00–05:00).'},
    {id:'BRAGGART', title:'ХВАСТУН', desc:'Поделиться достижением в мировом чате.'},
    {id:'FIRST_PVP_WIN', title:'ПЕРВАЯ КРОВЬ', desc:'Одержать первую победу в PvP.'}
  ]
};

const TOTAL_PUZZLES = DATA.branches.reduce((n,b)=>n+b.puzzles.length,0);

/* ---------------- SECRET ROLE SYSTEM (visual only, no player interaction yet) ---------------- */
const ROLES = {
  INFECTED: {
    id:'INFECTED', name:'ЗАРАЖЁННЫЙ', color:'var(--accent)',
    tagline:'Ты — один из многих. Твоя задача проста: пройти протокол архива и не привлекать лишнего внимания.',
    desc:'Стандартная роль выжившего. Ты выполняешь обычное расследование — читаешь архив, решаешь загадки, собираешь символы. Ничего необычного. Или почти ничего.',
    tasks:[
      {id:'inf_1', text:'Реши любые 3 фрагмента без единой ошибки.'},
      {id:'inf_2', text:'Собери все символы одной ветки полностью.'},
      {id:'inf_3', text:'Пройди ветку, использовав не более 1 подсказки.'},
      {id:'inf_4', text:'Заверши FINAL PROTOCOL любой ветки с первой попытки.'},
      {id:'inf_5', text:'Открой Архив Символов и изучи все найденные фрагменты.'}
    ]
  },
  INVESTIGATOR: {
    id:'INVESTIGATOR', name:'СЛЕДОВАТЕЛЬ', color:'#4ac8ff',
    tagline:'Тебе поручено особое задание: в архиве действует кто-то, кто намеренно портит данные. Найди его следы.',
    desc:'Ты выявляешь несоответствия, которые не мог оставить обычный заражённый. Твоя работа тише и внимательнее — ты ищешь то, что не должно было существовать в системе.',
    tasks:[
      {id:'inv_1', text:'Найди в архиве утверждение, которое выглядит правдой, но является ловушкой.'},
      {id:'inv_2', text:'Зафиксируй 3 формулировки, намеренно вводящие в заблуждение.'},
      {id:'inv_3', text:'Пройди ветку, ни разу не выбрав очевидный, но неверный ответ.'},
      {id:'inv_4', text:'Составь для себя список из 3 подозрительных несостыковок в лором.'},
      {id:'inv_5', text:'Заверши расследование, не показав признаков паники (0 использованных подсказок в одной ветке).'}
    ]
  },
  SABOTEUR: {
    id:'SABOTEUR', name:'ВРЕДИТЕЛЬ', color:'var(--danger)',
    tagline:'Ты не такой, как остальные. Твоя цель — замедлить расследование заражённых, оставаясь незамеченным.',
    desc:'Формально ты проходишь тот же архив. Но у тебя есть скрытые мотивы — вносить сомнения, тратить чужое время, путать следы. Твои задания не мешают тебе лично закрывать ветки.',
    tasks:[
      {id:'sab_1', text:'Хотя бы раз намеренно введи неверный ответ перед тем, как ответить верно.'},
      {id:'sab_2', text:'Пройди целую ветку, ни разу не воспользовавшись ANALYSIS TOKEN.'},
      {id:'sab_3', text:'Заверши FINAL PROTOCOL не с первой попытки — сначала собери заведомо неверную последовательность.'},
      {id:'sab_4', text:'Не открывай Архив Символов, пока не закроешь текущую ветку полностью.'},
      {id:'sab_5', text:'Заверши ветку так, будто не знал(а) ни одной подсказки заранее.'}
    ]
  }
};
const ROLE_WEIGHTS = [ ['INFECTED',70], ['INVESTIGATOR',15], ['SABOTEUR',15] ];
function pickRole(){
  const total = ROLE_WEIGHTS.reduce((s,r)=>s+r[1],0);
  let r = Math.random()*total;
  for(const [id,w] of ROLE_WEIGHTS){ if(r<w) return id; r -= w; }
  return 'INFECTED';
}

const RANKS = [
  {min:0, name:'NOVICE'},
  {min:1, name:'SCAVENGER'},
  {min:5, name:'ANALYST'},
  {min:9, name:'ARCHIVIST'},
  {min:13, name:'PLAGUE HUNTER'},
  {min:TOTAL_PUZZLES, name:'BLACK PROTOCOL'}
];
const TOKENS_PER_BRANCH = 6;

/* XP / Level progression */
const PUZZLE_XP = {1:10, 2:15, 3:20};       // xp per solved puzzle, keyed by branch.order
const FINAL_XP = {1:30, 2:60, 3:90};        // bonus xp per completed branch final protocol
const LEVEL_THRESHOLDS = [0,30,70,120,180,250,330,420,520,630,750,880,1020,1170,1330,1500];
function levelInfo(xp){
  xp = xp||0;
  let lvl = 1;
  for(let i=1;i<LEVEL_THRESHOLDS.length;i++){ if(xp>=LEVEL_THRESHOLDS[i]) lvl = i+1; else break; }
  const idx = lvl-1;
  const cur = LEVEL_THRESHOLDS[idx];
  const next = LEVEL_THRESHOLDS[idx+1]!==undefined ? LEVEL_THRESHOLDS[idx+1] : cur+300;
  const pct = Math.min(100, Math.max(0, Math.round(((xp-cur)/(next-cur))*100)));
  return {level:lvl, xp:xp, cur:cur, next:next, pct:pct};
}
function checkLevelAchievements(level){
  if(level>=5 && !state.achievements.LEVEL_5){
    state.achievements.LEVEL_5 = true; toast('ДОСТИЖЕНИЕ: РАСТУЩАЯ УГРОЗА');
  }
}

/* ================= HERO / PvP SYSTEM ================= */
const HEROES = [
  {
    id:'craig', name:'КРЕЙГ', role:'ШТУРМОВИК', rarity:'ЭПИЧЕСКИЙ', starter:true,
    base:{hp:850, atk:180, def:70, spd:98, critChance:15, critDamage:150, accuracy:92, penetration:8, evasion:5, resist:5},
    ability:{name:'ЯРОСТЬ', desc:'Наносит 150% урона от атаки. Если здоровье противника ниже 40%, урон увеличивается ещё на 30%.', cooldown:3},
    talents:[
      {id:'adrenaline', name:'БОЕВОЙ АДРЕНАЛИН', desc:'При здоровье ниже 40% наносит на {v}% больше урона.', kind:'lowHpDamage', threshold:0.4, base:15, step:2},
      {id:'veteran', name:'ОПЫТНЫЙ БОЕЦ', desc:'+{v}% критического шанса.', kind:'statBoost', stat:'critChance', base:5, step:1},
      {id:'lastchance', name:'ПОСЛЕДНИЙ ШАНС', desc:'При здоровье ниже 20% следующая атака получает +{v}% урона.', kind:'criticalLowHpDamage', threshold:0.2, base:25, step:3}
    ]
  },
  {
    id:'leon', name:'ЛЕОН', role:'ТАНК', rarity:'ЭПИЧЕСКИЙ', starter:false,
    base:{hp:1400, atk:90, def:150, spd:85, critChance:10, critDamage:130, accuracy:88, penetration:4, evasion:3, resist:15},
    ability:{name:'БРОНЯ', desc:'Получает щит на 2 хода, поглощающий 35% следующего входящего урона.', cooldown:4},
    talents:[
      {id:'steelbody', name:'СТАЛЬНОЙ КОРПУС', desc:'+{v}% максимального здоровья.', kind:'statBoost', stat:'hpPct', base:10, step:2},
      {id:'unshakable', name:'НЕПОКОЛЕБИМЫЙ', desc:'−{v}% урона от критических атак противника.', kind:'critDamageTakenReduction', base:10, step:2},
      {id:'lastline', name:'ПОСЛЕДНИЙ РУБЕЖ', desc:'При здоровье ниже 30% получает +{v}% защиты.', kind:'lowHpDefense', threshold:0.3, base:20, step:3}
    ]
  },
  {
    id:'sofia', name:'СОФИЯ', role:'ПОДДЕРЖКА', rarity:'РЕДКИЙ', starter:false,
    base:{hp:950, atk:110, def:90, spd:100, critChance:12, critDamage:140, accuracy:90, penetration:5, evasion:8, resist:10},
    ability:{name:'СТИМУЛЯТОР', desc:'Восстанавливает 20% максимального здоровья и увеличивает скорость на 15% на 2 хода.', cooldown:4},
    talents:[
      {id:'medic', name:'МЕДИК', desc:'Эффективность лечения увеличена на {v}%.', kind:'healBoost', base:10, step:2},
      {id:'stimulant', name:'СТИМУЛЯТОР II', desc:'После использования способности получает дополнительно +{v}% скорости на 1 ход.', kind:'postAbilitySpeed', base:10, step:2},
      {id:'endurance', name:'ВЫНОСЛИВОСТЬ', desc:'+{v}% максимального здоровья.', kind:'statBoost', stat:'hpPct', base:8, step:2}
    ]
  },
  {
    id:'mark', name:'МАРК', role:'УБИЙЦА', rarity:'ЭПИЧЕСКИЙ', starter:false,
    base:{hp:700, atk:200, def:60, spd:115, critChance:28, critDamage:170, accuracy:95, penetration:12, evasion:12, resist:4},
    ability:{name:'ТОЧНЫЙ ВЫСТРЕЛ', desc:'Следующая атака получает +50% критического урона. При критическом попадании дополнительно наносит 10% максимального здоровья противника.', cooldown:3},
    talents:[
      {id:'hunter', name:'ОХОТНИК', desc:'+{v}% критического шанса против врага с менее чем 50% HP.', kind:'lowHpEnemyCrit', base:10, step:2},
      {id:'deadlyaccuracy', name:'СМЕРТЕЛЬНАЯ ТОЧНОСТЬ', desc:'Критические атаки наносят +{v}% урона.', kind:'critDamageBoost', base:10, step:2},
      {id:'reflexes', name:'РЕФЛЕКСЫ', desc:'+{v}% уклонения.', kind:'statBoost', stat:'evasion', base:8, step:2}
    ]
  }
];
const TALENT_MAX_LEVEL = 5;
function talentCost(level){ return 20 + level*10; } // paid from that hero's own "parts" pool
function talentValue(t, level){ return level<=0 ? 0 : t.base + (level-1)*t.step; }
const COUNTER_PAIRS = [
  {a:'ШТУРМОВИК', b:'УБИЙЦА', effect:'atk_dmg', value:0.15, label:'+15% урона атакующего'},
  {a:'УБИЙЦА', b:'ПОДДЕРЖКА', effect:'crit_dmg', value:0.15, label:'+15% критического урона'},
  {a:'ПОДДЕРЖКА', b:'ТАНК', effect:'heal_effect', value:0.15, label:'+15% эффективности лечения'},
  {a:'ТАНК', b:'ШТУРМОВИК', effect:'dmg_reduction', value:0.15, label:'−15% получаемого урона'}
];
function getCounterInfo(myRole, enemyRole){
  const asA = COUNTER_PAIRS.find(p=>p.a===myRole && p.b===enemyRole);
  if(asA) return {status:'advantage', pair:asA};
  const asB = COUNTER_PAIRS.find(p=>p.a===enemyRole && p.b===myRole);
  if(asB) return {status:'disadvantage', pair:asB};
  return {status:'neutral', pair:null};
}
const HERO_MAX_LEVEL = 60;
const HERO_MAX_STAR = 10;
const GEAR_SLOTS = ['weapon','gloves','vest','pants'];
const GEAR_MAX_LEVEL = 20;
const GEAR_NAMES = {weapon:'ОРУЖИЕ', gloves:'ПЕРЧАТКИ', vest:'ЖИЛЕТ', pants:'ШТАНЫ'};
const UNLOCK_PARTS_REQUIRED = 100;
const STAR_PUZZLES_REQUIRED = 20;
const PVP_TIERS = [
  {min:0, name:'БРОНЗА'}, {min:1000, name:'СЕРЕБРО'}, {min:1200, name:'ЗОЛОТО'},
  {min:1450, name:'ПЛАТИНА'}, {min:1700, name:'АЛМАЗ'}, {min:2000, name:'МАСТЕР'}
];
function pvpTierName(rating){
  let t = PVP_TIERS[0];
  for(const tier of PVP_TIERS){ if(rating>=tier.min) t = tier; }
  return t.name;
}

/* ---- Daily PvP missions ---- */
const DAILY_MISSION_POOL = [
  {id:'fights3', desc:'Провести 3 PvP-боя', target:3, track:'fights', reward:{credits:200, parts:15, yellowPuzzles:5}, rewardLabel:'+200 кредитов · +15 деталей герою · +5 жёлтых пазлов'},
  {id:'wins2', desc:'Победить в 2 PvP-боях', target:2, track:'wins', reward:{pvpRating:50, parts:20, yellowPuzzles:10}, rewardLabel:'+50 PvP-очков · +20 деталей герою · +10 жёлтых пазлов'},
  {id:'dmg50k', desc:'Нанести 50 000 урона', target:50000, track:'damage', reward:{credits:400, universalMats:15}, rewardLabel:'+400 кредитов · +15 универсальных материалов'},
  {id:'abilities10', desc:'Использовать способности 10 раз', target:10, track:'abilities', reward:{credits:250, weaponMats:10, armorMats:10}, rewardLabel:'+250 кредитов · +10 материалов оружия · +10 материалов брони'},
  {id:'winstreak3', desc:'Победить 3 раза подряд', target:3, track:'winstreak', reward:{pvpRating:75, parts:25}, rewardLabel:'+75 PvP-очков · +25 деталей герою'},
  {id:'win1', desc:'Одержать 1 победу в PvP', target:1, track:'wins', reward:{credits:150, yellowPuzzles:5}, rewardLabel:'+150 кредитов · +5 жёлтых пазлов'}
];
function pickDailyMissions(dateKey){
  // Deterministic pick so the same day always shows the same 4 missions until refresh.
  let seed = 0;
  for(let i=0;i<dateKey.length;i++){ seed = (seed*31 + dateKey.charCodeAt(i)) >>> 0; }
  const pool = DAILY_MISSION_POOL.slice();
  const picked = [];
  const count = Math.min(4, pool.length);
  for(let i=0;i<count;i++){
    seed = (seed*1103515245 + 12345) >>> 0;
    const idx = seed % pool.length;
    picked.push(pool.splice(idx,1)[0]);
  }
  return picked.map(m=>({id:m.id, progress:0, claimed:false}));
}

/* ---- Hero development mission chains ---- */
function heroDevMissions(heroId){
  const def = findHeroDef(heroId);
  return [
    {idx:0, desc:'Получить '+def.name+'.', check:()=> heroState(heroId).owned, reward:{parts:20}, rewardLabel:'+20 деталей'},
    {idx:1, desc:'Повысить '+def.name+' до 5 уровня.', check:()=> heroState(heroId).owned && heroState(heroId).level>=5, reward:{yellowPuzzles:15}, rewardLabel:'+15 жёлтых пазлов'},
    {idx:2, desc:'Экипировать оружие.', check:()=> heroState(heroId).owned && heroState(heroId).gear.weapon.level>=1, reward:{parts:15}, rewardLabel:'+15 деталей'},
    {idx:3, desc:'Повысить '+def.name+' до 10 уровня.', check:()=> heroState(heroId).owned && heroState(heroId).level>=10, reward:{weaponMats:30, armorMats:30}, rewardLabel:'+30 материалов оружия · +30 материалов брони'},
    {idx:4, desc:'Получить 2 жёлтые звезды.', check:()=> heroState(heroId).owned && heroState(heroId).yellowStars>=2, reward:{parts:20}, rewardLabel:'+20 деталей'},
    {idx:5, desc:'Победить '+def.name+' в 3 PvP-боях.', check:()=> heroState(heroId).owned && heroState(heroId).pvpWins>=3, reward:{universalMats:40}, rewardLabel:'+40 универсальных материалов'},
    {idx:6, desc:'Повысить '+def.name+' до 20 уровня.', check:()=> heroState(heroId).owned && heroState(heroId).level>=20, reward:{yellowPuzzles:20, parts:20}, rewardLabel:'+20 жёлтых пазлов · +20 деталей'}
  ];
}
const HERO_FULLY_DEVELOPED_BONUS = {credits:2000, universalMats:60};

function getDailyMissions(){
  const today = mskDateKey(Date.now());
  if(!state.pvpDaily || state.pvpDaily.date !== today){
    state.pvpDaily = { date: today, missions: pickDailyMissions(today) };
    saveState();
  }
  return state.pvpDaily.missions;
}
function trackDailyProgress(track, amount){
  const missions = getDailyMissions();
  let changed = false;
  missions.forEach(m=>{
    const tpl = DAILY_MISSION_POOL.find(t=>t.id===m.id);
    if(!tpl || tpl.track!==track || m.claimed) return;
    if(track==='winstreak'){ m.progress = Math.max(m.progress, amount); }
    else { m.progress = Math.min(tpl.target, m.progress + amount); }
    changed = true;
  });
  if(changed) saveState();
}
function claimDailyMission(missionId){
  const missions = getDailyMissions();
  const m = missions.find(x=>x.id===missionId);
  const tpl = DAILY_MISSION_POOL.find(t=>t.id===missionId);
  if(!m || !tpl || m.claimed || m.progress<tpl.target) return false;
  m.claimed = true;
  if(tpl.reward.pvpRating){ state.pvpStats.rating += tpl.reward.pvpRating; }
  grantHeroReward({
    credits: tpl.reward.credits||0, weaponMats: tpl.reward.weaponMats||0, armorMats: tpl.reward.armorMats||0,
    universalMats: tpl.reward.universalMats||0, parts: tpl.reward.parts||0,
    puzzles: tpl.reward.yellowPuzzles||0, toOwnedHero: !!tpl.reward.yellowPuzzles
  });
  saveState();
  return true;
}


/* ---- Resource sources ("где получить") ---- */
const RESOURCE_SOURCES = {
  credits: ['Задания из игры (скриншот)', 'Завершение веток архива', 'Победы в PvP', 'Ежедневные PvP-задания', 'Задания роли'],
  weaponMats: ['Задания из игры (скриншот)', 'Завершение веток архива', 'Награды за победы в PvP'],
  armorMats: ['Задания из игры (скриншот)', 'Завершение веток архива', 'Награды за победы в PvP'],
  universalMats: ['Завершение веток архива', 'Ежедневные PvP-задания', 'Миссии развития героя'],
  parts: ['Завершение веток архива (для следующего героя)', 'Ежедневные PvP-задания', 'Миссии развития героя'],
  yellowPuzzles: ['Задания из игры (скриншот)', 'Завершение веток архива', 'Ежедневные PvP-задания'],
  redPuzzles: ['Продвинутые PvP-задания (после 5 жёлтых звёзд)', 'События'],
  pvpRating: ['Победы в PvP-боях', 'Ежедневные PvP-задания']
};
function findHeroDef(id){ return HEROES.find(h=>h.id===id); }
function heroState(id){ return state.heroes[id]; }
function gearBonus(slot, level){
  // Flat bonuses per gear level, per spec's stat groupings for each slot.
  if(level<=0) return {};
  switch(slot){
    case 'weapon': return {atk: level*8, critChance: level*0.3, penetration: level*0.4};
    case 'gloves': return {accuracy: level*0.3, critChance: level*0.2, spd: level*0.5};
    case 'vest':   return {hp: level*15, def: level*4, resist: level*0.3};
    case 'pants':  return {hp: level*15, def: level*4, evasion: level*0.3};
    default: return {};
  }
}
function computeHeroStats(heroId){
  const def = findHeroDef(heroId);
  const hs = heroState(heroId);
  if(!def || !hs) return null;
  const levelMult = 1 + (hs.level-1)*0.035;
  const starMult = 1 + (hs.yellowStars + hs.redStars)*0.08;
  const stats = {};
  ['hp','atk','def','spd','critChance','critDamage','accuracy','penetration','evasion','resist'].forEach(k=>{
    stats[k] = def.base[k] * levelMult * starMult;
  });
  GEAR_SLOTS.forEach(slot=>{
    const g = hs.gear[slot];
    const bonus = gearBonus(slot, g.level);
    Object.keys(bonus).forEach(k=>{ stats[k] = (stats[k]||0) + bonus[k]; });
  });
  // Static (always-on) passive talent bonuses. Conditional talents (low-HP triggers,
  // post-ability effects, counter-class interactions) are applied live inside the battle engine.
  (def.talents||[]).forEach(t=>{
    if(t.kind!=='statBoost') return;
    const lvl = (hs.talents && hs.talents[t.id]) || 0;
    if(lvl<=0) return;
    const v = talentValue(t, lvl);
    if(t.stat==='hpPct'){ stats.hp = stats.hp * (1+v/100); }
    else { stats[t.stat] = (stats[t.stat]||0) + v; }
  });
  stats.critChance = Math.min(100, stats.critChance);
  stats.accuracy = Math.min(100, stats.accuracy);
  stats.evasion = Math.min(90, stats.evasion);
  stats.resist = Math.min(90, stats.resist);
  stats.penetration = Math.min(100, stats.penetration);
  stats.critDamage = Math.min(500, stats.critDamage);
  Object.keys(stats).forEach(k=>{ stats[k] = Math.round(stats[k]*100)/100; });
  stats.hp = Math.round(stats.hp);
  stats.atk = Math.round(stats.atk);
  stats.def = Math.round(stats.def);
  stats.spd = Math.round(stats.spd);
  return stats;
}
function previewHeroStats(heroId, mutateFn){
  const hs = heroState(heroId);
  const backup = JSON.parse(JSON.stringify(hs));
  mutateFn(hs);
  const stats = computeHeroStats(heroId);
  Object.assign(hs, backup);
  return stats;
}
function powerFromStats(s){
  return Math.round(s.hp*0.4 + s.atk*6 + s.def*5 + s.spd*10
    + s.critChance*15 + Math.max(0,(s.critDamage-100))*3
    + s.accuracy*5 + s.penetration*10 + s.evasion*8 + s.resist*8);
}
function computeHeroPower(heroId){
  const s = computeHeroStats(heroId);
  return s ? powerFromStats(s) : 0;
}
const BOT_NAMES = ['VALENTIN','KIRA','NOMAD','ASH','ROOK','VESNA','GRIM','TALON','ORCA','LYRA','DRIFT','SABLE','HAZE','RUIN','FENN'];
function generateBotOpponent(playerPower){
  const def = HEROES[Math.floor(Math.random()*HEROES.length)];
  const variance = 0.85 + Math.random()*0.3;
  const targetPower = Math.max(400, Math.round(playerPower*variance));
  const basePower = powerFromStats(def.base);
  const scale = targetPower/basePower;
  const stats = {};
  Object.keys(def.base).forEach(k=>{ stats[k] = def.base[k]*scale; });
  stats.critChance = Math.min(100, stats.critChance);
  stats.accuracy = Math.min(100, stats.accuracy);
  stats.evasion = Math.min(90, stats.evasion);
  stats.resist = Math.min(90, stats.resist);
  stats.critDamage = Math.min(500, stats.critDamage);
  stats.penetration = Math.min(100, stats.penetration);
  Object.keys(stats).forEach(k=>{ stats[k] = Math.round(stats[k]); });
  return {
    id: 'bot_'+Date.now()+'_'+Math.floor(Math.random()*1000),
    name: BOT_NAMES[Math.floor(Math.random()*BOT_NAMES.length)],
    heroDefId: def.id, heroName: def.name, role: def.role,
    stats, power: powerFromStats(stats), ability: def.ability
  };
}
function levelUpCost(level){ return Math.round(100 * level * (1 + level*0.05)); }
function gearUpgradeCost(slot, level){
  const mat = slot==='weapon' ? 'weaponMats' : 'armorMats';
  return { [mat]: 50*(level+1), universalMats: 10*(level+1) };
}
function initHeroSystem(){
  if(state.heroesInit) return;
  state.warehouse = { credits:50000, weaponMats:600, armorMats:600, universalMats:400 };
  state.heroes = {};
  HEROES.forEach(def=>{
    const talents = {};
    (def.talents||[]).forEach(t=>{ talents[t.id] = 0; });
    state.heroes[def.id] = {
      owned: !!def.starter,
      level: def.starter ? 1 : 0,
      yellowStars: def.starter ? 1 : 0,
      redStars: 0,
      parts: def.starter ? UNLOCK_PARTS_REQUIRED : 25,
      yellowPuzzles: def.starter ? 60 : 0,
      redPuzzles: 0,
      gear: { weapon:{level:0}, gloves:{level:0}, vest:{level:0}, pants:{level:0} },
      talents,
      pvpWins: 0,
      devMissionsDone: {},
      devMissionsClaimed: {},
      fullyDevelopedClaimed: false
    };
  });
  state.heroesInit = true;
  saveState();
}
function ensureHeroFields(){
  // Safety net for saves created before talents/dev-missions/pvpWins existed.
  if(!state.heroesInit) return;
  HEROES.forEach(def=>{
    const hs = state.heroes[def.id];
    if(!hs) return;
    if(!hs.talents){ hs.talents = {}; (def.talents||[]).forEach(t=>{ hs.talents[t.id] = 0; }); }
    else { (def.talents||[]).forEach(t=>{ if(hs.talents[t.id]===undefined) hs.talents[t.id]=0; }); }
    if(hs.pvpWins===undefined) hs.pvpWins = 0;
    if(!hs.devMissionsDone) hs.devMissionsDone = {};
    if(!hs.devMissionsClaimed) hs.devMissionsClaimed = {};
    if(hs.fullyDevelopedClaimed===undefined) hs.fullyDevelopedClaimed = false;
  });
}
function firstLockedHeroId(){
  const h = HEROES.find(def=>!state.heroes[def.id].owned);
  return h ? h.id : null;
}
function grantHeroReward({credits=0, weaponMats=0, armorMats=0, universalMats=0, parts=0, puzzles=0, toOwnedHero=false} = {}){
  if(!state.heroesInit) initHeroSystem();
  const w = state.warehouse;
  w.credits += credits; w.weaponMats += weaponMats; w.armorMats += armorMats; w.universalMats += universalMats;
  if(parts>0){
    const targetId = firstLockedHeroId();
    if(targetId){ state.heroes[targetId].parts = Math.min(UNLOCK_PARTS_REQUIRED, state.heroes[targetId].parts + parts); }
  }
  if(puzzles>0 && toOwnedHero){
    const ownedIds = HEROES.filter(d=>state.heroes[d.id].owned).map(d=>d.id);
    if(ownedIds.length){
      const pick = ownedIds[Math.floor(Math.random()*ownedIds.length)];
      const hs = state.heroes[pick];
      if(hs.yellowStars<5) hs.yellowPuzzles += puzzles; else hs.redPuzzles += puzzles;
    }
  }
  saveState();
}


/* ---------------- STATE ---------------- */
const SAVE_KEY = 'lastAsylum_save_v1';
let state = null;

function defaultState(){
  const branches = {};
  DATA.branches.forEach((b,i)=>{
    branches[b.id] = { unlocked: i===0, completed:false, mistakes:0, hintsLeft: TOKENS_PER_BRANCH, unlockAt:null };
  });
  return {
    registered:false, server:'', name:'', avatar:null, allianceTag:'',
    branches, solvedPuzzles:{}, symbols:[], hintsUsedByPuzzle:{},
    achievements:{}, totalMistakes:0, totalHintsUsed:0, xp:0,
    startTime:null, soundOn:false, eggClicks:0, eggFound:false,
    role:null, roleTasksDone:{}, sideTasksDone:{},
    pvpStats:{wins:0, losses:0, rating:1000},
    pvpSearch:{date:null, used:0},
    friends:[], chatMessages:[],
    heroesInit:false, heroes:{}, warehouse:{credits:0, weaponMats:0, armorMats:0, universalMats:0},
    pvpDaily:{date:null, missions:[]},
    pvpHistory:[],
    pvpWinStreak:0,
    heroFullyDevelopedClaimed:{}
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw){ state = Object.assign(defaultState(), JSON.parse(raw)); }
    else{ state = defaultState(); }
  }catch(e){ state = defaultState(); }
}
function saveState(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }catch(e){}
}

/* ---------------- AUDIO (tiny synth beeps, no assets) ---------------- */
const Audio_ = {
  ctx:null,
  ensure(){ if(!this.ctx){ try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } },
  beep(freq, dur, type){
    if(!state.soundOn) return;
    this.ensure();
    if(!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type||'sine'; o.frequency.value = freq;
    g.gain.value = 0.05;
    o.connect(g); g.connect(this.ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    o.stop(this.ctx.currentTime + dur);
  },
  ok(){ this.beep(660,.12,'sine'); setTimeout(()=>this.beep(880,.15,'sine'),90); },
  bad(){ this.beep(140,.25,'sawtooth'); },
  tap(){ this.beep(340,.04,'square'); },
  unlock(){ this.beep(220,.1); setTimeout(()=>this.beep(440,.1),100); setTimeout(()=>this.beep(880,.2),200); }
};

/* ---------------- HELPERS ---------------- */
function normalize(s){
  return (s||'').toString().toLowerCase().trim().replace(/ё/g,'е').replace(/\s+/g,' ').replace(/[.,!?;:]/g,'');
}
function findBranch(id){ return DATA.branches.find(b=>b.id===id); }
function findPuzzle(id){
  for(const b of DATA.branches){ const p = b.puzzles.find(p=>p.id===id); if(p) return {puzzle:p, branch:b}; }
  return null;
}
function findSideTask(id){
  for(const b of DATA.branches){
    const t = (b.sideTasks||[]).find(t=>t.id===id);
    if(t) return {task:t, branch:b};
  }
  return null;
}
const SIDE_TASK_XP = 15;
function getBranchSequence(b){
  // Interleaves main puzzles with in-game screenshot tasks in display/navigation order.
  const seq = [];
  b.puzzles.forEach((p, i)=>{
    seq.push({type:'puzzle', id:p.id});
    (b.sideTasks||[]).filter(t=>t.afterIndex===i).forEach(t=> seq.push({type:'task', id:t.id}));
  });
  return seq;
}
function branchPuzzleCount(b){ return b.puzzles.length; }
function branchSolvedCount(b){ return b.puzzles.filter(p=>state.solvedPuzzles[p.id]).length; }
function totalSolvedCount(){ return Object.keys(state.solvedPuzzles).length; }
function currentRank(){
  const n = totalSolvedCount();
  let r = RANKS[0];
  for(const rk of RANKS){ if(n>=rk.min) r = rk; }
  return r.name;
}
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._tm);
  toast._tm = setTimeout(()=>t.classList.remove('show'), 2600);
}
function glitchFlash(){
  const g = document.getElementById('glitch-flash');
  g.classList.remove('play'); void g.offsetWidth; g.classList.add('play');
}
function fmtTime(ms){
  const mins = Math.floor(ms/60000);
  if(mins<60) return mins+'м';
  const h = Math.floor(mins/60), m = mins%60;
  return h+'ч '+m+'м';
}

/* ---------------- MSK SCHEDULED UNLOCK (05:00 MSK next day) ---------------- */
const MSK_OFFSET_MS = 3*3600*1000; // Moscow is fixed UTC+3, no DST
function nextUnlockTimestamp(fromMs){
  const mskShifted = fromMs + MSK_OFFSET_MS;
  const d = new Date(mskShifted);
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  const targetMskWallMs = Date.UTC(y, m, day+1, 5, 0, 0, 0);
  return targetMskWallMs - MSK_OFFSET_MS;
}
function formatMsk(ts){
  const d = new Date(ts + MSK_OFFSET_MS);
  const pad = n => String(n).padStart(2,'0');
  return pad(d.getUTCDate())+'.'+pad(d.getUTCMonth()+1)+' '+pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())+' MSK';
}
function mskDateKey(ts){
  const d = new Date(ts + MSK_OFFSET_MS);
  return d.getUTCFullYear()+'-'+(d.getUTCMonth()+1)+'-'+d.getUTCDate();
}
function checkUnlocks(){
  let changed = false;
  DATA.branches.forEach(b=>{
    const bs = state.branches[b.id];
    if(!bs.unlocked && bs.unlockAt && Date.now() >= bs.unlockAt){
      bs.unlocked = true;
      bs.unlockAt = null;
      changed = true;
    }
  });
  if(changed) saveState();
  return changed;
}

/* ---------------- NAV ---------------- */
const Nav = {
  current:'boot',
  history:[],
  go(screenId, opts){
    opts = opts||{};
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+screenId).classList.add('active');
    this.current = screenId;
    const nav = document.getElementById('bottomnav');
    const tabScreens = ['hub','quest','heroes','pvp','symbols','profile'];
    nav.style.display = (state.registered && tabScreens.includes(screenId)) ? 'flex' : 'none';
    document.querySelectorAll('.nav-item').forEach(el=>{
      el.classList.toggle('active', el.dataset.tab===screenId);
    });
    window.scrollTo(0,0);
    if(screenId==='hub') UI.renderHub();
    if(screenId==='symbols') UI.renderSymbols();
    if(screenId==='profile') UI.renderProfile();
    if(screenId==='role') RoleUI.renderScreen();
    if(screenId==='rating') RatingUI.render();
    if(screenId==='alliance') AllianceUI.render();
    if(screenId==='friends') FriendsUI.render();
    if(screenId==='chat') ChatUI.render();
    if(screenId==='pvp') PvpUI.render();
    if(screenId==='pvphistory') HistoryUI.renderList();
    if(screenId==='heroes') HeroUI.renderList();
    if(screenId==='warehouse') HeroUI.renderWarehouse();
  },
  tab(id){ this.go(id); }
};

/* ---------------- UI (overlays, general renders) ---------------- */
const UI = {
  openOverlay(id){ document.getElementById(id).classList.add('show'); },
  closeOverlay(){ document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('show')); },
  showUnlock(title, text){
    document.getElementById('unlock-title').textContent = title;
    document.getElementById('unlock-text').textContent = text;
    this.openOverlay('overlay-unlock');
    Audio_.unlock();
  },
  showResourceSource(resourceKey, label){
    document.getElementById('source-title').textContent = 'ГДЕ ПОЛУЧИТЬ: '+(label||resourceKey).toUpperCase();
    const list = document.getElementById('source-list');
    const sources = RESOURCE_SOURCES[resourceKey] || ['Задания из игры', 'Завершение веток архива', 'PvP'];
    list.innerHTML = sources.map(s=>'<li>'+escapeHtml(s)+'</li>').join('');
    this.openOverlay('overlay-source');
  },
  renderHub(){
    checkUnlocks();
    const solved = totalSolvedCount();
    const pct = Math.round((solved/TOTAL_PUZZLES)*100);
    document.getElementById('hub-progress-fill').style.width = pct+'%';
    document.getElementById('hub-progress-pct').textContent = pct+'%';
    document.getElementById('hub-progress-txt').textContent = solved+' / '+TOTAL_PUZZLES+' РАЗГАДАНО';

    const li = levelInfo(state.xp);
    document.getElementById('hub-strip-name').textContent = (state.name||'SURVIVOR');
    document.getElementById('hub-strip-level').textContent = 'LVL '+li.level;
    document.getElementById('hub-strip-xpfill').style.width = li.pct+'%';
    document.getElementById('hub-strip-xpcap').textContent = (li.xp-li.cur)+' / '+(li.next-li.cur)+' XP';
    Avatar.renderInto('hub-avatar-circle');

    const role = ROLES[state.role];
    if(role){
      document.getElementById('hub-role-title').textContent = role.name;
      document.getElementById('hub-role-title').style.color = role.color;
      document.getElementById('hub-role-tag').textContent = 'ОТКРЫТЬ ДОСЬЕ';
    }

    const wrap = document.getElementById('branch-list');
    wrap.innerHTML = '';
    DATA.branches.forEach((b, idx)=>{
      const bs = state.branches[b.id];
      const done = bs.completed;
      const locked = !bs.unlocked;
      const scheduled = locked && bs.unlockAt && Date.now() < bs.unlockAt;
      const node = document.createElement('div');
      node.className = 'branch-node ' + (done?'done':(locked?'locked':'active'));
      const solvedN = branchSolvedCount(b);
      let metaRight = locked ? 'ACCESS DENIED' : (solvedN+'/'+b.puzzles.length);
      let titleText = locked ? 'CLASSIFIED' : b.title;
      if(scheduled){ metaRight = 'ОТКРЫТИЕ ' + formatMsk(bs.unlockAt); titleText = 'DECRYPTING…'; }
      node.innerHTML = `
        <div class="node-dot">${done?'✓':(locked?'🔒':(idx+1))}</div>
        <div class="branch-card">
          <div class="b-eyebrow">ВЕТКА ${toRoman(idx+1)}</div>
          <h3>${titleText}</h3>
          <div class="b-meta">
            <span class="stars">${'★'.repeat(b.stars)}${'☆'.repeat(6-b.stars)}</span>
            <span>${metaRight}</span>
          </div>
        </div>`;
      if(!locked){
        node.onclick = ()=>{ Audio_.tap(); Quest.openBranch(b.id); };
      } else if(scheduled){
        node.onclick = ()=>{ Audio_.bad(); glitchFlash(); toast('АРХИВ РАСШИФРОВЫВАЕТСЯ. ОТКРЫТИЕ '+formatMsk(bs.unlockAt)); };
      } else {
        node.onclick = ()=>{ Audio_.bad(); glitchFlash(); toast('ACCESS DENIED — ЗАВЕРШИ ПРЕДЫДУЩУЮ ВЕТКУ'); };
      }
      wrap.appendChild(node);
    });
    // locked future branches (IV, V) always classified, not built
    ['ЭРА ВОЗРОЖДЕНИЯ','ЧЁРНЫЙ ПРОТОКОЛ'].forEach((name, i)=>{
      const node = document.createElement('div');
      node.className = 'branch-node locked';
      node.innerHTML = `
        <div class="node-dot">🔒</div>
        <div class="branch-card">
          <div class="b-eyebrow">ВЕТКА ${toRoman(4+i)}</div>
          <h3>CLASSIFIED</h3>
          <div class="b-meta"><span class="stars">${'★'.repeat(5+i)}${'☆'.repeat(1-i)}</span><span>ACCESS DENIED</span></div>
        </div>`;
      node.onclick = ()=>{ Audio_.bad(); glitchFlash(); toast('ACCESS DENIED — ДАННЫЕ ЗАСЕКРЕЧЕНЫ'); };
      wrap.appendChild(node);
    });
  },
  renderSymbols(){
    const grid = document.getElementById('sym-grid');
    grid.innerHTML = '';
    const cells = 20;
    for(let i=0;i<cells;i++){
      const sym = state.symbols[i];
      const cell = document.createElement('div');
      if(sym){
        cell.className = 'sym-cell';
        cell.innerHTML = `${escapeHtml(sym.value)}<span class="src">${escapeHtml(sym.branchLabel)}</span>`;
      } else {
        cell.className = 'sym-cell empty';
        cell.textContent = '·';
      }
      grid.appendChild(cell);
    }
  },
  renderProfile(){
    document.getElementById('prof-server-name').textContent = (state.server||'SERVER —')+' / '+(state.name||'—') + (state.allianceTag ? ' ['+state.allianceTag+']' : '');
    document.getElementById('prof-rank').textContent = currentRank();
    const li = levelInfo(state.xp);
    document.getElementById('prof-level').textContent = 'LVL '+li.level;
    document.getElementById('prof-xpfill').style.width = li.pct+'%';
    document.getElementById('prof-xpcap').textContent = (li.xp-li.cur)+' / '+(li.next-li.cur)+' XP · ВСЕГО '+li.xp;
    Avatar.renderInto('profile-avatar-circle');
    document.getElementById('stat-solved').textContent = totalSolvedCount();
    document.getElementById('stat-symbols').textContent = state.symbols.length;
    const branchesDone = DATA.branches.filter(b=>state.branches[b.id].completed).length;
    document.getElementById('stat-branches').textContent = branchesDone+'/'+DATA.branches.length;
    document.getElementById('stat-mistakes').textContent = state.totalMistakes;
    document.getElementById('stat-hints').textContent = state.totalHintsUsed;
    document.getElementById('stat-time').textContent = state.startTime ? fmtTime(Date.now()-state.startTime) : '0м';

    const pvp = window.GameData.pvpRating || {wins:0,losses:0,rating:1000};
    document.getElementById('stat-pvp-rating').textContent = pvp.rating;
    document.getElementById('stat-pvp-wins').textContent = pvp.wins;
    document.getElementById('stat-pvp-losses').textContent = pvp.losses;
    const totalMatches = pvp.wins+pvp.losses;
    document.getElementById('stat-pvp-winrate').textContent = totalMatches>0 ? Math.round((pvp.wins/totalMatches)*100)+'%' : '—';

    const notifWrap = document.getElementById('notif-list');
    const notifBadge = document.getElementById('notif-unread-badge');
    if(notifWrap && window.Notifications){
      const list = window.Notifications.list();
      const unread = window.Notifications.unreadCount();
      notifBadge.textContent = unread>0 ? '('+unread+' новых)' : '';
      notifWrap.innerHTML = '';
      if(!list.length){
        notifWrap.innerHTML = '<p class="dim" style="font-size:12px; text-align:center; padding:12px 0;">УВЕДОМЛЕНИЙ ПОКА НЕТ.</p>';
      } else {
        list.slice(0,15).forEach(n=>{
          const row = document.createElement('div');
          row.className = 'notif-row'+(n.is_read?'':' unread');
          row.innerHTML = `
            <div class="nf-icon">${window.Notifications.icon(n.type)}</div>
            <div style="flex:1;">
              <div class="nf-title">${escapeHtml(n.title)}</div>
              <div class="nf-msg">${escapeHtml(n.message)}</div>
              <div class="nf-time">${formatShortTime(n.created_at)}</div>
            </div>`;
          if(!n.is_read){ row.onclick = async ()=>{ await window.Notifications.markRead(n.id); UI.renderProfile(); }; }
          notifWrap.appendChild(row);
        });
      }
    }

    const achWrap = document.getElementById('ach-list');
    achWrap.innerHTML = '';
    DATA.achievements.forEach(a=>{
      const unlocked = !!state.achievements[a.id];
      const row = document.createElement('div');
      row.className = 'ach-row'+(unlocked?'':' locked');
      row.innerHTML = `<div class="ach-icon">${unlocked?'✓':'?'}</div><div style="flex:1;"><div class="t">${a.title}</div><div class="d">${a.desc}</div></div>`;
      if(unlocked){
        const shareBtn = document.createElement('button');
        shareBtn.className = 'chat-share-btn';
        shareBtn.style.marginTop = '0';
        shareBtn.textContent = 'ПОДЕЛИТЬСЯ';
        shareBtn.onclick = ()=> ChatUI.shareAchievement(a);
        row.appendChild(shareBtn);
      }
      achWrap.appendChild(row);
    });

    document.getElementById('settings-name').textContent = state.name||'—';
    document.getElementById('settings-server').textContent = state.server||'—';
    const allianceInput = document.getElementById('settings-alliance');
    if(document.activeElement !== allianceInput){ allianceInput.value = state.allianceTag||''; }
    document.getElementById('sound-toggle').classList.toggle('on', state.soundOn);
  }
};

function toRoman(n){ return ['I','II','III','IV','V'][n-1]||n; }
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

/* ---------------- AVATAR ---------------- */
const DEFAULT_AVATAR_SVG = `<svg viewBox="0 0 24 24" stroke="#31ff9c" stroke-width="1.5" fill="none"><circle cx="12" cy="12" r="10" opacity=".5"/><path d="M12 4 L17.5 15 L6.5 15 Z"/><circle cx="12" cy="12.5" r="1" fill="#31ff9c"/><rect x="11.3" y="7" width="1.4" height="4" fill="#31ff9c"/></svg>`;
const Avatar = {
  pick(){ document.getElementById('avatar-file-input').click(); },
  onFile(e){
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    if(!f.type.startsWith('image/')){ toast('ВЫБЕРИ ФАЙЛ ИЗОБРАЖЕНИЯ'); return; }
    const reader = new FileReader();
    reader.onload = ()=>{
      state.avatar = reader.result;
      saveState();
      Avatar.renderAll();
      toast('АВАТАР ОБНОВЛЁН');
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  },
  markup(){
    return state.avatar ? `<img src="${state.avatar}" alt="avatar">` : DEFAULT_AVATAR_SVG;
  },
  renderInto(elId){
    const el = document.getElementById(elId);
    if(!el) return;
    const editBadge = el.querySelector('.edit-badge');
    el.innerHTML = this.markup() + (editBadge ? editBadge.outerHTML : '');
  },
  renderAll(){
    ['reg-avatar-circle','hub-avatar-circle','profile-avatar-circle'].forEach(id=>{
      if(document.getElementById(id)) this.renderInto(id);
    });
  }
};

/* ---------------- SERVER PICKER (1-300) ---------------- */
const ServerPicker = {
  selected:null,
  open(){
    UI.openOverlay('overlay-server');
    this.renderGrid('');
    const search = document.getElementById('server-search');
    search.value = '';
    search.oninput = ()=> this.renderGrid(search.value.trim());
    setTimeout(()=>search.focus(), 50);
  },
  renderGrid(filter){
    const grid = document.getElementById('server-grid');
    grid.innerHTML = '';
    for(let n=1; n<=300; n++){
      const s = String(n);
      if(filter && s.indexOf(filter)===-1) continue;
      const cell = document.createElement('div');
      cell.className = 'server-cell';
      cell.textContent = '#'+n;
      cell.onclick = ()=> ServerPicker.select(n);
      grid.appendChild(cell);
    }
    if(!grid.children.length){
      grid.innerHTML = '<div class="dim mono" style="grid-column:1/-1; font-size:12px; text-align:center; padding:14px 0;">НЕТ СОВПАДЕНИЙ</div>';
    }
  },
  select(n){
    Audio_.tap();
    this.selected = n;
    const btn = document.getElementById('reg-server-btn');
    btn.textContent = 'SERVER #'+n;
    btn.classList.add('chosen');
    UI.closeOverlay();
  }
};

/* ---------------- ROLE UI ---------------- */
const RoleUI = {
  showReveal(){
    const role = ROLES[state.role];
    if(!role){ Nav.go('hub'); return; }
    document.getElementById('role-reveal-name').textContent = role.name;
    document.getElementById('role-reveal-name').style.color = role.color;
    document.getElementById('role-reveal-tagline').textContent = role.tagline;
    UI.openOverlay('overlay-role');
    Audio_.unlock();
    document.getElementById('role-reveal-continue').onclick = ()=>{
      UI.closeOverlay();
      Nav.go('hub');
    };
  },
  renderScreen(){
    const role = ROLES[state.role];
    if(!role) return;
    document.getElementById('role-screen-name').textContent = role.name;
    document.getElementById('role-screen-name').style.color = role.color;
    document.getElementById('role-screen-tagline').textContent = role.tagline;
    document.getElementById('role-screen-desc').textContent = role.desc;
    const list = document.getElementById('role-task-list');
    list.innerHTML = '';
    role.tasks.forEach(t=>{
      const done = !!state.roleTasksDone[t.id];
      const row = document.createElement('div');
      row.className = 'role-task-row'+(done?' done':'');
      row.innerHTML = `<div class="rt-check">✓</div><div class="rt-text">${escapeHtml(t.text)}</div>`;
      row.onclick = ()=> RoleUI.toggleTask(t.id);
      list.appendChild(row);
    });
  },
  toggleTask(taskId){
    const wasDone = !!state.roleTasksDone[taskId];
    if(!wasDone){
      state.roleTasksDone[taskId] = true;
      state.xp = (state.xp||0) + 5;
      grantHeroReward({credits:100});
      Audio_.ok();
      toast('ЗАДАНИЕ РОЛИ ВЫПОЛНЕНО +5 XP · +100 кредитов');
    } else {
      delete state.roleTasksDone[taskId];
    }
    saveState();
    this.renderScreen();
  }
};

/* ---------------- RATING UI (self-only, local device) ---------------- */
const RatingUI = {
  sortField:'xp',
  sortDesc:true,
  render(){
    const input = document.getElementById('rating-filter');
    const fieldSel = document.getElementById('rating-sort-field');
    const dirBtn = document.getElementById('rating-sort-dir');
    fieldSel.value = this.sortField;
    dirBtn.textContent = this.sortDesc ? '↓ БОЛЬШЕ→МЕНЬШЕ' : '↑ МЕНЬШЕ→БОЛЬШЕ';
    input.oninput = ()=> this.renderList(input.value.trim());
    fieldSel.onchange = ()=>{ this.sortField = fieldSel.value; this.renderList(input.value.trim()); };
    dirBtn.onclick = ()=>{
      this.sortDesc = !this.sortDesc;
      dirBtn.textContent = this.sortDesc ? '↓ БОЛЬШЕ→МЕНЬШЕ' : '↑ МЕНЬШЕ→БОЛЬШЕ';
      this.renderList(input.value.trim());
    };
    this.renderList(input.value.trim());
  },
  getEntries(){
    // Local-device beta: only the registered player exists as a real entry.
    // Sorting/filtering logic is written generically so it keeps working once
    // a real multi-player backend supplies more rows.
    if(!state.registered) return [];
    const li = levelInfo(state.xp);
    return [{
      name: state.name, server: state.server, alliance: state.allianceTag,
      xp: state.xp||0, level: li.level, solved: totalSolvedCount(), isMe:true
    }];
  },
  renderList(filter){
    const wrap = document.getElementById('rating-list');
    wrap.innerHTML = '';
    let entries = this.getEntries();
    const filterNum = (filter||'').replace(/[^0-9]/g,'');
    if(filterNum){
      entries = entries.filter(e=> (e.server||'').replace(/[^0-9]/g,'').indexOf(filterNum)!==-1 );
    }
    entries.sort((a,b)=>{
      const va = a[this.sortField]||0, vb = b[this.sortField]||0;
      return this.sortDesc ? (vb-va) : (va-vb);
    });
    if(!entries.length){
      wrap.innerHTML = '<p class="dim" style="font-size:12.5px; text-align:center; padding:20px 0;">НЕТ ВЫЖИВШИХ ПО ЭТОМУ ФИЛЬТРУ.</p>';
      return;
    }
    entries.forEach((e, i)=>{
      const row = document.createElement('div');
      row.className = 'rating-row';
      row.innerHTML = `
        <div class="rk-pos">#${i+1}</div>
        <div class="avatar-circle avatar-sm" style="cursor:default;">${e.isMe ? Avatar.markup() : DEFAULT_AVATAR_SVG}</div>
        <div class="rk-info">
          <div class="rk-name">${escapeHtml(e.name||'—')}</div>
          <div class="rk-server">${escapeHtml(e.server||'—')}${e.alliance ? ' · ['+escapeHtml(e.alliance)+']' : ''}</div>
        </div>
        <div class="rk-stats"><div class="lvl">LVL ${e.level}</div><div>${e.solved} ЗАДАНИЙ</div><div>${e.xp} XP</div></div>`;
      if(e.isMe){ row.querySelector('.rk-name').onclick = ()=> Nav.go('profile'); row.querySelector('.rk-name').style.cursor='pointer'; }
      wrap.appendChild(row);
    });
    const note = document.createElement('p');
    note.className = 'dim';
    note.style.cssText = 'font-size:11px; text-align:center; margin-top:12px;';
    note.textContent = '#'+entries.length+' из '+entries.length+' известных выживших на данный момент.';
    wrap.appendChild(note);
  }
};

/* ---------------- ALLIANCES ---------------- */
const AllianceUI = {
  render(){
    const status = document.getElementById('alliance-status-text');
    const wrap = document.getElementById('alliance-list');
    wrap.innerHTML = '';
    if(!state.registered){
      status.textContent = 'Сначала пройди идентификацию выжившего.';
      return;
    }
    if(!state.allianceTag){
      status.textContent = 'У тебя нет тега альянса. Добавь его в Профиль → Настройки, чтобы найти союзников.';
      const hint = document.createElement('button');
      hint.className = 'btn ghost';
      hint.style.marginTop = '14px';
      hint.textContent = 'ПЕРЕЙТИ В НАСТРОЙКИ';
      hint.onclick = ()=> Nav.go('profile');
      wrap.appendChild(hint);
      return;
    }
    status.textContent = 'Альянс: ['+state.allianceTag+']. Показаны все известные выжившие с этим тегом на этом устройстве.';
    const li = levelInfo(state.xp);
    const row = document.createElement('div');
    row.className = 'rating-row';
    row.innerHTML = `
      <div class="rk-pos">#1</div>
      <div class="avatar-circle avatar-sm" style="cursor:default;">${Avatar.markup()}</div>
      <div class="rk-info">
        <div class="rk-name" style="cursor:pointer;">${escapeHtml(state.name||'—')}</div>
        <div class="rk-server">${escapeHtml(state.server||'—')} · [${escapeHtml(state.allianceTag)}]</div>
      </div>
      <div class="rk-stats"><div class="lvl">LVL ${li.level}</div><div>${totalSolvedCount()} ЗАДАНИЙ</div></div>`;
    row.querySelector('.rk-name').onclick = ()=> Nav.go('profile');
    wrap.appendChild(row);
  }
};

/* ---------------- FRIENDS ---------------- */
/* ---------------- PVP (rating shell + throttled opponent search, no real matches yet) ---------------- */
const PvpUI = {
  render(){
    this.renderMyHero();
    this.renderDailyMissions();
    this.renderRating();
    this.renderSearchState();
    document.getElementById('pvp-find-btn').onclick = ()=> this.findOpponent();
    this.renderSearchResults();
  },

  // ---- AUDIT NOTE ----------------------------------------------------
  // Every method below used to read/write the local `state.*` object
  // (state.heroes, state.pvpStats, state.pvpSearch...) — a second,
  // disconnected copy of the game that never touched Supabase at all.
  // Rewired to read from window.GameData (loaded by js/database.js
  // after login) and to call window.PvP for anything that mutates
  // server data. Local `state` is no longer used anywhere in this module.
  // ----------------------------------------------------------------------

  ownedHeroes(){
    return (window.GameData.heroes || []).filter(h => h.playerHero && h.playerHero.is_unlocked);
  },

  getBattleHeroId(){
    const owned = this.ownedHeroes();
    if(!owned.length) return null;
    if(state.pvpSelectedHero && owned.some(h=>h.def.id===state.pvpSelectedHero)) return state.pvpSelectedHero;
    let best = owned[0];
    owned.forEach(h=>{ if((h.playerHero.power||0) > (best.playerHero.power||0)) best = h; });
    state.pvpSelectedHero = best.def.id;
    saveState();
    return best.def.id;
  },

  renderDailyMissions(){
    const wrap = document.getElementById('pvp-daily-missions');
    wrap.innerHTML = '';
    if(!window.Quests){ return; }
    const missions = window.Quests.today();
    if(!missions.length){
      wrap.innerHTML = '<p class="dim" style="font-size:12px; text-align:center; padding:14px 0;">ЗАГРУЗКА...</p>';
      return;
    }
    missions.forEach(qp=>{
      const q = qp.quests;
      if(!q) return;
      const target = qp.target || q.target;
      const pct = Math.min(100, Math.round((qp.progress/target)*100));
      const ready = window.Quests.canClaim(qp);
      const rewardParts = [];
      if(q.reward_currency) rewardParts.push('+'+q.reward_currency+' кредитов');
      if(q.reward_xp) rewardParts.push('+'+q.reward_xp+' XP');
      const item = q.reward_item||{};
      if(item.pvp_rating) rewardParts.push('+'+item.pvp_rating+' PvP-очков');
      if(item.parts) rewardParts.push('+'+item.parts+' деталей герою');
      if(item.yellow_puzzles) rewardParts.push('+'+item.yellow_puzzles+' жёлтых пазлов');
      if(item.universal_mats) rewardParts.push('+'+item.universal_mats+' универсальных материалов');
      if(item.weapon_mats) rewardParts.push('+'+item.weapon_mats+' материалов оружия');
      if(item.armor_mats) rewardParts.push('+'+item.armor_mats+' материалов брони');

      const row = document.createElement('div');
      row.className = 'mission-row'+(qp.claimed?' claimed':'');
      row.innerHTML = `
        <div class="mr-desc">${escapeHtml(q.description||q.title)}</div>
        <div class="mr-progress-row"><span>${Math.min(qp.progress,target).toLocaleString('ru-RU')} / ${target.toLocaleString('ru-RU')}</span><span>${pct}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="mr-reward">НАГРАДА: ${escapeHtml(rewardParts.join(' · ')||'—')}</div>
        <button class="mr-claim-btn" ${ready?'':'disabled'}>${qp.claimed?'ПОЛУЧЕНО ✓':(ready?'ЗАБРАТЬ':'ЕЩЁ НЕ ГОТОВО')}</button>`;
      if(ready){
        const btn = row.querySelector('.mr-claim-btn');
        btn.onclick = async ()=>{
          btn.disabled = true;
          const { error } = await window.Quests.claim(qp);
          if(error){ toast(error.userMessage||'Не удалось получить награду'); btn.disabled = false; return; }
          Audio_.ok(); toast('НАГРАДА ПОЛУЧЕНА');
          PvpUI.renderDailyMissions(); PvpUI.renderRating(); PvpUI.renderMyHero();
        };
      }
      wrap.appendChild(row);
    });
  },

  renderMyHero(){
    const wrap = document.getElementById('pvp-my-hero');
    wrap.innerHTML = '';
    const owned = this.ownedHeroes();
    if(!owned.length){
      wrap.innerHTML = '<p class="dim" style="font-size:12.5px; text-align:center; padding:14px 0;">У ТЕБЯ ПОКА НЕТ НИ ОДНОГО ГЕРОЯ.</p>';
      return;
    }
    const currentId = this.getBattleHeroId();
    const entry = owned.find(h=>h.def.id===currentId);
    const def = entry.def, ph = entry.playerHero;
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.innerHTML = `
      <div class="hero-portrait">⚔</div>
      <div class="hc-body">
        <div class="hc-name">${def.name}</div>
        <div class="hc-role">${def.role} · Ур. ${ph.level}</div>
        <div class="hc-stars">${'★'.repeat(Math.min(5,ph.yellow_stars||0))}${ph.red_stars>0 ? ' <span style="color:var(--danger)">'+'★'.repeat(ph.red_stars)+'</span>' : ''}</div>
      </div>
      <div class="hc-power"><div class="val">${ph.power}</div><div class="lbl">СИЛА</div></div>`;
    card.onclick = ()=> HeroUI.openDetail(currentId);
    wrap.appendChild(card);
    if(owned.length>1){
      const switcher = document.createElement('div');
      switcher.style.cssText = 'display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;';
      owned.forEach(h=>{
        const b = document.createElement('button');
        b.className = 'btn ghost';
        b.style.cssText = 'width:auto; padding:8px 12px; font-size:11px;';
        b.textContent = h.def.name + (h.def.id===currentId?' ✓':'');
        b.onclick = ()=>{ state.pvpSelectedHero = h.def.id; saveState(); this.render(); };
        switcher.appendChild(b);
      });
      wrap.appendChild(switcher);
    }
  },

  async renderRating(){
    const wrap = document.getElementById('pvp-rating-list');
    wrap.innerHTML = '<p class="dim" style="font-size:12px; text-align:center; padding:14px 0;">ЗАГРУЗКА...</p>';
    const profile = window.GameData.profile;
    if(!profile){ return; }

    const { data: top, error } = await window.loadPagedLeaderboard(0, 20);
    wrap.innerHTML = '';
    if(error){ wrap.innerHTML = '<p class="dim" style="font-size:12px; text-align:center; padding:14px 0;">НЕ УДАЛОСЬ ЗАГРУЗИТЬ РЕЙТИНГ.</p>'; return; }

    const myId = window.AuthState.user && window.AuthState.user.id;
    let meInTop = false;
    top.forEach((p, i)=>{
      const isMe = p.id === myId;
      if(isMe) meInTop = true;
      const row = document.createElement('div');
      row.className = 'rating-row';
      row.innerHTML = `
        <div class="rk-pos">#${i+1}</div>
        <div class="avatar-circle avatar-sm" style="cursor:default;">${isMe ? Avatar.markup() : DEFAULT_AVATAR_SVG}</div>
        <div class="rk-info">
          <div class="rk-name" style="cursor:pointer;">${escapeHtml(p.username||'—')}${isMe?' <span class="dim" style="font-size:9px;">(ТЫ)</span>':''}</div>
          <div class="rk-server">${p.alliance_tag ? '['+escapeHtml(p.alliance_tag)+']' : ''}</div>
        </div>
        <div class="rk-stats"><div class="lvl">${window.PvP.tierName(p.rating)}</div><div>${p.rating} MMR</div><div>${p.wins}П / ${p.losses}П</div></div>`;
      row.querySelector('.rk-name').onclick = ()=> isMe ? Nav.go('profile') : null;
      wrap.appendChild(row);
    });

    if(!meInTop && window.GameData.pvpRating){
      const pvp = window.GameData.pvpRating;
      const sep = document.createElement('p');
      sep.className = 'dim mono';
      sep.style.cssText = 'font-size:10px; text-align:center; margin:8px 0;';
      sep.textContent = '···';
      wrap.appendChild(sep);
      const row = document.createElement('div');
      row.className = 'rating-row';
      row.innerHTML = `
        <div class="rk-pos">—</div>
        <div class="avatar-circle avatar-sm" style="cursor:default;">${Avatar.markup()}</div>
        <div class="rk-info">
          <div class="rk-name" style="cursor:pointer;">${escapeHtml(profile.username||'—')} <span class="dim" style="font-size:9px;">(ТЫ)</span></div>
          <div class="rk-server">${profile.alliance_tag ? '['+escapeHtml(profile.alliance_tag)+']' : ''}</div>
        </div>
        <div class="rk-stats"><div class="lvl">${window.PvP.tierName(pvp.rating)}</div><div>${pvp.rating} MMR</div><div>${pvp.wins}П / ${pvp.losses}П</div></div>`;
      row.querySelector('.rk-name').onclick = ()=> Nav.go('profile');
      wrap.appendChild(row);
    }

    if(!top.length){
      wrap.innerHTML = '<p class="dim" style="font-size:12px; text-align:center; padding:14px 0;">РЕЙТИНГ ПОКА ПУСТ.</p>';
    }
  },

  getSearchState(){
    // Cosmetic daily search-attempt counter only (limits how many bot
    // "opponent cards" you can roll per day) — not security-relevant,
    // the fight's outcome is always server-decided regardless. Kept
    // local for simplicity.
    const today = mskDateKey(Date.now());
    if(!state.pvpSearch || state.pvpSearch.date !== today){
      state.pvpSearch = {date:today, used:0, results:[]};
      saveState();
    }
    if(!state.pvpSearch.results) state.pvpSearch.results = [];
    return state.pvpSearch;
  },
  renderSearchState(){
    const s = this.getSearchState();
    document.getElementById('pvp-search-counter').textContent = 'ПОПЫТОК СЕГОДНЯ: '+s.used+'/5';
    document.getElementById('pvp-find-btn').disabled = s.used>=5;
    document.getElementById('pvp-find-btn').textContent = s.used>=5 ? 'ЛИМИТ НА СЕГОДНЯ ИСЧЕРПАН' : 'НАЙТИ ПРОТИВНИКА';
  },
  findOpponent(){
    const s = this.getSearchState();
    if(s.used>=5){ toast('ЛИМИТ ПОИСКА НА СЕГОДНЯ ИСЧЕРПАН. ПОПРОБУЙ ЗАВТРА.'); return; }
    const heroId = this.getBattleHeroId();
    if(!heroId){ toast('СНАЧАЛА ОТКРОЙ ХОТЯ БЫ ОДНОГО ГЕРОЯ'); return; }
    s.used++;
    s.results = window.PvP.findOpponents(heroId);
    saveState();
    Audio_.tap();
    this.renderSearchState();
    this.renderSearchResults();
  },
  renderSearchResults(){
    const s = this.getSearchState();
    const results = document.getElementById('pvp-search-results');
    results.innerHTML = '';
    if(!s.results || !s.results.length){
      results.innerHTML = '<p class="dim" style="font-size:11.5px; text-align:center; padding:16px 0;">НАЖМИ «НАЙТИ ПРОТИВНИКА», ЧТОБЫ УВИДЕТЬ СПИСОК.</p>';
      return;
    }
    const note = document.createElement('p');
    note.className = 'dim';
    note.style.cssText = 'font-size:10.5px; margin:10px 0;';
    note.textContent = 'Реальные игроки пока недоступны — показаны боты, подобранные по силе твоего героя.';
    results.appendChild(note);
    s.results.forEach(bot=>{
      const row = document.createElement('div');
      row.className = 'hero-card';
      row.innerHTML = `
        <div class="hero-portrait">⚔</div>
        <div class="hc-body">
          <div class="hc-name">${escapeHtml(bot.name)} <span style="color:var(--danger); font-size:9px;">BOT</span></div>
          <div class="hc-role">${escapeHtml(bot.heroName)} · ${escapeHtml(bot.role)}</div>
        </div>
        <div class="hc-power"><div class="val">${bot.power}</div><div class="lbl">СИЛА</div></div>`;
      row.onclick = ()=> PvpUI.openCompare(bot);
      results.appendChild(row);
    });
  },
  openCompare(bot){
    const heroId = this.getBattleHeroId();
    if(!heroId){ toast('СНАЧАЛА ОТКРОЙ ХОТЯ БЫ ОДНОГО ГЕРОЯ'); return; }
    this._compareBot = bot;
    const entry = this.ownedHeroes().find(h=>h.def.id===heroId);
    const def = entry.def, ph = entry.playerHero;
    const myPower = ph.power;
    const panel = document.getElementById('pvpcompare-panel');
    panel.innerHTML = `
      <div class="vs-side">
        <div class="vs-portrait">⚔</div>
        <div class="vs-name">${def.name}</div>
        <div class="dim" style="font-size:9.5px;">${def.role}</div>
        <div class="vs-power">${myPower}</div>
      </div>
      <div class="vs-mid">VS</div>
      <div class="vs-side enemy">
        <div class="vs-portrait">⚔</div>
        <div class="vs-name">${escapeHtml(bot.name)}</div>
        <div class="vs-bot-tag">BOT · ${escapeHtml(bot.heroName)} · ${escapeHtml(bot.role)}</div>
        <div class="vs-power">${bot.power}</div>
      </div>`;

    const diffPct = Math.round(((bot.power-myPower)/myPower)*1000)/10;
    const diffBox = document.getElementById('pvpcompare-power-diff');
    const warnLevel = diffPct>15;
    diffBox.innerHTML = `
      <div class="power-diff-box">
        <div class="pd-row">
          <div>МОЯ СИЛА<span class="v">${myPower}</span></div>
          <div>СИЛА СОПЕРНИКА<span class="v">${bot.power}</span></div>
        </div>
        <div class="pd-diff ${diffPct>0 ? (warnLevel?'warn':'') : 'ok'}">РАЗНИЦА ${diffPct>0?'+':''}${diffPct}%</div>
        ${warnLevel ? '<div class="dim" style="font-size:10.5px; margin-top:6px;">⚠ Соперник заметно сильнее — бой будет сложным.</div>' : ''}
      </div>`;

    const counter = getCounterInfo(def.role, bot.role);
    const counterBox = document.getElementById('pvpcompare-counter');
    if(counter.status==='advantage'){
      counterBox.innerHTML = `<div class="counter-banner advantage">🟢 ПРЕИМУЩЕСТВО КЛАССА · ${escapeHtml(counter.pair.label)}</div>`;
    } else if(counter.status==='disadvantage'){
      counterBox.innerHTML = `<div class="counter-banner disadvantage">🔴 НЕБЛАГОПРИЯТНЫЙ КЛАСС · соперник получает: ${escapeHtml(counter.pair.label)}</div>`;
    } else {
      counterBox.innerHTML = `<div class="counter-banner neutral">⚪ НЕЙТРАЛЬНО — классы не взаимодействуют напрямую</div>`;
    }

    const statsWrap = document.getElementById('pvpcompare-stats');
    statsWrap.innerHTML = `
      <div class="stat-line"><div class="sl-label">СИЛА</div><div class="sl-value"><span class="accent">${myPower}</span> &nbsp;/&nbsp; <span style="color:var(--danger);">${bot.power}</span></div></div>`;
    document.getElementById('pvpcompare-fight-btn').onclick = ()=> Battle.start(heroId, bot);
    Nav.go('pvpcompare');
  }
};

const HistoryUI = {
  // AUDIT NOTE: used to read state.pvpHistory, a local array nothing
  // ever wrote to any more once the local Battle engine was removed —
  // "история боёв" was permanently empty. Rewired to the real
  // pvp_battles table via window.PvP.loadHistory().
  _cache: [],

  async renderList(){
    const wrap = document.getElementById('pvphistory-list');
    wrap.innerHTML = '<p class="dim" style="font-size:12px; text-align:center; padding:16px 0;">ЗАГРУЗКА...</p>';
    const { data, error } = await window.PvP.loadHistory(30);
    this._cache = data || [];
    wrap.innerHTML = '';
    if(error){ wrap.innerHTML = '<p class="dim" style="font-size:12.5px; text-align:center; padding:20px 0;">НЕ УДАЛОСЬ ЗАГРУЗИТЬ ИСТОРИЮ.</p>'; return; }
    if(!this._cache.length){
      wrap.innerHTML = '<p class="dim" style="font-size:12.5px; text-align:center; padding:20px 0;">ИСТОРИЯ БОЁВ ПОКА ПУСТА.</p>';
      return;
    }
    const myId = window.AuthState.user && window.AuthState.user.id;
    this._cache.forEach(h=>{
      const isAttacker = h.attacker_id === myId;
      const myPower = isAttacker ? h.attacker_power : h.defender_power;
      const enemyPower = isAttacker ? h.defender_power : h.attacker_power;
      const enemyName = h.is_bot_defender ? 'BOT' : 'Соперник';
      const ratingChange = isAttacker ? h.attacker_rating_change : h.defender_rating_change;
      const row = document.createElement('div');
      row.className = 'history-row';
      const badgeClass = h.result==='win'?'win':(h.result==='loss'?'loss':'draw');
      const badgeText = h.result==='win'?'ПОБЕДА':(h.result==='loss'?'ПОРАЖЕНИЕ':'НИЧЬЯ');
      const d = new Date(h.created_at);
      const dateStr = String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
      row.innerHTML = `
        <div class="hr-badge ${badgeClass}">${badgeText}</div>
        <div class="hr-body">
          <div class="hr-vs">${escapeHtml(state.name||'Ты')} <span class="dim">vs</span> ${escapeHtml(enemyName)}</div>
          <div class="hr-date">${dateStr} · сила ${myPower} vs ${enemyPower}</div>
        </div>
        <div class="hr-rating ${ratingChange>0?'pos':(ratingChange<0?'neg':'')}">${ratingChange>0?'+':''}${ratingChange||0}</div>`;
      row.onclick = ()=> HistoryUI.openDetail(h.id);
      wrap.appendChild(row);
    });
  },

  openDetail(historyId){
    const h = this._cache.find(x=>x.id===historyId);
    if(!h) return;
    const scroll = document.getElementById('pvphistorydetail-scroll');
    const d = new Date(h.created_at);
    const dateStr = String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    const myId = window.AuthState.user && window.AuthState.user.id;
    const isAttacker = h.attacker_id === myId;
    const myPower = isAttacker ? h.attacker_power : h.defender_power;
    const enemyPower = isAttacker ? h.defender_power : h.attacker_power;
    const ratingChange = isAttacker ? h.attacker_rating_change : h.defender_rating_change;
    scroll.innerHTML = `
      <div class="battle-result-panel" style="padding-top:6px;">
        <div class="br-title ${h.result==='win'?'win':(h.result==='loss'?'lose':'')}">${h.result==='win'?'ПОБЕДА':(h.result==='loss'?'ПОРАЖЕНИЕ':'НИЧЬЯ')}</div>
        <div class="dim mono" style="font-size:11px; margin-top:6px;">${dateStr}</div>
        <div class="dim" style="font-size:12.5px; margin-top:10px;">Сила ${myPower} vs ${enemyPower}${h.is_bot_defender?' (BOT)':''}</div>
        ${ratingChange ? `<div class="mono" style="font-size:13px; margin-top:8px; color:${ratingChange>0?'var(--accent)':'var(--danger)'};">РЕЙТИНГ ${ratingChange>0?'+':''}${ratingChange}</div>` : ''}
        <div class="br-stats">
          <div class="brs-box"><div class="v">${h.turns}</div><div class="l">ХОДОВ</div></div>
          <div class="brs-box"><div class="v">${h.damage_dealt}</div><div class="l">УРОН НАНЕСЁН</div></div>
          <div class="brs-box"><div class="v">${h.damage_taken}</div><div class="l">УРОН ПОЛУЧЕН</div></div>
          <div class="brs-box"><div class="v">${h.crits}</div><div class="l">КРИТ. УДАРОВ</div></div>
          <div class="brs-box"><div class="v">${h.abilities_used}</div><div class="l">СПОСОБНОСТЕЙ</div></div>
          <div class="brs-box"><div class="v">${h.reward_credits}</div><div class="l">НАГРАДА (КРЕДИТЫ)</div></div>
        </div>
      </div>
      <div style="height:10px;"></div>`;
    Nav.go('pvphistorydetail');
  }
};

/* ================= HEROES UI ================= */
const HeroUI = {
  // ------------------------------------------------------------------
  // AUDIT NOTE: every read used to go through heroState()/HEROES/
  // findHeroDef() (all local-only), and every write mutated that local
  // object directly then called saveState() — Supabase was never in
  // the loop, so nothing here ever persisted past a browser refresh.
  // Rewired to read window.GameData.heroes (loaded by js/database.js)
  // and to write exclusively through window.Database's RPC wrappers,
  // which themselves call the SECURITY DEFINER functions in
  // schema.sql — the same functions that already existed and were
  // already correct, just never called.
  //
  // Simplification made here: the old "before/after" preview numbers
  // (computed by mutating a local copy of hero state and re-running the
  // stat formula) are not reproduced, since the formula's source of
  // truth is now a Postgres function, not JS. Current stats and costs
  // are still shown in full; only the predictive "what happens if I
  // upgrade" preview is gone. See README.md for the documented option
  // to add it back as a non-authoritative client-side estimate later.
  // ------------------------------------------------------------------

  entry(heroId){
    return (window.GameData.heroes || []).find(h => h.def.id === heroId) || null;
  },

  renderList(){
    const wrap = document.getElementById('heroes-list');
    wrap.innerHTML = '';
    (window.GameData.heroes || []).forEach(entry=>{
      const { def, playerHero: ph } = entry;
      const card = document.createElement('div');
      if(ph && ph.is_unlocked){
        card.className = 'hero-card';
        card.innerHTML = `
          <div class="hero-portrait">⚔</div>
          <div class="hc-body">
            <div class="hc-name">${def.name}</div>
            <div class="hc-role">${def.role} · ${def.rarity}</div>
            <div class="hc-stars">${'★'.repeat(Math.min(5,ph.yellow_stars))}${ph.red_stars>0?' <span style="color:var(--danger)">'+'★'.repeat(ph.red_stars)+'</span>':''} &nbsp;УР.${ph.level}</div>
          </div>
          <div class="hc-power"><div class="val">${ph.power}</div><div class="lbl">СИЛА</div></div>`;
      } else {
        card.className = 'hero-card locked';
        card.innerHTML = `
          <div class="hero-portrait">🔒</div>
          <div class="hc-body">
            <div class="hc-name">${def.name}</div>
            <div class="hc-role">${def.role} · ${def.rarity}</div>
            <div class="hc-stars" style="color:var(--text-dim);">ДЕТАЛИ ${ph?ph.parts:0}/100</div>
          </div>
          <div class="hc-lock-tag">🔒 ЗАБЛОКИРОВАН</div>`;
      }
      card.onclick = ()=> HeroUI.openDetail(def.id);
      wrap.appendChild(card);
    });
  },

  openDetail(heroId){
    const entry = this.entry(heroId);
    if(!entry) return;
    const { def, playerHero: ph } = entry;
    document.getElementById('herodetail-title').textContent = def.name;
    const scroll = document.getElementById('herodetail-scroll');

    if(!ph || !ph.is_unlocked){
      const parts = ph ? ph.parts : 0;
      scroll.innerHTML = `
        <div class="hero-hero-header">
          <div class="hero-hero-portrait" style="filter:grayscale(1); opacity:.6;">🔒</div>
          <h2 style="font-family:var(--mono); font-size:19px;">${def.name}</h2>
          <div class="dim" style="font-size:12px; margin-top:4px;">${def.role} · ${def.rarity}</div>
        </div>
        <div class="doc-panel"><div class="q-text">Этот герой ещё не открыт. Собери детали героя, выполняя ветки расследования и задания из игры, чтобы разблокировать его.</div></div>
        <div class="upgrade-panel">
          <div class="up-title">РАЗБЛОКИРОВКА</div>
          <div class="upgrade-cost-row"><span>Детали героя</span><span class="${parts>=100?'cost-ok':'cost-bad'}">${parts} / 100</span></div>
          <div class="progress-track" style="margin-bottom:10px;"><div class="progress-fill" style="width:${Math.min(100,parts)}%"></div></div>
          ${parts<100 ? `<div class="resource-missing-row"><span class="resource-missing-tag">НЕ ХВАТАЕТ ${100-parts} ДЕТАЛЕЙ</span><button class="where-btn" onclick="UI.showResourceSource('parts','детали героя')">ГДЕ ПОЛУЧИТЬ</button></div>` : ''}
          <button class="btn solid" id="hero-unlock-btn" style="margin-top:12px;" ${parts>=100?'':'disabled'}>РАЗБЛОКИРОВАТЬ ГЕРОЯ</button>
        </div>`;
      const unlockBtn = document.getElementById('hero-unlock-btn');
      if(unlockBtn) unlockBtn.onclick = ()=> HeroUI.unlockHero(heroId);
      Nav.go('herodetail');
      return;
    }

    const levelCost = Math.round(100 * ph.level * (1 + ph.level*0.05));
    const usingRed = ph.yellow_stars >= 5;
    const starPool = usingRed ? ph.red_puzzles : ph.yellow_puzzles;
    const starLabel = usingRed ? 'Красные пазлы' : 'Жёлтые пазлы';
    const credits = window.GameData.resources ? window.GameData.resources.credits : 0;

    scroll.innerHTML = `
      <div class="hero-hero-header">
        <div class="hero-hero-portrait">⚔</div>
        <h2 style="font-family:var(--mono); font-size:19px;">${def.name}</h2>
        <div class="dim" style="font-size:12px; margin-top:2px;">${def.role} · ${def.rarity}</div>
        <div class="hero-power-big">${ph.power}</div>
        <div class="hero-power-lbl">СИЛА</div>
      </div>

      <div class="section-title">ХАРАКТЕРИСТИКИ</div>
      <div class="doc-panel">
        ${statLine('❤️ Здоровье', Math.round(ph.health))}
        ${statLine('⚔️ Урон', Math.round(ph.attack))}
        ${statLine('🛡 Защита', Math.round(ph.defense))}
        ${statLine('⚡ Скорость', Math.round(ph.speed))}
        ${statLine('🎯 Точность', Number(ph.accuracy).toFixed(1)+'%')}
        ${statLine('💥 Крит. шанс', Number(ph.crit_chance).toFixed(1)+'%')}
        ${statLine('💥 Крит. урон', Number(ph.crit_damage).toFixed(0)+'%')}
        ${statLine('Пробивание', Number(ph.penetration).toFixed(1)+'%')}
        ${statLine('Уклонение', Number(ph.evasion).toFixed(1)+'%')}
        ${statLine('Сопротивление', Number(ph.resist).toFixed(1)+'%', true)}
      </div>

      <div class="section-title">УРОВЕНЬ</div>
      <div class="upgrade-panel">
        <div class="up-title">УРОВЕНЬ ${ph.level} / 60</div>
        <div class="upgrade-cost-row"><span>Стоимость (кредиты)</span><span id="level-cost" class="${ph.level<60 && credits>=levelCost ? 'cost-ok':'cost-bad'}">${ph.level<60 ? levelCost.toLocaleString('ru-RU') : '—'}</span></div>
        ${ph.level<60 && credits<levelCost ? `<div class="resource-missing-row"><span class="resource-missing-tag">НЕ ХВАТАЕТ ${(levelCost-credits).toLocaleString('ru-RU')} КРЕДИТОВ</span><button class="where-btn" onclick="UI.showResourceSource('credits','кредиты')">ГДЕ ПОЛУЧИТЬ</button></div>` : ''}
        <button class="btn solid" id="hero-levelup-btn" style="margin-top:12px;" ${ph.level>=60 || credits<levelCost ? 'disabled':''}>${ph.level>=60?'МАКСИМАЛЬНЫЙ УРОВЕНЬ':'ПОВЫСИТЬ УРОВЕНЬ'}</button>
      </div>

      <div class="section-title">ЗВЁЗДЫ</div>
      <div class="upgrade-panel">
        <div class="up-title">${'★'.repeat(Math.min(5,ph.yellow_stars))}${'☆'.repeat(5-Math.min(5,ph.yellow_stars))} ${ph.yellow_stars>=5 ? ' '+'★'.repeat(ph.red_stars)+'☆'.repeat(5-ph.red_stars) : ''}</div>
        <div class="upgrade-cost-row"><span>${starLabel}</span><span class="${starPool>=20?'cost-ok':'cost-bad'}">${starPool} / 20</span></div>
        ${starPool<20 ? `<div class="resource-missing-row"><span class="resource-missing-tag">НЕ ХВАТАЕТ ${20-starPool} ПАЗЛОВ</span><button class="where-btn" onclick="UI.showResourceSource('${usingRed?'redPuzzles':'yellowPuzzles'}','${usingRed?'красные пазлы':'жёлтые пазлы'}')">ГДЕ ПОЛУЧИТЬ</button></div>` : ''}
        <button class="btn solid" id="hero-starup-btn" style="margin-top:12px;" ${(ph.yellow_stars+ph.red_stars)>=10 || starPool<20 ? 'disabled':''}>${(ph.yellow_stars+ph.red_stars)>=10?'МАКСИМУМ ЗВЁЗД':'ПОВЫСИТЬ ЗВЕЗДУ'}</button>
      </div>

      <div class="section-title">ЭКИПИРОВКА</div>
      <div id="hero-gear-list"></div>

      <div class="section-title">ТАЛАНТЫ</div>
      <div id="hero-talent-list"></div>

      <div class="section-title">СПОСОБНОСТЬ</div>
      <div class="doc-panel">
        <div class="q-text"><strong style="color:var(--accent);">${def.ability_name||''}</strong><br><br>${def.ability_desc||''}<br><br><span class="dim">Перезарядка: ${def.ability_cooldown||3} хода</span></div>
      </div>

      <div class="section-title">РАЗВИТИЕ ГЕРОЯ</div>
      <div id="hero-devmissions-list"></div>
      <div style="height:10px;"></div>
    `;

    const lvlBtn = document.getElementById('hero-levelup-btn');
    if(lvlBtn) lvlBtn.onclick = ()=> HeroUI.levelUp(heroId);
    const starBtn = document.getElementById('hero-starup-btn');
    if(starBtn) starBtn.onclick = ()=> HeroUI.starUp(heroId);
    this.renderGearList(heroId);
    this.renderTalentList(heroId);
    this.renderDevMissions(heroId);
    Nav.go('herodetail');
  },

  renderGearList(heroId){
    const entry = this.entry(heroId);
    const wrap = document.getElementById('hero-gear-list');
    wrap.innerHTML = '';
    const icons = {weapon:'🔫', gloves:'🧤', vest:'🦺', pants:'👖'};
    const names = {weapon:'ОРУЖИЕ', gloves:'ПЕРЧАТКИ', vest:'ЖИЛЕТ', pants:'ШТАНЫ'};
    const res = window.GameData.resources || {weaponMats:0, armorMats:0, universalMats:0};
    ['weapon','gloves','vest','pants'].forEach(slot=>{
      const g = entry.gear.find(x=>x.slot===slot) || {level:0};
      const cost = { mat: 50*(g.level+1), universal: 10*(g.level+1) };
      const matKey = slot==='weapon' ? 'weapon_mats' : 'armor_mats';
      const matLabel = slot==='weapon' ? 'материалы оружия' : 'материалы брони';
      const hasMats = (res[matKey]||0) >= cost.mat;
      const hasUniversal = (res.universal_mats||0) >= cost.universal;
      const canAfford = g.level<20 && hasMats && hasUniversal;
      const row = document.createElement('div');
      row.className = 'gear-slot';
      row.innerHTML = `
        <div class="gear-icon">${icons[slot]}</div>
        <div class="gs-body">
          <div class="gs-name">${names[slot]} · УР.${g.level}</div>
          <div class="gs-level">${g.level<20 ? matLabel+' '+cost.mat+' · универсальные '+cost.universal : 'МАКСИМУМ'}</div>
          ${g.level<20 && !canAfford ? `<div class="resource-missing-row"><span class="resource-missing-tag">${!hasMats?'НЕ ХВАТАЕТ '+(cost.mat-(res[matKey]||0))+' '+matLabel.toUpperCase() : 'НЕ ХВАТАЕТ '+(cost.universal-(res.universal_mats||0))+' УНИВЕРСАЛЬНЫХ'}</span><button class="where-btn" onclick="UI.showResourceSource('${!hasMats?(slot==='weapon'?'weaponMats':'armorMats'):'universalMats'}','${!hasMats?matLabel:'универсальные материалы'}')">ГДЕ ПОЛУЧИТЬ</button></div>` : ''}
        </div>
        <button class="gs-btn" ${g.level>=20 || !canAfford ? 'disabled':''}>${g.level>=20?'МАКС':'УЛУЧШИТЬ'}</button>`;
      row.querySelector('.gs-btn').onclick = ()=> HeroUI.upgradeGear(heroId, slot);
      wrap.appendChild(row);
    });
  },

  renderTalentList(heroId){
    const entry = this.entry(heroId);
    const wrap = document.getElementById('hero-talent-list');
    wrap.innerHTML = '';
    (entry.talentDefs||[]).forEach(t=>{
      const prog = (entry.talentProgress||[]).find(p=>p.talent_id===t.id);
      const lvl = prog ? prog.level : 0;
      const nextLvl = Math.min(t.max_level, lvl+1);
      const curVal = lvl>0 ? (t.base_value + (lvl-1)*t.step_value) : 0;
      const nextVal = t.base_value + (nextLvl-1)*t.step_value;
      const cost = lvl<t.max_level ? (20 + lvl*10) : null;
      const parts = entry.playerHero.parts;
      const canAfford = cost!==null && parts>=cost;
      const dots = Array.from({length:t.max_level}).map((_,i)=>i<lvl?'●':'○').join('');
      const row = document.createElement('div');
      row.className = 'talent-row';
      row.innerHTML = `
        <div class="tr-head"><span class="tr-name">${t.name}</span><span class="tr-dots">${dots}</span></div>
        <div class="tr-desc">${(t.description||'').replace('{v}', lvl>0? curVal.toFixed(0) : '—')}</div>
        <div class="tr-cost-row">
          <span class="tr-cost ${lvl>=t.max_level ? 'dim' : (canAfford?'cost-ok':'cost-bad')}">${lvl>=t.max_level ? 'МАКС. УРОВЕНЬ' : (curVal.toFixed(0)+'% → '+nextVal.toFixed(0)+'% · '+cost+' деталей ('+parts+')')}</span>
          <button class="tr-btn" ${lvl>=t.max_level || !canAfford ? 'disabled':''}>${lvl>=t.max_level?'МАКС':(lvl===0?'ИЗУЧИТЬ':'УЛУЧШИТЬ')}</button>
        </div>
        ${lvl<t.max_level && !canAfford ? `<div class="resource-missing-row"><span class="resource-missing-tag">НЕ ХВАТАЕТ ${cost-parts} ДЕТАЛЕЙ</span><button class="where-btn" onclick="UI.showResourceSource('parts','детали героя')">ГДЕ ПОЛУЧИТЬ</button></div>` : ''}`;
      row.querySelector('.tr-btn').onclick = ()=> HeroUI.upgradeTalent(heroId, t.id);
      wrap.appendChild(row);
    });
  },

  renderDevMissions(heroId){
    const entry = this.entry(heroId);
    const wrap = document.getElementById('hero-devmissions-list');
    wrap.innerHTML = '';
    const ph = entry.playerHero;
    const missions = (entry.devMissions||[]).slice().sort((a,b)=>a.step_index-b.step_index);

    const checkDone = (m)=>{
      switch(m.check_kind){
        case 'owned': return true; // if we're here at all, it's unlocked
        case 'level_at_least': return ph.level >= m.check_value;
        case 'gear_equipped': return entry.gear.some(g=>g.slot==='weapon' && g.level>=1);
        case 'stars_at_least': return ph.yellow_stars >= m.check_value;
        case 'pvp_wins_at_least': return ph.pvp_wins >= m.check_value;
        default: return false;
      }
    };

    missions.forEach(m=>{
      const done = checkDone(m);
      const progressRow = (entry.devProgress||[]).find(p=>p.step_index===m.step_index);
      const claimed = !!(progressRow && progressRow.claimed);
      const canClaim = done && !claimed;
      const item = m.reward_item || {};
      const rewardParts = [];
      if(item.parts) rewardParts.push('+'+item.parts+' деталей');
      if(item.yellow_puzzles) rewardParts.push('+'+item.yellow_puzzles+' жёлтых пазлов');
      if(item.weapon_mats) rewardParts.push('+'+item.weapon_mats+' материалов оружия');
      if(item.armor_mats) rewardParts.push('+'+item.armor_mats+' материалов брони');
      if(item.universal_mats) rewardParts.push('+'+item.universal_mats+' универсальных материалов');
      const row = document.createElement('div');
      row.className = 'devmission-row'+(claimed?' done':'');
      row.innerHTML = `
        <div class="dm-check">${claimed?'✓':(done?'●':'')}</div>
        <div class="dm-body">
          <div class="dm-desc">${m.step_index+1}. ${escapeHtml(m.description)}</div>
          <div class="dm-reward">НАГРАДА: ${escapeHtml(rewardParts.join(' · ')||'—')}</div>
        </div>
        ${canClaim ? '<button class="dm-claim">ЗАБРАТЬ</button>' : ''}`;
      if(canClaim){
        const btn = row.querySelector('.dm-claim');
        btn.onclick = async ()=>{
          btn.disabled = true;
          const { error } = await window.Database.claimHeroDevMission(heroId, m.step_index);
          if(error){ toast(error.userMessage||'Не удалось получить награду'); btn.disabled=false; return; }
          Audio_.ok(); toast('МИССИЯ ВЫПОЛНЕНА');
          HeroUI.openDetail(heroId);
        };
      }
      wrap.appendChild(row);
    });

    const allDone = missions.length>0 && missions.every(m=>checkDone(m));
    const allClaimed = missions.length>0 && missions.every(m=>{
      const p = (entry.devProgress||[]).find(x=>x.step_index===m.step_index);
      return p && p.claimed;
    });
    const bonusClaimed = (entry.devProgress||[]).some(p=>p.step_index===-1 && p.claimed);

    if(allClaimed && !bonusClaimed){
      const bonusRow = document.createElement('div');
      bonusRow.className = 'devmission-row';
      bonusRow.style.borderColor = 'var(--amber)';
      bonusRow.innerHTML = `
        <div class="dm-check" style="border-color:var(--amber); color:var(--amber);">★</div>
        <div class="dm-body">
          <div class="dm-desc" style="color:var(--amber);">ГЕРОЙ ПОЛНОСТЬЮ РАЗВИТ</div>
          <div class="dm-reward">НАГРАДА: +2000 кредитов · +60 универсальных материалов</div>
        </div>
        <button class="dm-claim">ЗАБРАТЬ</button>`;
      bonusRow.querySelector('.dm-claim').onclick = async ()=>{
        const { error } = await window.Database.claimHeroFullyDeveloped(heroId);
        if(error){ toast(error.userMessage||'Не удалось получить бонус'); return; }
        Audio_.unlock(); toast('ГЕРОЙ ПОЛНОСТЬЮ РАЗВИТ! Бонус получен.');
        HeroUI.openDetail(heroId);
      };
      wrap.appendChild(bonusRow);
    } else if(allClaimed && bonusClaimed){
      const doneRow = document.createElement('div');
      doneRow.className = 'dim mono';
      doneRow.style.cssText = 'text-align:center; font-size:11px; padding:10px 0;';
      doneRow.textContent = '★ ГЕРОЙ ПОЛНОСТЬЮ РАЗВИТ ★';
      wrap.appendChild(doneRow);
    }
  },

  async unlockHero(heroId){
    const btn = document.getElementById('hero-unlock-btn');
    if(btn) btn.disabled = true;
    const { error } = await window.Database.unlockHero(heroId);
    if(error){ toast(error.userMessage || 'Не удалось разблокировать героя'); if(btn) btn.disabled=false; return; }
    Audio_.unlock();
    toast('ГЕРОЙ РАЗБЛОКИРОВАН: '+HeroUI.entry(heroId).def.name);
    HeroUI.openDetail(heroId);
  },

  async levelUp(heroId){
    const btn = document.getElementById('hero-levelup-btn');
    if(btn) btn.disabled = true;
    const before = this.entry(heroId).playerHero.power;
    const { error } = await window.Database.levelUpHero(heroId);
    if(error){ toast(error.userMessage || 'Не удалось повысить уровень'); if(btn) btn.disabled=false; return; }
    const after = this.entry(heroId).playerHero.power;
    Audio_.ok();
    toast('УРОВЕНЬ ПОВЫШЕН · СИЛА '+before+' → '+after);
    HeroUI.openDetail(heroId);
  },

  async starUp(heroId){
    const btn = document.getElementById('hero-starup-btn');
    if(btn) btn.disabled = true;
    const before = this.entry(heroId).playerHero.power;
    const { error } = await window.Database.starUpHero(heroId);
    if(error){ toast(error.userMessage || 'Не удалось повысить звезду'); if(btn) btn.disabled=false; return; }
    const after = this.entry(heroId).playerHero.power;
    Audio_.ok();
    toast('ЗВЕЗДА ПОВЫШЕНА · СИЛА '+before+' → '+after);
    HeroUI.openDetail(heroId);
  },

  async upgradeGear(heroId, slot){
    const before = this.entry(heroId).playerHero.power;
    const { error } = await window.Database.upgradeGear(heroId, slot);
    if(error){ toast(error.userMessage || 'Не удалось улучшить экипировку'); return; }
    const after = this.entry(heroId).playerHero.power;
    Audio_.ok();
    const names = {weapon:'ОРУЖИЕ', gloves:'ПЕРЧАТКИ', vest:'ЖИЛЕТ', pants:'ШТАНЫ'};
    toast(names[slot]+' УЛУЧШЕН · СИЛА '+before+' → '+after);
    HeroUI.openDetail(heroId);
  },

  async upgradeTalent(heroId, talentId){
    const { error } = await window.Database.upgradeTalent(heroId, talentId);
    if(error){ toast(error.userMessage || 'Не удалось улучшить талант'); return; }
    Audio_.ok();
    toast('ТАЛАНТ УЛУЧШЕН');
    HeroUI.openDetail(heroId);
  },

  renderWarehouse(){
    const res = window.GameData.resources;
    const main = document.getElementById('warehouse-main');
    if(!res){ main.innerHTML = '<p class="dim" style="text-align:center; padding:14px 0;">ЗАГРУЗКА...</p>'; return; }
    main.innerHTML = `
      <div class="wh-box"><div class="wh-icon">💰</div><div class="wh-val">${res.credits.toLocaleString('ru-RU')}</div><div class="wh-lbl">КРЕДИТЫ</div></div>
      <div class="wh-box"><div class="wh-icon">🔫</div><div class="wh-val">${res.weapon_mats.toLocaleString('ru-RU')}</div><div class="wh-lbl">МАТЕРИАЛЫ ОРУЖИЯ</div></div>
      <div class="wh-box"><div class="wh-icon">🛡</div><div class="wh-val">${res.armor_mats.toLocaleString('ru-RU')}</div><div class="wh-lbl">МАТЕРИАЛЫ БРОНИ</div></div>
      <div class="wh-box"><div class="wh-icon">⚙️</div><div class="wh-val">${res.universal_mats.toLocaleString('ru-RU')}</div><div class="wh-lbl">УНИВЕРСАЛЬНЫЕ</div></div>`;
    const heroesWrap = document.getElementById('warehouse-heroes');
    heroesWrap.innerHTML = '';
    (window.GameData.heroes||[]).forEach(entry=>{
      const { def, playerHero: ph } = entry;
      const row = document.createElement('div');
      row.className = 'wh-hero-row';
      if(ph && ph.is_unlocked){
        row.innerHTML = `<div class="whr-name">${def.name}</div><div class="whr-vals">Жёлт. пазлы ${ph.yellow_puzzles} · Красн. ${ph.red_puzzles}</div>`;
      } else {
        row.innerHTML = `<div class="whr-name">${def.name} 🔒</div><div class="whr-vals">Детали ${ph?ph.parts:0}/100</div>`;
      }
      heroesWrap.appendChild(row);
    });
  }
};
function statLine(label, value, last){
  return `<div class="stat-line"${last?' style="border-bottom:none;"':''}><div class="sl-label">${label}</div><div class="sl-value">${value}</div></div>`;
}

function statLine(label, value, last){
  return `<div class="stat-line"${last?' style="border-bottom:none;"':''}><div class="sl-label">${label}</div><div class="sl-value">${value}</div></div>`;
}

/* ---------------- FRIENDS ---------------- */
const FriendsUI = {
  render(){
    document.getElementById('friend-add-btn').onclick = ()=> this.addFriend();
    this.renderList();
  },
  addFriend(){
    const nameInput = document.getElementById('friend-add-name');
    const serverInput = document.getElementById('friend-add-server');
    const name = nameInput.value.trim();
    const server = serverInput.value.trim().replace(/[^0-9]/g,'');
    if(!name){ toast('ВВЕДИ ПОЗЫВНОЙ'); return; }
    if(!server){ toast('ВВЕДИ НОМЕР СЕРВЕРА'); return; }
    const exists = state.friends.some(f=>f.name.toLowerCase()===name.toLowerCase() && f.server===server);
    if(exists){ toast('ЭТОТ ВЫЖИВШИЙ УЖЕ В СПИСКЕ'); return; }
    state.friends.push({ id:'fr_'+Date.now(), name, server, addedAt:new Date().toISOString() });
    const isFirstFriend = state.friends.length===1 && !state.achievements.SOCIAL;
    if(isFirstFriend){ state.achievements.SOCIAL = true; }
    saveState();
    Audio_.ok();
    toast(isFirstFriend ? 'ДОСТИЖЕНИЕ: НЕ ОДИН · ДОБАВЛЕНО В ДРУЗЬЯ' : 'ДОБАВЛЕНО В ДРУЗЬЯ');
    nameInput.value=''; serverInput.value='';
    this.renderList();
  },
  removeFriend(id){
    state.friends = state.friends.filter(f=>f.id!==id);
    saveState();
    this.renderList();
  },
  renderList(){
    const wrap = document.getElementById('friends-list');
    wrap.innerHTML = '';
    if(!state.friends.length){
      wrap.innerHTML = '<p class="dim" style="font-size:12.5px; text-align:center; padding:16px 0;">СПИСОК ДРУЗЕЙ ПУСТ.</p>';
      return;
    }
    state.friends.forEach(f=>{
      const row = document.createElement('div');
      row.className = 'friend-row';
      row.innerHTML = `
        <div class="avatar-circle avatar-sm" style="cursor:default;">${DEFAULT_AVATAR_SVG}</div>
        <div class="fr-info">
          <div class="fr-name">${escapeHtml(f.name)}</div>
          <div class="fr-server">SERVER #${escapeHtml(f.server)}</div>
        </div>
        <button class="fr-remove">УДАЛИТЬ</button>`;
      row.querySelector('.fr-remove').onclick = ()=> FriendsUI.removeFriend(f.id);
      wrap.appendChild(row);
    });
  }
};

/* ================= BATTLE ENGINE (turn-based PvP, local bots) ================= */
const HERO_ABILITY_FN = {
  craig(attacker, defender){
    const lowHp = defender.hp/defender.maxHp < 0.4;
    const res = Battle.performAttack(attacker, defender, {dmgMult: lowHp ? 1.95 : 1.5});
    return Object.assign(res, {text: lowHp ? 'усиленная АТАКА по ослабленному противнику' : 'мощная атака'});
  },
  leon(attacker){
    attacker.shieldAbsorb = 0.35; attacker.shieldTurns = 2;
    attacker.ultimate = Math.min(100, attacker.ultimate+6);
    return {hit:true, selfBuff:true, text:'получает щит, поглощающий 35% урona на 2 хода'};
  },
  sofia(attacker, defender){
    let healPct = 0.2 * (1 + Battle.talentBonus(attacker,'medic')/100);
    const cm = Battle.counterMods(attacker, defender);
    healPct *= (1+cm.healBonus);
    const heal = Math.round(attacker.maxHp*healPct);
    attacker.hp = Math.min(attacker.maxHp, attacker.hp+heal);
    const spdBonusPct = 15 + Battle.talentBonus(attacker,'stimulant');
    attacker.spdBuffTurns = 2; attacker.spdBuffBonus = Math.round(attacker.spd*spdBonusPct/100);
    attacker.ultimate = Math.min(100, attacker.ultimate+6);
    return {hit:true, selfBuff:true, heal, text:'восстанавливает '+heal+' HP и ускоряется'};
  },
  mark(attacker, defender){
    const res = Battle.performAttack(attacker, defender, {dmgMult:1, criticalBonus:50, critTrueDamagePct:0.10});
    return Object.assign(res, {text:'точный выстрел'});
  }
};
const Battle = {
  // ---------------------------------------------------------------------
  // AUDIT NOTE: this module used to run a full local turn-based
  // simulation (buildFighter/performAttack/playerAction/botTurn/...)
  // and decide win/loss itself using client-side RNG. That is exactly
  // the "client determines the winner" hole the audit was asked to
  // close — resolve_pvp_battle_bot() in Supabase already existed and
  // already did this correctly, it just was never called from here.
  //
  // The fix: the server decides the entire outcome (win/loss, rating
  // change, damage/turns/crits, rewards) in one authoritative call
  // BEFORE any animation happens. The client's job is now to reveal
  // that already-decided result, not to compute one of its own. The
  // old per-turn action buttons (attack/ability/defend/ultimate) are
  // gone because there is nothing left for them to decide — see
  // README.md "Что реально сделано" for the fuller explanation and the
  // documented upgrade path to a real per-turn server round-trip later.
  // ---------------------------------------------------------------------

  state: null,

  async start(heroId, bot) {
    const entry = HeroUI.entry(heroId);
    const def = entry ? entry.def : { name: '???' };
    document.getElementById('battle-title').textContent = def.name + ' VS ' + bot.name;
    document.getElementById('battle-turn-counter').textContent = '';
    document.getElementById('battle-hp-player').innerHTML = this.hpBlock({ name: def.name, hp: 1, maxHp: 1, isBot: false, ultimate: 0 });
    document.getElementById('battle-hp-enemy').innerHTML = this.hpBlock({ name: bot.name, hp: 1, maxHp: 1, isBot: true, ultimate: 0 });
    document.getElementById('battle-log').innerHTML = '<div class="dim mono" style="text-align:center; padding:18px 0;">СЕРВЕР ОБРАБАТЫВАЕТ БОЙ...</div>';
    document.getElementById('battle-actions-wrap').innerHTML = '';
    document.getElementById('battle-result-wrap').innerHTML = '';
    Nav.go('battle');

    if (!window.PvP || !window.AuthState || !window.AuthState.user) {
      toast('PvP недоступен: нет соединения с сервером.');
      Nav.go('pvp');
      return;
    }

    const { data: result, error } = await window.PvP.fight(heroId, bot.power);
    if (error) {
      toast(error.userMessage || 'Не удалось провести бой.');
      Nav.go('pvp');
      return;
    }

    this.revealServerResult(result, def, bot);
  },

  /** Turns the already-decided server result into the same visual
   * battle-log + HP-bar + result-panel presentation the old local
   * engine used, so the screen still feels like "last asylum combat"
   * even though nothing is computed client-side anymore. */
  revealServerResult(result, def, bot) {
    const won = result.result === 'win';
    const draw = result.result === 'draw';

    const playerFinalPct = won ? 100 : (draw ? 50 : 0);
    const enemyFinalPct = won ? 0 : (draw ? 50 : 100);

    document.getElementById('battle-hp-player').innerHTML = this.hpBlock({
      name: def.name, hp: playerFinalPct, maxHp: 100, isBot: false, ultimate: 100
    });
    document.getElementById('battle-hp-enemy').innerHTML = this.hpBlock({
      name: bot.name, hp: enemyFinalPct, maxHp: 100, isBot: true, ultimate: 100
    });
    document.getElementById('battle-turn-counter').textContent = 'ХОДОВ: ' + result.turns;

    const log = window.PvP.buildReplayLog(result);
    const logBox = document.getElementById('battle-log');
    logBox.innerHTML = log.map(l => `<div class="${l.cls === 'me' ? 'lg-me' : l.cls === 'enemy' ? 'lg-enemy' : ''}">${escapeHtml(l.text)}</div>`).join('');

    const wrap = document.getElementById('battle-result-wrap');
    wrap.innerHTML = `
      <div class="battle-result-panel">
        <div class="br-title ${draw ? '' : (won ? 'win' : 'lose')}">${draw ? 'НИЧЬЯ' : (won ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ')}</div>
        ${!draw ? `<div class="dim mono" style="font-size:12px; margin-top:6px;">РЕЙТИНГ ${result.rating_change > 0 ? '+' : ''}${result.rating_change} → ${result.rating}</div>` : ''}
        <div class="br-stats">
          <div class="brs-box"><div class="v">${result.damage_dealt}</div><div class="l">УРОН НАНЕСЁН</div></div>
          <div class="brs-box"><div class="v">${result.damage_taken}</div><div class="l">УРОН ПОЛУЧЕН</div></div>
          <div class="brs-box"><div class="v">${result.crits}</div><div class="l">КРИТ. УДАРОВ</div></div>
          <div class="brs-box"><div class="v">${result.abilities_used}</div><div class="l">СПОСОБНОСТЕЙ</div></div>
          <div class="brs-box"><div class="v">${result.turns}</div><div class="l">ХОДОВ</div></div>
          <div class="brs-box"><div class="v">${result.reward_credits}</div><div class="l">КРЕДИТЫ НАГРАДА</div></div>
        </div>
        <button class="btn solid" id="battle-finish-btn">ЗАВЕРШИТЬ</button>
      </div>`;
    document.getElementById('battle-finish-btn').onclick = () => Nav.go('pvp');

    if (won && !state.achievements.FIRST_PVP_WIN) {
      state.achievements.FIRST_PVP_WIN = true; saveState();
      toast('ДОСТИЖЕНИЕ: ПЕРВАЯ КРОВЬ');
    }
  },

  hpBlock(f) {
    const pct = Math.max(0, Math.round((f.hp / f.maxHp) * 100));
    const fillClass = f.isBot ? 'enemy' : (pct < 30 ? 'low' : '');
    return `
      <div class="hp-bar-wrap">
        <div class="hp-bar-head"><span class="hp-name">${escapeHtml(f.name)}${f.isBot ? ' <span style="color:var(--danger)">BOT</span>' : ''}</span><span class="hp-nums">${pct}%</span></div>
        <div class="hp-track"><div class="hp-fill ${fillClass}" style="width:${pct}%"></div></div>
      </div>`;
  }
};


/* ---------------- CHAT (local test only, no networking) ---------------- */
const ChatUI = {
  // AUDIT NOTE: this used to be a local array (state.chatMessages) that
  // only ever talked to itself — "СООБЩЕНИЯ НЕ ОТПРАВЛЯЮТСЯ ДРУГИМ
  // ВЫЖИВШИМ" was literally true. Rewired to window.Chat, which is
  // backed by the real chat_messages table + a Realtime subscription
  // (see js/chat.js and supabase/patch_001_audit_fixes.sql — Realtime
  // was never turned on for this table before the patch, so even a
  // correctly-wired subscription would have received nothing).
  subscribed:false,

  async render(){
    document.getElementById('chat-send-btn').onclick = ()=> this.send();
    const input = document.getElementById('chat-input');
    input.onkeydown = (e)=>{ if(e.key==='Enter') this.send(); };

    await window.Chat.loadRecent(50);
    this.renderMessages();

    if(!this.subscribed){
      window.Chat.subscribe(()=> this.renderMessages());
      this.subscribed = true;
    }
  },

  async send(){
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;
    input.disabled = true;
    const { error } = await window.Chat.send(text);
    input.disabled = false;
    if(error){ toast(error.userMessage || 'Не удалось отправить сообщение'); return; }

    if(!state.achievements.CHATTY){
      state.achievements.CHATTY = true; saveState();
      setTimeout(()=>toast('ДОСТИЖЕНИЕ: НА СВЯЗИ'), 200);
    }
    input.value = '';
    Audio_.tap();
    // Realtime subscription will also deliver this message back to us
    // and re-render; render once immediately too so it feels instant.
    this.renderMessages();
  },

  renderMessages(){
    const wrap = document.getElementById('chat-messages');
    if(!wrap) return;
    wrap.innerHTML = '';
    const myId = window.AuthState.user && window.AuthState.user.id;
    (window.Chat.messages||[]).forEach(m=>{
      if(m.is_deleted) return;
      const isMe = m.user_id === myId;
      const author = m.profiles || {};
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble' + (isMe ? ' me' : '');
      bubble.innerHTML = `
        <div class="cb-avatar">${isMe ? Avatar.markup() : DEFAULT_AVATAR_SVG}</div>
        <div class="cb-body">
          <div class="cb-name">${escapeHtml(isMe ? (state.name||'ТЫ') : (author.username||'???'))}</div>
          <div class="cb-text">${escapeHtml(m.message)}${m.edited_at ? ' <span class="dim" style="font-size:9px;">(ред.)</span>' : ''}</div>
          <div class="cb-time">${formatShortTime(m.created_at)}</div>
        </div>`;
      if(isMe){
        bubble.querySelector('.cb-avatar').onclick = ()=> Nav.go('profile');
        bubble.querySelector('.cb-name').onclick = ()=> Nav.go('profile');
      }
      wrap.appendChild(bubble);
    });
    const scroller = document.getElementById('chat-scroll');
    if(scroller) scroller.scrollTop = scroller.scrollHeight;
  },

  async shareAchievement(ach){
    const text = '🏆 ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО: '+ach.title+' — '+ach.desc;
    const { error } = await window.Chat.send(text);
    if(error){ toast(error.userMessage || 'Не удалось отправить в чат'); return; }
    if(!state.achievements.BRAGGART){ state.achievements.BRAGGART = true; saveState(); }
    toast('ДОСТИЖЕНИЕ ОТПРАВЛЕНО В ЧАТ');
    Nav.go('chat');
  }
};
function formatShortTime(iso){
  const d = new Date(iso);
  const pad = n=>String(n).padStart(2,'0');
  return pad(d.getHours())+':'+pad(d.getMinutes());
}



/* ---------------- QUEST / PUZZLE ENGINE ---------------- */
const Quest = {
  currentBranchId:null,
  currentPuzzleId:null,

  openBranch(branchId){
    this.currentBranchId = branchId;
    const b = findBranch(branchId);
    document.getElementById('quest-branch-title').textContent = 'ВЕТКА '+toRoman(b.order)+' · '+b.title;
    const wrap = document.getElementById('quest-list-wrap');
    wrap.innerHTML = `<p class="dim" style="font-size:12.5px; margin-bottom:16px;">${b.intro}</p>`;
    const seq = getBranchSequence(b);
    seq.forEach(item=>{
      if(item.type==='puzzle'){
        const p = b.puzzles.find(pp=>pp.id===item.id);
        const i = b.puzzles.indexOf(p);
        const solved = !!state.solvedPuzzles[p.id];
        const row = document.createElement('div');
        row.className = 'puzzle-row'+(solved?' solved':'');
        row.innerHTML = `<div class="idx">${solved?'✓':(i+1)}</div>
          <div class="body"><div class="t">${p.title}</div><div class="s">${p.fileTag}</div></div>
          <div class="chev">›</div>`;
        row.onclick = ()=>{ Audio_.tap(); Quest.openPuzzle(p.id); };
        wrap.appendChild(row);
      } else {
        const t = (b.sideTasks||[]).find(tt=>tt.id===item.id);
        const done = !!state.sideTasksDone[t.id];
        const row = document.createElement('div');
        row.className = 'puzzle-row sidetask-row'+(done?' solved':'');
        row.innerHTML = `<div class="idx">${done?'✓':'📸'}</div>
          <div class="body"><div class="t">${t.title}</div><div class="s">ЗАДАНИЕ ИЗ ИГРЫ</div></div>
          <div class="chev">›</div>`;
        row.onclick = ()=>{ Audio_.tap(); Quest.openSideTask(t.id); };
        wrap.appendChild(row);
      }
    });
    const allSolved = b.puzzles.every(p=>state.solvedPuzzles[p.id]);
    const finalBtn = document.createElement('button');
    finalBtn.className = 'btn solid';
    finalBtn.style.marginTop = '18px';
    finalBtn.textContent = state.branches[b.id].completed ? 'ПРОТОКОЛ ЗАВЕРШЁН ✓' : 'FINAL PROTOCOL';
    if(!allSolved){ finalBtn.disabled = true; finalBtn.textContent = 'FINAL PROTOCOL (СОБЕРИ ВСЕ ФРАГМЕНТЫ)'; }
    finalBtn.onclick = ()=> Quest.openFinal(b.id);
    wrap.appendChild(finalBtn);
    Nav.go('quest');
  },

  openPuzzle(puzzleId){
    const found = findPuzzle(puzzleId);
    if(!found) return;
    const {puzzle:p, branch:b} = found;
    this.currentPuzzleId = puzzleId;
    document.getElementById('puzzle-branch-title').textContent = b.title;
    document.getElementById('puzzle-file-tag').textContent = p.fileTag;
    document.getElementById('puzzle-tokens').textContent = '💠 '+state.branches[b.id].hintsLeft;
    document.getElementById('puzzle-feedback').className = 'feedback';
    document.getElementById('puzzle-feedback').innerHTML = '';
    document.getElementById('puzzle-hint-box').className = 'hint-box';
    document.getElementById('puzzle-hint-box').innerHTML = '';
    document.getElementById('puzzle-nav-row').style.display = 'none';
    document.getElementById('puzzle-hint-btn').style.display = '';

    const body = document.getElementById('puzzle-body');
    const alreadySolved = !!state.solvedPuzzles[p.id];
    let inner = `<h3 style="font-size:15px; color:var(--text-dim); margin-bottom:10px;">${p.title}</h3>
      <div class="doc-panel"><div class="q-text">${escapeHtml(p.question)}</div></div>`;

    if(p.type==='text'){
      inner += `<input type="text" class="answer-input" id="ans-input" placeholder="ВВЕДИ ОТВЕТ" autocomplete="off" autocapitalize="off" ${alreadySolved?'disabled':''}>
        <button class="btn solid" id="ans-submit" ${alreadySolved?'disabled':''}>ПРОВЕРИТЬ</button>`;
    } else if(p.type==='mc'){
      inner += `<div id="mc-opts">` + p.options.map((o,i)=>`<button class="mc-opt" data-i="${i}">${escapeHtml(o)}</button>`).join('') + `</div>`;
    } else if(p.type==='order'){
      inner += `<div class="order-hint">ПОСЛЕДОВАТЕЛЬНОСТЬ (нажимай, чтобы добавить)</div>
        <div class="order-seq" id="order-seq"></div>
        <div class="order-hint">ЭЛЕМЕНТЫ</div>
        <div class="order-pool" id="order-pool"></div>
        <button class="btn solid" id="order-submit" style="margin-top:10px;">ПРОВЕРИТЬ</button>
        <button class="btn ghost" id="order-clear" style="margin-top:8px;">ОЧИСТИТЬ</button>`;
    } else if(p.type==='truefalse'){
      inner += `<div id="tf-list">` + p.statements.map((s,i)=>`<button class="doc-stmt" data-i="${i}"><span class="num">${i+1}.</span>${escapeHtml(s)}</button>`).join('') + `</div>`;
    }
    body.innerHTML = inner;

    if(alreadySolved){
      showFeedback(true, `✓ VERIFIED — ДАННЫЕ УЖЕ ПОДТВЕРЖДЕНЫ РАНЕЕ.\nФРАГМЕНТ: [ ${p.reward} ]`, p);
      Quest.setupNavRow(b);
    }

    if(p.type==='text' && !alreadySolved){
      const input = document.getElementById('ans-input');
      const submit = document.getElementById('ans-submit');
      const doCheck = ()=>Quest.checkText(p,b,input.value);
      submit.onclick = doCheck;
      input.onkeydown = (e)=>{ if(e.key==='Enter') doCheck(); };
    }
    if(p.type==='mc' && !alreadySolved){
      document.querySelectorAll('#mc-opts .mc-opt').forEach(btn=>{
        btn.onclick = ()=> Quest.checkMC(p,b,parseInt(btn.dataset.i,10));
      });
    }
    if(p.type==='order' && !alreadySolved){
      this._orderPool = p.items.slice();
      this._orderSeq = [];
      renderOrderUI();
      document.getElementById('order-submit').onclick = ()=> Quest.checkOrder(p,b);
      document.getElementById('order-clear').onclick = ()=>{ this._orderPool = p.items.slice(); this._orderSeq=[]; renderOrderUI(); };
    }
    if(p.type==='truefalse' && !alreadySolved){
      document.querySelectorAll('#tf-list .doc-stmt').forEach(btn=>{
        btn.onclick = ()=> Quest.checkTF(p,b,parseInt(btn.dataset.i,10));
      });
    }

    const hintBtn = document.getElementById('puzzle-hint-btn');
    hintBtn.onclick = ()=> Quest.useHint(p,b);
    updateHintButton(p,b);

    Nav.go('puzzle');
  },

  checkText(p,b,val){
    const norm = normalize(val);
    const ok = p.accepted.some(a=>normalize(a)===norm);
    if(ok){ Quest.markSolved(p,b); }
    else { Quest.markMistake(p,b, 'ARCHIVE REJECTS THIS ANSWER.'); }
  },
  checkMC(p,b,idx){
    document.querySelectorAll('#mc-opts .mc-opt').forEach(el=>el.onclick=null);
    const btns = document.querySelectorAll('#mc-opts .mc-opt');
    btns[idx].classList.add('selected');
    if(idx===p.correctIndex){
      btns[idx].classList.add('correct');
      Quest.markSolved(p,b);
    } else {
      btns[idx].classList.add('wrong');
      if(!state.achievements.FALSE_TRAIL){ state.achievements.FALSE_TRAIL = true; saveState(); toast('ДОСТИЖЕНИЕ: ЛОЖНЫЙ СЛЕД'); }
      Quest.markMistake(p,b,'ЭТО ЛОЖНЫЙ СЛЕД. ПОПРОБУЙ ЕЩЁ РАЗ.', true, ()=>{
        btns.forEach(el=>{ el.onclick = ()=> Quest.checkMC(p,b,parseInt(el.dataset.i,10)); el.classList.remove('wrong','correct','selected'); });
      });
    }
  },
  checkTF(p,b,idx){
    document.querySelectorAll('#tf-list .doc-stmt').forEach(el=>el.onclick=null);
    const btns = document.querySelectorAll('#tf-list .doc-stmt');
    btns[idx].classList.add('selected');
    if(idx===p.falseIndex){
      btns[idx].classList.add('correct');
      Quest.markSolved(p,b);
    } else {
      btns[idx].classList.add('wrong');
      Quest.markMistake(p,b,'ЭТО УТВЕРЖДЕНИЕ ПРАВДИВО. ИЩИ ДРУГОЕ.', true, ()=>{
        btns.forEach(el=>{ el.onclick = ()=> Quest.checkTF(p,b,parseInt(el.dataset.i,10)); el.classList.remove('wrong','correct','selected'); });
      });
    }
  },
  checkOrder(p,b){
    const seq = this._orderSeq;
    if(seq.length !== p.correctOrder.length){ toast('РАССТАВЬ ВСЕ ЭЛЕМЕНТЫ'); return; }
    const ok = seq.every((v,i)=>v===p.correctOrder[i]);
    if(ok){ Quest.markSolved(p,b); }
    else { Quest.markMistake(p,b,'ПОРЯДОК НЕВЕРЕН. ПЕРЕСМОТРИ ЛОГИКУ.'); }
  },

  markMistake(p,b, msg, keepInteractive, restoreFn){
    state.totalMistakes++; state.branches[b.id].mistakes++;
    saveState();
    Audio_.bad(); glitchFlash();
    showFeedback(false, '✕ ACCESS DENIED\n'+msg, p);
    if(restoreFn){ setTimeout(restoreFn, 1100); }
  },

  markSolved(p,b){
    Audio_.ok();
    state.solvedPuzzles[p.id] = true;
    state.symbols.push({ value:p.reward, branchLabel:b.title.split(' ')[0], puzzleId:p.id, date:new Date().toISOString() });
    const beforeLvl = levelInfo(state.xp).level;
    const xpGain = PUZZLE_XP[b.order] || 10;
    state.xp = (state.xp||0) + xpGain;
    const afterLvl = levelInfo(state.xp).level;
    if(p.trap && !state.achievements.WRONG_QUESTION){
      state.achievements.WRONG_QUESTION = true; toast('ДОСТИЖЕНИЕ: НЕ ТОТ ВОПРОС');
    }
    if(state.symbols.length >= TOTAL_PUZZLES && !state.achievements.ARCHIVIST){
      state.achievements.ARCHIVIST = true; toast('ДОСТИЖЕНИЕ: АРХИВАРИУС');
    }
    if(totalSolvedCount()===1 && !state.achievements.FIRST_STEPS){
      state.achievements.FIRST_STEPS = true; toast('ДОСТИЖЕНИЕ: ПЕРВЫЕ ШАГИ');
    }
    const hourNow = new Date().getHours();
    if(hourNow>=0 && hourNow<5 && !state.achievements.NIGHT_OWL){
      state.achievements.NIGHT_OWL = true; toast('ДОСТИЖЕНИЕ: НОЧНОЙ ДОЗОР');
    }
    checkLevelAchievements(afterLvl);
    saveState();
    showFeedback(true, '✓ VERIFIED\nДАННЫЕ ПОДТВЕРЖДЕНЫ\nПОЛУЧЕН ФРАГМЕНТ', p, true, xpGain);
    Quest.setupNavRow(b);
    if(afterLvl>beforeLvl){ setTimeout(()=>toast('⬆ УРОВЕНЬ ПОВЫШЕН — LVL '+afterLvl), 600); }
  },

  setupNavRow(b){
    const row = document.getElementById('puzzle-nav-row');
    row.style.display = 'flex';
    const seq = getBranchSequence(b);
    const idx = seq.findIndex(it=>it.id===this.currentPuzzleId);
    const hasNext = idx>=0 && idx < seq.length-1;
    const contBtn = document.getElementById('puzzle-continue-btn');
    if(hasNext){ contBtn.textContent = 'ДАЛЬШЕ →'; }
    else if(b.puzzles.every(pp=>state.solvedPuzzles[pp.id])){ contBtn.textContent = 'FINAL PROTOCOL →'; }
    else { contBtn.textContent = 'К СПИСКУ ФРАГМЕНТОВ →'; }
  },

  goNextPuzzle(){
    const b = findBranch(this.currentBranchId);
    const seq = getBranchSequence(b);
    const idx = seq.findIndex(it=>it.id===this.currentPuzzleId);
    if(idx>=0 && idx < seq.length-1){
      const nextItem = seq[idx+1];
      if(nextItem.type==='puzzle'){ Quest.openPuzzle(nextItem.id); }
      else { Quest.openSideTask(nextItem.id); }
    } else if(b.puzzles.every(pp=>state.solvedPuzzles[pp.id])){
      Quest.openFinal(b.id);
    } else {
      Quest.openBranch(b.id);
    }
  },
  goToMenu(){ Quest.openBranch(this.currentBranchId); },

  openSideTask(taskId){
    const found = findSideTask(taskId);
    if(!found) return;
    const {task:t, branch:b} = found;
    this.currentBranchId = b.id;
    this.currentPuzzleId = t.id;
    document.getElementById('puzzle-branch-title').textContent = b.title;
    document.getElementById('puzzle-file-tag').textContent = 'ЗАДАНИЕ ИЗ ИГРЫ';
    document.getElementById('puzzle-tokens').textContent = '';
    document.getElementById('puzzle-feedback').className = 'feedback';
    document.getElementById('puzzle-feedback').innerHTML = '';
    document.getElementById('puzzle-hint-box').className = 'hint-box';
    document.getElementById('puzzle-hint-box').innerHTML = '';
    document.getElementById('puzzle-nav-row').style.display = 'none';
    document.getElementById('puzzle-hint-btn').style.display = 'none';

    const done = !!state.sideTasksDone[t.id];
    const body = document.getElementById('puzzle-body');
    body.innerHTML = `
      <h3 style="font-size:15px; color:var(--text-dim); margin-bottom:10px;">${t.title}</h3>
      <div class="doc-panel"><div class="q-text">Выполни в игре Last Asylum: Plague:<br><br><strong style="color:var(--accent);">${escapeHtml(t.description)}</strong></div></div>
      <div class="doc-panel" style="border-color:rgba(231,178,58,.4); background:rgba(231,178,58,.05);">
        <div class="q-text" style="color:var(--amber); font-size:12.5px;">📸 Это задание выполняется в самой игре, а не в архиве. Сделай скриншот подтверждения и загрузи его сюда.<br><br>На время тестирования задание засчитывается автоматически сразу после загрузки скриншота — без ручной проверки модератором.</div>
      </div>
      ${done ? '' : '<button class="btn solid" id="task-upload-btn" style="margin-top:14px;">ЗАГРУЗИТЬ СКРИНШОТ</button><input type="file" id="task-file-input" accept="image/*" style="display:none;">'}
    `;

    if(done){
      const fb = document.getElementById('puzzle-feedback');
      fb.className = 'feedback show ok';
      fb.innerHTML = '✓ ПОДТВЕРЖДЕНО<br>СКРИНШОТ ПРИНЯТ. ЗАДАНИЕ ЗАСЧИТАНО.';
      Quest.setupNavRow(b);
    } else {
      document.getElementById('task-upload-btn').onclick = ()=> document.getElementById('task-file-input').click();
      document.getElementById('task-file-input').onchange = (e)=> Quest.completeSideTask(t, b, e);
    }
    Nav.go('puzzle');
  },

  completeSideTask(t, b, e){
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    if(!f.type.startsWith('image/')){ toast('ЗАГРУЗИ ФАЙЛ ИЗОБРАЖЕНИЯ (СКРИНШОТ)'); return; }
    state.sideTasksDone[t.id] = new Date().toISOString();
    state.xp = (state.xp||0) + SIDE_TASK_XP;
    grantHeroReward({credits:250, weaponMats:8, armorMats:8, puzzles:4, toOwnedHero:true});
    saveState();
    Audio_.ok();
    const fb = document.getElementById('puzzle-feedback');
    fb.className = 'feedback show ok';
    fb.innerHTML = '✓ СКРИНШОТ ЗАГРУЖЕН<br>ЗАДАНИЕ АВТОМАТИЧЕСКИ ЗАСЧИТАНО<br><span style="color:var(--text-dim); font-size:10.5px;">(тестовый режим: ручная проверка модератором пока не требуется)</span>'
      + `<div class="reward-xp" style="margin-top:8px;">+${SIDE_TASK_XP} XP · +250 кредитов · +4 пазла герою</div>`;
    const uploadBtn = document.getElementById('task-upload-btn');
    if(uploadBtn) uploadBtn.style.display = 'none';
    Quest.setupNavRow(b);
  },


  openFinal(branchId){
    const b = findBranch(branchId);
    document.getElementById('final-branch-title').textContent = 'ВЕТКА '+toRoman(b.order)+' · '+b.title;
    document.getElementById('final-tokens').textContent = '💠 '+state.branches[b.id].hintsLeft;
    document.getElementById('final-feedback').className = 'feedback';
    document.getElementById('final-feedback').innerHTML = '';
    document.getElementById('final-hint-box').className = 'hint-box';
    document.getElementById('final-hint-box').innerHTML = '';
    this._finalBranch = b;
    this._finalPool = b.puzzles.map(p=>p.reward);
    this._finalSeq = [];
    renderFinalUI();
    document.getElementById('final-check-btn').onclick = ()=> Quest.checkFinal(b);
    document.getElementById('final-clear-btn').onclick = ()=>{ this._finalPool = b.puzzles.map(p=>p.reward); this._finalSeq=[]; renderFinalUI(); };
    document.getElementById('final-hint-btn').onclick = ()=> Quest.useFinalHint(b);
    this._finalHintIndex = state['finalHint_'+b.id] || 0;
    updateFinalHintButton(b);
    Nav.go('final');
  },

  useFinalHint(b){
    const key = 'finalHint_'+b.id;
    const used = state[key] || 0;
    if(used >= b.finalHints.length){ toast('ПОДСКАЗКИ ИСЧЕРПАНЫ'); return; }
    if(state.branches[b.id].hintsLeft <= 0){ toast('ANALYSIS TOKENS ИСЧЕРПАНЫ'); return; }
    state[key] = used+1;
    state.branches[b.id].hintsLeft--;
    state.totalHintsUsed++;
    saveState();
    const box = document.getElementById('final-hint-box');
    box.classList.add('show');
    box.innerHTML += (box.innerHTML?'<br><br>':'') + 'ПОДСКАЗКА '+(used+1)+': '+escapeHtml(b.finalHints[used]);
    document.getElementById('final-tokens').textContent = '💠 '+state.branches[b.id].hintsLeft;
    updateFinalHintButton(b);
  },

  checkFinal(b){
    const seq = this._finalSeq;
    if(seq.length !== b.finalCodeOrder.length){ toast('ИСПОЛЬЗУЙ ВСЕ СИМВОЛЫ'); return; }
    const ok = seq.every((v,i)=>v===b.finalCodeOrder[i]);
    const fb = document.getElementById('final-feedback');
    if(ok){
      Audio_.unlock();
      state.branches[b.id].completed = true;
      const beforeLvl = levelInfo(state.xp).level;
      const xpGain = FINAL_XP[b.order] || 30;
      state.xp = (state.xp||0) + xpGain;
      const afterLvl = levelInfo(state.xp).level;
      if(state.branches[b.id].mistakes===0 && !state.achievements.NO_MISTAKES){
        state.achievements.NO_MISTAKES = true; toast('ДОСТИЖЕНИЕ: БЕЗ ОШИБОК');
      }
      const nextBranch = DATA.branches.find(x=>x.order===b.order+1);
      let unlockAt = null;
      if(nextBranch){
        unlockAt = nextUnlockTimestamp(Date.now());
        state.branches[nextBranch.id].unlockAt = unlockAt;
        state.branches[nextBranch.id].unlocked = false;
      }
      const allDone = DATA.branches.every(x=>state.branches[x.id].completed);
      if(allDone && state.totalHintsUsed<=2 && !state.achievements.PARANOID){
        state.achievements.PARANOID = true; toast('ДОСТИЖЕНИЕ: ПАРАНОИК');
      }
      if(allDone && !state.achievements.COMPLETIONIST){
        state.achievements.COMPLETIONIST = true; toast('ДОСТИЖЕНИЕ: РАССЛЕДОВАНИЕ ЗАВЕРШЕНО');
      }
      checkLevelAchievements(afterLvl);
      const heroCredits = 1200*b.order;
      grantHeroReward({credits:heroCredits, universalMats:25, weaponMats:15, armorMats:15, parts:15, puzzles:12, toOwnedHero:true});
      saveState();
      fb.className = 'feedback show ok';
      fb.innerHTML = 'SEQUENCE VERIFIED\n█████████████ 100%\nARCHIVE DECRYPTED — NEW DATA FOUND'
        + `<div class="reward-xp" style="margin-top:8px;">+${xpGain} XP БОНУС ЗА ПРОТОКОЛ</div>`
        + `<div class="reward-xp">+${heroCredits} кредитов · +15 деталей герою · +12 пазлов</div>`;
      if(afterLvl>beforeLvl){ setTimeout(()=>toast('⬆ УРОВЕНЬ ПОВЫШЕН — LVL '+afterLvl), 400); }
      setTimeout(()=>{
        if(nextBranch){ UI.showUnlock('ПРОТОКОЛ ЗАКРЫТ', 'ВЕТКА '+toRoman(nextBranch.order)+' «'+nextBranch.title+'» БУДЕТ ОТКРЫТА '+formatMsk(unlockAt)+'.'); }
        else { UI.showUnlock('РАССЛЕДОВАНИЕ ЗАВЕРШЕНО', 'Все известные ветки архива раскрыты. Дальнейшие данные — CLASSIFIED.'); }
      }, 700);
    } else {
      Audio_.bad(); glitchFlash();
      fb.className = 'feedback show bad';
      fb.innerHTML = 'ACCESS DENIED\nTHE ARCHIVE REJECTS THIS SEQUENCE.\nВЫ СОБРАЛИ СИМВОЛЫ. НО НЕ ПОНЯЛИ ИХ.';
    }
  }
};

function renderOrderUI(){
  const pool = document.getElementById('order-pool');
  const seq = document.getElementById('order-seq');
  pool.innerHTML = ''; seq.innerHTML = '';
  Quest._orderPool.forEach((item, i)=>{
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = item;
    chip.onclick = ()=>{
      Audio_.tap();
      Quest._orderSeq.push(item);
      Quest._orderPool.splice(i,1);
      renderOrderUI();
    };
    pool.appendChild(chip);
  });
  Quest._orderSeq.forEach((item, i)=>{
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = (i+1)+'. '+item;
    chip.onclick = ()=>{
      Audio_.tap();
      Quest._orderPool.push(item);
      Quest._orderSeq.splice(i,1);
      renderOrderUI();
    };
    seq.appendChild(chip);
  });
}

function renderFinalUI(){
  const pool = document.getElementById('final-pool');
  const seq = document.getElementById('final-seq');
  pool.innerHTML = ''; seq.innerHTML = '';
  Quest._finalPool.forEach((val, i)=>{
    const chip = document.createElement('div');
    chip.className = 'chip symbol';
    chip.textContent = val;
    chip.onclick = ()=>{
      Audio_.tap();
      Quest._finalSeq.push(val);
      Quest._finalPool.splice(i,1);
      renderFinalUI();
    };
    pool.appendChild(chip);
  });
  Quest._finalSeq.forEach((val, i)=>{
    const chip = document.createElement('div');
    chip.className = 'chip symbol';
    chip.textContent = val;
    chip.onclick = ()=>{
      Audio_.tap();
      Quest._finalPool.push(val);
      Quest._finalSeq.splice(i,1);
      renderFinalUI();
    };
    seq.appendChild(chip);
  });
}

function updateHintButton(p,b){
  const used = state.hintsUsedByPuzzle[p.id] || 0;
  const btn = document.getElementById('puzzle-hint-btn');
  const solved = !!state.solvedPuzzles[p.id];
  btn.disabled = solved || used>=p.hints.length || state.branches[b.id].hintsLeft<=0;
  btn.textContent = 'ПОДСКАЗКА ('+used+'/'+p.hints.length+')';
}
function updateFinalHintButton(b){
  const used = state['finalHint_'+b.id] || 0;
  const btn = document.getElementById('final-hint-btn');
  btn.disabled = used>=b.finalHints.length || state.branches[b.id].hintsLeft<=0;
  btn.textContent = 'ПОДСКАЗКА ('+used+'/'+b.finalHints.length+')';
}

function showFeedback(ok, text, p, withReward, xpGain){
  const fb = document.getElementById('puzzle-feedback');
  fb.className = 'feedback show '+(ok?'ok':'bad');
  let html = escapeHtml(text).replace(/\n/g,'<br>');
  if(withReward){
    html += `<div class="reward-chip">${p.reward}</div>`;
    if(xpGain){ html += `<div class="reward-xp">+${xpGain} XP</div>`; }
    html += `<div style="margin-top:6px; color:var(--text-dim); font-size:11px;">${escapeHtml(p.lore||'')}</div>`;
  }
  fb.innerHTML = html;
}

/* ---------------- BOOT SEQUENCE ---------------- */
const BOOT_LINES = [
  'CONNECTION ESTABLISHED...',
  'UNKNOWN ARCHIVE DETECTED.',
  'LAST ASYLUM DATABASE.',
  'ACCESS LEVEL: RESTRICTED.'
];
function runBoot(){
  const el = document.getElementById('boot-lines');
  el.innerHTML = '';
  let i = 0;
  function next(){
    if(i>=BOOT_LINES.length){
      document.getElementById('boot-start').classList.add('show');
      return;
    }
    const line = document.createElement('span');
    line.className = 'ln';
    line.innerHTML = BOOT_LINES[i] + '<span class="cursor-blink">&nbsp;</span>';
    el.appendChild(line);
    requestAnimationFrame(()=> line.classList.add('show'));
    i++;
    setTimeout(next, 650);
  }
  setTimeout(next, 400);
}

/* ---------------- GAME BOOTSTRAP ---------------- */
const Game = {
  init(){
    loadState();
    Game.ensureRole();
    if(state.registered && !state.heroesInit){ initHeroSystem(); }
    if(state.registered){ ensureHeroFields(); }
    runBoot();

    document.getElementById('boot-start').onclick = ()=>{
      Audio_.tap();
      if(state.registered){ Nav.go('hub'); }
      else { Nav.go('reg'); }
    };

    // easter egg: tap boot glyph 5 times
    let eggEl = document.getElementById('boot-glyph-click');
    eggEl.onclick = ()=>{
      state.eggClicks++;
      if(state.eggClicks>=5 && !state.eggFound){
        state.eggFound = true;
        if(!state.achievements.NOT_TRUST_EYES){ state.achievements.NOT_TRUST_EYES = true; }
        document.getElementById('egg-text').classList.add('show');
        Audio_.unlock();
      }
      saveState();
    };

    document.getElementById('avatar-file-input').addEventListener('change', Avatar.onFile);
    Avatar.renderAll();

    document.getElementById('reg-name').addEventListener('input', updateRegPreview);
    document.getElementById('reg-alliance').addEventListener('input', updateRegPreview);
    document.getElementById('reg-submit').onclick = async ()=>{
      const server = ServerPicker.selected;
      const realUsername = window.GameData.profile ? window.GameData.profile.username : '';
      const name = realUsername || document.getElementById('reg-name').value.trim();
      const alliance = document.getElementById('reg-alliance').value.trim().toUpperCase();
      if(!server){ toast('ВЫБЕРИ НОМЕР СЕРВЕРА'); return; }
      if(!name){ toast('ВВЕДИ ПОЗЫВНОЙ'); return; }
      state.server = 'SERVER #'+server;
      state.name = name;
      state.allianceTag = alliance;
      state.registered = true;
      state.startTime = state.startTime || Date.now();
      Game.ensureRole();
      initHeroSystem();
      if(alliance && !state.achievements.ALLY){ state.achievements.ALLY = true; }
      saveState();
      Audio_.unlock();

      // AUDIT FIX: this screen used to only ever touch local `state` —
      // server_number/alliance_tag on the real Supabase profile were
      // never written, so "Профиль" and any future multiplayer surface
      // would never see them. Username itself is NOT re-submitted here:
      // it was already chosen once, uniquely, at Supabase sign-up
      // (see js/authgate.js) — asking for a second, unrelated local
      // "nickname" was a leftover from before accounts existed.
      if(window.Database && window.AuthState && window.AuthState.user){
        const { error } = await window.Database.updateProfileFields({
          server_number: parseInt(server, 10),
          alliance_tag: alliance || null
        });
        if(error){ console.error('[reg-submit] profile sync failed:', error.raw); }
      }

      RoleUI.showReveal();
    };

    document.getElementById('sound-toggle').onclick = ()=>{
      state.soundOn = !state.soundOn;
      saveState();
      document.getElementById('sound-toggle').classList.toggle('on', state.soundOn);
      if(state.soundOn){ Audio_.ok(); }
    };

    document.getElementById('reset-btn').onclick = ()=> UI.openOverlay('overlay-confirm');

    document.getElementById('settings-alliance').addEventListener('change', async (e)=>{
      state.allianceTag = e.target.value.trim().toUpperCase().slice(0,5);
      e.target.value = state.allianceTag;
      let newAlly = false;
      if(state.allianceTag && !state.achievements.ALLY){ state.achievements.ALLY = true; newAlly = true; }
      saveState();
      if(window.Database && window.AuthState && window.AuthState.user){
        const { error } = await window.Database.updateProfileFields({ alliance_tag: state.allianceTag || null });
        if(error){ console.error('[settings-alliance] profile sync failed:', error.raw); }
      }
      if(newAlly){ toast('ДОСТИЖЕНИЕ: СОЮЗНИК · ТЕГ АЛЬЯНСА ОБНОВЛЁН'); }
      else { toast(state.allianceTag ? 'ТЕГ АЛЬЯНСА ОБНОВЛЁН' : 'ТЕГ АЛЬЯНСА УДАЛЁН'); }
    });

    setInterval(()=>{
      if(Nav.current==='hub'){ UI.renderHub(); }
    }, 30000);

    if(state.registered){
      Nav.go('hub');
    }
  },
  ensureRole(){
    // Role-assignment safety check: if a profile exists but somehow has no role
    // (e.g. an older save, or an interrupted registration), grant one silently now.
    if(state.registered && !state.role){
      state.role = pickRole();
      saveState();
    }
  },
  resetProgress(){
    localStorage.removeItem(SAVE_KEY);
    state = defaultState();
    UI.closeOverlay();
    ServerPicker.selected = null;
    const srvBtn = document.getElementById('reg-server-btn');
    srvBtn.textContent = 'ВЫБРАТЬ СЕРВЕР (1–300)';
    srvBtn.classList.remove('chosen');
    document.getElementById('reg-name').value='';
    document.getElementById('reg-alliance').value='';
    document.getElementById('reg-preview').style.display='none';
    document.getElementById('egg-text').classList.remove('show');
    ChatUI.seeded = false;
    Avatar.renderAll();
    Nav.go('boot');
    runBoot();
  }
};

function updateRegPreview(){
  const server = ServerPicker.selected;
  const name = document.getElementById('reg-name').value.trim();
  const alliance = document.getElementById('reg-alliance').value.trim();
  const pv = document.getElementById('reg-preview');
  if(server || name){
    pv.style.display = 'block';
    document.getElementById('pv-server').textContent = server ? ('SERVER #'+server) : 'SERVER #___';
    document.getElementById('pv-name').textContent = name || 'SURVIVOR NAME';
    const allianceRow = document.getElementById('pv-alliance-row');
    if(alliance){ allianceRow.style.display = 'flex'; document.getElementById('pv-alliance').textContent = '['+alliance.toUpperCase()+']'; }
    else { allianceRow.style.display = 'none'; }
  } else {
    pv.style.display = 'none';
  }
}

// Game.init() is now called by js/authgate.js once Supabase confirms
// there's a logged-in session — see that file for the auth-gate screen
// that runs before this point. (Previously this file called
// Game.init() unconditionally at load; that line moved so a real
// account is required before the game boots.)
window.startLastAsylumGame = Game.init;

