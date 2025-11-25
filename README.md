# PROJECT 147 - Biblical Cross-Reference Visualizer

**Status**: Phase 3 Complete - 147-Book Visualization Live
**Date**: November 24, 2025
**Location**: `C:\Users\Squir\Desktop\project 118\`
**Live Demo**: http://localhost:8080/visualizer/arc-diagram.html

---

## Overview

A comprehensive Bible cross-reference visualization system covering **147 books** across all major biblical traditions - the largest cross-reference dataset ever assembled.

---

## 147-Book Breakdown

| Category | Books | Description |
|----------|-------|-------------|
| Protestant OT | 39 | Genesis - Malachi |
| Protestant NT | 27 | Matthew - Revelation |
| Deuterocanonical | 14 | Tobit, Judith, Wisdom, Sirach, Baruch, 1-4 Maccabees, etc. |
| Ethiopian/Pseudepigrapha | 21 | 1-3 Enoch, Jubilees, Testaments, etc. |
| Dead Sea Scrolls | 10 | Qumran texts (1QS, 1QM, 11QT, etc.) |
| Gnostic/Early Christian | 22 | Gospel of Thomas, Gospel of Judas, Didache, etc. |
| Lost Books | 14 | Referenced but not extant |
| **TOTAL** | **147** | |

---

## Data Sources

### Primary Cross-References
| Source | Count | License |
|--------|-------|---------|
| [OpenBible.info](https://www.openbible.info) | 344,800 | CC-BY |
| [OpenBible GitHub](https://github.com/openbibleinfo) | 5 repos | Various |

### OpenBible GitHub Repositories
- `Bible-Passage-Reference-Parser` - Parse refs like "John 3:16"
- `Bible-Geocoding-Data` - Geographic data for biblical places
- `American-Standard-Version-Bible` - Full ASV (1901) text
- `Bible-Reference-Formatter` - OSIS to human-readable
- `Bible-Query-Parser` - Interpret search queries

### Bible Text Sources
| Source | Content |
|--------|---------|
| KJV Bible | 66 Protestant books |
| [Theographic](https://github.com/robertrouse/theographic-bible-metadata) | People, Places, Events, Periods |
| [Scrollmapper](https://github.com/scrollmapper/bible_databases_deuterocanonical) | Deuterocanonical + Church Fathers (974 texts) |

### Additional Sources
| Source | Content |
|--------|---------|
| [OnlineCriticalPseudepigrapha](https://github.com/OnlineCriticalPseudepigrapha/Online-Critical-Pseudepigrapha) | 39+ Pseudepigrapha XML |
| [CopticScriptorium](https://github.com/CopticScriptorium/corpora) | Coptic texts |
| [magna25](https://github.com/magna25/amharic-bible-json) | Amharic Bible |
| [Gnosis.org](http://www.gnosis.org/naghamm/nhl.html) | Nag Hammadi Library |
| [Wikisource](https://en.wikisource.org) | Meqabyan (Ethiopian Maccabees) |

---

## Visualizer Pages

| Page | File | Description |
|------|------|-------------|
| Arc Diagram | `arc-diagram.html` | 147 books with rainbow arcs + red non-canonical |
| Timeline | `timeline.html` | Historical timeline with modal reader |
| Library | `library.html` | Browse all 147 books |
| History | `history.html` | Canon formation history |
| Cross-Refs | `table-view.html` | Searchable cross-reference table |

---

## Project Structure

```
project 118/                     <-- SERVER MUST RUN FROM HERE
├── README.md                    (This file)
├── PROGRESS-SUMMARY.md          (Detailed progress tracking)
├── DATA_SOURCES.md              (Complete data source documentation)
├── INVENTORY.md                 (Data inventory)
├── QUICKSTART.md                (Quick reference)
│
├── visualizer/                  (Web application HTML/JS/CSS)
│   ├── arc-diagram.html         (147-book arc visualization)
│   ├── timeline.html            (Historical timeline)
│   ├── library.html             (Book library)
│   ├── history.html             (Canon history)
│   ├── table-view.html          (Cross-reference table)
│   ├── js/                      (JavaScript files)
│   │   ├── data-augmenter-147.js
│   │   ├── data-loader.js
│   │   ├── arc-diagram-tableau-style.js
│   │   ├── cross-ref-loader.js
│   │   ├── bible-text-loader.js
│   │   └── theographic-loader.js
│   ├── css/                     (Stylesheets)
│   └── lib/                     (D3.js, other libraries)
│
├── data/                        (ALL DATA - consolidated)
│   ├── cross-references/        (345K+ cross-reference files)
│   │   ├── cross_references_88books.txt
│   │   └── cross_references.txt
│   ├── bible-text/              (Bible text JSON)
│   │   ├── bible-kjv-converted.json
│   │   └── deuterocanonical-texts.json
│   ├── theographic/             (People, Places, Events metadata)
│   │   ├── books.json
│   │   ├── people.json
│   │   ├── places.json
│   │   └── events.json
│   ├── dead-sea-scrolls/        (10 DSS HTML files)
│   ├── gnostic/                 (22+ Gnostic HTML files)
│   ├── processed/               (Pre-processed graph data)
│   │   ├── graph_data_88books.json
│   │   └── stats_88books.json
│   └── raw-sources/             (Raw downloaded repositories)
│       ├── pseudepigrapha/
│       ├── scrollmapper/
│       ├── coptic/
│       └── amharic-bible/
│
└── source-texts/                (Additional source materials)
```

---

## Non-Canonical Cross-References

These 11 examples show NT connections to non-canonical texts (displayed in RED on arc diagram):

| NT Source | Target | Type |
|-----------|--------|------|
| Jude 1:14-15 | 1 Enoch 1:9 | Direct Quote |
| Jude 1:6 | 1 Enoch 10:4-6 | Angels in Chains |
| 2 Peter 2:4 | 1 Enoch 10:4-6 | Angels in Tartarus |
| Hebrews 11:35 | 4 Maccabees 6:27-29 | Refusing Deliverance |
| Matthew 22:29-30 | 1 Enoch 15:6-7 | Angels Don't Marry |
| Matthew 25:31 | 1 Enoch 62:5 | Son of Man |
| Luke 16:19-31 | 1 Enoch 22:1-14 | Afterlife Compartments |
| Revelation 4:1-8 | 1 Enoch 14:8-23 | Throne Vision |
| Matthew 19:28 | Testament of 12 Patriarchs | Twelve Thrones |
| John 5:22 | 1 Enoch 69:27 | Judgment |
| Romans 8:38-39 | Testament of 12 Patriarchs | Powers |

---

## Quick Start

```bash
# IMPORTANT: Run server from project root, NOT from visualizer/
cd "C:\Users\Squir\Desktop\project 118"
python -m http.server 8080
```

Then open in browser:
- **Arc Diagram**: http://localhost:8080/visualizer/arc-diagram.html
- **Timeline**: http://localhost:8080/visualizer/timeline.html
- **Library**: http://localhost:8080/visualizer/library.html
- **Cross-Refs**: http://localhost:8080/visualizer/table-view.html

Features:
- View all 147 books with cross-reference arcs
- Red arcs = Non-canonical cross-references
- Color-coded books by canon type

---

## License

- Cross-references: CC-BY (OpenBible.info)
- Theographic data: See repository
- Church Fathers: Public Domain
- Scrollmapper: See repository

---

**Last Updated**: November 24, 2025
**Project Creator**: @Ringmast4r
**Status**: PROJECT 147 - 147 Books Visualized!
