import os
import json
import uuid

QUIZZES_DIR = "/home/thinh/proj/Hust_quiz/public/quizzes"

def fix_json(data):
    # Ensure explanation text is not empty
    for q in data["quiz"]["questions"]:
        if "text" not in q["question"] or not str(q["question"]["text"]).strip():
            q["question"]["text"] = "Nội dung câu hỏi bị trống do lỗi trích xuất."
            
        if "explanation" not in q or "text" not in q["explanation"] or not str(q["explanation"]["text"]).strip():
            q["explanation"] = {"text": "Chưa có giải thích.", "images": []}
            
        # Ensure unique question IDs
        q_ids = set()
        for qq in data["quiz"]["questions"]:
            if qq["id"] in q_ids:
                qq["id"] = qq["id"] + "_" + uuid.uuid4().hex[:4]
            q_ids.add(qq["id"])
            
        if q["type"] in ["single_choice", "multiple_choice"]:
            # Ensure at least 2 choices
            if "choices" not in q or not isinstance(q["choices"], list):
                q["choices"] = []
                
            while len(q["choices"]) < 2:
                q["choices"].append({"id": uuid.uuid4().hex[:4].upper(), "text": "Lựa chọn ảo"})
                
            choice_ids = set()
            new_choices = []
            for c in q["choices"]:
                if not str(c.get("text", "")).strip():
                    c["text"] = "Lựa chọn trống"
                    
                # Fix duplicate choice IDs
                original_id = c["id"]
                c_id = original_id
                count = 1
                while c_id in choice_ids:
                    c_id = f"{original_id}{count}"
                    count += 1
                c["id"] = c_id
                choice_ids.add(c_id)
                new_choices.append(c)
                
            q["choices"] = new_choices
            
            # Ensure correctChoiceIds are valid
            valid_ids = [c["id"] for c in q["choices"]]
            
            if "answer" not in q or "correctChoiceIds" not in q["answer"]:
                q["answer"] = {"correctChoiceIds": [valid_ids[0]]}
                
            if not isinstance(q["answer"]["correctChoiceIds"], list):
                q["answer"]["correctChoiceIds"] = [valid_ids[0]]
                
            if len(q["answer"]["correctChoiceIds"]) == 0:
                q["answer"]["correctChoiceIds"] = [valid_ids[0]]
                
            new_correct_ids = []
            for ans_id in q["answer"]["correctChoiceIds"]:
                if ans_id not in valid_ids:
                    # Invalid reference, fallback to first choice
                    new_correct_ids.append(valid_ids[0])
                else:
                    new_correct_ids.append(ans_id)
            
            if q["type"] == "single_choice":
                q["answer"]["correctChoiceIds"] = [new_correct_ids[0]] # exactly 1
            else:
                q["answer"]["correctChoiceIds"] = list(set(new_correct_ids)) # min 1, unique

fixed_count = 0
for filename in os.listdir(QUIZZES_DIR):
    if filename.endswith(".json") and filename != "index.json":
        filepath = os.path.join(QUIZZES_DIR, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            fix_json(data)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            fixed_count += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"Fixed {fixed_count} quiz JSONs.")
