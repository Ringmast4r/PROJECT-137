// Data Augmenter - Extends 88-book data to 147 books
// Adds Dead Sea Scrolls, Gnostic texts, Lost books, and missing Ethiopian/Deuterocanonical

class DataAugmenter147 {
    constructor() {
        // Additional books to add beyond the 88-book base
        this.additionalBooks = {
            // Missing Deuterocanonical (7 more to reach 14)
            deuterocanonical: [
                { name: 'Susanna', abbrev: 'Sus', chapters: 1, testament: 'OT', canon: 'Deuterocanonical' },
                { name: 'Bel and the Dragon', abbrev: 'Bel', chapters: 1, testament: 'OT', canon: 'Deuterocanonical' },
                { name: 'Prayer of Azariah', abbrev: 'PrAzar', chapters: 1, testament: 'OT', canon: 'Deuterocanonical' },
                { name: 'Greek Esther', abbrev: 'GkEsth', chapters: 6, testament: 'OT', canon: 'Deuterocanonical' },
                { name: '1 Esdras', abbrev: '1Esd', chapters: 9, testament: 'OT', canon: 'Deuterocanonical' },
                { name: '2 Esdras', abbrev: '2Esd', chapters: 16, testament: 'OT', canon: 'Deuterocanonical' }
            ],
            // Missing Ethiopian/Pseudepigrapha (6 more to reach 21)
            ethiopian: [
                { name: '2 Enoch', abbrev: '2En', chapters: 68, testament: 'OT', canon: 'Ethiopian' },
                { name: '3 Enoch', abbrev: '3En', chapters: 48, testament: 'OT', canon: 'Ethiopian' },
                { name: '2 Baruch', abbrev: '2Bar', chapters: 87, testament: 'OT', canon: 'Ethiopian' },
                { name: '3 Baruch', abbrev: '3Bar', chapters: 17, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Life of Adam and Eve', abbrev: 'LAE', chapters: 51, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Book of Jasher', abbrev: 'Jasher', chapters: 91, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Testament of Solomon', abbrev: 'TSol', chapters: 26, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Martyrdom of Isaiah', abbrev: 'MartIsa', chapters: 11, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Assumption of Moses', abbrev: 'AssMos', chapters: 12, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Testament of Abraham', abbrev: 'TAb', chapters: 20, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Testament of Job', abbrev: 'TJob', chapters: 53, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Apocalypse of Abraham', abbrev: 'ApocAb', chapters: 32, testament: 'OT', canon: 'Ethiopian' },
                { name: 'Apocalypse of Sedrach', abbrev: 'ApocSed', chapters: 1, testament: 'OT', canon: 'Ethiopian' }
            ],
            // Dead Sea Scrolls (10 books)
            deadSeaScrolls: [
                { name: 'Community Rule', abbrev: '1QS', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'War Scroll', abbrev: '1QM', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Temple Scroll', abbrev: '11QT', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Damascus Document', abbrev: 'CD', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Thanksgiving Hymns', abbrev: '1QH', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Pesher Habakkuk', abbrev: '1QpHab', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Book of Giants', abbrev: 'Giants', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Copper Scroll', abbrev: '3Q15', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Genesis Apocryphon', abbrev: '1QapGen', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' },
                { name: 'Songs of Sabbath Sacrifice', abbrev: '4Q400', chapters: 1, testament: 'DSS', canon: 'Dead Sea Scrolls' }
            ],
            // Gnostic & Early Christian (22 books)
            gnostic: [
                { name: 'Gospel of Thomas', abbrev: 'GThom', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of Judas', abbrev: 'GJud', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of Mary', abbrev: 'GMary', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of Peter', abbrev: 'GPet', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of Philip', abbrev: 'GPhil', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of the Hebrews', abbrev: 'GHeb', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of the Egyptians', abbrev: 'GEgy', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of Truth', abbrev: 'GTruth', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Gospel of Nicodemus', abbrev: 'GNic', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Infancy Gospel of Thomas', abbrev: 'InfThom', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Protoevangelium of James', abbrev: 'ProtJas', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Secret Gospel of Mark', abbrev: 'SecMark', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Apocryphon of John', abbrev: 'ApocJohn', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Sophia of Jesus Christ', abbrev: 'SophJC', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Pistis Sophia', abbrev: 'PistSoph', chapters: 4, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Dialogue of the Savior', abbrev: 'DialSav', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Book of Thomas', abbrev: 'BkThom', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Didache', abbrev: 'Did', chapters: 16, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Shepherd of Hermas', abbrev: 'Hermas', chapters: 114, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Epistle of Barnabas', abbrev: 'Barn', chapters: 21, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Acts of Paul and Thecla', abbrev: 'ActsPT', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' },
                { name: 'Apocalypse of Peter', abbrev: 'ApocPet', chapters: 1, testament: 'Gnostic', canon: 'Gnostic' }
            ],
            // Lost Books (14 books) - Referenced but lost
            lost: [
                { name: 'Book of the Wars of the Lord', abbrev: 'WarsLord', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Book of Jasher (Lost)', abbrev: 'JasherL', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Annals of Solomon', abbrev: 'AnnSol', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Annals of Kings of Israel', abbrev: 'AnnIsr', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Annals of Kings of Judah', abbrev: 'AnnJud', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Book of Samuel the Seer', abbrev: 'SamSeer', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Book of Nathan the Prophet', abbrev: 'Nathan', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Book of Gad the Seer', abbrev: 'GadSeer', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Prophecy of Ahijah', abbrev: 'Ahijah', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Visions of Iddo the Seer', abbrev: 'Iddo', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Book of Shemaiah', abbrev: 'Shemaiah', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Book of Jehu', abbrev: 'Jehu', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Sayings of the Seers', abbrev: 'SaySeers', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Epistle to Laodiceans', abbrev: 'EpLaod', chapters: 1, testament: 'Lost', canon: 'Lost' },
                { name: 'Earlier Epistle to Corinthians', abbrev: 'EarlierCor', chapters: 1, testament: 'Lost', canon: 'Lost' }
            ]
        };

        // Non-canonical cross-references (the 11 examples from the table)
        this.nonCanonicalConnections = [
            // High Confidence (100 votes)
            { sourceBook: 'Jude', sourceChapter: 1, targetBook: '1 Enoch', targetChapter: 1, weight: 100, type: 'Direct Quote' },
            { sourceBook: 'Jude', sourceChapter: 1, targetBook: '1 Enoch', targetChapter: 10, weight: 100, type: 'Angels in Chains' },
            { sourceBook: '2 Peter', sourceChapter: 2, targetBook: '1 Enoch', targetChapter: 10, weight: 100, type: 'Angels in Tartarus' },
            { sourceBook: 'Hebrews', sourceChapter: 11, targetBook: '4 Maccabees', targetChapter: 6, weight: 100, type: 'Refusing Deliverance' },
            // Medium Confidence (50 votes)
            { sourceBook: 'Matthew', sourceChapter: 22, targetBook: '1 Enoch', targetChapter: 15, weight: 50, type: 'Angels Don\'t Marry' },
            { sourceBook: 'Matthew', sourceChapter: 25, targetBook: '1 Enoch', targetChapter: 62, weight: 50, type: 'Son of Man with Angels' },
            { sourceBook: 'Luke', sourceChapter: 16, targetBook: '1 Enoch', targetChapter: 22, weight: 50, type: 'Afterlife Compartments' },
            { sourceBook: 'Revelation', sourceChapter: 4, targetBook: '1 Enoch', targetChapter: 14, weight: 50, type: 'Heavenly Throne Vision' },
            // Lower Confidence (25 votes)
            { sourceBook: 'Matthew', sourceChapter: 19, targetBook: 'Testament of the Twelve Patriarchs', targetChapter: 1, weight: 25, type: 'Twelve Thrones' },
            { sourceBook: 'John', sourceChapter: 5, targetBook: '1 Enoch', targetChapter: 69, weight: 25, type: 'Judgment to Son of Man' },
            { sourceBook: 'Romans', sourceChapter: 8, targetBook: 'Testament of the Twelve Patriarchs', targetChapter: 1, weight: 25, type: 'Powers & Principalities' }
        ];
    }

    /**
     * Augment the loaded graph data with additional books and connections
     * @param {Object} graphData - The original 88-book graph data
     * @returns {Object} - Augmented 147-book graph data
     */
    augment(graphData) {
        if (!graphData || !graphData.books) {
            console.error('Invalid graph data for augmentation');
            return graphData;
        }

        console.log('📚 Augmenting data from 88 to 147 books...');

        // Clone the original data
        const augmented = JSON.parse(JSON.stringify(graphData));

        // Track starting chapter index
        let currentChapterIndex = augmented.chapters.length;
        const bookNameToIndex = new Map();

        // Build map of existing books
        augmented.books.forEach((book, idx) => {
            bookNameToIndex.set(book.name, idx);
        });

        // Add additional books in order
        const addOrder = ['deuterocanonical', 'ethiopian', 'deadSeaScrolls', 'gnostic', 'lost'];

        addOrder.forEach(category => {
            const books = this.additionalBooks[category];
            books.forEach(book => {
                // Check if book already exists
                if (bookNameToIndex.has(book.name)) {
                    console.log(`  ⏭️ Skipping existing book: ${book.name}`);
                    return;
                }

                // Add book
                const bookIndex = augmented.books.length;
                augmented.books.push(book);
                bookNameToIndex.set(book.name, bookIndex);

                // Add chapters for this book
                for (let ch = 1; ch <= book.chapters; ch++) {
                    augmented.chapters.push({
                        id: `${book.abbrev}.${ch}`,
                        book: book.name,
                        chapter: ch,
                        testament: book.testament,
                        canon: book.canon
                    });
                    currentChapterIndex++;
                }

                console.log(`  ➕ Added: ${book.name} (${book.chapters} chapters)`);
            });
        });

        // Build chapter lookup map
        const chapterMap = new Map();
        augmented.chapters.forEach((ch, idx) => {
            const key = `${ch.book}:${ch.chapter}`;
            chapterMap.set(key, idx);
        });

        // Add non-canonical cross-references
        console.log('🔗 Adding non-canonical cross-references...');
        this.nonCanonicalConnections.forEach(conn => {
            const sourceKey = `${conn.sourceBook}:${conn.sourceChapter}`;
            const targetKey = `${conn.targetBook}:${conn.targetChapter}`;

            const sourceIdx = chapterMap.get(sourceKey);
            const targetIdx = chapterMap.get(targetKey);

            if (sourceIdx !== undefined && targetIdx !== undefined) {
                const distance = Math.abs(targetIdx - sourceIdx);
                augmented.connections.push({
                    source: sourceIdx,
                    target: targetIdx,
                    weight: conn.weight,
                    distance: distance,
                    type: conn.type,
                    nonCanonical: true
                });
                console.log(`  ✅ ${conn.sourceBook} ${conn.sourceChapter} → ${conn.targetBook} ${conn.targetChapter}`);
            } else {
                console.log(`  ⚠️ Could not find chapters for: ${sourceKey} → ${targetKey}`);
            }
        });

        // Update metadata
        augmented.metadata = {
            ...augmented.metadata,
            total_books: augmented.books.length,
            total_chapters: augmented.chapters.length,
            total_connections: augmented.connections.length,
            canon: '147-book Complete Biblical Library',
            includes_deuterocanonical: true,
            includes_ethiopian: true,
            includes_dead_sea_scrolls: true,
            includes_gnostic: true,
            includes_lost: true,
            augmented: true
        };

        console.log(`✅ Augmentation complete: ${augmented.metadata.total_books} books, ${augmented.metadata.total_chapters} chapters, ${augmented.metadata.total_connections} connections`);

        return augmented;
    }
}

// Global instance
const dataAugmenter = new DataAugmenter147();
