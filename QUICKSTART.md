# Quick Start Guide - Ethiopian Bible Project

**Goal**: Build comprehensive Bible database with 88+ books including Ethiopian Orthodox canon and apocrypha

---

## What We Have So Far

✅ **39 Pseudepigrapha texts** (1 Enoch, Jubilees, Testaments, etc.)
✅ **974 Extra-biblical texts** (Church Fathers, ancient writings)
✅ **66 Amharic Bible books**
⏳ **Still searching**: 1-3 Meqabyan, Nag Hammadi, complete 81-book Ethiopian Bible

---

## Folder Structure

```
ethiopian/
├── data/
│   ├── pseudepigrapha/           # 39 XML texts (1 Enoch, Jubilees, etc.)
│   ├── scrollmapper-deuterocanonical/  # 974 ancient texts + Church Fathers
│   └── amharic-bible/            # 66 books in Amharic JSON
│
├── docs/                         # Documentation
├── research/                     # Source research
├── tools/                        # Processing scripts
└── results/                      # Cross-references

README.md         # Full project overview
INVENTORY.md      # Complete data catalog
QUICKSTART.md     # This file
```

---

## Quick Commands

### View 1 Enoch (Book of Enoch):
```bash
cd /c/Users/Squir/Desktop/ethiopian/data/pseudepigrapha/static/docs
cat 1En.xml | head -50
```

### View Jubilees:
```bash
cat Jubi.xml | head -50
```

### List all pseudepigrapha texts:
```bash
ls -1 *.xml
```

### Check Church Fathers collection:
```bash
cd ../scrollmapper-deuterocanonical/txt
ls
```

---

## What's Next

### Immediate (Today):
1. Search for Nag Hammadi JSON/XML (Gospel of Thomas, etc.)
2. Search for 1-3 Meqabyan (Ethiopian Maccabees)
3. Download any missing Ethiopian texts

### Short-term (This Week):
1. Convert XML pseudepigrapha to JSON
2. Extract key texts from SQL database
3. Create schema mapping for getproselytized.com

### Long-term (This Month):
1. Build cross-reference database
2. Analyze text connections
3. Integrate with main project

---

## Key Texts We Have

### Ethiopian Orthodox Unique Books:
- ✅ **1 Enoch** - Complete 108 chapters (XML)
- ✅ **Jubilees** - Complete book (XML)
- ❌ **1 Meqabyan** - Not found yet
- ❌ **2 Meqabyan** - Not found yet
- ❌ **3 Meqabyan** - Not found yet

### Important Pseudepigrapha:
- ✅ **Testaments of the 12 Patriarchs**
- ✅ **Psalms of Solomon**
- ✅ **4 Ezra (2 Esdras)**
- ✅ **2-3 Baruch**
- ✅ **3-4 Maccabees**

### Nag Hammadi / NT Apocrypha:
- ❌ **Gospel of Thomas** - Searching
- ❌ **Gospel of Philip** - Searching
- ❌ **Gospel of Judas** - Searching
- ❌ **Gospel of Mary** - Searching

---

## Data Quality

**Best Quality**: Pseudepigrapha XML files from OnlineCriticalPseudepigrapha
- Scholarly critical editions
- Manuscript variants included
- Ready for analysis

**Good Quality**: Amharic Bible JSON
- Clean structure
- Individual book files
- Missing Ethiopian unique books (need full 81-book version)

**Needs Processing**: Scrollmapper SQL database
- 974 texts total
- Needs extraction to JSON
- Church Fathers included

---

## How to Use This Data

### 1. View a Text:
```bash
# 1 Enoch
cat data/pseudepigrapha/static/docs/1En.xml

# Jubilees
cat data/pseudepigrapha/static/docs/Jubi.xml

# Testament of Solomon
cat data/pseudepigrapha/static/docs/TSol.xml
```

### 2. Count Texts:
```bash
# Pseudepigrapha
ls data/pseudepigrapha/static/docs/*.xml | wc -l

# Amharic books
ls data/amharic-bible/individual_books/ | wc -l
```

### 3. Search for Keywords:
```bash
# Find "Enoch" in files
grep -r "Enoch" data/pseudepigrapha/static/docs/

# Find "wisdom" references
grep -i "wisdom" data/pseudepigrapha/static/docs/*.xml
```

---

## Resources

### Downloaded From:
- [OnlineCriticalPseudepigrapha](https://github.com/OnlineCriticalPseudepigrapha/Online-Critical-Pseudepigrapha) - 39 pseudepigrapha XML files
- [scrollmapper](https://github.com/scrollmapper/bible_databases_deuterocanonical) - 974 ancient texts + Church Fathers
- [magna25](https://github.com/magna25/amharic-bible-json) - Amharic Bible 66 books
- [pseudepigrapha.org](https://pseudepigrapha.org/) - Online critical edition website

### Still Searching:
- Ethiopian Orthodox complete 81-book Bible
- Nag Hammadi Library (JSON/XML)
- 1-3 Meqabyan texts
- Gospel of Thomas and other Gnostic gospels

---

## Next Actions

**Run these searches:**
1. Search for "Nag Hammadi github JSON"
2. Search for "Gospel of Thomas XML dataset"
3. Search for "Meqabyan Ethiopian Maccabees"
4. Search for "complete Ethiopian Bible 81 books JSON"

**Then:**
- Download any found datasets
- Create conversion tools
- Build cross-reference database

---

**Status**: ✅ Phase 1 Complete (600+ MB downloaded)
**Next**: Phase 2 - Find missing texts (Nag Hammadi, Meqabyan)
**Goal**: Complete 88+ book Bible database with apocrypha

---

**Created**: November 23, 2025
