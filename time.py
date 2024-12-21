import json
from datetime import datetime, timedelta

target_date = datetime(2024, 12, 13)
today = datetime.now()
a = (today - target_date).days  # 计算今日距离2024年12月13日的天数

text1_content = f"距离你的生日已经过去了{a}天 :D"

with open('customize.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data['text1'] = text1_content

with open('customize.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
