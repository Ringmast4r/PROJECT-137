// Cross-Reference Data Loader
class CrossRefLoader {
    constructor() {
        this.allReferences = [];
        this.loaded = false;
    }

    async load() {
        try {
            console.log('📥 Loading cross-references files...');

            // Load main cross-references file
            const response = await fetch('../data/cross-references/cross_references_88books.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            this.parseData(text);
            console.log(`✅ Main file: ${this.allReferences.length} refs`);

            // Load expanded v2 references
            try {
                const v2Response = await fetch('../data/cross-references/expanded_noncanonical_refs_v2.txt');
                if (v2Response.ok) {
                    const v2Text = await v2Response.text();
                    const beforeCount = this.allReferences.length;
                    this.parseData(v2Text);
                    console.log(`✅ V2 expansion: +${this.allReferences.length - beforeCount} refs`);
                }
            } catch (e) { console.warn('V2 file not found'); }

            // Load expanded v3 references (DSS, Gnostic, Lost)
            try {
                const v3Response = await fetch('../data/cross-references/expanded_noncanonical_refs_v3.txt');
                if (v3Response.ok) {
                    const v3Text = await v3Response.text();
                    const beforeCount = this.allReferences.length;
                    this.parseData(v3Text);
                    console.log(`✅ V3 expansion: +${this.allReferences.length - beforeCount} refs`);
                }
            } catch (e) { console.warn('V3 file not found'); }

            this.loaded = true;
            console.log(`✅ Total loaded: ${this.allReferences.length} cross-references`);
            return this.allReferences;
        } catch (error) {
            console.error('❌ Error loading cross-references:', error);
            throw error;
        }
    }

    parseData(text) {
        const lines = text.split('\n');

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;

            const parts = line.split('\t');
            if (parts.length < 3) continue;

            const fromVerse = parts[0].trim();
            const toVerse = parts[1].trim();
            const votes = parseInt(parts[2]) || 0;

            // Determine book type - use 4th column if present, otherwise detect from verse
            const type = parts.length >= 4 && parts[3].trim()
                ? parts[3].trim()
                : this.getBookType(toVerse);

            this.allReferences.push({
                nt: fromVerse,
                target: toVerse,
                votes: votes,
                type: type,
                ntText: '', // Will be populated later if needed
                targetText: '', // Will be populated later if needed
                desc: this.generateDescription(fromVerse, toVerse, type)
            });
        }
    }

    getBookType(verse) {
        // Dead Sea Scrolls
        if (verse.includes('1QS') || verse.includes('1QM') || verse.includes('1QH')) return 'Dead Sea Scrolls';
        if (verse.includes('11QT') || verse.includes('CD.') || verse.includes('4Q')) return 'Dead Sea Scrolls';
        if (verse.includes('4QMMT')) return 'Dead Sea Scrolls';

        // Lost Books
        if (verse.includes('JasherL') || verse.includes('WarsLord')) return 'Lost';
        if (verse.includes('AnnSol') || verse.includes('AnnIsr') || verse.includes('AnnJud')) return 'Lost';
        if (verse.includes('SamSeer') || verse.includes('Nathan.') || verse.includes('GadSeer')) return 'Lost';
        if (verse.includes('Ahijah') || verse.includes('Iddo.') || verse.includes('Shemaiah')) return 'Lost';
        if (verse.includes('Jehu.') || verse.includes('SaySeers')) return 'Lost';
        if (verse.includes('EpLaod') || verse.includes('EarlierCor') || verse.includes('StoryIddo')) return 'Lost';

        // Ethiopian/Pseudepigrapha books
        if (verse.includes('1En.') || verse.includes('Enoch')) return 'Ethiopian';
        if (verse.includes('2Bar') || verse.includes('2 Baruch')) return 'Ethiopian';
        if (verse.includes('Jub.') || verse.includes('Jubilees')) return 'Ethiopian';
        if (verse.includes('Meq')) return 'Ethiopian';
        if (verse.includes('4Macc')) return 'Ethiopian';
        if (verse.includes('3Macc')) return 'Ethiopian';
        if (verse.includes('PsSol') || verse.includes('Psalms of Solomon')) return 'Ethiopian';
        if (verse.includes('4Ezra')) return 'Ethiopian';
        if (verse.includes('4Bar')) return 'Ethiopian';
        if (verse.includes('T12Pat')) return 'Ethiopian';
        if (verse.includes('Odes')) return 'Ethiopian';
        if (verse.includes('Prayer of Manasseh')) return 'Ethiopian';
        if (verse.includes('Psalm 151')) return 'Ethiopian';
        if (verse.includes('AssMos') || verse.includes('Assumption')) return 'Ethiopian';
        // Testaments of the Twelve Patriarchs - individual books
        if (verse.includes('TLevi')) return 'Ethiopian';
        if (verse.includes('TJud')) return 'Ethiopian';
        if (verse.includes('TBenj')) return 'Ethiopian';
        if (verse.includes('TReub')) return 'Ethiopian';
        if (verse.includes('TGad')) return 'Ethiopian';
        if (verse.includes('TDan')) return 'Ethiopian';
        if (verse.includes('TZeb')) return 'Ethiopian';
        if (verse.includes('TIss')) return 'Ethiopian';
        if (verse.includes('TJos')) return 'Ethiopian';
        if (verse.includes('TNaph')) return 'Ethiopian';
        if (verse.includes('TJob')) return 'Ethiopian';
        if (verse.includes('TAsh')) return 'Ethiopian';
        if (verse.includes('TSim')) return 'Ethiopian';
        if (verse.includes('TAbr')) return 'Ethiopian';
        // Additional Pseudepigrapha
        if (verse.includes('TSol') || verse.includes('Testament of Solomon')) return 'Ethiopian';
        if (verse.includes('ApocAbr') || verse.includes('Apocalypse of Abraham')) return 'Ethiopian';
        if (verse.includes('LAE') || verse.includes('Life of Adam')) return 'Ethiopian';
        if (verse.includes('AscIs') || verse.includes('Ascension of Isaiah')) return 'Ethiopian';
        if (verse.includes('2En.') || verse.includes('2 Enoch') || verse.includes('Slavonic Enoch')) return 'Ethiopian';

        // Deuterocanonical
        if (verse.includes('Tob.') || verse.includes('Tobit')) return 'Deuterocanonical';
        if (verse.includes('Jdt.') || verse.includes('Judith')) return 'Deuterocanonical';
        if (verse.includes('Wis.') || verse.includes('Wisdom')) return 'Deuterocanonical';
        if (verse.includes('Sir.') || verse.includes('Sirach')) return 'Deuterocanonical';
        if (verse.includes('Bar.') && !verse.includes('2Bar')) return 'Deuterocanonical';
        if (verse.includes('1Macc') || verse.includes('2Macc')) return 'Deuterocanonical';

        // Gnostic/Early Christian
        if (verse.includes('GThom') || verse.includes('Gospel of Thomas')) return 'Gnostic';
        if (verse.includes('GPhil') || verse.includes('Gospel of Philip')) return 'Gnostic';
        if (verse.includes('GMary') || verse.includes('Gospel of Mary')) return 'Gnostic';
        if (verse.includes('GJudas') || verse.includes('Gospel of Judas')) return 'Gnostic';
        if (verse.includes('Did.') || verse.includes('Didache')) return 'Gnostic';
        if (verse.includes('Barn.') || verse.includes('Barnabas')) return 'Gnostic';
        if (verse.includes('Herm') || verse.includes('Hermas')) return 'Gnostic';
        if (verse.includes('ApocPet')) return 'Gnostic';
        if (verse.includes('GTruth') || verse.includes('Gospel of Truth')) return 'Gnostic';
        if (verse.includes('PistSoph') || verse.includes('Pistis Sophia')) return 'Gnostic';

        return 'Canonical';
    }

    generateDescription(from, to, type) {
        if (type === 'Ethiopian') {
            return 'Parallel in Ethiopian/Pseudepigrapha text';
        }
        if (type === 'Deuterocanonical') {
            return 'Reference to Deuterocanonical book';
        }
        if (type === 'Gnostic') {
            return 'Parallel in Gnostic/Early Christian text';
        }
        if (type === 'Dead Sea Scrolls') {
            return 'Parallel in Dead Sea Scrolls';
        }
        if (type === 'Lost') {
            return 'Reference to lost/missing text';
        }
        return 'Cross-reference';
    }

    getStats() {
        const stats = {
            total: this.allReferences.length,
            ethiopian: this.allReferences.filter(r => r.type === 'Ethiopian').length,
            deuterocanonical: this.allReferences.filter(r => r.type === 'Deuterocanonical').length,
            gnostic: this.allReferences.filter(r => r.type === 'Gnostic').length,
            canonical: this.allReferences.filter(r => r.type === 'Canonical').length,
            highConfidence: this.allReferences.filter(r => r.votes >= 100).length
        };
        return stats;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossRefLoader;
}
