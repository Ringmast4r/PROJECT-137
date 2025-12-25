// Non-Canonical Text Loader - Loads Gnostic, DSS, and Lost text excerpts
class NonCanonicalTextLoader {
    constructor() {
        this.gnosticTexts = {};
        this.dssTexts = {};  // Will hold loaded JSON data
        this.dssCache = {};   // Cache for processed texts
        this.loaded = false;

        // File mappings for Gnostic texts
        this.gnosticFiles = {
            'GThom': { file: 'gospel-of-thomas.html', name: 'Gospel of Thomas', numbered: true },
            'GMary': { file: 'gospel-of-mary.html', name: 'Gospel of Mary', numbered: false },
            'GJudas': { file: 'gospel-of-judas.html', name: 'Gospel of Judas', numbered: false },
            'GPhil': { file: 'gospel-of-philip.html', name: 'Gospel of Philip', numbered: true },
            'GPet': { file: 'gospel-of-peter.html', name: 'Gospel of Peter', numbered: true },
            'GTruth': { file: 'gospel-of-truth.html', name: 'Gospel of Truth', numbered: false },
            'Did': { file: 'didache.html', name: 'Didache', numbered: true },
            'Barn': { file: 'epistle-barnabas.html', name: 'Epistle of Barnabas', numbered: true },
            'PistSoph': { file: 'pistis-sophia.html', name: 'Pistis Sophia', numbered: false }
        };

        // DSS file mappings
        this.dssFiles = {
            '1QS': { name: 'Community Rule', file: 'community-rule.html' },
            '1QM': { name: 'War Scroll', file: 'war-scroll.html' },
            '1QH': { name: 'Thanksgiving Hymns', file: 'thanksgiving-hymns.html' },
            '11QT': { name: 'Temple Scroll', file: 'temple-scroll.html' },
            'CD': { name: 'Damascus Document', file: 'damascus-document.html' },
            '1QpHab': { name: 'Pesher Habakkuk', file: 'pesher-habakkuk.html' },
            '1QapGen': { name: 'Genesis Apocryphon', file: 'genesis-apocryphon.html' },
            '4Q': { name: 'Book of Giants', file: 'book-of-giants.html' },
            '3Q15': { name: 'Copper Scroll', file: 'copper-scroll.html' }
        };
    }

    async load() {
        try {
            console.log('📜 Loading non-canonical texts...');

            // Load DSS texts JSON
            const dssResponse = await fetch('../data/dead-sea-scrolls/dss-texts.json');
            if (dssResponse.ok) {
                const dssData = await dssResponse.json();
                this.dssTexts = dssData.scrolls;
                console.log('✅ Loaded Dead Sea Scrolls texts');
            }

            this.loaded = true;
            console.log('✅ Non-canonical text loader initialized');

            return true;
        } catch (error) {
            console.error('❌ Error loading non-canonical texts:', error);
            throw error;
        }
    }

    // Parse reference like "GThom.54.1" or "1QS.8.14"
    parseReference(ref) {
        if (!ref) return null;

        // Handle ranges - just get first verse
        if (ref.includes('-')) {
            ref = ref.split('-')[0];
        }

        // Gnostic pattern: GThom.54.1 or Did.7.1
        const gnosticMatch = ref.match(/^([A-Za-z]+)\.(\d+)(?:\.(\d+))?$/);
        if (gnosticMatch) {
            return {
                type: 'gnostic',
                book: gnosticMatch[1],
                chapter: gnosticMatch[2],
                verse: gnosticMatch[3] || '1'
            };
        }

        // DSS pattern: 1QS.8.14 or 1QM.1.2
        const dssMatch = ref.match(/^(\d?[A-Z]+)\.(\d+)(?:\.(\d+))?$/);
        if (dssMatch) {
            return {
                type: 'dss',
                book: dssMatch[1],
                column: dssMatch[2],
                section: dssMatch[3] || '1'
            };
        }

        return null;
    }

    // Get verse text by reference
    async getVerseText(ref) {
        if (!this.loaded) return '';

        const parsed = this.parseReference(ref);
        if (!parsed) return '';

        if (parsed.type === 'gnostic') {
            return await this.getGnosticText(parsed);
        } else if (parsed.type === 'dss') {
            return await this.getDSSText(parsed);
        }

        return '';
    }

    // Get Gnostic text excerpt
    async getGnosticText(parsed) {
        const bookInfo = this.gnosticFiles[parsed.book];
        if (!bookInfo) {
            return `[${parsed.book} text]`;
        }

        // Check if we've already loaded this text
        const cacheKey = `${parsed.book}.${parsed.chapter}`;
        if (this.gnosticTexts[cacheKey]) {
            return this.gnosticTexts[cacheKey];
        }

        try {
            // Load the HTML file
            const response = await fetch(`../data/gnostic/${bookInfo.file}`);
            if (!response.ok) {
                return `[${bookInfo.name} excerpt]`;
            }

            const html = await response.text();

            // Parse HTML to extract the specific saying/verse
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            if (bookInfo.numbered) {
                // Look for numbered paragraphs like <p><strong>(54)</strong> text...</p>
                const allParagraphs = doc.querySelectorAll('p');
                for (const p of allParagraphs) {
                    const strong = p.querySelector('strong');
                    if (strong) {
                        const match = strong.textContent.match(/\((\d+)\)/);
                        if (match && match[1] === parsed.chapter) {
                            // Get text after the strong tag
                            let text = p.textContent.replace(/^\(\d+\)\s*/, '');

                            // Truncate if too long
                            if (text.length > 250) {
                                text = text.substring(0, 247) + '...';
                            }

                            this.gnosticTexts[cacheKey] = text;
                            return text;
                        }
                    }
                }
            }

            // If not found or not numbered, return generic message
            const genericText = `[${bookInfo.name} excerpt]`;
            this.gnosticTexts[cacheKey] = genericText;
            return genericText;

        } catch (error) {
            console.warn(`Could not load ${bookInfo.name}:`, error);
            return `[${bookInfo.name} text]`;
        }
    }

    // Get DSS text - use JSON data structure
    async getDSSText(parsed) {
        // Try to match the book code - handle variations
        let bookCode = parsed.book;

        // Get the scroll data from loaded JSON
        const scrollData = this.dssTexts[bookCode];
        if (!scrollData) {
            return '[Dead Sea Scrolls text]';
        }

        // Build the verse reference (column.section)
        const verseRef = `${parsed.column}.${parsed.section}`;

        // Try to get exact match first
        let text = scrollData.verses[verseRef];

        // If not found, try without the section (just column number)
        if (!text) {
            text = scrollData.verses[parsed.column];
        }

        // If still not found, try to find any verse starting with this column
        if (!text) {
            const columnPrefix = `${parsed.column}.`;
            for (const [ref, verseText] of Object.entries(scrollData.verses)) {
                if (ref.startsWith(columnPrefix)) {
                    text = verseText;
                    break;
                }
            }
        }

        if (!text) {
            return `[${scrollData.name}, ${verseRef}]`;
        }

        // Truncate if too long
        if (text.length > 300) {
            text = text.substring(0, 297) + '...';
        }

        return text;
    }

    // Get book name from abbreviation
    getBookName(abbrev) {
        // Check Gnostic
        if (this.gnosticFiles[abbrev]) {
            return this.gnosticFiles[abbrev].name;
        }

        // Check DSS
        if (this.dssFiles[abbrev]) {
            return this.dssFiles[abbrev].name;
        }

        return abbrev;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NonCanonicalTextLoader;
}
