const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/home/ubuntu/fine-lanka-web/docs/route-waypoints-validated.json', 'utf8'));
const corridor = new Set(['Kurunegala','Dambulla','Matale','Pinnawala','Yapahuwa','Mihintale','Aukana','Ritigala','Polonnaruwa','Ramboda','Hatton','Badulla','Mahiyanganaya','Dambana','Habarana','Puttalam','Vavuniya','Batticaloa','Pottuvil','Wellawaya','Avissawella','Ratnapura','Matara','Colombo','Gampola','Chilaw','Tissamaharama','Kataragama']);
const categories = {
  Airport:'arrival / departure', Negombo:'beach / lagoon', Kalpitiya:'kite surf / coast', Mannar:'heritage / wildlife', Jaffna:'heritage / culture',
  Anuradhapura:'ancient kingdom', Trincomalee:'beach / coral', Sigiriya:'heritage / rock', Kandy:'temple / culture',
  'Nuwara Eliya':'tea / mountains', Kitulgala:'rafting / rainforest', 'Nallathanni':'mountains / pilgrimage', "Adam's Peak":'mountains / pilgrimage',
  'Horton Plains':'wildlife / mountains', Haputale:'tea / mountains', "Lipton's Seat":'tea / viewpoint', Ella:'rail / mountains',
  Dunhinda:'waterfall', Diyaluma:'waterfall', Meemure:'village / mountains', Knuckles:'hiking / mountains',
  Galle:'heritage / fort', Unawatuna:'beach / coral', Bentota:'beach / river', Mirissa:'whales / coast',
  Udawalawe:'safari / wildlife', Yala:'safari / wildlife', Arugam:'surf / beach', 'Arugam Bay':'surf / beach',
  Pasikudah:'beach / coral', Tangalle:'beach / coast', Wellawaya:'wildlife / gateway', Tissamaharama:'safari / wildlife'
};
const names = new Set(); Object.values(data.tours).forEach(t => t.waypoints.forEach(n => { if (!corridor.has(n)) names.add(n); }));
const inventory = [...names].map(name => ({ name, category: categories[name] || 'culture / travel', lat: data.places[name]?.lat, lon: data.places[name]?.lon }));
fs.writeFileSync('/home/ubuntu/fine-lanka-web/docs/tourism-destination-inventory.json', JSON.stringify({count:inventory.length, categories:[...new Set(inventory.map(x=>x.category))], destinations:inventory}, null, 2));
console.log(JSON.stringify(inventory, null, 2));
