# PROJECT 147 - Data Inventory

**Date**: November 24, 2025
**Status**: Complete - 147 Books + 344,800 Cross-References

---

## Downloaded Datasets Summary

| Dataset | Size | Books/Texts | Format | Source |
|---------|------|-------------|--------|--------|
| OpenBible Cross-References | ~15 MB | 344,800 refs | TXT | openbible.info |
| Pseudepigrapha Collection | ~5 MB | 39+ texts | XML | OnlineCriticalPseudepigrapha |
| Scrollmapper Extra-Biblical | ~579 MB | 974 texts | SQL/TXT | scrollmapper (2024 branch) |
| Theographic Bible Metadata | ~10 MB | 10 datasets | JSON | robertrouse |
| Amharic Bible | ~2 MB | 66 books | JSON | magna25 |
| KJV Bible | ~4 MB | 66 books | JSON | Converted |
| Dead Sea Scrolls | ~1 MB | 10 texts | HTML | Created |
| Gnostic Gospels | ~2 MB | 22+ texts | HTML | Created |
| **TOTAL** | **~620 MB** | **1,200+ texts** | Various | Multiple sources |

---

## Primary Data Sources

### 1. OpenBible.info Cross-References
- **Website**: https://www.openbible.info
- **GitHub**: https://github.com/openbibleinfo
- **Files**:
  - `cross_references_88books.txt` - Original download (345,073 refs)
  - `cross_references_fresh_2025-11-24.txt` - Fresh download (344,800 refs)
- **Format**: Tab-separated (From Verse, To Verse, Votes)
- **License**: CC-BY
- **GitHub Repositories**:
  - Bible-Passage-Reference-Parser
  - Bible-Geocoding-Data
  - American-Standard-Version-Bible
  - Bible-Reference-Formatter
  - Bible-Query-Parser

### 2. Theographic Bible Metadata
- **GitHub**: https://github.com/robertrouse/theographic-bible-metadata
- **Location**: `shared-data/theographic/`
- **Files**:
  - books.json, chapters.json, verses.json
  - people.json, peopleGroups.json
  - places.json, events.json, periods.json
  - easton.json (Easton's Bible Dictionary)

---

## 1. Pseudepigrapha Collection (39 Texts)

**Source**: [GitHub - OnlineCriticalPseudepigrapha](https://github.com/OnlineCriticalPseudepigrapha/Online-Critical-Pseudepigrapha)

**Location**: `data/pseudepigrapha/static/docs/`

**Format**: XML with critical apparatus

### Complete List of Available Texts:

#### Ethiopian Canon Books:
- **1En.xml** - 1 Enoch (Book of Enoch) - 108 chapters
- **Jubi.xml** - Jubilees (Book of Jubilees)
- **LAB.xml** - Liber Antiquitatum Biblicarum (Pseudo-Philo)

#### Apocryphal Apocalypses:
- **2Bar.xml** - 2 Baruch (Syriac Apocalypse of Baruch)
- **2Bar-Syr.xml** - 2 Baruch Syriac version
- **3Bar.xml** - 3 Baruch (Greek Apocalypse of Baruch)
- **4Bar.xml** - 4 Baruch (Paralipomena of Jeremiah)
- **4Ezra.xml** - 4 Ezra (2 Esdras)
- **ApocrEzek.xml** - Apocryphon of Ezekiel

#### Maccabean Literature:
- **3Macc.xml** - 3 Maccabees
- **4Macc.xml** - 4 Maccabees

#### Testaments:
- **T12Patr.xml** - Testaments of the Twelve Patriarchs
- **TAsh.xml** - Testament of Asher
- **TBenj.xml** - Testament of Benjamin
- **TDan.xml** - Testament of Dan
- **TGad.xml** - Testament of Gad
- **TIss.xml** - Testament of Issachar
- **TJob.xml** - Testament of Job
- **TJos.xml** - Testament of Joseph
- **TJud.xml** - Testament of Judah
- **TLevi.xml** - Testament of Levi
- **TMos.xml** - Testament of Moses
- **TNaph.xml** - Testament of Naphtali
- **TReub.xml** - Testament of Reuben
- **TSol.xml** - Testament of Solomon
- **TZeb.xml** - Testament of Zebulun

#### Wisdom Literature:
- **AdamEve.xml** - Life of Adam and Eve
- **PssSol.xml** - Psalms of Solomon
- **OdesSol.xml** - Odes of Solomon

#### Historical/Legendary:
- **ArisEx.xml** - Aristeas the Exegete
- **Aristob.xml** - Aristobulus
- **Artap.xml** - Artapanus
- **ClMal.xml** - Cleodemus Malchus
- **Demetrius.xml** - Demetrius the Chronographer
- **EupPol.xml** - Eupolemus
- **Ezek.xml** - Ezekiel the Tragedian
- **Philo.xml** - Philo the Epic Poet
- **Theod.xml** - Theodotus

#### Dead Sea Scrolls Fragments:
- **4Q548.xml** - 4Q Visions of Amram
- **Amram.xml** - Visions of Amram

---

## 2. Scrollmapper Extra-Biblical Collection

**Source**: [GitHub - scrollmapper/bible_databases_deuterocanonical](https://github.com/scrollmapper/bible_databases_deuterocanonical)

**Location**: `data/scrollmapper-deuterocanonical/`

**Format**: SQL, TXT, Markdown

### Contents:

#### Main Database:
- **bible_extrabiblical.sql** - MySQL database with 974 ancient texts

#### Sub-Collections:
- **churchFathersNiceneAndAnteNicene/** - Early Church Fathers writings
  - Ante-Nicene Fathers (before 325 AD)
  - Nicene and Post-Nicene Fathers
  - Complete works in text format

#### Text Formats:
- **txt/** - Plain text versions of all works
- **md/** - Markdown formatted versions
- **info/** - Metadata and documentation

### Included Church Fathers:
- Apostolic Fathers (Clement, Ignatius, Polycarp, etc.)
- Apologists (Justin Martyr, Athenagoras, etc.)
- Early Theologians (Irenaeus, Tertullian, Origen, etc.)
- Eastern Fathers (Athanasius, Basil, Gregory, Chrysostom, etc.)
- Western Fathers (Ambrose, Jerome, Augustine, etc.)

---

## 3. Amharic Bible (66 Books)

**Source**: [GitHub - magna25/amharic-bible-json](https://github.com/magna25/amharic-bible-json)

**Location**: `data/amharic-bible/`

**Format**: JSON (individual book files)

**Language**: Amharic (አማርኛ) - Ethiopian official language

### Books Included:
- All 66 Protestant canon books in Amharic
- Individual JSON files for each book
- Standard Amharic Bible translation

**Note**: This is the 66-book canon, NOT the full 81-book Ethiopian Orthodox canon. Still searching for complete 81-book dataset with Meqabyan books.

---

## What We Still Need

### High Priority:
- [ ] **1-3 Meqabyan** (Ethiopian Maccabees) - NOT found yet
- [ ] **Complete 81-book Ethiopian Orthodox Bible** in JSON/XML
- [ ] **Psalm 151-155** (Ethiopian additional Psalms)
- [ ] **Prayer of Manasseh**
- [ ] **Additions to Daniel** (Susanna, Bel and the Dragon, Prayer of Azariah)

### Medium Priority:
- [ ] **Nag Hammadi Library** (Gospel of Thomas, Gospel of Philip, Gospel of Judas, etc.)
- [ ] **2-3 Enoch** (Slavonic and Hebrew Enoch)
- [ ] **Book of Jasher**
- [ ] **Apocalypse of Abraham**

### Low Priority (for completeness):
- [ ] **Didache** (Teaching of the Twelve Apostles)
- [ ] **Shepherd of Hermas**
- [ ] **Epistle of Barnabas**
- [ ] **Additional NT Apocrypha**

---

## Data Quality Assessment

### ⭐⭐⭐⭐⭐ Excellent Quality:
- **Pseudepigrapha XML Collection** - Critical editions with manuscript variants
- **1 Enoch XML** - Complete 108 chapters with scholarly apparatus
- **Jubilees XML** - Full text with proper structure

### ⭐⭐⭐⭐ Good Quality:
- **Amharic Bible JSON** - Complete 66 books in structured format
- **Church Fathers Collection** - Complete texts, well-formatted

### ⭐⭐⭐ Moderate Quality:
- **Scrollmapper SQL** - Large collection but needs extraction/conversion

---

## Next Steps

1. **Extract key texts from SQL database**
   - Convert to JSON format
   - Match schema with getproselytized.com

2. **Parse XML pseudepigrapha**
   - Create JSON versions
   - Extract verse references for cross-reference analysis

3. **Search for missing Ethiopian books**
   - 1-3 Meqabyan
   - Psalm 151+
   - Complete 81-book dataset

4. **Download Nag Hammadi texts**
   - Gospel of Thomas
   - Gospel of Philip
   - Gospel of Judas
   - Other gnostic texts

5. **Create cross-reference database**
   - NT → Pseudepigrapha connections
   - OT → Pseudepigrapha connections
   - Apocrypha interconnections

---

## Download Sources

All data downloaded from:
- [OnlineCriticalPseudepigrapha](https://github.com/OnlineCriticalPseudepigrapha/Online-Critical-Pseudepigrapha)
- [scrollmapper/bible_databases_deuterocanonical](https://github.com/scrollmapper/bible_databases_deuterocanonical)
- [magna25/amharic-bible-json](https://github.com/magna25/amharic-bible-json)
- [pseudepigrapha.org](https://pseudepigrapha.org/) - Online Critical Pseudepigrapha website

---

**Last Updated**: November 23, 2025
**Total Downloaded**: 586 MB
**Total Texts**: 1,000+ ancient texts
