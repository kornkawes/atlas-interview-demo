export const HEADERS=['Code','Status','Update','','','Property Type','Property Name','','','','','Zone','','Location Grade','BTS & SRT','MRT','ARL','Bedroom','Bathroom','','Rai','Ngan','sq.w.','sq.m.','Floor','Building','Parking','Corner Unit','View','Direction','Asking Price','Rental Price','','Price Remark','Sale / Sqm.','Rent / Sqm.','Segment','','','HONEY PROJECT','Generate','Remark'];
const fields={code:'Code',status:'Status',type:'Property Type',projectName:'Property Name',zone:'Zone',sqm:'sq.m.',askingPrice:'Asking Price',remark:'Remark'};
export function mapFixture(data){
 if(!data || !Array.isArray(data.headers) || data.headers.length!==HEADERS.length || !data.headers.every((x,i)=>x===HEADERS[i]) || !Array.isArray(data.rows)) throw Error('โครงสร้างข้อมูลไม่ถูกต้อง');
 const indices=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,data.headers.indexOf(v)])); const seen=new Set();
 return data.rows.map(row=>{if(!Array.isArray(row)||row.length!==HEADERS.length)throw Error('แถวข้อมูลไม่ถูกต้อง'); const p=Object.fromEntries(Object.entries(indices).map(([k,i])=>[k,row[i]]));
 if(typeof p.code!=='string'||!p.code.trim()||seen.has(p.code))throw Error('รหัสข้อมูลไม่ถูกต้อง'); seen.add(p.code);
 for(const k of ['status','type','projectName','zone','remark'])if(p[k]!==null&&typeof p[k]!=='string')throw Error('ข้อความไม่ถูกต้อง');
 for(const k of ['sqm','askingPrice'])if(p[k]!==null&&(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<0))throw Error('ตัวเลขไม่ถูกต้อง');return p;}).sort((a,b)=>a.code.localeCompare(b.code));
}
function bound(value){let s=String(value??'').trim();if(!s)return null;if(!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))throw Error('กรอกราคาเป็นตัวเลขที่ไม่ติดลบ');const n=Number(s);if(!Number.isFinite(n))throw Error('กรอกราคาเป็นตัวเลขที่ไม่ติดลบ');return n;}
export function filterRecords(records,{search='',type='',status='',min='',max=''}={}){const lo=bound(min),hi=bound(max);if(lo!==null&&hi!==null&&lo>hi)throw Error('ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด');const q=search.trim().toLowerCase();return records.filter(p=>(!q||[p.code,p.projectName].some(v=>(v??'').toLowerCase().includes(q)))&&(!type||p.type===type)&&(!status||p.status===status)&&((lo===null&&hi===null)||(p.askingPrice!==null&&p.askingPrice>0&&(lo===null||p.askingPrice>=lo)&&(hi===null||p.askingPrice<=hi))));}
