/* Vocabulario por temas (inglés de EE. UU.): [inglés, español, ejemplo] */
window.VOCAB = [
  { id: "greet", icon: "👋", title: "Saludos y cortesía", words: [
    ["Hi / Hey", "hola", "Hey, how's it going?"], ["Good morning", "buenos días", "Good morning! Coffee?"], ["How are you?", "¿cómo estás?", "Hi Tom, how are you?"], ["Please", "por favor", "A coffee, please."],
    ["Thank you / Thanks", "gracias", "Thanks so much!"], ["You're welcome", "de nada", "— Thanks! — You're welcome."], ["Sorry", "perdón / lo siento", "Sorry, I'm late."], ["Excuse me", "disculpe", "Excuse me, where's the restroom?"],
    ["No problem / No worries", "no hay problema", "No worries, take your time."], ["Nice to meet you", "mucho gusto", "Hi, I'm Ana. Nice to meet you."], ["See you later", "nos vemos", "Okay, see you later!"], ["Take care", "cuídate", "Bye, take care!"],
    ["Have a good one", "que te vaya bien", "Thanks, have a good one!"], ["Of course / Sure", "claro", "Sure, no problem."], ["Bless you", "salud (al estornudar)", "— Achoo! — Bless you!"] ] },
  { id: "numbers", icon: "💵", title: "Números y dinero", words: [
    ["dollar / bucks", "dólar / dólares (informal)", "It's twenty bucks."], ["cent", "centavo", "Ninety-nine cents."], ["price", "precio", "What's the price?"], ["cheap", "barato", "This is really cheap."],
    ["expensive / pricey", "caro", "That restaurant is pricey."], ["cash", "efectivo", "Do you take cash?"], ["card", "tarjeta", "I'll pay by card."], ["change", "cambio (dinero)", "Here's your change."],
    ["tip", "propina", "We left a 20% tip."], ["tax", "impuesto", "Is tax included?"], ["receipt", "recibo", "Can I get a receipt?"], ["sale", "oferta / rebaja", "Shoes are on sale."],
    ["half", "mitad", "Half of the cake."], ["first / second / third", "primero / segundo / tercero", "It's on the second floor."], ["hundred / thousand", "cien / mil", "A thousand dollars."] ] },
  { id: "time", icon: "📅", title: "Días, meses y momentos", words: [
    ["Monday… Sunday", "lunes… domingo", "See you on Monday."], ["weekend", "fin de semana", "What are you doing this weekend?"], ["morning", "mañana", "I work in the morning."], ["afternoon", "tarde", "Let's meet this afternoon."],
    ["evening / night", "noche", "I study at night."], ["today", "hoy", "I'm busy today."], ["tomorrow", "mañana", "See you tomorrow!"], ["yesterday", "ayer", "I called her yesterday."],
    ["week / month / year", "semana / mes / año", "Next month I'm traveling."], ["January… December", "enero… diciembre", "My birthday is in May."], ["hour / minute", "hora / minuto", "Give me five minutes."], ["early / late", "temprano / tarde", "Sorry I'm late!"],
    ["now / later", "ahora / más tarde", "I'll call you later."], ["soon", "pronto", "See you soon!"], ["on time", "a tiempo / puntual", "The bus is on time."] ] },
  { id: "family", icon: "👨‍👩‍👧", title: "Familia y personas", words: [
    ["mom / dad", "mamá / papá", "My mom lives in Cali."], ["parents", "papás (padre y madre)", "My parents are retired."], ["brother / sister", "hermano / hermana", "My little sister is 20."], ["siblings", "hermanos (en general)", "Do you have any siblings?"],
    ["son / daughter", "hijo / hija", "My daughter is in school."], ["kids", "hijos / niños", "I have two kids."], ["husband / wife", "esposo / esposa", "My husband cooks."], ["boyfriend / girlfriend", "novio / novia", "This is my boyfriend, Sam."],
    ["grandma / grandpa", "abuela / abuelo", "I visit my grandma on Sundays."], ["aunt / uncle", "tía / tío", "My uncle lives in Texas."], ["cousin", "primo / prima", "My cousin is my best friend."], ["friend / best friend", "amigo / mejor amigo", "She's my best friend."],
    ["neighbor", "vecino", "My neighbor is really nice."], ["coworker", "compañero de trabajo", "I had lunch with a coworker."], ["baby", "bebé", "They just had a baby."] ] },
  { id: "home", icon: "🏠", title: "La casa", words: [
    ["house / apartment", "casa / apartamento", "I live in an apartment."], ["room", "cuarto / habitación", "My room is small."], ["bedroom", "dormitorio", "A two-bedroom apartment."], ["bathroom", "baño (en casa)", "The bathroom is upstairs."],
    ["kitchen", "cocina", "We eat in the kitchen."], ["living room", "sala", "The TV is in the living room."], ["bed", "cama", "I'm going to bed."], ["couch", "sofá", "He's sleeping on the couch."],
    ["table / chair", "mesa / silla", "Sit on that chair."], ["door / window", "puerta / ventana", "Can you close the window?"], ["fridge", "refrigerador / nevera", "The milk is in the fridge."], ["stove / oven", "estufa / horno", "Turn off the stove."],
    ["closet", "clóset / armario", "My clothes are in the closet."], ["yard", "patio / jardín", "The kids play in the yard."], ["rent", "renta / alquiler", "The rent is high here."] ] },
  { id: "food", icon: "🍽", title: "Comida y bebida", words: [
    ["breakfast / lunch / dinner", "desayuno / almuerzo / cena", "What's for dinner?"], ["water", "agua", "Can I get some water?"], ["coffee / tea", "café / té", "I need coffee!"], ["juice", "jugo", "Orange juice, please."],
    ["bread", "pan", "Whole wheat bread."], ["eggs", "huevos", "Scrambled eggs, please."], ["chicken / beef / pork", "pollo / res / cerdo", "I'll have the chicken."], ["fish", "pescado", "Do you like fish?"],
    ["rice / beans", "arroz / frijoles", "Rice and beans."], ["vegetables / veggies", "verduras", "Eat your veggies!"], ["fruit", "fruta", "I eat fruit every day."], ["cheese", "queso", "Extra cheese, please."],
    ["dessert", "postre", "Do you want dessert?"], ["snack", "algo para picar", "I'm getting a snack."], ["to-go / takeout", "para llevar / comida para llevar", "Let's order takeout."] ] },
  { id: "clothes", icon: "👕", title: "Ropa", words: [
    ["shirt / T-shirt", "camisa / camiseta", "A white T-shirt."], ["pants", "pantalón", "These pants are too long."], ["jeans", "jeans", "I wear jeans every day."], ["dress", "vestido", "That dress looks great on you."],
    ["skirt", "falda", "A black skirt."], ["shoes / sneakers", "zapatos / tenis", "New sneakers!"], ["jacket / coat", "chaqueta / abrigo", "Take a jacket, it's cold."], ["sweater / hoodie", "suéter / buzo con capucha", "I love this hoodie."],
    ["socks", "medias / calcetines", "I need new socks."], ["hat / cap", "sombrero / gorra", "Nice cap!"], ["bag / purse", "bolso / cartera", "Where's my purse?"], ["size", "talla", "What size are you?"],
    ["fit", "quedar (de talla)", "It doesn't fit."], ["try on", "probarse", "Can I try this on?"], ["fitting room", "probador", "Where's the fitting room?"] ] },
  { id: "health", icon: "🩺", title: "Cuerpo y salud", words: [
    ["head / headache", "cabeza / dolor de cabeza", "I have a headache."], ["stomach / stomachache", "estómago / dolor de estómago", "My stomach hurts."], ["back", "espalda", "My back hurts."], ["throat", "garganta", "I have a sore throat."],
    ["sick", "enfermo", "I feel sick today."], ["cold / flu", "resfriado / gripe", "I have a cold."], ["fever", "fiebre", "She has a fever."], ["cough", "tos", "I've had a cough for a week."],
    ["hurt", "doler / lastimar", "It hurts here."], ["doctor / nurse", "médico / enfermero", "I need to see a doctor."], ["appointment", "cita", "I have a doctor's appointment."], ["medicine / pills", "medicina / pastillas", "Take these pills twice a day."],
    ["pharmacy", "farmacia", "Is there a pharmacy nearby?"], ["insurance", "seguro médico", "Do you have insurance?"], ["feel better", "sentirse mejor", "I hope you feel better!"] ] },
  { id: "city", icon: "🏙", title: "Ciudad y lugares", words: [
    ["street / avenue", "calle / avenida", "I live on Main Street."], ["block", "cuadra", "It's two blocks away."], ["corner", "esquina", "The café on the corner."], ["downtown", "el centro", "Let's go downtown."],
    ["grocery store", "supermercado", "I'm going to the grocery store."], ["mall", "centro comercial", "Let's go to the mall."], ["bank", "banco", "The bank closes at 5."], ["gas station", "gasolinera", "Stop at the gas station."],
    ["restaurant / diner", "restaurante / cafetería", "There's a great diner here."], ["park", "parque", "Let's walk in the park."], ["school / college", "colegio / universidad", "She goes to college."], ["hospital", "hospital", "He's in the hospital."],
    ["gym", "gimnasio", "I go to the gym after work."], ["parking lot", "parqueadero", "I parked in the parking lot."], ["restroom", "baño (público)", "Where's the restroom?"] ] },
  { id: "travel", icon: "✈️", title: "Transporte y viajes", words: [
    ["car", "carro", "I drive my car to work."], ["bus / bus stop", "bus / parada", "The bus stop is over there."], ["subway / train", "metro / tren", "Take the subway downtown."], ["airport", "aeropuerto", "I'm at the airport."],
    ["flight", "vuelo", "My flight is delayed."], ["ticket", "boleto / tiquete", "Two tickets, please."], ["passport", "pasaporte", "Don't forget your passport!"], ["luggage / suitcase", "equipaje / maleta", "My suitcase is heavy."],
    ["hotel / reservation", "hotel / reserva", "I have a reservation."], ["check in / check out", "registrarse / salir del hotel", "Check out is at 11."], ["trip / vacation", "viaje / vacaciones", "We're going on vacation."], ["map / directions", "mapa / indicaciones", "Can you give me directions?"],
    ["traffic", "tráfico", "Traffic is crazy today."], ["rideshare / Uber", "carro de app", "I'll get an Uber."], ["delayed", "retrasado", "The flight is delayed."] ] },
  { id: "work", icon: "💼", title: "Trabajo y oficina", words: [
    ["job", "trabajo (empleo)", "I love my job."], ["boss / manager", "jefe / gerente", "My manager is great."], ["coworker", "compañero de trabajo", "My coworkers are nice."], ["meeting", "reunión", "I have a meeting at 10."],
    ["schedule", "horario", "My schedule is busy."], ["email", "correo", "I'll send you an email."], ["deadline", "fecha límite", "The deadline is Friday."], ["salary / paycheck", "salario / cheque de pago", "Payday is Friday."],
    ["interview", "entrevista", "I have a job interview."], ["resume", "hoja de vida", "Send me your resume."], ["full-time / part-time", "tiempo completo / medio tiempo", "It's a part-time job."], ["day off", "día libre", "Tomorrow is my day off."],
    ["break", "descanso", "Let's take a break."], ["busy / swamped", "ocupado / llenísimo de trabajo", "I'm swamped this week."], ["quit / get fired", "renunciar / ser despedido", "She quit her job."] ] },
  { id: "feelings", icon: "😊", title: "Emociones y estados", words: [
    ["happy", "feliz", "I'm so happy for you!"], ["sad", "triste", "Why are you sad?"], ["tired / exhausted", "cansado / agotado", "I'm exhausted."], ["hungry / starving", "con hambre / muerto de hambre", "I'm starving!"],
    ["thirsty", "con sed", "I'm thirsty."], ["bored", "aburrido", "I'm bored."], ["excited", "emocionado", "I'm excited about the trip!"], ["nervous", "nervioso", "I'm nervous about the interview."],
    ["worried", "preocupado", "Don't be worried."], ["angry / mad", "enojado", "Are you mad at me?"], ["scared", "asustado", "I'm scared of dogs."], ["stressed (out)", "estresado", "I'm so stressed out."],
    ["sick", "enfermo", "I feel sick."], ["busy", "ocupado", "Sorry, I'm busy right now."], ["ready", "listo", "Are you ready?"] ] },
  { id: "adjectives", icon: "⭐", title: "Adjetivos esenciales", words: [
    ["good / bad", "bueno / malo", "That's a good idea."], ["big / small", "grande / pequeño", "A small coffee, please."], ["new / old", "nuevo / viejo", "I got a new phone."], ["easy / hard", "fácil / difícil", "English isn't that hard!"],
    ["fast / slow", "rápido / lento", "The internet is slow."], ["hot / cold", "caliente / frío", "It's so hot today."], ["nice", "amable / agradable / bonito", "She's really nice."], ["beautiful / pretty", "hermoso / lindo", "What a pretty dress!"],
    ["awesome / amazing", "genial / increíble", "The concert was awesome."], ["clean / dirty", "limpio / sucio", "The kitchen is dirty."], ["full / empty", "lleno / vacío", "The bus is full."], ["open / closed", "abierto / cerrado", "Is the store open?"],
    ["important", "importante", "It's really important."], ["different / same", "diferente / mismo", "Same here!"], ["favorite", "favorito", "What's your favorite food?"] ] },
  { id: "frequency", icon: "⏰", title: "Frecuencia y conectores", words: [
    ["always", "siempre", "I always drink coffee."], ["usually", "normalmente", "I usually walk to work."], ["often", "a menudo", "We often eat out."], ["sometimes", "a veces", "Sometimes I cook."],
    ["never", "nunca", "I never smoke."], ["every day", "todos los días", "I study every day."], ["once / twice a week", "una / dos veces por semana", "I go to the gym twice a week."], ["and / but / or", "y / pero / o", "I like it, but it's expensive."],
    ["because", "porque", "I'm tired because I worked a lot."], ["so", "así que", "It's late, so I'm going home."], ["then", "luego / después", "First I eat, then I study."], ["also / too", "también", "I like it too."],
    ["maybe", "tal vez", "Maybe tomorrow."], ["really", "de verdad / muy", "It's really good."], ["actually", "en realidad", "Actually, I'm from Peru."] ] },
  { id: "prepositions", icon: "📍", title: "Preposiciones clave", words: [
    ["in", "en (dentro / ciudades / meses)", "in Miami, in May"], ["on", "en (superficie / calles / días)", "on Main Street, on Monday"], ["at", "en (punto / hora)", "at home, at 7"], ["to", "a / hacia", "I'm going to work."],
    ["from", "de / desde", "I'm from Colombia."], ["with / without", "con / sin", "Coffee without sugar."], ["for", "para / por (tiempo)", "This is for you. For two years."], ["near / next to", "cerca de / al lado de", "It's next to the bank."],
    ["between", "entre", "Between the bank and the park."], ["behind / in front of", "detrás de / delante de", "In front of the hotel."], ["under / over", "debajo de / encima de", "Under the table."], ["before / after", "antes de / después de", "After work."],
    ["about", "sobre / acerca de", "A movie about love."], ["by", "en (medio) / para (fecha)", "By car. By Friday."], ["until", "hasta", "Open until 9."] ] },
  { id: "weather", icon: "☀️", title: "Clima y naturaleza", words: [
    ["weather", "clima", "How's the weather?"], ["sunny", "soleado", "It's sunny today."], ["rain / rainy", "lluvia / lluvioso", "It's raining."], ["cloudy", "nublado", "It's cloudy."],
    ["windy", "con viento", "It's so windy!"], ["snow", "nieve / nevar", "It's snowing!"], ["hot / warm", "caliente / templado", "It's warm outside."], ["cold / freezing", "frío / helado", "It's freezing!"],
    ["degrees", "grados (°F en EE. UU.)", "It's 75 degrees."], ["umbrella", "sombrilla / paraguas", "Take an umbrella."], ["beach", "playa", "Let's go to the beach."], ["mountain", "montaña", "We hiked up the mountain."],
    ["spring / summer", "primavera / verano", "I love summer."], ["fall / winter", "otoño / invierno", "Fall is beautiful here."], ["storm", "tormenta", "There's a storm coming."] ] },
  { id: "free", icon: "🎉", title: "Tiempo libre", words: [
    ["hang out", "pasar el rato", "Let's hang out this weekend."], ["go out", "salir", "We're going out tonight."], ["movie / show", "película / serie", "Let's watch a movie."], ["music / concert", "música / concierto", "The concert was amazing."],
    ["party", "fiesta", "Are you coming to the party?"], ["game", "partido / juego", "Did you watch the game?"], ["soccer / football", "fútbol / fútbol americano", "Soccer is huge in Colombia."], ["work out", "hacer ejercicio", "I work out every morning."],
    ["hike", "caminata (montaña)", "We went on a hike."], ["read a book", "leer un libro", "I'm reading a great book."], ["play video games", "jugar videojuegos", "He plays video games a lot."], ["chill", "relajarse", "I'm just chilling at home."],
    ["hobby", "pasatiempo", "What are your hobbies?"], ["for fun", "por diversión", "What do you do for fun?"], ["have fun", "divertirse", "Have fun!"] ] }
];
