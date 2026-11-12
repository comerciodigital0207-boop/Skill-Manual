/* Currículo: 5 niveles (A1 → C1) × 8 unidades × 5 días = 200 clases.
   Cada unidad: gramática, vocabulario, quiz, speaking, tarea escrita y búsquedas de recursos. */
window.CURRICULUM = [
  // ───────────────────────────── A1 · Fundamentos (desde cero, 100% práctico) ─────────────────────────────
  {
    id: "a1-1", level: "A1", title: "Hello! Me presento",
    grammar: {
      name: "Verb to be: I am / you are + My name is",
      explain: "Para presentarte usa <b>I'm</b> (yo soy/estoy). Es la forma corta de <i>I am</i> y es la que usan los nativos al hablar. <b>My name is...</b> = me llamo. <b>Nice to meet you</b> = mucho gusto. Aprende las frases completas, como bloques, sin traducir palabra por palabra.",
      examples: ["Hi! I'm Laura.", "My name is Laura.", "Nice to meet you.", "How are you? — I'm fine, thanks. And you?"]
    },
    sound: "“I'm” suena <b>aim</b>. “Nice to meet you” se dice unido: <b>naistumíchu</b>. En inglés las palabras se pegan; imita el audio, no la escritura.",
    vocab: [["Hi / Hello", "hola", "Hi! How are you?"], ["I'm...", "yo soy / estoy", "I'm Laura."], ["My name is...", "me llamo...", "My name is Laura."], ["Nice to meet you", "mucho gusto", "Nice to meet you, Tom."], ["How are you?", "¿cómo estás?", "Hi Tom, how are you?"], ["I'm fine, thanks", "estoy bien, gracias", "I'm fine, thanks. And you?"], ["See you!", "¡nos vemos!", "See you tomorrow!"], ["Excuse me", "disculpe", "Excuse me, are you Tom?"]],
    quiz: [
      { q: "Hi! ___ Laura.", o: ["I'm", "I", "My", "Am"], a: 0 },
      { q: "___ name is Carlos.", o: ["I", "My", "Me", "I'm"], a: 1 },
      { q: "How are you? — ___", o: ["I'm fine, thanks.", "I'm Laura.", "Nice to meet you.", "See you!"], a: 0 },
      { q: "Mucho gusto =", o: ["See you", "Nice to meet you", "Excuse me", "How are you?"], a: 1 }
    ],
    speaking: "Introduce yourself: say hello, your name, how you are and say goodbye.",
    model: "Hi! I'm Laura. Nice to meet you. I'm fine, thanks. And you? See you!",
    writing: "Escribe 4-5 frases presentándote (saludo, nombre, cómo estás, despedida).",
    yt: "how to introduce yourself in english for beginners", sp: "english for absolute beginners podcast"
  },
  {
    id: "a1-2", level: "A1", title: "About me",
    grammar: {
      name: "To be: he/she is, negative & questions",
      explain: "<b>I'm / you're / he's / she's / we're / they're</b>. Negativo: añade <b>not</b> → <i>I'm not tired</i>, <i>she isn't here</i>. Pregunta: invierte → <i>Are you from Colombia? Is she a teacher?</i> Para la edad se usa <i>to be</i>: <i>I'm 30</i> (no 'I have 30').",
      examples: ["I'm from Colombia.", "I'm 32 years old.", "Are you a teacher? — No, I'm not. I'm a nurse.", "She's my sister. She isn't married."]
    },
    sound: "Contracciones: <b>you're</b> (yor), <b>she's</b> (shiis), <b>isn't</b> (ísent). Úsalas siempre al hablar: suenan naturales.",
    vocab: [["I'm from...", "soy de...", "I'm from Medellín."], ["I'm ... years old", "tengo ... años", "I'm 28 years old."], ["Where are you from?", "¿de dónde eres?", "Where are you from, Tom?"], ["What do you do?", "¿a qué te dedicas?", "What do you do? — I'm a nurse."], ["married / single", "casado / soltero", "I'm single."], ["I live in...", "vivo en...", "I live in Bogotá."], ["sister / brother", "hermana / hermano", "She's my sister."], ["job", "trabajo", "I like my job."]],
    quiz: [
      { q: "I ___ 30 years old.", o: ["have", "am", "is", "are"], a: 1 },
      { q: "___ you from Mexico?", o: ["Is", "Are", "Do", "Am"], a: 1 },
      { q: "She ___ married.", o: ["isn't", "aren't", "not", "don't"], a: 0 },
      { q: "¿A qué te dedicas? =", o: ["Where are you from?", "What do you do?", "How old are you?", "Who are you?"], a: 1 }
    ],
    speaking: "Talk about you: where you are from, where you live, your age, your job and your family.",
    model: "I'm Laura. I'm from Colombia and I live in Medellín. I'm 32 years old. I'm a nurse. I have one sister. She's 28.",
    writing: "Escribe 6 frases sobre ti: de dónde eres, dónde vives, tu edad, tu trabajo y tu familia.",
    yt: "verb to be english beginners", sp: "learn english beginner conversations"
  },
  {
    id: "a1-3", level: "A1", title: "Numbers & time",
    grammar: {
      name: "Question words: what, where, when, who, how much",
      explain: "Las preguntas empiezan con la palabra interrogativa: <b>What</b> (qué), <b>Where</b> (dónde), <b>When</b> (cuándo), <b>Who</b> (quién), <b>How much</b> (cuánto cuesta). La hora en inglés de EE. UU. se dice con los números seguidos: <i>It's seven (7:00) / It's seven-thirty (7:30) / It's seven forty-five (7:45)</i>. Para “en punto” se usa <i>o'clock</i> o nada.",
      examples: ["What time is it? — It's ten thirty.", "Where is the bathroom?", "How much is it? — It's five dollars.", "When is your birthday? — It's in May."]
    },
    sound: "Cuidado: <b>thirteen</b> (13, acento al final: thur-TÍIN) vs <b>thirty</b> (30, acento al inicio: THÚR-ti). Igual 14/40, 15/50.",
    vocab: [["What time is it?", "¿qué hora es?", "Excuse me, what time is it?"], ["It's ... o'clock", "son las ... en punto", "It's three o'clock."], ["seven-thirty", "siete y media (7:30)", "It's six-thirty."], ["How much is it?", "¿cuánto cuesta?", "How much is this coffee?"], ["Where is...?", "¿dónde está...?", "Where is the station?"], ["When", "cuándo", "When is the meeting?"], ["today / tomorrow", "hoy / mañana", "See you tomorrow."], ["morning / evening", "mañana / noche (tarde)", "Good morning!"]],
    quiz: [
      { q: "___ is the bathroom?", o: ["What", "Where", "When", "Who"], a: 1 },
      { q: "___ is it? — It's 10 dollars.", o: ["How much", "How many", "What time", "Where"], a: 0 },
      { q: "7:30 =", o: ["It's seven-thirty", "It's seven half", "It's thirty seven", "It's half to seven"], a: 0 },
      { q: "30 se dice:", o: ["thirteen", "thirty", "three", "third"], a: 1 }
    ],
    speaking: "Say your phone number, what time you get up, what time you go to bed, and ask the price of 3 things.",
    model: "My phone number is three one five, two four six... I get up at six thirty. I go to bed at eleven. How much is this? How much is the coffee?",
    writing: "Escribe 5 preguntas útiles con What/Where/When/How much y respóndelas.",
    yt: "telling the time in english beginners", sp: "english numbers and time beginner"
  },
  {
    id: "a1-4", level: "A1", title: "My day",
    grammar: {
      name: "Present simple: I / you / we / they",
      explain: "Para rutinas: <b>I work, I eat, I go</b>. Negativo: <b>don't</b> + verbo → <i>I don't work on Sundays</i>. Pregunta: <b>Do you...?</b> → <i>Do you like coffee? — Yes, I do / No, I don't</i>. Con estas 3 formas ya puedes hablar de tu día.",
      examples: ["I get up at six.", "I don't eat breakfast.", "Do you work on Saturdays? — Yes, I do.", "We go to the gym after work."]
    },
    sound: "<b>Don't</b> suena <b>dount</b> (con 'ou'). Las preguntas con <i>Do you...?</i> suben de tono al final.",
    vocab: [["get up", "levantarse", "I get up at 6."], ["have breakfast", "desayunar", "I have breakfast at 7."], ["go to work", "ir al trabajo", "I go to work by bus."], ["work", "trabajar", "I work in an office."], ["cook", "cocinar", "I cook dinner."], ["watch TV", "ver televisión", "I watch TV at night."], ["go to bed", "acostarse", "I go to bed at 11."], ["every day", "todos los días", "I study English every day."]],
    quiz: [
      { q: "I ___ work on Sundays.", o: ["not", "don't", "doesn't", "no"], a: 1 },
      { q: "___ you like pizza?", o: ["Are", "Do", "Is", "Does"], a: 1 },
      { q: "Do you cook? — Yes, I ___.", o: ["am", "cook", "do", "does"], a: 2 },
      { q: "Acostarse =", o: ["get up", "go to bed", "go to work", "have breakfast"], a: 1 }
    ],
    speaking: "Describe your day from morning to night using at least 6 verbs.",
    model: "I get up at six. I have breakfast and I go to work by bus. I work from eight to five. In the evening I cook dinner and I watch TV. I go to bed at eleven.",
    writing: "Escribe tu rutina en 6-8 frases (usa get up, have breakfast, go to work, go to bed...).",
    yt: "daily routine in english beginners", sp: "daily routine english podcast beginner"
  },
  {
    id: "a1-5", level: "A1", title: "Family & friends",
    grammar: {
      name: "Present simple: he / she (+s) and does",
      explain: "Con <b>he / she / it</b> el verbo lleva <b>-s</b>: <i>She works, he lives, it costs</i>. Negativo y pregunta con <b>doesn't / does</b> (y el verbo ya sin -s): <i>He doesn't work. Does she live here?</i> Es el error más común de los hispanohablantes: practícalo mucho.",
      examples: ["My mother works in a hospital.", "My brother lives in Spain.", "She doesn't drink coffee.", "Does he have children? — Yes, he does."]
    },
    sound: "La -s se pronuncia: <b>works</b> (uorks), <b>lives</b> (livs), <b>watches</b> (uáchiz). No te la comas.",
    vocab: [["mother / father", "madre / padre", "My father is 60."], ["parents", "padres", "My parents live in Cali."], ["husband / wife", "esposo / esposa", "My husband works at night."], ["children / kids", "hijos / niños", "I have two kids."], ["friend", "amigo/a", "She's my best friend."], ["lives", "vive", "My sister lives near me."], ["has", "tiene", "He has a dog."], ["likes", "le gusta", "She likes music."]],
    quiz: [
      { q: "My sister ___ in London.", o: ["live", "lives", "living", "is live"], a: 1 },
      { q: "He ___ like fish.", o: ["don't", "doesn't", "isn't", "not"], a: 1 },
      { q: "___ she have a car?", o: ["Do", "Does", "Is", "Has"], a: 1 },
      { q: "My father ___ two brothers.", o: ["have", "has", "haves", "is"], a: 1 }
    ],
    speaking: "Describe 3 people in your family or friends: where they live, what they do and what they like.",
    model: "My mother is 58. She lives in Cali and she works in a school. My brother lives in Spain. He's a chef and he likes football. My best friend is Ana. She has two kids.",
    writing: "Escribe 6-8 frases sobre tu familia (usa lives, works, has, likes y doesn't).",
    yt: "present simple third person s beginners", sp: "english podcast family vocabulary"
  },
  {
    id: "a1-6", level: "A1", title: "Survival English",
    grammar: {
      name: "Can / I'd like / I need: pedir y resolver",
      explain: "Las frases que más vas a usar al viajar o en el trabajo. Pedir: <b>Can I have...?</b> / <b>I'd like...</b> (me gustaría). Pedir ayuda: <b>Can you help me?</b> <b>Can you repeat, please?</b> <b>Can you speak more slowly?</b> Necesidad: <b>I need...</b>. <i>Can</i> no cambia nunca (no 'cans').",
      examples: ["Can I have a coffee, please?", "I'd like a table for two.", "Sorry, can you repeat that, please?", "I need help. Can you help me?"]
    },
    sound: "<b>Can</b> en frases suena débil: <b>kn</b> (“Kn I have...”). <b>Can't</b> suena fuerte: <b>kaant</b>. Así los distinguen los nativos.",
    vocab: [["Can I have...?", "¿me da...?", "Can I have the check, please?"], ["I'd like...", "me gustaría / quisiera", "I'd like a glass of water."], ["Can you help me?", "¿me puede ayudar?", "Excuse me, can you help me?"], ["Can you repeat that?", "¿puede repetir?", "Sorry, can you repeat that?"], ["more slowly", "más despacio", "Can you speak more slowly?"], ["I need...", "necesito...", "I need a taxi."], ["I don't understand", "no entiendo", "Sorry, I don't understand."], ["What does ... mean?", "¿qué significa...?", "What does 'refund' mean?"]],
    quiz: [
      { q: "___ I have a sandwich, please?", o: ["Do", "Can", "Am", "Would"], a: 1 },
      { q: "I ___ a room for two nights.", o: ["'d like", "like to", "can", "am"], a: 0 },
      { q: "No entiendo =", o: ["I don't understand", "I not understand", "I no understand", "I'm not understand"], a: 0 },
      { q: "Para pedir que hablen despacio:", o: ["Speak slow!", "Can you speak more slowly, please?", "You speak slowly", "Slowly please you"], a: 1 }
    ],
    speaking: "Role-play: you are in a café. Order food and a drink, ask the price, ask them to repeat, and ask for the check.",
    model: "Hi! Can I have a cappuccino and a sandwich, please? How much is it? Sorry, can you repeat that, please? Thank you. Can I have the check, please?",
    writing: "Escribe un diálogo corto (6-8 líneas) pidiendo algo en un café o un hotel.",
    yt: "survival english phrases for travel", sp: "travel english phrases podcast"
  },
  {
    id: "a1-7", level: "A1", title: "Home & city",
    grammar: {
      name: "There is / there are + prepositions (in, on, near)",
      explain: "<b>There is</b> (hay, singular) / <b>There are</b> (hay, plural). Pregunta: <i>Is there a bank near here?</i> Respuesta: <i>Yes, there is / No, there isn't</i>. Lugar: <b>in</b> (dentro), <b>on</b> (sobre / en la calle), <b>near</b> (cerca), <b>next to</b> (al lado).",
      examples: ["There's a park near my house.", "There are two bedrooms in my apartment.", "Is there a pharmacy near here?", "The bank is next to the supermarket."]
    },
    sound: "<b>There's</b> suena <b>ders</b> y <b>there are</b> suena <b>derar</b>. La 'th' se dice con la lengua entre los dientes.",
    vocab: [["There is / There's", "hay (singular)", "There's a café on my street."], ["There are", "hay (plural)", "There are many shops."], ["near here", "cerca de aquí", "Is there an ATM near here?"], ["next to", "al lado de", "It's next to the bank."], ["apartment", "apartamento", "My apartment is small."], ["bedroom", "habitación", "There are two bedrooms."], ["supermarket", "supermercado", "The supermarket is near."], ["street", "calle", "I live on a quiet street."]],
    quiz: [
      { q: "___ two banks on my street.", o: ["There is", "There are", "They are", "It is"], a: 1 },
      { q: "___ a pharmacy near here?", o: ["Is there", "Are there", "There is", "Has"], a: 0 },
      { q: "The café is ___ the bank.", o: ["next to", "next", "near of", "in to"], a: 0 },
      { q: "Hay un parque =", o: ["Have a park", "There's a park", "It's a park", "There are a park"], a: 1 }
    ],
    speaking: "Describe your home and your neighborhood: what there is and where things are.",
    model: "I live in an apartment. There are two bedrooms and there's a small kitchen. Near my house there's a park and a supermarket. The pharmacy is next to the bank.",
    writing: "Describe tu casa y tu barrio en 6-8 frases usando there is / there are.",
    yt: "there is there are english beginners", sp: "english podcast home and city"
  },
  {
    id: "a1-8", level: "A1", title: "Yesterday",
    grammar: {
      name: "Past basics: was / were + went, had, did",
      explain: "Pasado de <i>to be</i>: <b>I was / you were / he was</b> → <i>I was tired</i>. Verbos más usados en pasado (apréndelos ya): <b>went</b> (fui), <b>had</b> (tuve/comí), <b>did</b> (hice), <b>saw</b> (vi), <b>worked</b> (trabajé). Pregunta: <i>What did you do yesterday?</i>",
      examples: ["Yesterday I was very tired.", "I went to the supermarket.", "I had dinner with my family.", "What did you do on the weekend? — I watched a movie."]
    },
    sound: "La terminación -ed: <b>worked</b> (uorkt), <b>watched</b> (uácht), <b>played</b> (pleid). No digas “work-ed”.",
    vocab: [["yesterday", "ayer", "I was at home yesterday."], ["was / were", "fui-estuve / fuimos-estuvimos", "We were happy."], ["went", "fui (go)", "I went to the gym."], ["had", "tuve / comí (have)", "I had lunch at one."], ["did", "hice (do)", "I did my homework."], ["saw", "vi (see)", "I saw a good movie."], ["last night", "anoche", "I watched TV last night."], ["on the weekend", "el fin de semana", "What did you do on the weekend?"]],
    quiz: [
      { q: "Yesterday I ___ very busy.", o: ["am", "was", "were", "be"], a: 1 },
      { q: "I ___ to the beach last weekend.", o: ["go", "went", "goed", "was go"], a: 1 },
      { q: "What ___ you do yesterday?", o: ["do", "did", "were", "was"], a: 1 },
      { q: "Anoche =", o: ["last night", "yesterday night", "past night", "the night"], a: 0 }
    ],
    speaking: "Tell what you did yesterday from morning to night.",
    model: "Yesterday I got up at seven. I went to work and I had lunch with a friend. In the evening I was tired, so I watched a movie and I went to bed early.",
    writing: "Escribe 6-8 frases sobre lo que hiciste ayer (usa was, went, had, did, saw).",
    yt: "past simple english beginners", sp: "english podcast beginners stories"
  },
  // ───────────────────────────── A2 ─────────────────────────────
  {
    id: "a2-1", level: "A2", title: "Daily routines",
    grammar: {
      name: "Present simple vs present continuous",
      explain: "Usa el <b>present simple</b> para hábitos y verdades (<i>I work every day</i>). Usa el <b>present continuous</b> para lo que pasa ahora o es temporal (<i>I'm working from home this week</i>). Verbos de estado (know, like, want) casi nunca van en continuo.",
      examples: ["I usually get up at 6 a.m.", "She's studying for an exam right now.", "We don't eat meat on Fridays.", "Are you working today?"]
    },
    vocab: [["get up", "levantarse", "I get up at seven."], ["commute", "trayecto al trabajo", "My commute takes 40 minutes."], ["usually", "normalmente", "I usually have coffee."], ["take a shower", "ducharse", "I take a shower in the morning."], ["have lunch", "almorzar", "We have lunch at one."], ["chores", "quehaceres", "I do the chores on Sundays."], ["rarely", "rara vez", "He rarely cooks."], ["schedule", "horario", "My schedule is very busy."]],
    quiz: [
      { q: "She ___ to work by bus every day.", o: ["go", "goes", "is going", "going"], a: 1 },
      { q: "Listen! The baby ___.", o: ["cries", "cry", "is crying", "cried"], a: 2 },
      { q: "I ___ the answer.", o: ["am knowing", "know", "knowing", "knows"], a: 1 },
      { q: "What ___ you usually ___ on weekends?", o: ["are / doing", "do / do", "does / do", "do / doing"], a: 1 }
    ],
    speaking: "Describe your typical weekday from morning to night. What is different this week?",
    writing: "Escribe 80-100 palabras sobre tu rutina diaria y algo que estás haciendo diferente esta semana.",
    yt: "present simple vs present continuous english lesson", sp: "daily routine english podcast beginner"
  },
  {
    id: "a2-2", level: "A2", title: "Past stories",
    grammar: {
      name: "Past simple (regular & irregular)",
      explain: "Para acciones terminadas en el pasado. Regulares terminan en <b>-ed</b> (worked, played). Irregulares hay que memorizarlos (go → went, see → saw). Negativo e interrogativo con <b>did</b> + verbo base: <i>I didn't go. Did you see it?</i>",
      examples: ["I visited my grandparents last weekend.", "We went to the beach in July.", "Did you watch the game?", "She didn't call me yesterday."]
    },
    vocab: [["yesterday", "ayer", "I called her yesterday."], ["last weekend", "el fin de semana pasado", "What did you do last weekend?"], ["ago", "hace (tiempo)", "I moved here two years ago."], ["went", "fui/fue (go)", "We went to a concert."], ["bought", "compré (buy)", "I bought a new phone."], ["met", "conocí (meet)", "I met my wife in 2015."], ["felt", "sentí (feel)", "I felt tired."], ["trip", "viaje", "The trip was amazing."]],
    quiz: [
      { q: "I ___ a great movie last night.", o: ["see", "saw", "seen", "seeing"], a: 1 },
      { q: "___ you go to the party?", o: ["Do", "Did", "Was", "Were"], a: 1 },
      { q: "They didn't ___ the bus.", o: ["caught", "catch", "catches", "catching"], a: 1 },
      { q: "We moved here three years ___.", o: ["before", "last", "ago", "since"], a: 2 }
    ],
    speaking: "Tell a story about your last vacation or a memorable weekend. Where did you go? What happened?",
    writing: "Escribe 100 palabras contando qué hiciste el fin de semana pasado (usa al menos 6 verbos irregulares).",
    yt: "past simple irregular verbs english lesson", sp: "storytelling english podcast easy"
  },
  {
    id: "a2-3", level: "A2", title: "Future plans",
    grammar: {
      name: "Going to / will / present continuous for future",
      explain: "<b>Going to</b>: planes e intenciones (<i>I'm going to learn English</i>). <b>Will</b>: decisiones espontáneas, promesas y predicciones (<i>I'll help you</i>). <b>Present continuous</b>: citas ya organizadas (<i>I'm meeting John at 5</i>).",
      examples: ["I'm going to travel to Canada next year.", "It's cold. I'll close the window.", "We're having dinner with my parents tonight.", "I think it will rain."]
    },
    vocab: [["plan", "plan / planear", "What are your plans?"], ["next week", "la próxima semana", "I'm busy next week."], ["appointment", "cita", "I have a doctor's appointment."], ["probably", "probablemente", "I'll probably stay home."], ["goal", "meta", "My goal is to speak fluently."], ["book (v.)", "reservar", "I booked a hotel."], ["soon", "pronto", "See you soon!"], ["promise", "prometer", "I promise I'll call."]],
    quiz: [
      { q: "Look at those clouds! It ___ rain.", o: ["will", "is going to", "rains", "is raining"], a: 1 },
      { q: "The phone is ringing. I ___ get it.", o: ["'ll", "'m going to", "get", "am getting"], a: 0 },
      { q: "I ___ my dentist at 3 p.m. tomorrow. It's in my calendar.", o: ["see", "will see", "am seeing", "saw"], a: 2 },
      { q: "What ___ you going to do this summer?", o: ["do", "are", "will", "did"], a: 1 }
    ],
    speaking: "What are your plans for next month and your goals for this year? Why are they important?",
    writing: "Escribe 100 palabras sobre tus metas de este año usando going to, will y present continuous.",
    yt: "will vs going to english grammar", sp: "english podcast future plans"
  },
  {
    id: "a2-4", level: "A2", title: "Comparing things",
    grammar: {
      name: "Comparatives & superlatives",
      explain: "Adjetivos cortos: <b>-er / the -est</b> (cheap → cheaper → the cheapest). Largos: <b>more / the most</b> (expensive → more expensive). Irregulares: good → better → the best; bad → worse → the worst. Igualdad: <i>as ... as</i>.",
      examples: ["My city is bigger than yours.", "This is the most interesting book I've read.", "Coffee is not as healthy as tea.", "Today is worse than yesterday."]
    },
    vocab: [["cheaper", "más barato", "The bus is cheaper."], ["crowded", "lleno de gente", "The metro is crowded."], ["quiet", "tranquilo", "It's a quiet town."], ["the best", "el mejor", "It's the best restaurant."], ["worse", "peor", "Traffic is worse today."], ["comfortable", "cómodo", "This chair is more comfortable."], ["safe", "seguro", "Is it safe at night?"], ["as ... as", "tan ... como", "He's as tall as me."]],
    quiz: [
      { q: "Madrid is ___ than my town.", o: ["big", "bigger", "biggest", "more big"], a: 1 },
      { q: "This is ___ day of my life!", o: ["the better", "best", "the best", "the goodest"], a: 2 },
      { q: "English is not ___ difficult ___ Chinese.", o: ["so / than", "as / as", "more / than", "as / than"], a: 1 },
      { q: "This phone is ___ expensive than that one.", o: ["more", "most", "much", "the most"], a: 0 }
    ],
    speaking: "Compare your city with another city you know. Which is better to live in and why?",
    writing: "Escribe 100 palabras comparando dos lugares, dos trabajos o dos teléfonos.",
    yt: "comparatives and superlatives english lesson", sp: "english podcast comparing cities"
  },
  {
    id: "a2-5", level: "A2", title: "Food & shopping",
    grammar: {
      name: "Countable/uncountable: some, any, much, many, a lot of",
      explain: "Contables (apples) usan <b>many / a few</b>; incontables (water, money, rice) usan <b>much / a little</b>. <b>Some</b> en afirmativas y ofrecimientos, <b>any</b> en negativas y preguntas. <b>A lot of</b> sirve para ambos.",
      examples: ["There are some eggs in the fridge.", "We don't have any milk.", "How much money do you need?", "How many people are coming?"]
    },
    vocab: [["groceries", "compras del súper", "I buy groceries on Saturday."], ["receipt", "recibo", "Can I have the receipt?"], ["discount", "descuento", "Is there a discount?"], ["a bottle of", "una botella de", "A bottle of water, please."], ["a loaf of bread", "una barra de pan", "I need a loaf of bread."], ["check / bill", "la cuenta", "Can we have the check?"], ["spicy", "picante", "Is it spicy?"], ["I'd like", "me gustaría", "I'd like a coffee, please."]],
    quiz: [
      { q: "How ___ sugar do you want?", o: ["many", "much", "few", "lot"], a: 1 },
      { q: "There aren't ___ tomatoes left.", o: ["some", "any", "much", "a little"], a: 1 },
      { q: "Would you like ___ tea?", o: ["any", "some", "many", "a few"], a: 1 },
      { q: "I have ___ friends in London.", o: ["a little", "much", "a few", "any"], a: 2 }
    ],
    speaking: "Role-play: you are ordering food at a restaurant. Ask about the menu, order, and ask for the check.",
    writing: "Escribe una lista de compras y un diálogo corto (80 palabras) en una tienda o restaurante.",
    yt: "ordering food in english restaurant conversation", sp: "english podcast food and shopping"
  },
  {
    id: "a2-6", level: "A2", title: "Life experiences",
    grammar: {
      name: "Present perfect (ever / never)",
      explain: "<b>have/has + participio</b> para experiencias de vida sin decir cuándo: <i>I have been to Mexico</i>. Pregunta con <b>ever</b>: <i>Have you ever eaten sushi?</i> Negativa con <b>never</b>. Si dices cuándo (yesterday, in 2019) → past simple.",
      examples: ["I've never flown in a helicopter.", "Have you ever met a famous person?", "She has visited Paris twice.", "I went there in 2019. (cuándo → past simple)"]
    },
    vocab: [["ever", "alguna vez", "Have you ever been to Peru?"], ["never", "nunca", "I've never tried it."], ["been to", "ido a / estado en", "I've been to Brazil."], ["once / twice", "una vez / dos veces", "I've seen it twice."], ["tried", "probado", "Have you tried this?"], ["experience", "experiencia", "It was a great experience."], ["abroad", "en el extranjero", "I've never lived abroad."], ["achieve", "lograr", "I've achieved my goal."]],
    quiz: [
      { q: "Have you ever ___ to Japan?", o: ["go", "went", "been", "gone to"], a: 2 },
      { q: "I ___ that movie last week.", o: ["have seen", "saw", "seen", "have saw"], a: 1 },
      { q: "She ___ never eaten Indian food.", o: ["have", "has", "did", "is"], a: 1 },
      { q: "We've visited Rome ___.", o: ["ever", "twice", "yesterday", "ago"], a: 1 }
    ],
    speaking: "Talk about 3 things you have done in your life and 3 things you have never done but want to do.",
    writing: "Escribe 100 palabras: 'Things I have done and things I have never done'.",
    yt: "present perfect ever never english lesson", sp: "english podcast life experiences"
  },
  {
    id: "a2-7", level: "A2", title: "Rules & advice",
    grammar: {
      name: "Must / have to / should",
      explain: "<b>Must</b>: obligación del hablante o norma fuerte. <b>Have to</b>: obligación externa (<i>I have to wear a uniform</i>). <b>Don't have to</b>: no es necesario. <b>Mustn't</b>: prohibido. <b>Should</b>: consejo.",
      examples: ["You must wear a seatbelt.", "I have to work on Saturdays.", "You don't have to come if you're tired.", "You should drink more water."]
    },
    vocab: [["rule", "regla", "Those are the rules."], ["allowed", "permitido", "Smoking isn't allowed."], ["advice", "consejo", "Can I give you some advice?"], ["wear", "usar (ropa)", "You have to wear a helmet."], ["forbidden", "prohibido", "Photos are forbidden."], ["necessary", "necesario", "It isn't necessary."], ["healthy", "saludable", "You should eat healthy food."], ["deadline", "fecha límite", "The deadline is Friday."]],
    quiz: [
      { q: "You ___ smoke here. It's forbidden.", o: ["don't have to", "mustn't", "shouldn't to", "haven't"], a: 1 },
      { q: "It's Sunday, so I ___ get up early.", o: ["mustn't", "don't have to", "must", "have"], a: 1 },
      { q: "You look tired. You ___ go to bed.", o: ["should", "must to", "have", "should to"], a: 0 },
      { q: "She ___ wear a uniform at work.", o: ["have to", "has to", "must to", "musts"], a: 1 }
    ],
    speaking: "Give advice to someone who wants to learn English fast. What should and shouldn't they do?",
    writing: "Escribe 5 reglas de tu trabajo/casa y 5 consejos para un amigo que viaja a tu país.",
    yt: "must have to should english modal verbs", sp: "english podcast advice tips"
  },
  {
    id: "a2-8", level: "A2", title: "Getting around",
    grammar: {
      name: "Prepositions of place & movement + directions",
      explain: "Lugar: <b>in, on, at, next to, between, opposite</b>. Movimiento: <b>along, across, through, past, into</b>. Para dar direcciones se usa el imperativo: <i>Go straight, turn left, take the second right</i>.",
      examples: ["The bank is opposite the park.", "Go along this street and turn right.", "Walk past the church.", "The station is between the hotel and the museum."]
    },
    vocab: [["turn left/right", "girar a la izquierda/derecha", "Turn left at the lights."], ["go straight", "seguir derecho", "Go straight for two blocks."], ["corner", "esquina", "It's on the corner."], ["block", "cuadra", "Walk two blocks."], ["opposite", "enfrente de", "It's opposite the bank."], ["traffic lights", "semáforo", "Stop at the traffic lights."], ["get lost", "perderse", "I got lost."], ["How do I get to...?", "¿Cómo llego a...?", "How do I get to the station?"]],
    quiz: [
      { q: "The pharmacy is ___ the bank and the café.", o: ["between", "among", "opposite to", "across"], a: 0 },
      { q: "Walk ___ the bridge to the other side.", o: ["along", "across", "at", "on"], a: 1 },
      { q: "I'll meet you ___ the bus stop.", o: ["in", "on", "at", "into"], a: 2 },
      { q: "Excuse me, how do I ___ to the museum?", o: ["go", "arrive", "get", "come"], a: 2 }
    ],
    speaking: "Explain how to get from your home to your favorite place in your city.",
    writing: "Escribe las indicaciones (80-100 palabras) para llegar de tu casa a tu trabajo o universidad.",
    yt: "giving directions in english", sp: "travel english podcast"
  },

  // ───────────────────────────── B1 ─────────────────────────────
  {
    id: "b1-1", level: "B1", title: "Telling stories",
    grammar: {
      name: "Past continuous vs past simple",
      explain: "<b>Past continuous</b> (was/were + -ing) para la acción de fondo; <b>past simple</b> para la acción que interrumpe: <i>I was driving when the phone rang</i>. <b>While</b> suele ir con continuo, <b>when</b> con simple.",
      examples: ["I was cooking when you called.", "While we were walking, it started to rain.", "What were you doing at 8 last night?", "She fell while she was running."]
    },
    vocab: [["suddenly", "de repente", "Suddenly, the lights went out."], ["while", "mientras", "While I was waiting..."], ["meanwhile", "mientras tanto", "Meanwhile, my friend arrived."], ["eventually", "finalmente", "Eventually, we found it."], ["realize", "darse cuenta", "I realized I was lost."], ["happen", "pasar / suceder", "What happened?"], ["drop", "dejar caer", "I dropped my phone."], ["at first", "al principio", "At first, I was nervous."]],
    quiz: [
      { q: "I ___ TV when the power went out.", o: ["watched", "was watching", "am watching", "watch"], a: 1 },
      { q: "While she was jogging, she ___ an old friend.", o: ["was seeing", "saw", "sees", "has seen"], a: 1 },
      { q: "What ___ you doing at midnight?", o: ["did", "was", "were", "are"], a: 2 },
      { q: "___, I didn't like it, but now I love it.", o: ["Eventually", "At first", "Suddenly", "Meanwhile"], a: 1 }
    ],
    speaking: "Tell a story about something unexpected that happened to you. Use 'while', 'when' and 'suddenly'.",
    writing: "Escribe una historia de 150 palabras que empiece con: 'It was a normal day until...'",
    yt: "past continuous vs past simple storytelling", sp: "VOA learning english"
  },
  {
    id: "b1-2", level: "B1", title: "Recent news & changes",
    grammar: {
      name: "Present perfect vs past simple (for, since, just, already, yet)",
      explain: "Present perfect conecta pasado y presente: <b>for</b> + periodo (for 3 years), <b>since</b> + punto de inicio (since 2020), <b>just</b> (recién), <b>already</b> (ya), <b>yet</b> (todavía/ya en preguntas y negativas). Si el tiempo está terminado → past simple.",
      examples: ["I've lived here for five years.", "She has worked here since 2021.", "I've just finished my homework.", "Have you sent the email yet?"]
    },
    vocab: [["for", "durante (periodo)", "for two weeks"], ["since", "desde", "since Monday"], ["already", "ya", "I've already eaten."], ["yet", "todavía / ya", "I haven't finished yet."], ["just", "acabar de", "He's just left."], ["recently", "recientemente", "I've been busy recently."], ["so far", "hasta ahora", "So far, so good."], ["lately", "últimamente", "Have you seen her lately?"]],
    quiz: [
      { q: "I've known him ___ 2015.", o: ["for", "since", "ago", "during"], a: 1 },
      { q: "Have you finished the report ___?", o: ["already", "just", "yet", "since"], a: 2 },
      { q: "She ___ to London in 2018.", o: ["has moved", "moved", "has moving", "moves"], a: 1 },
      { q: "We've been friends ___ ten years.", o: ["since", "for", "from", "ago"], a: 1 }
    ],
    speaking: "What has changed in your life in the last year? What have you achieved so far and what haven't you done yet?",
    writing: "Escribe un email de 150 palabras a un amigo contándole las novedades de tu vida (usa for, since, just, already, yet).",
    yt: "present perfect vs past simple for since yet already", sp: "all ears english"
  },
  {
    id: "b1-3", level: "B1", title: "Possibilities & dreams",
    grammar: {
      name: "First & second conditional",
      explain: "<b>1ª condicional</b> (real/probable): If + present, will + verbo — <i>If it rains, I'll stay home</i>. <b>2ª condicional</b> (hipotética/imaginaria): If + past, would + verbo — <i>If I had more time, I would travel</i>. Con <i>be</i> se usa <b>were</b>: <i>If I were you...</i>",
      examples: ["If you study every day, you'll improve fast.", "If I won the lottery, I would buy a house.", "If I were you, I'd take the job.", "What would you do if you lost your phone?"]
    },
    vocab: [["unless", "a menos que", "I'll go unless it rains."], ["as long as", "siempre y cuando", "You can go as long as you're back by 10."], ["afford", "permitirse (pagar)", "I can't afford it."], ["chance", "oportunidad / probabilidad", "If I had the chance..."], ["imagine", "imaginar", "Imagine you could fly."], ["lottery", "lotería", "If I won the lottery..."], ["in case", "por si acaso", "Take an umbrella in case it rains."], ["dream", "sueño / soñar", "My dream is to live abroad."]],
    quiz: [
      { q: "If I ___ rich, I would travel the world.", o: ["am", "was/were", "will be", "would be"], a: 1 },
      { q: "If you heat ice, it ___.", o: ["melts", "would melt", "melted", "will melting"], a: 0 },
      { q: "If she calls, I ___ you.", o: ["tell", "would tell", "'ll tell", "told"], a: 2 },
      { q: "I won't go ___ you come with me.", o: ["if", "unless", "as long", "in case"], a: 1 }
    ],
    speaking: "What would you do if you could live in any country? What will you do if you reach B2 this year?",
    writing: "Escribe 150 palabras: 'If I could change one thing in the world...'",
    yt: "first and second conditional english", sp: "english podcast hypothetical questions"
  },
  {
    id: "b1-4", level: "B1", title: "How things are made",
    grammar: {
      name: "Passive voice (present & past)",
      explain: "Usa la pasiva cuando la acción importa más que quién la hace: <b>be + participio</b>. Presente: <i>English is spoken here</i>. Pasado: <i>The bridge was built in 1900</i>. Para mencionar quién: <b>by</b>.",
      examples: ["Coffee is grown in Colombia.", "The Mona Lisa was painted by Leonardo.", "The emails are sent every morning.", "My car was stolen last night."]
    },
    vocab: [["produce", "producir", "Cars are produced here."], ["invent", "inventar", "The phone was invented in 1876."], ["deliver", "entregar", "The package was delivered."], ["grow", "cultivar", "Rice is grown in Asia."], ["design", "diseñar", "It was designed in Italy."], ["build / built", "construir", "The house was built in 1990."], ["factory", "fábrica", "It's made in a factory."], ["made of", "hecho de", "It's made of wood."]],
    quiz: [
      { q: "This book ___ by millions of people.", o: ["has read", "is read", "reads", "is reading"], a: 1 },
      { q: "The pyramids ___ thousands of years ago.", o: ["built", "were built", "are built", "was built"], a: 1 },
      { q: "Spanish ___ in many countries.", o: ["speaks", "is spoken", "spoken", "is speaking"], a: 1 },
      { q: "The window was broken ___ the kids.", o: ["of", "from", "by", "with"], a: 2 }
    ],
    speaking: "Describe how a typical product from your country is made (coffee, chocolate, etc.). Use the passive.",
    writing: "Escribe 150 palabras explicando un proceso (cómo se hace un plato típico o un producto) usando la voz pasiva.",
    yt: "passive voice english lesson intermediate", sp: "how things are made english podcast"
  },
  {
    id: "b1-5", level: "B1", title: "Describing people & places",
    grammar: {
      name: "Relative clauses (who, which, that, where, whose)",
      explain: "Para dar información sobre algo sin empezar otra oración: <b>who</b> (personas), <b>which</b> (cosas), <b>that</b> (ambos, informal), <b>where</b> (lugares), <b>whose</b> (posesión). Defining = sin comas; non-defining = con comas y sin <i>that</i>.",
      examples: ["The woman who lives next door is a doctor.", "This is the café where we met.", "My car, which is 10 years old, still works.", "He's the guy whose dog bit me."]
    },
    vocab: [["outgoing", "extrovertido", "She's very outgoing."], ["reliable", "confiable", "He's a reliable friend."], ["neighborhood", "barrio", "I love my neighborhood."], ["cozy", "acogedor", "It's a cozy café."], ["stubborn", "terco", "My brother is stubborn."], ["hard-working", "trabajador", "She's hard-working."], ["lively", "animado", "A lively street."], ["remind of", "recordar a", "He reminds me of my dad."]],
    quiz: [
      { q: "That's the restaurant ___ we had our first date.", o: ["which", "where", "who", "whose"], a: 1 },
      { q: "The man ___ car was stolen called the police.", o: ["who", "which", "whose", "that"], a: 2 },
      { q: "My phone, ___ I bought last year, is broken.", o: ["that", "which", "who", "where"], a: 1 },
      { q: "I have a friend ___ speaks five languages.", o: ["which", "where", "who", "whose"], a: 2 }
    ],
    speaking: "Describe a person who has influenced you and a place that is special to you.",
    writing: "Escribe 150 palabras describiendo a una persona importante en tu vida usando 5 cláusulas relativas.",
    yt: "relative clauses who which that where whose", sp: "english podcast describing people"
  },
  {
    id: "b1-6", level: "B1", title: "What people said",
    grammar: {
      name: "Reported speech (basic)",
      explain: "Para contar lo que alguien dijo, el verbo 'retrocede' un tiempo: <i>'I am tired' → She said (that) she was tired</i>. will → would, can → could, present perfect → past perfect. <b>Say</b> sin objeto; <b>tell</b> + persona.",
      examples: ["He said he was busy.", "She told me she would call later.", "They said they had finished.", "He asked me if I liked coffee."]
    },
    vocab: [["say / said", "decir", "She said it was late."], ["tell / told", "decir a alguien", "He told me the truth."], ["ask", "preguntar / pedir", "She asked me to wait."], ["explain", "explicar", "He explained the problem."], ["mention", "mencionar", "She mentioned the meeting."], ["claim", "afirmar", "He claimed he was innocent."], ["whether", "si (alternativa)", "He asked whether I was ready."], ["apparently", "al parecer", "Apparently, he quit."]],
    quiz: [
      { q: "'I'm hungry.' → He said he ___ hungry.", o: ["is", "was", "has been", "be"], a: 1 },
      { q: "She ___ me that she was leaving.", o: ["said", "told", "says", "spoke"], a: 1 },
      { q: "'I will help.' → He said he ___ help.", o: ["will", "would", "can", "is"], a: 1 },
      { q: "'Do you like jazz?' → She asked me ___ I liked jazz.", o: ["that", "if", "do", "what"], a: 1 }
    ],
    speaking: "Report a recent conversation you had with a friend, family member or colleague.",
    writing: "Escribe 150 palabras contando una conversación importante usando reported speech.",
    yt: "reported speech english grammar lesson", sp: "american english podcast"
  },
  {
    id: "b1-7", level: "B1", title: "Likes, habits & decisions",
    grammar: {
      name: "Gerunds & infinitives",
      explain: "Después de algunos verbos va <b>-ing</b> (enjoy, avoid, finish, mind, keep): <i>I enjoy reading</i>. Después de otros va <b>to + verbo</b> (want, decide, hope, plan, need): <i>I decided to quit</i>. Tras preposiciones siempre -ing: <i>I'm good at cooking</i>.",
      examples: ["I enjoy learning languages.", "She decided to change jobs.", "Do you mind waiting?", "I'm interested in improving my English."]
    },
    vocab: [["enjoy", "disfrutar", "I enjoy cooking."], ["avoid", "evitar", "Avoid eating late."], ["afford", "permitirse", "We can't afford to wait."], ["give up", "dejar / rendirse", "Don't give up learning."], ["look forward to", "esperar con ganas", "I look forward to seeing you."], ["used to", "solía", "I used to smoke."], ["keep", "seguir", "Keep practicing!"], ["manage to", "lograr", "I managed to finish."]],
    quiz: [
      { q: "I really enjoy ___ in the mountains.", o: ["to hike", "hiking", "hike", "hiked"], a: 1 },
      { q: "We decided ___ a new car.", o: ["buying", "to buy", "buy", "bought"], a: 1 },
      { q: "I'm looking forward to ___ you.", o: ["see", "seeing", "to see", "saw"], a: 1 },
      { q: "She's good at ___ problems.", o: ["solve", "to solve", "solving", "solved"], a: 2 }
    ],
    speaking: "Talk about hobbies you enjoy, things you avoid doing, and something you decided to do recently.",
    writing: "Escribe 150 palabras sobre tus hábitos: qué disfrutas, qué evitas y qué planeas aprender.",
    yt: "gerunds and infinitives english lesson", sp: "english learning for curious minds podcast"
  },
  {
    id: "b1-8", level: "B1", title: "Then and now",
    grammar: {
      name: "Used to / would / be used to / get used to",
      explain: "<b>Used to + verbo</b>: hábitos o estados pasados que ya no existen (<i>I used to live in Cali</i>). <b>Would</b>: hábitos pasados (no estados). <b>Be used to + -ing</b>: estar acostumbrado. <b>Get used to + -ing</b>: acostumbrarse.",
      examples: ["I used to play football every day.", "When I was a kid, we would visit my grandma on Sundays.", "I'm used to waking up early.", "I'm getting used to living alone."]
    },
    vocab: [["childhood", "infancia", "In my childhood..."], ["used to", "solía", "I used to be shy."], ["be used to", "estar acostumbrado", "I'm used to the cold."], ["get used to", "acostumbrarse", "You'll get used to it."], ["nowadays", "hoy en día", "Nowadays, everyone has a phone."], ["grow up", "crecer", "I grew up in a small town."], ["habit", "hábito", "It's a bad habit."], ["change", "cambio / cambiar", "Things have changed a lot."]],
    quiz: [
      { q: "I ___ have long hair when I was a teenager.", o: ["use to", "used to", "was used to", "am used to"], a: 1 },
      { q: "She's used to ___ in a big city.", o: ["live", "living", "lived", "to live"], a: 1 },
      { q: "It took me months to get used to ___ on the left.", o: ["drive", "driving", "drove", "to drive"], a: 1 },
      { q: "___ you use to play an instrument?", o: ["Do", "Did", "Were", "Are"], a: 1 }
    ],
    speaking: "How is your life different now compared to 10 years ago? What did you use to do that you don't do now?",
    writing: "Escribe 150 palabras comparando tu vida de niño/a con tu vida ahora.",
    yt: "used to vs be used to vs get used to", sp: "english podcast childhood memories"
  },

  // ───────────────────────────── B2 ─────────────────────────────
  {
    id: "b2-1", level: "B2", title: "Regrets & alternative pasts",
    grammar: {
      name: "Third & mixed conditionals",
      explain: "<b>3ª condicional</b> (pasado irreal): If + past perfect, would have + participio — <i>If I had studied, I would have passed</i>. <b>Mixta</b>: condición pasada → resultado presente: <i>If I had taken that job, I would be rich now</i>.",
      examples: ["If I had left earlier, I wouldn't have missed the flight.", "If she hadn't helped me, I would have failed.", "If I had learned English as a child, I would be fluent now.", "If he were more careful, he wouldn't have crashed."]
    },
    vocab: [["regret", "arrepentirse", "I regret not studying."], ["miss out on", "perderse (oportunidad)", "Don't miss out on this."], ["turn down", "rechazar", "I turned down the offer."], ["make a difference", "marcar la diferencia", "It made a big difference."], ["looking back", "mirando atrás", "Looking back, it was a mistake."], ["in hindsight", "en retrospectiva", "In hindsight, I should have waited."], ["luckily", "por suerte", "Luckily, nobody was hurt."], ["outcome", "resultado", "The outcome was positive."]],
    quiz: [
      { q: "If I ___ about the party, I would have gone.", o: ["knew", "had known", "would know", "have known"], a: 1 },
      { q: "If she had taken the medicine, she ___ better now.", o: ["would feel", "would have felt", "felt", "will feel"], a: 0 },
      { q: "We ___ the train if we had run.", o: ["would catch", "would have caught", "had caught", "caught"], a: 1 },
      { q: "If I ___ so lazy, I would have finished yesterday.", o: ["wasn't", "hadn't been", "wouldn't be", "am not"], a: 1 }
    ],
    speaking: "Talk about a decision that changed your life. What would have happened if you had chosen differently?",
    writing: "Escribe 180 palabras sobre una decisión importante y cómo sería tu vida si hubieras elegido distinto.",
    yt: "third conditional mixed conditionals english", sp: "speak english with vanessa"
  },
  {
    id: "b2-2", level: "B2", title: "Speculation & deduction",
    grammar: {
      name: "Modals of deduction (present & past)",
      explain: "Presente: <b>must</b> (seguro que sí), <b>might/may/could</b> (posible), <b>can't</b> (seguro que no). Pasado: modal + <b>have + participio</b>: <i>She must have forgotten. He can't have seen us. They might have missed the bus.</i>",
      examples: ["He must be tired — he worked all night.", "That can't be Anna; she's in Spain.", "I can't find my keys. I must have left them at work.", "She might have taken the wrong train."]
    },
    vocab: [["clue", "pista", "There are no clues."], ["evidence", "evidencia", "There's no evidence."], ["obviously", "obviamente", "He was obviously upset."], ["assume", "suponer", "I assume you're busy."], ["likely", "probable", "It's likely to rain."], ["no way", "imposible", "No way he did that!"], ["figure out", "averiguar", "I can't figure it out."], ["mystery", "misterio", "It's still a mystery."]],
    quiz: [
      { q: "The lights are off. They ___ be at home.", o: ["must", "can't", "should", "must have"], a: 1 },
      { q: "She's not answering. She ___ asleep.", o: ["might be", "might have", "can't have", "must have"], a: 0 },
      { q: "The ground is wet. It ___ rained last night.", o: ["must", "must have", "can't have", "might"], a: 1 },
      { q: "He ___ stolen the money — he was with me all day.", o: ["must have", "might have", "can't have", "should have"], a: 2 }
    ],
    speaking: "Look at a photo (any from your phone) and speculate: who are the people, where are they, what might have happened before?",
    writing: "Escribe 180 palabras sobre un misterio real o inventado especulando qué pudo haber pasado.",
    yt: "modals of deduction must have might have can't have", sp: "english podcast mysteries"
  },
  {
    id: "b2-3", level: "B2", title: "Experiences over time",
    grammar: {
      name: "Present perfect continuous & past perfect",
      explain: "<b>Present perfect continuous</b> (have been + -ing): acción que empezó en el pasado y sigue o acaba de terminar, enfocada en la duración: <i>I've been studying for 2 hours</i>. <b>Past perfect</b> (had + participio): algo anterior a otro momento pasado: <i>When I arrived, the film had started</i>.",
      examples: ["I've been learning English for three years.", "You look tired. Have you been running?", "By the time we got there, everyone had left.", "She had never seen snow before she moved to Canada."]
    },
    vocab: [["by the time", "para cuando", "By the time I arrived..."], ["lately", "últimamente", "I've been working a lot lately."], ["exhausted", "agotado", "I'm exhausted."], ["by then", "para entonces", "By then, it was too late."], ["ongoing", "en curso", "It's an ongoing project."], ["catch up", "ponerse al día", "Let's catch up soon."], ["burnout", "agotamiento laboral", "He suffered burnout."], ["keep up with", "mantener el ritmo", "It's hard to keep up with the news."]],
    quiz: [
      { q: "I ___ for you for over an hour!", o: ["wait", "have been waiting", "had waited", "am waiting"], a: 1 },
      { q: "When I got to the station, the train ___.", o: ["already left", "has already left", "had already left", "was leaving already"], a: 2 },
      { q: "How long ___ you been working here?", o: ["did", "have", "had", "are"], a: 1 },
      { q: "She was nervous because she ___ never flown before.", o: ["has", "had", "was", "did"], a: 1 }
    ],
    speaking: "What have you been doing lately to improve your life? Talk about something you had never done before this year.",
    writing: "Escribe 180 palabras sobre un proyecto en el que has estado trabajando y lo que habías intentado antes.",
    yt: "present perfect continuous vs past perfect", sp: "all ears english podcast"
  },
  {
    id: "b2-4", level: "B2", title: "Services & getting things done",
    grammar: {
      name: "Advanced passive & causative (have/get something done)",
      explain: "Causativo: <b>have/get + objeto + participio</b> cuando otra persona hace algo por ti: <i>I had my car repaired</i>. Pasivas impersonales: <i>It is said that... / He is believed to be...</i>. Pasiva con modales: <i>It must be done today</i>.",
      examples: ["I'm getting my hair cut tomorrow.", "We had the house painted last year.", "It is believed that the economy will grow.", "The report should be finished by Friday."]
    },
    vocab: [["repair / fix", "reparar", "I got my phone fixed."], ["haircut", "corte de pelo", "I need a haircut."], ["it is said that", "se dice que", "It is said that he's rich."], ["allegedly", "presuntamente", "He allegedly stole it."], ["estimate", "estimar", "It is estimated that..."], ["landlord", "propietario/arrendador", "The landlord fixed the roof."], ["install", "instalar", "We had solar panels installed."], ["outsource", "subcontratar", "We outsource the cleaning."]],
    quiz: [
      { q: "I need to ___ my eyes tested.", o: ["make", "have", "do", "take"], a: 1 },
      { q: "She got her car ___ yesterday.", o: ["wash", "washing", "washed", "to wash"], a: 2 },
      { q: "It ___ that the company will close.", o: ["says", "is said", "said", "is saying"], a: 1 },
      { q: "The work must ___ before Monday.", o: ["finish", "be finished", "finished", "be finishing"], a: 1 }
    ],
    speaking: "What services do you pay for? What things do you have done instead of doing them yourself? Why?",
    writing: "Escribe 180 palabras sobre una mala experiencia con un servicio (técnico, banco, restaurante) usando causativos y pasivas.",
    yt: "causative have something done get something done", sp: "business english podcast"
  },
  {
    id: "b2-5", level: "B2", title: "Wishes & complaints",
    grammar: {
      name: "Wish / if only / would rather / it's time",
      explain: "<b>Wish + past</b>: deseo sobre el presente (<i>I wish I spoke French</i>). <b>Wish + past perfect</b>: arrepentimiento del pasado (<i>I wish I had studied more</i>). <b>Wish + would</b>: queja sobre lo que otros hacen (<i>I wish you would stop</i>). <b>It's time + past</b>, <b>I'd rather + past</b> para otra persona.",
      examples: ["I wish I had more free time.", "If only I hadn't said that!", "I wish my neighbors would turn the music down.", "It's time we went home."]
    },
    vocab: [["annoying", "molesto", "It's so annoying."], ["complain", "quejarse", "Stop complaining."], ["if only", "ojalá / si tan solo", "If only I knew."], ["would rather", "preferiría", "I'd rather stay in."], ["fed up with", "harto de", "I'm fed up with traffic."], ["make up for", "compensar", "I'll make up for it."], ["get on my nerves", "sacarme de quicio", "That noise gets on my nerves."], ["frustrated", "frustrado", "I feel frustrated."]],
    quiz: [
      { q: "I wish I ___ taller.", o: ["am", "were", "will be", "had been"], a: 1 },
      { q: "I wish I ___ that car. It was a bad decision.", o: ["didn't buy", "hadn't bought", "wouldn't buy", "don't buy"], a: 1 },
      { q: "I wish you ___ interrupting me!", o: ["stop", "stopped", "would stop", "had stopped"], a: 2 },
      { q: "It's time you ___ a job.", o: ["get", "got", "will get", "have got"], a: 1 }
    ],
    speaking: "Talk about three wishes about your present, one regret about your past, and something that annoys you.",
    writing: "Escribe 180 palabras: 'Things I wish were different' (presente, pasado y quejas).",
    yt: "I wish if only grammar english", sp: "english podcast intermediate advanced"
  },
  {
    id: "b2-6", level: "B2", title: "Work & relationships",
    grammar: {
      name: "Phrasal verbs (separable & inseparable)",
      explain: "Verbo + partícula con significado nuevo. <b>Separables</b>: el objeto puede ir en medio (<i>turn the offer down / turn it down</i>, con pronombre siempre en medio). <b>Inseparables</b>: <i>look after the kids</i>, <i>get along with</i>. Son clave para entender a nativos.",
      examples: ["We need to figure out a solution.", "Can you look into the problem?", "I get along well with my boss.", "They called off the meeting."]
    },
    vocab: [["get along with", "llevarse bien con", "I get along with my team."], ["put off", "posponer", "Don't put it off."], ["call off", "cancelar", "They called off the event."], ["look into", "investigar", "We'll look into it."], ["come up with", "idear", "She came up with a plan."], ["fall out with", "pelearse con", "I fell out with my cousin."], ["take on", "asumir (trabajo)", "I took on a new project."], ["run out of", "quedarse sin", "We ran out of time."]],
    quiz: [
      { q: "We had to ___ the meeting because the boss was sick.", o: ["call off", "call on", "call up", "call in"], a: 0 },
      { q: "She ___ a brilliant idea.", o: ["came up with", "came across to", "came in", "came off"], a: 0 },
      { q: "I don't ___ well with my neighbor.", o: ["get on", "get along", "get over", "get by"], a: 1 },
      { q: "They offered me the job, but I turned ___.", o: ["down it", "it down", "it off", "off it"], a: 1 }
    ],
    speaking: "Describe your relationships at work or school. Use at least 6 phrasal verbs.",
    writing: "Escribe 180 palabras sobre un conflicto laboral y cómo se resolvió, usando 8 phrasal verbs.",
    yt: "phrasal verbs for work and relationships", sp: "phrasal verbs podcast"
  },
  {
    id: "b2-7", level: "B2", title: "Opinions & arguments",
    grammar: {
      name: "Linking words & discourse markers",
      explain: "Contraste: <b>although, even though, despite / in spite of (+ -ing/sustantivo), however, whereas</b>. Causa/efecto: <b>due to, as a result, therefore, since</b>. Adición: <b>moreover, furthermore, in addition</b>. Dan cohesión y suben tu nivel B2 en writing y speaking.",
      examples: ["Although it was raining, we went out.", "Despite being tired, she finished the race.", "The project was delayed due to bad weather.", "Prices rose; therefore, sales fell."]
    },
    vocab: [["although", "aunque", "Although it's hard, I like it."], ["despite", "a pesar de", "Despite the rain..."], ["however", "sin embargo", "However, it's expensive."], ["whereas", "mientras que", "I like tea, whereas she likes coffee."], ["therefore", "por lo tanto", "Therefore, we decided to stay."], ["moreover", "además", "Moreover, it's cheap."], ["on the other hand", "por otro lado", "On the other hand..."], ["due to", "debido a", "Due to the strike..."]],
    quiz: [
      { q: "___ the traffic, we arrived on time.", o: ["Although", "Despite", "However", "Even though"], a: 1 },
      { q: "___ he's rich, he isn't happy.", o: ["Despite", "In spite of", "Although", "However"], a: 2 },
      { q: "The flight was cancelled ___ the storm.", o: ["because", "due to", "therefore", "although"], a: 1 },
      { q: "It's a great city. ___, it's very expensive.", o: ["Moreover", "However", "Therefore", "Despite"], a: 1 }
    ],
    speaking: "Give your opinion: 'Should remote work be the norm?' Give arguments for and against using linking words.",
    writing: "Escribe un ensayo de opinión de 200 palabras: 'Social media does more harm than good'. Usa 6 conectores.",
    yt: "linking words english advanced writing", sp: "english debate podcast"
  },
  {
    id: "b2-8", level: "B2", title: "Reporting & communicating",
    grammar: {
      name: "Reporting verbs (advise, suggest, deny, admit, warn...)",
      explain: "En vez de solo 'said', usa verbos que interpretan: <b>advise/warn/remind someone to</b>, <b>suggest + -ing / that</b>, <b>deny/admit + -ing</b>, <b>refuse/agree/promise to</b>, <b>apologize for + -ing</b>, <b>accuse someone of + -ing</b>.",
      examples: ["She advised me to see a doctor.", "He denied taking the money.", "They suggested going to the beach.", "I apologized for being late."]
    },
    vocab: [["admit", "admitir", "He admitted lying."], ["deny", "negar", "She denied it."], ["warn", "advertir", "I warned you!"], ["remind", "recordar a alguien", "Remind me to call him."], ["suggest", "sugerir", "I suggest leaving early."], ["refuse", "negarse", "He refused to help."], ["accuse", "acusar", "They accused him of cheating."], ["persuade", "persuadir", "She persuaded me to come."]],
    quiz: [
      { q: "He denied ___ the window.", o: ["to break", "breaking", "break", "broke"], a: 1 },
      { q: "She suggested ___ a taxi.", o: ["to take", "taking", "us take to", "take to"], a: 1 },
      { q: "The doctor advised me ___ smoking.", o: ["stop", "stopping", "to stop", "stopped"], a: 2 },
      { q: "They accused him ___ lying.", o: ["for", "of", "about", "to"], a: 1 }
    ],
    speaking: "Report a meeting or argument you witnessed using at least 6 reporting verbs.",
    writing: "Escribe 200 palabras resumiendo una reunión o discusión usando reporting verbs (no uses 'said').",
    yt: "reporting verbs english advanced", sp: "NPR news now"
  },

  // ───────────────────────────── C1 ─────────────────────────────
  {
    id: "c1-1", level: "C1", title: "Emphasis & drama",
    grammar: {
      name: "Inversion for emphasis",
      explain: "Con adverbios negativos o restrictivos al inicio se invierte sujeto y auxiliar: <b>Never have I seen...</b>, <b>Rarely do we...</b>, <b>Not only did she..., but...</b>, <b>No sooner had I... than...</b>, <b>Under no circumstances should you...</b>. Suena formal y enfático.",
      examples: ["Never have I seen such a beautiful place.", "Not only did he arrive late, but he also forgot the documents.", "No sooner had I sat down than the phone rang.", "Under no circumstances should you share your password."]
    },
    vocab: [["seldom", "rara vez", "Seldom do we meet."], ["no sooner ... than", "apenas ... cuando", "No sooner had I left than..."], ["hardly ever", "casi nunca", "Hardly ever does it snow."], ["under no circumstances", "bajo ninguna circunstancia", "Under no circumstances..."], ["little did I know", "poco sabía yo", "Little did I know that..."], ["only then", "solo entonces", "Only then did I understand."], ["remarkable", "notable", "A remarkable achievement."], ["at no time", "en ningún momento", "At no time did I agree."]],
    quiz: [
      { q: "Never ___ such a mess!", o: ["I have seen", "have I seen", "I saw", "did I saw"], a: 1 },
      { q: "Not only ___ late, but she also forgot her ID.", o: ["she arrived", "did she arrive", "arrived she", "she did arrive"], a: 1 },
      { q: "No sooner had we arrived ___ it started to rain.", o: ["when", "that", "than", "then"], a: 2 },
      { q: "Little ___ that my life was about to change.", o: ["I knew", "did I know", "knew I", "I did know"], a: 1 }
    ],
    speaking: "Tell a dramatic personal story using at least 4 inversions (Never have I..., Little did I know..., etc.).",
    writing: "Escribe 220 palabras sobre la experiencia más sorprendente de tu vida usando 5 inversiones.",
    yt: "inversion english advanced grammar c1", sp: "english podcast advanced c1"
  },
  {
    id: "c1-2", level: "C1", title: "Focusing information",
    grammar: {
      name: "Cleft sentences",
      explain: "Para resaltar una parte: <b>It is/was ... that/who</b> (<i>It was Maria who called</i>) y <b>What ... is/was</b> (<i>What I need is a vacation</i>). También: <i>All I want is..., The thing that bothers me is..., The reason why... is that...</i>",
      examples: ["What I love about London is the diversity.", "It was in 2019 that I decided to move.", "All I want is a bit of peace.", "The reason why I'm late is that the train broke down."]
    },
    vocab: [["what I mean is", "lo que quiero decir es", "What I mean is..."], ["the thing is", "el asunto es", "The thing is, I'm busy."], ["all I need", "todo lo que necesito", "All I need is time."], ["it was ... that", "fue ... que", "It was you that helped me."], ["bother", "molestar", "What bothers me is..."], ["point out", "señalar", "I'd like to point out..."], ["highlight", "destacar", "I want to highlight..."], ["crucial", "crucial", "What's crucial is..."]],
    quiz: [
      { q: "___ I really need is a long vacation.", o: ["That", "What", "It", "Which"], a: 1 },
      { q: "It was my brother ___ broke the vase.", o: ["which", "who", "what", "whom"], a: 1 },
      { q: "All I want ___ to be happy.", o: ["are", "is", "be", "being"], a: 1 },
      { q: "___ was in Paris that they first met.", o: ["What", "There", "It", "This"], a: 2 }
    ],
    speaking: "Talk about what you love and what frustrates you about your job or studies, using cleft sentences.",
    writing: "Escribe 220 palabras sobre tus valores personales usando 6 cleft sentences.",
    yt: "cleft sentences english c1", sp: "ted talks daily"
  },
  {
    id: "c1-3", level: "C1", title: "Diplomatic language",
    grammar: {
      name: "Hedging & softening",
      explain: "Para sonar profesional y matizado: <b>It would appear/seem that...</b>, <b>tend to</b>, <b>to some extent</b>, <b>arguably</b>, <b>I'm not entirely convinced that...</b>, <b>could potentially</b>. Suaviza críticas: <i>It might be worth considering...</i>",
      examples: ["It would appear that the figures are incorrect.", "This could arguably be the best solution.", "I'm not entirely sure that's the right approach.", "It might be worth reconsidering the budget."]
    },
    vocab: [["arguably", "posiblemente / se podría decir", "Arguably, it's the best."], ["to some extent", "hasta cierto punto", "To some extent, I agree."], ["tend to", "tender a", "People tend to overspend."], ["it seems that", "parece que", "It seems that we were wrong."], ["somewhat", "algo / un tanto", "It's somewhat expensive."], ["presumably", "presumiblemente", "Presumably, he knows."], ["it's worth -ing", "vale la pena", "It's worth considering."], ["with all due respect", "con todo respeto", "With all due respect, I disagree."]],
    quiz: [
      { q: "It would ___ that there has been a mistake.", o: ["seem", "seems", "seeming", "to seem"], a: 0 },
      { q: "I agree with you ___ some extent.", o: ["in", "at", "to", "by"], a: 2 },
      { q: "It might be worth ___ another supplier.", o: ["to consider", "consider", "considering", "considered"], a: 2 },
      { q: "Which is the most diplomatic? ", o: ["Your idea is bad.", "I'm not entirely convinced this will work.", "That's wrong.", "No."], a: 1 }
    ],
    speaking: "Give diplomatic feedback on a colleague's (imaginary) proposal: point out 2 strengths and 2 weaknesses politely.",
    writing: "Escribe un email profesional de 200 palabras rechazando una propuesta de forma diplomática.",
    yt: "hedging language english diplomatic", sp: "business english pod"
  },
  {
    id: "c1-4", level: "C1", title: "Concise & elegant writing",
    grammar: {
      name: "Participle clauses",
      explain: "Reducen oraciones: <b>-ing</b> (activo/simultáneo): <i>Walking home, I saw...</i>; <b>participio</b> (pasivo): <i>Built in 1900, the house...</i>; <b>having + participio</b> (anterioridad): <i>Having finished, she left</i>. El sujeto debe ser el mismo.",
      examples: ["Feeling tired, I went to bed early.", "Written in 1949, the novel is still relevant.", "Having lived abroad, she speaks three languages.", "Not knowing what to say, he stayed silent."]
    },
    vocab: [["having done", "habiendo hecho", "Having finished, I left."], ["given that", "dado que", "Given that it's late..."], ["provided that", "siempre que", "Provided that you pay..."], ["regarding", "respecto a", "Regarding your email..."], ["concise", "conciso", "Keep it concise."], ["thereby", "de ese modo", "...thereby reducing costs."], ["notwithstanding", "no obstante", "Notwithstanding the risks..."], ["considering", "considerando", "Considering the price..."]],
    quiz: [
      { q: "___ the report, she sent it to her boss.", o: ["Have finished", "Having finished", "Finished", "To finish"], a: 1 },
      { q: "___ in 1889, the Eiffel Tower is a symbol of Paris.", o: ["Building", "Built", "Having built", "Being build"], a: 1 },
      { q: "___ what to do, he called his lawyer.", o: ["Not knowing", "Not known", "Don't knowing", "Knowing not"], a: 0 },
      { q: "___ the circumstances, you did very well.", o: ["Considered", "Considering", "Consider", "To consider"], a: 1 }
    ],
    speaking: "Summarize a news story you read recently in under 90 seconds using participle clauses.",
    writing: "Reescribe un texto de 200 palabras (tuyo de unidades anteriores) haciéndolo más conciso con participle clauses.",
    yt: "participle clauses english c1 advanced", sp: "the daily new york times"
  },
  {
    id: "c1-5", level: "C1", title: "Sounding natural",
    grammar: {
      name: "Collocations & idioms",
      explain: "Los nativos usan combinaciones fijas: <b>make a decision</b> (no 'do'), <b>heavy rain</b>, <b>strong coffee</b>, <b>pay attention</b>. Los idioms dan naturalidad: <i>a piece of cake, hit the nail on the head, the ball is in your court</i>. Apréndelos en bloque, no palabra por palabra.",
      examples: ["We need to make a decision by Friday.", "She hit the nail on the head.", "The ball is in your court now.", "Let's call it a day."]
    },
    vocab: [["make a decision", "tomar una decisión", "I made a decision."], ["take into account", "tener en cuenta", "Take it into account."], ["hit the nail on the head", "dar en el clavo", "You hit the nail on the head."], ["the ball is in your court", "te toca a ti", "Now the ball is in your court."], ["call it a day", "dar por terminado", "Let's call it a day."], ["a steep learning curve", "curva de aprendizaje dura", "It's a steep learning curve."], ["cut corners", "hacer las cosas a medias", "Don't cut corners."], ["break the ice", "romper el hielo", "A joke to break the ice."]],
    quiz: [
      { q: "We need to ___ a decision soon.", o: ["do", "make", "take out", "give"], a: 1 },
      { q: "There was ___ rain last night.", o: ["strong", "heavy", "big", "hard"], a: 1 },
      { q: "'You hit the nail on the head' means:", o: ["You made a mistake", "You were exactly right", "You worked hard", "You got hurt"], a: 1 },
      { q: "'Let's call it a day' means:", o: ["Let's start", "Let's stop working", "Let's phone someone", "Let's celebrate"], a: 1 }
    ],
    speaking: "Explain a challenge you faced at work or school using at least 5 idioms/collocations naturally.",
    writing: "Escribe 220 palabras sobre un proyecto difícil usando 8 collocations e idioms de la unidad.",
    yt: "english idioms and collocations advanced", sp: "english idioms podcast"
  },
  {
    id: "c1-6", level: "C1", title: "Talking about the future precisely",
    grammar: {
      name: "Future continuous, future perfect & nuanced futures",
      explain: "<b>Future continuous</b>: acción en progreso en un momento futuro (<i>This time tomorrow I'll be flying</i>). <b>Future perfect</b>: terminada antes de un momento (<i>By 2027 I will have reached C1</i>). Matices: <b>be about to</b> (a punto de), <b>be bound to</b> (seguro que), <b>be on the verge of</b>, <b>be due to</b>.",
      examples: ["By next year, I'll have finished my degree.", "This time next week, I'll be lying on a beach.", "The meeting is about to start.", "Prices are bound to rise."]
    },
    vocab: [["be about to", "estar a punto de", "I'm about to leave."], ["be bound to", "seguro que", "It's bound to happen."], ["on the verge of", "al borde de", "On the verge of a breakthrough."], ["be due to", "estar previsto", "The train is due to arrive at 5."], ["by then", "para entonces", "By then, I'll have moved."], ["in the long run", "a largo plazo", "In the long run, it pays off."], ["foresee", "prever", "I foresee problems."], ["forecast", "pronóstico", "The forecast is good."]],
    quiz: [
      { q: "By 2030, I ___ my own business.", o: ["will start", "will have started", "will be starting", "start"], a: 1 },
      { q: "Don't call at 8. I ___ dinner.", o: ["will have", "will be having", "have had", "am about"], a: 1 },
      { q: "Hurry up! The movie is ___ start.", o: ["bound to", "about to", "due", "on the verge"], a: 1 },
      { q: "With his talent, he's ___ succeed.", o: ["about to", "bound to", "due to", "verge to"], a: 1 }
    ],
    speaking: "Describe where you will be and what you will have achieved in 5 years. Be precise.",
    writing: "Escribe 220 palabras: 'My life in 2031' usando future perfect, future continuous y 3 expresiones de la unidad.",
    yt: "future perfect future continuous english", sp: "freakonomics radio"
  },
  {
    id: "c1-7", level: "C1", title: "Register: formal vs informal",
    grammar: {
      name: "Formal vs informal register",
      explain: "Adaptar el registro es señal de C1. Informal: phrasal verbs, contracciones (<i>get, find out, can't</i>). Formal: verbos latinos, sin contracciones (<i>obtain, discover, cannot</i>), pasivas y frases como <i>I would be grateful if..., Please do not hesitate to...</i>",
      examples: ["Informal: Can you get back to me asap?", "Formal: I would be grateful if you could reply at your earliest convenience.", "Informal: We found out that...", "Formal: It was discovered that..."]
    },
    vocab: [["obtain", "obtener (formal de get)", "To obtain a visa..."], ["inquire", "consultar (formal de ask)", "I am writing to inquire..."], ["assist", "asistir (formal de help)", "How may I assist you?"], ["regarding", "respecto a", "Regarding your request..."], ["at your earliest convenience", "lo antes posible", "Reply at your earliest convenience."], ["do not hesitate to", "no dude en", "Do not hesitate to contact me."], ["enclosed / attached", "adjunto", "Please find attached..."], ["kind regards", "saludos cordiales", "Kind regards, Ana"]],
    quiz: [
      { q: "Formal version of 'find out':", o: ["discover", "look", "see up", "get out"], a: 0 },
      { q: "'I'd be grateful if you ___ send me the details.'", o: ["can", "could", "will", "may to"], a: 1 },
      { q: "Most appropriate opening for a formal complaint:", o: ["Hey guys!", "I am writing to express my dissatisfaction with...", "What's up with...", "So, about the problem..."], a: 1 },
      { q: "Formal version of 'help':", o: ["give a hand", "assist", "back up", "help out"], a: 1 }
    ],
    speaking: "Say the same message twice: first to a friend (informal), then to a company manager (formal).",
    writing: "Escribe dos emails (120 palabras cada uno) con el mismo mensaje: uno informal a un amigo y uno formal a una empresa.",
    yt: "formal vs informal english email writing", sp: "business english podcast advanced"
  },
  {
    id: "c1-8", level: "C1", title: "Debate & persuasion",
    grammar: {
      name: "Concession, counter-argument & persuasion",
      explain: "Reconoce y rebate: <b>Admittedly / Granted, ... but...</b>, <b>While it is true that..., ...</b>, <b>Be that as it may</b>, <b>That said</b>. Persuade: <b>There is no denying that...</b>, <b>It goes without saying...</b>, <b>The bottom line is...</b>",
      examples: ["Admittedly, the plan is expensive, but it will save money in the long run.", "While it is true that AI creates risks, it also creates opportunities.", "That said, we need more data.", "The bottom line is that we cannot afford to wait."]
    },
    vocab: [["admittedly", "hay que admitir que", "Admittedly, it's risky."], ["granted", "es cierto que", "Granted, it's hard."], ["that said", "dicho esto", "That said, I still disagree."], ["be that as it may", "sea como sea", "Be that as it may, we must act."], ["there's no denying", "no se puede negar", "There's no denying that..."], ["the bottom line", "en resumidas cuentas", "The bottom line is..."], ["counterargument", "contraargumento", "A strong counterargument."], ["compelling", "convincente", "A compelling argument."]],
    quiz: [
      { q: "___, the course is expensive, but it's worth it.", o: ["Admittedly", "Moreover", "Therefore", "Whereas"], a: 0 },
      { q: "___ that technology has improved our lives.", o: ["It's no denying", "There's no denying", "There's not deny", "No denying is"], a: 1 },
      { q: "'That said' introduces:", o: ["an example", "a contrasting point", "a conclusion only", "a question"], a: 1 },
      { q: "'The bottom line is...' means:", o: ["the worst part", "the most important point", "the last line of a text", "the cheapest option"], a: 1 }
    ],
    speaking: "Debate for 2 minutes: 'AI will create more jobs than it destroys.' Concede one point and refute it.",
    writing: "Escribe un ensayo argumentativo de 250 palabras sobre un tema polémico usando 6 expresiones de concesión y persuasión.",
    yt: "how to debate in english advanced phrases", sp: "open to debate podcast"
  }
];

/* Pasos de cada unidad (5 días) */
window.DAY_PLAN = [
  { key: "learn", name: "Aprende", icon: "📘", desc: "Gramática + vocabulario nuevo + mini-quiz" },
  { key: "practice", name: "Practica", icon: "✍️", desc: "Ejercicios completos + flashcards + tarea escrita asignada" },
  { key: "listen", name: "Escucha y repite", icon: "🎧", desc: "Shadowing, dictado y recursos de YouTube/Spotify" },
  { key: "speak", name: "Habla", icon: "🎤", desc: "Speaking guiado con transcripción y feedback" },
  { key: "test", name: "Evalúa", icon: "🏁", desc: "Examen de la unidad + revisión de la tarea" }
];

/* Recursos recomendados por nivel (enlaces de búsqueda para que nunca se rompan) */
window.RESOURCES = {
  // Solo inglés norteamericano (EE. UU.)
  A1: [
    { t: "VOA Learning English – Let's Learn English (curso para principiantes, EE. UU.)", y: "VOA let's learn english level 1", s: "" },
    { t: "English with Jennifer (profesora estadounidense, desde cero)", y: "english with jennifer beginner", s: "" },
    { t: "Speak English with Tiffani (frases del día a día)", y: "speak english with tiffani beginner", s: "Speak English with Tiffani" },
    { t: "Rachel's English (pronunciación americana)", y: "rachel's english pronunciation basics", s: "" },
    { t: "Sesame Street (frases simples, inglés de EE. UU.)", y: "sesame street full episode", s: "" }
  ],
  A2: [
    { t: "VOA Learning English – Let's Learn English Level 2", y: "VOA let's learn english level 2", s: "VOA learning english" },
    { t: "Speak English with Vanessa (inglés americano natural)", y: "speak english with vanessa", s: "Speak English with Vanessa" },
    { t: "Go Natural English (expresiones de EE. UU.)", y: "go natural english", s: "" },
    { t: "Rachel's English (cómo hablan los estadounidenses)", y: "rachel's english", s: "" },
    { t: "Speak English with Tiffani – podcast diario", y: "", s: "Speak English with Tiffani" }
  ],
  B1: [
    { t: "All Ears English (podcast, conversación americana)", y: "all ears english", s: "All Ears English" },
    { t: "Speak English with Vanessa – conversaciones reales", y: "speak english with vanessa conversation", s: "" },
    { t: "Friends con subtítulos en inglés (serie de EE. UU.)", y: "friends best scenes english subtitles", s: "" },
    { t: "Rachel's English – reducciones y habla rápida", y: "rachel's english reductions", s: "" },
    { t: "VOA Learning English – noticias de EE. UU. lentas", y: "voa learning english news", s: "VOA learning english" }
  ],
  B2: [
    { t: "All Ears English", y: "all ears english", s: "All Ears English" },
    { t: "Series de EE. UU.: Modern Family, The Office, Brooklyn Nine-Nine", y: "modern family funny scenes", s: "" },
    { t: "TED-Ed (temas variados, 5 min)", y: "TED-Ed", s: "" },
    { t: "This American Life (historias reales)", y: "", s: "This American Life" },
    { t: "Jimmy Fallon / late shows (humor y conversación natural)", y: "jimmy fallon interview", s: "" }
  ],
  C1: [
    { t: "The Daily – The New York Times", y: "", s: "The Daily" },
    { t: "Freakonomics Radio", y: "", s: "Freakonomics Radio" },
    { t: "TED Talks Daily", y: "TED talks", s: "TED Talks Daily" },
    { t: "Open to Debate (debates de EE. UU.)", y: "open to debate", s: "Open to Debate" },
    { t: "NPR – noticias y entrevistas", y: "NPR interview", s: "NPR News Now" }
  ]
};

/* Traducción de cada reto de speaking, para entender exactamente qué se pide */
window.SPEAKING_ES = {
  "a1-1": "Preséntate: saluda, di tu nombre, cómo estás y despídete.",
  "a1-2": "Habla de ti: de dónde eres, dónde vives, tu edad, tu trabajo y tu familia.",
  "a1-3": "Di tu número de teléfono, a qué hora te levantas y te acuestas, y pregunta el precio de 3 cosas.",
  "a1-4": "Describe tu día de la mañana a la noche usando al menos 6 verbos.",
  "a1-5": "Describe a 3 personas de tu familia o amigos: dónde viven, qué hacen y qué les gusta.",
  "a1-6": "Actúa la escena: estás en un café. Pide comida y bebida, pregunta el precio, pide que te repitan y pide la cuenta.",
  "a1-7": "Describe tu casa y tu barrio: qué hay y dónde están las cosas.",
  "a1-8": "Cuenta lo que hiciste ayer, de la mañana a la noche.",
  "a2-1": "Describe un día normal de tu semana. ¿Qué es diferente esta semana?",
  "a2-2": "Cuenta tus últimas vacaciones o un fin de semana especial. ¿A dónde fuiste? ¿Qué pasó?",
  "a2-3": "¿Cuáles son tus planes para el próximo mes y tus metas de este año? ¿Por qué son importantes?",
  "a2-4": "Compara tu ciudad con otra que conozcas. ¿Cuál es mejor para vivir y por qué?",
  "a2-5": "Actúa la escena: pides comida en un restaurante. Pregunta por el menú, pide y solicita la cuenta.",
  "a2-6": "Habla de 3 cosas que has hecho en tu vida y 3 que nunca has hecho pero quieres hacer.",
  "a2-7": "Da consejos a alguien que quiere aprender inglés rápido. ¿Qué debería y qué no debería hacer?",
  "a2-8": "Explica cómo llegar de tu casa a tu lugar favorito de la ciudad.",
  "b1-1": "Cuenta algo inesperado que te pasó. Usa 'while', 'when' y 'suddenly'.",
  "b1-2": "¿Qué ha cambiado en tu vida el último año? ¿Qué has logrado y qué no has hecho todavía?",
  "b1-3": "¿Qué harías si pudieras vivir en cualquier país? ¿Qué harás si llegas a B2 este año?",
  "b1-4": "Describe cómo se hace un producto típico de tu país (café, chocolate…). Usa la voz pasiva.",
  "b1-5": "Describe a una persona que te ha influido y un lugar especial para ti.",
  "b1-6": "Cuenta una conversación reciente con un amigo, familiar o compañero (lo que te dijo).",
  "b1-7": "Habla de pasatiempos que disfrutas, cosas que evitas hacer y algo que decidiste hacer hace poco.",
  "b1-8": "¿En qué es diferente tu vida ahora comparada con hace 10 años? ¿Qué solías hacer que ya no haces?",
  "b2-1": "Habla de una decisión que cambió tu vida. ¿Qué habría pasado si hubieras elegido distinto?",
  "b2-2": "Mira una foto de tu celular y especula: quiénes son, dónde están, qué pudo haber pasado antes.",
  "b2-3": "¿Qué has estado haciendo últimamente para mejorar tu vida? Habla de algo que nunca habías hecho antes de este año.",
  "b2-4": "¿Qué servicios pagas? ¿Qué cosas mandas a hacer en vez de hacerlas tú? ¿Por qué?",
  "b2-5": "Habla de tres deseos sobre tu presente, un arrepentimiento de tu pasado y algo que te molesta.",
  "b2-6": "Describe tus relaciones en el trabajo o el estudio. Usa al menos 6 phrasal verbs.",
  "b2-7": "Da tu opinión: ¿el trabajo remoto debería ser lo normal? Argumentos a favor y en contra, con conectores.",
  "b2-8": "Cuenta una reunión o discusión que presenciaste usando al menos 6 verbos de reporte.",
  "c1-1": "Cuenta una historia personal dramática usando al menos 4 inversiones (Never have I…, Little did I know…).",
  "c1-2": "Habla de lo que te encanta y lo que te frustra de tu trabajo o estudios, usando cleft sentences.",
  "c1-3": "Da feedback diplomático a la propuesta (imaginaria) de un colega: 2 puntos fuertes y 2 débiles, con cortesía.",
  "c1-4": "Resume una noticia reciente en menos de 90 segundos usando participle clauses.",
  "c1-5": "Explica un reto que enfrentaste en el trabajo o el estudio usando al menos 5 idioms o collocations.",
  "c1-6": "Describe dónde estarás y qué habrás logrado en 5 años. Sé preciso.",
  "c1-7": "Di el mismo mensaje dos veces: primero a un amigo (informal) y luego a un gerente de empresa (formal).",
  "c1-8": "Debate 2 minutos: 'La IA creará más empleos de los que destruye'. Concede un punto y refútalo."
};

/* Lo que puedes hacer al terminar cada unidad (se desbloquea en "Mi camino") */
window.CAN_DO = {
  "a1-1": "Presentarte y saludar como nativo", "a1-2": "Hablar de ti y de tu familia", "a1-3": "Preguntar precios, la hora y lugares", "a1-4": "Contar tu rutina diaria",
  "a1-5": "Hablar de otras personas", "a1-6": "Pedir cosas y pedir ayuda", "a1-7": "Describir tu casa y tu barrio", "a1-8": "Contar qué hiciste ayer",
  "a2-1": "Diferenciar lo que haces siempre de lo que haces ahora", "a2-2": "Contar historias del pasado", "a2-3": "Hablar de tus planes", "a2-4": "Comparar cosas y lugares",
  "a2-5": "Comprar y pedir comida", "a2-6": "Hablar de tus experiencias de vida", "a2-7": "Dar consejos y hablar de reglas", "a2-8": "Dar y entender direcciones",
  "b1-1": "Narrar historias con detalles", "b1-2": "Hablar de cambios y logros recientes", "b1-3": "Hablar de posibilidades y sueños", "b1-4": "Explicar cómo se hacen las cosas",
  "b1-5": "Describir personas y lugares con detalle", "b1-6": "Contar lo que otros dijeron", "b1-7": "Hablar de gustos, hábitos y decisiones", "b1-8": "Comparar tu vida antes y ahora",
  "b2-1": "Hablar de decisiones y arrepentimientos", "b2-2": "Especular y sacar conclusiones", "b2-3": "Hablar de experiencias a lo largo del tiempo", "b2-4": "Resolver trámites y servicios",
  "b2-5": "Expresar deseos y quejas", "b2-6": "Usar phrasal verbs como un nativo", "b2-7": "Argumentar tu opinión", "b2-8": "Resumir reuniones y conversaciones",
  "c1-1": "Contar historias con dramatismo", "c1-2": "Enfatizar lo que importa", "c1-3": "Hablar con diplomacia", "c1-4": "Hablar y escribir de forma concisa",
  "c1-5": "Sonar natural con expresiones idiomáticas", "c1-6": "Hablar del futuro con precisión", "c1-7": "Cambiar entre registro formal e informal", "c1-8": "Debatir y persuadir"
};
// Los videos de cada tema se buscan en inglés americano
(window.CURRICULUM || []).forEach((u) => { if (!/american/i.test(u.yt)) u.yt += " american english"; });
