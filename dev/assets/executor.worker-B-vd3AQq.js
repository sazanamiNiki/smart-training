var Ge=Object.defineProperty,qe=(e,n)=>{for(var r in n)Ge(e,r,{get:n[r],enumerable:!0})},Ee={};qe(Ee,{analyzeMetafile:()=>ft,analyzeMetafileSync:()=>gt,build:()=>ot,buildSync:()=>dt,context:()=>ct,default:()=>wt,formatMessages:()=>ut,formatMessagesSync:()=>mt,initialize:()=>Be,stop:()=>pt,transform:()=>Ve,transformSync:()=>ht,version:()=>at});function Se(e){let n=f=>{if(f===null)r.write8(0);else if(typeof f=="boolean")r.write8(1),r.write8(+f);else if(typeof f=="number")r.write8(2),r.write32(f|0);else if(typeof f=="string")r.write8(3),r.write(ee(f));else if(f instanceof Uint8Array)r.write8(4),r.write(f);else if(f instanceof Array){r.write8(5),r.write32(f.length);for(let g of f)n(g)}else{let g=Object.keys(f);r.write8(6),r.write32(g.length);for(let p of g)r.write(ee(p)),n(f[p])}},r=new Ae;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),n(e.value),ke(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function Ye(e){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return ae(r.read());case 4:return r.read();case 5:{let h=r.read32(),b=[];for(let d=0;d<h;d++)b.push(n());return b}case 6:{let h=r.read32(),b={};for(let d=0;d<h;d++)b[ae(r.read())]=n();return b}default:throw new Error("Invalid packet")}},r=new Ae(e),f=r.read32(),g=(f&1)===0;f>>>=1;let p=n();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:f,isRequest:g,value:p}}var Ae=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let n=new Uint8Array((this.len+e)*2);n.set(this.buf),this.buf=n}return this.len+=e,this.len-e}write8(e){let n=this._write(1);this.buf[n]=e}write32(e){let n=this._write(4);ke(this.buf,e,n)}write(e){let n=this._write(4+e.length);ke(this.buf,e.length,n),this.buf.set(e,n+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return De(this.buf,this._read(4))}read(){let e=this.read32(),n=new Uint8Array(e),r=this._read(n.length);return n.set(this.buf.subarray(r,r+e)),n}},ee,ae,_e;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,n=new TextDecoder;ee=r=>e.encode(r),ae=r=>n.decode(r),_e='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ee=e=>Buffer.from(e),ae=e=>{let{buffer:n,byteOffset:r,byteLength:f}=e;return Buffer.from(n,r,f).toString()},_e='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ee("")instanceof Uint8Array))throw new Error(`Invariant violation: "${_e} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function De(e,n){return e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24}function ke(e,n,r){e[r++]=n,e[r++]=n>>8,e[r++]=n>>16,e[r++]=n>>24}var H=JSON.stringify,Te="warning",$e="silent";function je(e){if(Y(e,"target"),e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var pe=()=>null,z=e=>typeof e=="boolean"?null:"a boolean",_=e=>typeof e=="string"?null:"a string",ye=e=>e instanceof RegExp?null:"a RegExp object",ie=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Re=e=>typeof e=="function"?null:"a function",J=e=>Array.isArray(e)?null:"an array",Z=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",He=e=>typeof e=="object"&&e!==null?null:"an array or an object",Ke=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",Oe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",Ue=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",Qe=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",Xe=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",Ie=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",Ze=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function i(e,n,r,f){let g=e[r];if(n[r+""]=!0,g===void 0)return;let p=f(g);if(p!==null)throw new Error(`${H(r)} must be ${p}`);return g}function G(e,n,r){for(let f in e)if(!(f in n))throw new Error(`Invalid option ${r}: ${H(f)}`)}function et(e){let n=Object.create(null),r=i(e,n,"wasmURL",Ze),f=i(e,n,"wasmModule",Ke),g=i(e,n,"worker",z);return G(e,n,"in initialize() call"),{wasmURL:r,wasmModule:f,worker:g}}function Me(e){let n;if(e!==void 0){n=Object.create(null);for(let r in e){let f=e[r];if(typeof f=="string"||f===!1)n[r]=f;else throw new Error(`Expected ${H(r)} in mangle cache to map to either a string or false`)}}return n}function be(e,n,r,f,g){let p=i(n,r,"color",z),h=i(n,r,"logLevel",_),b=i(n,r,"logLimit",ie);p!==void 0?e.push(`--color=${p}`):f&&e.push("--color=true"),e.push(`--log-level=${h||g}`),e.push(`--log-limit=${b||0}`)}function Y(e,n,r){if(typeof e!="string")throw new Error(`Expected value for ${n}${r!==void 0?" "+H(r):""} to be a string, got ${typeof e} instead`);return e}function Ne(e,n,r){let f=i(n,r,"legalComments",_),g=i(n,r,"sourceRoot",_),p=i(n,r,"sourcesContent",z),h=i(n,r,"target",Xe),b=i(n,r,"format",_),d=i(n,r,"globalName",_),k=i(n,r,"mangleProps",ye),$=i(n,r,"reserveProps",ye),j=i(n,r,"mangleQuoted",z),I=i(n,r,"minify",z),S=i(n,r,"minifySyntax",z),V=i(n,r,"minifyWhitespace",z),x=i(n,r,"minifyIdentifiers",z),C=i(n,r,"lineLimit",ie),F=i(n,r,"drop",J),P=i(n,r,"dropLabels",J),u=i(n,r,"charset",_),l=i(n,r,"treeShaking",z),a=i(n,r,"ignoreAnnotations",z),o=i(n,r,"jsx",_),y=i(n,r,"jsxFactory",_),v=i(n,r,"jsxFragment",_),T=i(n,r,"jsxImportSource",_),t=i(n,r,"jsxDev",z),s=i(n,r,"jsxSideEffects",z),c=i(n,r,"define",Z),m=i(n,r,"logOverride",Z),E=i(n,r,"supported",Z),N=i(n,r,"pure",J),R=i(n,r,"keepNames",z),D=i(n,r,"platform",_),M=i(n,r,"tsconfigRaw",Qe);if(f&&e.push(`--legal-comments=${f}`),g!==void 0&&e.push(`--source-root=${g}`),p!==void 0&&e.push(`--sources-content=${p}`),h&&(Array.isArray(h)?e.push(`--target=${Array.from(h).map(je).join(",")}`):e.push(`--target=${je(h)}`)),b&&e.push(`--format=${b}`),d&&e.push(`--global-name=${d}`),D&&e.push(`--platform=${D}`),M&&e.push(`--tsconfig-raw=${typeof M=="string"?M:JSON.stringify(M)}`),I&&e.push("--minify"),S&&e.push("--minify-syntax"),V&&e.push("--minify-whitespace"),x&&e.push("--minify-identifiers"),C&&e.push(`--line-limit=${C}`),u&&e.push(`--charset=${u}`),l!==void 0&&e.push(`--tree-shaking=${l}`),a&&e.push("--ignore-annotations"),F)for(let A of F)e.push(`--drop:${Y(A,"drop")}`);if(P&&e.push(`--drop-labels=${Array.from(P).map(A=>Y(A,"dropLabels")).join(",")}`),k&&e.push(`--mangle-props=${k.source}`),$&&e.push(`--reserve-props=${$.source}`),j!==void 0&&e.push(`--mangle-quoted=${j}`),o&&e.push(`--jsx=${o}`),y&&e.push(`--jsx-factory=${y}`),v&&e.push(`--jsx-fragment=${v}`),T&&e.push(`--jsx-import-source=${T}`),t&&e.push("--jsx-dev"),s&&e.push("--jsx-side-effects"),c)for(let A in c){if(A.indexOf("=")>=0)throw new Error(`Invalid define: ${A}`);e.push(`--define:${A}=${Y(c[A],"define",A)}`)}if(m)for(let A in m){if(A.indexOf("=")>=0)throw new Error(`Invalid log override: ${A}`);e.push(`--log-override:${A}=${Y(m[A],"log override",A)}`)}if(E)for(let A in E){if(A.indexOf("=")>=0)throw new Error(`Invalid supported: ${A}`);const O=E[A];if(typeof O!="boolean")throw new Error(`Expected value for supported ${H(A)} to be a boolean, got ${typeof O} instead`);e.push(`--supported:${A}=${O}`)}if(N)for(let A of N)e.push(`--pure:${Y(A,"pure")}`);R&&e.push("--keep-names")}function tt(e,n,r,f,g){var p;let h=[],b=[],d=Object.create(null),k=null,$=null;be(h,n,d,r,f),Ne(h,n,d);let j=i(n,d,"sourcemap",Ue),I=i(n,d,"bundle",z),S=i(n,d,"splitting",z),V=i(n,d,"preserveSymlinks",z),x=i(n,d,"metafile",z),C=i(n,d,"outfile",_),F=i(n,d,"outdir",_),P=i(n,d,"outbase",_),u=i(n,d,"tsconfig",_),l=i(n,d,"resolveExtensions",J),a=i(n,d,"nodePaths",J),o=i(n,d,"mainFields",J),y=i(n,d,"conditions",J),v=i(n,d,"external",J),T=i(n,d,"packages",_),t=i(n,d,"alias",Z),s=i(n,d,"loader",Z),c=i(n,d,"outExtension",Z),m=i(n,d,"publicPath",_),E=i(n,d,"entryNames",_),N=i(n,d,"chunkNames",_),R=i(n,d,"assetNames",_),D=i(n,d,"inject",J),M=i(n,d,"banner",Z),A=i(n,d,"footer",Z),O=i(n,d,"entryPoints",He),L=i(n,d,"absWorkingDir",_),U=i(n,d,"stdin",Z),B=(p=i(n,d,"write",z))!=null?p:g,q=i(n,d,"allowOverwrite",z),Q=i(n,d,"mangleCache",Z);if(d.plugins=!0,G(n,d,`in ${e}() call`),j&&h.push(`--sourcemap${j===!0?"":`=${j}`}`),I&&h.push("--bundle"),q&&h.push("--allow-overwrite"),S&&h.push("--splitting"),V&&h.push("--preserve-symlinks"),x&&h.push("--metafile"),C&&h.push(`--outfile=${C}`),F&&h.push(`--outdir=${F}`),P&&h.push(`--outbase=${P}`),u&&h.push(`--tsconfig=${u}`),T&&h.push(`--packages=${T}`),l){let w=[];for(let W of l){if(Y(W,"resolve extension"),W.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${W}`);w.push(W)}h.push(`--resolve-extensions=${w.join(",")}`)}if(m&&h.push(`--public-path=${m}`),E&&h.push(`--entry-names=${E}`),N&&h.push(`--chunk-names=${N}`),R&&h.push(`--asset-names=${R}`),o){let w=[];for(let W of o){if(Y(W,"main field"),W.indexOf(",")>=0)throw new Error(`Invalid main field: ${W}`);w.push(W)}h.push(`--main-fields=${w.join(",")}`)}if(y){let w=[];for(let W of y){if(Y(W,"condition"),W.indexOf(",")>=0)throw new Error(`Invalid condition: ${W}`);w.push(W)}h.push(`--conditions=${w.join(",")}`)}if(v)for(let w of v)h.push(`--external:${Y(w,"external")}`);if(t)for(let w in t){if(w.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${w}`);h.push(`--alias:${w}=${Y(t[w],"alias",w)}`)}if(M)for(let w in M){if(w.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${w}`);h.push(`--banner:${w}=${Y(M[w],"banner",w)}`)}if(A)for(let w in A){if(w.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${w}`);h.push(`--footer:${w}=${Y(A[w],"footer",w)}`)}if(D)for(let w of D)h.push(`--inject:${Y(w,"inject")}`);if(s)for(let w in s){if(w.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${w}`);h.push(`--loader:${w}=${Y(s[w],"loader",w)}`)}if(c)for(let w in c){if(w.indexOf("=")>=0)throw new Error(`Invalid out extension: ${w}`);h.push(`--out-extension:${w}=${Y(c[w],"out extension",w)}`)}if(O)if(Array.isArray(O))for(let w=0,W=O.length;w<W;w++){let X=O[w];if(typeof X=="object"&&X!==null){let te=Object.create(null),K=i(X,te,"in",_),ce=i(X,te,"out",_);if(G(X,te,"in entry point at index "+w),K===void 0)throw new Error('Missing property "in" for entry point at index '+w);if(ce===void 0)throw new Error('Missing property "out" for entry point at index '+w);b.push([ce,K])}else b.push(["",Y(X,"entry point at index "+w)])}else for(let w in O)b.push([w,Y(O[w],"entry point",w)]);if(U){let w=Object.create(null),W=i(U,w,"contents",Ie),X=i(U,w,"resolveDir",_),te=i(U,w,"sourcefile",_),K=i(U,w,"loader",_);G(U,w,'in "stdin" object'),te&&h.push(`--sourcefile=${te}`),K&&h.push(`--loader=${K}`),X&&($=X),typeof W=="string"?k=ee(W):W instanceof Uint8Array&&(k=W)}let le=[];if(a)for(let w of a)w+="",le.push(w);return{entries:b,flags:h,write:B,stdinContents:k,stdinResolveDir:$,absWorkingDir:L,nodePaths:le,mangleCache:Me(Q)}}function nt(e,n,r,f){let g=[],p=Object.create(null);be(g,n,p,r,f),Ne(g,n,p);let h=i(n,p,"sourcemap",Ue),b=i(n,p,"sourcefile",_),d=i(n,p,"loader",_),k=i(n,p,"banner",_),$=i(n,p,"footer",_),j=i(n,p,"mangleCache",Z);return G(n,p,`in ${e}() call`),h&&g.push(`--sourcemap=${h===!0?"external":h}`),b&&g.push(`--sourcefile=${b}`),d&&g.push(`--loader=${d}`),k&&g.push(`--banner=${k}`),$&&g.push(`--footer=${$}`),{flags:g,mangleCache:Me(j)}}function rt(e){const n={},r={didClose:!1,reason:""};let f={},g=0,p=0,h=new Uint8Array(16*1024),b=0,d=u=>{let l=b+u.length;if(l>h.length){let o=new Uint8Array(l*2);o.set(h),h=o}h.set(u,b),b+=u.length;let a=0;for(;a+4<=b;){let o=De(h,a);if(a+4+o>b)break;a+=4,V(h.subarray(a,a+o)),a+=o}a>0&&(h.copyWithin(0,a,b),b-=a)},k=u=>{r.didClose=!0,u&&(r.reason=": "+(u.message||u));const l="The service was stopped"+r.reason;for(let a in f)f[a](l,null);f={}},$=(u,l,a)=>{if(r.didClose)return a("The service is no longer running"+r.reason,null);let o=g++;f[o]=(y,v)=>{try{a(y,v)}finally{u&&u.unref()}},u&&u.ref(),e.writeToStdin(Se({id:o,isRequest:!0,value:l}))},j=(u,l)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(Se({id:u,isRequest:!1,value:l}))},I=async(u,l)=>{try{if(l.command==="ping"){j(u,{});return}if(typeof l.key=="number"){const a=n[l.key];if(!a)return;const o=a[l.command];if(o){await o(u,l);return}}throw new Error("Invalid command: "+l.command)}catch(a){const o=[se(a,e,null,void 0,"")];try{j(u,{errors:o})}catch{}}},S=!0,V=u=>{if(S){S=!1;let a=String.fromCharCode(...u);if(a!=="0.20.2")throw new Error(`Cannot start service: Host version "0.20.2" does not match binary version ${H(a)}`);return}let l=Ye(u);if(l.isRequest)I(l.id,l.value);else{let a=f[l.id];delete f[l.id],l.value.error?a(l.value.error,{}):a(null,l.value)}};return{readFromStdout:d,afterClose:k,service:{buildOrContext:({callName:u,refs:l,options:a,isTTY:o,defaultWD:y,callback:v})=>{let T=0;const t=p++,s={},c={ref(){++T===1&&l&&l.ref()},unref(){--T===0&&(delete n[t],l&&l.unref())}};n[t]=s,c.ref(),st(u,t,$,j,c,e,s,a,o,y,(m,E)=>{try{v(m,E)}finally{c.unref()}})},transform:({callName:u,refs:l,input:a,options:o,isTTY:y,fs:v,callback:T})=>{const t=Fe();let s=c=>{try{if(typeof a!="string"&&!(a instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:m,mangleCache:E}=nt(u,o,y,$e),N={command:"transform",flags:m,inputFS:c!==null,input:c!==null?ee(c):typeof a=="string"?ee(a):a};E&&(N.mangleCache=E),$(l,N,(R,D)=>{if(R)return T(new Error(R),null);let M=oe(D.errors,t),A=oe(D.warnings,t),O=1,L=()=>{if(--O===0){let U={warnings:A,code:D.code,map:D.map,mangleCache:void 0,legalComments:void 0};"legalComments"in D&&(U.legalComments=D==null?void 0:D.legalComments),D.mangleCache&&(U.mangleCache=D==null?void 0:D.mangleCache),T(null,U)}};if(M.length>0)return T(fe("Transform failed",M,A),null);D.codeFS&&(O++,v.readFile(D.code,(U,B)=>{U!==null?T(U,null):(D.code=B,L())})),D.mapFS&&(O++,v.readFile(D.map,(U,B)=>{U!==null?T(U,null):(D.map=B,L())})),L()})}catch(m){let E=[];try{be(E,o,{},y,$e)}catch{}const N=se(m,e,t,void 0,"");$(l,{command:"error",flags:E,error:N},()=>{N.detail=t.load(N.detail),T(fe("Transform failed",[N],[]),null)})}};if((typeof a=="string"||a instanceof Uint8Array)&&a.length>1024*1024){let c=s;s=()=>v.writeFile(a,c)}s(null)},formatMessages:({callName:u,refs:l,messages:a,options:o,callback:y})=>{if(!o)throw new Error(`Missing second argument in ${u}() call`);let v={},T=i(o,v,"kind",_),t=i(o,v,"color",z),s=i(o,v,"terminalWidth",ie);if(G(o,v,`in ${u}() call`),T===void 0)throw new Error(`Missing "kind" in ${u}() call`);if(T!=="error"&&T!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${u}() call`);let c={command:"format-msgs",messages:ne(a,"messages",null,"",s),isWarning:T==="warning"};t!==void 0&&(c.color=t),s!==void 0&&(c.terminalWidth=s),$(l,c,(m,E)=>{if(m)return y(new Error(m),null);y(null,E.messages)})},analyzeMetafile:({callName:u,refs:l,metafile:a,options:o,callback:y})=>{o===void 0&&(o={});let v={},T=i(o,v,"color",z),t=i(o,v,"verbose",z);G(o,v,`in ${u}() call`);let s={command:"analyze-metafile",metafile:a};T!==void 0&&(s.color=T),t!==void 0&&(s.verbose=t),$(l,s,(c,m)=>{if(c)return y(new Error(c),null);y(null,m.result)})}}}}function st(e,n,r,f,g,p,h,b,d,k,$){const j=Fe(),I=e==="context",S=(C,F)=>{const P=[];try{be(P,b,{},d,Te)}catch{}const u=se(C,p,j,void 0,F);r(g,{command:"error",flags:P,error:u},()=>{u.detail=j.load(u.detail),$(fe(I?"Context failed":"Build failed",[u],[]),null)})};let V;if(typeof b=="object"){const C=b.plugins;if(C!==void 0){if(!Array.isArray(C))return S(new Error('"plugins" must be an array'),"");V=C}}if(V&&V.length>0){if(p.isSync)return S(new Error("Cannot use plugins in synchronous API calls"),"");it(n,r,f,g,p,h,b,V,j).then(C=>{if(!C.ok)return S(C.error,C.pluginName);try{x(C.requestPlugins,C.runOnEndCallbacks,C.scheduleOnDisposeCallbacks)}catch(F){S(F,"")}},C=>S(C,""));return}try{x(null,(C,F)=>F([],[]),()=>{})}catch(C){S(C,"")}function x(C,F,P){const u=p.hasFS,{entries:l,flags:a,write:o,stdinContents:y,stdinResolveDir:v,absWorkingDir:T,nodePaths:t,mangleCache:s}=tt(e,b,d,Te,u);if(o&&!p.hasFS)throw new Error('The "write" option is unavailable in this environment');const c={command:"build",key:n,entries:l,flags:a,write:o,stdinContents:y,stdinResolveDir:v,absWorkingDir:T||k,nodePaths:t,context:I};C&&(c.plugins=C),s&&(c.mangleCache=s);const m=(R,D)=>{const M={errors:oe(R.errors,j),warnings:oe(R.warnings,j),outputFiles:void 0,metafile:void 0,mangleCache:void 0},A=M.errors.slice(),O=M.warnings.slice();R.outputFiles&&(M.outputFiles=R.outputFiles.map(lt)),R.metafile&&(M.metafile=JSON.parse(R.metafile)),R.mangleCache&&(M.mangleCache=R.mangleCache),R.writeToStdout!==void 0&&console.log(ae(R.writeToStdout).replace(/\n$/,"")),F(M,(L,U)=>{if(A.length>0||L.length>0){const B=fe("Build failed",A.concat(L),O.concat(U));return D(B,null,L,U)}D(null,M,L,U)})};let E,N;I&&(h["on-end"]=(R,D)=>new Promise(M=>{m(D,(A,O,L,U)=>{const B={errors:L,warnings:U};N&&N(A,O),E=void 0,N=void 0,f(R,B),M()})})),r(g,c,(R,D)=>{if(R)return $(new Error(R),null);if(!I)return m(D,(O,L)=>(P(),$(O,L)));if(D.errors.length>0)return $(fe("Context failed",D.errors,D.warnings),null);let M=!1;const A={rebuild:()=>(E||(E=new Promise((O,L)=>{let U;N=(q,Q)=>{U||(U=()=>q?L(q):O(Q))};const B=()=>{r(g,{command:"rebuild",key:n},(Q,le)=>{Q?L(new Error(Q)):U?U():B()})};B()})),E),watch:(O={})=>new Promise((L,U)=>{if(!p.hasFS)throw new Error('Cannot use the "watch" API in this environment');G(O,{},"in watch() call"),r(g,{command:"watch",key:n},Q=>{Q?U(new Error(Q)):L(void 0)})}),serve:(O={})=>new Promise((L,U)=>{if(!p.hasFS)throw new Error('Cannot use the "serve" API in this environment');const B={},q=i(O,B,"port",ie),Q=i(O,B,"host",_),le=i(O,B,"servedir",_),w=i(O,B,"keyfile",_),W=i(O,B,"certfile",_),X=i(O,B,"fallback",_),te=i(O,B,"onRequest",Re);G(O,B,"in serve() call");const K={command:"serve",key:n,onRequest:!!te};q!==void 0&&(K.port=q),Q!==void 0&&(K.host=Q),le!==void 0&&(K.servedir=le),w!==void 0&&(K.keyfile=w),W!==void 0&&(K.certfile=W),X!==void 0&&(K.fallback=X),r(g,K,(ce,We)=>{if(ce)return U(new Error(ce));te&&(h["serve-request"]=(ze,Je)=>{te(Je.args),f(ze,{})}),L(We)})}),cancel:()=>new Promise(O=>{if(M)return O();r(g,{command:"cancel",key:n},()=>{O()})}),dispose:()=>new Promise(O=>{if(M)return O();M=!0,r(g,{command:"dispose",key:n},()=>{O(),P(),g.unref()})})};g.ref(),$(null,A)})}}var it=async(e,n,r,f,g,p,h,b,d)=>{let k=[],$=[],j={},I={},S=[],V=0,x=0,C=[],F=!1;b=[...b];for(let l of b){let a={};if(typeof l!="object")throw new Error(`Plugin at index ${x} must be an object`);const o=i(l,a,"name",_);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${x} is missing a name`);try{let y=i(l,a,"setup",Re);if(typeof y!="function")throw new Error("Plugin is missing a setup function");G(l,a,`on plugin ${H(o)}`);let v={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};x++;let t=y({initialOptions:h,resolve:(s,c={})=>{if(!F)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof s!="string")throw new Error("The path to resolve must be a string");let m=Object.create(null),E=i(c,m,"pluginName",_),N=i(c,m,"importer",_),R=i(c,m,"namespace",_),D=i(c,m,"resolveDir",_),M=i(c,m,"kind",_),A=i(c,m,"pluginData",pe);return G(c,m,"in resolve() call"),new Promise((O,L)=>{const U={command:"resolve",path:s,key:e,pluginName:o};if(E!=null&&(U.pluginName=E),N!=null&&(U.importer=N),R!=null&&(U.namespace=R),D!=null&&(U.resolveDir=D),M!=null)U.kind=M;else throw new Error('Must specify "kind" when calling "resolve"');A!=null&&(U.pluginData=d.store(A)),n(f,U,(B,q)=>{B!==null?L(new Error(B)):O({errors:oe(q.errors,d),warnings:oe(q.warnings,d),path:q.path,external:q.external,sideEffects:q.sideEffects,namespace:q.namespace,suffix:q.suffix,pluginData:d.load(q.pluginData)})})})},onStart(s){let c='This error came from the "onStart" callback registered here:',m=he(new Error(c),g,"onStart");k.push({name:o,callback:s,note:m}),v.onStart=!0},onEnd(s){let c='This error came from the "onEnd" callback registered here:',m=he(new Error(c),g,"onEnd");$.push({name:o,callback:s,note:m}),v.onEnd=!0},onResolve(s,c){let m='This error came from the "onResolve" callback registered here:',E=he(new Error(m),g,"onResolve"),N={},R=i(s,N,"filter",ye),D=i(s,N,"namespace",_);if(G(s,N,`in onResolve() call for plugin ${H(o)}`),R==null)throw new Error("onResolve() call is missing a filter");let M=V++;j[M]={name:o,callback:c,note:E},v.onResolve.push({id:M,filter:R.source,namespace:D||""})},onLoad(s,c){let m='This error came from the "onLoad" callback registered here:',E=he(new Error(m),g,"onLoad"),N={},R=i(s,N,"filter",ye),D=i(s,N,"namespace",_);if(G(s,N,`in onLoad() call for plugin ${H(o)}`),R==null)throw new Error("onLoad() call is missing a filter");let M=V++;I[M]={name:o,callback:c,note:E},v.onLoad.push({id:M,filter:R.source,namespace:D||""})},onDispose(s){S.push(s)},esbuild:g.esbuild});t&&await t,C.push(v)}catch(y){return{ok:!1,error:y,pluginName:o}}}p["on-start"]=async(l,a)=>{let o={errors:[],warnings:[]};await Promise.all(k.map(async({name:y,callback:v,note:T})=>{try{let t=await v();if(t!=null){if(typeof t!="object")throw new Error(`Expected onStart() callback in plugin ${H(y)} to return an object`);let s={},c=i(t,s,"errors",J),m=i(t,s,"warnings",J);G(t,s,`from onStart() callback in plugin ${H(y)}`),c!=null&&o.errors.push(...ne(c,"errors",d,y,void 0)),m!=null&&o.warnings.push(...ne(m,"warnings",d,y,void 0))}}catch(t){o.errors.push(se(t,g,d,T&&T(),y))}})),r(l,o)},p["on-resolve"]=async(l,a)=>{let o={},y="",v,T;for(let t of a.ids)try{({name:y,callback:v,note:T}=j[t]);let s=await v({path:a.path,importer:a.importer,namespace:a.namespace,resolveDir:a.resolveDir,kind:a.kind,pluginData:d.load(a.pluginData)});if(s!=null){if(typeof s!="object")throw new Error(`Expected onResolve() callback in plugin ${H(y)} to return an object`);let c={},m=i(s,c,"pluginName",_),E=i(s,c,"path",_),N=i(s,c,"namespace",_),R=i(s,c,"suffix",_),D=i(s,c,"external",z),M=i(s,c,"sideEffects",z),A=i(s,c,"pluginData",pe),O=i(s,c,"errors",J),L=i(s,c,"warnings",J),U=i(s,c,"watchFiles",J),B=i(s,c,"watchDirs",J);G(s,c,`from onResolve() callback in plugin ${H(y)}`),o.id=t,m!=null&&(o.pluginName=m),E!=null&&(o.path=E),N!=null&&(o.namespace=N),R!=null&&(o.suffix=R),D!=null&&(o.external=D),M!=null&&(o.sideEffects=M),A!=null&&(o.pluginData=d.store(A)),O!=null&&(o.errors=ne(O,"errors",d,y,void 0)),L!=null&&(o.warnings=ne(L,"warnings",d,y,void 0)),U!=null&&(o.watchFiles=me(U,"watchFiles")),B!=null&&(o.watchDirs=me(B,"watchDirs"));break}}catch(s){o={id:t,errors:[se(s,g,d,T&&T(),y)]};break}r(l,o)},p["on-load"]=async(l,a)=>{let o={},y="",v,T;for(let t of a.ids)try{({name:y,callback:v,note:T}=I[t]);let s=await v({path:a.path,namespace:a.namespace,suffix:a.suffix,pluginData:d.load(a.pluginData),with:a.with});if(s!=null){if(typeof s!="object")throw new Error(`Expected onLoad() callback in plugin ${H(y)} to return an object`);let c={},m=i(s,c,"pluginName",_),E=i(s,c,"contents",Ie),N=i(s,c,"resolveDir",_),R=i(s,c,"pluginData",pe),D=i(s,c,"loader",_),M=i(s,c,"errors",J),A=i(s,c,"warnings",J),O=i(s,c,"watchFiles",J),L=i(s,c,"watchDirs",J);G(s,c,`from onLoad() callback in plugin ${H(y)}`),o.id=t,m!=null&&(o.pluginName=m),E instanceof Uint8Array?o.contents=E:E!=null&&(o.contents=ee(E)),N!=null&&(o.resolveDir=N),R!=null&&(o.pluginData=d.store(R)),D!=null&&(o.loader=D),M!=null&&(o.errors=ne(M,"errors",d,y,void 0)),A!=null&&(o.warnings=ne(A,"warnings",d,y,void 0)),O!=null&&(o.watchFiles=me(O,"watchFiles")),L!=null&&(o.watchDirs=me(L,"watchDirs"));break}}catch(s){o={id:t,errors:[se(s,g,d,T&&T(),y)]};break}r(l,o)};let P=(l,a)=>a([],[]);$.length>0&&(P=(l,a)=>{(async()=>{const o=[],y=[];for(const{name:v,callback:T,note:t}of $){let s,c;try{const m=await T(l);if(m!=null){if(typeof m!="object")throw new Error(`Expected onEnd() callback in plugin ${H(v)} to return an object`);let E={},N=i(m,E,"errors",J),R=i(m,E,"warnings",J);G(m,E,`from onEnd() callback in plugin ${H(v)}`),N!=null&&(s=ne(N,"errors",d,v,void 0)),R!=null&&(c=ne(R,"warnings",d,v,void 0))}}catch(m){s=[se(m,g,d,t&&t(),v)]}if(s){o.push(...s);try{l.errors.push(...s)}catch{}}if(c){y.push(...c);try{l.warnings.push(...c)}catch{}}}a(o,y)})()});let u=()=>{for(const l of S)setTimeout(()=>l(),0)};return F=!0,{ok:!0,requestPlugins:C,runOnEndCallbacks:P,scheduleOnDisposeCallbacks:u}};function Fe(){const e=new Map;let n=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const f=n++;return e.set(f,r),f}}}function he(e,n,r){let f,g=!1;return()=>{if(g)return f;g=!0;try{let p=(e.stack+"").split(`
`);p.splice(1,1);let h=Le(n,p,r);if(h)return f={text:e.message,location:h},f}catch{}}}function se(e,n,r,f,g){let p="Internal error",h=null;try{p=(e&&e.message||e)+""}catch{}try{h=Le(n,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:g,text:p,location:h,notes:f?[f]:[],detail:r?r.store(e):-1}}function Le(e,n,r){let f="    at ";if(e.readFileSync&&!n[0].startsWith(f)&&n[1].startsWith(f))for(let g=1;g<n.length;g++){let p=n[g];if(p.startsWith(f))for(p=p.slice(f.length);;){let h=/^(?:new |async )?\S+ \((.*)\)$/.exec(p);if(h){p=h[1];continue}if(h=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(p),h){p=h[1];continue}if(h=/^(\S+):(\d+):(\d+)$/.exec(p),h){let b;try{b=e.readFileSync(h[1],"utf8")}catch{break}let d=b.split(/\r\n|\r|\n|\u2028|\u2029/)[+h[2]-1]||"",k=+h[3]-1,$=d.slice(k,k+r.length)===r?r.length:0;return{file:h[1],namespace:"file",line:+h[2],column:ee(d.slice(0,k)).length,length:ee(d.slice(k,k+$)).length,lineText:d+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function fe(e,n,r){let f=5;e+=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,f+1).map((p,h)=>{if(h===f)return`
...`;if(!p.location)return`
error: ${p.text}`;let{file:b,line:d,column:k}=p.location,$=p.pluginName?`[plugin: ${p.pluginName}] `:"";return`
${b}:${d}:${k}: ERROR: ${$}${p.text}`}).join("");let g=new Error(e);for(const[p,h]of[["errors",n],["warnings",r]])Object.defineProperty(g,p,{configurable:!0,enumerable:!0,get:()=>h,set:b=>Object.defineProperty(g,p,{configurable:!0,enumerable:!0,value:b})});return g}function oe(e,n){for(const r of e)r.detail=n.load(r.detail);return e}function Ce(e,n,r){if(e==null)return null;let f={},g=i(e,f,"file",_),p=i(e,f,"namespace",_),h=i(e,f,"line",ie),b=i(e,f,"column",ie),d=i(e,f,"length",ie),k=i(e,f,"lineText",_),$=i(e,f,"suggestion",_);if(G(e,f,n),k){const j=k.slice(0,(b&&b>0?b:0)+(d&&d>0?d:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(j)&&!/\n/.test(k)&&(k=j)}return{file:g||"",namespace:p||"",line:h||0,column:b||0,length:d||0,lineText:k||"",suggestion:$||""}}function ne(e,n,r,f,g){let p=[],h=0;for(const b of e){let d={},k=i(b,d,"id",_),$=i(b,d,"pluginName",_),j=i(b,d,"text",_),I=i(b,d,"location",Oe),S=i(b,d,"notes",J),V=i(b,d,"detail",pe),x=`in element ${h} of "${n}"`;G(b,d,x);let C=[];if(S)for(const F of S){let P={},u=i(F,P,"text",_),l=i(F,P,"location",Oe);G(F,P,x),C.push({text:u||"",location:Ce(l,x,g)})}p.push({id:k||"",pluginName:$||f,text:j||"",location:Ce(I,x,g),notes:C,detail:r?r.store(V):-1}),h++}return p}function me(e,n){const r=[];for(const f of e){if(typeof f!="string")throw new Error(`${H(n)} must be an array of strings`);r.push(f)}return r}function lt({path:e,contents:n,hash:r}){let f=null;return{path:e,contents:n,hash:r,get text(){const g=this.contents;return(f===null||g!==n)&&(n=g,f=ae(g)),f}}}var at="0.20.2",ot=e=>de().build(e),ct=e=>de().context(e),Ve=(e,n)=>de().transform(e,n),ut=(e,n)=>de().formatMessages(e,n),ft=(e,n)=>de().analyzeMetafile(e,n),dt=()=>{throw new Error('The "buildSync" API only works in node')},ht=()=>{throw new Error('The "transformSync" API only works in node')},mt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},gt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},pt=()=>(we&&we(),Promise.resolve()),re,we,ve,de=()=>{if(ve)return ve;throw re?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Be=e=>{e=et(e||{});let n=e.wasmURL,r=e.wasmModule,f=e.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(re)throw new Error('Cannot call "initialize" more than once');return re=yt(n||"",r,f),re.catch(()=>{re=void 0}),re},yt=async(e,n,r)=>{let f;if(r){let k=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              go: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8) + 1
                    // setTimeout has been seen to fire up to 1 millisecond early
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          async run(instance) {
            if (!(instance instanceof WebAssembly.Instance)) {
              throw new Error("Go.run: WebAssembly.Instance expected");
            }
            this._inst = instance;
            this.mem = new DataView(this._inst.exports.mem.buffer);
            this._values = [
              // JS values that Go currently has references to, indexed by reference id
              NaN,
              0,
              null,
              true,
              false,
              globalThis,
              this
            ];
            this._goRefCounts = new Array(this._values.length).fill(Infinity);
            this._ids = /* @__PURE__ */ new Map([
              // mapping from JS values to reference ids
              [0, 1],
              [null, 2],
              [true, 3],
              [false, 4],
              [globalThis, 5],
              [this, 6]
            ]);
            this._idPool = [];
            this.exited = false;
            let offset = 4096;
            const strPtr = (str) => {
              const ptr = offset;
              const bytes = encoder.encode(str + "\\0");
              new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
              offset += bytes.length;
              if (offset % 8 !== 0) {
                offset += 8 - offset % 8;
              }
              return ptr;
            };
            const argc = this.argv.length;
            const argvPtrs = [];
            this.argv.forEach((arg) => {
              argvPtrs.push(strPtr(arg));
            });
            argvPtrs.push(0);
            const keys = Object.keys(this.env).sort();
            keys.forEach((key) => {
              argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
            });
            argvPtrs.push(0);
            const argv = offset;
            argvPtrs.forEach((ptr) => {
              this.mem.setUint32(offset, ptr, true);
              this.mem.setUint32(offset + 4, 0, true);
              offset += 8;
            });
            const wasmMinDataAddr = 4096 + 8192;
            if (offset >= wasmMinDataAddr) {
              throw new Error("total length of command line and environment variables exceeds limit");
            }
            this._inst.exports.run(argc, argv);
            if (this.exited) {
              this._resolveExitPromise();
            }
            await this._exitPromise;
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1)
              console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin)
              resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.20.2"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      async function tryToInstantiateModule(wasm, go) {
        if (wasm instanceof WebAssembly.Module) {
          return WebAssembly.instantiate(wasm, go.importObject);
        }
        const res = await fetch(wasm);
        if (!res.ok)
          throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
        if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
          const result2 = await WebAssembly.instantiateStreaming(res, go.importObject);
          return result2.instance;
        }
        const bytes = await res.arrayBuffer();
        const result = await WebAssembly.instantiate(bytes, go.importObject);
        return result.instance;
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});f=new Worker(URL.createObjectURL(k))}else{let k=(j=>{let I,S={};for(let x=self;x;x=Object.getPrototypeOf(x))for(let C of Object.getOwnPropertyNames(x))C in S||Object.defineProperty(S,C,{get:()=>self[C]});(()=>{const x=()=>{const P=new Error("not implemented");return P.code="ENOSYS",P};if(!S.fs){let P="";S.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(u,l){P+=F.decode(l);const a=P.lastIndexOf(`
`);return a!=-1&&(console.log(P.substring(0,a)),P=P.substring(a+1)),l.length},write(u,l,a,o,y,v){if(a!==0||o!==l.length||y!==null){v(x());return}const T=this.writeSync(u,l);v(null,T)},chmod(u,l,a){a(x())},chown(u,l,a,o){o(x())},close(u,l){l(x())},fchmod(u,l,a){a(x())},fchown(u,l,a,o){o(x())},fstat(u,l){l(x())},fsync(u,l){l(null)},ftruncate(u,l,a){a(x())},lchown(u,l,a,o){o(x())},link(u,l,a){a(x())},lstat(u,l){l(x())},mkdir(u,l,a){a(x())},open(u,l,a,o){o(x())},read(u,l,a,o,y,v){v(x())},readdir(u,l){l(x())},readlink(u,l){l(x())},rename(u,l,a){a(x())},rmdir(u,l){l(x())},stat(u,l){l(x())},symlink(u,l,a){a(x())},truncate(u,l,a){a(x())},unlink(u,l){l(x())},utimes(u,l,a,o){o(x())}}}if(S.process||(S.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw x()},pid:-1,ppid:-1,umask(){throw x()},cwd(){throw x()},chdir(){throw x()}}),!S.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!S.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!S.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!S.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const C=new TextEncoder("utf-8"),F=new TextDecoder("utf-8");S.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const P=(t,s)=>{this.mem.setUint32(t+0,s,!0),this.mem.setUint32(t+4,Math.floor(s/4294967296),!0)},u=t=>{const s=this.mem.getUint32(t+0,!0),c=this.mem.getInt32(t+4,!0);return s+c*4294967296},l=t=>{const s=this.mem.getFloat64(t,!0);if(s===0)return;if(!isNaN(s))return s;const c=this.mem.getUint32(t,!0);return this._values[c]},a=(t,s)=>{if(typeof s=="number"&&s!==0){if(isNaN(s)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,s,!0);return}if(s===void 0){this.mem.setFloat64(t,0,!0);return}let m=this._ids.get(s);m===void 0&&(m=this._idPool.pop(),m===void 0&&(m=this._values.length),this._values[m]=s,this._goRefCounts[m]=0,this._ids.set(s,m)),this._goRefCounts[m]++;let E=0;switch(typeof s){case"object":s!==null&&(E=1);break;case"string":E=2;break;case"symbol":E=3;break;case"function":E=4;break}this.mem.setUint32(t+4,2146959360|E,!0),this.mem.setUint32(t,m,!0)},o=t=>{const s=u(t+0),c=u(t+8);return new Uint8Array(this._inst.exports.mem.buffer,s,c)},y=t=>{const s=u(t+0),c=u(t+8),m=new Array(c);for(let E=0;E<c;E++)m[E]=l(s+E*8);return m},v=t=>{const s=u(t+0),c=u(t+8);return F.decode(new DataView(this._inst.exports.mem.buffer,s,c))},T=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const s=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(s)},"runtime.wasmWrite":t=>{t>>>=0;const s=u(t+8),c=u(t+16),m=this.mem.getInt32(t+24,!0);S.fs.writeSync(s,new Uint8Array(this._inst.exports.mem.buffer,c,m))},"runtime.resetMemoryDataView":t=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,P(t+8,(T+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const s=new Date().getTime();P(t+8,s/1e3),this.mem.setInt32(t+16,s%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const s=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(s,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(s);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},u(t+8)+1)),this.mem.setInt32(t+16,s,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const s=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(s)),this._scheduledTimeouts.delete(s)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(o(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const s=this.mem.getUint32(t+8,!0);if(this._goRefCounts[s]--,this._goRefCounts[s]===0){const c=this._values[s];this._values[s]=null,this._ids.delete(c),this._idPool.push(s)}},"syscall/js.stringVal":t=>{t>>>=0,a(t+24,v(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const s=Reflect.get(l(t+8),v(t+16));t=this._inst.exports.getsp()>>>0,a(t+32,s)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(l(t+8),v(t+16),l(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(l(t+8),v(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,a(t+24,Reflect.get(l(t+8),u(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(l(t+8),u(t+16),l(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const s=l(t+8),c=Reflect.get(s,v(t+16)),m=y(t+32),E=Reflect.apply(c,s,m);t=this._inst.exports.getsp()>>>0,a(t+56,E),this.mem.setUint8(t+64,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+56,s),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const s=l(t+8),c=y(t+16),m=Reflect.apply(s,void 0,c);t=this._inst.exports.getsp()>>>0,a(t+40,m),this.mem.setUint8(t+48,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+40,s),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const s=l(t+8),c=y(t+16),m=Reflect.construct(s,c);t=this._inst.exports.getsp()>>>0,a(t+40,m),this.mem.setUint8(t+48,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+40,s),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,P(t+16,parseInt(l(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const s=C.encode(String(l(t+8)));a(t+16,s),P(t+24,s.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const s=l(t+8);o(t+16).set(s)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,l(t+8)instanceof l(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const s=o(t+8),c=l(t+32);if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const m=c.subarray(0,s.length);s.set(m),P(t+40,m.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const s=l(t+8),c=o(t+16);if(!(s instanceof Uint8Array||s instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const m=c.subarray(0,s.length);s.set(m),P(t+40,m.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}async run(P){if(!(P instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=P,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,S,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[S,5],[this,6]]),this._idPool=[],this.exited=!1;let u=4096;const l=t=>{const s=u,c=C.encode(t+"\0");return new Uint8Array(this.mem.buffer,u,c.length).set(c),u+=c.length,u%8!==0&&(u+=8-u%8),s},a=this.argv.length,o=[];this.argv.forEach(t=>{o.push(l(t))}),o.push(0),Object.keys(this.env).sort().forEach(t=>{o.push(l(`${t}=${this.env[t]}`))}),o.push(0);const v=u;if(o.forEach(t=>{this.mem.setUint32(u,t,!0),this.mem.setUint32(u+4,0,!0),u+=8}),u>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(a,v),this.exited&&this._resolveExitPromise(),await this._exitPromise}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(P){const u=this;return function(){const l={id:P,this:this,args:arguments};return u._pendingEvent=l,u._resume(),l.result}}}})(),I=({data:x})=>{let C=new TextDecoder,F=S.fs,P="";F.writeSync=(y,v)=>{if(y===1)j(v);else if(y===2){P+=C.decode(v);let T=P.split(`
`);T.length>1&&console.log(T.slice(0,-1).join(`
`)),P=T[T.length-1]}else throw new Error("Bad write");return v.length};let u=[],l,a=0;I=({data:y})=>(y.length>0&&(u.push(y),l&&l()),o),F.read=(y,v,T,t,s,c)=>{if(y!==0||T!==0||t!==v.length||s!==null)throw new Error("Bad read");if(u.length===0){l=()=>F.read(y,v,T,t,s,c);return}let m=u[0],E=Math.max(0,Math.min(t,m.length-a));v.set(m.subarray(a,a+E),T),a+=E,a===m.length&&(u.shift(),a=0),c(null,E)};let o=new S.Go;return o.argv=["","--service=0.20.2"],V(x,o).then(y=>{j(null),o.run(y)},y=>{j(y)}),o};async function V(x,C){if(x instanceof WebAssembly.Module)return WebAssembly.instantiate(x,C.importObject);const F=await fetch(x);if(!F.ok)throw new Error(`Failed to download ${JSON.stringify(x)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(F.headers.get("Content-Type")||""))return(await WebAssembly.instantiateStreaming(F,C.importObject)).instance;const P=await F.arrayBuffer();return(await WebAssembly.instantiate(P,C.importObject)).instance}return x=>I(x)})(j=>f.onmessage({data:j})),$;f={onmessage:null,postMessage:j=>setTimeout(()=>$=k({data:j})),terminate(){if($)for(let j of $._scheduledTimeouts.values())clearTimeout(j)}}}let g,p;const h=new Promise((k,$)=>{g=k,p=$});f.onmessage=({data:k})=>{f.onmessage=({data:$})=>b($),k?p(k):g()},f.postMessage(n||new URL(e,location.href).toString());let{readFromStdout:b,service:d}=rt({writeToStdin(k){f.postMessage(k)},isSync:!1,hasFS:!1,esbuild:Ee});await h,we=()=>{f.terminate(),re=void 0,we=void 0,ve=void 0},ve={build:k=>new Promise(($,j)=>d.buildOrContext({callName:"build",refs:null,options:k,isTTY:!1,defaultWD:"/",callback:(I,S)=>I?j(I):$(S)})),context:k=>new Promise(($,j)=>d.buildOrContext({callName:"context",refs:null,options:k,isTTY:!1,defaultWD:"/",callback:(I,S)=>I?j(I):$(S)})),transform:(k,$)=>new Promise((j,I)=>d.transform({callName:"transform",refs:null,input:k,options:$||{},isTTY:!1,fs:{readFile(S,V){V(new Error("Internal error"),null)},writeFile(S,V){V(null)}},callback:(S,V)=>S?I(S):j(V)})),formatMessages:(k,$)=>new Promise((j,I)=>d.formatMessages({callName:"formatMessages",refs:null,messages:k,options:$,callback:(S,V)=>S?I(S):j(V)})),analyzeMetafile:(k,$)=>new Promise((j,I)=>d.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof k=="string"?k:JSON.stringify(k),options:$,callback:(S,V)=>S?I(S):j(V)}))}},wt=Ee,vt="/smart-training/dev/assets/esbuild-g0v_c3-8.wasm";let Pe=!1,xe=null;function bt(){return Pe?Promise.resolve():(xe||(xe=Be({wasmURL:vt,worker:!1}).then(()=>{Pe=!0})),xe)}async function ue(e){return await bt(),(await Ve(e,{loader:"ts",target:"es2020"})).code}const xt=`
var __testResults = [];
var __lastActual;

function describe(_name, fn) {
  fn();
}

var it = function(name, fn) {
  __lastActual = undefined;
  try {
    fn();
    __testResults.push({ name: name, input: [], expected: undefined, actual: __lastActual, passed: true });
  } catch (err) {
    __testResults.push({
      name: name, input: [], expected: undefined, actual: __lastActual,
      passed: false, reason: err instanceof Error ? err.message : String(err)
    });
  }
};

it.each = function(cases) {
  return function(nameTemplate, fn) {
    cases.forEach(function(caseData) {
      var name = nameTemplate.replace(/\\$(\\w+)/g, function(_, key) {
        return caseData[key] !== undefined ? String(caseData[key]) : '';
      });
      __lastActual = undefined;
      try {
        fn(caseData);
        __testResults.push({
          name: name,
          input: caseData.input || [],
          expected: caseData.expected,
          actual: __lastActual,
          passed: true
        });
      } catch (err) {
        __testResults.push({
          name: name,
          input: caseData.input || [],
          expected: caseData.expected,
          actual: __lastActual,
          passed: false,
          reason: err instanceof Error ? err.message : String(err)
        });
      }
    });
  };
};

function __deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function __matchObject(actual, expected) {
  if (expected === null || typeof expected !== 'object') return actual === expected;
  if (actual === null || typeof actual !== 'object') return false;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    return expected.every(function(v, i) { return __matchObject(actual[i], v); });
  }
  return Object.keys(expected).every(function(key) {
    return __matchObject(actual[key], expected[key]);
  });
}

function expect(actual) {
  if (typeof actual !== 'function') {
    __lastActual = actual;
  }
  return {
    toBe: function(expected) {
      if (actual !== expected) throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    },
    toEqual: function(expected) {
      if (!__deepEqual(actual, expected)) throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    },
    toMatchObject: function(expected) {
      if (!__matchObject(actual, expected)) {
        var expKeys = Object.keys(expected);
        for (var i = 0; i < expKeys.length; i++) {
          var k = expKeys[i];
          if (!__matchObject(actual[k], expected[k])) {
            throw new Error('Property "' + k + '": expected ' + JSON.stringify(expected[k]) + ', got ' + JSON.stringify(actual[k]));
          }
        }
        throw new Error('Object mismatch');
      }
    },
    toHaveLength: function(n) {
      if (!actual || actual.length !== n) throw new Error('Expected length ' + n + ', got ' + (actual ? actual.length : 'undefined'));
    },
    toBeGreaterThan: function(n) {
      if (actual <= n) throw new Error('Expected ' + actual + ' to be greater than ' + n);
    },
    toThrow: function(msg) {
      var threw = false;
      var thrownMsg = '';
      try { actual(); } catch (err) {
        threw = true;
        thrownMsg = err instanceof Error ? err.message : String(err);
      }
      if (!threw) throw new Error('Expected function to throw');
      if (msg !== undefined && !thrownMsg.includes(String(msg))) {
        throw new Error('Expected to throw "' + msg + '", got "' + thrownMsg + '"');
      }
    }
  };
}
`;function ge(e){return e.replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm,"").replace(/^export\s+(const|let|var|function\*?|class)\s+/gm,"$1 ").replace(/^export\s+default\s+/gm,"var __default = ").trim()}function _t(e){return e.replace(/^import\s+.*from\s+['"]vitest['"].*$/gm,"").replace(/^import\s+.*from\s+['"]\.\/execute['"].*$/gm,"").replace(/^import\s+.*from\s+['"]\.\/testCases['"].*$/gm,"").trim()}const kt=`
var __consoleLogs = [];
function __serialize(a) {
  if (a === undefined) return 'undefined';
  if (a === null) return 'null';
  try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); }
}
var console = {
  log:   function() { __consoleLogs.push({ type: 'log',   args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  warn:  function() { __consoleLogs.push({ type: 'warn',  args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  error: function() { __consoleLogs.push({ type: 'error', args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
  info:  function() { __consoleLogs.push({ type: 'info',  args: Array.prototype.slice.call(arguments).map(__serialize).join(' ') }); },
};
`;self.onmessage=async e=>{try{const{type:n,code:r,constants:f}=e.data;if(n==="execute"){const I=ge(await ue(r));let S="";f&&(S=ge(await ue(f)));const V=[kt,S,I,"return __consoleLogs;"].join(`
`),x=new Function(V)();self.postMessage({type:"console-result",logs:x});return}if(n!=="run")return;const{testCode:g,testCases:p}=e.data,h=ge(await ue(r));let b="";f&&(b=ge(await ue(f)));const d=_t(await ue(g)),k=[xt,b,h,`var testCases = ${JSON.stringify(p)};`,d,"return __testResults;"].join(`
`),j=new Function(k)().map(I=>({name:I.name,input:I.input??[],expected:I.expected,actual:I.actual,passed:I.passed,reason:I.reason}));self.postMessage({type:"result",results:j})}catch(n){self.postMessage({type:"error",message:n instanceof Error?n.message:String(n)})}};
