// Data Loader for Bible Visualizer
// Uses IndexedDB to cache the 14MB JSON for faster subsequent loads

class BibleDataLoader {
    constructor() {
        this.graphData = null;
        this.stats = null;
        this.isLoaded = false;
        this.isPreviewMode = false;
        this.loadingProgress = 0;
        this.progressCallbacks = [];
        this.dbName = 'BibleVisualizerCache';
        this.dbVersion = 1;
        this.cacheVersion = 'v1.0'; // Increment to invalidate cache
    }

    /**
     * Open IndexedDB connection
     */
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('graphData')) {
                    db.createObjectStore('graphData', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('stats')) {
                    db.createObjectStore('stats', { keyPath: 'id' });
                }
            };
        });
    }

    /**
     * Get cached data from IndexedDB
     */
    async getCached(storeName, key) {
        try {
            const db = await this.openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const request = store.get(key);

                request.onerror = () => resolve(null);
                request.onsuccess = () => {
                    const result = request.result;
                    // Check cache version
                    if (result && result.version === this.cacheVersion) {
                        resolve(result.data);
                    } else {
                        resolve(null);
                    }
                };
            });
        } catch (e) {
            console.warn('IndexedDB not available:', e);
            return null;
        }
    }

    /**
     * Store data in IndexedDB cache
     */
    async setCache(storeName, key, data) {
        try {
            const db = await this.openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                store.put({ id: key, data: data, version: this.cacheVersion, timestamp: Date.now() });

                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (e) {
            console.warn('Failed to cache data:', e);
            return false;
        }
    }

    /**
     * Register a callback for loading progress updates
     * @param {Function} callback - Called with (percentage, message)
     */
    onProgress(callback) {
        this.progressCallbacks.push(callback);
    }

    updateProgress(percentage, message) {
        this.loadingProgress = percentage;
        this.progressCallbacks.forEach(cb => cb(percentage, message));
    }

    /**
     * Load preview data instantly (97KB, top 200 connections)
     */
    loadPreview() {
        if (typeof PREVIEW_DATA === 'undefined') {
            console.warn('Preview data not available');
            return false;
        }

        console.log('⚡ Loading preview data instantly...');
        this.graphData = PREVIEW_DATA;
        this.isPreviewMode = true;
        this.isLoaded = true;
        this.updateProgress(100, 'Preview loaded');

        console.log('✓ Preview mode active:', {
            connections: PREVIEW_DATA.connections.length,
            chapters: PREVIEW_DATA.chapters.length,
            isPreview: PREVIEW_DATA.metadata.is_preview
        });

        return true;
    }

    async load() {
        if (this.isLoaded && !this.isPreviewMode) return;

        try {
            // Try to load from IndexedDB cache first
            this.updateProgress(5, 'Checking cache...');
            const cachedGraph = await this.getCached('graphData', 'graph_data_66books');
            const cachedStats = await this.getCached('stats', 'stats_66books');

            if (cachedGraph) {
                console.log('⚡ Loading from cache (instant!)');
                this.updateProgress(50, 'Loading from cache...');
                this.graphData = cachedGraph;
                this.stats = cachedStats;
                this.isLoaded = true;
                this.isPreviewMode = false;
                this.updateProgress(90, 'Adding additional books...');

                // Augment with additional books
                if (typeof dataAugmenter !== 'undefined') {
                    this.graphData = dataAugmenter.augment(this.graphData);
                }

                this.updateProgress(100, 'Loaded from cache!');
                console.log('✓ Data loaded from cache:', {
                    books: this.graphData.metadata?.total_books || this.graphData.books?.length,
                    chapters: this.graphData.metadata?.total_chapters || this.graphData.chapters?.length,
                    connections: this.graphData.metadata?.total_connections || this.graphData.connections?.length
                });

                return this.graphData;
            }

            // No cache - fetch from server
            const apiUrl = '../data/processed/graph_data_66books.json';

            console.log('📖 Loading 66-book Biblical data (first load, will cache)...');
            this.updateProgress(10, 'Downloading data (first load)...');

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Graph response received, parsing JSON...');
            this.updateProgress(60, 'Parsing JSON data...');
            this.graphData = await response.json();
            this.updateProgress(75, 'Caching for next time...');

            // Cache the raw data for next time
            await this.setCache('graphData', 'graph_data_66books', this.graphData);
            console.log('✓ Data cached in IndexedDB for instant future loads');

            // Load stats
            this.updateProgress(80, 'Loading stats...');
            const statsResponse = await fetch('../data/processed/stats_66books.json');
            if (statsResponse.ok) {
                this.stats = await statsResponse.json();
                await this.setCache('stats', 'stats_66books', this.stats);
            }

            this.isLoaded = true;
            this.isPreviewMode = false;
            this.updateProgress(90, 'Adding additional books...');

            // Augment: Add Deuterocanonical, Ethiopian, DSS, Gnostic, Lost books to the RIGHT
            // This preserves OT→NT order and appends extra books after
            if (typeof dataAugmenter !== 'undefined') {
                this.graphData = dataAugmenter.augment(this.graphData);
            }

            this.updateProgress(100, 'Dataset loaded!');

            console.log('✓ Data loaded successfully:', {
                books: this.graphData.metadata?.total_books || this.graphData.books?.length,
                chapters: this.graphData.metadata?.total_chapters || this.graphData.chapters?.length,
                connections: this.graphData.metadata?.total_connections || this.graphData.connections?.length
            });

            return this.graphData;
        } catch (error) {
            console.error('Error loading data:', error);

            if (error.name === 'AbortError') {
                throw new Error('Request timed out after 30 seconds. Please try again or check your internet connection.');
            }

            console.error('Full error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });

            throw error;
        }
    }

    getBooks() {
        return this.graphData ? this.graphData.books : [];
    }

    getChapters() {
        return this.graphData ? this.graphData.chapters : [];
    }

    getConnections() {
        return this.graphData ? this.graphData.connections : [];
    }

    getBookMatrix() {
        if (!this.graphData || !this.graphData.book_matrix) {
            return null;
        }

        // Return object with both books array and matrix
        return {
            books: this.graphData.books.map(book => book.name),
            matrix: this.graphData.book_matrix
        };
    }

    /**
     * Compute comprehensive statistics from the data
     */
    computeComprehensiveStats() {
        if (!this.graphData) return {};

        const chapters = this.graphData.chapters;
        const connections = this.graphData.connections;
        const books = this.graphData.books;
        const stats = this.stats || {};

        console.log('Computing comprehensive statistics...');

        // Helper: Get chapter by ID
        const getChapter = (id) => chapters[id];

        // ====================
        // CROSS-REFERENCE ANALYTICS
        // ====================

        // 1. Longest connection (most distant chapters)
        let longestConnection = { distance: 0, source: null, target: null };
        connections.forEach(conn => {
            if (conn.distance > longestConnection.distance) {
                longestConnection = {
                    distance: conn.distance,
                    source: getChapter(conn.source),
                    target: getChapter(conn.target),
                    weight: conn.weight
                };
            }
        });

        // 2. Shortest connection (minimum distance > 0)
        let shortestConnection = { distance: Infinity, source: null, target: null };
        connections.forEach(conn => {
            if (conn.distance > 0 && conn.distance < shortestConnection.distance) {
                shortestConnection = {
                    distance: conn.distance,
                    source: getChapter(conn.source),
                    target: getChapter(conn.target),
                    weight: conn.weight
                };
            }
        });

        // 3. Average connection distance
        const avgDistance = connections.reduce((sum, conn) => sum + conn.distance, 0) / connections.length;

        // 4. Strongest single connection (highest weight)
        let strongestConnection = { weight: 0, source: null, target: null };
        connections.forEach(conn => {
            if (conn.weight > strongestConnection.weight) {
                strongestConnection = {
                    weight: conn.weight,
                    source: getChapter(conn.source),
                    target: getChapter(conn.target),
                    distance: conn.distance
                };
            }
        });

        // 5. Most connected chapter (total degree centrality)
        const chapterDegree = {};
        connections.forEach(conn => {
            chapterDegree[conn.source] = (chapterDegree[conn.source] || 0) + 1;
            chapterDegree[conn.target] = (chapterDegree[conn.target] || 0) + 1;
        });
        let mostConnected = { id: null, degree: 0, chapter: null };
        Object.entries(chapterDegree).forEach(([id, degree]) => {
            if (degree > mostConnected.degree) {
                mostConnected = { id: parseInt(id), degree, chapter: getChapter(parseInt(id)) };
            }
        });

        // 6. Self-referencing books
        const bookSelfRefs = {};
        connections.forEach(conn => {
            const sourceCh = getChapter(conn.source);
            const targetCh = getChapter(conn.target);
            if (sourceCh && targetCh && sourceCh.book === targetCh.book) {
                bookSelfRefs[sourceCh.book] = (bookSelfRefs[sourceCh.book] || 0) + 1;
            }
        });
        const mostSelfReferencing = Object.entries(bookSelfRefs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // 7. Cross-testament bridge books
        const crossTestamentBooks = {};
        connections.forEach(conn => {
            const sourceCh = getChapter(conn.source);
            const targetCh = getChapter(conn.target);
            if (sourceCh && targetCh && sourceCh.testament !== targetCh.testament) {
                crossTestamentBooks[sourceCh.book] = (crossTestamentBooks[sourceCh.book] || 0) + 1;
                crossTestamentBooks[targetCh.book] = (crossTestamentBooks[targetCh.book] || 0) + 1;
            }
        });
        const topBridgeBooks = Object.entries(crossTestamentBooks)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // ====================
        // BOOK & CHAPTER STATS
        // ====================

        // Testament totals
        const otBooks = books.filter(b => b.testament === 'OT').length;
        const ntBooks = books.filter(b => b.testament === 'NT').length;
        const otChapters = books.filter(b => b.testament === 'OT').reduce((sum, b) => sum + b.chapters, 0);
        const ntChapters = books.filter(b => b.testament === 'NT').reduce((sum, b) => sum + b.chapters, 0);

        // Longest & shortest books by chapters
        const longestBook = books.reduce((max, b) => b.chapters > max.chapters ? b : max, books[0]);
        const shortestBook = books.reduce((min, b) => b.chapters < min.chapters ? b : min, books[0]);

        // Average connections per chapter
        const avgConnectionsPerChapter = connections.length / chapters.length;

        // Connection density by testament
        const otConnections = stats.testament_distribution?.OT_to_OT || 0;
        const ntConnections = stats.testament_distribution?.NT_to_NT || 0;
        const otDensity = otConnections / (otChapters * otChapters);
        const ntDensity = ntConnections / (ntChapters * ntChapters);

        // ====================
        // FUN/INTERESTING STATS
        // ====================

        // Bidirectional connections (reciprocity)
        const connectionPairs = new Set();
        let reciprocalCount = 0;
        connections.forEach(conn => {
            const pair1 = `${conn.source}-${conn.target}`;
            const pair2 = `${conn.target}-${conn.source}`;
            if (connectionPairs.has(pair2)) {
                reciprocalCount++;
            }
            connectionPairs.add(pair1);
        });
        const reciprocityRate = (reciprocalCount / connections.length) * 100;

        // Gospel similarities (Matthew, Mark, Luke, John)
        const gospels = ['Matthew', 'Mark', 'Luke', 'John'];
        const gospelConnections = {};
        connections.forEach(conn => {
            const sourceCh = getChapter(conn.source);
            const targetCh = getChapter(conn.target);
            if (sourceCh && targetCh && gospels.includes(sourceCh.book) && gospels.includes(targetCh.book)) {
                const key = [sourceCh.book, targetCh.book].sort().join('-');
                gospelConnections[key] = (gospelConnections[key] || 0) + 1;
            }
        });

        // Pauline epistles
        const paulineBooks = ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
                              'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
                              '1 Timothy', '2 Timothy', 'Titus', 'Philemon'];
        let paulineConnections = 0;
        connections.forEach(conn => {
            const sourceCh = getChapter(conn.source);
            const targetCh = getChapter(conn.target);
            if (sourceCh && targetCh && paulineBooks.includes(sourceCh.book) && paulineBooks.includes(targetCh.book)) {
                paulineConnections++;
            }
        });

        // Torah/Pentateuch (Genesis-Deuteronomy)
        const torahBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];
        let torahConnections = 0;
        connections.forEach(conn => {
            const sourceCh = getChapter(conn.source);
            const targetCh = getChapter(conn.target);
            if (sourceCh && targetCh && torahBooks.includes(sourceCh.book) && torahBooks.includes(targetCh.book)) {
                torahConnections++;
            }
        });

        console.log('✓ Comprehensive statistics computed');

        return {
            // Original stats
            ...stats,

            // Cross-Reference Analytics
            longestConnection,
            shortestConnection,
            avgDistance: avgDistance.toFixed(1),
            strongestConnection,
            mostConnectedChapter: mostConnected,
            mostSelfReferencingBooks: mostSelfReferencing,
            topBridgeBooks,

            // Book & Chapter Stats
            otBooks,
            ntBooks,
            otChapters,
            ntChapters,
            totalChapters: chapters.length,
            longestBook,
            shortestBook,
            avgConnectionsPerChapter: avgConnectionsPerChapter.toFixed(1),
            otDensity: (otDensity * 100).toFixed(4),
            ntDensity: (ntDensity * 100).toFixed(4),

            // Fun/Interesting
            reciprocalConnections: reciprocalCount,
            reciprocityRate: reciprocityRate.toFixed(2),
            gospelConnections,
            paulineConnections,
            torahConnections
        };
    }

    getStats() {
        return this.stats || {};
    }

    getComprehensiveStats() {
        return this.computeComprehensiveStats();
    }

    filterConnectionsByTestament(testament) {
        if (!this.graphData) return [];

        const connections = this.graphData.connections;
        const chapters = this.graphData.chapters;

        if (testament === 'all') {
            return connections;
        }

        return connections.filter(conn => {
            const sourceChapter = chapters[conn.source];
            const targetChapter = chapters[conn.target];

            if (testament === 'OT') {
                return sourceChapter.testament === 'OT' && targetChapter.testament === 'OT';
            } else if (testament === 'NT') {
                return sourceChapter.testament === 'NT' && targetChapter.testament === 'NT';
            } else if (testament === 'cross') {
                return sourceChapter.testament !== targetChapter.testament;
            }

            return true;
        });
    }

    filterConnectionsByBook(bookName) {
        if (!this.graphData || !bookName) return this.getConnections();

        const connections = this.graphData.connections;
        const chapters = this.graphData.chapters;

        return connections.filter(conn => {
            const sourceChapter = chapters[conn.source];
            const targetChapter = chapters[conn.target];

            return sourceChapter.book === bookName || targetChapter.book === bookName;
        });
    }

    filterConnectionsByWeight(minWeight) {
        if (!this.graphData) return [];

        return this.graphData.connections.filter(conn => conn.weight >= minWeight);
    }

    getConnectionType(sourceTestament, targetTestament) {
        if (sourceTestament === 'OT' && targetTestament === 'OT') return 'ot-ot';
        if (sourceTestament === 'NT' && targetTestament === 'NT') return 'nt-nt';
        return 'cross-testament';
    }
}

// Global data loader instance
const dataLoader = new BibleDataLoader();
