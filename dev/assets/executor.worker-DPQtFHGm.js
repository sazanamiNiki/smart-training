var Ke="/smart-training/dev/assets/esbuild-g0v_c3-8.wasm",Xe=Object.defineProperty,Qe=(e,n)=>{for(var r in n)Xe(e,r,{get:n[r],enumerable:!0})},ke={};Qe(ke,{analyzeMetafile:()=>pt,analyzeMetafileSync:()=>bt,build:()=>ht,buildSync:()=>yt,context:()=>mt,default:()=>kt,formatMessages:()=>gt,formatMessagesSync:()=>vt,initialize:()=>ze,stop:()=>xt,transform:()=>We,transformSync:()=>wt,version:()=>dt});function Ee(e){let n=c=>{if(c===null)r.write8(0);else if(typeof c=="boolean")r.write8(1),r.write8(+c);else if(typeof c=="number")r.write8(2),r.write32(c|0);else if(typeof c=="string")r.write8(3),r.write(ee(c));else if(c instanceof Uint8Array)r.write8(4),r.write(c);else if(c instanceof Array){r.write8(5),r.write32(c.length);for(let g of c)n(g)}else{let g=Object.keys(c);r.write8(6),r.write32(g.length);for(let p of g)r.write(ee(p)),n(c[p])}},r=new Re;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),n(e.value),_e(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function Ze(e){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return ae(r.read());case 4:return r.read();case 5:{let h=r.read32(),b=[];for(let d=0;d<h;d++)b.push(n());return b}case 6:{let h=r.read32(),b={};for(let d=0;d<h;d++)b[ae(r.read())]=n();return b}default:throw new Error("Invalid packet")}},r=new Re(e),c=r.read32(),g=(c&1)===0;c>>>=1;let p=n();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:c,isRequest:g,value:p}}var Re=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let n=new Uint8Array((this.len+e)*2);n.set(this.buf),this.buf=n}return this.len+=e,this.len-e}write8(e){let n=this._write(1);this.buf[n]=e}write32(e){let n=this._write(4);_e(this.buf,e,n)}write(e){let n=this._write(4+e.length);_e(this.buf,e.length,n),this.buf.set(e,n+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Ue(this.buf,this._read(4))}read(){let e=this.read32(),n=new Uint8Array(e),r=this._read(n.length);return n.set(this.buf.subarray(r,r+e)),n}},ee,ae,xe;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,n=new TextDecoder;ee=r=>e.encode(r),ae=r=>n.decode(r),xe='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ee=e=>Buffer.from(e),ae=e=>{let{buffer:n,byteOffset:r,byteLength:c}=e;return Buffer.from(n,r,c).toString()},xe='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ee("")instanceof Uint8Array))throw new Error(`Invariant violation: "${xe} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function Ue(e,n){return e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24}function _e(e,n,r){e[r++]=n,e[r++]=n>>8,e[r++]=n>>16,e[r++]=n>>24}var Y=JSON.stringify,Se="warning",Te="silent";function $e(e){if(H(e,"target"),e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var ge=()=>null,z=e=>typeof e=="boolean"?null:"a boolean",x=e=>typeof e=="string"?null:"a string",pe=e=>e instanceof RegExp?null:"a RegExp object",ie=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Ie=e=>typeof e=="function"?null:"a function",J=e=>Array.isArray(e)?null:"an array",Z=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",et=e=>typeof e=="object"&&e!==null?null:"an array or an object",tt=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",je=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",Me=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",nt=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",rt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",Ne=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",st=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function i(e,n,r,c){let g=e[r];if(n[r+""]=!0,g===void 0)return;let p=c(g);if(p!==null)throw new Error(`${Y(r)} must be ${p}`);return g}function G(e,n,r){for(let c in e)if(!(c in n))throw new Error(`Invalid option ${r}: ${Y(c)}`)}function it(e){let n=Object.create(null),r=i(e,n,"wasmURL",st),c=i(e,n,"wasmModule",tt),g=i(e,n,"worker",z);return G(e,n,"in initialize() call"),{wasmURL:r,wasmModule:c,worker:g}}function Fe(e){let n;if(e!==void 0){n=Object.create(null);for(let r in e){let c=e[r];if(typeof c=="string"||c===!1)n[r]=c;else throw new Error(`Expected ${Y(r)} in mangle cache to map to either a string or false`)}}return n}function ve(e,n,r,c,g){let p=i(n,r,"color",z),h=i(n,r,"logLevel",x),b=i(n,r,"logLimit",ie);p!==void 0?e.push(`--color=${p}`):c&&e.push("--color=true"),e.push(`--log-level=${h||g}`),e.push(`--log-limit=${b||0}`)}function H(e,n,r){if(typeof e!="string")throw new Error(`Expected value for ${n}${r!==void 0?" "+Y(r):""} to be a string, got ${typeof e} instead`);return e}function Le(e,n,r){let c=i(n,r,"legalComments",x),g=i(n,r,"sourceRoot",x),p=i(n,r,"sourcesContent",z),h=i(n,r,"target",rt),b=i(n,r,"format",x),d=i(n,r,"globalName",x),_=i(n,r,"mangleProps",pe),j=i(n,r,"reserveProps",pe),S=i(n,r,"mangleQuoted",z),N=i(n,r,"minify",z),T=i(n,r,"minifySyntax",z),B=i(n,r,"minifyWhitespace",z),k=i(n,r,"minifyIdentifiers",z),C=i(n,r,"lineLimit",ie),F=i(n,r,"drop",J),P=i(n,r,"dropLabels",J),f=i(n,r,"charset",x),l=i(n,r,"treeShaking",z),a=i(n,r,"ignoreAnnotations",z),o=i(n,r,"jsx",x),y=i(n,r,"jsxFactory",x),v=i(n,r,"jsxFragment",x),$=i(n,r,"jsxImportSource",x),t=i(n,r,"jsxDev",z),s=i(n,r,"jsxSideEffects",z),u=i(n,r,"define",Z),m=i(n,r,"logOverride",Z),E=i(n,r,"supported",Z),M=i(n,r,"pure",J),R=i(n,r,"keepNames",z),D=i(n,r,"platform",x),I=i(n,r,"tsconfigRaw",nt);if(c&&e.push(`--legal-comments=${c}`),g!==void 0&&e.push(`--source-root=${g}`),p!==void 0&&e.push(`--sources-content=${p}`),h&&(Array.isArray(h)?e.push(`--target=${Array.from(h).map($e).join(",")}`):e.push(`--target=${$e(h)}`)),b&&e.push(`--format=${b}`),d&&e.push(`--global-name=${d}`),D&&e.push(`--platform=${D}`),I&&e.push(`--tsconfig-raw=${typeof I=="string"?I:JSON.stringify(I)}`),N&&e.push("--minify"),T&&e.push("--minify-syntax"),B&&e.push("--minify-whitespace"),k&&e.push("--minify-identifiers"),C&&e.push(`--line-limit=${C}`),f&&e.push(`--charset=${f}`),l!==void 0&&e.push(`--tree-shaking=${l}`),a&&e.push("--ignore-annotations"),F)for(let A of F)e.push(`--drop:${H(A,"drop")}`);if(P&&e.push(`--drop-labels=${Array.from(P).map(A=>H(A,"dropLabels")).join(",")}`),_&&e.push(`--mangle-props=${_.source}`),j&&e.push(`--reserve-props=${j.source}`),S!==void 0&&e.push(`--mangle-quoted=${S}`),o&&e.push(`--jsx=${o}`),y&&e.push(`--jsx-factory=${y}`),v&&e.push(`--jsx-fragment=${v}`),$&&e.push(`--jsx-import-source=${$}`),t&&e.push("--jsx-dev"),s&&e.push("--jsx-side-effects"),u)for(let A in u){if(A.indexOf("=")>=0)throw new Error(`Invalid define: ${A}`);e.push(`--define:${A}=${H(u[A],"define",A)}`)}if(m)for(let A in m){if(A.indexOf("=")>=0)throw new Error(`Invalid log override: ${A}`);e.push(`--log-override:${A}=${H(m[A],"log override",A)}`)}if(E)for(let A in E){if(A.indexOf("=")>=0)throw new Error(`Invalid supported: ${A}`);const O=E[A];if(typeof O!="boolean")throw new Error(`Expected value for supported ${Y(A)} to be a boolean, got ${typeof O} instead`);e.push(`--supported:${A}=${O}`)}if(M)for(let A of M)e.push(`--pure:${H(A,"pure")}`);R&&e.push("--keep-names")}function lt(e,n,r,c,g){var p;let h=[],b=[],d=Object.create(null),_=null,j=null;ve(h,n,d,r,c),Le(h,n,d);let S=i(n,d,"sourcemap",Me),N=i(n,d,"bundle",z),T=i(n,d,"splitting",z),B=i(n,d,"preserveSymlinks",z),k=i(n,d,"metafile",z),C=i(n,d,"outfile",x),F=i(n,d,"outdir",x),P=i(n,d,"outbase",x),f=i(n,d,"tsconfig",x),l=i(n,d,"resolveExtensions",J),a=i(n,d,"nodePaths",J),o=i(n,d,"mainFields",J),y=i(n,d,"conditions",J),v=i(n,d,"external",J),$=i(n,d,"packages",x),t=i(n,d,"alias",Z),s=i(n,d,"loader",Z),u=i(n,d,"outExtension",Z),m=i(n,d,"publicPath",x),E=i(n,d,"entryNames",x),M=i(n,d,"chunkNames",x),R=i(n,d,"assetNames",x),D=i(n,d,"inject",J),I=i(n,d,"banner",Z),A=i(n,d,"footer",Z),O=i(n,d,"entryPoints",et),L=i(n,d,"absWorkingDir",x),U=i(n,d,"stdin",Z),V=(p=i(n,d,"write",z))!=null?p:g,q=i(n,d,"allowOverwrite",z),X=i(n,d,"mangleCache",Z);if(d.plugins=!0,G(n,d,`in ${e}() call`),S&&h.push(`--sourcemap${S===!0?"":`=${S}`}`),N&&h.push("--bundle"),q&&h.push("--allow-overwrite"),T&&h.push("--splitting"),B&&h.push("--preserve-symlinks"),k&&h.push("--metafile"),C&&h.push(`--outfile=${C}`),F&&h.push(`--outdir=${F}`),P&&h.push(`--outbase=${P}`),f&&h.push(`--tsconfig=${f}`),$&&h.push(`--packages=${$}`),l){let w=[];for(let W of l){if(H(W,"resolve extension"),W.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${W}`);w.push(W)}h.push(`--resolve-extensions=${w.join(",")}`)}if(m&&h.push(`--public-path=${m}`),E&&h.push(`--entry-names=${E}`),M&&h.push(`--chunk-names=${M}`),R&&h.push(`--asset-names=${R}`),o){let w=[];for(let W of o){if(H(W,"main field"),W.indexOf(",")>=0)throw new Error(`Invalid main field: ${W}`);w.push(W)}h.push(`--main-fields=${w.join(",")}`)}if(y){let w=[];for(let W of y){if(H(W,"condition"),W.indexOf(",")>=0)throw new Error(`Invalid condition: ${W}`);w.push(W)}h.push(`--conditions=${w.join(",")}`)}if(v)for(let w of v)h.push(`--external:${H(w,"external")}`);if(t)for(let w in t){if(w.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${w}`);h.push(`--alias:${w}=${H(t[w],"alias",w)}`)}if(I)for(let w in I){if(w.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${w}`);h.push(`--banner:${w}=${H(I[w],"banner",w)}`)}if(A)for(let w in A){if(w.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${w}`);h.push(`--footer:${w}=${H(A[w],"footer",w)}`)}if(D)for(let w of D)h.push(`--inject:${H(w,"inject")}`);if(s)for(let w in s){if(w.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${w}`);h.push(`--loader:${w}=${H(s[w],"loader",w)}`)}if(u)for(let w in u){if(w.indexOf("=")>=0)throw new Error(`Invalid out extension: ${w}`);h.push(`--out-extension:${w}=${H(u[w],"out extension",w)}`)}if(O)if(Array.isArray(O))for(let w=0,W=O.length;w<W;w++){let Q=O[w];if(typeof Q=="object"&&Q!==null){let te=Object.create(null),K=i(Q,te,"in",x),ce=i(Q,te,"out",x);if(G(Q,te,"in entry point at index "+w),K===void 0)throw new Error('Missing property "in" for entry point at index '+w);if(ce===void 0)throw new Error('Missing property "out" for entry point at index '+w);b.push([ce,K])}else b.push(["",H(Q,"entry point at index "+w)])}else for(let w in O)b.push([w,H(O[w],"entry point",w)]);if(U){let w=Object.create(null),W=i(U,w,"contents",Ne),Q=i(U,w,"resolveDir",x),te=i(U,w,"sourcefile",x),K=i(U,w,"loader",x);G(U,w,'in "stdin" object'),te&&h.push(`--sourcefile=${te}`),K&&h.push(`--loader=${K}`),Q&&(j=Q),typeof W=="string"?_=ee(W):W instanceof Uint8Array&&(_=W)}let le=[];if(a)for(let w of a)w+="",le.push(w);return{entries:b,flags:h,write:V,stdinContents:_,stdinResolveDir:j,absWorkingDir:L,nodePaths:le,mangleCache:Fe(X)}}function at(e,n,r,c){let g=[],p=Object.create(null);ve(g,n,p,r,c),Le(g,n,p);let h=i(n,p,"sourcemap",Me),b=i(n,p,"sourcefile",x),d=i(n,p,"loader",x),_=i(n,p,"banner",x),j=i(n,p,"footer",x),S=i(n,p,"mangleCache",Z);return G(n,p,`in ${e}() call`),h&&g.push(`--sourcemap=${h===!0?"external":h}`),b&&g.push(`--sourcefile=${b}`),d&&g.push(`--loader=${d}`),_&&g.push(`--banner=${_}`),j&&g.push(`--footer=${j}`),{flags:g,mangleCache:Fe(S)}}function ot(e){const n={},r={didClose:!1,reason:""};let c={},g=0,p=0,h=new Uint8Array(16*1024),b=0,d=f=>{let l=b+f.length;if(l>h.length){let o=new Uint8Array(l*2);o.set(h),h=o}h.set(f,b),b+=f.length;let a=0;for(;a+4<=b;){let o=Ue(h,a);if(a+4+o>b)break;a+=4,B(h.subarray(a,a+o)),a+=o}a>0&&(h.copyWithin(0,a,b),b-=a)},_=f=>{r.didClose=!0,f&&(r.reason=": "+(f.message||f));const l="The service was stopped"+r.reason;for(let a in c)c[a](l,null);c={}},j=(f,l,a)=>{if(r.didClose)return a("The service is no longer running"+r.reason,null);let o=g++;c[o]=(y,v)=>{try{a(y,v)}finally{f&&f.unref()}},f&&f.ref(),e.writeToStdin(Ee({id:o,isRequest:!0,value:l}))},S=(f,l)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(Ee({id:f,isRequest:!1,value:l}))},N=async(f,l)=>{try{if(l.command==="ping"){S(f,{});return}if(typeof l.key=="number"){const a=n[l.key];if(!a)return;const o=a[l.command];if(o){await o(f,l);return}}throw new Error("Invalid command: "+l.command)}catch(a){const o=[se(a,e,null,void 0,"")];try{S(f,{errors:o})}catch{}}},T=!0,B=f=>{if(T){T=!1;let a=String.fromCharCode(...f);if(a!=="0.20.2")throw new Error(`Cannot start service: Host version "0.20.2" does not match binary version ${Y(a)}`);return}let l=Ze(f);if(l.isRequest)N(l.id,l.value);else{let a=c[l.id];delete c[l.id],l.value.error?a(l.value.error,{}):a(null,l.value)}};return{readFromStdout:d,afterClose:_,service:{buildOrContext:({callName:f,refs:l,options:a,isTTY:o,defaultWD:y,callback:v})=>{let $=0;const t=p++,s={},u={ref(){++$===1&&l&&l.ref()},unref(){--$===0&&(delete n[t],l&&l.unref())}};n[t]=s,u.ref(),ct(f,t,j,S,u,e,s,a,o,y,(m,E)=>{try{v(m,E)}finally{u.unref()}})},transform:({callName:f,refs:l,input:a,options:o,isTTY:y,fs:v,callback:$})=>{const t=Ve();let s=u=>{try{if(typeof a!="string"&&!(a instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:m,mangleCache:E}=at(f,o,y,Te),M={command:"transform",flags:m,inputFS:u!==null,input:u!==null?ee(u):typeof a=="string"?ee(a):a};E&&(M.mangleCache=E),j(l,M,(R,D)=>{if(R)return $(new Error(R),null);let I=oe(D.errors,t),A=oe(D.warnings,t),O=1,L=()=>{if(--O===0){let U={warnings:A,code:D.code,map:D.map,mangleCache:void 0,legalComments:void 0};"legalComments"in D&&(U.legalComments=D==null?void 0:D.legalComments),D.mangleCache&&(U.mangleCache=D==null?void 0:D.mangleCache),$(null,U)}};if(I.length>0)return $(fe("Transform failed",I,A),null);D.codeFS&&(O++,v.readFile(D.code,(U,V)=>{U!==null?$(U,null):(D.code=V,L())})),D.mapFS&&(O++,v.readFile(D.map,(U,V)=>{U!==null?$(U,null):(D.map=V,L())})),L()})}catch(m){let E=[];try{ve(E,o,{},y,Te)}catch{}const M=se(m,e,t,void 0,"");j(l,{command:"error",flags:E,error:M},()=>{M.detail=t.load(M.detail),$(fe("Transform failed",[M],[]),null)})}};if((typeof a=="string"||a instanceof Uint8Array)&&a.length>1024*1024){let u=s;s=()=>v.writeFile(a,u)}s(null)},formatMessages:({callName:f,refs:l,messages:a,options:o,callback:y})=>{if(!o)throw new Error(`Missing second argument in ${f}() call`);let v={},$=i(o,v,"kind",x),t=i(o,v,"color",z),s=i(o,v,"terminalWidth",ie);if(G(o,v,`in ${f}() call`),$===void 0)throw new Error(`Missing "kind" in ${f}() call`);if($!=="error"&&$!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${f}() call`);let u={command:"format-msgs",messages:ne(a,"messages",null,"",s),isWarning:$==="warning"};t!==void 0&&(u.color=t),s!==void 0&&(u.terminalWidth=s),j(l,u,(m,E)=>{if(m)return y(new Error(m),null);y(null,E.messages)})},analyzeMetafile:({callName:f,refs:l,metafile:a,options:o,callback:y})=>{o===void 0&&(o={});let v={},$=i(o,v,"color",z),t=i(o,v,"verbose",z);G(o,v,`in ${f}() call`);let s={command:"analyze-metafile",metafile:a};$!==void 0&&(s.color=$),t!==void 0&&(s.verbose=t),j(l,s,(u,m)=>{if(u)return y(new Error(u),null);y(null,m.result)})}}}}function ct(e,n,r,c,g,p,h,b,d,_,j){const S=Ve(),N=e==="context",T=(C,F)=>{const P=[];try{ve(P,b,{},d,Se)}catch{}const f=se(C,p,S,void 0,F);r(g,{command:"error",flags:P,error:f},()=>{f.detail=S.load(f.detail),j(fe(N?"Context failed":"Build failed",[f],[]),null)})};let B;if(typeof b=="object"){const C=b.plugins;if(C!==void 0){if(!Array.isArray(C))return T(new Error('"plugins" must be an array'),"");B=C}}if(B&&B.length>0){if(p.isSync)return T(new Error("Cannot use plugins in synchronous API calls"),"");ut(n,r,c,g,p,h,b,B,S).then(C=>{if(!C.ok)return T(C.error,C.pluginName);try{k(C.requestPlugins,C.runOnEndCallbacks,C.scheduleOnDisposeCallbacks)}catch(F){T(F,"")}},C=>T(C,""));return}try{k(null,(C,F)=>F([],[]),()=>{})}catch(C){T(C,"")}function k(C,F,P){const f=p.hasFS,{entries:l,flags:a,write:o,stdinContents:y,stdinResolveDir:v,absWorkingDir:$,nodePaths:t,mangleCache:s}=lt(e,b,d,Se,f);if(o&&!p.hasFS)throw new Error('The "write" option is unavailable in this environment');const u={command:"build",key:n,entries:l,flags:a,write:o,stdinContents:y,stdinResolveDir:v,absWorkingDir:$||_,nodePaths:t,context:N};C&&(u.plugins=C),s&&(u.mangleCache=s);const m=(R,D)=>{const I={errors:oe(R.errors,S),warnings:oe(R.warnings,S),outputFiles:void 0,metafile:void 0,mangleCache:void 0},A=I.errors.slice(),O=I.warnings.slice();R.outputFiles&&(I.outputFiles=R.outputFiles.map(ft)),R.metafile&&(I.metafile=JSON.parse(R.metafile)),R.mangleCache&&(I.mangleCache=R.mangleCache),R.writeToStdout!==void 0&&console.log(ae(R.writeToStdout).replace(/\n$/,"")),F(I,(L,U)=>{if(A.length>0||L.length>0){const V=fe("Build failed",A.concat(L),O.concat(U));return D(V,null,L,U)}D(null,I,L,U)})};let E,M;N&&(h["on-end"]=(R,D)=>new Promise(I=>{m(D,(A,O,L,U)=>{const V={errors:L,warnings:U};M&&M(A,O),E=void 0,M=void 0,c(R,V),I()})})),r(g,u,(R,D)=>{if(R)return j(new Error(R),null);if(!N)return m(D,(O,L)=>(P(),j(O,L)));if(D.errors.length>0)return j(fe("Context failed",D.errors,D.warnings),null);let I=!1;const A={rebuild:()=>(E||(E=new Promise((O,L)=>{let U;M=(q,X)=>{U||(U=()=>q?L(q):O(X))};const V=()=>{r(g,{command:"rebuild",key:n},(X,le)=>{X?L(new Error(X)):U?U():V()})};V()})),E),watch:(O={})=>new Promise((L,U)=>{if(!p.hasFS)throw new Error('Cannot use the "watch" API in this environment');G(O,{},"in watch() call"),r(g,{command:"watch",key:n},X=>{X?U(new Error(X)):L(void 0)})}),serve:(O={})=>new Promise((L,U)=>{if(!p.hasFS)throw new Error('Cannot use the "serve" API in this environment');const V={},q=i(O,V,"port",ie),X=i(O,V,"host",x),le=i(O,V,"servedir",x),w=i(O,V,"keyfile",x),W=i(O,V,"certfile",x),Q=i(O,V,"fallback",x),te=i(O,V,"onRequest",Ie);G(O,V,"in serve() call");const K={command:"serve",key:n,onRequest:!!te};q!==void 0&&(K.port=q),X!==void 0&&(K.host=X),le!==void 0&&(K.servedir=le),w!==void 0&&(K.keyfile=w),W!==void 0&&(K.certfile=W),Q!==void 0&&(K.fallback=Q),r(g,K,(ce,qe)=>{if(ce)return U(new Error(ce));te&&(h["serve-request"]=(He,Ye)=>{te(Ye.args),c(He,{})}),L(qe)})}),cancel:()=>new Promise(O=>{if(I)return O();r(g,{command:"cancel",key:n},()=>{O()})}),dispose:()=>new Promise(O=>{if(I)return O();I=!0,r(g,{command:"dispose",key:n},()=>{O(),P(),g.unref()})})};g.ref(),j(null,A)})}}var ut=async(e,n,r,c,g,p,h,b,d)=>{let _=[],j=[],S={},N={},T=[],B=0,k=0,C=[],F=!1;b=[...b];for(let l of b){let a={};if(typeof l!="object")throw new Error(`Plugin at index ${k} must be an object`);const o=i(l,a,"name",x);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${k} is missing a name`);try{let y=i(l,a,"setup",Ie);if(typeof y!="function")throw new Error("Plugin is missing a setup function");G(l,a,`on plugin ${Y(o)}`);let v={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};k++;let t=y({initialOptions:h,resolve:(s,u={})=>{if(!F)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof s!="string")throw new Error("The path to resolve must be a string");let m=Object.create(null),E=i(u,m,"pluginName",x),M=i(u,m,"importer",x),R=i(u,m,"namespace",x),D=i(u,m,"resolveDir",x),I=i(u,m,"kind",x),A=i(u,m,"pluginData",ge);return G(u,m,"in resolve() call"),new Promise((O,L)=>{const U={command:"resolve",path:s,key:e,pluginName:o};if(E!=null&&(U.pluginName=E),M!=null&&(U.importer=M),R!=null&&(U.namespace=R),D!=null&&(U.resolveDir=D),I!=null)U.kind=I;else throw new Error('Must specify "kind" when calling "resolve"');A!=null&&(U.pluginData=d.store(A)),n(c,U,(V,q)=>{V!==null?L(new Error(V)):O({errors:oe(q.errors,d),warnings:oe(q.warnings,d),path:q.path,external:q.external,sideEffects:q.sideEffects,namespace:q.namespace,suffix:q.suffix,pluginData:d.load(q.pluginData)})})})},onStart(s){let u='This error came from the "onStart" callback registered here:',m=he(new Error(u),g,"onStart");_.push({name:o,callback:s,note:m}),v.onStart=!0},onEnd(s){let u='This error came from the "onEnd" callback registered here:',m=he(new Error(u),g,"onEnd");j.push({name:o,callback:s,note:m}),v.onEnd=!0},onResolve(s,u){let m='This error came from the "onResolve" callback registered here:',E=he(new Error(m),g,"onResolve"),M={},R=i(s,M,"filter",pe),D=i(s,M,"namespace",x);if(G(s,M,`in onResolve() call for plugin ${Y(o)}`),R==null)throw new Error("onResolve() call is missing a filter");let I=B++;S[I]={name:o,callback:u,note:E},v.onResolve.push({id:I,filter:R.source,namespace:D||""})},onLoad(s,u){let m='This error came from the "onLoad" callback registered here:',E=he(new Error(m),g,"onLoad"),M={},R=i(s,M,"filter",pe),D=i(s,M,"namespace",x);if(G(s,M,`in onLoad() call for plugin ${Y(o)}`),R==null)throw new Error("onLoad() call is missing a filter");let I=B++;N[I]={name:o,callback:u,note:E},v.onLoad.push({id:I,filter:R.source,namespace:D||""})},onDispose(s){T.push(s)},esbuild:g.esbuild});t&&await t,C.push(v)}catch(y){return{ok:!1,error:y,pluginName:o}}}p["on-start"]=async(l,a)=>{let o={errors:[],warnings:[]};await Promise.all(_.map(async({name:y,callback:v,note:$})=>{try{let t=await v();if(t!=null){if(typeof t!="object")throw new Error(`Expected onStart() callback in plugin ${Y(y)} to return an object`);let s={},u=i(t,s,"errors",J),m=i(t,s,"warnings",J);G(t,s,`from onStart() callback in plugin ${Y(y)}`),u!=null&&o.errors.push(...ne(u,"errors",d,y,void 0)),m!=null&&o.warnings.push(...ne(m,"warnings",d,y,void 0))}}catch(t){o.errors.push(se(t,g,d,$&&$(),y))}})),r(l,o)},p["on-resolve"]=async(l,a)=>{let o={},y="",v,$;for(let t of a.ids)try{({name:y,callback:v,note:$}=S[t]);let s=await v({path:a.path,importer:a.importer,namespace:a.namespace,resolveDir:a.resolveDir,kind:a.kind,pluginData:d.load(a.pluginData)});if(s!=null){if(typeof s!="object")throw new Error(`Expected onResolve() callback in plugin ${Y(y)} to return an object`);let u={},m=i(s,u,"pluginName",x),E=i(s,u,"path",x),M=i(s,u,"namespace",x),R=i(s,u,"suffix",x),D=i(s,u,"external",z),I=i(s,u,"sideEffects",z),A=i(s,u,"pluginData",ge),O=i(s,u,"errors",J),L=i(s,u,"warnings",J),U=i(s,u,"watchFiles",J),V=i(s,u,"watchDirs",J);G(s,u,`from onResolve() callback in plugin ${Y(y)}`),o.id=t,m!=null&&(o.pluginName=m),E!=null&&(o.path=E),M!=null&&(o.namespace=M),R!=null&&(o.suffix=R),D!=null&&(o.external=D),I!=null&&(o.sideEffects=I),A!=null&&(o.pluginData=d.store(A)),O!=null&&(o.errors=ne(O,"errors",d,y,void 0)),L!=null&&(o.warnings=ne(L,"warnings",d,y,void 0)),U!=null&&(o.watchFiles=me(U,"watchFiles")),V!=null&&(o.watchDirs=me(V,"watchDirs"));break}}catch(s){o={id:t,errors:[se(s,g,d,$&&$(),y)]};break}r(l,o)},p["on-load"]=async(l,a)=>{let o={},y="",v,$;for(let t of a.ids)try{({name:y,callback:v,note:$}=N[t]);let s=await v({path:a.path,namespace:a.namespace,suffix:a.suffix,pluginData:d.load(a.pluginData),with:a.with});if(s!=null){if(typeof s!="object")throw new Error(`Expected onLoad() callback in plugin ${Y(y)} to return an object`);let u={},m=i(s,u,"pluginName",x),E=i(s,u,"contents",Ne),M=i(s,u,"resolveDir",x),R=i(s,u,"pluginData",ge),D=i(s,u,"loader",x),I=i(s,u,"errors",J),A=i(s,u,"warnings",J),O=i(s,u,"watchFiles",J),L=i(s,u,"watchDirs",J);G(s,u,`from onLoad() callback in plugin ${Y(y)}`),o.id=t,m!=null&&(o.pluginName=m),E instanceof Uint8Array?o.contents=E:E!=null&&(o.contents=ee(E)),M!=null&&(o.resolveDir=M),R!=null&&(o.pluginData=d.store(R)),D!=null&&(o.loader=D),I!=null&&(o.errors=ne(I,"errors",d,y,void 0)),A!=null&&(o.warnings=ne(A,"warnings",d,y,void 0)),O!=null&&(o.watchFiles=me(O,"watchFiles")),L!=null&&(o.watchDirs=me(L,"watchDirs"));break}}catch(s){o={id:t,errors:[se(s,g,d,$&&$(),y)]};break}r(l,o)};let P=(l,a)=>a([],[]);j.length>0&&(P=(l,a)=>{(async()=>{const o=[],y=[];for(const{name:v,callback:$,note:t}of j){let s,u;try{const m=await $(l);if(m!=null){if(typeof m!="object")throw new Error(`Expected onEnd() callback in plugin ${Y(v)} to return an object`);let E={},M=i(m,E,"errors",J),R=i(m,E,"warnings",J);G(m,E,`from onEnd() callback in plugin ${Y(v)}`),M!=null&&(s=ne(M,"errors",d,v,void 0)),R!=null&&(u=ne(R,"warnings",d,v,void 0))}}catch(m){s=[se(m,g,d,t&&t(),v)]}if(s){o.push(...s);try{l.errors.push(...s)}catch{}}if(u){y.push(...u);try{l.warnings.push(...u)}catch{}}}a(o,y)})()});let f=()=>{for(const l of T)setTimeout(()=>l(),0)};return F=!0,{ok:!0,requestPlugins:C,runOnEndCallbacks:P,scheduleOnDisposeCallbacks:f}};function Ve(){const e=new Map;let n=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const c=n++;return e.set(c,r),c}}}function he(e,n,r){let c,g=!1;return()=>{if(g)return c;g=!0;try{let p=(e.stack+"").split(`
`);p.splice(1,1);let h=Be(n,p,r);if(h)return c={text:e.message,location:h},c}catch{}}}function se(e,n,r,c,g){let p="Internal error",h=null;try{p=(e&&e.message||e)+""}catch{}try{h=Be(n,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:g,text:p,location:h,notes:c?[c]:[],detail:r?r.store(e):-1}}function Be(e,n,r){let c="    at ";if(e.readFileSync&&!n[0].startsWith(c)&&n[1].startsWith(c))for(let g=1;g<n.length;g++){let p=n[g];if(p.startsWith(c))for(p=p.slice(c.length);;){let h=/^(?:new |async )?\S+ \((.*)\)$/.exec(p);if(h){p=h[1];continue}if(h=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(p),h){p=h[1];continue}if(h=/^(\S+):(\d+):(\d+)$/.exec(p),h){let b;try{b=e.readFileSync(h[1],"utf8")}catch{break}let d=b.split(/\r\n|\r|\n|\u2028|\u2029/)[+h[2]-1]||"",_=+h[3]-1,j=d.slice(_,_+r.length)===r?r.length:0;return{file:h[1],namespace:"file",line:+h[2],column:ee(d.slice(0,_)).length,length:ee(d.slice(_,_+j)).length,lineText:d+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function fe(e,n,r){let c=5;e+=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,c+1).map((p,h)=>{if(h===c)return`
...`;if(!p.location)return`
error: ${p.text}`;let{file:b,line:d,column:_}=p.location,j=p.pluginName?`[plugin: ${p.pluginName}] `:"";return`
${b}:${d}:${_}: ERROR: ${j}${p.text}`}).join("");let g=new Error(e);for(const[p,h]of[["errors",n],["warnings",r]])Object.defineProperty(g,p,{configurable:!0,enumerable:!0,get:()=>h,set:b=>Object.defineProperty(g,p,{configurable:!0,enumerable:!0,value:b})});return g}function oe(e,n){for(const r of e)r.detail=n.load(r.detail);return e}function Oe(e,n,r){if(e==null)return null;let c={},g=i(e,c,"file",x),p=i(e,c,"namespace",x),h=i(e,c,"line",ie),b=i(e,c,"column",ie),d=i(e,c,"length",ie),_=i(e,c,"lineText",x),j=i(e,c,"suggestion",x);if(G(e,c,n),_){const S=_.slice(0,(b&&b>0?b:0)+(d&&d>0?d:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(S)&&!/\n/.test(_)&&(_=S)}return{file:g||"",namespace:p||"",line:h||0,column:b||0,length:d||0,lineText:_||"",suggestion:j||""}}function ne(e,n,r,c,g){let p=[],h=0;for(const b of e){let d={},_=i(b,d,"id",x),j=i(b,d,"pluginName",x),S=i(b,d,"text",x),N=i(b,d,"location",je),T=i(b,d,"notes",J),B=i(b,d,"detail",ge),k=`in element ${h} of "${n}"`;G(b,d,k);let C=[];if(T)for(const F of T){let P={},f=i(F,P,"text",x),l=i(F,P,"location",je);G(F,P,k),C.push({text:f||"",location:Oe(l,k,g)})}p.push({id:_||"",pluginName:j||c,text:S||"",location:Oe(N,k,g),notes:C,detail:r?r.store(B):-1}),h++}return p}function me(e,n){const r=[];for(const c of e){if(typeof c!="string")throw new Error(`${Y(n)} must be an array of strings`);r.push(c)}return r}function ft({path:e,contents:n,hash:r}){let c=null;return{path:e,contents:n,hash:r,get text(){const g=this.contents;return(c===null||g!==n)&&(n=g,c=ae(g)),c}}}var dt="0.20.2",ht=e=>de().build(e),mt=e=>de().context(e),We=(e,n)=>de().transform(e,n),gt=(e,n)=>de().formatMessages(e,n),pt=(e,n)=>de().analyzeMetafile(e,n),yt=()=>{throw new Error('The "buildSync" API only works in node')},wt=()=>{throw new Error('The "transformSync" API only works in node')},vt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},bt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},xt=()=>(ye&&ye(),Promise.resolve()),re,ye,we,de=()=>{if(we)return we;throw re?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},ze=e=>{e=it(e||{});let n=e.wasmURL,r=e.wasmModule,c=e.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(re)throw new Error('Cannot call "initialize" more than once');return re=_t(n||"",r,c),re.catch(()=>{re=void 0}),re},_t=async(e,n,r)=>{let c;if(r){let _=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});c=new Worker(URL.createObjectURL(_))}else{let _=(S=>{let N,T={};for(let k=self;k;k=Object.getPrototypeOf(k))for(let C of Object.getOwnPropertyNames(k))C in T||Object.defineProperty(T,C,{get:()=>self[C]});(()=>{const k=()=>{const P=new Error("not implemented");return P.code="ENOSYS",P};if(!T.fs){let P="";T.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(f,l){P+=F.decode(l);const a=P.lastIndexOf(`
`);return a!=-1&&(console.log(P.substring(0,a)),P=P.substring(a+1)),l.length},write(f,l,a,o,y,v){if(a!==0||o!==l.length||y!==null){v(k());return}const $=this.writeSync(f,l);v(null,$)},chmod(f,l,a){a(k())},chown(f,l,a,o){o(k())},close(f,l){l(k())},fchmod(f,l,a){a(k())},fchown(f,l,a,o){o(k())},fstat(f,l){l(k())},fsync(f,l){l(null)},ftruncate(f,l,a){a(k())},lchown(f,l,a,o){o(k())},link(f,l,a){a(k())},lstat(f,l){l(k())},mkdir(f,l,a){a(k())},open(f,l,a,o){o(k())},read(f,l,a,o,y,v){v(k())},readdir(f,l){l(k())},readlink(f,l){l(k())},rename(f,l,a){a(k())},rmdir(f,l){l(k())},stat(f,l){l(k())},symlink(f,l,a){a(k())},truncate(f,l,a){a(k())},unlink(f,l){l(k())},utimes(f,l,a,o){o(k())}}}if(T.process||(T.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw k()},pid:-1,ppid:-1,umask(){throw k()},cwd(){throw k()},chdir(){throw k()}}),!T.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!T.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!T.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!T.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const C=new TextEncoder("utf-8"),F=new TextDecoder("utf-8");T.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const P=(t,s)=>{this.mem.setUint32(t+0,s,!0),this.mem.setUint32(t+4,Math.floor(s/4294967296),!0)},f=t=>{const s=this.mem.getUint32(t+0,!0),u=this.mem.getInt32(t+4,!0);return s+u*4294967296},l=t=>{const s=this.mem.getFloat64(t,!0);if(s===0)return;if(!isNaN(s))return s;const u=this.mem.getUint32(t,!0);return this._values[u]},a=(t,s)=>{if(typeof s=="number"&&s!==0){if(isNaN(s)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,s,!0);return}if(s===void 0){this.mem.setFloat64(t,0,!0);return}let m=this._ids.get(s);m===void 0&&(m=this._idPool.pop(),m===void 0&&(m=this._values.length),this._values[m]=s,this._goRefCounts[m]=0,this._ids.set(s,m)),this._goRefCounts[m]++;let E=0;switch(typeof s){case"object":s!==null&&(E=1);break;case"string":E=2;break;case"symbol":E=3;break;case"function":E=4;break}this.mem.setUint32(t+4,2146959360|E,!0),this.mem.setUint32(t,m,!0)},o=t=>{const s=f(t+0),u=f(t+8);return new Uint8Array(this._inst.exports.mem.buffer,s,u)},y=t=>{const s=f(t+0),u=f(t+8),m=new Array(u);for(let E=0;E<u;E++)m[E]=l(s+E*8);return m},v=t=>{const s=f(t+0),u=f(t+8);return F.decode(new DataView(this._inst.exports.mem.buffer,s,u))},$=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const s=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(s)},"runtime.wasmWrite":t=>{t>>>=0;const s=f(t+8),u=f(t+16),m=this.mem.getInt32(t+24,!0);T.fs.writeSync(s,new Uint8Array(this._inst.exports.mem.buffer,u,m))},"runtime.resetMemoryDataView":t=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,P(t+8,($+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const s=new Date().getTime();P(t+8,s/1e3),this.mem.setInt32(t+16,s%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const s=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(s,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(s);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},f(t+8)+1)),this.mem.setInt32(t+16,s,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const s=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(s)),this._scheduledTimeouts.delete(s)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(o(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const s=this.mem.getUint32(t+8,!0);if(this._goRefCounts[s]--,this._goRefCounts[s]===0){const u=this._values[s];this._values[s]=null,this._ids.delete(u),this._idPool.push(s)}},"syscall/js.stringVal":t=>{t>>>=0,a(t+24,v(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const s=Reflect.get(l(t+8),v(t+16));t=this._inst.exports.getsp()>>>0,a(t+32,s)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(l(t+8),v(t+16),l(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(l(t+8),v(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,a(t+24,Reflect.get(l(t+8),f(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(l(t+8),f(t+16),l(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const s=l(t+8),u=Reflect.get(s,v(t+16)),m=y(t+32),E=Reflect.apply(u,s,m);t=this._inst.exports.getsp()>>>0,a(t+56,E),this.mem.setUint8(t+64,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+56,s),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const s=l(t+8),u=y(t+16),m=Reflect.apply(s,void 0,u);t=this._inst.exports.getsp()>>>0,a(t+40,m),this.mem.setUint8(t+48,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+40,s),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const s=l(t+8),u=y(t+16),m=Reflect.construct(s,u);t=this._inst.exports.getsp()>>>0,a(t+40,m),this.mem.setUint8(t+48,1)}catch(s){t=this._inst.exports.getsp()>>>0,a(t+40,s),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,P(t+16,parseInt(l(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const s=C.encode(String(l(t+8)));a(t+16,s),P(t+24,s.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const s=l(t+8);o(t+16).set(s)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,l(t+8)instanceof l(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const s=o(t+8),u=l(t+32);if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const m=u.subarray(0,s.length);s.set(m),P(t+40,m.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const s=l(t+8),u=o(t+16);if(!(s instanceof Uint8Array||s instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const m=u.subarray(0,s.length);s.set(m),P(t+40,m.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}async run(P){if(!(P instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=P,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,T,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[T,5],[this,6]]),this._idPool=[],this.exited=!1;let f=4096;const l=t=>{const s=f,u=C.encode(t+"\0");return new Uint8Array(this.mem.buffer,f,u.length).set(u),f+=u.length,f%8!==0&&(f+=8-f%8),s},a=this.argv.length,o=[];this.argv.forEach(t=>{o.push(l(t))}),o.push(0),Object.keys(this.env).sort().forEach(t=>{o.push(l(`${t}=${this.env[t]}`))}),o.push(0);const v=f;if(o.forEach(t=>{this.mem.setUint32(f,t,!0),this.mem.setUint32(f+4,0,!0),f+=8}),f>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(a,v),this.exited&&this._resolveExitPromise(),await this._exitPromise}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(P){const f=this;return function(){const l={id:P,this:this,args:arguments};return f._pendingEvent=l,f._resume(),l.result}}}})(),N=({data:k})=>{let C=new TextDecoder,F=T.fs,P="";F.writeSync=(y,v)=>{if(y===1)S(v);else if(y===2){P+=C.decode(v);let $=P.split(`
`);$.length>1&&console.log($.slice(0,-1).join(`
`)),P=$[$.length-1]}else throw new Error("Bad write");return v.length};let f=[],l,a=0;N=({data:y})=>(y.length>0&&(f.push(y),l&&l()),o),F.read=(y,v,$,t,s,u)=>{if(y!==0||$!==0||t!==v.length||s!==null)throw new Error("Bad read");if(f.length===0){l=()=>F.read(y,v,$,t,s,u);return}let m=f[0],E=Math.max(0,Math.min(t,m.length-a));v.set(m.subarray(a,a+E),$),a+=E,a===m.length&&(f.shift(),a=0),u(null,E)};let o=new T.Go;return o.argv=["","--service=0.20.2"],B(k,o).then(y=>{S(null),o.run(y)},y=>{S(y)}),o};async function B(k,C){if(k instanceof WebAssembly.Module)return WebAssembly.instantiate(k,C.importObject);const F=await fetch(k);if(!F.ok)throw new Error(`Failed to download ${JSON.stringify(k)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(F.headers.get("Content-Type")||""))return(await WebAssembly.instantiateStreaming(F,C.importObject)).instance;const P=await F.arrayBuffer();return(await WebAssembly.instantiate(P,C.importObject)).instance}return k=>N(k)})(S=>c.onmessage({data:S})),j;c={onmessage:null,postMessage:S=>setTimeout(()=>j=_({data:S})),terminate(){if(j)for(let S of j._scheduledTimeouts.values())clearTimeout(S)}}}let g,p;const h=new Promise((_,j)=>{g=_,p=j});c.onmessage=({data:_})=>{c.onmessage=({data:j})=>b(j),_?p(_):g()},c.postMessage(n||new URL(e,location.href).toString());let{readFromStdout:b,service:d}=ot({writeToStdin(_){c.postMessage(_)},isSync:!1,hasFS:!1,esbuild:ke});await h,ye=()=>{c.terminate(),re=void 0,ye=void 0,we=void 0},we={build:_=>new Promise((j,S)=>d.buildOrContext({callName:"build",refs:null,options:_,isTTY:!1,defaultWD:"/",callback:(N,T)=>N?S(N):j(T)})),context:_=>new Promise((j,S)=>d.buildOrContext({callName:"context",refs:null,options:_,isTTY:!1,defaultWD:"/",callback:(N,T)=>N?S(N):j(T)})),transform:(_,j)=>new Promise((S,N)=>d.transform({callName:"transform",refs:null,input:_,options:j||{},isTTY:!1,fs:{readFile(T,B){B(new Error("Internal error"),null)},writeFile(T,B){B(null)}},callback:(T,B)=>T?N(T):S(B)})),formatMessages:(_,j)=>new Promise((S,N)=>d.formatMessages({callName:"formatMessages",refs:null,messages:_,options:j,callback:(T,B)=>T?N(T):S(B)})),analyzeMetafile:(_,j)=>new Promise((S,N)=>d.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof _=="string"?_:JSON.stringify(_),options:j,callback:(T,B)=>T?N(T):S(B)}))}},kt=ke;let Ce=!1,be=null;function Et(){return Ce?Promise.resolve():(be||(be=ze({wasmURL:Ke,worker:!1}).then(()=>{Ce=!0})),be)}async function ue(e){return await Et(),(await We(e,{loader:"ts",target:"es2020"})).code}const Je=`
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
`,St=`
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
`;let Pe=!1;function Ae(){if(Pe)return;Pe=!0;const e=["fetch","XMLHttpRequest","WebSocket","EventSource","indexedDB","caches"];for(const n of e)try{Object.defineProperty(self,n,{value:void 0,writable:!1,configurable:!0})}catch{}}function De(e){return e.replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm,"").replace(/^export\s+(const|let|var|function\*?|class)\s+/gm,"$1 ").replace(/^export\s+default\s+/gm,"var __default = ").trim()}function Tt(e){return e.replace(/^import\s+.*from\s+['"]vitest['"].*$/gm,"").replace(/^import\s+.*from\s+['"]\.\/execute['"].*$/gm,"").replace(/^import\s+.*from\s+['"]\.\/testCases['"].*$/gm,"").trim()}function Ge(e,n){const r=De(e),c=n?De(n):"";return{userJsCode:r,constantsJsCode:c}}function $t({code:e,constants:n,testCode:r,testCases:c}){const{userJsCode:g,constantsJsCode:p}=Ge(e,n),h=Tt(r),b=[Je,St,p,g,`var testCases = ${JSON.stringify(c)};`,h,'return { results: __testResults, logs: typeof __consoleLogs !== "undefined" ? __consoleLogs : [] };'].join(`
`);return new Function(b)()}function jt({code:e,constants:n}){const{userJsCode:r,constantsJsCode:c}=Ge(e,n),g=[Je,c,r,"return __consoleLogs;"].join(`
`);return new Function(g)()}self.onmessage=async e=>{try{const{type:n,code:r,constants:c}=e.data;if(n==="execute"){const[S,N]=await Promise.all([ue(r),c?ue(c):Promise.resolve(void 0)]);Ae();const T=jt({code:S,constants:N});self.postMessage({type:"console-result",logs:T});return}if(n!=="run")return;const{testCode:g,testCases:p}=e.data,[h,b,d]=await Promise.all([ue(r),c?ue(c):Promise.resolve(void 0),ue(g)]);Ae();const _=$t({code:h,constants:b,testCode:d,testCases:p}),j=_.results.map(S=>({name:S.name,input:S.input??[],expected:S.expected,actual:S.actual,passed:S.passed,reason:S.reason}));self.postMessage({type:"result",results:j,logs:_.logs})}catch(n){self.postMessage({type:"error",message:n instanceof Error?n.message:String(n)})}};
