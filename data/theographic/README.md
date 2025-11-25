# Theographic Bible Metadata

This directory contains biblical metadata from the **[Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata)** project - a knowledge graph of biblical people, places, and events.

## 📁 Data Files

### People Data
- **people.json** (4.9MB) - 3,394 biblical people
  - Name, gender, biographical data
  - Birth/death years and locations
  - Group memberships (tribes, families)
  - Verse references (331 verses per person average)
  - Dictionary definitions from Easton's

### Geographic Data
- **places.json** (2.3MB) - 1,638 biblical places
  - GPS coordinates (latitude/longitude)
  - Feature types: City, Region, Water, Mountain, River
  - KJV and ESV names
  - Verse references
  - Easton's Dictionary entries

### Historical Data
- **events.json** (1.7MB) - 1,700+ biblical events
  - Event names and descriptions
  - Connected to time periods
  - Verse references

- **periods.json** (90KB) - 90 time periods
  - Period names (e.g., "Creation", "Exodus", "Kingdom Era")
  - Year numbers for chronological ordering
  - Descriptions and context

### Relationship Data
- **peopleGroups.json** (43KB) - Groups, tribes, and families
  - Nation and tribe identifiers
  - Used to connect people in relationship networks

### Enhanced Metadata
- **books.json** (1.2MB) - Enhanced book metadata
- **chapters.json** (1.8MB) - Chapter-level metadata
- **verses.json** (36MB) - Verse-level enhancements
- **easton.json** (6MB) - Easton's Bible Dictionary (6,000+ entries)

## 📊 Data Statistics

| Category | Count |
|----------|-------|
| People | 3,394 |
| Places | 1,638 |
| Places with GPS | 1,200+ |
| Events | 1,700+ |
| Time Periods | 90 |
| People Groups | 200+ |
| Dictionary Entries | 6,000+ |

## 🔗 Data Relationships

The data is structured as a knowledge graph with connections between:

- **People → Places**: Birth/death locations
- **People → Groups**: Tribal/family memberships
- **People → Events**: Participation in historical events
- **Events → Periods**: Chronological placement
- **Places → Verses**: Geographic references in scripture
- **People → Verses**: Personal mentions in scripture

## 📖 Usage

### Web Visualizer
The web visualizer uses this data for:
- **Geographic Map**: Plotting 1,600+ places on world map
- **Timeline**: Chronological view of events and periods
- **People Network**: Relationship graph of biblical figures
- **Statistics**: Enhanced metrics with theographic data

### CMD Reader (Future)
Planned commands:
```bash
person Abraham    # Look up person details
place Jerusalem   # Find place information
event Exodus      # Search events
define covenant   # Easton's Dictionary lookup
```

### Desktop GUI (Future)
Planned visualizations:
- Geographic heatmap with matplotlib
- Timeline visualization
- People relationship network

## 📜 License

This data is from the Theographic Bible Metadata project and is licensed under:
**Creative Commons Attribution Share-Alike 4.0 (CC BY-SA 4.0)**

### Attribution Required

When using this data, please provide attribution:

> Biblical metadata from [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) by Robert Rouse, licensed under CC BY-SA 4.0.

## 🔗 References

- **Project Repository**: https://github.com/robertrouse/theographic-bible-metadata
- **Visualization Examples**: https://viz.bible
- **License**: https://creativecommons.org/licenses/by-sa/4.0/

## 📝 Data Structure Examples

### People Entry
```json
{
  "id": "recv0dAY2ULzJ687g",
  "fields": {
    "name": "Aaron",
    "gender": "Male",
    "birthYear": ["recR2mYAJh2BnwSdC"],
    "deathYear": ["recCf94cuWqDNmP9K"],
    "memberOf": ["recuYvXjZsXumRLPL"],
    "birthPlace": ["recfrXyxhuYOczKTm"],
    "deathPlace": ["recn5ad7qKvkUdCyZ"],
    "verseCount": 331,
    "dictionaryText": "..."
  }
}
```

### Place Entry
```json
{
  "id": "recirTpwii9yXJ9JM",
  "fields": {
    "displayTitle": "Abana",
    "latitude": "33.545097",
    "longitude": "36.224661",
    "featureType": "River",
    "kjvName": "Abana",
    "esvName": "Abana",
    "verseCount": 1
  }
}
```

### Event Entry
```json
{
  "id": "rec123example",
  "fields": {
    "name": "The Exodus",
    "period": ["recPeriodID"],
    "description": "...",
    "verseCount": 150
  }
}
```

---

**This data enables powerful knowledge graph queries and visualizations across the entire Bible!** 🌐
