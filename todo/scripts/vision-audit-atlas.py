import base64, json, os, requests
from pathlib import Path
img_path=Path('/home/ubuntu/fine-lanka-web/public/images/fine-lanka-route-atlas-portrait.png')
img64=base64.b64encode(img_path.read_bytes()).decode()
prompt='''You are auditing a fixed portrait Sri Lanka route-atlas image for an interactive overlay. Use computer vision on the image itself, not latitude/longitude projection. Return JSON only with two arrays: waypoints and routes. For each waypoint identify every visible red/orange circular endpoint marker and its nearby printed town or destination name. Include {uid, name, x, y, role} where x,y are exact pixel coordinates in the 1664x2080 image, uid is wp-<slug>, and role is primary-tourism or hub-subpoint. For each orange solid or orange dashed route line, identify its two endpoint waypoint names by following the line from circle to circle; include {uid, start, end, lineType, trace} where trace is an ordered list of pixel [x,y] points following the visible line exactly. Include all visible route lines, not just the selected example. Do not invent lines or points that are not visible. If a route line is interrupted by artwork, follow the visible orange corridor and return the best continuous trace.'''
url=os.environ['OPENAI_API_BASE'].rstrip('/')+'/chat/completions'
headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY'],'Content-Type':'application/json'}
payload={'model':'gpt-4.1-mini','temperature':0,'response_format':{'type':'json_object'},'messages':[{'role':'user','content':[{'type':'text','text':prompt},{'type':'image_url','image_url':{'url':'data:image/png;base64,'+img64}}]}]}
r=requests.post(url,headers=headers,json=payload,timeout=180)
r.raise_for_status(); content=r.json()['choices'][0]['message']['content']
Path('/home/ubuntu/fine-lanka-web/docs/atlas-cv/chatgpt-vision-atlas.json').write_text(content)
print(content)
