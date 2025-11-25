// Cross-Reference Enricher
// Matches OpenBible cross-references to actual KJV verse text
// Creates enriched data with full verse content

class CrossRefEnricher {
    constructor() {
        this.kjvBible = null;
        this.crossRefs = [];
        this.enrichedRefs = [];

        // Book abbreviation to full name mapping
        this.bookMap = {
            'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers',
            'Deut': 'Deuteronomy', 'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth',
            '1Sam': '1 Samuel', '2Sam': '2 Samuel', '1Kgs': '1 Kings', '2Kgs': '2 Kings',
            '1Chr': '1 Chronicles', '2Chr': '2 Chronicles', 'Ezra': 'Ezra', 'Neh': 'Nehemiah',
            'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms', 'Prov': 'Proverbs',
            'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
            'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
            'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah',
            'Jonah': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk',
            'Zeph': 'Zephaniah', 'Hag': 'Haggai', 'Zech': 'Zechariah', 'Mal': 'Malachi',
            'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John',
            'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians',
            'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
            '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians',
            '1Tim': '1 Timothy', '2Tim': '2 Timothy', 'Titus': 'Titus', 'Phlm': 'Philemon',
            'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
            '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude',
            'Rev': 'Revelation'
        };
    }

    /**
     * Convert OpenBible reference format to KJV format
     * "Gen.1.1" -> "Genesis 1:1"
     * "Ps.89.11-Ps.89.12" -> "Psalms 89:11" (first verse of range)
     */
    convertRef(openBibleRef) {
        if (!openBibleRef) return null;

        // Handle ranges - just get first verse
        let ref = openBibleRef;
        if (ref.includes('-')) {
            ref = ref.split('-')[0];
        }

        // Parse: Book.Chapter.Verse
        const parts = ref.split('.');
        if (parts.length < 3) return null;

        const bookAbbrev = parts[0];
        const chapter = parts[1];
        const verse = parts[2];

        const fullBook = this.bookMap[bookAbbrev];
        if (!fullBook) {
            console.warn(`Unknown book abbreviation: ${bookAbbrev}`);
            return null;
        }

        return `${fullBook} ${chapter}:${verse}`;
    }

    /**
     * Get verse text from KJV Bible
     */
    getVerseText(kjvRef) {
        if (!this.kjvBible || !kjvRef) return null;
        return this.kjvBible[kjvRef] || null;
    }

    /**
     * Load KJV Bible JSON
     */
    async loadKJV(path = '../data/bible-text/bible-kjv-converted.json') {
        try {
            const response = await fetch(path);
            this.kjvBible = await response.json();
            console.log(`✅ Loaded KJV Bible with ${Object.keys(this.kjvBible).length} verses`);
            return true;
        } catch (error) {
            console.error('❌ Error loading KJV Bible:', error);
            return false;
        }
    }

    /**
     * Load cross-references from text file
     */
    async loadCrossRefs(path = '../cross_references.txt') {
        try {
            const response = await fetch(path);
            const text = await response.text();
            const lines = text.trim().split('\n');

            // Skip header line
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split('\t');
                if (parts.length >= 3) {
                    this.crossRefs.push({
                        from: parts[0],
                        to: parts[1],
                        votes: parseInt(parts[2]) || 0
                    });
                }
            }

            console.log(`✅ Loaded ${this.crossRefs.length} cross-references`);
            return true;
        } catch (error) {
            console.error('❌ Error loading cross-references:', error);
            return false;
        }
    }

    /**
     * Enrich cross-references with verse text
     */
    enrichCrossRefs(limit = null) {
        console.log('📚 Enriching cross-references with verse text...');

        const refs = limit ? this.crossRefs.slice(0, limit) : this.crossRefs;
        let matched = 0;
        let unmatched = 0;

        this.enrichedRefs = refs.map(ref => {
            const fromKJV = this.convertRef(ref.from);
            const toKJV = this.convertRef(ref.to);

            const fromText = this.getVerseText(fromKJV);
            const toText = this.getVerseText(toKJV);

            if (fromText && toText) {
                matched++;
            } else {
                unmatched++;
            }

            return {
                fromRef: ref.from,
                toRef: ref.to,
                votes: ref.votes,
                fromKJV: fromKJV,
                toKJV: toKJV,
                fromText: fromText ? this.truncate(fromText, 200) : null,
                toText: toText ? this.truncate(toText, 200) : null
            };
        });

        console.log(`✅ Enrichment complete: ${matched} matched, ${unmatched} unmatched`);
        return this.enrichedRefs;
    }

    /**
     * Truncate text to max length
     */
    truncate(text, maxLength) {
        if (!text) return text;
        // Remove leading # markers
        text = text.replace(/^#\s*/, '');
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Get enriched reference by original reference
     */
    getEnrichedRef(fromRef, toRef) {
        return this.enrichedRefs.find(r => r.fromRef === fromRef && r.toRef === toRef);
    }

    /**
     * Search cross-references by verse
     */
    searchByVerse(verseRef) {
        const kjvFormat = this.convertRef(verseRef) || verseRef;
        return this.enrichedRefs.filter(r =>
            r.fromKJV === kjvFormat || r.toKJV === kjvFormat ||
            r.fromRef === verseRef || r.toRef === verseRef
        );
    }

    /**
     * Get top cross-references by vote count
     */
    getTopCrossRefs(count = 100) {
        return [...this.enrichedRefs]
            .sort((a, b) => b.votes - a.votes)
            .slice(0, count);
    }

    /**
     * Export enriched data as JSON
     */
    exportJSON() {
        return JSON.stringify({
            metadata: {
                source: 'OpenBible.info',
                date: new Date().toISOString(),
                total: this.enrichedRefs.length,
                matched: this.enrichedRefs.filter(r => r.fromText && r.toText).length
            },
            crossReferences: this.enrichedRefs
        }, null, 2);
    }
}

// Global instance
const crossRefEnricher = new CrossRefEnricher();

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.crossRefEnricher = crossRefEnricher;
}
