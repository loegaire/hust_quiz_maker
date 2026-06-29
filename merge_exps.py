import json
import os
import glob

QUIZ_FILE = "public/quizzes/ktlt_on_tap_tong_hop.json"

with open(QUIZ_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# Load all explanation parts
explanations = {}
for i in range(15):
    filepath = f"public/quizzes/exps_{i}.json"
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                part = json.load(f)
                explanations.update(part)
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
    else:
        print(f"Missing {filepath}")

# Merge back into data
count = 0
for q in data["quiz"]["questions"]:
    qid = q["id"]
    if qid in explanations:
        q["explanation"]["text"] = explanations[qid]
        count += 1

with open(QUIZ_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully merged {count} explanations back into the main JSON.")

# Clean up
for i in range(15):
    filepath = f"public/quizzes/exps_{i}.json"
    if os.path.exists(filepath):
        os.remove(filepath)
