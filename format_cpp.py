import json
import re
import subprocess
import os

QUIZ_FILE = "public/quizzes/ktlt_on_tap_tong_hop.json"

def format_cpp_code(code_str):
    # Sometimes the code is squashed on one line with \t. 
    # Let's write it to a file and run clang-format
    # But wait, if it's squashed into one line, clang-format might not break lines perfectly.
    # Let's replace \t with \n before formatting.
    # Wait, sometimes \t is just indentation, but since it's squashed:
    # "int limit = 2;\t\tint sum = 0;" -> replacing \t with \n would help.
    code_str = code_str.replace('\t', '\n')
    # Also replace multiple spaces or semicolons maybe? clang-format can handle semicolons nicely.
    # clang-format automatically breaks lines after semicolons if we use a specific style.
    
    with open("temp.cpp", "w", encoding="utf-8") as f:
        f.write(code_str)
        
    try:
        # Use Google style, but force line breaks
        style = "{BasedOnStyle: Google, ColumnLimit: 80, BreakBeforeBraces: Attach, AllowShortFunctionsOnASingleLine: false, AllowShortBlocksOnASingleLine: false, AllowShortIfStatementsOnASingleLine: false, AllowShortLoopsOnASingleLine: false}"
        subprocess.run(["npx", "clang-format", "-i", f"--style={style}", "temp.cpp"], check=True, capture_output=True)
        
        with open("temp.cpp", "r", encoding="utf-8") as f:
            formatted = f.read()
            
        return formatted.strip()
    except Exception as e:
        print(f"Error formatting: {e}")
        return code_str.strip()

with open(QUIZ_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

pattern = re.compile(r'```cpp(.*?)```', re.DOTALL)

def process_text(text):
    if not text: return text
    def replacer(match):
        code = match.group(1)
        formatted = format_cpp_code(code)
        return f"```cpp\n{formatted}\n```"
    return pattern.sub(replacer, str(text))

count = 0
for q in data["quiz"]["questions"]:
    orig_text = q["question"].get("text", "")
    new_text = process_text(orig_text)
    if new_text != orig_text:
        q["question"]["text"] = new_text
        count += 1
        
    if "choices" in q:
        for c in q["choices"]:
            orig_c = c.get("text", "")
            new_c = process_text(orig_c)
            if new_c != orig_c:
                c["text"] = new_c
                count += 1

with open(QUIZ_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Formatted C++ code in {count} places.")
if os.path.exists("temp.cpp"):
    os.remove("temp.cpp")
