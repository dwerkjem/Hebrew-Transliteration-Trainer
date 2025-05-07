#!/usr/bin/env python3
import csv
import json

INPUT_CSV  = "Data/trimmed.csv"
OUTPUT_JSON = "public/words.json"

# Open the CSV and load rows
data = []
with open(INPUT_CSV, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Convert Niqqud_Length to integer
        row["Niqqud_Length"] = int(row["Niqqud_Length"])
        # Keep only the desired keys (and in order, if you iterate)
        entry = {
            "Hebrew":          row["Hebrew"],
            "Niqqud":          row["Niqqud"],
            "Transliteration": row["Transliteration"],
            "Translation":     row["Translation"],
            "Niqqud_Length":   row["Niqqud_Length"],
        }
        data.append(entry)

# Write out as pretty-printed JSON (preserving Hebrew)
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(data)} entries to {OUTPUT_JSON}")
