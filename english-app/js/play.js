/* Aprendizaje multisensorial: palabras con imagen (emoji) para juegos y lecturas cortas ilustradas.
   Inglés de EE. UU. PICS: [inglés, español, imagen, categoría] */
window.PIC_CATS = { food: "🍎 Comida", animals: "🐶 Animales", home: "🏠 Casa", clothes: "👕 Ropa", city: "🚌 Ciudad y transporte", nature: "☀️ Clima y naturaleza", people: "👩 Personas y trabajos", feelings: "😀 Emociones", actions: "🏃 Acciones (verbos)" };
window.PICS = [
  ["apple", "manzana", "🍎", "food"], ["banana", "banano", "🍌", "food"], ["bread", "pan", "🍞", "food"], ["cheese", "queso", "🧀", "food"], ["egg", "huevo", "🥚", "food"],
  ["chicken", "pollo", "🍗", "food"], ["rice", "arroz", "🍚", "food"], ["pizza", "pizza", "🍕", "food"], ["burger", "hamburguesa", "🍔", "food"], ["salad", "ensalada", "🥗", "food"],
  ["soup", "sopa", "🍲", "food"], ["cake", "pastel / torta", "🍰", "food"], ["ice cream", "helado", "🍦", "food"], ["cookie", "galleta", "🍪", "food"], ["coffee", "café", "☕", "food"],
  ["milk", "leche", "🥛", "food"], ["orange", "naranja", "🍊", "food"], ["grapes", "uvas", "🍇", "food"], ["strawberry", "fresa", "🍓", "food"], ["carrot", "zanahoria", "🥕", "food"],
  ["tomato", "tomate", "🍅", "food"], ["potato", "papa", "🥔", "food"], ["corn", "maíz", "🌽", "food"], ["sandwich", "sándwich", "🥪", "food"],
  ["dog", "perro", "🐶", "animals"], ["cat", "gato", "🐱", "animals"], ["bird", "pájaro", "🐦", "animals"], ["horse", "caballo", "🐴", "animals"], ["cow", "vaca", "🐮", "animals"],
  ["pig", "cerdo", "🐷", "animals"], ["mouse", "ratón", "🐭", "animals"], ["rabbit", "conejo", "🐰", "animals"], ["bear", "oso", "🐻", "animals"], ["lion", "león", "🦁", "animals"],
  ["monkey", "mono", "🐵", "animals"], ["elephant", "elefante", "🐘", "animals"], ["snake", "serpiente", "🐍", "animals"], ["butterfly", "mariposa", "🦋", "animals"], ["fish", "pez", "🐟", "animals"],
  ["house", "casa", "🏠", "home"], ["bed", "cama", "🛏️", "home"], ["chair", "silla", "🪑", "home"], ["door", "puerta", "🚪", "home"], ["window", "ventana", "🪟", "home"],
  ["couch", "sofá", "🛋️", "home"], ["bathtub", "bañera", "🛁", "home"], ["toilet", "inodoro", "🚽", "home"], ["key", "llave", "🔑", "home"], ["light bulb", "bombillo", "💡", "home"],
  ["phone", "celular / teléfono", "📱", "home"], ["computer", "computador", "💻", "home"], ["TV", "televisión", "📺", "home"], ["clock", "reloj", "⏰", "home"],
  ["shirt", "camiseta", "👕", "clothes"], ["pants", "pantalón", "👖", "clothes"], ["dress", "vestido", "👗", "clothes"], ["sneakers", "tenis", "👟", "clothes"], ["cap", "gorra", "🧢", "clothes"],
  ["glasses", "gafas", "👓", "clothes"], ["coat", "abrigo", "🧥", "clothes"], ["socks", "medias", "🧦", "clothes"], ["purse", "cartera / bolso", "👜", "clothes"], ["scarf", "bufanda", "🧣", "clothes"], ["gloves", "guantes", "🧤", "clothes"],
  ["car", "carro", "🚗", "city"], ["bus", "bus", "🚌", "city"], ["train", "tren", "🚆", "city"], ["airplane", "avión", "✈️", "city"], ["bike", "bicicleta", "🚲", "city"],
  ["taxi", "taxi", "🚕", "city"], ["ship", "barco", "🚢", "city"], ["hospital", "hospital", "🏥", "city"], ["school", "escuela", "🏫", "city"], ["bank", "banco", "🏦", "city"],
  ["store", "tienda", "🏪", "city"], ["hotel", "hotel", "🏨", "city"], ["church", "iglesia", "⛪", "city"],
  ["sun", "sol", "☀️", "nature"], ["rain", "lluvia", "🌧️", "nature"], ["snow", "nieve", "❄️", "nature"], ["cloud", "nube", "☁️", "nature"], ["wind", "viento", "💨", "nature"],
  ["tree", "árbol", "🌳", "nature"], ["flower", "flor", "🌸", "nature"], ["beach", "playa", "🏖️", "nature"], ["mountain", "montaña", "⛰️", "nature"], ["moon", "luna", "🌙", "nature"], ["star", "estrella", "⭐", "nature"],
  ["baby", "bebé", "👶", "people"], ["boy", "niño", "👦", "people"], ["girl", "niña", "👧", "people"], ["man", "hombre", "👨", "people"], ["woman", "mujer", "👩", "people"],
  ["family", "familia", "👨‍👩‍👧", "people"], ["doctor", "médico", "🧑‍⚕️", "people"], ["teacher", "profesor/a", "🧑‍🏫", "people"], ["police officer", "policía", "👮", "people"], ["cook", "cocinero/a", "🧑‍🍳", "people"],
  ["happy", "feliz", "😀", "feelings"], ["sad", "triste", "😢", "feelings"], ["angry", "enojado", "😠", "feelings"], ["tired", "cansado", "🥱", "feelings"], ["scared", "asustado", "😨", "feelings"],
  ["surprised", "sorprendido", "😮", "feelings"], ["sick", "enfermo", "🤒", "feelings"], ["in love", "enamorado", "😍", "feelings"], ["bored", "aburrido", "😑", "feelings"],
  ["run", "correr", "🏃", "actions"], ["swim", "nadar", "🏊", "actions"], ["sleep", "dormir", "😴", "actions"], ["eat", "comer", "🍽️", "actions"], ["drink", "beber / tomar", "🥤", "actions"],
  ["read", "leer", "📖", "actions"], ["write", "escribir", "✍️", "actions"], ["dance", "bailar", "💃", "actions"], ["sing", "cantar", "🎤", "actions"], ["walk", "caminar", "🚶", "actions"],
  ["drive", "manejar", "🚘", "actions"], ["call", "llamar", "📞", "actions"], ["study", "estudiar", "📚", "actions"], ["work", "trabajar", "💼", "actions"], ["play", "jugar", "⚽", "actions"],
  ["shop", "comprar", "🛒", "actions"], ["listen", "escuchar", "🎧", "actions"], ["cook", "cocinar", "🍳", "actions"], ["clean", "limpiar", "🧹", "actions"], ["pay", "pagar", "💳", "actions"]
];

/* Lecturas cortas: frases [inglés, español], preguntas [pregunta, opciones, índice correcto] */
window.READINGS = [
  { id: "morning", icon: "🌅", level: "A1", title: "Sofia's Morning", es: "La mañana de Sofía", focus: "Presente simple (rutinas)",
    lines: [["My name is Sofia.", "Me llamo Sofía."], ["I get up at six-thirty every day.", "Me levanto a las seis y media todos los días."], ["I take a shower and I have breakfast.", "Me ducho y desayuno."], ["I usually have coffee and eggs.", "Normalmente tomo café y como huevos."], ["Then I take the bus to work.", "Luego tomo el bus al trabajo."], ["I work at a hospital. I'm a nurse.", "Trabajo en un hospital. Soy enfermera."], ["I love my job!", "¡Me encanta mi trabajo!"]],
    quiz: [["What time does Sofia get up?", ["At six", "At six-thirty", "At seven"], 1], ["How does she go to work?", ["By bus", "By car", "She walks"], 0], ["What does Sofia do?", ["She's a teacher", "She's a cook", "She's a nurse"], 2]] },
  { id: "coffee", icon: "☕", level: "A1", title: "At the Coffee Shop", es: "En la cafetería", focus: "Presente simple con he (+s)",
    lines: [["It's Saturday morning.", "Es sábado por la mañana."], ["Tom goes to a coffee shop near his house.", "Tom va a una cafetería cerca de su casa."], ["He orders a large iced latte and a muffin.", "Pide un latte frío grande y un muffin."], ["The barista asks for his name.", "El barista le pregunta su nombre."], ["Tom pays seven dollars.", "Tom paga siete dólares."], ["He sits by the window and reads a book.", "Se sienta junto a la ventana y lee un libro."]],
    quiz: [["What day is it?", ["Sunday", "Saturday", "Friday"], 1], ["What does Tom order?", ["A large iced latte and a muffin", "A small coffee", "Tea and a cookie"], 0], ["How much does he pay?", ["Five dollars", "Seven dollars", "Ten dollars"], 1]] },
  { id: "neighborhood", icon: "🏙", level: "A1", title: "My Neighborhood", es: "Mi barrio", focus: "There is / There are",
    lines: [["I live in a small apartment downtown.", "Vivo en un apartamento pequeño en el centro."], ["There's a grocery store on my street.", "Hay un supermercado en mi calle."], ["There are two coffee shops and a park near my building.", "Hay dos cafeterías y un parque cerca de mi edificio."], ["The park is next to a school.", "El parque está al lado de una escuela."], ["I like my neighborhood because it's quiet and safe.", "Me gusta mi barrio porque es tranquilo y seguro."]],
    quiz: [["Where does the person live?", ["In a big house", "In a small apartment", "In a hotel"], 1], ["What's next to the park?", ["A school", "A bank", "A hospital"], 0], ["Why do they like the neighborhood?", ["It's cheap", "It's quiet and safe", "It's big"], 1]] },
  { id: "badday", icon: "😩", level: "A2", title: "A Bad Day", es: "Un mal día", focus: "Pasado simple",
    lines: [["Yesterday was a terrible day for David.", "Ayer fue un día terrible para David."], ["He woke up late because his alarm didn't ring.", "Se despertó tarde porque su alarma no sonó."], ["He missed the bus, so he took an Uber.", "Perdió el bus, así que tomó un Uber."], ["It was really expensive!", "¡Fue muy caro!"], ["At work, his computer stopped working.", "En el trabajo, su computador dejó de funcionar."], ["In the evening, he ordered a pizza and went to bed early.", "En la noche, pidió una pizza y se acostó temprano."]],
    quiz: [["Why did David wake up late?", ["He was sick", "His alarm didn't ring", "He went to bed late"], 1], ["How did he get to work?", ["By bus", "He walked", "He took an Uber"], 2], ["What did he do in the evening?", ["He went out", "He ordered a pizza", "He cooked dinner"], 1]] },
  { id: "weekend", icon: "🎉", level: "A2", title: "Weekend Plans", es: "Planes del fin de semana", focus: "Futuro con going to",
    lines: [["This weekend, Maria is going to visit her parents in Miami.", "Este fin de semana, María va a visitar a sus papás en Miami."], ["On Saturday, they're going to have a barbecue in the backyard.", "El sábado van a hacer un asado en el patio."], ["Her brother is going to bring his new girlfriend.", "Su hermano va a llevar a su nueva novia."], ["On Sunday, Maria wants to go to the beach.", "El domingo, María quiere ir a la playa."], ["But it's going to rain, so maybe they'll watch a movie at home.", "Pero va a llover, así que tal vez vean una película en casa."]],
    quiz: [["Where do Maria's parents live?", ["In New York", "In Miami", "In Texas"], 1], ["What are they going to do on Saturday?", ["Have a barbecue", "Go to the beach", "Watch a movie"], 0], ["Why can't they go to the beach on Sunday?", ["It's going to rain", "It's too hot", "They're busy"], 0]] }
];
