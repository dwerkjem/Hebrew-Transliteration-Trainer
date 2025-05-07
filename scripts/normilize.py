import json
import unicodedata
import sys

INPUT_JSON  = "public/words.json"
OUTPUT_JSON = "public/data_clean.json"

def normalize_translit(s: str) -> str:
    # 1) Compatibility decompose (turns ᵉ→e, ¹→1, etc.)
    nkfd = unicodedata.normalize('NFKD', s)
    # 2) Remove all combining marks (diacritics)
    stripped = ''.join(ch for ch in nkfd if not unicodedata.combining(ch))
    # 3) Normalize quotes to plain apostrophe
    cleaned = stripped.replace('’', "'").replace('‘', "'")
    return cleaned

def main():
    # Load your JSON
    with open(INPUT_JSON, encoding='utf-8') as f:
        data = json.load(f)

    # Process each entry
    for entry in data:
        orig = entry.get("Transliteration", "")
        entry["Transliteration"] = normalize_translit(orig)

    # Write cleaned JSON
    with open(OUTPUT_JSON, "w", encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Normalized {len(data)} entries ⇒ {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
