# PROJECT 159 - Data Sources

## Overview
This project contains 159 books across all biblical traditions with cross-reference data.

---

## Primary Cross-Reference Data

### OpenBible.info Cross-References + Expanded Non-Canonical
- **File**: `data/cross-references/cross_references_88books.txt`
- **Expansion Files**:
  - `data/cross-references/expanded_noncanonical_refs.txt`
  - `data/cross-references/expanded_noncanonical_refs_v2.txt`
  - `data/cross-references/expanded_noncanonical_refs_v3.txt`
- **Count**: 346,000+ verse-to-verse cross-references
  - 344,800 from OpenBible.info
  - 400 Deuterocanonical (Wisdom, Sirach, Tobit, Judith, Baruch, 1-2 Maccabees)
  - 399 Ethiopian/Pseudepigrapha (1 Enoch, Jubilees, 4 Ezra, T12 Patriarchs, 3-4 Maccabees, Psalms of Solomon)
  - 570+ Dead Sea Scrolls, Gnostic, Ethiopian, Lost books parallels (v3 expansion)
- **Source**: https://www.openbible.info + scholarly additions
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

## 159-Book Breakdown

| Category | Count | Source |
|----------|-------|--------|
| Protestant OT | 39 | OpenBible.info |
| Protestant NT | 27 | OpenBible.info |
| Deuterocanonical | 14 | Scrollmapper |
| Ethiopian/Pseudepigrapha | 21 | Various |
| Dead Sea Scrolls | 10 | Qumran texts |
| Gnostic/Early Christian | 22 | Nag Hammadi, etc. |
| Lost Books | 26 | Referenced only |
| **Total** | **159** | |

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

## Scholarly Sources for V3 Cross-References

### Dead Sea Scrolls Parallels
- **4QMMT**: "Works of the Law" phrase parallels with Galatians and Romans
  - Source: https://rsc.byu.edu/new-testament-history-culture-society/dead-sea-scrolls-new-testament
  - Source: https://catholicproductions.com/blogs/blog/the-dead-sea-scrolls-paul-and-the-works-of-the-law
- **1QS, 1QM, CD, 1QH**: Multiple NT parallels
  - Source: BYU Religious Studies Center

### Pseudepigrapha Parallels
- **Testament of Solomon**: Demonic hierarchy parallels (Matthew 9:34, 12:24-27, Mark 1:27, Luke 11:15)
  - Source: https://readingacts.com/2017/07/18/testament-of-solomon-a-catalog-of-demons/
  - Source: https://intertextual.bible/text/matthew-9.34-testament-of-solomon-6.1
- **Apocalypse of Abraham**: Genesis/Revelation parallels
  - Source: https://intertextual.bible/book/apocalypse-of-abraham/chapter/all
- **Life of Adam and Eve**: Paul's Adam-Christ typology (Romans 5, 1 Corinthians 15, 2 Corinthians 11)
  - Source: https://en.wikipedia.org/wiki/Life_of_Adam_and_Eve
- **Ascension of Isaiah**: Hebrews 11:37 (Isaiah sawn in half), 2 Thessalonians 2:3
  - Source: https://intertextual.bible/text/hebrews-11.37-ascension-of-isaiah-5.11-15
- **2 Enoch (Slavonic)**: Melchizedek parallels with Hebrews 7
  - Source: https://www.anthonydelgado.net/blog-1/a-biblical-theology-of-2-enoch-slavonic-enoch-secrets-of-enoch

### Gnostic Text Parallels
- **Gospel of Truth**: John, Hebrews, Pauline parallels
  - Source: https://en.wikipedia.org/wiki/Gospel_of_Truth
  - Source: https://earlychristianwritings.com/gospeltruth.html
- **Pistis Sophia**: Psalms parallels (Ps 68, 69, 70, 71, 85)
  - Source: https://earlychristianwritings.com/pistis.html
  - Source: https://academic.oup.com/jts/article/73/2/649/6815670

### General Resources
- **intertextual.bible**: Biblical intertextuality database
  - https://intertextual.bible
- **Early Jewish Writings**: https://www.earlyjewishwritings.com
- **Early Christian Writings**: https://www.earlychristianwritings.com

---

## License Information
- OpenBible.info: CC-BY
- Theographic: Check repository
- Church Fathers: Public Domain
- Scrollmapper: Check repository

---

*PROJECT 159 | Truth Seeking Division*
*Last Updated: 2025-11-25*
*Creator: @Ringmast4r*
