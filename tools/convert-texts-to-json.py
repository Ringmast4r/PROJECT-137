#!/usr/bin/env python3
"""Convert scrollmapper text files to JSON for the visualizer"""

import os
import json
import re

# Base path
BASE_PATH = r"C:\Users\Squir\Desktop\project 118\data\scrollmapper-deuterocanonical\txt"
OUTPUT_PATH = r"C:\Users\Squir\Desktop\project 118\visualizer\shared-data\deuterocanonical-texts.json"

# Book name mappings (folder name -> display name -> abbreviation)
BOOK_MAPPINGS = {
    'wisdom': ('Wisdom of Solomon', 'Wis'),
    'sirach': ('Sirach', 'Sir'),
    'tobit': ('Tobit', 'Tob'),
    'judith': ('Judith', 'Jdt'),
    '1-baruch': ('Baruch', 'Bar'),
    '1-mac': ('1 Maccabees', '1Macc'),
    '2-mac': ('2 Maccabees', '2Macc'),
    '1-enoch': ('1 Enoch', '1En'),
    '2-enoch': ('2 Enoch', '2En'),
    '3-enoch': ('3 Enoch', '3En'),
    'jubilees': ('Jubilees', 'Jub'),
    '1-esdras': ('1 Esdras', '1Esd'),
    '2-esdras': ('2 Esdras', '2Esd'),
    '2-baruch': ('2 Baruch', '2Bar'),
    '3-baruch': ('3 Baruch', '3Bar'),
    '4-baruch': ('4 Baruch', '4Bar'),
    'susanna': ('Susanna', 'Sus'),
    'bel': ('Bel and the Dragon', 'Bel'),
    'azar': ('Prayer of Azariah', 'PrAzar'),
    'man': ('Prayer of Manasseh', 'PrMan'),
    'gkesther': ('Greek Esther', 'GkEsth'),
    'jasher': ('Book of Jasher', 'Jasher'),
    'adam-and-eve': ('Life of Adam and Eve', 'LAE'),
    'ascension-of-isaiah': ('Ascension of Isaiah', 'AscIsa'),
    'apocalypse-of-peter': ('Apocalypse of Peter', 'ApocPet'),
    'testament-of-solomon': ('Testament of Solomon', 'TSol'),
    'the-testaments-of-the-twelve-patriarchs': ('Testaments of the Twelve Patriarchs', 'T12Pat'),
    'hermas': ('Shepherd of Hermas', 'Hermas'),
    'sedrach': ('Apocalypse of Sedrach', 'Sedrach'),
}

def parse_text_file(filepath):
    """Parse a text file and extract verses"""
    verses = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: [chapter:verse] text
    pattern = r'\[(\d+):(\d+)\]\s*(.+?)(?=\[\d+:\d+\]|$)'
    matches = re.findall(pattern, content, re.DOTALL)

    for chapter, verse, text in matches:
        ref = f"{chapter}:{verse}"
        verses[ref] = text.strip()

    return verses

def main():
    all_books = {}

    for folder_name, (display_name, abbrev) in BOOK_MAPPINGS.items():
        folder_path = os.path.join(BASE_PATH, folder_name)

        if not os.path.exists(folder_path):
            print(f"Skipping {folder_name} - folder not found")
            continue

        # Find the text file
        txt_files = [f for f in os.listdir(folder_path) if f.endswith('.txt')]

        if not txt_files:
            print(f"Skipping {folder_name} - no txt file found")
            continue

        txt_path = os.path.join(folder_path, txt_files[0])
        print(f"Processing {folder_name} -> {txt_path}")

        verses = parse_text_file(txt_path)

        if verses:
            all_books[abbrev] = {
                'name': display_name,
                'abbrev': abbrev,
                'verses': verses,
                'verse_count': len(verses)
            }
            print(f"  Found {len(verses)} verses")

    # Write output JSON
    output = {
        'generated': 'Project 118 Deuterocanonical Text Database',
        'book_count': len(all_books),
        'books': all_books
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nGenerated {OUTPUT_PATH}")
    print(f"Total books: {len(all_books)}")
    total_verses = sum(b['verse_count'] for b in all_books.values())
    print(f"Total verses: {total_verses}")

if __name__ == '__main__':
    main()
