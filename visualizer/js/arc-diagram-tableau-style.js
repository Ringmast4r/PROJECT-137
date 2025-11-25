// Arc Diagram - True Circular Arcs
// Bible Cross-Reference Visualization
// Created by Ringmast4r

class ArcDiagramTableauStyle {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.svg = null;
        this.tooltip = null;
        this.width = 0;
        this.height = 1300;
        this.margin = { top: 60, right: 50, bottom: 200, left: 50 };
        this.densificationPoints = 50; // Points per arc for smooth curves

        // Color scheme for all 159 book categories
        this.canonColors = {
            'Protestant': { OT: '#2ecc71', NT: '#00CED1' },  // Green for OT, Cyan for NT
            'Deuterocanonical': '#FF0000',  // RED (matches arc color)
            'Ethiopian': '#ff6b9d',  // PINK (matches arc color)
            'Dead Sea Scrolls': '#FF8C00',  // Orange
            'Gnostic': '#000000',  // BLACK (matches arc color)
            'Lost': '#FFD700'  // GOLD (matches arc color)
        };

        // Store for non-canonical cross-references from CrossRefLoader
        this.nonCanonicalRefs = [];
    }

    /**
     * Set non-canonical cross-references to be rendered as red arcs
     * @param {Array} refs - Array from CrossRefLoader (filtered to non-canonical)
     */
    setNonCanonicalRefs(refs) {
        this.nonCanonicalRefs = refs || [];
        console.log(`Arc diagram received ${this.nonCanonicalRefs.length} non-canonical cross-refs`);
    }

    /**
     * Convert cross-ref verse reference (e.g., "Gen.1.1") to chapter ID (e.g., "Gen.1")
     */
    verseToChapterId(verseRef) {
        if (!verseRef) return null;
        // Format: "Book.Chapter.Verse" or "Book.Chapter.Verse-Verse"
        const parts = verseRef.split('.');
        if (parts.length >= 2) {
            return `${parts[0]}.${parts[1]}`;
        }
        return null;
    }

    /**
     * Book abbreviation to full name mapping (matches exact names in graph_data_88books.json)
     */
    getBookAbbrevMap() {
        return {
            // Protestant OT (39 books)
            'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
            'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
            '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
            'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms',
            'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
            'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
            'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah',
            'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
            'Zech': 'Zechariah', 'Mal': 'Malachi',
            // Protestant NT (27 books)
            'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts',
            'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', 'Gal': 'Galatians',
            'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians', '1Thess': '1 Thessalonians',
            '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy', 'Titus': 'Titus',
            'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
            '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude', 'Rev': 'Revelation',
            // Deuterocanonical (7 books) - EXACT names from graph_data_88books.json
            'Tob': 'Tobit', 'Jdt': 'Judith', 'Wis': 'Wisdom', 'Sir': 'Sirach',
            'Bar': 'Baruch', '1Macc': '1 Maccabees', '2Macc': '2 Maccabees',
            // Ethiopian/Pseudepigrapha (12 books) - EXACT names from graph_data_88books.json
            '1En': '1 Enoch', 'Jub': 'Jubilees',
            '1Meq': '1 Meqabyan', '2Meq': '2 Meqabyan', '3Meq': '3 Meqabyan',
            '3Macc': '3 Maccabees', '4Macc': '4 Maccabees',
            'PsSol': 'Psalms of Solomon', '4Ezra': '4 Ezra', '4Bar': '4 Baruch',
            'PrMan': 'Prayer of Manasseh', 'Ps151': 'Psalm 151',
            // Additional Ethiopian
            '2Bar': '2 Baruch', '3Bar': '3 Baruch', '2En': '2 Enoch', '3En': '3 Enoch',
            'T12Pat': 'Testaments of the Twelve Patriarchs',
            'Odes': 'Odes of Solomon',
            // Gnostic/Early Christian
            'GJud': 'Gospel of Judas', 'GThom': 'Gospel of Thomas', 'GMary': 'Gospel of Mary',
            'GPet': 'Gospel of Peter', 'GPhil': 'Gospel of Philip', 'GTruth': 'Gospel of Truth',
            'GNic': 'Gospel of Nicodemus', 'GHeb': 'Gospel of the Hebrews', 'GEgy': 'Gospel of the Egyptians',
            'InfThom': 'Infancy Gospel of Thomas', 'ProtJas': 'Protoevangelium of James',
            'SecMark': 'Secret Gospel of Mark', 'ApocJohn': 'Apocryphon of John',
            'SophJC': 'Sophia of Jesus Christ', 'PistSoph': 'Pistis Sophia',
            'DialSav': 'Dialogue of the Savior', 'BkThom': 'Book of Thomas the Contender',
            'Did': 'Didache', 'Barn': 'Epistle of Barnabas', 'Hermas': 'Shepherd of Hermas',
            'ActsPT': 'Acts of Paul and Thecla', 'ApocPet': 'Apocalypse of Peter',
            // Lost Books (names must match data-augmenter-147.js exactly)
            'JasherL': 'Book of Jasher (Lost)', 'WarsLord': 'Book of the Wars of the Lord',
            'AnnSol': 'Annals of Solomon', 'AnnIsr': 'Annals of Kings of Israel',
            'AnnJud': 'Annals of Kings of Judah', 'SamSeer': 'Book of Samuel the Seer',
            'Nathan': 'Book of Nathan the Prophet', 'GadSeer': 'Book of Gad the Seer',
            'Ahijah': 'Prophecy of Ahijah', 'Iddo': 'Visions of Iddo the Seer',
            'Shemaiah': 'Book of Shemaiah', 'Jehu': 'Book of Jehu',
            'SaySeers': 'Sayings of the Seers', 'EpLaod': 'Epistle to Laodiceans',
            'EarlierCor': 'Earlier Epistle to Corinthians',
            'SevereCor': 'Severe Letter to Corinthians', 'AnnDavid': 'Annals of King David',
            'MannerKing': 'Manner of the Kingdom', 'ActsUzziah': 'Acts of Uzziah by Isaiah',
            'LamentsJos': 'Laments for Josiah', 'StoryIddo': 'Story of Prophet Iddo',
            'BkKingsIJ': 'Book of Kings of Israel & Judah', 'CommKings': 'Commentary on Book of Kings',
            'AssumpMos': 'Assumption of Moses', 'PrayerMan': 'Prayer of Manasseh (source)',
            'VisIddo': 'Visions of Iddo (Jeroboam)'
        };
    }

    /**
     * Get short abbreviation for a book name (for compact labels)
     */
    getBookAbbrev(bookName) {
        const abbrevMap = this.getBookAbbrevMap();
        // Reverse lookup: find abbreviation for full name
        for (const [abbrev, name] of Object.entries(abbrevMap)) {
            if (name === bookName) return abbrev;
        }
        // Fallback: truncate long names
        if (bookName.length > 6) {
            return bookName.substring(0, 5) + '.';
        }
        return bookName;
    }

    /**
     * Convert non-canonical refs from CrossRefLoader to connection format for arc diagram
     * Draws arcs from canonical source to non-canonical target (both must exist in chapters)
     */
    convertNonCanonRefsToConnections(chapters, chapterIndexMap) {
        if (!this.nonCanonicalRefs || this.nonCanonicalRefs.length === 0) {
            return [];
        }

        // Build lookup from "BookName:Chapter" to chapter index
        const bookChapterMap = new Map();
        chapters.forEach((ch, idx) => {
            const key = `${ch.book}:${ch.chapter}`;
            bookChapterMap.set(key, idx);
        });

        const abbrevMap = this.getBookAbbrevMap();
        const connections = [];
        const seen = new Set();
        let skippedNoSource = 0;
        let skippedNoTarget = 0;
        const unmappedSourceAbbrevs = new Set();
        const unmappedTargetAbbrevs = new Set();
        const unmappedSourceChapters = new Set();
        const unmappedTargetChapters = new Set();

        this.nonCanonicalRefs.forEach(ref => {
            // Parse source "Gen.1.1" format
            const sourceParts = ref.nt.split('.');
            if (sourceParts.length < 2) return;
            const sourceAbbrev = sourceParts[0];
            const sourceChapterNum = parseInt(sourceParts[1]);
            if (isNaN(sourceChapterNum)) return;

            // Parse target "Tob.1.1" format
            const targetParts = ref.target.split('.');
            if (targetParts.length < 2) return;
            const targetAbbrev = targetParts[0];
            const targetChapterNum = parseInt(targetParts[1]);
            if (isNaN(targetChapterNum)) return;

            // Convert abbreviations to full book names
            const sourceBookName = abbrevMap[sourceAbbrev];
            const targetBookName = abbrevMap[targetAbbrev];

            if (!sourceBookName) {
                skippedNoSource++;
                unmappedSourceAbbrevs.add(sourceAbbrev);
                return;
            }
            if (!targetBookName) {
                skippedNoTarget++;
                unmappedTargetAbbrevs.add(targetAbbrev);
                return;
            }

            // Look up chapter indices
            const sourceKey = `${sourceBookName}:${sourceChapterNum}`;
            const targetKey = `${targetBookName}:${targetChapterNum}`;

            const sourceIdx = bookChapterMap.get(sourceKey);
            const targetIdx = bookChapterMap.get(targetKey);

            if (sourceIdx === undefined) {
                skippedNoSource++;
                unmappedSourceChapters.add(sourceKey);
                return;
            }
            if (targetIdx === undefined) {
                skippedNoTarget++;
                unmappedTargetChapters.add(targetKey);
                return;
            }

            // Dedupe by source+target pair
            const dedupeKey = `${sourceIdx}->${targetIdx}`;
            if (seen.has(dedupeKey)) return;
            seen.add(dedupeKey);

            connections.push({
                sourceIdx: sourceIdx,
                targetIdx: targetIdx,
                sourceBook: sourceBookName,
                sourceChapter: sourceChapterNum,
                targetBook: targetBookName,
                targetChapter: targetChapterNum,
                targetType: ref.type,
                weight: ref.votes || 1,
                nonCanonical: true,
                originalRef: ref
            });
        });

        console.log(`Converted ${connections.length} non-canonical refs for red arcs`);
        console.log(`  Skipped: ${skippedNoSource} (no source), ${skippedNoTarget} (no target mapping)`);
        if (unmappedSourceAbbrevs.size > 0) {
            console.log(`  Unmapped source abbreviations:`, [...unmappedSourceAbbrevs]);
        }
        if (unmappedTargetAbbrevs.size > 0) {
            console.log(`  Unmapped target abbreviations:`, [...unmappedTargetAbbrevs]);
        }
        if (unmappedSourceChapters.size > 0) {
            console.log(`  Unmapped source chapters (first 10):`, [...unmappedSourceChapters].slice(0,10));
        }
        if (unmappedTargetChapters.size > 0) {
            console.log(`  Unmapped target chapters (first 10):`, [...unmappedTargetChapters].slice(0,10));
        }
        return connections;
    }

    /**
     * Draw non-canonical arcs connecting canonical sources to actual non-canonical book positions
     */
    drawNonCanonicalArcs(g, chapters, xScale, innerHeight, chapterIndexMap) {
        const nonCanonConnections = this.convertNonCanonRefsToConnections(chapters, chapterIndexMap);

        if (nonCanonConnections.length === 0) {
            console.log('No non-canonical connections to draw');
            return;
        }

        // Generate arc paths for non-canonical connections using ACTUAL chapter positions
        const arcPaths = [];

        // Max arc height for non-canonical arcs (above rainbow but not excessive)
        const maxArcHeight = 550;

        nonCanonConnections.forEach(conn => {
            // Use actual source and target indices (both exist in chapters array)
            const sourceIdx = conn.sourceIdx;
            const targetIdx = conn.targetIdx;

            const start = Math.min(sourceIdx, targetIdx);
            const end = Math.max(sourceIdx, targetIdx);
            const distance = Math.abs(targetIdx - sourceIdx);

            if (distance === 0) return;

            // Get x positions
            const x1 = xScale(start);
            const x2 = xScale(end);
            const spanWidth = Math.abs(x2 - x1);

            // Calculate arc height - cap it but scale properly
            const naturalHeight = distance / 2;
            const arcHeight = Math.min(naturalHeight, maxArcHeight);

            // For SVG arc: rx, ry are radii. Use spanWidth/2 for rx, arcHeight for ry
            const rx = spanWidth / 2;
            const ry = arcHeight;

            arcPaths.push({
                x1: x1,
                x2: x2,
                rx: rx,
                ry: ry,
                arcHeight: arcHeight,
                distance: distance,
                sourceIdx: sourceIdx,
                targetIdx: targetIdx,
                sourceBook: conn.sourceBook,
                sourceChapter: conn.sourceChapter,
                targetBook: conn.targetBook,
                targetChapter: conn.targetChapter,
                targetType: conn.targetType,
                weight: conn.weight,
                originalRef: conn.originalRef
            });
        });

        // Sort non-canonical arcs: by type first (Red/Deuterocanonical last = on top), then by distance
        const typeOrder = { 'Ethiopian': 0, 'Lost': 1, 'Gnostic': 2, 'Deuterocanonical': 3 };
        arcPaths.sort((a, b) => {
            // First by type (lower order draws first/behind, higher draws on top)
            const typeA = typeOrder[a.targetType] || 0;
            const typeB = typeOrder[b.targetType] || 0;
            if (typeA !== typeB) return typeA - typeB;
            // Then by distance within same type (longest first)
            return b.distance - a.distance;
        });

        console.log(`Drawing ${arcPaths.length} non-canonical arcs (color-coded by type)`);

        // Color scheme for different non-canonical types
        const typeColors = {
            'Deuterocanonical': { stroke: '#FF0000', glow: '#FF0000', label: 'RED' },
            'Ethiopian': { stroke: '#ff6b9d', glow: '#ff6b9d', label: 'PINK' },
            'Dead Sea Scrolls': { stroke: '#FF8C00', glow: '#FF8C00', label: 'ORANGE' },
            'Gnostic': { stroke: '#000000', glow: '#333333', label: 'BLACK' },
            'Lost': { stroke: '#FFD700', glow: '#FFD700', label: 'GOLD' }
        };

        // Count by type
        const typeCounts = {};
        arcPaths.forEach(d => {
            typeCounts[d.targetType] = (typeCounts[d.targetType] || 0) + 1;
        });
        console.log('  Arc counts by type:', typeCounts);

        // Filter out invalid arcs (very small or zero dimensions)
        const validArcPaths = arcPaths.filter(d => d.rx > 5 && d.ry > 5 && d.x1 !== d.x2);

        // Draw the arcs with type-based colors using SVG arc commands
        const nonCanonArcs = g.append('g')
            .attr('class', 'non-canonical-arcs')
            .selectAll('path')
            .data(validArcPaths)
            .enter()
            .append('path')
            .attr('d', d => {
                // SVG arc: M x1,y1 A rx,ry rotation large-arc-flag sweep-flag x2,y2
                // Ensure x1 < x2 for consistent arc direction (upward)
                const y = innerHeight;
                const startX = Math.min(d.x1, d.x2);
                const endX = Math.max(d.x1, d.x2);
                return `M ${startX},${y} A ${d.rx},${d.ry} 0 0 1 ${endX},${y}`;
            })
            .attr('fill', 'none')
            .attr('stroke', d => {
                const colors = typeColors[d.targetType] || typeColors['Deuterocanonical'];
                return colors.stroke;
            })
            .attr('stroke-width', d => d.targetType === 'Lost' ? 2.5 : 2)
            .attr('opacity', d => d.targetType === 'Gnostic' ? 0.7 : 0.85)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                const colors = typeColors[d.targetType] || typeColors['Deuterocanonical'];

                // Bring to front and highlight
                d3.select(event.target).raise()
                    .attr('stroke-width', 6)
                    .attr('opacity', 1)
                    .style('filter', `drop-shadow(0 0 12px ${colors.glow})`);

                // Get verse text if available
                const ref = d.originalRef || {};
                const ntText = ref.ntText ? `<div style="color: #aaa; font-style: italic; font-size: 0.85em; margin: 4px 0; max-width: 300px;">"${ref.ntText}"</div>` : '';
                const targetText = ref.targetText ? `<div style="color: #aaa; font-style: italic; font-size: 0.85em; margin: 4px 0; max-width: 300px;">"${ref.targetText}"</div>` : '';

                // Get emoji and label based on type
                const typeEmoji = d.targetType === 'Gnostic' ? '⚫' : d.targetType === 'Lost' ? '🟡' : '🔴';
                const typeLabel = d.targetType === 'Gnostic' ? 'GNOSTIC' : d.targetType === 'Lost' ? 'LOST TEXT' : 'NON-CANONICAL';
                const borderColor = colors.stroke === '#000000' ? '#444' : colors.stroke;
                const textColor = colors.stroke === '#000000' ? '#888' : colors.stroke;

                this.tooltip
                    .style('display', 'block')
                    .style('opacity', 1)
                    .html(`
                        <div style="border-bottom: 2px solid ${borderColor}; padding-bottom: 8px; margin-bottom: 8px;">
                            <strong style="color: ${textColor}; font-size: 1.1em;">${typeEmoji} ${typeLabel} Cross-Reference</strong>
                        </div>
                        <div style="margin-bottom: 6px;">
                            <strong style="color: #00CED1;">From:</strong> ${d.sourceBook} ${d.sourceChapter}
                            ${ntText}
                        </div>
                        <div style="margin-bottom: 6px;">
                            <strong style="color: ${textColor};">To:</strong> ${d.targetBook} ${d.targetChapter}
                            ${targetText}
                        </div>
                        <div style="display: flex; gap: 15px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                            <span><strong>Type:</strong> <span style="color: ${textColor};">${d.targetType}</span></span>
                            <span><strong>Votes:</strong> <span style="color: #FFD700;">${d.weight}</span></span>
                            <span><strong>Distance:</strong> ${d.distance} chapters</span>
                        </div>
                    `)
                    .style('left', (event.clientX + 15) + 'px')
                    .style('top', (event.clientY - 15) + 'px');
            })
            .on('mouseout', (event, d) => {
                const colors = typeColors[d.targetType] || typeColors['Deuterocanonical'];

                d3.select(event.target)
                    .attr('stroke-width', d.targetType === 'Lost' ? 2.5 : 2)
                    .attr('opacity', d.targetType === 'Gnostic' ? 0.7 : 0.85)
                    .style('filter', 'none');
                this.tooltip.style('display', 'none');
            });

        return arcPaths.length;
    }

    /**
     * Get color for a chapter based on its canon and testament
     */
    getChapterColor(chapter) {
        const canon = chapter.canon || 'Protestant';
        const testament = chapter.testament;

        if (canon === 'Protestant') {
            return testament === 'OT' ? this.canonColors.Protestant.OT : this.canonColors.Protestant.NT;
        }
        return this.canonColors[canon] || '#888888';
    }

    render(filters = {}) {
        const container = document.getElementById(this.svgId);
        if (!container) {
            console.error(`SVG container not found: #${this.svgId}`);
            return;
        }
        container.innerHTML = '';

        if (!dataLoader || !dataLoader.isLoaded) {
            console.log('Data not loaded yet');
            return;
        }

        this.width = container.clientWidth;

        this.svg = d3.select(`#${this.svgId}`)
            .attr('width', this.width)
            .attr('height', this.height);

        this.tooltip = d3.select(`#${this.tooltipId}`);

        const chapters = dataLoader.getChapters();
        let connections = dataLoader.getConnections();

        // Apply filters
        if (filters.testament && filters.testament !== 'all') {
            connections = dataLoader.filterConnectionsByTestament(filters.testament);
        }
        if (filters.book) {
            connections = dataLoader.filterConnectionsByBook(filters.book);
        }
        if (filters.minConnections > 1) {
            connections = connections.filter(c => c.weight >= filters.minConnections);
        }

        // Limit connections for performance (optional)
        const maxConnections = 50000;
        if (connections.length > maxConnections) {
            console.log(`Limiting to ${maxConnections} connections for performance`);
            connections = connections.slice(0, maxConnections);
        }

        this.drawTableauStyleArcs(chapters, connections);
    }

    drawTableauStyleArcs(chapters, connections) {
        const innerWidth = this.width - this.margin.left - this.margin.right;
        const innerHeight = this.height - this.margin.top - this.margin.bottom;

        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Create chapter index map
        const chapterIndexMap = new Map();
        chapters.forEach((ch, idx) => {
            chapterIndexMap.set(ch.id, idx);
        });

        // X scale: chapter position with edge padding
        // Protestant, Deuterocanonical, Ethiopian = linear chapter spacing
        // DSS, Gnostic, Lost = BOOK-based spacing (each book gets equal width)
        const edgePadding = 50;

        // Build book lists for EACH canon type
        const canonBookLists = {
            'Protestant': [],
            'Deuterocanonical': [],
            'Ethiopian': [],
            'Dead Sea Scrolls': [],
            'Gnostic': [],
            'Lost': []
        };

        // Count chapters per section
        const chapterCounts = { 'Protestant': 0, 'Deuterocanonical': 0, 'Ethiopian': 0, 'Dead Sea Scrolls': 0, 'Gnostic': 0, 'Lost': 0 };
        const sectionStartIdx = { 'Protestant': 0 };

        let currentBook = null;
        chapters.forEach((ch, idx) => {
            const canon = ch.canon || 'Protestant';
            if (chapterCounts[canon] !== undefined) {
                if (chapterCounts[canon] === 0 && canon !== 'Protestant') {
                    sectionStartIdx[canon] = idx;
                }
                chapterCounts[canon]++;
            }

            if (ch.book !== currentBook) {
                currentBook = ch.book;
                if (canonBookLists[canon]) {
                    canonBookLists[canon].push({ name: ch.book, startIdx: idx });
                }
            }
        });

        // Build chapter-to-book-position map for BOOK-SPACED sections only (DSS, Gnostic, Lost)
        const chapterToBookPos = new Map();

        ['Dead Sea Scrolls', 'Gnostic', 'Lost'].forEach(canon => {
            canonBookLists[canon].forEach((book, bookIdx) => {
                chapters.forEach((ch, chIdx) => {
                    if (ch.book === book.name) {
                        chapterToBookPos.set(chIdx, {
                            section: canon,
                            bookIdx,
                            totalBooks: canonBookLists[canon].length
                        });
                    }
                });
            });
        });

        // Count books in each section
        const bookCounts = {};
        Object.keys(canonBookLists).forEach(canon => {
            bookCounts[canon] = canonBookLists[canon].length;
        });
        console.log('Book counts by canon:', bookCounts);
        console.log('Chapter counts by canon:', chapterCounts);

        // Width allocation - give more space to Deuterocanonical and Ethiopian
        // Protestant: 35%, Deuterocanonical: 12%, Ethiopian: 18%, DSS+Gnostic+Lost: 35% (by book count)
        const bookSpacedBooks = bookCounts['Dead Sea Scrolls'] + bookCounts['Gnostic'] + bookCounts['Lost'];

        const widthPct = {
            'Protestant': 0.35,
            'Deuterocanonical': 0.12,
            'Ethiopian': 0.18,
            'Dead Sea Scrolls': 0.35 * (bookCounts['Dead Sea Scrolls'] / bookSpacedBooks),
            'Gnostic': 0.35 * (bookCounts['Gnostic'] / bookSpacedBooks),
            'Lost': 0.35 * (bookCounts['Lost'] / bookSpacedBooks)
        };

        // Calculate starting X positions for each section
        const sectionOrder = ['Protestant', 'Deuterocanonical', 'Ethiopian', 'Dead Sea Scrolls', 'Gnostic', 'Lost'];
        const sectionStartPct = {};
        let cumulativePct = 0;
        sectionOrder.forEach(canon => {
            sectionStartPct[canon] = cumulativePct;
            cumulativePct += widthPct[canon];
        });

        console.log('Width allocation:', Object.fromEntries(
            Object.entries(widthPct).map(([k, v]) => [k, (v * 100).toFixed(1) + '%'])
        ));

        // Create custom scale
        const xScale = (idx) => {
            const totalWidth = innerWidth - (2 * edgePadding);
            const bookPos = chapterToBookPos.get(idx);

            if (bookPos) {
                // Book-spaced sections: DSS, Gnostic, Lost
                const section = bookPos.section;
                const sectionWidth = totalWidth * widthPct[section];
                const sectionStartX = edgePadding + totalWidth * sectionStartPct[section];
                const bookWidth = sectionWidth / bookPos.totalBooks;
                return sectionStartX + (bookPos.bookIdx + 0.5) * bookWidth;
            }

            // Linear chapter-spaced sections: Protestant, Deuterocanonical, Ethiopian
            const ch = chapters[idx];
            const canon = ch?.canon || 'Protestant';

            if (canon === 'Deuterocanonical') {
                const sectionWidth = totalWidth * widthPct['Deuterocanonical'];
                const sectionStartX = edgePadding + totalWidth * sectionStartPct['Deuterocanonical'];
                const localIdx = idx - sectionStartIdx['Deuterocanonical'];
                return sectionStartX + (localIdx / chapterCounts['Deuterocanonical']) * sectionWidth;
            } else if (canon === 'Ethiopian') {
                const sectionWidth = totalWidth * widthPct['Ethiopian'];
                const sectionStartX = edgePadding + totalWidth * sectionStartPct['Ethiopian'];
                const localIdx = idx - sectionStartIdx['Ethiopian'];
                return sectionStartX + (localIdx / chapterCounts['Ethiopian']) * sectionWidth;
            } else {
                // Protestant
                const sectionWidth = totalWidth * widthPct['Protestant'];
                return edgePadding + (idx / chapterCounts['Protestant']) * sectionWidth;
            }
        };

        // Rainbow color scale based on OT↔NT distance (1189 canonical chapters)
        // Use fixed canonical distance so colors don't change when extra books are added
        const canonicalChapters = 1189; // 66-book Protestant canon
        const maxDistance = canonicalChapters - 1;
        const rainbowColorScale = d3.scaleSequential(d3.interpolateRainbow)
            .domain([0, maxDistance]);

        // Process connections and create arc paths
        console.log(`Drawing ${connections.length} connections with Tableau-style arcs...`);

        const arcPaths = [];

        connections.forEach(conn => {
            const sourceIdx = chapterIndexMap.get(conn.source);
            const targetIdx = chapterIndexMap.get(conn.target);

            if (sourceIdx === undefined || targetIdx === undefined) return;

            // Calculate arc parameters (original Tableau formulas)
            const start = Math.min(sourceIdx, targetIdx);
            const end = Math.max(sourceIdx, targetIdx);
            const distance = Math.abs(targetIdx - sourceIdx);
            const radius = distance / 2;

            // Skip if same chapter
            if (distance === 0) return;

            // Generate arc path using original point-by-point method
            const pathPoints = this.generateCircularArcPath(
                start, end, radius, xScale, innerHeight
            );

            arcPaths.push({
                points: pathPoints,
                distance: distance,
                source: conn.source,
                target: conn.target,
                sourceIdx: sourceIdx,
                targetIdx: targetIdx,
                weight: conn.weight,
                nonCanonical: conn.nonCanonical || false,
                type: conn.type || null
            });
        });

        console.log(`Generated ${arcPaths.length} arc paths`);

        // Sort arcs by distance (longest first) for proper layering
        // This creates the classic Chris Harrison look where shorter arcs appear on top
        arcPaths.sort((a, b) => b.distance - a.distance);

        // Only filter out arcs with no points
        const validRainbowArcs = arcPaths.filter(d => d.points && d.points.length > 0);

        console.log(`Drawing ${validRainbowArcs.length} rainbow arcs + non-canonical arcs...`);

        // Draw canonical arcs (rainbow colors) FIRST - in the back
        // Using original point-by-point path for smooth rendering
        const arcs = g.append('g')
            .attr('class', 'arcs')
            .selectAll('path')
            .data(validRainbowArcs)
            .enter()
            .append('path')
            .attr('d', d => this.createPathString(d.points))
            .attr('fill', 'none')
            .attr('stroke', d => rainbowColorScale(d.distance))
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.6)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                // Bring to front and highlight
                d3.select(this).raise()
                    .attr('stroke-width', 3)
                    .attr('opacity', 1);
                // Show tooltip
                const tooltip = d3.select('#arc-tooltip');
                const sourceChapter = chapters.find(ch => ch.id === d.source);
                const targetChapter = chapters.find(ch => ch.id === d.target);
                tooltip
                    .style('display', 'block')
                    .style('left', (event.clientX + 10) + 'px')
                    .style('top', (event.clientY - 10) + 'px')
                    .html(`
                        <strong>📖 Cross-Reference</strong><br/>
                        Source: ${sourceChapter ? sourceChapter.book + ' ' + sourceChapter.chapter : d.source}<br/>
                        Target: ${targetChapter ? targetChapter.book + ' ' + targetChapter.chapter : d.target}<br/>
                        Distance: ${d.distance} chapters
                    `);
            })
            .on('mouseout', function() {
                // Reset style
                d3.select(this)
                    .attr('stroke-width', 0.5)
                    .attr('opacity', 0.6);
                d3.select('#arc-tooltip').style('display', 'none');
            });

        // Draw NON-CANONICAL arcs SECOND - in the front (red/black/gold)
        const numNonCanonArcs = this.drawNonCanonicalArcs(g, chapters, xScale, innerHeight, chapterIndexMap);
        console.log(`Drew ${numNonCanonArcs || 0} non-canonical arcs (red/black/gold)`);

        // Draw chapter indicators at bottom with hover labels
        const chapterBars = g.append('g')
            .attr('class', 'chapter-bars')
            .attr('transform', `translate(0, ${innerHeight})`);

        // Create hover label for book names
        const hoverLabel = this.svg.append('text')
            .attr('class', 'hover-book-label')
            .attr('x', this.width / 2)
            .attr('y', innerHeight + this.margin.top + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .style('opacity', 0);

        // Color by canon type
        const self = this;
        chapterBars.selectAll('line')
            .data(chapters)
            .enter()
            .append('line')
            .attr('x1', (d, i) => xScale(i))
            .attr('x2', (d, i) => xScale(i))
            .attr('y1', 0)
            .attr('y2', 10)
            .attr('stroke', d => self.getChapterColor(d))
            .attr('stroke-width', 1)
            .attr('opacity', 0.5)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                // Highlight the chapter bar
                d3.select(event.target)
                    .attr('stroke-width', 3)
                    .attr('opacity', 1);

                // Show book name with canon-appropriate color
                const color = self.getChapterColor(d);
                hoverLabel
                    .text(`${d.book} ${d.chapter}`)
                    .attr('fill', color)
                    .style('opacity', 1);
            })
            .on('mouseout', (event) => {
                // Reset chapter bar
                d3.select(event.target)
                    .attr('stroke-width', 1)
                    .attr('opacity', 0.5);

                // Hide book name
                hoverLabel.style('opacity', 0);
            });

        // Add book labels and dividers
        this.drawBookLabels(g, chapters, xScale, innerHeight);

        // Add title
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .text('Bible Cross-References by Ringmast4r');

        // Add subtitle
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('fill', '#888')
            .attr('font-size', '14px')
            .text('Rainbow colors show distance between chapters');

        // Add legend
        this.drawRainbowLegend(g, innerWidth, innerHeight, rainbowColorScale, chapters);
    }

    /**
     * Generate circular arc path using Pythagorean theorem for perfect circles
     * Formula: y = sqrt(r² - x²) where r = radius, x = centerOffset
     * This creates true semicircular arcs (parts of perfect circles)
     * More stable than tan/acos approach which can hit infinity at 90°
     */
    generateCircularArcPath(start, end, radius, xScale, innerHeight) {
        const points = [];
        const numPoints = this.densificationPoints;

        for (let i = 0; i <= numPoints; i++) {
            // Index along the arc (0 to distance)
            const index = (i / numPoints) * (end - start);

            // X position
            const xPos = start + index;

            // Calculate Y using circular arc formula
            // This is the EXACT formula from Tableau workbook
            const centerOffset = xPos - start - radius;
            const normalizedX = centerOffset / radius;

            // Check bounds for acos (must be -1 to 1)
            if (normalizedX < -1 || normalizedX > 1) {
                // Outside arc bounds
                points.push({
                    x: xScale(xPos),
                    y: innerHeight
                });
            } else {
                // Inside arc bounds - calculate circular Y using Pythagorean theorem
                // For a circle: x² + y² = r², so y = sqrt(r² - x²)
                const radiusSquared = radius * radius;
                const offsetSquared = centerOffset * centerOffset;
                const yOffset = Math.sqrt(Math.abs(radiusSquared - offsetSquared));

                // Arc height (inverted, so it goes upward)
                const arcY = innerHeight - yOffset;

                points.push({
                    x: xScale(xPos),
                    y: arcY
                });
            }
        }

        return points;
    }

    /**
     * Create SVG path string from points
     */
    createPathString(points) {
        if (points.length === 0) return '';

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }

        return path;
    }

    /**
     * Draw book labels and dividers
     */
    drawBookLabels(g, chapters, xScale, innerHeight) {
        const self = this;

        // Group chapters by book
        const bookGroups = [];
        let currentBook = null;
        let startIndex = 0;

        chapters.forEach((ch, i) => {
            if (currentBook !== ch.book) {
                if (currentBook !== null) {
                    bookGroups.push({
                        book: currentBook,
                        start: startIndex,
                        end: i - 1,
                        testament: chapters[startIndex].testament,
                        canon: chapters[startIndex].canon || 'Protestant'
                    });
                }
                currentBook = ch.book;
                startIndex = i;
            }
        });

        // Add the last book
        if (currentBook !== null) {
            bookGroups.push({
                book: currentBook,
                start: startIndex,
                end: chapters.length - 1,
                testament: chapters[startIndex].testament,
                canon: chapters[startIndex].canon || 'Protestant'
            });
        }

        const bookLabelsGroup = g.append('g')
            .attr('class', 'book-labels')
            .attr('transform', `translate(0, ${innerHeight})`);

        // Draw thicker vertical markers on the bar between books
        bookGroups.forEach((bg, i) => {
            if (i > 0) {
                const x = xScale(bg.start);
                bookLabelsGroup.append('line')
                    .attr('x1', x)
                    .attr('x2', x)
                    .attr('y1', 0)
                    .attr('y2', 15)
                    .attr('stroke', '#FFD700')
                    .attr('stroke-width', 3)
                    .attr('opacity', 0.8);
            }
        });

        // Draw slanted book labels - use actual positions so arcs land on labels
        bookLabelsGroup.selectAll('.book-label')
            .data(bookGroups)
            .enter()
            .append('text')
            .attr('class', 'book-label')
            .attr('x', d => xScale(d.start))
            .attr('y', 55)
            .attr('text-anchor', 'start')
            .attr('fill', d => self.getChapterColor({ testament: d.testament, canon: d.canon }))
            .attr('font-size', '7px')
            .attr('font-weight', 'bold')
            .attr('transform', d => {
                const x = xScale(d.start);
                return `rotate(-60, ${x}, 55)`;
            })
            .text(d => d.book)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('font-size', '12px')
                    .attr('fill', '#FFD700');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('font-size', '7px')
                    .attr('fill', self.getChapterColor({ testament: d.testament, canon: d.canon }));
            });
    }

    /**
     * Draw rainbow gradient legend
     */
    drawRainbowLegend(g, innerWidth, innerHeight, colorScale, chapters) {
        const legendWidth = 300;
        const legendHeight = 20;
        const legendX = innerWidth - legendWidth - 20;
        const legendY = innerHeight + 100;

        // Create gradient
        const gradient = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'rainbow-gradient-legend')
            .attr('x1', '0%')
            .attr('x2', '100%');

        // Add color stops
        for (let i = 0; i <= 10; i++) {
            const offset = i * 10;
            const distance = (i / 10) * (chapters.length - 1);
            gradient.append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', colorScale(distance));
        }

        // Draw legend rectangle
        g.append('rect')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('fill', 'url(#rainbow-gradient-legend)')
            .attr('stroke', '#444')
            .attr('stroke-width', 1);

        // Add labels
        g.append('text')
            .attr('x', legendX)
            .attr('y', legendY - 5)
            .attr('fill', '#888')
            .attr('font-size', '12px')
            .text('Close');

        g.append('text')
            .attr('x', legendX + legendWidth)
            .attr('y', legendY - 5)
            .attr('text-anchor', 'end')
            .attr('fill', '#888')
            .attr('font-size', '12px')
            .text('Far Apart');

        g.append('text')
            .attr('x', legendX + legendWidth / 2)
            .attr('y', legendY + legendHeight + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#888')
            .attr('font-size', '11px')
            .text('Distance Between Chapters');

        // Draw canon color legend
        this.drawCanonLegend(g, 20, innerHeight + 100);
    }

    /**
     * Draw canon color legend showing all 159 book categories
     */
    drawCanonLegend(g, legendX, legendY) {
        const legendItems = [
            { label: 'OT Protestant (39)', color: this.canonColors.Protestant.OT },
            { label: 'NT Protestant (27)', color: this.canonColors.Protestant.NT },
            { label: 'Deuterocanonical (14)', color: this.canonColors.Deuterocanonical },
            { label: 'Ethiopian (21)', color: this.canonColors.Ethiopian },
            { label: 'Dead Sea Scrolls (10)', color: this.canonColors['Dead Sea Scrolls'] },
            { label: 'Gnostic (22)', color: this.canonColors.Gnostic },
            { label: 'Lost (26)', color: this.canonColors.Lost }
        ];

        const legendGroup = g.append('g')
            .attr('class', 'canon-legend')
            .attr('transform', `translate(${legendX}, ${legendY})`);

        legendGroup.append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('fill', '#FFD700')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text('159 Books by Canon:');

        legendItems.forEach((item, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const xOffset = col * 145;
            const yOffset = row * 20;

            // Color box
            legendGroup.append('rect')
                .attr('x', xOffset)
                .attr('y', yOffset + 5)
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', item.color)
                .attr('stroke', item.color === this.canonColors.Gnostic ? '#888' : '#444')
                .attr('stroke-width', item.color === this.canonColors.Gnostic ? 1.5 : 0.5);

            // Label
            legendGroup.append('text')
                .attr('x', xOffset + 18)
                .attr('y', yOffset + 15)
                .attr('fill', '#aaa')
                .attr('font-size', '10px')
                .text(item.label);
        });
    }

    /**
     * Show tooltip on hover
     */
    showTooltip(event, d, chapters) {
        const sourceChapter = chapters.find(ch => ch.id === d.source);
        const targetChapter = chapters.find(ch => ch.id === d.target);

        // Build tooltip content
        let tooltipContent = `<strong>${d.nonCanonical ? '🔴 NON-CANONICAL Connection' : 'Connection'}</strong><br/>`;
        tooltipContent += `Source: ${sourceChapter ? sourceChapter.book + ' ' + sourceChapter.chapter : d.source}<br/>`;
        tooltipContent += `Target: ${targetChapter ? targetChapter.book + ' ' + targetChapter.chapter : d.target}<br/>`;
        tooltipContent += `Distance: ${d.distance} chapters<br/>`;
        tooltipContent += `Weight: ${d.weight} ${d.nonCanonical ? 'votes' : 'references'}`;

        // Add type for non-canonical connections
        if (d.nonCanonical && d.type) {
            tooltipContent += `<br/><em style="color: #ff6b6b;">Type: ${d.type}</em>`;
        }

        // Show canon info if available
        if (sourceChapter && sourceChapter.canon) {
            tooltipContent += `<br/><small style="color: #888;">Source Canon: ${sourceChapter.canon}</small>`;
        }
        if (targetChapter && targetChapter.canon) {
            tooltipContent += `<br/><small style="color: #888;">Target Canon: ${targetChapter.canon}</small>`;
        }

        this.tooltip
            .style('display', 'block')
            .style('left', (event.clientX + 15) + 'px')
            .style('top', (event.clientY + 25) + 'px')
            .html(tooltipContent);
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.style('display', 'none');
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArcDiagramTableauStyle;
}
