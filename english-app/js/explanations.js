/* Clases explicadas paso a paso (A1 y A2): para qué sirve, orden de la frase, por qué,
   diferencias con el español, errores típicos y el porqué de cada ejercicio. */
window.EXPLAIN = {
  "a2-1": {
    purpose: "Diferenciar lo que haces <b>siempre</b> (tu rutina) de lo que estás haciendo <b>ahora mismo</b> o estos días. Es la diferencia más usada al hablar de tu vida.",
    formulas: [
      { label: "Hábito (present simple)", parts: ["Sujeto", "verbo (+s con he/she)", "resto + frecuencia"], ex: "I usually work from home.", es: "Yo + normalmente trabajo + desde casa" },
      { label: "Ahora / temporal (present continuous)", parts: ["Sujeto", "am / is / are", "verbo + ing", "resto"], ex: "I'm working from home this week.", es: "Yo + estoy + trabajando + desde casa esta semana" },
      { label: "Pregunta continuous", parts: ["Am / Is / Are", "sujeto", "verbo + ing", "?"], ex: "Are you working today?", es: "¿Estás + tú + trabajando + hoy?" }
    ],
    table: [["Palabras de hábito → simple", "always, usually, often, sometimes, never, every day"], ["Palabras de ahora → continuous", "now, right now, at the moment, today, this week, Look!, Listen!"], ["Verbos de estado → casi siempre simple", "know, like, love, want, need, understand, believe"]],
    why: "El inglés separa con dos tiempos lo que en español a veces decimos igual. <b>Simple</b> = una foto de tu vida en general (se repite). <b>Continuous</b> = un video de este momento (está pasando y va a terminar). La pista son las palabras de tiempo: <i>usually</i> te lleva al simple y <i>right now</i> al continuous. Los verbos de estado (know, like, want) describen algo que no es una acción en movimiento, por eso no se ponen en -ing: <i>I know</i>, no “I'm knowing”.",
    spanish: "En español “trabajo en casa” puede ser hábito o ahora. En inglés debes elegir: <i>I work</i> (hábito) o <i>I'm working</i> (ahora). Español “estoy trabajando” = inglés <i>I'm working</i>, casi igual, pero en inglés se usa más, también para planes temporales (“esta semana”).",
    mistakes: [["I'm working every day.", "I work every day.", "“Every day” es hábito: present simple."], ["I'm knowing the answer.", "I know the answer.", "“Know” es verbo de estado: no va en -ing."], ["She work now.", "She's working now.", "“Now” pide continuous (is + -ing)."]],
    qw: [
      "“Every day” indica hábito → present simple. Con “she” el verbo lleva -s: <b>goes</b> (go + es).",
      "“Listen!” significa que está pasando en este momento → present continuous: <b>is crying</b>.",
      "“Know” es un verbo de estado (no es una acción en movimiento), por eso va en simple: <b>I know</b>.",
      "Es un hábito (usually + weekends) → present simple. La pregunta necesita el ayudante <b>do</b> y el verbo principal también es <b>do</b> (hacer): What do you do?"
    ]
  },
  "a2-2": {
    purpose: "Contar historias, viajes y cosas que ya pasaron y terminaron: ayer, el año pasado, hace dos semanas.",
    formulas: [
      { label: "Afirmativa", parts: ["Sujeto", "verbo en pasado (-ed o irregular)", "resto"], ex: "I visited my grandma.", es: "Yo + visité + a mi abuela" },
      { label: "Negativa", parts: ["Sujeto", "didn't", "verbo base", "resto"], ex: "I didn't call her.", es: "Yo + no + llamé + a ella" },
      { label: "Pregunta", parts: ["(Palabra pregunta)", "did", "sujeto", "verbo base", "?"], ex: "Where did you go?", es: "¿Dónde + (did) + tú + fuiste?" },
      { label: "Hace + tiempo", parts: ["periodo de tiempo", "ago"], ex: "two years ago", es: "hace dos años (¡ago va al final!)" }
    ],
    table: [["Regulares", "work → worked, play → played, study → studied"], ["Irregulares muy usados", "go → went, see → saw, buy → bought, meet → met, feel → felt, make → made, take → took, get → got"]],
    why: "Igual que en A1: <b>did</b> es el ayudante del pasado. Como “did” ya dice “pasado”, el verbo principal vuelve a su forma base: <i>Did you <b>see</b> it?</i> (no “did you saw”). Los irregulares no siguen la regla del -ed porque son verbos muy antiguos y muy usados: hay que memorizarlos, empezando por los 20 más comunes.",
    spanish: "En inglés el pasado es igual para todas las personas (I went, they went). “Hace dos años” se dice al revés: <b>two years ago</b> (el tiempo primero, ago al final). En español el pasado tiene dos formas (fui / iba); en inglés el past simple cubre “fui” (acción terminada).",
    mistakes: [["Did you saw the game?", "Did you see the game?", "Después de “did”, verbo base."], ["I goed to the beach.", "I went to the beach.", "“Go” es irregular: went."], ["Ago two years.", "Two years ago.", "“Ago” va después del tiempo."]],
    qw: [
      "“Last night” = pasado terminado. “See” es irregular: su pasado es <b>saw</b>.",
      "Pregunta en pasado → ayudante <b>Did</b>. “Do” sería presente; “was/were” son para to be.",
      "Después de <b>didn't</b> el verbo va en forma base: <b>catch</b> (no “caught”).",
      "“Hace tres años” = three years <b>ago</b>. “Ago” siempre va después del periodo."
    ]
  },
  "a2-3": {
    purpose: "Hablar del futuro según el tipo de futuro: un plan que ya decidiste, una decisión de este momento, una cita organizada o una predicción.",
    formulas: [
      { label: "Plan / intención", parts: ["Sujeto", "am / is / are", "going to", "verbo base"], ex: "I'm going to study tonight.", es: "Yo + voy + a + estudiar esta noche" },
      { label: "Decisión del momento / promesa", parts: ["Sujeto", "will ('ll)", "verbo base"], ex: "I'll help you.", es: "Yo + (will) + te ayudo" },
      { label: "Cita ya organizada", parts: ["Sujeto", "am / is / are", "verbo + ing", "+ cuándo"], ex: "I'm meeting Ana at 5.", es: "Me veo con Ana a las 5 (ya está acordado)" }
    ],
    table: [["¿Ya lo tenías decidido?", "going to"], ["¿Lo decides ahora mismo / prometes / ofreces?", "will"], ["¿Está en tu agenda con hora y persona?", "present continuous"], ["Predicción con evidencia que ves", "going to (Look at those clouds! It's going to rain.)"], ["Predicción por opinión", "will (I think it will rain.)"]],
    why: "El inglés elige el futuro según <b>cuándo y cómo tomaste la decisión</b>. Si ya lo pensaste antes → <i>going to</i>. Si lo decides al hablar (“¡Ah, yo contesto!”) → <i>will</i>. Si está en el calendario → continuous. Con <i>will</i> el verbo va en base y sin “to”, igual que con <i>can</i>.",
    spanish: "En español casi todo se dice con “voy a…” o con el futuro (“iré”). Truco: cuando en español dirías “voy a” por un plan, en inglés usa <i>going to</i>. Cuando en español usarías presente para ofrecer (“yo te ayudo”, “yo contesto”), en inglés usa <i>will</i>: <i>I'll help you</i>.",
    mistakes: [["I will to call you.", "I'll call you.", "Después de “will”, verbo sin “to”."], ["I go to travel next year.", "I'm going to travel next year.", "Falta “am” y “going”."], ["The phone is ringing. I'm going to answer.", "The phone is ringing. I'll answer.", "Decisión del momento → will."]],
    qw: [
      "Ves las nubes: es una predicción con <b>evidencia presente</b> → <b>is going to</b>.",
      "Decides en este momento (el teléfono suena ahora) → <b>'ll</b> (will).",
      "Es una cita en tu agenda con hora → present continuous: <b>am seeing</b>.",
      "La estructura es “be + going to”. Con “you” el verbo be es <b>are</b>: What are you going to do?"
    ]
  },
  "a2-4": {
    purpose: "Comparar cosas: precios, ciudades, trabajos, teléfonos. Decir qué es mejor, peor o el mejor de todos.",
    formulas: [
      { label: "Comparativo (adjetivo corto)", parts: ["A", "is", "adjetivo + er", "than", "B"], ex: "My city is bigger than yours.", es: "Mi ciudad + es + más grande + que + la tuya" },
      { label: "Comparativo (adjetivo largo)", parts: ["A", "is", "more + adjetivo", "than", "B"], ex: "This is more expensive than that.", es: "Esto + es + más caro + que + eso" },
      { label: "Superlativo", parts: ["the", "adjetivo + est / most + adjetivo"], ex: "the cheapest / the most interesting", es: "el más barato / el más interesante" },
      { label: "Igualdad", parts: ["as", "adjetivo", "as"], ex: "Tea is as good as coffee.", es: "El té es tan bueno como el café" }
    ],
    table: [["1 sílaba", "cheap → cheaper → the cheapest"], ["termina en consonante-vocal-consonante", "big → bigger → the biggest"], ["termina en -y", "easy → easier → the easiest"], ["2+ sílabas", "expensive → more expensive → the most expensive"], ["Irregulares", "good → better → the best · bad → worse → the worst · far → further"]],
    why: "Las palabras cortas aceptan un final (-er / -est) sin volverse difíciles de pronunciar; las largas no (“expensiver” sería muy largo), por eso usan <i>more / the most</i> delante. <b>Than</b> significa “que” solo en comparaciones. El superlativo siempre lleva <b>the</b> porque señala una sola cosa: la mejor.",
    spanish: "En español todo se compara con “más”: más grande, más caro. En inglés las palabras cortas cambian: <i>bigger</i> (no “more big”). “Que” en una comparación es <b>than</b> (no “that”). “Tan … como” = <b>as … as</b>.",
    mistakes: [["more big", "bigger", "Adjetivo corto → -er, sin “more”."], ["She is taller that me.", "She is taller than me.", "En comparaciones “que” = than."], ["It's the more expensive.", "It's the most expensive.", "Superlativo = the most."]],
    qw: [
      "“Big” es corto (1 sílaba) → <b>bigger</b>. Doble g porque termina en consonante-vocal-consonante.",
      "“De mi vida” = el mejor de todos → superlativo de good: <b>the best</b>.",
      "“Tan … como” en inglés es <b>as … as</b>.",
      "“Expensive” es largo (3 sílabas) → <b>more</b> expensive than."
    ]
  },
  "a2-5": {
    purpose: "Comprar, pedir comida y hablar de cantidades: cuánto, cuántos, un poco, algunos, nada.",
    formulas: [
      { label: "¿Cuánto? (no se cuenta)", parts: ["How much", "sustantivo incontable", "?"], ex: "How much water do you need?", es: "¿Cuánta agua necesitas?" },
      { label: "¿Cuántos? (se cuenta)", parts: ["How many", "sustantivo plural", "?"], ex: "How many eggs do we have?", es: "¿Cuántos huevos tenemos?" },
      { label: "Afirmativa / ofrecer", parts: ["some", "+ sustantivo"], ex: "Would you like some tea?", es: "¿Quieres (algo de) té?" },
      { label: "Negativa / pregunta", parts: ["any", "+ sustantivo"], ex: "We don't have any milk.", es: "No tenemos nada de leche" }
    ],
    table: [["Contables (se pueden contar: 1, 2, 3)", "apple, egg, friend, chair → many, a few"], ["Incontables (no se cuentan sin medida)", "water, money, rice, sugar, information, bread → much, a little"], ["Para medir incontables", "a bottle of water, a cup of coffee, a loaf of bread, a piece of advice"], ["Sirve para ambos", "a lot of / lots of"]],
    why: "El inglés divide las cosas en <b>contables</b> (puedes decir “two eggs”) e <b>incontables</b> (no dices “two waters” sin medida: dices “two bottles of water”). Por eso hay palabras distintas para cantidad: <i>many</i> para cosas que cuentas y <i>much</i> para cosas que no. <i>Some</i> va en afirmativas y en ofrecimientos (esperas un “sí”); <i>any</i> en negativas y preguntas abiertas.",
    spanish: "En español “cuánto” sirve para todo (cuánto dinero, cuántas manzanas). En inglés: <b>How much money</b> / <b>How many apples</b>. Ojo: <i>money, information, advice, bread</i> son incontables en inglés, aunque en español los contemos (“dos consejos” = <i>two pieces of advice</i>).",
    mistakes: [["How many money?", "How much money?", "“Money” es incontable."], ["I don't have some time.", "I don't have any time.", "En negativa se usa “any”."], ["Two breads, please.", "Two loaves of bread, please.", "“Bread” no se cuenta sin medida."]],
    qw: [
      "“Sugar” no se cuenta (no dices “two sugars” sin medida) → <b>much</b>.",
      "Frase negativa (aren't) → <b>any</b>.",
      "Es un ofrecimiento (Would you like…?), esperas un sí → <b>some</b>, aunque sea pregunta.",
      "“Friends” se cuenta (plural) → <b>a few</b> (unos pocos). “A little” es para incontables."
    ]
  },
  "a2-6": {
    purpose: "Hablar de tus experiencias de vida: lugares donde has estado, cosas que has probado o nunca has hecho, sin decir cuándo.",
    formulas: [
      { label: "Afirmativa", parts: ["Sujeto", "have / has", "participio", "resto"], ex: "I've been to Mexico.", es: "Yo + he + estado + en México" },
      { label: "Pregunta", parts: ["Have / Has", "sujeto", "ever", "participio", "?"], ex: "Have you ever tried sushi?", es: "¿Has + tú + alguna vez + probado sushi?" },
      { label: "Negativa", parts: ["Sujeto", "have / has", "never", "participio"], ex: "I've never flown.", es: "Yo + he + nunca + volado" }
    ],
    table: [["¿Dices CUÁNDO pasó? (yesterday, in 2019, last week)", "past simple: I went there in 2019."], ["¿Hablas de tu vida en general, sin fecha?", "present perfect: I've been there."], ["Participios irregulares comunes", "be → been, go → gone/been, see → seen, eat → eaten, do → done, fly → flown, meet → met"]],
    why: "El present perfect une el pasado con el presente: lo que importa es que <b>en tu vida hasta hoy</b> eso pasó, no la fecha. Por eso, en cuanto dices cuándo (<i>yesterday, in 2019</i>), la acción queda cerrada en el pasado y se usa past simple. Se forma con <b>have</b> como ayudante (aquí “have” no es “tener”, es “haber”) + participio.",
    spanish: "Se parece al español “he estado, he probado”. La diferencia: en inglés <b>no puedes</b> usarlo con una fecha concreta (“I have seen it yesterday” está mal), aunque en España se diga “lo he visto hoy”. Para lugares visitados se dice <b>been to</b>: <i>I've been to Peru</i> (he estado en Perú).",
    mistakes: [["I have seen it yesterday.", "I saw it yesterday.", "Con fecha (yesterday) → past simple."], ["Have you ever went?", "Have you ever been / gone?", "Después de have va participio."], ["She have visited Paris.", "She has visited Paris.", "Con she → has."]],
    qw: [
      "Después de “have” va el <b>participio</b>. Para lugares visitados se usa <b>been</b> (Have you ever been to…?).",
      "“Last week” es una fecha terminada → past simple: <b>saw</b>.",
      "Con “she” el ayudante es <b>has</b>: She has never eaten…",
      "Present perfect no lleva fecha, pero sí cuántas veces: <b>twice</b> (dos veces). “Yesterday” y “ago” son fechas."
    ]
  },
  "a2-7": {
    purpose: "Hablar de reglas, obligaciones y dar consejos: lo que debes hacer, lo que no es necesario y lo que está prohibido.",
    formulas: [
      { label: "Obligación", parts: ["Sujeto", "must / have to (has to)", "verbo base"], ex: "I have to work on Saturdays.", es: "Tengo que + trabajar los sábados" },
      { label: "No es necesario", parts: ["Sujeto", "don't / doesn't have to", "verbo base"], ex: "You don't have to come.", es: "No tienes que venir (puedes, pero no es obligatorio)" },
      { label: "Prohibido", parts: ["Sujeto", "mustn't", "verbo base"], ex: "You mustn't smoke here.", es: "No debes / está prohibido fumar aquí" },
      { label: "Consejo", parts: ["Sujeto", "should / shouldn't", "verbo base"], ex: "You should rest.", es: "Deberías descansar" }
    ],
    why: "<b>Must</b> y <b>should</b> son modales (como can): verbo base directo, sin “to” y sin -s. <b>Have to</b> es un verbo normal, por eso cambia (has to) y usa don't/doesn't. La gran trampa: en negativo significan cosas opuestas. <b>Mustn't</b> = prohibido. <b>Don't have to</b> = no es obligatorio (puedes elegir).",
    spanish: "“Tener que” = <b>have to</b>. “Deberías” (consejo) = <b>should</b>. Cuidado: “no tienes que venir” es <i>you don't have to come</i> (es opcional), mientras que <i>you mustn't come</i> significa “tienes prohibido venir”.",
    mistakes: [["You must to wear a helmet.", "You must wear a helmet.", "Después de “must”, sin “to”."], ["She have to work.", "She has to work.", "Con she → has to."], ["You mustn't come if you're tired. (para decir que es opcional)", "You don't have to come if you're tired.", "Mustn't = prohibido."]],
    qw: [
      "Está prohibido (forbidden) → <b>mustn't</b>. “Don't have to” significaría que es opcional.",
      "Es domingo: madrugar no es necesario (es opcional) → <b>don't have to</b>.",
      "Es un consejo → <b>should</b> + verbo base (sin “to”).",
      "“Have to” es verbo normal: con “she” se vuelve <b>has to</b>. “Must to” nunca existe."
    ]
  },
  "a2-8": {
    purpose: "Dar y entender direcciones en la calle, y decir dónde están las cosas.",
    formulas: [
      { label: "Dar una indicación (imperativo)", parts: ["Verbo base", "dirección / lugar"], ex: "Turn left at the lights.", es: "Gira + a la izquierda en el semáforo" },
      { label: "Ubicar algo", parts: ["It's", "preposición", "lugar"], ex: "It's opposite the bank.", es: "Está + enfrente del + banco" },
      { label: "Preguntar el camino", parts: ["How do I get to", "lugar", "?"], ex: "How do I get to the station?", es: "¿Cómo llego a + la estación?" }
    ],
    table: [["at", "un punto concreto: at the bus stop, at the corner"], ["in", "dentro de algo: in the park, in the mall"], ["on", "sobre una superficie / calle: on Main Street, on the left"], ["between A and B", "entre A y B"], ["opposite / next to", "enfrente de / al lado de"], ["along · across · past · through", "a lo largo de · cruzando · pasando por delante · a través de"]],
    why: "Para dar indicaciones se usa el <b>imperativo</b>: el verbo solo, sin sujeto (<i>Go straight</i>). Es directo pero no grosero en inglés; añade “please” o empieza con “Just…” para sonar amable. Las preposiciones dependen de cómo “ves” el lugar: un punto (<i>at</i>), un espacio cerrado (<i>in</i>), una superficie o línea (<i>on</i>).",
    spanish: "En español “en” sirve para todo (en la parada, en el parque, en la calle). En inglés se divide en <b>at / in / on</b>. “Llegar a” un lugar en preguntas de dirección es <b>get to</b> (no “arrive to”). “Enfrente de” = <b>opposite</b> (sin “of”).",
    mistakes: [["How do I arrive to the museum?", "How do I get to the museum?", "Para direcciones se usa “get to”."], ["It's opposite of the bank.", "It's opposite the bank.", "“Opposite” va sin “of”."], ["I'm in the bus stop.", "I'm at the bus stop.", "Un punto concreto → at."]],
    qw: [
      "“Entre A y B” = <b>between</b> A and B. “Among” es entre muchas cosas.",
      "Cruzar de un lado al otro = <b>across</b>. “Along” es ir a lo largo, sin cruzar.",
      "La parada es un punto de encuentro concreto → <b>at</b> the bus stop.",
      "Para pedir indicaciones se dice <b>How do I get to…?</b> (cómo llego a…)."
    ]
  },
  "a1-1": {
    purpose: "Saludar, decir tu nombre y decir cómo estás. Es lo primero que haces con cualquier persona.",
    formulas: [
      { label: "Presentarte", parts: ["I", "'m (am)", "tu nombre"], ex: "I'm Laura.", es: "Yo + soy + Laura" },
      { label: "Decir tu nombre", parts: ["My name", "is", "tu nombre"], ex: "My name is Laura.", es: "Mi nombre + es + Laura" },
      { label: "Decir cómo estás", parts: ["I", "'m (am)", "cómo estás"], ex: "I'm fine.", es: "Yo + estoy + bien" }
    ],
    why: "En inglés <b>siempre</b> hay que decir quién hace la acción (el sujeto). En español dices “Soy Laura” y el “yo” se entiende solo, porque la palabra “soy” ya dice quién es. En inglés el verbo casi no cambia, así que sin <b>I</b> no se sabe de quién hablas. Por eso es <b>I'm Laura</b> y nunca “Am Laura”.",
    spanish: "<b>To be</b> significa <b>ser</b> y <b>estar</b> a la vez: <i>I'm Laura</i> (soy) y <i>I'm fine</i> (estoy) usan la misma palabra. “Me llamo” no se traduce literal: se dice <b>My name is</b> (mi nombre es). <b>I</b> (yo) siempre va en mayúscula.",
    mistakes: [["Am Laura.", "I'm Laura.", "Falta el sujeto “I”."], ["I call me Laura.", "My name is Laura.", "Es la traducción literal de “me llamo” y no existe en inglés."], ["i'm fine", "I'm fine", "“I” siempre se escribe en mayúscula."]],
    qw: [
      "Después de “Hi!” necesitas sujeto + verbo. <b>I'm</b> = I am = yo soy. “I” solo es “yo” (le falta el verbo) y “My” es “mi”.",
      "<b>My</b> = mi. “My name” = mi nombre. “I” es “yo”, “Me” es “me/a mí” y no sirven aquí.",
      "“How are you?” pregunta cómo estás, así que respondes con tu estado: <b>I'm fine, thanks</b>. “I'm Laura” respondería a “¿quién eres?”.",
      "<b>Nice to meet you</b> es la frase fija para “mucho gusto” cuando conoces a alguien."
    ]
  },
  "a1-2": {
    purpose: "Hablar de ti: de dónde eres, tu edad, tu trabajo y tu familia. También preguntar eso a otras personas.",
    formulas: [
      { label: "Afirmativa", parts: ["Sujeto", "am / is / are", "información"], ex: "She is a nurse.", es: "Ella + es + enfermera" },
      { label: "Negativa", parts: ["Sujeto", "am / is / are + not", "información"], ex: "She isn't a nurse.", es: "Ella + no es + enfermera" },
      { label: "Pregunta", parts: ["Am / Is / Are", "sujeto", "información", "?"], ex: "Is she a nurse?", es: "¿Es + ella + enfermera?" }
    ],
    table: [["I", "am → I'm"], ["he / she / it", "is → he's, she's"], ["you / we / they", "are → you're, we're, they're"]],
    why: "Para preguntar con <i>to be</i> el inglés <b>cambia el orden</b>: el verbo pasa delante del sujeto (<i>She is → Is she?</i>). En español sabemos que es pregunta por la entonación y los signos ¿?, pero en inglés la pregunta se reconoce por el orden de las palabras. Si dices “You are from Colombia?” se entiende, pero suena incorrecto.",
    spanish: "La edad se dice con <b>to be</b>: <i>I'm 30</i> (yo soy 30), no “I have 30 years” como en español. Antes de una profesión va <b>a/an</b>: <i>I'm <b>a</b> nurse</i>, aunque en español digamos “soy enfermera” sin “una”.",
    mistakes: [["I have 30 years.", "I'm 30 (years old).", "La edad va con “to be”, no con “have”."], ["I'm nurse.", "I'm a nurse.", "Las profesiones llevan “a” o “an”."], ["You are from Colombia?", "Are you from Colombia?", "En la pregunta el verbo va primero."]],
    qw: [
      "La edad en inglés se dice con <b>to be</b>: I <b>am</b> 30. Con “I” siempre es “am”.",
      "Es una pregunta, así que el verbo va primero. Con “you” el verbo es <b>are</b> → <b>Are</b> you from Mexico?",
      "Con “she” se usa <b>is</b>, y en negativo es is not = <b>isn't</b>. “Don't” es para otros verbos, no para “to be”.",
      "<b>What do you do?</b> es la pregunta fija para “¿a qué te dedicas?”. Literalmente es “¿qué haces?”."
    ]
  },
  "a1-3": {
    purpose: "Preguntar lo básico para moverte: dónde está algo, cuánto cuesta, qué hora es y cuándo pasa algo.",
    formulas: [
      { label: "Pregunta con palabra interrogativa", parts: ["Where / What / When / How much", "is / are", "cosa", "?"], ex: "Where is the bathroom?", es: "¿Dónde + está + el baño?" },
      { label: "Decir la hora", parts: ["It's", "hora"], ex: "It's seven thirty.", es: "Son + las siete y treinta" }
    ],
    table: [["What", "qué / cuál"], ["Where", "dónde"], ["When", "cuándo"], ["Who", "quién"], ["How much", "cuánto (precio)"]],
    why: "En inglés la palabra de pregunta va <b>siempre primero</b> y después el verbo, antes del sujeto: <i>Where <b>is</b> the bathroom?</i> El orden es el mismo de la unidad anterior: en las preguntas el verbo se adelanta. Para la hora se usa <b>It's</b> porque en inglés toda frase necesita un sujeto, y para el tiempo ese sujeto es “it”.",
    spanish: "En español decimos “son las siete”, en plural. En inglés siempre es <b>It's seven</b>, en singular y con “it”. Para precios se usa <b>How much</b> (“cuánto”), no “How many”, que es para contar cosas (¿cuántas sillas?).",
    mistakes: [["What time it is?", "What time is it?", "En la pregunta el verbo (is) va antes del sujeto (it)."], ["Are the seven.", "It's seven o'clock.", "La hora se dice con “It's”."], ["How much cost?", "How much is it?", "Falta el verbo y el sujeto."]],
    qw: [
      "Preguntas por un lugar, así que usas <b>Where</b> (dónde). What = qué, When = cuándo, Who = quién.",
      "Para precios se usa <b>How much</b>. “How many” es para contar cosas (¿cuántos?).",
      "7:30 es la mitad pasada de las siete: <b>half past seven</b> (literalmente “media pasada de siete”). También puedes decir “seven thirty”.",
      "<b>Thirty</b> (30) se acentúa al inicio: THÚR-ti. Thirteen (13) se acentúa al final: thur-TÍIN."
    ]
  },
  "a1-4": {
    purpose: "Contar tu rutina: lo que haces todos los días, lo que no haces, y preguntar por los hábitos de otros.",
    formulas: [
      { label: "Afirmativa", parts: ["I / You / We / They", "verbo", "resto"], ex: "I work in an office.", es: "Yo + trabajo + en una oficina" },
      { label: "Negativa", parts: ["Sujeto", "don't", "verbo", "resto"], ex: "I don't work on Sundays.", es: "Yo + no + trabajo + los domingos" },
      { label: "Pregunta", parts: ["Do", "sujeto", "verbo", "resto", "?"], ex: "Do you like coffee?", es: "(Do) + ¿tú + te gusta + el café?" },
      { label: "Respuesta corta", parts: ["Yes / No", "sujeto", "do / don't"], ex: "Yes, I do. / No, I don't.", es: "Sí, (lo hago). / No, (no lo hago)." }
    ],
    why: "Con verbos normales (work, eat, like…) el inglés necesita un <b>ayudante</b> para negar y preguntar: <b>do</b>. No puedes poner “not” directo al verbo (“I not work”) ni preguntar solo con entonación (“You work?”). El <b>do</b> aquí no significa “hacer”: solo avisa “esto es una pregunta” o, con don't, “esto es negativo”. Se usa el presente simple porque hablas de cosas que se repiten (hábitos y rutinas).",
    spanish: "En español negamos poniendo “no” antes del verbo (“no trabajo”). En inglés se pone <b>don't</b> antes del verbo. En “Do you like coffee?” el “do” no se traduce. Las respuestas cortas son muy naturales: “Yes, I do” en lugar de repetir toda la frase.",
    mistakes: [["I no work on Sundays.", "I don't work on Sundays.", "Para negar se usa “don't”, no “no”."], ["You like coffee?", "Do you like coffee?", "La pregunta necesita “Do” al inicio."], ["Do you likes pizza?", "Do you like pizza?", "Después de “do”, el verbo va en forma base."]],
    qw: [
      "Para negar un verbo normal con “I” se usa <b>don't</b> (do + not). “Doesn't” es solo para he/she/it, y “not” solo no basta.",
      "“Like” es un verbo normal, así que la pregunta necesita el ayudante <b>Do</b>. “Are” es solo para “to be”.",
      "La respuesta corta repite el ayudante de la pregunta: Do you…? → Yes, I <b>do</b>.",
      "<b>Go to bed</b> = irse a la cama, acostarse. Get up = levantarse."
    ]
  },
  "a1-5": {
    purpose: "Hablar de otras personas (él, ella): qué hacen, dónde viven y qué les gusta.",
    formulas: [
      { label: "Afirmativa", parts: ["He / She / It", "verbo + s", "resto"], ex: "She works in a hospital.", es: "Ella + trabaja + en un hospital" },
      { label: "Negativa", parts: ["He / She", "doesn't", "verbo (sin s)", "resto"], ex: "He doesn't drink coffee.", es: "Él + no + toma + café" },
      { label: "Pregunta", parts: ["Does", "he / she", "verbo (sin s)", "resto", "?"], ex: "Does she have kids?", es: "(Does) + ¿ella + tiene + hijos?" }
    ],
    table: [["La mayoría", "work → works, live → lives"], ["termina en ch, sh, s, x, o", "+es: watch → watches, go → goes"], ["consonante + y", "y → ies: study → studies"], ["irregular", "have → has"]],
    why: "La <b>-s</b> es la marca que indica “él o ella”. Cuando usas el ayudante <b>does / doesn't</b>, esa -s se pasa al ayudante (do + s = does), y por eso el verbo vuelve a quedar sin -s: <i>She doesn't work</i>, no “doesn't works”. La -s solo aparece una vez en la frase.",
    spanish: "En español cada persona cambia el verbo (trabajo, trabajas, trabaja, trabajamos). En inglés casi nada cambia: <b>solo he / she / it añade -s</b>. Por eso los hispanohablantes la olvidan muy a menudo. Es el error número 1: practícalo mucho.",
    mistakes: [["She work in a bank.", "She works in a bank.", "Con “she” el verbo lleva -s."], ["He doesn't works.", "He doesn't work.", "La -s ya está en “doesn't”."], ["Do she have kids?", "Does she have kids?", "Con he/she el ayudante es “does”."]],
    qw: [
      "“My sister” = she, así que el verbo lleva <b>-s</b>: lives.",
      "Con “he” el negativo es <b>doesn't</b>, y el verbo queda sin -s (like).",
      "Con “she” la pregunta usa <b>Does</b>, no “Do”.",
      "“My father” = he, y “have” con he/she se vuelve <b>has</b> (es irregular)."
    ]
  },
  "a1-6": {
    purpose: "Pedir cosas, pedir ayuda y resolver cuando no entiendes. Son las frases que más te salvan en un viaje o en el trabajo.",
    formulas: [
      { label: "Pedir algo", parts: ["Can", "I", "have", "cosa", "please?"], ex: "Can I have a coffee, please?", es: "¿Puedo + tener + un café, por favor?" },
      { label: "Pedir con amabilidad", parts: ["I'd like", "cosa", "please"], ex: "I'd like a table for two, please.", es: "Me gustaría + una mesa para dos" },
      { label: "Pedir ayuda", parts: ["Can", "you", "verbo", "?"], ex: "Can you help me?", es: "¿Puede + usted + ayudarme?" }
    ],
    why: "<b>Can</b> es un verbo especial (modal). Por eso: 1) va directo con otro verbo, sin “to” (<i>Can you help me?</i>); 2) nunca lleva -s (<i>She can</i>, no “cans”); 3) para preguntar solo se pone adelante, sin “do”. <b>I'd like</b> (I would like) es más educado que <b>I want</b>, que puede sonar exigente, como “quiero eso” en un tono brusco.",
    spanish: "En español pedimos “¿me da un café?”. En inglés se pregunta “¿puedo tener un café?” → <i>Can I have a coffee?</i> Si traduces literal (“Do you give me a coffee?”) suena muy raro. <b>Please</b> va normalmente al final.",
    mistakes: [["I want a coffee.", "Can I have a coffee, please? / I'd like a coffee.", "“I want” suena exigente al pedir."], ["Can you to help me?", "Can you help me?", "Después de “can”, el verbo va sin “to”."], ["Give me a coffee.", "Can I have a coffee, please?", "La orden directa suena grosera."]],
    qw: [
      "Para pedir algo se usa <b>Can</b> I have…? Con “can” no hace falta el ayudante “do”.",
      "<b>I'd like</b> = me gustaría, y es la forma amable de pedir. “Like to” y “can” no funcionan aquí.",
      "Para negar un verbo normal se usa <b>don't</b>: I don't understand. “No” y “not” solos no bastan.",
      "La forma educada es una pregunta con <b>Can you…?</b> y please. Las otras opciones son órdenes o están mal construidas."
    ]
  },
  "a1-7": {
    purpose: "Decir qué hay en tu casa o en tu barrio, y preguntar si hay algo cerca (un banco, una farmacia).",
    formulas: [
      { label: "Hay (una cosa)", parts: ["There is / There's", "a / an + cosa", "lugar"], ex: "There's a park near my house.", es: "Hay + un parque + cerca de mi casa" },
      { label: "Hay (varias)", parts: ["There are", "número / some + cosas", "lugar"], ex: "There are two bedrooms.", es: "Hay + dos habitaciones" },
      { label: "¿Hay...?", parts: ["Is there / Are there", "cosa", "lugar", "?"], ex: "Is there a bank near here?", es: "¿Hay + un banco + cerca de aquí?" }
    ],
    why: "“Hay” en inglés tiene dos formas porque el verbo concuerda con lo que hay: <b>una cosa → there is</b>, <b>varias → there are</b>. Aquí “there” no significa “allí”: solo sirve para empezar la frase. La pregunta sigue la regla de siempre: el verbo (is / are) va adelante → <i>Is there…?</i>",
    spanish: "En español “hay” nunca cambia. En inglés sí cambia (is / are). No traduzcas “hay” como “have”: “Have a park” no existe. Para lugares: <b>in</b> para ciudades y barrios (<i>in Bogotá</i>), <b>on</b> para calles (<i>on 5th Street</i>), <b>near</b> = cerca, <b>next to</b> = al lado.",
    mistakes: [["Have a bank near here.", "There's a bank near here.", "“Hay” se dice “there is”, no “have”."], ["There is two bedrooms.", "There are two bedrooms.", "Si son varias cosas, es “there are”."], ["Is a bank near here?", "Is there a bank near here?", "Falta “there”."]],
    qw: [
      "Son <b>dos</b> bancos (plural), así que se usa <b>There are</b>.",
      "Es una pregunta sobre <b>un</b> lugar (singular): <b>Is there</b>…?",
      "“Al lado de” es <b>next to</b>. No se dice “next” solo ni “near of”.",
      "“Hay” = <b>There's</b>. “Have” significa tener, e “It's” significa “es”."
    ]
  },
  "a1-8": {
    purpose: "Contar lo que hiciste ayer o el fin de semana. Sirve para la conversación más común: “What did you do?”",
    formulas: [
      { label: "Pasado de to be", parts: ["I / He / She", "was", "resto"], ex: "I was tired.", es: "Yo + estaba + cansada/o" },
      { label: "Pasado de to be (plural)", parts: ["You / We / They", "were", "resto"], ex: "We were at home.", es: "Nosotros + estábamos + en casa" },
      { label: "Pasado de otros verbos", parts: ["Sujeto", "verbo en pasado", "resto"], ex: "I went to the gym.", es: "Yo + fui + al gimnasio" },
      { label: "Pregunta y negativa", parts: ["did / didn't", "+ verbo base"], ex: "What did you do? / I didn't go.", es: "¿Qué hiciste? / No fui." }
    ],
    why: "<b>Did</b> es el pasado del ayudante “do”. Como “did” ya marca que es pasado, el verbo principal vuelve a su forma base: <i>What did you <b>do</b>?</i> (no “did you did”) y <i>I didn't <b>go</b></i> (no “didn't went”). Es la misma lógica de la -s con “does”: la marca va solo una vez.",
    spanish: "¡Buena noticia! En inglés el pasado es <b>igual para todas las personas</b>: I went, she went, they went. En español cambia (fui, fue, fueron). Solo “to be” tiene dos formas: was (I/he/she) y were (you/we/they).",
    mistakes: [["I didn't went.", "I didn't go.", "Después de “didn't”, verbo base."], ["Yesterday I am tired.", "Yesterday I was tired.", "“Yesterday” pide pasado."], ["What you did yesterday?", "What did you do yesterday?", "La pregunta en pasado usa “did”."]],
    qw: [
      "“Yesterday” (ayer) pide pasado, y con “I” el pasado de to be es <b>was</b>.",
      "<b>Went</b> es el pasado irregular de “go”. “Goed” no existe.",
      "Las preguntas en pasado usan el ayudante <b>did</b>: What did you do?",
      "“Anoche” = <b>last night</b>. “Yesterday night” suena raro en inglés."
    ]
  }
};

// Agrega la explicación de cada ejercicio a las preguntas del currículo
(function () {
  (window.CURRICULUM || []).forEach((u) => {
    const ex = window.EXPLAIN[u.id];
    if (ex && ex.qw) u.quiz.forEach((q, i) => { if (ex.qw[i]) q.w = ex.qw[i]; });
  });
})();
