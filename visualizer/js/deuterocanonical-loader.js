// Deuterocanonical Text Loader - Loads non-canonical verse text from JSON
class DeuterocanonicalLoader {
    constructor() {
        this.bookData = {};
        this.loaded = false;

        // Abbreviation mappings for cross-reference format
        this.abbrevMappings = {
            'Wis': 'Wis', 'Wisdom': 'Wis',
            'Sir': 'Sir', 'Sirach': 'Sir', 'Ecclesiasticus': 'Sir',
            'Tob': 'Tob', 'Tobit': 'Tob',
            'Jdt': 'Jdt', 'Judith': 'Jdt',
            'Bar': 'Bar', 'Baruch': 'Bar', '1Bar': 'Bar',
            '1Macc': '1Macc', '1 Maccabees': '1Macc', '1Mac': '1Macc',
            '2Macc': '2Macc', '2 Maccabees': '2Macc', '2Mac': '2Macc',
            '1En': '1En', '1 Enoch': '1En', '1Enoch': '1En',
            '2En': '2En', '2 Enoch': '2En', '2Enoch': '2En',
            '3En': '3En', '3 Enoch': '3En', '3Enoch': '3En',
            'Jub': 'Jub', 'Jubilees': 'Jub',
            '1Esd': '1Esd', '1 Esdras': '1Esd',
            '2Esd': '2Esd', '2 Esdras': '2Esd', '4Ezra': '2Esd',
            '2Bar': '2Bar', '2 Baruch': '2Bar',
            '3Bar': '3Bar', '3 Baruch': '3Bar',
            '4Bar': '4Bar', '4 Baruch': '4Bar',
            'Sus': 'Sus', 'Susanna': 'Sus',
            'Bel': 'Bel', 'Bel and the Dragon': 'Bel',
            'PrAzar': 'PrAzar', 'Prayer of Azariah': 'PrAzar',
            'PrMan': 'PrMan', 'Prayer of Manasseh': 'PrMan',
            'GkEsth': 'GkEsth', 'Greek Esther': 'GkEsth',
            'Jasher': 'Jasher', 'Book of Jasher': 'Jasher',
            'LAE': 'LAE', 'Life of Adam and Eve': 'LAE',
            'AscIsa': 'AscIsa', 'Ascension of Isaiah': 'AscIsa',
            'ApocPet': 'ApocPet', 'Apocalypse of Peter': 'ApocPet',
            'TSol': 'TSol', 'Testament of Solomon': 'TSol',
            'T12Pat': 'T12Pat', 'Testament of 12 Patriarchs': 'T12Pat', 'Testaments of the Twelve Patriarchs': 'T12Pat',
            'Hermas': 'Hermas', 'Shepherd of Hermas': 'Hermas',
            'Sedrach': 'Sedrach', 'Apocalypse of Sedrach': 'Sedrach',
            '4Macc': '4Macc', '4 Maccabees': '4Macc',
            '3Macc': '3Macc', '3 Maccabees': '3Macc',
        };
    }

    async load() {
        try {
            console.log('📜 Loading deuterocanonical texts...');

            const response = await fetch('../data/bible-text/deuterocanonical-texts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.bookData = data.books;
            this.loaded = true;

            console.log(`✅ Loaded ${data.book_count} deuterocanonical books`);
            return this.bookData;
        } catch (error) {
            console.error('❌ Error loading deuterocanonical texts:', error);
            throw error;
        }
    }

    // Parse reference like "Wis.2.18" or "Sir.5.11" or "1Macc.4.59"
    parseReference(ref) {
        if (!ref) return null;

        // Handle ranges - just get first verse
        if (ref.includes('-')) {
            ref = ref.split('-')[0];
        }

        // Pattern: BookAbbrev.Chapter.Verse or BookAbbrev Chapter:Verse
        const patterns = [
            /^(\d?[A-Za-z]+)\.(\d+)\.(\d+)$/,  // Wis.2.18
            /^(\d?[A-Za-z]+)\s+(\d+):(\d+)$/,   // Wisdom 2:18
            /^(\d?[A-Za-z]+)\.(\d+):(\d+)$/,    // Wis.2:18
        ];

        for (const pattern of patterns) {
            const match = ref.match(pattern);
            if (match) {
                return {
                    book: match[1],
                    chapter: match[2],
                    verse: match[3]
                };
            }
        }

        return null;
    }

    // Get verse text by reference
    getVerseText(ref) {
        if (!this.loaded) return '';

        const parsed = this.parseReference(ref);
        if (!parsed) return '';

        // Normalize book abbreviation
        const abbrev = this.abbrevMappings[parsed.book] || parsed.book;

        // Look up in book data
        const book = this.bookData[abbrev];
        if (!book) return '';

        const verseRef = `${parsed.chapter}:${parsed.verse}`;
        const text = book.verses[verseRef];

        if (!text) return '';

        // Truncate long texts
        if (text.length > 300) {
            return text.substring(0, 297) + '...';
        }

        return text;
    }

    // Get verse range text
    getRangeText(ref) {
        if (!this.loaded || !ref) return '';

        // For ranges, try to get first verse
        const text = this.getVerseText(ref);
        if (text && ref.includes('-')) {
            return text + ' [continued...]';
        }

        return text;
    }

    // Get full book name from abbreviation
    getBookName(abbrev) {
        const normalizedAbbrev = this.abbrevMappings[abbrev] || abbrev;
        const book = this.bookData[normalizedAbbrev];
        return book ? book.name : abbrev;
    }

    // Get all verses for a chapter
    getChapterVerses(bookAbbrev, chapter) {
        if (!this.loaded) return [];

        // Normalize book abbreviation
        const abbrev = this.abbrevMappings[bookAbbrev] || bookAbbrev;
        const book = this.bookData[abbrev];
        if (!book || !book.verses) return [];

        const chapterNum = parseInt(chapter);
        const verses = [];

        // Find all verses matching this chapter
        for (const [ref, text] of Object.entries(book.verses)) {
            // Parse reference like "1:1" or "2:15"
            const match = ref.match(/^(\d+):(\d+)$/);
            if (match) {
                const refChapter = parseInt(match[1]);
                const refVerse = parseInt(match[2]);

                if (refChapter === chapterNum) {
                    verses.push({
                        verse: refVerse,
                        text: text
                    });
                }
            }
        }

        // Sort by verse number
        verses.sort((a, b) => a.verse - b.verse);
        return verses;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeuterocanonicalLoader;
}
