import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiX, FiMapPin, FiGlobe, FiMap } from 'react-icons/fi';
import './FilterListing.css';

function FilterListing({ selectedCurrency, currencies = [], onFilter, onSearchRedirect }) {
  const { t } = useTranslation();
  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [tempCountry, setTempCountry] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [searchPriceMax, setSearchPriceMax] = useState('');
  const [dealType, setDealType] = useState('buy');
  const [rentType, setRentType] = useState('rent_long');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [dealTypeTimeout, setDealTypeTimeout] = useState(null);
  const [rentTypeTimeout, setRentTypeTimeout] = useState(null);
  const [propertyTypeTimeout, setPropertyTypeTimeout] = useState(null);
  const [dealTypeSelectorWidth, setDealTypeSelectorWidth] = useState('auto');
  const [propertyTypeSelectorWidth, setPropertyTypeSelectorWidth] = useState('auto');
  const [locationSelectorWidth, setLocationSelectorWidth] = useState('auto');
  const [priceInputWidth, setPriceInputWidth] = useState('auto');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [isDealTypeDropdownOpen, setIsDealTypeDropdownOpen] = useState(false);
  const [isRentTypeDropdownOpen, setIsRentTypeDropdownOpen] = useState(false);
  const [isPropertyTypeDropdownOpen, setIsPropertyTypeDropdownOpen] = useState(false);
  const [filterBtnStyle, setFilterBtnStyle] = useState({ fontSize: '14px', padding: '0 12px' });
  const [searchBtnStyle, setSearchBtnStyle] = useState({ fontSize: '14px', padding: '0 12px' });
  const [mapBtnStyle, setMapBtnStyle] = useState({ fontSize: '14px', padding: '0 12px' });

  const dealTypeSelectorRef = useRef(null);
  const propertyTypeSelectorRef = useRef(null);
  const locationSelectorRef = useRef(null);
  const priceInputRef = useRef(null);
  const filterBtnRef = useRef(null);
  const searchBtnRef = useRef(null);
  const mapBtnRef = useRef(null);

  const countries = [
    {
      name: 'Austria',
      flag: '🇦🇹',
      cities: [
        'Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Klagenfurt', 'Villach', 'Wels',
        'Sankt Pölten', 'Dornbirn', 'Wiener Neustadt', 'Steyr', 'Feldkirch', 'Bregenz',
        'Leonding', 'Klosterneuburg', 'Baden', 'Wolfsberg', 'Leoben', 'Krems', 'Traun',
        'Amstetten', 'Lustenau', 'Kapfenberg', 'Mödling', 'Hallein', 'Kufstein', 'Traiskirchen'
      ]
    },
    {
      name: 'Belgium',
      flag: '🇧🇪',
      cities: [
        'Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Leuven', 'Liège', 'Charleroi', 'Namur',
        'Mons', 'Mechelen', 'Aalst', 'La Louvière', 'Kortrijk', 'Hasselt', 'Ostend',
        'Tournai', 'Genk', 'Seraing', 'Roeselare', 'Verviers', 'Mouscron', 'Beveren',
        'Dendermonde', 'Beringen', 'Turnhout', 'Dilbeek', 'Heist-op-den-Berg', 'Sint-Truiden'
      ]
    },
    {
      name: 'Bulgaria',
      flag: '🇧🇬',
      cities: [
        'Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven',
        'Dobrich', 'Shumen', 'Pernik', 'Yambol', 'Haskovo', 'Pazardzhik', 'Blagoevgrad',
        'Veliko Tarnovo', 'Gabrovo', 'Vratsa', 'Kazanlak', 'Vidin', 'Asenovgrad', 'Kyustendil',
        'Montana', 'Targovishte', 'Silistra', 'Lovech', 'Dupnitsa', 'Svishtov'
      ]
    },
    {
      name: 'Croatia',
      flag: '🇭🇷',
      cities: [
        'Zagreb', 'Split', 'Dubrovnik', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Slavonski Brod',
        'Karlovac', 'Varaždin', 'Šibenik', 'Sisak', 'Vinkovci', 'Koprivnica', 'Čakovec',
        'Vukovar', 'Bjelovar', 'Samobor', 'Velika Gorica', 'Požega', 'Đakovo', 'Sinj',
        'Virovitica', 'Makarska', 'Knin', 'Metković', 'Dugo Selo', 'Gospić'
      ]
    },
    {
      name: 'Cyprus',
      flag: '🇨🇾',
      cities: [
        'Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Protaras',
        'Paralimni', 'Morphou', 'Aradippou', 'Dali', 'Ypsonas', 'Ayia Napa', 'Geroskipou',
        'Lakatamia', 'Engomi', 'Mesa Geitonia', 'Strovolos', 'Polis', 'Peyia', 'Deryneia',
        'Sotira', 'Athienou', 'Livadia', 'Tseri', 'Oroklini', 'Kiti', 'Pyla'
      ]
    },
    {
      name: 'Czech Republic',
      flag: '🇨🇿',
      cities: [
        'Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice', 'Hradec Králové',
        'Ústí nad Labem', 'Pardubice', 'Zlín', 'Havířov', 'Kladno', 'Most', 'Opava',
        'Frýdek-Místek', 'Karviná', 'Jihlava', 'Teplice', 'Děčín', 'Karlovy Vary', 'Chomutov',
        'Přerov', 'Jablonec nad Nisou', 'Mladá Boleslav', 'Prostějov', 'Třebíč', 'Třinec'
      ]
    },
    {
      name: 'Denmark',
      flag: '🇩🇰',
      cities: [
        'Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens',
        'Vejle', 'Roskilde', 'Herning', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg',
        'Køge', 'Holstebro', 'Slagelse', 'Hillerød', 'Sønderborg', 'Svendborg', 'Hjørring',
        'Haderslev', 'Skive', 'Ringsted', 'Frederikshavn', 'Nykøbing Falster', 'Aabenraa'
      ]
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      cities: [
        'Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Sillamäe',
        'Maardu', 'Kuressaare', 'Võru', 'Valga', 'Jõhvi', 'Haapsalu', 'Keila', 'Paide',
        'Kiviõli', 'Tapa', 'Põlva', 'Jõgeva', 'Rapla', 'Saue', 'Elva', 'Türi', 'Kärdla',
        'Paldiski', 'Loksa', 'Kunda'
      ]
    },
    {
      name: 'Finland',
      flag: '🇫🇮',
      cities: [
        'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti',
        'Kuopio', 'Kouvola', 'Pori', 'Joensuu', 'Lappeenranta', 'Hämeenlinna', 'Vaasa',
        'Seinäjoki', 'Rovaniemi', 'Mikkeli', 'Kotka', 'Salo', 'Porvoo', 'Kokkola',
        'Hyvinkää', 'Lohja', 'Järvenpää', 'Rauma', 'Kajaani', 'Savonlinna'
      ]
    },
    {
      name: 'France',
      flag: '🇫🇷',
      cities: [
        'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
        'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon',
        'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Aix-en-Provence', 'Brest', 'Clermont-Ferrand',
        'Le Mans', 'Amiens', 'Annecy', 'Boulogne-Billancourt', 'Metz', 'Besançon'
      ]
    },
    {
      name: 'Germany',
      flag: '🇩🇪',
      cities: [
        'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund',
        'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg',
        'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe', 'Mannheim',
        'Augsburg', 'Wiesbaden', 'Gelsenkirchen', 'Mönchengladbach', 'Braunschweig', 'Kiel'
      ]
    },
    {
      name: 'Greece',
      flag: '🇬🇷',
      cities: [
        'Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Ioannina', 'Chania',
        'Chalcis', 'Serres', 'Kavala', 'Kalamata', 'Rhodes', 'Agrinio', 'Drama',
        'Veria', 'Kozani', 'Karditsa', 'Trikala', 'Rethymno', 'Xanthi', 'Katerini',
        'Lamia', 'Komotini', 'Sparta', 'Nafplio', 'Messolonghi', 'Chios'
      ]
    },
    {
      name: 'Hungary',
      flag: '🇭🇺',
      cities: [
        'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét',
        'Székesfehérvár', 'Szombathely', 'Érd', 'Tatabánya', 'Kaposvár', 'Sopron', 'Veszprém',
        'Békéscsaba', 'Zalaegerszeg', 'Eger', 'Nagykanizsa', 'Dunakeszi', 'Hódmezővásárhely',
        'Salgótarján', 'Cegléd', 'Ózd', 'Szekszárd', 'Baja', 'Vác', 'Gödöllő'
      ]
    },
    {
      name: 'Ireland',
      flag: '🇮🇪',
      cities: [
        'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Drogheda', 'Dundalk', 'Swords',
        'Bray', 'Navan', 'Ennis', 'Kilkenny', 'Tralee', 'Carlow', 'Naas', 'Athlone',
        'Letterkenny', 'Sligo', 'Celbridge', 'Wexford', 'Ballina', 'Greystones', 'Clonmel',
        'Malahide', 'Leixlip', 'Tullamore', 'Killarney', 'Arklow'
      ]
    },
    {
      name: 'Italy',
      flag: '🇮🇹',
      cities: [
        'Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna', 'Genoa',
        'Bari', 'Catania', 'Palermo', 'Verona', 'Messina', 'Padua', 'Trieste',
        'Brescia', 'Parma', 'Modena', 'Reggio Calabria', 'Prato', 'Perugia', 'Livorno',
        'Cagliari', 'Foggia', 'Salerno', 'Ravenna', 'Ferrara', 'Sassari'
      ]
    },
    {
      name: 'Latvia',
      flag: '🇱🇻',
      cities: [
        'Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera',
        'Ogre', 'Tukums', 'Cēsis', 'Salaspils', 'Kuldīga', 'Olaine', 'Saldus', 'Talsi',
        'Dobele', 'Krāslava', 'Bauska', 'Līvāni', 'Gulbene', 'Madona', 'Ludza', 'Alūksne',
        'Preiļi', 'Balvi', 'Sigulda', 'Aizkraukle'
      ]
    },
    {
      name: 'Lithuania',
      flag: '🇱🇹',
      cities: [
        'Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai',
        'Jonava', 'Utena', 'Kėdainiai', 'Telšiai', 'Tauragė', 'Ukmergė', 'Visaginas',
        'Plungė', 'Kretinga', 'Radviliškis', 'Palanga', 'Gargždai', 'Druskininkai', 'Rokiškis',
        'Elektrėnai', 'Kuršėnai', 'Biržai', 'Garliava', 'Joniškis', 'Anykščiai'
      ]
    },
    {
      name: 'Luxembourg',
      flag: '🇱🇺',
      cities: [
        'Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck',
        'Diekirch', 'Strassen', 'Bertrange', 'Belvaux', 'Pétange', 'Sanem', 'Hesperange',
        'Bettembourg', 'Schifflange', 'Kayl', 'Mondercange', 'Mersch', 'Wiltz', 'Sandweiler',
        'Junglinster', 'Rodange', 'Oberkorn', 'Bascharage', 'Echternach', 'Grevenmacher',
        'Remich', 'Capellen', 'Mondorf-les-Bains'
      ]
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      cities: [
        'Valletta', 'Sliema', "St. Julian's", 'Birkirkara', 'Qormi', 'Mosta', 'Żabbar', 'Rabat',
        'San Ġwann', 'Fgura', 'Żejtun', 'Gżira', 'Msida', 'Mellieħa', 'Naxxar', 'Marsaskala',
        'Paola', 'Żurrieq', 'Birżebbuġa', 'Tarxien', 'Attard', 'Swieqi', 'Ħamrun', 'Santa Venera',
        'Dingli', 'Mgarr', 'Pembroke', 'Marsa'
      ]
    },
    {
      name: 'Netherlands',
      flag: '🇳🇱',
      cities: [
        'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere',
        'Breda', 'Nijmegen', 'Enschede', 'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort',
        'Apeldoorn', 'Leiden', 'Dordrecht', 'Zoetermeer', 'Zwolle', 'Maastricht', 'Delft',
        'Heerlen', 'Alkmaar', 'Hilversum', 'Hengelo', 'Amstelveen', 'Purmerend'
      ]
    },
    {
      name: 'Poland',
      flag: '🇵🇱',
      cities: [
        'Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz',
        'Lublin', 'Katowice', 'Białystok', 'Gdynia', 'Częstochowa', 'Radom', 'Sosnowiec',
        'Toruń', 'Kielce', 'Rzeszów', 'Gliwice', 'Zabze', 'Olsztyn', 'Bielsko-Biała',
        'Bytom', 'Rybnik', 'Ruda Śląska', 'Tychy', 'Opole', 'Elbląg'
      ]
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      cities: [
        'Lisbon', 'Porto', 'Faro', 'Braga', 'Coimbra', 'Amadora', 'Setúbal', 'Almada',
        'Funchal', 'Aveiro', 'Évora', 'Leiria', 'Viseu', 'Guimarães', 'Barreiro',
        'Queluz', 'Maia', 'Covilhã', 'Ponta Delgada', 'Vila Nova de Gaia', 'Sintra', 'Cascais',
        'Loures', 'Odivelas', 'Matosinhos', 'Seixal', 'Oeiras', 'Portimão'
      ]
    },
    {
      name: 'Romania',
      flag: '🇷🇴',
      cities: [
        'Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați',
        'Ploiești', 'Oradea', 'Brăila', 'Arad', 'Pitești', 'Sibiu', 'Bacău',
        'Târgu Mureș', 'Baia Mare', 'Buzău', 'Satu Mare', 'Botoșani', 'Suceava', 'Piatra Neamț',
        'Drobeta-Turnu Severin', 'Târgu Jiu', 'Focșani', 'Bistrița', 'Tulcea', 'Deva'
      ]
    },
    {
      name: 'Slovakia',
      flag: '🇸🇰',
      cities: [
        'Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra', 'Banská Bystrica', 'Trnava', 'Martin',
        'Trenčín', 'Poprad', 'Prievidza', 'Zvolen', 'Považská Bystrica', 'Michalovce', 'Spišská Nová Ves',
        'Levice', 'Komárno', 'Humenné', 'Bardejov', 'Liptovský Mikuláš', 'Ružomberok', 'Piešťany',
        'Topoľčany', 'Čadca', 'Rimavská Sobota', 'Dubnica nad Váhom', 'Sereď', 'Partizánske'
      ]
    },
    {
      name: 'Slovenia',
      flag: '🇸🇮',
      cities: [
        'Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper', 'Velenje', 'Novo Mesto', 'Ptuj',
        'Trbovlje', 'Kamnik', 'Jesenice', 'Domžale', 'Nova Gorica', 'Izola', 'Škofja Loka',
        'Murska Sobota', 'Postojna', 'Logatec', 'Slovenj Gradec', 'Vrhnika', 'Kočevje', 'Ravne na Koroškem',
        'Ajdovščina', 'Litija', 'Brežice', 'Sežana', 'Radovljica', 'Žalec'
      ]
    },
    {
      name: 'Spain',
      flag: '🇪🇸',
      cities: [
        'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Málaga', ' Zaragoza', 'Murcia',
        'Palma', 'Las Palmas', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón',
        'Hospitalet de Llobregat', 'A Coruña', 'Granada', 'Elche', 'Oviedo', 'Badalona', 'Cartagena',
        'Terrassa', 'Jerez de la Frontera', 'Sabadell', 'Móstoles', 'Alcalá de Henares', 'Pamplona'
      ]
    },
    {
      name: 'Sweden',
      flag: '🇸🇪',
      cities: [
        'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg',
        'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Södertälje',
        'Eskilstuna', 'Halmstad', 'Växjö', 'Karlstad', 'Sundsvall', 'Östersund', 'Trollhättan',
        'Luleå', 'Kalmar', 'Falun', 'Kristianstad', 'Skövde', 'Nyköping'
      ]
    }
  ];

  const dealTypes = [
    { value: 'buy', label: 'buy' },
    { value: 'rent', label: 'rent' },
  ];

  const rentTypes = [
    { value: 'rent_long', label: 'rent_long' },
    { value: 'rent_short', label: 'rent_short' },
  ];

  const propertyTypes = [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'House', label: 'House' },
    { value: 'Land', label: 'Land' },
  ];

  const roomOptions = ['Studio', '1', '2', '3', '4+'];

  const formatNumberWithSpaces = (number) => {
    if (!number) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const removeSpaces = (value) => {
    return value.replace(/\s/g, '');
  };

  useEffect(() => {
    const updateWidths = () => {
      const calculateWidth = (ref, setWidth, minWidth, maxWidth) => {
        if (ref.current) {
          ref.current.style.width = 'auto';
          const textWidth = ref.current.scrollWidth + 8;
          const windowWidth = window.innerWidth;
          const adjustedMaxWidth = windowWidth <= 480 ? maxWidth * 0.6 : windowWidth <= 768 ? maxWidth * 0.8 : maxWidth;
          setWidth(`${Math.min(Math.max(textWidth, minWidth), adjustedMaxWidth)}px`);
        }
      };

      calculateWidth(locationSelectorRef, setLocationSelectorWidth, 80, 250);
      calculateWidth(dealTypeSelectorRef, setDealTypeSelectorWidth, 80, 200);
      calculateWidth(propertyTypeSelectorRef, setPropertyTypeSelectorWidth, 60, 150);
      calculateWidth(priceInputRef, setPriceInputWidth, 80, 200);

      const updateButtonStyles = (ref, setStyle) => {
        if (ref.current) {
          const windowWidth = window.innerWidth;
          const fontSize = windowWidth <= 480 ? '10px' : windowWidth <= 768 ? '12px' : '14px';
          const padding = windowWidth <= 480 ? '0 6px' : windowWidth <= 768 ? '0 8px' : '0 12px';
          setStyle({ fontSize, padding });
        }
      };

      updateButtonStyles(filterBtnRef, setFilterBtnStyle);
      updateButtonStyles(searchBtnRef, setSearchBtnStyle);
      updateButtonStyles(mapBtnRef, setMapBtnStyle);
    };

    const timeout = setTimeout(updateWidths, 0);
    window.addEventListener('resize', updateWidths);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateWidths);
    };
  }, [t, searchCountry, searchCity, dealType, rentType, propertyType, searchPriceMax]);

  useEffect(() => {
    if (isCountryModalOpen || isCityModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCountryModalOpen, isCityModalOpen]);

  const handleDealTypeChange = (type) => {
    setDealType(type);
    if (type === 'buy') {
      setRentType('');
    } else {
      setRentType('rent_long');
    }
    setIsDealTypeDropdownOpen(false);
    setIsRentTypeDropdownOpen(false);
    setIsPropertyTypeDropdownOpen(false);
    if (dealTypeTimeout) clearTimeout(dealTypeTimeout);
  };

  const handleRentTypeChange = (type) => {
    setRentType(type);
    setIsRentTypeDropdownOpen(false);
    setIsDealTypeDropdownOpen(false);
    setIsPropertyTypeDropdownOpen(false);
    if (rentTypeTimeout) clearTimeout(rentTypeTimeout);
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    setIsPropertyTypeDropdownOpen(false);
    setIsDealTypeDropdownOpen(false);
    setIsRentTypeDropdownOpen(false);
    if (propertyTypeTimeout) clearTimeout(propertyTypeTimeout);
  };

  const handleRoomToggle = (room) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter(r => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const selectedCountryCities = tempCountry ? countries.find(c => c.name === tempCountry)?.cities || [] : [];

  const selectedCountryFlag = searchCountry
    ? (countries.find(c => c.name === searchCountry)?.flag || null)
    : null;

  const selectedCurrencySymbol = currencies && currencies.find(c => c.code === selectedCurrency)?.symbol || '€';

  const handleTempCountrySelect = (country) => {
    setTempCountry(country);
    setTempCity('');
    setSearchCountry(country);
    setSearchCity('');
    setIsCountryModalOpen(false);
    setCountrySearch('');
    setTimeout(() => setIsCityModalOpen(true), 300);
  };

  const handleTempCitySelect = (city) => {
    setTempCity(city);
    setSearchCity(city);
    setIsCityModalOpen(false);
    setCitySearch('');
  };

  const handleClearCountry = () => {
    setTempCountry('');
    setTempCity('');
    setSearchCountry('');
    setSearchCity('');
    setIsCountryModalOpen(false);
    setCountrySearch('');
  };

  const handleClearCity = () => {
    setTempCity('');
    setSearchCity('');
    setIsCityModalOpen(false);
    setCitySearch('');
  };

  const handleChangeCountry = () => {
    setIsCityModalOpen(false);
    setCitySearch('');
    setTimeout(() => setIsCountryModalOpen(true), 300);
  };

  const filterAndSortItems = (items, searchText, isCountry = false) => {
    const searchLower = searchText.toLowerCase();
    const filtered = items.filter(item => {
      const name = isCountry ? item.name : item;
      const translatedName = t(name).toLowerCase();
      const originalName = name.toLowerCase();
      return (translatedName.includes(searchLower) || originalName.includes(searchLower));
    });

    return filtered.sort((a, b) => {
      const aName = isCountry ? a.name : a;
      const bName = isCountry ? b.name : b;
      const aTranslated = t(aName).toLowerCase();
      const bTranslated = t(bName).toLowerCase();
      const aStartsWith = aTranslated.startsWith(searchLower);
      const bStartsWith = bTranslated.startsWith(searchLower);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return aTranslated.localeCompare(bTranslated);
    });
  };

  const filteredCountries = filterAndSortItems(countries, countrySearch, true);
  const filteredCities = filterAndSortItems(selectedCountryCities, citySearch);

  const handleDealTypeMouseEnter = () => {
    if (dealTypeTimeout) clearTimeout(dealTypeTimeout);
    setIsDealTypeDropdownOpen(true);
    setIsRentTypeDropdownOpen(false);
    setIsPropertyTypeDropdownOpen(false);
  };

  const handleDealTypeMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDealTypeDropdownOpen(false);
    }, 100);
    setDealTypeTimeout(timeout);
  };

  const handleRentTypeMouseEnter = () => {
    if (rentTypeTimeout) clearTimeout(rentTypeTimeout);
    if (dealType === 'rent') {
      setIsRentTypeDropdownOpen(true);
      setIsDealTypeDropdownOpen(false);
      setIsPropertyTypeDropdownOpen(false);
    }
  };

  const handleRentTypeMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsRentTypeDropdownOpen(false);
    }, 100);
    setRentTypeTimeout(timeout);
  };

  const handlePropertyTypeMouseEnter = () => {
    if (propertyTypeTimeout) clearTimeout(propertyTypeTimeout);
    setIsPropertyTypeDropdownOpen(true);
    setIsDealTypeDropdownOpen(false);
    setIsRentTypeDropdownOpen(false);
  };

  const handlePropertyTypeMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsPropertyTypeDropdownOpen(false);
    }, 100);
    setPropertyTypeTimeout(timeout);
  };

  const handleModalOverlayClick = (e, modalType) => {
    if (e.target === e.currentTarget) {
      if (modalType === 'country') {
        setIsCountryModalOpen(false);
        setCountrySearch('');
        setTempCountry(searchCountry);
        setTempCity(searchCity);
      } else if (modalType === 'city') {
        setIsCityModalOpen(false);
        setCitySearch('');
        setTempCity(searchCity);
      }
    }
  };

  const handleCloseCountryModal = () => {
    setIsCountryModalOpen(false);
    setCountrySearch('');
    setTempCountry(searchCountry);
    setTempCity(searchCity);
  };

  const handleLocationSelectorClick = (target) => {
    if (target === 'country' && searchCountry) {
      setIsCountryModalOpen(true);
    } else if (searchCountry) {
      setIsCityModalOpen(true);
      setTempCountry(searchCountry);
    } else {
      setIsCountryModalOpen(true);
    }
  };

  const handleSearch = () => {
    const filterParams = {
      country: searchCountry,
      city: searchCity,
      dealType,
      rentType: dealType === 'rent' ? rentType : null,
      propertyType,
      rooms: selectedRooms.length > 0 ? selectedRooms : null,
      priceMax: searchPriceMax ? parseFloat(searchPriceMax) : null,
    };
    onFilter(filterParams);
    onSearchRedirect(filterParams);
  };

  const handleMapClick = () => {
    console.log('Открыть карту для выбора места');
  };

  const handlePriceMaxChange = (e) => {
    const rawValue = removeSpaces(e.target.value);
    if (rawValue === '' || !isNaN(rawValue)) {
      setSearchPriceMax(rawValue);
    }
  };

  return (
    <section className="listing-filter search-bar">
      <div className="search-bar-container">
        <div className="filter-wrapper">
          <div className="filter-container">
            <div
              className={`location-selector ${searchCountry ? 'has-divider' : ''}`}
              style={{ width: locationSelectorWidth }}
              ref={locationSelectorRef}
            >
              <div
                className={`location-part country ${!searchCountry ? 'full' : ''}`}
                onClick={() => handleLocationSelectorClick('country')}
              >
                <div className="location-text">
                  {searchCountry ? (
                    <>
                      <span>{selectedCountryFlag}</span>
                      <span>{t(searchCountry)}</span>
                    </>
                  ) : (
                    t('search_country')
                  )}
                </div>
              </div>
              {searchCountry && (
                <div
                  className="location-part city"
                  onClick={() => handleLocationSelectorClick('city')}
                >
                  <div className="location-text">
                    {searchCity ? t(searchCity) : t('search_city')}
                  </div>
                </div>
              )}
            </div>
            <div
              className={`deal-type-selector ${dealType === 'rent' ? 'has-divider' : ''}`}
              style={{ width: dealTypeSelectorWidth }}
              ref={dealTypeSelectorRef}
            >
              <div
                className={`deal-type-part deal ${dealType !== 'rent' ? 'full' : ''}`}
                onMouseEnter={handleDealTypeMouseEnter}
                onMouseLeave={handleDealTypeMouseLeave}
              >
                <div className="deal-type-text">
                  {t(dealType)}
                </div>
                <div
                  className={`deal-type-dropdown ${isDealTypeDropdownOpen ? 'open' : ''}`}
                  onMouseEnter={handleDealTypeMouseEnter}
                  onMouseLeave={handleDealTypeMouseLeave}
                >
                  {dealTypes.map(type => (
                    <div
                      key={type.value}
                      className="deal-type-option"
                      onClick={() => handleDealTypeChange(type.value)}
                    >
                      {t(type.label)}
                    </div>
                  ))}
                </div>
              </div>
              {dealType === 'rent' && (
                <div
                  className="deal-type-part rent-type"
                  onMouseEnter={handleRentTypeMouseEnter}
                  onMouseLeave={handleRentTypeMouseLeave}
                >
                  <div className="deal-type-text">
                    {t(rentType)}
                  </div>
                  <div
                    className={`deal-type-dropdown rent-type-dropdown ${isRentTypeDropdownOpen ? 'open' : ''}`}
                    onMouseEnter={handleRentTypeMouseEnter}
                    onMouseLeave={handleRentTypeMouseLeave}
                  >
                    {rentTypes.map(type => (
                      <div
                        key={type.value}
                        className="deal-type-option"
                        onClick={() => handleRentTypeChange(type.value)}
                      >
                        {t(type.label)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              className="property-type-selector"
              style={{ width: propertyTypeSelectorWidth }}
              ref={propertyTypeSelectorRef}
            >
              <div
                className="property-type-part"
                onMouseEnter={handlePropertyTypeMouseEnter}
                onMouseLeave={handlePropertyTypeMouseLeave}
              >
                <div className="property-type-text">
                  {t(propertyType)}
                </div>
                <div
                  className={`property-type-dropdown ${isPropertyTypeDropdownOpen ? 'open' : ''}`}
                  onMouseEnter={handlePropertyTypeMouseEnter}
                  onMouseLeave={handlePropertyTypeMouseLeave}
                >
                  {propertyTypes.map(type => (
                    <div
                      key={type.value}
                      className="property-type-option"
                      onClick={() => handlePropertyTypeChange(type.value)}
                    >
                      {t(type.label)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rooms-filter">
              {roomOptions.map((room, index) => (
                <React.Fragment key={room}>
                  <button
                    className={`room-button ${selectedRooms.includes(room) ? 'active' : ''}`}
                    onClick={() => handleRoomToggle(room)}
                  >
                    {t(room)}
                  </button>
                  {index < roomOptions.length - 1 && <span className="divider">|</span>}
                </React.Fragment>
              ))}
              <span className="divider">|</span>
            </div>
            <div
              className="price-input-container"
              style={{ width: priceInputWidth }}
              ref={priceInputRef}
            >
              <input
                type="text"
                placeholder={t('search_price_max')}
                value={formatNumberWithSpaces(searchPriceMax)}
                onChange={handlePriceMaxChange}
                className="price-input"
              />
              <span className="currency-symbol">{selectedCurrencySymbol}</span>
            </div>
          </div>
          <button
            className="map-btn"
            onClick={handleMapClick}
            ref={mapBtnRef}
            style={mapBtnStyle}
          >
            <div className="map-btn-content">
              <FiMap className="map-btn-icon" />
              <span className="map-btn-text">{t('Map')}</span>
            </div>
          </button>
          <button
            className="search-btn"
            onClick={handleSearch}
            ref={searchBtnRef}
            style={searchBtnStyle}
          >
            <FiSearch className="primary-btn-icon" />
            <span className="search-btn-text">{t('Search')}</span>
          </button>
        </div>
      </div>

      {isCountryModalOpen && (
        <div className="listing-modal-overlay" onClick={(e) => handleModalOverlayClick(e, 'country')}>
          <div className="listing-modal listing-modal-countries">
            <div className="listing-modal-header">
              <h3>{t('search_country').toUpperCase()}</h3>
              <button className="listing-modal-close" onClick={handleCloseCountryModal}>
                <FiX />
              </button>
            </div>
            <div className="listing-modal-search-container">
              <FiSearch className="listing-modal-search-icon" />
              <input
                type="text"
                placeholder={t('search')}
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="listing-modal-search"
              />
            </div>
            <div className="listing-modal-content">
              <div className="listing-modal-list">
                <div className="listing-modal-countries-grid">
                  {filteredCountries.map(country => (
                    <div
                      key={country.name}
                      className={`listing-modal-item ${tempCountry === country.name ? 'selected' : ''}`}
                      onClick={() => handleTempCountrySelect(country.name)}
                    >
                      <span className="listing-modal-item-icon">{country.flag}</span>
                      {t(country.name)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="listing-modal-footer">
              <button className="listing-modal-btn clear" onClick={handleClearCountry}>
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCityModalOpen && (
        <div className="listing-modal-overlay" onClick={(e) => handleModalOverlayClick(e, 'city')}>
          <div className="listing-modal listing-modal-cities">
            <div className="listing-modal-header">
              <h3>{t('search_city').toUpperCase()}</h3>
              <button className="listing-modal-close" onClick={() => setIsCityModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="listing-modal-search-container">
              <FiSearch className="listing-modal-search-icon" />
              <input
                type="text"
                placeholder={t('search')}
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="listing-modal-search"
              />
            </div>
            <div className="listing-modal-content">
              <div className="listing-modal-list cities-grid">
                {filteredCities.map(city => (
                  <div
                    key={city}
                    className={`listing-modal-item city-item ${tempCity === city ? 'selected' : ''}`}
                    onClick={() => handleTempCitySelect(city)}
                  >
                    <FiMapPin className="listing-modal-item-icon" />
                    {t(city)}
                  </div>
                ))}
              </div>
            </div>
            <div className="listing-modal-footer">
              <button className="listing-modal-btn clear" onClick={handleChangeCountry}>
                <FiGlobe className="modal-btn-icon" />
                {t('change_country')}
              </button>
              <button className="listing-modal-btn clear" onClick={handleClearCity}>
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FilterListing;