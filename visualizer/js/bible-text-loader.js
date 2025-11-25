// Bible Text Loader - Loads verse text from JSON
class BibleTextLoader {
    constructor() {
        this.verseData = {};
        this.loaded = false;

        // Book name abbreviation mappings
        this.bookAbbreviations = {
            'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
            'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
            '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
            'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms',
            'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
            'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
            'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah',
            'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
            'Zech': 'Zechariah', 'Mal': 'Malachi',
            'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts',
            'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', 'Gal': 'Galatians',
            'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians', '1Thess': '1 Thessalonians',
            '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy', 'Titus': 'Titus',
            'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
            '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude', 'Rev': 'Revelation',
            // Deuterocanonical Books
            'Tob': 'Tobit', 'Jdt': 'Judith', 'Wis': 'Wisdom', 'Sir': 'Sirach', 'Bar': 'Baruch',
            '1Macc': '1 Maccabees', '2Macc': '2 Maccabees', '3Macc': '3 Maccabees', '4Macc': '4 Maccabees',
            // Ethiopian/Pseudepigrapha
            '1En': '1 Enoch', '2En': '2 Enoch', '3En': '3 Enoch', 'Jub': 'Jubilees',
            '4Ezra': '4 Ezra', 'PsSol': 'Psalms of Solomon', 'T12Pat': 'Testament of Twelve Patriarchs'
        };
    }

    async load() {
        try {
            console.log('📖 Loading Bible text...');

            const response = await fetch('../data/bible-text/bible-kjv-converted.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.verseData = await response.json();
            this.loaded = true;

            console.log(`✅ Loaded ${Object.keys(this.verseData).length} verses`);
            return this.verseData;
        } catch (error) {
            console.error('❌ Error loading Bible text:', error);
            throw error;
        }
    }

    // Convert "Gen.1.1" to "Genesis 1:1"
    normalizeReference(ref) {
        if (!ref) return null;

        // Handle ranges like "Gen.1.1-Gen.1.3"
        if (ref.includes('-')) {
            const parts = ref.split('-');
            return this.normalizeReference(parts[0]); // Just get first verse for now
        }

        // Split into book and verse (e.g., "Gen.1.1" -> ["Gen", "1.1"])
        const match = ref.match(/^([A-Za-z0-9]+)\.(.+)$/);
        if (!match) return null;

        const bookAbbrev = match[1];
        const verseRef = match[2].replace(/\./g, ':'); // Replace dots with colons

        // Get full book name
        const fullBook = this.bookAbbreviations[bookAbbrev] || bookAbbrev;

        return `${fullBook} ${verseRef}`;
    }

    // Get verse text by reference
    getVerseText(ref) {
        if (!this.loaded) return '';

        const normalized = this.normalizeReference(ref);
        if (!normalized) return '';

        const text = this.verseData[normalized];
        if (!text) return '';

        // Truncate long verses
        if (text.length > 200) {
            return text.substring(0, 197) + '...';
        }

        return text;
    }

    // Get verse range text
    getRangeText(ref) {
        if (!this.loaded || !ref) return '';

        // For ranges, combine multiple verses
        if (ref.includes('-')) {
            const parts = ref.split('-');
            const startText = this.getVerseText(parts[0]);
            if (startText) {
                return startText + ' [continued...]';
            }
        }

        return this.getVerseText(ref);
    }

    // Get all verses for a chapter
    async getChapter(bookName, chapter) {
        if (!this.loaded) {
            await this.load();
        }

        const verses = [];
        const chapterNum = parseInt(chapter);

        // Find all verses matching this book and chapter
        for (const [ref, text] of Object.entries(this.verseData)) {
            // Parse reference like "Genesis 1:1"
            const match = ref.match(/^(.+)\s+(\d+):(\d+)$/);
            if (match) {
                const refBook = match[1];
                const refChapter = parseInt(match[2]);
                const refVerse = parseInt(match[3]);

                if (refBook === bookName && refChapter === chapterNum) {
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
    module.exports = BibleTextLoader;
}
