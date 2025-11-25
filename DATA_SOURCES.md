# PROJECT 147 - Data Sources

## Overview
This project contains 147 books across all biblical traditions with cross-reference data.

---

## Primary Cross-Reference Data

### OpenBible.info Cross-References
- **File**: `data/cross-references/cross_references_88books.txt`
- **Fresh Download**: `data/cross-references/cross_references.txt`
- **Count**: 345,073 verse-to-verse cross-references
- **Source**: https://www.openbible.info
- **GitHub**: https://github.com/openbibleinfo
- **License**: CC-BY
- **Format**: Tab-separated (From Verse, To Verse, Votes)

### OpenBible GitHub Repositories
- **Bible-Passage-Reference-Parser** - TypeScript to parse refs like "John 3:16"
- **Bible-Geocoding-Data** - Geographic data for every place in Protestant Bible
- **American-Standard-Version-Bible** - Full ASV (1901) text with footnotes
- **Bible-Reference-Formatter** - OSIS to human-readable converter
- **Bible-Query-Parser** - Interpret search queries as Bible references

### Processed Graph Data
- **File**: `data/processed/graph_data_88books.json`
- **Content**: 88-book graph with 143,207 chapter connections
- **Stats**: `data/processed/stats_88books.json`

---

## Bible Text Sources

### KJV Bible (Protestant Canon)
- **File**: `data/bible-text/bible-kjv-converted.json`
- **Books**: 66 (Genesis - Revelation)

### Deuterocanonical Texts
- **File**: `data/bible-text/deuterocanonical-texts.json`
- **Books**: 14 (Tobit, Judith, Wisdom, Sirach, Baruch, 1-2 Maccabees, etc.)

---

## Theographic Bible Metadata
- **Source**: https://github.com/robertrouse/theographic-bible-metadata
- **Location**: `data/theographic/`
- **Files**:
  - `books.json` - Bible book metadata
  - `chapters.json` - Chapter information
  - `verses.json` - Verse data
  - `people.json` - Biblical people
  - `peopleGroups.json` - People groups
  - `places.json` - Biblical locations
  - `events.json` - Biblical events
  - `periods.json` - Historical periods
  - `easton.json` - Easton's Bible Dictionary

---

## Church Fathers Collection
- **Location**: `data/raw-sources/scrollmapper/churchFathersNiceneAndAnteNicene/`
- **Content**: 37 volumes of Philip Schaff's Church Fathers
- **Series**:
  - Ante-Nicene Fathers (9 volumes)
  - Nicene Series 1 (14 volumes) - Sts. Augustine, John Chrysostom
  - Nicene Series 2 (14 volumes) - Sts. Jerome, Athanasius, Basil
- **Contact**: nico@ancientbible.org

---

## Pseudepigrapha Collection
- **Location**: `data/raw-sources/pseudepigrapha/`
- **Source**: Grammateus project
- **Content**: Ancient Jewish texts not in Protestant canon

---

## Coptic Scriptorium
- **Location**: `data/raw-sources/coptic/`
- **Content**: Coptic Christian texts
- **Includes**: Pseudo-Theophilus texts

---

## Dead Sea Scrolls (10 Books)
- **Location**: `data/dead-sea-scrolls/`
- **Files**:
  - community-rule.html (1QS)
  - war-scroll.html (1QM)
  - temple-scroll.html (11QT)
  - damascus-document.html (CD)
  - thanksgiving-hymns.html (1QH)
  - pesher-habakkuk.html
  - book-of-giants.html
  - copper-scroll.html (3Q15)
  - genesis-apocryphon.html
  - songs-sabbath-sacrifice.html

---

## Gnostic & Early Christian Texts (22+ Books)
- **Location**: `data/gnostic/`
- **Files**:
  - gospel-of-thomas.html
  - gospel-of-judas.html
  - gospel-of-mary.html
  - gospel-of-peter.html
  - gospel-of-philip.html
  - gospel-of-truth.html
  - gospel-of-nicodemus.html
  - gospel-of-hebrews.html
  - gospel-of-egyptians.html
  - infancy-gospel-thomas.html
  - protoevangelium-james.html
  - secret-gospel-mark.html
  - apocryphon-of-john.html
  - sophia-jesus-christ.html
  - pistis-sophia.html
  - dialogue-savior.html
  - book-thomas-contender.html
  - didache.html
  - epistle-barnabas.html
  - acts-paul-thecla.html
  - assumption-moses.html
  - testament-abraham.html
  - testament-job.html
  - apocalypse-abraham.html
  - 3-maccabees.html
  - 4-maccabees.html
  - psalms-solomon.html
  - 4-ezra.html

---

## 147-Book Breakdown

| Category | Count | Source |
|----------|-------|--------|
| Protestant OT | 39 | OpenBible.info |
| Protestant NT | 27 | OpenBible.info |
| Deuterocanonical | 14 | Scrollmapper |
| Ethiopian/Pseudepigrapha | 21 | Various |
| Dead Sea Scrolls | 10 | Qumran texts |
| Gnostic/Early Christian | 22 | Nag Hammadi, etc. |
| Lost Books | 14 | Referenced only |
| **Total** | **147** | |

---

## Non-Canonical Cross-References (11 Examples)

These connect NT to non-canonical texts:
1. Jude 1:14-15 ↔ 1 Enoch 1:9 (Direct Quote)
2. Jude 1:6 ↔ 1 Enoch 10:4-6 (Angels in Chains)
3. 2 Peter 2:4 ↔ 1 Enoch 10:4-6 (Angels in Tartarus)
4. Hebrews 11:35 ↔ 4 Maccabees 6:27-29 (Refusing Deliverance)
5. Matthew 22:29-30 ↔ 1 Enoch 15:6-7 (Angels Don't Marry)
6. Matthew 25:31 ↔ 1 Enoch 62:5 (Son of Man with Angels)
7. Luke 16:19-31 ↔ 1 Enoch 22:1-14 (Afterlife Compartments)
8. Revelation 4:1-8 ↔ 1 Enoch 14:8-23 (Heavenly Throne Vision)
9. Matthew 19:28 ↔ Testament of 12 Patriarchs (Twelve Thrones)
10. John 5:22 ↔ 1 Enoch 69:27 (Judgment to Son of Man)
11. Romans 8:38-39 ↔ Testament of 12 Patriarchs (Powers & Principalities)

---

## License Information
- OpenBible.info: CC-BY
- Theographic: Check repository
- Church Fathers: Public Domain
- Scrollmapper: Check repository

---

*PROJECT 147 | Truth Seeking Division*
*Last Updated: 2025-11-24*
*Creator: @Ringmast4r*
