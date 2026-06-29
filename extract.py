import json

with open('/home/thinh/proj/Hust_quiz/public/quizzes/ktlt_on_tap_tong_hop.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data['quiz']['questions'][150:180]
with open('/home/thinh/proj/Hust_quiz/tmp_out.txt', 'w', encoding='utf-8') as fout:
    for i, q in enumerate(questions):
        fout.write(f"ID: {q.get('id')}\n")
        fout.write(f"Question: {q.get('question')}\n")
        fout.write("Choices:\n")
        for j, c in enumerate(q.get('choices', [])):
            fout.write(f"  {j}: {c}\n")
        fout.write(f"Answer: {q.get('answer')}\n")
        fout.write("-" * 40 + "\n")
