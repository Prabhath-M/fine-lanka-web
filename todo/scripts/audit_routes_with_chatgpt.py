import json
from pathlib import Path
from openai import OpenAI

root = Path('/home/ubuntu/fine-lanka-web')
payload = json.loads((root / 'docs/chatgpt-route-audit-payload.json').read_text())
client = OpenAI()
response = client.chat.completions.create(
    model='gpt-5',
    messages=[
        {'role': 'system', 'content': 'You are a careful Sri Lanka travel-route auditor. Be explicit about uncertainty. Review corridor-level road plausibility, not exact turn-by-turn navigation.'},
        {'role': 'user', 'content': json.dumps(payload, ensure_ascii=False)},
    ],
    max_completion_tokens=8000,
    extra_body={'reasoning': {'effort': 'high'}},
)
text = response.choices[0].message.content or ''
(root / 'docs/chatgpt-route-audit.md').write_text(text)
print(text)
print(f'usage={response.usage}')
