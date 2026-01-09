# League of Legends API
## Project Overzicht

Deze API biedt endpoints voor het beheren van League of Legends champions en items. Het project bevat alle vereiste functionaliteiten inclusief CRUD operaties, validatie, pagination, zoeken, sorteren en filtering.

## Setup Instructies

### Vereisten
- Node.js (versie 20 of hoger)
- npm (komt met Node.js)

### Installatie

1. Clone de repository:
```bash
git clone https://github.com/simonbeelen/lolapiproject.git
cd lolapiproject
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de database en vul met test data:
```bash
npm run seed
```

4. Start de server:
```bash
npm start
```

5. Open je browser en ga naar:
- API Documentatie: http://localhost:3000
- Visual Overview: http://localhost:3000/overview.html
- Test een endpoint: http://localhost:3000/api/champions


```
lolapiproject/
├── src/
│   ├── controllers/
│   │   ├── championController.js  # Champions CRUD logica
│   │   └── itemController.js      # Items CRUD logica
│   ├── routes/
│   │   ├── champions.js           # Champions routes met validatie
│   │   └── items.js               # Items routes met validatie
│   ├── middleware/
│   │   └── validation.js          # Validatie middleware
│   ├── database.js                # SQLite database setup
│   └── server.js                  # Express server
├── public/
│   ├── index.html                 # API documentatie
│   ├── styles.css                 # Documentatie styling
│   ├── overview.html              # Visual overview pagina
│   ├── overview-styles.css        # Overview styling
│   └── overview.js                # Overview JavaScript
├── database/
│   └── lol.db                     # SQLite database (auto-generated)
├── seed.js                        # Database seed script
├── package.json
├── .gitignore
└── README.md
```

## Features

### Functionele Requirements (Voldaan)

#### 1. Twee CRUD Interfaces
**Champions:**
-  GET `/api/champions` - Haal alle champions op
-  GET `/api/champions/:id` - Haal één champion op
-  POST `/api/champions` - Voeg nieuwe champion toe
-  PUT `/api/champions/:id` - Update champion
-  DELETE `/api/champions/:id` - Verwijder champion

**Items:**
-  GET `/api/items` - Haal alle items op
-  GET `/api/items/:id` - Haal één item op
-  POST `/api/items` - Voeg nieuw item toe
-  PUT `/api/items/:id` - Update item
-  DELETE `/api/items/:id` - Verwijder item

#### 2. Basisvalidatie
-  Velden mogen niet leeg zijn
-  Numerieke velden accepteren geen strings
-  Namen mogen geen cijfers bevatten
-  Validatie middleware op POST en PUT routes

#### 3. Pagination
-  Limit en offset parameters: `?limit=10&offset=20`
-  Response bevat pagination metadata (total, total_pages)

#### 4. Search Functionaliteit
-  Champions: Zoeken op naam en titel (`?search=Yasuo`)
-  Items: Zoeken op naam en beschrijving (`?search=Blade`)

#### 5. HTML Documentatie
-  Volledige API documentatie op root URL (/)
-  Beschrijft alle endpoints met voorbeelden

### Extra Features (Voor Hogere Score)

#### Geavanceerde Validatie
-  Difficulty moet tussen 1-10 zijn
-  Cost mag niet negatief zijn
-  Release date moet in het verleden liggen
-  Role moet uit voorgedefinieerde lijst komen (Tank, Fighter, Assassin, Mage, Marksman, Support)
-  Category moet uit voorgedefinieerde lijst komen (Damage, Defense, Magic, Movement, Consumable)

#### Zoeken op Meerdere Velden
-  Champions: Simultaan zoeken in name EN title
-  Items: Simultaan zoeken in name EN description

#### Sortering
-  Sorteer op elk veld: `?sort=difficulty&order=desc`
-  Ondersteunt ascending (asc) en descending (desc)
-  Werkt gecombineerd met filters en search

#### Filtering
-  Champions filteren op role: `?role=Assassin`
-  Items filteren op category: `?category=Magic`
-  Combineerbaar met andere parameters

### Query Parameters Voorbeelden
```bash
# Pagination
GET /api/champions?limit=5&offset=10

# Search
GET /api/champions?search=ya

# Filter
GET /api/champions?role=Assassin
GET /api/items?category=Magic

# Sort
GET /api/champions?sort=difficulty&order=desc
GET /api/items?sort=cost&order=asc

# Combineren
GET /api/champions?role=Mage&search=lux&sort=difficulty&limit=5
```


##  Bronvermelding

Dit project maakt gebruik van de volgende bronnen en documentatie:

### Officiële Documentatie
- **Express.js Documentation**: https://expressjs.com/
  - Gebruikt voor routing, middleware setup, en server configuratie
  - Specifiek gebruikt: routing guide, middleware guide, API reference
  
- **SQLite3 for Node.js**: https://github.com/TryGhost/node-sqlite3/wiki/API
  - Gebruikt voor alle database operaties (queries, inserts, updates)
  - Database connectie en table creation
  
- **MDN Web Docs - Express/Node.js Tutorial**: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
  - Gebruikt voor form validation patterns en best practices

### Stack Overflow
- **Pagination Implementation**: https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging
  - Gebruikt voor limit/offset pagination logica in SQL queries
  - Toegepast in beide controllers voor getAllChampions en getAllItems

### NPM Packages
```json
{
  "express": "^4.18.2",     
  "sqlite3": "^5.1.6",      
  "dotenv": "^16.3.1",       
  "nodemon": "^3.0.1"        
}
```

### League of Legends Data
- Champion en item informatie is gebaseerd op algemene kennis van League of Legends
- Champion splash arts worden opgehaald van: https://ddragon.leagueoflegends.com/
- Geen gebruik gemaakt van officiële Riot Games API voor dit schoolproject

### Code Snippets & Patterns
- Validation helper functions (regex patterns voor naam validatie)
- Error handling patterns in Express
- REST API design principles
- SQLite transaction handling met db.serialize()


## 📝 Opmerkingen

- De database (lol.db) wordt automatisch aangemaakt bij eerste gebruik
- Seed script kan herhaaldelijk uitgevoerd worden
- API documentatie bevat alle beschikbare endpoints en voorbeelden
