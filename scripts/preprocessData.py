import pandas as pd

INPUT_CSV  = "Data/raw.csv"
OUTPUT_CSV = "trimmed.csv"
COLS       = ["Hebrew", "Niqqud", "Transliteration", "Translation"]
COLS.append("Niqqud_Length")         # add new column for Niqqud length

# Read only the original columns
df = pd.read_csv(INPUT_CSV, usecols=COLS[:-1], encoding='utf-8')

# Measure the character‐count of the Niqqud field
df["Niqqud_Length"] = df["Niqqud"].str.len()

# Write out including the new Niqqud_Length column
df.to_csv(OUTPUT_CSV, index=False, columns=COLS, encoding='utf-8')
