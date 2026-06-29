import json
with open('/home/thinh/proj/Hust_quiz/public/quizzes/tmp_120_149.json') as f:
    data = json.load(f)
for q in data[10:19]:
    print(f"ID: {q['id']}")
    print(f"Q: {q['question']['text'].strip()}")
    for c in q['choices']:
        print(f" - {c['id']}: {c['text'].strip()}")
    print(f"Ans: {q['answer']['correctChoiceIds'][0]}")
    print("-" * 40)
