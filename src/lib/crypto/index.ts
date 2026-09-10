// Secure random generation using Web Crypto API exclusively

export function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  const binString = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binString);
}

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function bytesToAlphanumeric(bytes: Uint8Array): string {
  return Array.from(bytes, b => ALPHANUMERIC[b % ALPHANUMERIC.length]).join('');
}

export function generateSecret(bits: number, format: 'base64url' | 'hex' | 'alphanumeric'): string {
  const byteLength = Math.ceil(bits / 8);
  const bytes = getRandomBytes(byteLength);
  switch (format) {
    case 'base64url': return bytesToBase64Url(bytes);
    case 'hex': return bytesToHex(bytes);
    case 'alphanumeric': return bytesToAlphanumeric(bytes);
  }
}

export function generateApiKey(prefix: string, length: number, format: 'base64url' | 'hex' | 'alphanumeric'): string {
  const bytes = getRandomBytes(length);
  let random: string;
  switch (format) {
    case 'base64url': random = bytesToBase64Url(bytes); break;
    case 'hex': random = bytesToHex(bytes); break;
    case 'alphanumeric': random = bytesToAlphanumeric(bytes); break;
  }
  return prefix ? `${prefix}${random}` : random;
}

export function generatePassword(length: number, options: {
  uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean;
}): string {
  let chars = '';
  const ambiguous = 'O0l1I|';
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
  if (options.excludeAmbiguous) {
    chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
  }
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  const bytes = getRandomBytes(length);
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

export function generateUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function generateToken(length: number, charset: 'alphanumeric' | 'hex' | 'base64url'): string {
  const bytes = getRandomBytes(length);
  switch (charset) {
    case 'alphanumeric': return bytesToAlphanumeric(bytes).slice(0, length);
    case 'hex': return bytesToHex(bytes).slice(0, length);
    case 'base64url': return bytesToBase64Url(bytes).slice(0, length);
  }
}

export async function computeHash(algorithm: string, input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export async function computeHmac(algorithm: string, key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const algoMap: Record<string, string> = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-384': 'SHA-384', 'SHA-512': 'SHA-512' };
  const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: algoMap[algorithm] || 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

export function generateRandomBytesHex(byteCount: number): string {
  return bytesToHex(getRandomBytes(byteCount));
}

export function generateRandomBytesBase64(byteCount: number): string {
  return bytesToBase64(getRandomBytes(byteCount));
}

export function generateNanoId(length: number): string {
  const alphabet = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = getRandomBytes(length);
  return Array.from(bytes, b => alphabet[b & 63]).join('');
}

export function base64Encode(input: string): string {
  return btoa(new TextEncoder().encode(input).reduce((s, b) => s + String.fromCharCode(b), ''));
}

export function base64Decode(input: string): string {
  try {
    const bin = atob(input);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error('Invalid Base64 input');
  }
}

export function hexEncode(input: string): string {
  return Array.from(new TextEncoder().encode(input), b => b.toString(16).padStart(2, '0')).join('');
}

export function hexDecode(input: string): string {
  const hex = input.replace(/\s/g, '');
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string (odd length)');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const val = parseInt(hex.slice(i, i + 2), 16);
    if (isNaN(val)) throw new Error(`Invalid hex character at position ${i}`);
    bytes[i / 2] = val;
  }
  return new TextDecoder().decode(bytes);
}

export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error('Invalid URL-encoded string');
  }
}

export function generateTotpSecret(length: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bytes = getRandomBytes(length);
  return Array.from(bytes, b => alphabet[b % 32]).join('');
}

export function buildTotpUri(secret: string, issuer: string, account: string): string {
  const params = new URLSearchParams({
    secret, issuer, algorithm: 'SHA1', digits: '6', period: '30',
  });
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?${params}`;
}

// ── Key Pair Generation ──

export async function generateRsaKeyPair(bits: 2048 | 4096): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']
  );
  const [pubBuf, privBuf] = await Promise.all([
    crypto.subtle.exportKey('spki', keyPair.publicKey),
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
  ]);
  return { publicKey: formatPem(pubBuf, 'PUBLIC KEY'), privateKey: formatPem(privBuf, 'PRIVATE KEY') };
}

export async function generateEcKeyPair(curve: 'P-256' | 'P-384' | 'P-521'): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: curve }, true, ['sign', 'verify']);
  const [pubBuf, privBuf] = await Promise.all([
    crypto.subtle.exportKey('spki', keyPair.publicKey),
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
  ]);
  return { publicKey: formatPem(pubBuf, 'PUBLIC KEY'), privateKey: formatPem(privBuf, 'EC PRIVATE KEY') };
}

function formatPem(buffer: ArrayBuffer, label: string): string {
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = b64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

// ── Passphrase Generation ──

const WORDLIST = [
  'abandon','ability','able','about','above','absent','absorb','abstract','absurd','abuse',
  'access','accident','account','accuse','achieve','acid','acoustic','acquire','across','act',
  'action','actor','actress','actual','adapt','add','addict','address','adjust','admit',
  'adult','advance','advice','aerobic','affair','afford','afraid','again','age','agent',
  'agree','ahead','aim','air','airport','aisle','alarm','album','alcohol','alert',
  'alien','all','alley','allow','almost','alone','alpha','already','also','alter',
  'always','amateur','amazing','among','amount','amused','analyst','anchor','ancient','anger',
  'angle','angry','animal','ankle','announce','annual','another','answer','antenna','antique',
  'anxiety','any','apart','apology','appear','apple','approve','april','arch','arctic',
  'area','arena','argue','arm','armed','armor','army','around','arrange','arrest',
  'arrive','arrow','art','artefact','artist','artwork','ask','aspect','assault','asset',
  'assist','assume','asthma','athlete','atom','attack','attend','attitude','attract','auction',
  'audit','august','aunt','author','auto','avocado','avoid','awake','aware','awesome',
  'awful','awkward','axis','baby','bachelor','bacon','badge','bag','balance','balcony',
  'ball','bamboo','banana','banner','bar','barely','bargain','barrel','base','basic',
  'basket','battle','beach','bean','beauty','because','become','beef','before','begin',
  'behave','behind','believe','below','belt','bench','benefit','best','betray','better',
  'between','beyond','bicycle','bid','bike','bind','biology','bird','birth','bitter',
  'black','blade','blame','blanket','blast','bleak','bless','blind','blood','blossom',
  'blow','blue','blur','blush','board','boat','body','boil','bomb','bone',
  'bonus','book','boost','border','boring','borrow','boss','bottom','bounce','box',
  'boy','bracket','brain','brand','brass','brave','bread','breeze','brick','bridge',
  'brief','bright','bring','brisk','broccoli','broken','bronze','broom','brother','brown',
  'brush','bubble','buddy','budget','buffalo','build','bulb','bulk','bullet','bundle',
  'bunny','burden','burger','burst','bus','business','busy','butter','buyer','buzz',
  'cabbage','cabin','cable','cactus','cage','cake','call','calm','camera','camp',
  'can','canal','cancel','candy','cannon','canoe','canvas','canyon','capable','capital',
  'captain','car','carbon','card','cargo','carpet','carry','cart','case','cash',
  'casino','castle','casual','cat','catalog','catch','category','cattle','caught','cause',
  'caution','cave','ceiling','celery','cement','census','century','cereal','certain','chair',
  'chalk','champion','change','chaos','chapter','charge','chase','cheap','check','cheese',
  'cherry','chest','chicken','chief','child','chimney','choice','choose','chronic','chuckle',
  'chunk','churn','citizen','city','civil','claim','clap','clarify','claw','clay',
  'clean','clerk','clever','cliff','climb','clinic','clip','clock','clog','close',
  'cloth','cloud','clown','club','clump','cluster','clutch','coach','coast','coconut',
  'code','coffee','coil','coin','collect','color','column','combine','come','comfort',
  'comic','common','company','concert','conduct','confirm','congress','connect','consider','control',
  'convince','cook','cool','copper','copy','coral','core','corn','correct','cost',
  'cotton','couch','country','couple','course','cousin','cover','coyote','crack','cradle',
  'craft','cram','crane','crash','crater','crawl','crazy','cream','credit','creek',
  'crew','cricket','crime','crisp','critic','crop','cross','crouch','crowd','crucial',
  'cruel','cruise','crumble','crush','cry','crystal','cube','culture','cup','cupboard',
  'curious','current','curtain','curve','cushion','custom','cute','cycle','dad','damage',
  'damp','dance','danger','daring','dash','daughter','dawn','day','deal','debate',
  'debris','decade','december','decide','decline','decorate','decrease','deer','defense','define',
  'defy','degree','delay','deliver','demand','demise','denial','dentist','deny','depart',
  'depend','deposit','depth','deputy','derive','describe','desert','design','desk','despair',
  'destroy','detail','detect','develop','device','devote','diagram','dial','diamond','diary',
  'dice','diesel','diet','differ','digital','dignity','dilemma','dinner','dinosaur','direct',
  'dirt','disagree','discover','disease','dish','dismiss','disorder','display','distance','divert',
  'divide','divorce','dizzy','doctor','document','dog','doll','dolphin','domain','donate',
  'donkey','donor','door','dose','double','dove','draft','dragon','drama','drastic',
  'draw','dream','dress','drift','drill','drink','drip','drive','drop','drum',
  'dry','duck','dumb','dune','during','dust','dutch','duty','dwarf','dynamic',
  'eager','eagle','early','earn','earth','easily','east','easy','echo','ecology',
  'economy','edge','edit','educate','effort','egg','eight','either','elbow','elder',
  'electric','elegant','element','elephant','elevator','elite','else','embark','embody','embrace',
  'emerge','emotion','employ','empower','empty','enable','encourage','end','endless','endorse',
  'enemy','energy','enforce','engage','engine','enhance','enjoy','enlist','enough','enrich',
  'enroll','ensure','enter','entire','entry','envelope','episode','equal','equip','era',
  'erase','erode','erosion','error','erupt','escape','essay','essence','estate','eternal',
  'ethics','evidence','evil','evoke','evolve','exact','example','excess','exchange','excite',
  'exclude','excuse','execute','exercise','exhaust','exhibit','exile','exist','exit','exotic',
  'expand','expect','expire','explain','expose','express','extend','extra','eye','eyebrow',
  'fabric','face','faculty','fade','faint','faith','fall','false','fame','family',
  'famous','fan','fancy','fantasy','farm','fashion','fat','fatal','father','fatigue',
  'fault','favorite','feature','february','federal','fee','feed','feel','female','fence',
  'festival','fetch','fever','few','fiber','fiction','field','figure','file','film',
  'filter','final','find','fine','finger','finish','fire','firm','fiscal','fish',
  'fit','fitness','fix','flag','flame','flash','flat','flavor','flee','flight',
  'flip','float','flock','floor','flower','fluid','flush','fly','foam','focus',
  'fog','foil','fold','follow','food','foot','force','forest','forget','fork',
  'fortune','forum','forward','fossil','foster','found','fox','fragile','frame','frequent',
  'fresh','friend','fringe','frog','front','frost','frown','frozen','fruit','fuel',
  'fun','funny','furnace','fury','future','gadget','gain','galaxy','gallery','game',
  'gap','garage','garbage','garden','garlic','garment','gas','gasp','gate','gather',
  'gauge','gaze','general','genius','genre','gentle','genuine','gesture','ghost','giant',
  'gift','giggle','ginger','giraffe','girl','give','glad','glance','glare','glass',
  'glide','glimpse','globe','gloom','glory','glove','glow','glue','goat','goddess',
  'gold','good','goose','gorilla','gospel','gossip','govern','gown','grab','grace',
  'grain','grant','grape','grass','gravity','great','green','grid','grief','grit',
  'grocery','group','grow','grunt','guard','guess','guide','guilt','guitar','gun',
  'gym','habit','hair','half','hammer','hamster','hand','happy','harbor','hard',
  'harsh','harvest','hat','have','hawk','hazard','head','health','heart','heavy',
  'hedgehog','height','hello','helmet','help','hen','hero','hip','hire','history',
  'hobby','hockey','hold','hole','holiday','hollow','home','honey','hood','hope',
  'horn','horror','horse','hospital','host','hotel','hour','hover','hub','huge',
  'human','humble','humor','hundred','hungry','hunt','hurdle','hurry','hurt','husband',
  'hybrid','ice','icon','idea','identify','idle','ignore','ill','illegal','illness',
  'image','imitate','immense','immune','impact','impose','improve','impulse','inch','include',
  'income','increase','index','indicate','indoor','industry','infant','inflict','inform','initial',
  'inject','inmate','inner','innocent','input','inquiry','insane','insect','inside','inspire',
  'install','intact','interest','into','invest','invite','involve','iron','island','isolate',
  'issue','item','ivory','jacket','jaguar','jar','jazz','jealous','jeans','jelly',
  'jewel','job','join','joke','journey','joy','judge','juice','jump','jungle',
  'junior','junk','just','kangaroo','keen','keep','ketchup','key','kick','kid',
  'kidney','kind','kingdom','kiss','kit','kitchen','kite','kitten','kiwi','knee',
  'knife','knock','know','lab','label','labor','ladder','lady','lake','lamp',
  'language','laptop','large','later','latin','laugh','laundry','lava','law','lawn',
  'lawsuit','layer','lazy','leader','leaf','learn','leave','lecture','left','leg',
  'legal','legend','leisure','lemon','lend','length','lens','leopard','lesson','letter',
  'level','liberty','library','license','life','lift','light','like','limb','limit',
  'link','lion','liquid','list','little','live','lizard','load','loan','lobster',
  'local','lock','logic','lonely','long','loop','lottery','loud','lounge','love',
  'loyal','lucky','luggage','lumber','lunar','lunch','luxury','lyrics','machine','mad',
  'magic','magnet','maid','mail','main','major','make','mammal','man','manage',
  'mandate','mango','mansion','manual','maple','marble','march','margin','marine','market',
];

export function generatePassphrase(wordCount: number, separator: string, capitalize: boolean): string {
  const bytes = getRandomBytes(wordCount * 2);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = ((bytes[i * 2] << 8) | bytes[i * 2 + 1]) % WORDLIST.length;
    let word = WORDLIST[idx];
    if (capitalize) word = word[0].toUpperCase() + word.slice(1);
    words.push(word);
  }
  return words.join(separator);
}

// ── JWT Decoder ──

export function decodeJwt(token: string): { header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decode = (s: string) => JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')));
    return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
  } catch { return null; }
}

export function generateUlid(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const now = Date.now();
  let timeStr = '';
  let t = now;
  for (let i = 0; i < 10; i++) {
    timeStr = ENCODING[t % 32] + timeStr;
    t = Math.floor(t / 32);
  }
  const rand = getRandomBytes(10);
  let randStr = '';
  for (let i = 0; i < 16; i++) {
    const byteIdx = Math.floor(i * 10 / 16);
    randStr += ENCODING[rand[byteIdx] % 32];
  }
  return timeStr + randStr;
}
