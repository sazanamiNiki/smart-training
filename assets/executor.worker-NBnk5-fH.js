var Ye=Object.defineProperty,He=(e,n)=>{for(var r in n)Ye(e,r,{get:n[r],enumerable:!0})},ke={};He(ke,{analyzeMetafile:()=>ht,analyzeMetafileSync:()=>yt,build:()=>ut,buildSync:()=>mt,context:()=>ft,default:()=>bt,formatMessages:()=>dt,formatMessagesSync:()=>pt,initialize:()=>Be,stop:()=>wt,transform:()=>Ve,transformSync:()=>gt,version:()=>ct});function Ee(e){let n=c=>{if(c===null)r.write8(0);else if(typeof c=="boolean")r.write8(1),r.write8(+c);else if(typeof c=="number")r.write8(2),r.write32(c|0);else if(typeof c=="string")r.write8(3),r.write(ee(c));else if(c instanceof Uint8Array)r.write8(4),r.write(c);else if(c instanceof Array){r.write8(5),r.write32(c.length);for(let g of c)n(g)}else{let g=Object.keys(c);r.write8(6),r.write32(g.length);for(let p of g)r.write(ee(p)),n(c[p])}},r=new Ae;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),n(e.value),_e(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function Ke(e){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return ae(r.read());case 4:return r.read();case 5:{let h=r.read32(),b=[];for(let f=0;f<h;f++)b.push(n());return b}case 6:{let h=r.read32(),b={};for(let f=0;f<h;f++)b[ae(r.read())]=n();return b}default:throw new Error("Invalid packet")}},r=new Ae(e),c=r.read32(),g=(c&1)===0;c>>>=1;let p=n();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:c,isRequest:g,value:p}}var Ae=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let n=new Uint8Array((this.len+e)*2);n.set(this.buf),this.buf=n}return this.len+=e,this.len-e}write8(e){let n=this._write(1);this.buf[n]=e}write32(e){let n=this._write(4);_e(this.buf,e,n)}write(e){let n=this._write(4+e.length);_e(this.buf,e.length,n),this.buf.set(e,n+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return De(this.buf,this._read(4))}read(){let e=this.read32(),n=new Uint8Array(e),r=this._read(n.length);return n.set(this.buf.subarray(r,r+e)),n}},ee,ae,xe;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,n=new TextDecoder;ee=r=>e.encode(r),ae=r=>n.decode(r),xe='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ee=e=>Buffer.from(e),ae=e=>{let{buffer:n,byteOffset:r,byteLength:c}=e;return Buffer.from(n,r,c).toString()},xe='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ee("")instanceof Uint8Array))throw new Error(`Invariant violation: "${xe} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function De(e,n){return e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24}function _e(e,n,r){e[r++]=n,e[r++]=n>>8,e[r++]=n>>16,e[r++]=n>>24}var H=JSON.stringify,Se="warning",Te="silent";function $e(e){if(Y(e,"target"),e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var ge=()=>null,z=e=>typeof e=="boolean"?null:"a boolean",x=e=>typeof e=="string"?null:"a string",pe=e=>e instanceof RegExp?null:"a RegExp object",ie=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Re=e=>typeof e=="function"?null:"a function",J=e=>Array.isArray(e)?null:"an array",Z=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",Qe=e=>typeof e=="object"&&e!==null?null:"an array or an object",Xe=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",je=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",Ue=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",Ze=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",et=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",Ie=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",tt=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function i(e,n,r,c){let g=e[r];if(n[r+""]=!0,g===void 0)return;let p=c(g);if(p!==null)throw new Error(`${H(r)} must be ${p}`);return g}function G(e,n,r){for(let c in e)if(!(c in n))throw new Error(`Invalid option ${r}: ${H(c)}`)}function nt(e){let n=Object.create(null),r=i(e,n,"wasmURL",tt),c=i(e,n,"wasmModule",Xe),g=i(e,n,"worker",z);return G(e,n,"in initialize() call"),{wasmURL:r,wasmModule:c,worker:g}}function Me(e){let n;if(e!==void 0){n=Object.create(null);for(let r in e){let c=e[r];if(typeof c=="string"||c===!1)n[r]=c;else throw new Error(`Expected ${H(r)} in mangle cache to map to either a string or false`)}}return n}function ve(e,n,r,c,g){let p=i(n,r,"color",z),h=i(n,r,"logLevel",x),b=i(n,r,"logLimit",ie);p!==void 0?e.push(`--color=${p}`):c&&e.push("--color=true"),e.push(`--log-level=${h||g}`),e.push(`--log-limit=${b||0}`)}function Y(e,n,r){if(typeof e!="string")throw new Error(`Expected value for ${n}${r!==void 0?" "+H(r):""} to be a string, got ${typeof e} instead`);return e}function Ne(e,n,r){let c=i(n,r,"legalComments",x),g=i(n,r,"sourceRoot",x),p=i(n,r,"sourcesContent",z),h=i(n,r,"target",et),b=i(n,r,"format",x),f=i(n,r,"globalName",x),E=i(n,r,"mangleProps",pe),$=i(n,r,"reserveProps",pe),j=i(n,r,"mangleQuoted",z),F=i(n,r,"minify",z),T=i(n,r,"minifySyntax",z),B=i(n,r,"minifyWhitespace",z),_=i(n,r,"minifyIdentifiers",z),C=i(n,r,"lineLimit",ie),N=i(n,r,"drop",J),P=i(n,r,"dropLabels",J),d=i(n,r,"charset",x),l=i(n,r,"treeShaking",z),a=i(n,r,"ignoreAnnotations",z),o=i(n,r,"jsx",x),y=i(n,r,"jsxFactory",x),v=i(n,r,"jsxFragment",x),S=i(n,r,"jsxImportSource",x),t=i(n,r,"jsxDev",z),s=i(n,r,"jsxSideEffects",z),u=i(n,r,"define",Z),m=i(n,r,"logOverride",Z),k=i(n,r,"supported",Z),M=i(n,r,"pure",J),R=i(n,r,"keepNames",z),D=i(n,r,"platform",x),I=i(n,r,"tsconfigRaw",Ze);if(c&&e.push(`--legal-comments=${c}`),g!==void 0&&e.push(`--source-root=${g}`),p!==void 0&&e.push(`--sources-content=${p}`),h&&(Array.isArray(h)?e.push(`--target=${Array.from(h).map($e).join(",")}`):e.push(`--target=${$e(h)}`)),b&&e.push(`--format=${b}`),f&&e.push(`--global-name=${f}`),D&&e.push(`--platform=${D}`),I&&e.push(`--tsconfig-raw=${typeof I=="string"?I:JSON.stringify(I)}`),F&&e.push("--minify"),T&&e.push("--minify-syntax"),B&&e.push("--minify-whitespace"),_&&e.push("--minify-identifiers"),C&&e.push(`--line-limit=${C}`),d&&e.push(`--charset=${d}`),l!==void 0&&e.push(`--tree-shaking=${l}`),a&&e.push("--ignore-annotations"),N)for(let A of N)e.push(`--drop:${Y(A,"drop")}`);if(P&&e.push(`--drop-labels=${Array.from(P).map(A=>Y(A,"dropLabels")).join(",")}`),E&&e.push(`--mangle-props=${E.source}`),$&&e.push(`--reserve-props=${$.source}`),j!==void 0&&e.push(`--mangle-quoted=${j}`),o&&e.push(`--jsx=${o}`),y&&e.push(`--jsx-factory=${y}`),v&&e.push(`--jsx-fragment=${v}`),S&&e.push(`--jsx-import-source=${S}`),t&&e.push("--jsx-dev"),s&&e.push("--jsx-side-effects"),u)for(let A in u){if(A.indexOf("=")>=0)throw new Error(`Invalid define: ${A}`);e.push(`--define:${A}=${Y(u[A],"define",A)}`)}if(m)for(let A in m){if(A.indexOf("=")>=0)throw new Error(`Invalid log override: ${A}`);e.push(`--log-override:${A}=${Y(m[A],"log override",A)}`)}if(k)for(let A in k){if(A.indexOf("=")>=0)throw new Error(`Invalid supported: ${A}`);const O=k[A];if(typeof O!="boolean")throw new Error(`Expected value for supported ${H(A)} to be a boolean, got ${typeof O} instead`);e.push(`--supported:${A}=${O}`)}if(M)for(let A of M)e.push(`--pure:${Y(A,"pure")}`);R&&e.push("--keep-names")}function rt(e,n,r,c,g){var p;let h=[],b=[],f=Object.create(null),E=null,$=null;ve(h,n,f,r,c),Ne(h,n,f);let j=i(n,f,"sourcemap",Ue),F=i(n,f,"bundle",z),T=i(n,f,"splitting",z),B=i(n,f,"preserveSymlinks",z),_=i(n,f,"metafile",z),C=i(n,f,"outfile",x),N=i(n,f,"outdir",x),P=i(n,f,"outbase",x),d=i(n,f,"tsconfig",x),l=i(n,f,"resolveExtensions",J),a=i(n,f,"nodePaths",J),o=i(n,f,"mainFields",J),y=i(n,f,"conditions",J),v=i(n,f,"external",J),S=i(n,f,"packages",x),t=i(n,f,"alias",Z),s=i(n,f,"loader",Z),u=i(n,f,"outExtension",Z),m=i(n,f,"publicPath",x),k=i(n,f,"entryNames",x),M=i(n,f,"chunkNames",x),R=i(n,f,"assetNames",x),D=i(n,f,"inject",J),I=i(n,f,"banner",Z),A=i(n,f,"footer",Z),O=i(n,f,"entryPoints",Qe),L=i(n,f,"absWorkingDir",x),U=i(n,f,"stdin",Z),V=(p=i(n,f,"write",z))!=null?p:g,q=i(n,f,"allowOverwrite",z),Q=i(n,f,"mangleCache",Z);if(f.plugins=!0,G(n,f,`in ${e}() call`),j&&h.push(`--sourcemap${j===!0?"":`=${j}`}`),F&&h.push("--bundle"),q&&h.push("--allow-overwrite"),T&&h.push("--splitting"),B&&h.push("--preserve-symlinks"),_&&h.push("--metafile"),C&&h.push(`--outfile=${C}`),N&&h.push(`--outdir=${N}`),P&&h.push(`--outbase=${P}`),d&&h.push(`--tsconfig=${d}`),S&&h.push(`--packages=${S}`),l){let w=[];for(let W of l){if(Y(W,"resolve extension"),W.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${W}`);w.push(W)}h.push(`--resolve-extensions=${w.join(",")}`)}if(m&&h.push(`--public-path=${m}`),k&&h.push(`--entry-names=${k}`),M&&h.push(`--chunk-names=${M}`),R&&h.push(`--asset-names=${R}`),o){let w=[];for(let W of o){if(Y(W,"main field"),W.indexOf(",")>=0)throw new Error(`Invalid main field: ${W}`);w.push(W)}h.push(`--main-fields=${w.join(",")}`)}if(y){let w=[];for(let W of y){if(Y(W,"condition"),W.indexOf(",")>=0)throw new Error(`Invalid condition: ${W}`);w.push(W)}h.push(`--conditions=${w.join(",")}`)}if(v)for(let w of v)h.push(`--external:${Y(w,"external")}`);if(t)for(let w in t){if(w.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${w}`);h.push(`--alias:${w}=${Y(t[w],"alias",w)}`)}if(I)for(let w in I){if(w.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${w}`);h.push(`--banner:${w}=${Y(I[w],"banner",w)}`)}if(A)for(let w in A){if(w.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${w}`);h.push(`--footer:${w}=${Y(A[w],"footer",w)}`)}if(D)for(let w of D)h.push(`--inject:${Y(w,"inject")}`);if(s)for(let w in s){if(w.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${w}`);h.push(`--loader:${w}=${Y(s[w],"loader",w)}`)}if(u)for(let w in u){if(w.indexOf("=")>=0)throw new Error(`Invalid out extension: ${w}`);h.push(`--out-extension:${w}=${Y(u[w],"out extension",w)}`)}if(O)if(Array.isArray(O))for(let w=0,W=O.length;w<W;w++){let X=O[w];if(typeof X=="object"&&X!==null){let te=Object.create(null),K=i(X,te,"in",x),ce=i(X,te,"out",x);if(G(X,te,"in entry point at index "+w),K===void 0)throw new Error('Missing property "in" for entry point at index '+w);if(ce===void 0)throw new Error('Missing property "out" for entry point at index '+w);b.push([ce,K])}else b.push(["",Y(X,"entry point at index "+w)])}else for(let w in O)b.push([w,Y(O[w],"entry point",w)]);if(U){let w=Object.create(null),W=i(U,w,"contents",Ie),X=i(U,w,"resolveDir",x),te=i(U,w,"sourcefile",x),K=i(U,w,"loader",x);G(U,w,'in "stdin" object'),te&&h.push(`--sourcefile=${te}`),K&&h.push(`--loader=${K}`),X&&($=X),typeof W=="string"?E=ee(W):W instanceof Uint8Array&&(E=W)}let le=[];if(a)for(let w of a)w+="",le.push(w);return{entries:b,flags:h,write:V,stdinContents:E,stdinResolveDir:$,absWorkingDir:L,nodePaths:le,mangleCache:Me(Q)}}function st(e,n,r,c){let g=[],p=Object.create(null);ve(g,n,p,r,c),Ne(g,n,p);let h=i(n,p,"sourcemap",Ue),b=i(n,p,"sourcefile",x),f=i(n,p,"loader",x),E=i(n,p,"banner",x),$=i(n,p,"footer",x),j=i(n,p,"mangleCache",Z);return G(n,p,`in ${e}() call`),h&&g.push(`--sourcemap=${h===!0?"external":h}`),b&&g.push(`--sourcefile=${b}`),f&&g.push(`--loader=${f}`),E&&g.push(`--banner=${E}`),$&&g.push(`--footer=${$}`),{flags:g,mangleCache:Me(j)}}function it(e){const n={},r={didClose:!1,reason:""};let c={},g=0,p=0,h=new Uint8Array(16*1024),b=0,f=d=>{let l=b+d.length;if(l>h.length){let o=new Uint8Array(l*2);o.set(h),h=o}h.set(d,b),b+=d.length;let a=0;for(;a+4<=b;){let o=De(h,a);if(a+4+o>b)break;a+=4,B(h.subarray(a,a+o)),a+=o}a>0&&(h.copyWithin(0,a,b),b-=a)},E=d=>{r.didClose=!0,d&&(r.reason=": "+(d.message||d));const l="The service was stopped"+r.reason;for(let a in c)c[a](l,null);c={}},$=(d,l,a)=>{if(r.didClose)return a("The service is no longer running"+r.reason,null);let o=g++;c[o]=(y,v)=>{try{a(y,v)}finally{d&&d.unref()}},d&&d.ref(),e.writeToStdin(Ee({id:o,isRequest:!0,value:l}))},j=(d,l)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(Ee({id:d,isRequest:!1,value:l}))},F=async(d,l)=>{try{if(l.command==="ping"){j(d,{});return}if(typeof l.key=="number"){const a=n[l.key];if(!a)return;const o=a[l.command];if(o){await o(d,l);return}}throw new Error("Invalid command: "+l.command)}catch(a){const o=[se(a,e,null,void 0,"")];try{j(d,{errors:o})}catch{}}},T=!0,B=d=>{if(T){T=!1;let a=String.fromCharCode(...d);if(a!=="0.20.2")throw new Error(`Cannot start service: Host version "0.20.2" does not match binary version ${H(a)}`);return}let l=Ke(d);if(l.isRequest)F(l.id,l.value);else{let a=c[l.id];delete c[l.id],l.value.error?a(l.value.error,{}):a(null,l.value)}};return{readFromStdout:f,afterClose:E,service:{buildOrContext:({callName:d,refs:l,options:a,isTTY:o,defaultWD:y,callback:v})=>{let S=0;const t=p++,s={},u={ref(){++S===1&&l&&l.ref()},unref(){--S===0&&(delete n[t],l&&l.unref())}};n[t]=s,u.ref(),lt(d,t,$,j,u,e,s,a,o,y,(m,k)=>{try{v(m,k)}finally{u.unref()}})},transform:({callName:d,refs:l,input:a,options:o,isTTY:y,fs:v,callback:S})=>{const t=Fe();let s=u=>{try{if(typeof a!="string"&&!(a instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:m,mangleCache:k}=st(d,o,y,Te),M={command:"transform",flags:m,inputFS:u!==null,input:u!==null?ee(u):typeof a=="string"?ee(a):a};k&&(M.mangleCache=k),$(l,M,(R,D)=>{if(R)return S(new Error(R),null);let I=oe(D.errors,t),A=oe(D.warnings,t),O=1,L=()=>{if(--O===0){let U={warnings:A,code:D.code,map:D.map,mangleCache:void 0,legalComments:void 0};"legalComments"in D&&(U.legalComments=D==null?void 0:D.legalComments),D.mangleCache&&(U.mangleCache=D==null?void 0:D.mangleCache),S(null,U)}};if(I.length>0)return S(fe("Transform failed",I,A),null);D.codeFS&&(O++,v.readFile(D.code,(U,V)=>{U!==null?S(U,null):(D.code=V,L())})),D.mapFS&&(O++,v.readFile(D.map,(U,V)=>{U!==null?S(U,null):(D.map=V,L())})),L()})}catch(m){let k=[];try{ve(k,o,{},y,Te)}catch{}const M=se(m,e,t,void 0,"");$(l,{command:"error",flags:k,error:M},()=>{M.detail=t.load(M.detail),S(fe("Transform failed",[M],[]),null)})}};if((typeof a=="string"||a instanceof Uint8Array)&&a.length>1024*1024){let u=s;s=()=>v.writeFile(a,u)}s(null)},formatMessages:({callName:d,refs:l,messages:a,options:o,callback:y})=>{if(!o)throw new Error(`Missing second argument in ${d}() call`);let v={},S=i(o,v,"kind",x),t=i(o,v,"color",z),s=i(o,v,"terminalWidth",ie);if(G(o,v,`in ${d}() call`),S===void 0)throw new Error(`Missing "kind" in ${d}() call`);if(S!=="error"&&S!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${d}() call`);let u={command:"format-msgs",messages:ne(a,"messages",null,"",s),isWarning:S==="warning"};t!==void 0&&(u.color=t),s!==void 0&&(u.terminalWidth=s),$(l,u,(m,k)=>{if(m)return y(new Error(m),null);y(null,k.messages)})},analyzeMetafile:({callName:d,refs:l,metafile:a,options:o,callback:y})=>{o===void 0&&(o={});let v={},S=i(o,v,"color",z),t=i(o,v,"verbose",z);G(o,v,`in ${d}() call`);let s={command:"analyze-metafile",metafile:a};S!==void 0&&(s.color=S),t!==void 0&&(s.verbose=t),$(l,s,(u,m)=>{if(u)return y(new Error(u),null);y(null,m.result)})}}}}function lt(e,n,r,c,g,p,h,b,f,E,$){const j=Fe(),F=e==="context",T=(C,N)=>{const P=[];try{ve(P,b,{},f,Se)}catch{}const d=se(C,p,j,void 0,N);r(g,{command:"error",flags:P,error:d},()=>{d.detail=j.load(d.detail),$(fe(F?"Context failed":"Build failed",[d],[]),null)})};let B;if(typeof b=="object"){const C=b.plugins;if(C!==void 0){if(!Array.isArray(C))return T(new Error('"plugins" must be an array'),"");B=C}}if(B&&B.length>0){if(p.isSync)return T(new Error("Cannot use plugins in synchronous API calls"),"");at(n,r,c,g,p,h,b,B,j).then(C=>{if(!C.ok)return T(C.error,C.pluginName);try{_(C.requestPlugins,C.runOnEndCallbacks,C.scheduleOnDisposeCallbacks)}catch(N){T(N,"")}},C=>T(C,""));return}try{_(null,(C,N)=>N([],[]),()=>{})}catch(C){T(C,"")}function _(C,N,P){const d=p.hasFS,{entries:l,flags:a,write:o,stdinContents:y,stdinResolveDir:v,absWorkingDir:S,nodePaths:t,mangleCache:s}=rt(e,b,f,Se,d);if(o&&!p.hasFS)throw new Error('The "write" option is unavailable in this environment');const u={command:"build",key:n,entries:l,flags:a,write:o,stdinContents:y,stdinResolveDir:v,absWorkingDir:S||E,nodePaths:t,context:F};C&&(u.plugins=C),s&&(u.mangleCache=s);const m=(R,D)=>{const I={errors:oe(R.errors,j),warnings:oe(R.warnings,j),outputFiles:void 0,metafile:void 0,mangleCache:void 0},A=I.errors.slice(),O=I.warnings.slice();R.outputFiles&&(I.outputFiles=R.outputFiles.map(ot)),R.metafile&&(I.metafile=JSON.parse(R.metafile)),R.mangleCache&&(I.mangleCache=R.mangleCache),R.writeToStdout!==void 0&&console.log(ae(R.writeToStdout).replace(/\n$/,"")),N(I,(L,U)=>{if(A.length>0||L.length>0){const V=fe("Build failed",A.concat(L),O.concat(U));return D(V,null,L,U)}D(null,I,L,U)})};let k,M;F&&(h["on-end"]=(R,D)=>new Promise(I=>{m(D,(A,O,L,U)=>{const V={errors:L,warnings:U};M&&M(A,O),k=void 0,M=void 0,c(R,V),I()})})),r(g,u,(R,D)=>{if(R)return $(new Error(R),null);if(!F)return m(D,(O,L)=>(P(),$(O,L)));if(D.errors.length>0)return $(fe("Context failed",D.errors,D.warnings),null);let I=!1;const A={rebuild:()=>(k||(k=new Promise((O,L)=>{let U;M=(q,Q)=>{U||(U=()=>q?L(q):O(Q))};const V=()=>{r(g,{command:"rebuild",key:n},(Q,le)=>{Q?L(new Error(Q)):U?U():V()})};V()})),k),watch:(O={})=>new Promise((L,U)=>{if(!p.hasFS)throw new Error('Cannot use the "watch" API in this environment');G(O,{},"in watch() call"),r(g,{command:"watch",key:n},Q=>{Q?U(new Error(Q)):L(void 0)})}),serve:(O={})=>new Promise((L,U)=>{if(!p.hasFS)throw new Error('Cannot use the "serve" API in this environment');const V={},q=i(O,V,"port",ie),Q=i(O,V,"host",x),le=i(O,V,"servedir",x),w=i(O,V,"keyfile",x),W=i(O,V,"certfile",x),X=i(O,V,"fallback",x),te=i(O,V,"onRequest",Re);G(O,V,"in serve() call");const K={command:"serve",key:n,onRequest:!!te};q!==void 0&&(K.port=q),Q!==void 0&&(K.host=Q),le!==void 0&&(K.servedir=le),w!==void 0&&(K.keyfile=w),W!==void 0&&(K.certfile=W),X!==void 0&&(K.fallback=X),r(g,K,(ce,Je)=>{if(ce)return U(new Error(ce));te&&(h["serve-request"]=(Ge,qe)=>{te(qe.args),c(Ge,{})}),L(Je)})}),cancel:()=>new Promise(O=>{if(I)return O();r(g,{command:"cancel",key:n},()=>{O()})}),dispose:()=>new Promise(O=>{if(I)return O();I=!0,r(g,{command:"dispose",key:n},()=>{O(),P(),g.unref()})})};g.ref(),$(null,A)})}}var at=async(e,n,r,c,g,p,h,b,f)=>{let E=[],$=[],j={},F={},T=[],B=0,_=0,C=[],N=!1;b=[...b];for(let l of b){let a={};if(typeof l!="object")throw new Error(`Plugin at index ${_} must be an object`);const o=i(l,a,"name",x);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${_} is missing a name`);try{let y=i(l,a,"setup",Re);if(typeof y!="function")throw new Error("Plugin is missing a setup function");G(l,a,`on plugin ${H(o)}`);let v={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};_++;let t=y({initialOptions:h,resolve:(s,u={})=>{if(!N)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof s!="string")throw new Error("The path to resolve must be a string");let m=Object.create(null),k=i(u,m,"pluginName",x),M=i(u,m,"importer",x),R=i(u,m,"namespace",x),D=i(u,m,"resolveDir",x),I=i(u,m,"kind",x),A=i(u,m,"pluginData",ge);return G(u,m,"in resolve() call"),new Promise((O,L)=>{const U={command:"resolve",path:s,key:e,pluginName:o};if(k!=null&&(U.pluginName=k),M!=null&&(U.importer=M),R!=null&&(U.namespace=R),D!=null&&(U.resolveDir=D),I!=null)U.kind=I;else throw new Error('Must specify "kind" when calling "resolve"');A!=null&&(U.pluginData=f.store(A)),n(c,U,(V,q)=>{V!==null?L(new Error(V)):O({errors:oe(q.errors,f),warnings:oe(q.warnings,f),path:q.path,external:q.external,sideEffects:q.sideEffects,namespace:q.namespace,suffix:q.suffix,pluginData:f.load(q.pluginData)})})})},onStart(s){let u='This error came from the "onStart" callback registered here:',m=he(new Error(u),g,"onStart");E.push({name:o,callback:s,note:m}),v.onStart=!0},onEnd(s){let u='This error came from the "onEnd" callback registered here:',m=he(new Error(u),g,"onEnd");$.push({name:o,callback:s,note:m}),v.onEnd=!0},onResolve(s,u){let m='This error came from the "onResolve" callback registered here:',k=he(new Error(m),g,"onResolve"),M={},R=i(s,M,"filter",pe),D=i(s,M,"namespace",x);if(G(s,M,`in onResolve() call for plugin ${H(o)}`),R==null)throw new Error("onResolve() call is missing a filter");let I=B++;j[I]={name:o,callback:u,note:k},v.onResolve.push({id:I,filter:R.source,namespace:D||""})},onLoad(s,u){let m='This error came from the "onLoad" callback registered here:',k=he(new Error(m),g,"onLoad"),M={},R=i(s,M,"filter",pe),D=i(s,M,"namespace",x);if(G(s,M,`in onLoad() call for plugin ${H(o)}`),R==null)throw new Error("onLoad() call is missing a filter");let I=B++;F[I]={name:o,callback:u,note:k},v.onLoad.push({id:I,filter:R.source,namespace:D||""})},onDispose(s){T.push(s)},esbuild:g.esbuild});t&&await t,C.push(v)}catch(y){return{ok:!1,error:y,pluginName:o}}}p["on-start"]=async(l,a)=>{let o={errors:[],warnings:[]};await Promise.all(E.map(async({name:y,callback:v,note:S})=>{try{let t=await v();if(t!=null){if(typeof t!="object")throw new Error(`Expected onStart() callback in plugin ${H(y)} to return an object`);let s={},u=i(t,s,"errors",J),m=i(t,s,"warnings",J);G(t,s,`from onStart() callback in plugin ${H(y)}`),u!=null&&o.errors.push(...ne(u,"errors",f,y,void 0)),m!=null&&o.warnings.push(...ne(m,"warnings",f,y,void 0))}}catch(t){o.errors.push(se(t,g,f,S&&S(),y))}})),r(l,o)},p["on-resolve"]=async(l,a)=>{let o={},y="",v,S;for(let t of a.ids)try{({name:y,callback:v,note:S}=j[t]);let s=await v({path:a.path,importer:a.importer,namespace:a.namespace,resolveDir:a.resolveDir,kind:a.kind,pluginData:f.load(a.pluginData)});if(s!=null){if(typeof s!="object")throw new Error(`Expected onResolve() callback in plugin ${H(y)} to return an object`);let u={},m=i(s,u,"pluginName",x),k=i(s,u,"path",x),M=i(s,u,"namespace",x),R=i(s,u,"suffix",x),D=i(s,u,"external",z),I=i(s,u,"sideEffects",z),A=i(s,u,"pluginData",ge),O=i(s,u,"errors",J),L=i(s,u,"warnings",J),U=i(s,u,"watchFiles",J),V=i(s,u,"watchDirs",J);G(s,u,`from onResolve() callback in plugin ${H(y)}`),o.id=t,m!=null&&(o.pluginName=m),k!=null&&(o.path=k),M!=null&&(o.namespace=M),R!=null&&(o.suffix=R),D!=null&&(o.external=D),I!=null&&(o.sideEffects=I),A!=null&&(o.pluginData=f.store(A)),O!=null&&(o.errors=ne(O,"errors",f,y,void 0)),L!=null&&(o.warnings=ne(L,"warnings",f,y,void 0)),U!=null&&(o.watchFiles=me(U,"watchFiles")),V!=null&&(o.watchDirs=me(V,"watchDirs"));break}}catch(s){o={id:t,errors:[se(s,g,f,S&&S(),y)]};break}r(l,o)},p["on-load"]=async(l,a)=>{let o={},y="",v,S;for(let t of a.ids)try{({name:y,callback:v,note:S}=F[t]);let s=await v({path:a.path,namespace:a.namespace,suffix:a.suffix,pluginData:f.load(a.pluginData),with:a.with});if(s!=null){if(typeof s!="object")throw new Error(`Expected onLoad() callback in plugin ${H(y)} to return an object`);let u={},m=i(s,u,"pluginName",x),k=i(s,u,"contents",Ie),M=i(s,u,"resolveDir",x),R=i(s,u,"pluginData",ge),D=i(s,u,"loader",x),I=i(s,u,"errors",J),A=i(s,u,"warnings",J),O=i(s,u,"watchFiles",J),L=i(s,u,"watchDirs",J);G(s,u,`from onLoad() callback in plugin ${H(y)}`),o.id=t,m!=null&&(o.pluginName=m),k instanceof Uint8Array?o.contents=k:k!=null&&(o.contents=ee(k)),M!=null&&(o.resolveDir=M),R!=null&&(o.pluginData=f.store(R)),D!=null&&(o.loader=D),I!=null&&(o.errors=ne(I,"errors",f,y,void 0)),A!=null&&(o.warnings=ne(A,"warnings",f,y,void 0)),O!=null&&(o.watchFiles=me(O,"watchFiles")),L!=null&&(o.watchDirs=me(L,"watchDirs"));break}}catch(s){o={id:t,errors:[se(s,g,f,S&&S(),y)]};break}r(l,o)};let P=(l,a)=>a([],[]);$.length>0&&(P=(l,a)=>{(async()=>{const o=[],y=[];for(const{name:v,callback:S,note:t}of $){let s,u;try{const m=await S(l);if(m!=null){if(typeof m!="object")throw new Error(`Expected onEnd() callback in plugin ${H(v)} to return an object`);let k={},M=i(m,k,"errors",J),R=i(m,k,"warnings",J);G(m,k,`from onEnd() callback in plugin ${H(v)}`),M!=null&&(s=ne(M,"errors",f,v,void 0)),R!=null&&(u=ne(R,"warnings",f,v,void 0))}}catch(m){s=[se(m,g,f,t&&t(),v)]}if(s){o.push(...s);try{l.errors.push(...s)}catch{}}if(u){y.push(...u);try{l.warnings.push(...u)}catch{}}}a(o,y)})()});let d=()=>{for(const l of T)setTimeout(()=>l(),0)};return N=!0,{ok:!0,requestPlugins:C,runOnEndCallbacks:P,scheduleOnDisposeCallbacks:d}};function Fe(){const e=new Map;let n=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const c=n++;return e.set(c,r),c}}}function he(e,n,r){let c,g=!1;return()=>{if(g)return c;g=!0;try{let p=(e.stack+"").split(`
`);p.splice(1,1);let h=Le(n,p,r);if(h)return c={text:e.message,location:h},c}catch{}}}function se(e,n,r,c,g){let p="Internal error",h=null;try{p=(e&&e.message||e)+""}catch{}try{h=Le(n,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:g,text:p,location:h,notes:c?[c]:[],detail:r?r.store(e):-1}}function Le(e,n,r){let c="    at ";if(e.readFileSync&&!n[0].startsWith(c)&&n[1].startsWith(c))for(let g=1;g<n.length;g++){let p=n[g];if(p.startsWith(c))for(p=p.slice(c.length);;){let h=/^(?:new |async )?\S+ \((.*)\)$/.exec(p);if(h){p=h[1];continue}if(h=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(p),h){p=h[1];continue}if(h=/^(\S+):(\d+):(\d+)$/.exec(p),h){let b;try{b=e.readFileSync(h[1],"utf8")}catch{break}let f=b.split(/\r\n|\r|\n|\u2028|\u2029/)[+h[2]-1]||"",E=+h[3]-1,$=f.slice(E,E+r.length)===r?r.length:0;return{file:h[1],namespace:"file",line:+h[2],column:ee(f.slice(0,E)).length,length:ee(f.slice(E,E+$)).length,lineText:f+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function fe(e,n,r){let c=5;e+=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,c+1).map((p,h)=>{if(h===c)return`
...`;if(!p.location)return`
error: ${p.text}`;let{file:b,line:f,column:E}=p.location,$=p.pluginName?`[plugin: ${p.pluginName}] `:"";return`
${b}:${f}:${E}: ERROR: ${$}${p.text}`}).join("");let g=new Error(e);for(const[p,h]of[["errors",n],["warnings",r]])Object.defineProperty(g,p,{configurable:!0,enumerable:!0,get:()=>h,set:b=>Object.defineProperty(g,p,{configurable:!0,enumerable:!0,value:b})});return g}function oe(e,n){for(const r of e)r.detail=n.load(r.detail);return e}function Oe(e,n,r){if(e==null)return null;let c={},g=i(e,c,"file",x),p=i(e,c,"namespace",x),h=i(e,c,"line",ie),b=i(e,c,"column",ie),f=i(e,c,"length",ie),E=i(e,c,"lineText",x),$=i(e,c,"suggestion",x);if(G(e,c,n),E){const j=E.slice(0,(b&&b>0?b:0)+(f&&f>0?f:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(j)&&!/\n/.test(E)&&(E=j)}return{file:g||"",namespace:p||"",line:h||0,column:b||0,length:f||0,lineText:E||"",suggestion:$||""}}function ne(e,n,r,c,g){let p=[],h=0;for(const b of e){let f={},E=i(b,f,"id",x),$=i(b,f,"pluginName",x),j=i(b,f,"text",x),F=i(b,f,"location",je),T=i(b,f,"notes",J),B=i(b,f,"detail",ge),_=`in element ${h} of "${n}"`;G(b,f,_);let C=[];if(T)for(const N of T){let P={},d=i(N,P,"text",x),l=i(N,P,"location",je);G(N,P,_),C.push({text:d||"",location:Oe(l,_,g)})}p.push({id:E||"",pluginName:$||c,text:j||"",location:Oe(F,_,g),notes:C,detail:r?r.store(B):-1}),h++}return p}function me(e,n){const r=[];for(const c of e){if(typeof c!="string")throw new Error(`${H(n)} must be an array of strings`);r.push(c)}return r}function ot({path:e,contents:n,hash:r}){let c=null;return{path:e,contents:n,hash:r,get text(){const g=this.contents;return(c===null||g!==n)&&(n=g,c=ae(g)),c}}}var ct="0.20.2",ut=e=>de().build(e),ft=e=>de().context(e),Ve=(e,n)=>de().transform(e,n),dt=(e,n)=>de().formatMessages(e,n),ht=(e,n)=>de().analyzeMetafile(e,n),mt=()=>{throw new Error('The "buildSync" API only works in node')},gt=()=>{throw new Error('The "transformSync" API only works in node')},pt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},yt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},wt=()=>(ye&&ye(),Promise.resolve()),re,ye,we,de=()=>{if(we)return we;throw re?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Be=e=>{e=nt(e||{});let n=e.wasmURL,r=e.wasmModule,c=e.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(re)throw new Error('Cannot call "initialize" more than once');return re=vt(n||"",r,c),re.catch(()=>{re=void 0}),re},vt=async(e,n,r)=>{let c;if(r){let E=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});c=new Worker(URL.createObjectURL(E))}else{let E=(j=>{let F,T={};for(let _=self;_;_=Object.getPrototypeOf(_))for(let C of Object.getOwnPropertyNames(_))C in T||Object.defineProperty(T,C,{get:()=>self[C]});(()=>{const _=()=>{const P=new Error("not implemented");return P.code="ENOSYS",P};if(!T.fs){let P="";T.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(d,l){P+=N.decode(l);const a=P.lastIndexOf(`
`);return a!=-1&&(console.log(P.substring(0,a)),P=P.substring(a+1)),l.length},write(d,l,a,o,y,v){if(a!==0||o!==l.length||y!==null){v(_());return}const S=this.writeSync(d,l);v(null,S)},chmod(d,l,a){a(_())},chown(d,l,a,o){o(_())},close(d,l){l(_())},fchmod(d,l,a){a(_())},fchown(d,l,a,o){o(_())},fstat(d,l){l(_())},fsync(d,l){l(null)},ftruncate(d,l,a){a(_())},lchown(d,l,a,o){o(_())},link(d,l,a){a(_())},lstat(d,l){l(_())},mkdir(d,l,a){a(_())},open(d,l,a,o){o(_())},read(d,l,a,o,y,v){v(_())},readdir(d,l){l(_())},readlink(d,l){l(_())},rename(d,l,a){a(_())},rmdir(d,l){l(_())},stat(d,l){l(_())},symlink(d,l,a){a(_())},truncate(d,l,a){a(_())},unlink(d,l){l(_())},utimes(d,l,a,o){o(_())}}}if(T.process||(T.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw _()},pid:-1,ppid:-1,umask(){throw _()},cwd(){throw _()},chdir(){throw _()}}),!T.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!T.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!T.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!T.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const C=new TextEncoder("utf-8"),N=new TextDecoder("utf-8");T.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const P=(t,s)=>{this.mem.setUint32(t+0,s,!0),this.mem.setUint32(t+4,Math.floor(s/4294967296),!0)},d=t=>{const s=this.mem.getUint32(t+0,!0),u=this.mem.getInt32(t+4,!0);return s+u*4294967296},l=t=>{const s=this.mem.getFloat64(t,!0);if(s===0)return;if(!isNaN(s))return s;const u=this.mem.getUint32(t,!0);return this._values[u]},a=(t,s)=>{if(typeof s=="number"&&s!==0){if(isNaN(s)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,s,!0);return}if(s===void 0){this.mem.setFloat64(t,0,!0);return}let m=this._ids.get(s);m===void 0&&(m=this._idPool.pop(),m===void 0&&(m=this._values.length),this._values[m]=s,this._goRefCounts[m]=0,this._ids.set(s,m)),this._goRefCounts[m]++;let k=0;switch(typeof s){case"object":s!==null&&(k=1);break;case"string":k=2;break;case"symbol":k=3;break;case"function":k=4;break}this.mem.setUint32(t+4,2146959360|k,!0),this.mem.setUint32(t,m,!0)},o=t=>{const s=d(t+0),u=d(t+8);return new Uint8Array(this._inst.exports.mem.buffer,s,u)},y=t=>{const s=d(t+0),u=d(t+8),m=new Array(u);for(let k=0;k<u;k++)m[k]=l(s+k*8);return m},v=t=>{const s=d(t+0),u=d(t+8);return N.decode(new DataView(this._inst.exports.mem.buffer,s,u))},S=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const s=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(s)},"runtime.wasmWrite":t=>{t>>>=0;const s=d(t+8),u=d(t+16),m=this.mem.getInt32(t+24,!0);T.fs.writeSync(s,new Uint8Array(this._inst.exports.mem.buffer,u,m))},"runtime.resetMemoryDataView":t=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,P(t+8,(S+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const s=new Date().getTime();P(t+8,s/1e3),this.mem.setInt32(t+16,s%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const s=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(s,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(s);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},d(t+8)+1)),this.mem.setInt32(t+16,s,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const s=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(s)),this._scheduledTimeouts.delete(s)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(o(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const s=this.mem.getUint32(t+8,!0);if(this._goRefCounts[s]--,this._goRefCounts[s]===0){const u=this._values[s];this._values[s]=null,this._ids.delete(u),this._idPool.push(s)}},"syscall/js.stringVal":t=>{t>>>=0,a(t+24,v(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const s=Reflect.get(l(t+8),v(t+16));t=this._inst.exports.getsp()>>>0,a(t+32,s)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(l(t+8),v(t+16),l(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(l(t+8),v(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,a(t+24,Reflect.get(l(t+8),d(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(l(t+8),d(t+16),l(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const s=l(t+8),u=Reflect.get(s,v(t+16)),m=y(t+32),k=Reflect.apply(u,s,m);t=this._inst.exports.getsp()>>>0,a(t+56,k),this.mem.setUint8(t+64,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+56,s),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const s=l(t+8),u=y(t+16),m=Reflect.apply(s,void 0,u);t=this._inst.exports.getsp()>>>0,a(t+40,m),this.mem.setUint8(t+48,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+40,s),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const s=l(t+8),u=y(t+16),m=Reflect.construct(s,u);t=this._inst.exports.getsp()>>>0,a(t+40,m),this.mem.setUint8(t+48,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+40,s),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,P(t+16,parseInt(l(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const s=C.encode(String(l(t+8)));a(t+16,s),P(t+24,s.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const s=l(t+8);o(t+16).set(s)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,l(t+8)instanceof l(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const s=o(t+8),u=l(t+32);if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const m=u.subarray(0,s.length);s.set(m),P(t+40,m.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const s=l(t+8),u=o(t+16);if(!(s instanceof Uint8Array||s instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const m=u.subarray(0,s.length);s.set(m),P(t+40,m.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}async run(P){if(!(P instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=P,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,T,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[T,5],[this,6]]),this._idPool=[],this.exited=!1;let d=4096;const l=t=>{const s=d,u=C.encode(t+"\0");return new Uint8Array(this.mem.buffer,d,u.length).set(u),d+=u.length,d%8!==0&&(d+=8-d%8),s},a=this.argv.length,o=[];this.argv.forEach(t=>{o.push(l(t))}),o.push(0),Object.keys(this.env).sort().forEach(t=>{o.push(l(`${t}=${this.env[t]}`))}),o.push(0);const v=d;if(o.forEach(t=>{this.mem.setUint32(d,t,!0),this.mem.setUint32(d+4,0,!0),d+=8}),d>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(a,v),this.exited&&this._resolveExitPromise(),await this._exitPromise}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(P){const d=this;return function(){const l={id:P,this:this,args:arguments};return d._pendingEvent=l,d._resume(),l.result}}}})(),F=({data:_})=>{let C=new TextDecoder,N=T.fs,P="";N.writeSync=(y,v)=>{if(y===1)j(v);else if(y===2){P+=C.decode(v);let S=P.split(`
`);S.length>1&&console.log(S.slice(0,-1).join(`
`)),P=S[S.length-1]}else throw new Error("Bad write");return v.length};let d=[],l,a=0;F=({data:y})=>(y.length>0&&(d.push(y),l&&l()),o),N.read=(y,v,S,t,s,u)=>{if(y!==0||S!==0||t!==v.length||s!==null)throw new Error("Bad read");if(d.length===0){l=()=>N.read(y,v,S,t,s,u);return}let m=d[0],k=Math.max(0,Math.min(t,m.length-a));v.set(m.subarray(a,a+k),S),a+=k,a===m.length&&(d.shift(),a=0),u(null,k)};let o=new T.Go;return o.argv=["","--service=0.20.2"],B(_,o).then(y=>{j(null),o.run(y)},y=>{j(y)}),o};async function B(_,C){if(_ instanceof WebAssembly.Module)return WebAssembly.instantiate(_,C.importObject);const N=await fetch(_);if(!N.ok)throw new Error(`Failed to download ${JSON.stringify(_)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(N.headers.get("Content-Type")||""))return(await WebAssembly.instantiateStreaming(N,C.importObject)).instance;const P=await N.arrayBuffer();return(await WebAssembly.instantiate(P,C.importObject)).instance}return _=>F(_)})(j=>c.onmessage({data:j})),$;c={onmessage:null,postMessage:j=>setTimeout(()=>$=E({data:j})),terminate(){if($)for(let j of $._scheduledTimeouts.values())clearTimeout(j)}}}let g,p;const h=new Promise((E,$)=>{g=E,p=$});c.onmessage=({data:E})=>{c.onmessage=({data:$})=>b($),E?p(E):g()},c.postMessage(n||new URL(e,location.href).toString());let{readFromStdout:b,service:f}=it({writeToStdin(E){c.postMessage(E)},isSync:!1,hasFS:!1,esbuild:ke});await h,ye=()=>{c.terminate(),re=void 0,ye=void 0,we=void 0},we={build:E=>new Promise(($,j)=>f.buildOrContext({callName:"build",refs:null,options:E,isTTY:!1,defaultWD:"/",callback:(F,T)=>F?j(F):$(T)})),context:E=>new Promise(($,j)=>f.buildOrContext({callName:"context",refs:null,options:E,isTTY:!1,defaultWD:"/",callback:(F,T)=>F?j(F):$(T)})),transform:(E,$)=>new Promise((j,F)=>f.transform({callName:"transform",refs:null,input:E,options:$||{},isTTY:!1,fs:{readFile(T,B){B(new Error("Internal error"),null)},writeFile(T,B){B(null)}},callback:(T,B)=>T?F(T):j(B)})),formatMessages:(E,$)=>new Promise((j,F)=>f.formatMessages({callName:"formatMessages",refs:null,messages:E,options:$,callback:(T,B)=>T?F(T):j(B)})),analyzeMetafile:(E,$)=>new Promise((j,F)=>f.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof E=="string"?E:JSON.stringify(E),options:$,callback:(T,B)=>T?F(T):j(B)}))}},bt=ke,xt="/smart-training/assets/esbuild-g0v_c3-8.wasm";let Ce=!1,be=null;function _t(){return Ce?Promise.resolve():(be||(be=Be({wasmURL:xt,worker:!1}).then(()=>{Ce=!0})),be)}async function ue(e){return await _t(),(await Ve(e,{loader:"ts",target:"es2020"})).code}const kt=`
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
        __lastActual = thrownMsg;
      }
      if (!threw) throw new Error('Expected function to throw');
      if (msg !== undefined && !thrownMsg.includes(String(msg))) {
        throw new Error('Expected to throw "' + msg + '", got "' + thrownMsg + '"');
      }
    }
  };
}
`;function Pe(e){return e.replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm,"").replace(/^export\s+(const|let|var|function\*?|class)\s+/gm,"$1 ").replace(/^export\s+default\s+/gm,"var __default = ").trim()}function Et(e){return e.replace(/^import\s+.*from\s+['"]vitest['"].*$/gm,"").replace(/^import\s+.*from\s+['"]\.\/execute['"].*$/gm,"").replace(/^import\s+.*from\s+['"]\.\/testCases['"].*$/gm,"").trim()}const We=`
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
`;function ze(e,n){const r=Pe(e);let c="";return n&&(c=Pe(n)),{userJsCode:r,constantsJsCode:c}}function St({code:e,constants:n,testCode:r,testCases:c}){const{userJsCode:g,constantsJsCode:p}=ze(e,n),h=Et(r),b=[We,kt,p,g,`var testCases = ${JSON.stringify(c)};`,h,'return { results: __testResults, logs: typeof __consoleLogs !== "undefined" ? __consoleLogs : [] };'].join(`
`);return new Function(b)()}function Tt({code:e,constants:n}){const{userJsCode:r,constantsJsCode:c}=ze(e,n),g=[We,c,r,"return __consoleLogs;"].join(`
`);return new Function(g)()}self.onmessage=async e=>{try{const{type:n,code:r,constants:c}=e.data;if(n==="execute"){const f=Tt({code:await ue(r),constants:c?await ue(c):void 0});self.postMessage({type:"console-result",logs:f});return}if(n!=="run")return;const{testCode:g,testCases:p}=e.data,h=St({code:await ue(r),constants:c?await ue(c):void 0,testCode:await ue(g),testCases:p}),b=h.results.map(f=>({name:f.name,input:f.input??[],expected:f.expected,actual:f.actual,passed:f.passed,reason:f.reason}));self.postMessage({type:"result",results:b,logs:h.logs})}catch(n){self.postMessage({type:"error",message:n instanceof Error?n.message:String(n)})}};
