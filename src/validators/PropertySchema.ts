import { z } from "zod";
import { ObjectId } from "mongodb";

// ✅ Algeria: 58 official provinces (Wilayas) with major cities
const algeriaProvinces: Record<string, string[]> = {
  "Adrar": ["Adrar", "Reggane", "Timimoun"],
  "Chlef": ["Chlef", "Ténès", "Beni Haoua"],
  "Laghouat": ["Laghouat", "Aïn Madhi", "Hassi R'Mel"],
  "Oum El Bouaghi": ["Oum El Bouaghi", "Aïn Beïda", "Aïn M'Lila"],
  "Batna": ["Batna", "Aïn Touta", "Tazoult"],
  "Béjaïa": ["Béjaïa", "Akbou", "Tichy"],
  "Biskra": ["Biskra", "Tolga", "Ourlal"],
  "Béchar": ["Béchar", "Kenadsa", "Taghit"],
  "Blida": ["Blida", "Boufarik", "El Affroun"],
  "Bouira": ["Bouira", "Lakhdaria", "M'Chedallah"],
  "Tamanrasset": ["Tamanrasset", "Abalessa", "Idlès"],
  "Tébessa": ["Tébessa", "Bir el Ater", "El Aouinet"],
  "Tlemcen": ["Tlemcen", "Maghnia", "Nedroma"],
  "Tiaret": ["Tiaret", "Sougueur", "Mahdia"],
  "Tizi Ouzou": ["Tizi Ouzou", "Azazga", "Draa Ben Khedda"],
  "Algiers": ["Algiers", "Bab El Oued", "Bir Mourad Raïs"],
  "Djelfa": ["Djelfa", "Aïn Oussera", "El Idrissia"],
  "Jijel": ["Jijel", "Taher", "El Milia"],
  "Sétif": ["Sétif", "El Eulma", "Aïn Oulmene"],
  "Saïda": ["Saïda", "Youb", "Aïn El Hadjar"],
  "Skikda": ["Skikda", "El Harrouch", "Azzaba"],
  "Sidi Bel Abbès": ["Sidi Bel Abbès", "Télagh", "Ras El Ma"],
  "Annaba": ["Annaba", "El Hadjar", "Berrahal"],
  "Guelma": ["Guelma", "Bouchegouf", "Oued Zenati"],
  "Constantine": ["Constantine", "El Khroub", "Hamma Bouziane"],
  "Médéa": ["Médéa", "Berrouaghia", "Ksar El Boukhari"],
  "Mostaganem": ["Mostaganem", "Aïn Tédeles", "Hassi Mameche"],
  "Msila": ["M'Sila", "Bousaada", "Magra"],
  "Mascara": ["Mascara", "Tighennif", "Sig"],
  "Ouargla": ["Ouargla", "Touggourt", "Hassi Messaoud"],
  "Oran": ["Oran", "Es Senia", "Bir El Djir"],
  "El Bayadh": ["El Bayadh", "Rogassa", "Bougtoub"],
  "Illizi": ["Illizi", "Djanet", "Bordj El Houasse"],
  "Bordj Bou Arréridj": ["Bordj Bou Arréridj", "El Achir", "Ras El Oued"],
  "Boumerdès": ["Boumerdès", "Thenia", "Khemis El Khechna"],
  "El Tarf": ["El Tarf", "Bouteldja", "Ben M'Hidi"],
  "Tindouf": ["Tindouf", "Oum El Assel"],
  "Tissemsilt": ["Tissemsilt", "Bordj Emir Abdelkader", "Theniet El Had"],
  "El Oued": ["El Oued", "Debila", "Robbah"],
  "Khenchela": ["Khenchela", "Aïn Touila", "El Hamma"],
  "Souk Ahras": ["Souk Ahras", "Sedrata", "M'Daourouch"],
  "Tipaza": ["Tipaza", "Hadjout", "Gouraya"],
  "Mila": ["Mila", "Ferdjioua", "Chelghoum Laïd"],
  "Aïn Defla": ["Aïn Defla", "Miliana", "El Abadia"],
  "Naâma": ["Naâma", "Aïn Séfra", "Mekmen Ben Amar"],
  "Aïn Témouchent": ["Aïn Témouchent", "Hammam Bou Hadjar", "El Amria"],
  "Ghardaïa": ["Ghardaïa", "Metlili", "Berriane"],
  "Relizane": ["Relizane", "Oued Rhiou", "Mazouna"],
};

// ✅ USA: 50 states + DC with major cities
const usaStates: Record<string, string[]> = {
  "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
  "Alaska": ["Anchorage", "Fairbanks", "Juneau"],
  "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler"],
  "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
  "Colorado": ["Denver", "Colorado Springs", "Aurora"],
  "Connecticut": ["Bridgeport", "New Haven", "Hartford"],
  "Delaware": ["Wilmington", "Dover", "Newark"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
  "Georgia": ["Atlanta", "Savannah", "Augusta"],
  "Hawaii": ["Honolulu", "Hilo", "Kailua"],
  "Idaho": ["Boise", "Meridian", "Nampa"],
  "Illinois": ["Chicago", "Springfield", "Peoria", "Naperville"],
  "Indiana": ["Indianapolis", "Fort Wayne", "Evansville"],
  "Iowa": ["Des Moines", "Cedar Rapids", "Davenport"],
  "Kansas": ["Wichita", "Overland Park", "Kansas City"],
  "Kentucky": ["Louisville", "Lexington", "Bowling Green"],
  "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport"],
  "Maine": ["Portland", "Lewiston", "Bangor"],
  "Maryland": ["Baltimore", "Annapolis", "Frederick"],
  "Massachusetts": ["Boston", "Worcester", "Springfield"],
  "Michigan": ["Detroit", "Grand Rapids", "Ann Arbor"],
  "Minnesota": ["Minneapolis", "Saint Paul", "Rochester"],
  "Mississippi": ["Jackson", "Gulfport", "Biloxi"],
  "Missouri": ["Kansas City", "Saint Louis", "Springfield"],
  "Montana": ["Billings", "Missoula", "Great Falls"],
  "Nebraska": ["Omaha", "Lincoln", "Bellevue"],
  "Nevada": ["Las Vegas", "Reno", "Henderson"],
  "New Hampshire": ["Manchester", "Nashua", "Concord"],
  "New Jersey": ["Newark", "Jersey City", "Trenton"],
  "New Mexico": ["Albuquerque", "Santa Fe", "Las Cruces"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati"],
  "Oklahoma": ["Oklahoma City", "Tulsa", "Norman"],
  "Oregon": ["Portland", "Eugene", "Salem"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Harrisburg"],
  "Rhode Island": ["Providence", "Warwick", "Cranston"],
  "South Carolina": ["Columbia", "Charleston", "Greenville"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
  "Tennessee": ["Nashville", "Memphis", "Knoxville"],
  "Texas": ["Houston", "Dallas", "Austin", "San Antonio"],
  "Utah": ["Salt Lake City", "Provo", "West Valley City"],
  "Vermont": ["Burlington", "Montpelier", "Rutland"],
  "Virginia": ["Virginia Beach", "Richmond", "Norfolk"],
  "Washington": ["Seattle", "Spokane", "Tacoma"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown"],
  "Wisconsin": ["Milwaukee", "Madison", "Green Bay"],
  "Wyoming": ["Cheyenne", "Casper", "Laramie"],
  "Washington DC": ["Washington"],
};
// 🔹 **Property Schema**
export const PropertySchema = z
  .object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    country: z.enum(["Algeria", "USA"]),
    state: z.string(),
    city: z.string(), // Province means "City"
    ownerId: z.string(),
    images: z.array(z.string().url()).min(1).optional(),
    status: z.enum(["available", "rented", "sold", "inactive"]),
    type: z.enum(["real_estate", "rented_real_estate", "hotel"]),
    category: z.string().min(2).max(50),
    sellPrice: z.string().optional(),
    rentPrice: z.string().optional(),
    leaseTerm: z.enum(["short-term", "long-term"]).optional(),
    roomCount: z.string(),
  })
  .refine((data) => {
    const { country, state, city } = data;

    // Ensure the state belongs to the selected country
    if (country === "Algeria" && !(state in algeriaProvinces)) return false;
    if (country === "USA" && !(state in usaStates)) return false;

    // Ensure the city belongs to the selected state
    const validCities =
      country === "Algeria" ? algeriaProvinces[state as keyof typeof algeriaProvinces] : usaStates[state as keyof typeof usaStates];

    return validCities.includes(city);
  }, {
    message: "Invalid state or city for the selected country",
    path: ["state", "province"],
  });

export type PropertyType = z.infer<typeof PropertySchema>;
