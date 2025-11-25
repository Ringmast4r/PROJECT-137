# PROJECT 147 - Biblical Cross-Reference Visualizer

**Date**: November 24, 2025
**Status**: Phase 3 Complete - 147-Book Visualization Live

---

## 🆕 Latest Updates (Nov 24, 2025)

### Arc Diagram Now Shows All 147 Books!
- ✅ Created `data-augmenter-147.js` to extend 88-book data to 147 books
- ✅ Added Dead Sea Scrolls (10), Gnostic (22), Lost (14) books
- ✅ **Non-canonical cross-refs display in SOLID RED** with glow effect
- ✅ Color-coded books by canon type in visualization
- ✅ Updated tooltips to show canon information

### Data Sources Verified
- ✅ **345,073 cross-references** from OpenBible.info preserved
- ✅ Theographic Bible Metadata integrated
- ✅ Church Fathers (37 volumes) available
- ✅ All HTML files for DSS and Gnostic texts in place

---

## 📊 147-Book Breakdown

| Category | Count | Color |
|----------|-------|-------|
| Protestant OT | 39 | Green (#2ecc71) |
| Protestant NT | 27 | Cyan (#00CED1) |
| Deuterocanonical | 14 | Purple (#9370DB) |
| Ethiopian/Pseudepigrapha | 21 | Pink (#ff6b9d) |
| Dead Sea Scrolls | 10 | Blue (#00BFFF) |
| Gnostic/Early Christian | 22 | Red (#ff4444) |
| Lost Books | 14 | Orange (#ffa500) |
| **TOTAL** | **147** | |

---

## 🔴 Non-Canonical Cross-References (11 Examples)

| NT Source | Non-Canon Target | Type | Votes |
|-----------|-----------------|------|-------|
| Jude 1:14-15 | 1 Enoch 1:9 | Direct Quote ⭐ | 100 |
| Jude 1:6 | 1 Enoch 10:4-6 | Angels in Chains | 100 |
| 2 Peter 2:4 | 1 Enoch 10:4-6 | Angels in Tartarus | 100 |
| Hebrews 11:35 | 4 Maccabees 6:27-29 | Refusing Deliverance | 100 |
| Matthew 22:29-30 | 1 Enoch 15:6-7 | Angels Don't Marry | 50 |
| Matthew 25:31 | 1 Enoch 62:5 | Son of Man | 50 |
| Luke 16:19-31 | 1 Enoch 22:1-14 | Afterlife | 50 |
| Revelation 4:1-8 | 1 Enoch 14:8-23 | Throne Vision | 50 |
| Matthew 19:28 | T12 Patriarchs | Twelve Thrones | 25 |
| John 5:22 | 1 Enoch 69:27 | Judgment | 25 |
| Romans 8:38-39 | T12 Patriarchs | Powers | 25 |

---

## 📚 Data Sources (Consolidated in project 118/data/)

### Primary Cross-Reference Data
| Source | File | Count |
|--------|------|-------|
| OpenBible.info | `data/cross-references/cross_references_88books.txt` | 345,073 |
| Processed Graph | `data/processed/graph_data_88books.json` | 143,207 connections |

### Bible Text Sources
| Source | Location |
|--------|----------|
| KJV Bible | `data/bible-text/bible-kjv-converted.json` |
| Deuterocanonical | `data/bible-text/deuterocanonical-texts.json` |
| Dead Sea Scrolls | `data/dead-sea-scrolls/*.html` (10 files) |
| Gnostic Texts | `data/gnostic/*.html` (22+ files) |

### Metadata & Reference
| Source | Location | URL |
|--------|----------|-----|
| Theographic Bible | `data/theographic/` | https://github.com/robertrouse/theographic-bible-metadata |
| Church Fathers | `data/raw-sources/scrollmapper/` | 37 volumes |
| Pseudepigrapha | `data/raw-sources/pseudepigrapha/` | Full repository |
| Coptic Scriptorium | `data/raw-sources/coptic/` | Coptic texts |

---

## Visualizer Pages Complete

| Page | URL | Status |
|------|-----|--------|
| Arc Diagram | `/visualizer/arc-diagram.html` | Done - 147 books + red non-canon arcs |
| Timeline | `/visualizer/timeline.html` | Done - Modal popup for reading |
| Library | `/visualizer/library.html` | Done - All 147 books |
| History | `/visualizer/history.html` | Done - Canon history + Roman Catholic |
| Cross-References | `/visualizer/table-view.html` | Done - Searchable table |

**Server**: Run from project root: `cd "project 118" && python -m http.server 8080`

---

## Original Progress (Nov 23, 2025)

---

## ✅ What We've Downloaded (586+ MB)

### 1. Pseudepigrapha Collection - 39 Texts ✅
**Source**: [GitHub - OnlineCriticalPseudepigrapha](https://github.com/OnlineCriticalPseudepigrapha/Online-Critical-Pseudepigrapha)

**Key Ethiopian Books**:
- ✅ **1 Enoch** (Complete 108 chapters in XML)
- ✅ **Jubilees** (Complete book in XML)
- ✅ **Testaments of the 12 Patriarchs**
- ✅ **Psalms of Solomon**
- ✅ **4 Ezra, 2-3 Baruch, 4 Baruch**
- ✅ **3-4 Maccabees**
- ✅ **Testament of Solomon, Testament of Job**
- ✅ **Life of Adam and Eve**
- ✅ **And 30+ more texts**

**Format**: XML with critical apparatus
**Quality**: ⭐⭐⭐⭐⭐ Excellent

---

### 2. Scrollmapper Extra-Biblical - 974 Ancient Texts ✅
**Source**: [GitHub - scrollmapper/bible_databases_deuterocanonical](https://github.com/scrollmapper/bible_databases_deuterocanonical)

**Contents**:
- ✅ **Church Fathers Collection** (Ante-Nicene & Post-Nicene)
  - Apostolic Fathers (Clement, Ignatius, Polycarp)
  - Apologists (Justin Martyr, Athenagoras)
  - Early Theologians (Irenaeus, Tertullian, Origen)
  - Eastern Fathers (Athanasius, Basil, Gregory, Chrysostom)
  - Western Fathers (Ambrose, Jerome, Augustine)
- ✅ **974 total ancient texts** in SQL database

**Format**: SQL, TXT, Markdown
**Quality**: ⭐⭐⭐⭐ Good

---

### 3. Amharic Bible - 66 Books ✅
**Source**: [GitHub - magna25/amharic-bible-json](https://github.com/magna25/amharic-bible-json)

**Contents**:
- ✅ All 66 Protestant canon books in Amharic (አማርኛ)
- Individual JSON files for each book

**Format**: JSON
**Quality**: ⭐⭐⭐⭐ Good
**Note**: Only 66 books, not full 81-book Ethiopian Orthodox canon

---

### 4. Coptic Scriptorium Corpora - DOWNLOADING ⏳
**Source**: [GitHub - CopticScriptorium/corpora](https://github.com/CopticScriptorium/corpora)

**Expected Contents**:
- Coptic texts in TEI XML format
- May include Nag Hammadi texts
- Will check for Gospel of Thomas once downloaded

**Format**: TEI XML, PAULA XML, CoNLL-U
**Status**: Currently downloading...

---

## 🔍 What We Found (But Haven't Downloaded Yet)

### Meqabyan (Ethiopian Maccabees) - Found! ✓
**Source**: [Wikisource - First Book of Ethiopian Maccabees](https://en.wikisource.org/wiki/First_Book_of_Ethiopian_Maccabees)

**Available**:
- ✓ **1 Meqabyan** - English translation on Wikisource (D.P. Curtin translation)
- ✓ **2 Meqabyan** - Published by Dalcassian Press (2023)
- ✓ **3 Meqabyan** - Available in some Ethiopian Bible editions

**Note**: These are completely different from Western 1-4 Maccabees!

**Action Needed**: Extract text from Wikisource or find digital format

---

### Nag Hammadi Library - Partial Access
**Sources**:
- [Gnosis.org Nag Hammadi Library](http://www.gnosis.org/naghamm/nhl.html) - Full English translations
- [Internet Archive - Coptic Gnostic Library](https://archive.org/details/the-coptic-gnostic-library.-a-complete-edition-of-the-nag-hammadi-codices-5-vols.)
- [Coptic Scriptorium](https://data.copticscriptorium.org/) - TEI XML (downloading)

**Available Texts**:
- ✓ Gospel of Thomas
- ✓ Gospel of Philip
- ✓ Gospel of Truth
- ✓ Apocryphon of John
- ✓ 40+ other Nag Hammadi texts

**Action Needed**:
- Check if Coptic Scriptorium has Gospel of Thomas
- Potentially scrape gnosis.org texts (check copyright)
- Or find existing JSON/XML datasets

---

## 📊 Current Statistics

| Category | Downloaded | Found | Still Searching |
|----------|-----------|-------|-----------------|
| Ethiopian Orthodox Books | 2/7 | 5/7 | 0/7 |
| Pseudepigrapha | 39 | 39 | - |
| Church Fathers | 974 | 974 | - |
| Nag Hammadi | 0 | 40+ | Gospel of Thomas XML |
| Amharic Bible | 66 | 66 | 15 more for 81 total |
| **TOTAL TEXTS** | **1,079** | **1,120+** | **~15-40** |

---

## 📚 Book Count Progress

### Towards 88-Book Ethiopian Bible:

**Protestant Canon (66 books)**: ✅ Have in Amharic

**Catholic Deuterocanonical (7 books)**: ✅ Have in NABRE (from deuterocanonicals project)
- Tobit, Judith, 1-2 Maccabees, Wisdom, Sirach, Baruch

**Ethiopian Orthodox Additional Books**:
- ✅ **1 Enoch** (downloaded XML)
- ✅ **Jubilees** (downloaded XML)
- ✓ **1 Meqabyan** (found on Wikisource)
- ✓ **2 Meqabyan** (found, needs download)
- ✓ **3 Meqabyan** (found, needs download)
- ❓ **4 Baruch** - Have as "4Bar.xml" in pseudepigrapha! ✅
- ❓ **Prayer of Manasseh** - Need to search
- ❓ **Psalm 151** - Need to search
- ❓ **1-2 Esdras** - Have as "4Ezra.xml"! ✅

**Current Count**: 66 + 7 + 6 confirmed = **79 books** (close to 81!)

---

## 🎯 What We Need to Complete 88-Book Goal

### High Priority (Ethiopian Canon):
- [ ] **1-3 Meqabyan** - Extract from Wikisource
- [ ] **Prayer of Manasseh** - Search for text
- [ ] **Psalm 151** - Search for text
- [ ] **Additions to Daniel** (Susanna, Bel and the Dragon, Prayer of Azariah)
- [ ] **Additions to Esther**

### Medium Priority (Apocrypha for 88+):
- [ ] **Gospel of Thomas** - Check Coptic Scriptorium download
- [ ] **Gospel of Philip** - Same
- [ ] **Gospel of Judas** - Find source
- [ ] **2-3 Enoch** (Slavonic & Hebrew Enoch)
- [ ] **Book of Jasher**

### Lower Priority (Completeness):
- [ ] **Didache**
- [ ] **Shepherd of Hermas**
- [ ] **Epistle of Barnabas**
- [ ] **More Nag Hammadi texts**

---

## 🚀 Next Steps

### Today:
1. ✓ Downloaded 1,079 ancient texts (586 MB)
2. ✓ Located Meqabyan on Wikisource
3. ⏳ Downloading Coptic Scriptorium
4. ⏳ Creating documentation

### This Week:
1. Extract Meqabyan from Wikisource
2. Search for Prayer of Manasseh, Psalm 151
3. Check Coptic Scriptorium for Gospel of Thomas
4. Convert XML pseudepigrapha to JSON
5. Create schema mapping

### This Month:
1. Build complete 81-88 book database
2. Extract cross-references
3. Analyze text connections
4. Integrate with getproselytized.com

---

## 💡 Key Discoveries

### ✅ We Have More Than We Thought!
Looking through the pseudepigrapha collection, we actually have:
- **4 Baruch** (4Bar.xml) = Paralipomena of Jeremiah ✅
- **4 Ezra** (4Ezra.xml) = 2 Esdras in some traditions ✅
- **3-4 Maccabees** (different from Meqabyan but still valuable) ✅

### ✅ Meqabyan Found!
The elusive Ethiopian Maccabees are available on Wikisource in English translation. Just need to extract the text.

### ✅ Massive Church Fathers Collection
974 ancient texts including all major church fathers - this is a goldmine for understanding early Christianity and biblical interpretation.

### ✅ Critical Editions
The pseudepigrapha XML files are scholarly critical editions with manuscript variants - perfect for serious biblical study.

---

## 📈 Project Status

**Phase 1**: ✅ **COMPLETE** - Downloaded major datasets
**Phase 2**: ⏳ **In Progress** - Finding missing texts (Meqabyan, Psalm 151, Prayer of Manasseh)
**Phase 3**: ⏸️ **Not Started** - Convert to JSON and create cross-references
**Phase 4**: ⏸️ **Not Started** - Integration with getproselytized.com

---

## 🎉 Success Metrics

### Downloaded:
- ✅ 1,079 ancient texts
- ✅ 586+ MB of data
- ✅ 2 of 7 unique Ethiopian books (1 Enoch, Jubilees)
- ✅ All 39 major pseudepigrapha
- ✅ Complete church fathers collection

### Found (Need to Extract):
- ✓ 1-3 Meqabyan (Ethiopian Maccabees)
- ✓ Nag Hammadi library online
- ✓ Gospel of Thomas translations

### Still Searching:
- Prayer of Manasseh
- Psalm 151
- Additions to Daniel & Esther
- Complete 81-book Ethiopian Bible in JSON

---

## 📚 Sources Summary

All data from open sources:
- [OpenBible.info](https://www.openbible.info) - 345K Cross-References (CC-BY)
- [OpenBible GitHub](https://github.com/openbibleinfo) - 5 repositories:
  - `Bible-Passage-Reference-Parser` - Parse refs like "John 3:16"
  - `Bible-Geocoding-Data` - Geographic data for biblical places
  - `American-Standard-Version-Bible` - Full ASV (1901) text
  - `Bible-Reference-Formatter` - OSIS to human-readable
  - `Bible-Query-Parser` - Interpret search queries
- [Theographic Bible Metadata](https://github.com/robertrouse/theographic-bible-metadata) - People, Places, Events, Periods
- [OnlineCriticalPseudepigrapha](https://github.com/OnlineCriticalPseudepigrapha/Online-Critical-Pseudepigrapha) - Pseudepigrapha XML
- [scrollmapper](https://github.com/scrollmapper/bible_databases_deuterocanonical) - Church Fathers + Ancient Texts
- [magna25](https://github.com/magna25/amharic-bible-json) - Amharic Bible JSON
- [CopticScriptorium](https://github.com/CopticScriptorium/corpora) - Coptic texts
- [Wikisource](https://en.wikisource.org/wiki/First_Book_of_Ethiopian_Maccabees) - Meqabyan English
- [Gnosis.org](http://www.gnosis.org/naghamm/nhl.html) - Nag Hammadi Library
- [Internet Archive](https://archive.org/) - Various ancient texts

---

**Last Updated**: November 24, 2025
**Project Creator**: @Ringmast4r
**Status**: PROJECT 147 - 147 Books Visualized
