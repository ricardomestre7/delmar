import subprocess,tempfile,os,time,json,urllib.request,urllib.error,shutil
from pathlib import Path
origin='http://127.0.0.1:3221';password='apenas-teste-negocio-2026'
def run(root,pharmacy):
 tmp=tempfile.mkdtemp(prefix='negocio-test-');env={**os.environ,'PUBLIC_ORIGIN':origin,'ADMIN_PASSWORD':password,'REQUESTS_ENABLED':'true','DATA_DIR':tmp}
 # Delmar stores its existing orders/catalog relative to cwd. Keep tests disposable by seeding no public orders and removing only our test catalogue if newly created.
 data_dir=Path(tmp);existed=True
 p=subprocess.Popen(['node','node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3221'],cwd=root,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 def req(path,body=None,method=None,cookie=None,ctype='application/json'):
  h={'Origin':origin}
  if body is not None:h['Content-Type']=ctype
  if cookie:h['Cookie']=cookie
  b=body.encode() if isinstance(body,str) else json.dumps(body).encode() if body is not None else None
  try:r=urllib.request.urlopen(urllib.request.Request(origin+path,data=b,headers=h,method=method))
  except urllib.error.HTTPError as e:r=e
  raw=r.read();v=json.loads(raw) if 'json' in r.headers.get('Content-Type','') else raw.decode();return r.status,v,r.headers
 try:
  for _ in range(70):
   try:
    if req('/api/health')[0]==200:break
   except:pass
   time.sleep(.2)
  assert req('/api/economia')[0]==401
  if not pharmacy:
   assert req('/api/orders')[0]==401
   assert req('/api/orders/qualquer',{'status':'entregue'},'PATCH')[0]==401
   assert req('/api/catalog/import',{'items':[]})[0]==401
  login='/api/login' if pharmacy else '/api/internal/auth'
  assert req(login,{'password':'incorreta'})[0]==401
  code,_,h=req(login,{'password':password});assert code==200,code
  cookie=h.get('Set-Cookie').split(';')[0];assert password not in cookie;assert 'HttpOnly' in h.get('Set-Cookie');assert 'Secure' in h.get('Set-Cookie')
  v={'date':'2026-11-14','revenue':1000,'goods':500,'expenses':100,'transactions':20,'receipts':950,'payments':600}
  assert req('/api/economia',v,cookie=cookie)[0]==200
  assert req('/api/economia',{**v,'revenue':1200},cookie=cookie)[0]==200
  code,data,_=req('/api/economia',cookie=cookie);assert len(data['days'])==1 and data['days'][0]['revenue']==1200
  assert req('/api/economia',{**v,'date':'2026-02-31'},cookie=cookie)[0]==400
  if pharmacy:
   assert req('/api/catalogo','sku;nome;categoria;preco;unidade;stock;descricao\nA;Teste;Pele;1,25;un;3;ok',ctype='text/csv')[0]==401
   rows=[{'sku':str(100000+i),'nome':'Produto teste '+str(i),'categoria':'Pele','preco':'1,25','stock':3} for i in range(5000)]
   code,imported,_=req('/api/catalogo',{'items':rows},cookie=cookie);assert code==200,(code,imported);assert imported['summary']['total']==5000
   code,page,_=req('/api/catalogo?page=2');assert len(page['items'])==24 and page['total']==5000
   assert req('/api/catalogo?q=100001')[1]['items'][0]['sku']=='100001'
   code,updated,_=req('/api/catalogo',{'items':[dict(rows[0],preco='2,50')]},cookie=cookie);assert updated['summary']['updated']==1 and updated['summary']['total']==5000
   assert req('/api/catalogo',{'items':[rows[0],dict(rows[1],nome='')]},cookie=cookie)[0]==400
   assert req('/api/catalogo?q=100000')[1]['items'][0]['price']==2.5
   csv='sku;nome;categoria;preco;unidade;stock;descricao\nNOVO;"Creme; rosto";Pele;9,99;un;2;"Texto com; ponto"'
   code,row,_=req('/api/catalogo',csv,cookie=cookie,ctype='text/csv');assert code==200,(code,row)
   assert req('/api/catalogo?q=NOVO')[1]['items'][0]['name']=='Creme; rosto'
  else:
   assert 'PAD-001' not in req('/api/catalog/import')[1]
   csv='sku;nome;categoria;preco;unidade;promocao;marca_propria;descricao;stock\nTESTE-CSV;"Produto; teste";Mercearia;1,25;un;nao;nao;"Descrição; teste";3'
   code,row,_=req('/api/catalog/import',csv,cookie=cookie,ctype='text/csv');assert code==200,(code,row);assert row['summary']['added']==1
   assert req('/api/catalog/import',csv,cookie=cookie,ctype='text/csv')[1]['summary']['updated']==1
  logout='/api/logout' if pharmacy else '/api/internal/auth'
  req(logout,{} if pharmacy else None,method='POST' if pharmacy else 'DELETE',cookie=cookie)
  print(('FARMÁCIA' if pharmacy else 'DELMAR')+': autenticação, bloqueio público, fechos sem duplicação, validação e importação CSV aprovados.'+(' 5.000 produtos, paginação, pesquisa, atualização e rollback aprovados.' if pharmacy else ''))
 finally:
  p.terminate();p.wait();shutil.rmtree(tmp)
  if not pharmacy and not existed and data_dir.exists():shutil.rmtree(data_dir)
root=Path(__file__).resolve().parents[1]
run(str(root/'apps'/'delmar-web'),False)
