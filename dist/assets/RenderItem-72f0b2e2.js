import{r,a as L,j as s,I as D,F as w,R as ge,S as ie,b as G,P as be,L as ae,B as Z,c as ye}from"./index-224a7984.js";function Ne(c){const{id:a,value:e,mode:u,symbol:m,onChange:p,disabled:N,autoFocus:l}=c,h=r.useRef(null),t=L.formatCurrency(e||0,2);return r.useEffect(()=>{var d;u==="edit"&&l&&((d=h.current)==null||d.select())},[u]),u==="edit"?s.jsx("div",{className:"field-edit-group",children:s.jsx(D,{id:a,ref:h,className:"field-edit-input wrap-left field-listprice-input",type:"numbers",formatter:d=>`${d||0}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:d=>d.replace(/\$\s?|(,*)/g,""),precision:2,min:0,onChange:p,autoFocus:l,value:e,disabled:N})}):s.jsx(s.Fragment,{children:s.jsxs("div",{className:"field-detail-container flex-end",children:[s.jsx("span",{className:"icon-value",children:m}),s.jsx("span",{children:t})]})})}const Ce=r.memo(Ne);function _e(c){const{id:a,value:e,mode:u,unit:m,onChange:p,disabled:N,autoFocus:l}=c,h=r.useRef(null);return r.useEffect(()=>{var t;u==="edit"&&l&&((t=h.current)==null||t.select())},[u]),u==="edit"?s.jsx("div",{className:"field-edit-group",children:s.jsx(D,{id:a,ref:h,className:"field-edit-input wrap-left field-quantity-input",type:"numbers",formatter:t=>`${t||1}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:t=>t.replace(/\$\s?|(,*)/g,""),precision:2,min:1,max:99999,autoFocus:l,onChange:p,value:e,disabled:N,handlewrapposition:"left"})}):s.jsx(s.Fragment,{children:s.jsxs("div",{className:"field-detail-container field-quantity",children:[s.jsx("span",{children:L.formatCurrency(e,2)}),m&&s.jsx("span",{className:"icon-value",children:m})]})})}const $e=r.memo(_e);function Ie(c){const{value:a,mode:e,autoFocus:u}=c,m=r.useRef(null);return r.useEffect(()=>{var p;e==="edit"&&u&&((p=m.current)==null||p.focus({cursor:"end"}))},[e]),e==="edit"?s.jsx("div",{className:"field-edit-group",children:s.jsx(D,{ref:m,className:"field-edit-input field-comment-input",type:"textarea",autoSize:{minRows:1,maxRows:10},...c})}):s.jsxs("div",{className:"field-detail-container field-comment",children:[!a&&s.jsx(w,{icon:"fa-regular fa-comments",color:"#b3beca"}),s.jsx("span",{children:a})]})}const Fe=r.memo(Ie);function Se(c){var q;const{id:a,value:e,module:u,mode:m,onChange:p,disabled:N,autoFocus:l,form:h,item:t}=c,d=((q=e==null?void 0:e.module)==null?void 0:q.name)||(e==null?void 0:e.module),$=d==="Products"?"Sản phẩm":"Dịch vụ",B=`${ie.urlSub}assets/icon/${d}.svg`,V=[{imgUrl:"test/default.jpg"}],k=n=>{n.stopPropagation();const g=`/erp/listview?module=${d}&record=${e==null?void 0:e.value}`;window.open(g,"_blank")},H=n=>{var b,I,P,A,x,R,j;const g=t==null?void 0:t.lineitem_id,X=(u.name==="PurchaseOrder"?(b=n==null?void 0:n.purchase_cost)==null?void 0:b.value:(I=n==null?void 0:n.unit_price)==null?void 0:I.value)||0,v=(u.name==="PurchaseOrder"?(P=n==null?void 0:n.unit_price)==null?void 0:P.value:(A=n==null?void 0:n.purchase_cost)==null?void 0:A.value)||0,Q={value:(x=n==null?void 0:n.purchase_cost)==null?void 0:x.id,symbol:(R=n==null?void 0:n.purchase_cost)==null?void 0:R.symbol},W=((j=n==null?void 0:n.cf_brandname)==null?void 0:j.value)||"",J=(n==null?void 0:n.imagename)||V,K=(n==null?void 0:n.productcode)||(n==null?void 0:n.service_no)||"",O=(n==null?void 0:n.qtyinstock)||0;n&&h.setFieldsValue({[`listprice||${g}`]:X,[`cf_brandname||${g}`]:W,[`imagename||${g}`]:J,[`productcode||${g}`]:K,[`qtyinstock||${g}`]:O,[`purchase_cost||${g}`]:v,[`currency_purchase||${g}`]:Q}),p(n)};return m==="edit"?s.jsx("div",{className:"field-edit-group field-productname-input",children:s.jsx(ge,{id:a,field:"productid",module:u,allowClear:!1,autoFocus:l,disabled:N,value:e,onChange:H,customOption:!0,iconSearch:s.jsx("img",{src:B,alt:d,title:$,width:16})})}):s.jsxs("div",{className:"field-detail-container field-productname",children:[s.jsx("span",{onClick:k,title:e==null?void 0:e.label,children:e==null?void 0:e.label}),s.jsx("img",{src:B,alt:d,title:$})]})}const ke=r.memo(Se);function Pe(c){var te,ce;const{form:a,item:e,index:u,currency:m,isAdmin:p,getFieldInfo:N,isEditing:l,reloadTabInfo:h,recordData:t,recordPermissions:d,module:$,saveDataRecord:B}=c,V=$==null?void 0:$.name,k=e==null?void 0:e.lineitem_id,H=+(e==null?void 0:e.quantity)||1,q=e==null?void 0:e.entitytype,n=q==="Products"?"Sản phẩm":"Dịch vụ",g=e==null?void 0:e.productname,X=e==null?void 0:e.cf_brandname,v=(e==null?void 0:e.productcode)||(e==null?void 0:e.service_no),Q=(e==null?void 0:e.isrefund)==="on",W=(e==null?void 0:e.unit_price)||0,J=(e==null?void 0:e.purchase_cost)||0,K={value:((te=e==null?void 0:e.currency_purchase)==null?void 0:te.id)||1,symbol:((ce=e==null?void 0:e.currency_purchase)==null?void 0:ce.symbol)||"₫"},O=k.includes("new")&&!(e!=null&&e.productid),b=(t==null?void 0:t.listprice)&&N("listprice"),I=(t==null?void 0:t.quantity)&&N("quantity"),P=(t==null?void 0:t.comment)&&N("comment"),A=d==null?void 0:d.editable,[x,R]=r.useState(O?"edit":"detail"),[j,M]=r.useState(!1),ee=r.useRef(null);r.useEffect(()=>{l.current=x==="edit"},[]);const re=r.useCallback(i=>{if(l.current)return;const f=window.getSelection().toString();x==="detail"&&!f&&(ee.current=i,l.current=!0,a.resetFields(),R("edit"))},[x,e]),se=r.useCallback(()=>{l.current=!1,a.resetFields(),e!=null&&e.productid?R("detail"):le()},[t]),de=r.useCallback(async()=>{var i;M(!0);try{const f=(i=t==null?void 0:t.LineItems)==null?void 0:i.filter(o=>(o==null?void 0:o.lineitem_id)!==k).map(o=>({lineitem_id:o==null?void 0:o.lineitem_id}));await B({LineItems:f})}finally{l.current=!1,R("detail"),M(!1),h(),ne()}},[t]),oe=r.useCallback(async()=>{var i,f,o,F,y,T,U;M(!0);try{const E=a.getFieldsValue(),S={};if(!ue()){se();return}Object.keys(E).forEach(_=>{if(_.includes("||")){const[xe,je]=_.split("||"),z=E[_];S.lineitem_id=je,S[xe]=(z==null?void 0:z.value)||z}});const me=((f=(i=document.getElementById("hdnSubTotal"))==null?void 0:i.dataset)==null?void 0:f.value)||0,fe=((F=(o=document.getElementById("grandTotal"))==null?void 0:o.dataset)==null?void 0:F.value)||0,pe=((T=(y=document.getElementById("balance"))==null?void 0:y.dataset)==null?void 0:T.value)||0,he=(U=t==null?void 0:t.LineItems)==null?void 0:U.filter(_=>(_==null?void 0:_.lineitem_id)!==(S==null?void 0:S.lineitem_id)).map(_=>({lineitem_id:_==null?void 0:_.lineitem_id}));await B({LineItems:[...he,S],hdnSubTotal:me,grandTotal:fe,balance:pe})}finally{l.current=!1,R("detail"),M(!1),h(),ne()}},[a,t]),le=r.useCallback(()=>{const i=document.getElementById("btnRemoveEmptyLineItem");i==null||i.click()},[]),ne=r.useCallback(()=>{const i=document.getElementById("btnReloadLineItem");i==null||i.click()},[]),ue=r.useCallback(()=>{const i=a.getFieldsValue(),f=["quantity","listprice","comment","productid"];return Object.keys(i).some(o=>{var F;if(o.includes("||")){const[y,T]=o.split("||");if(f.includes(y))return y==="productid"?e[y]!==((F=i[o])==null?void 0:F.value):+e[y]!=+i[o]}return!1})},[a,t]),C=({element:i,fieldName:f,rules:o=[],value:F,childrenProps:y,notStyle:T,editable:U})=>{const E=i,S=ee.current===f,Y=U&&A;return T?x==="detail"?s.jsx(E,{value:F,item:e,...y}):s.jsx(G.Item,{name:`${f}||${k}`,initialValue:F,noStyle:!0,children:s.jsx(E,{mode:x,item:e,...y})}):x==="detail"?s.jsx("div",{className:`field-lineitem-detail ${!Y&&"disabled"}`,onClick:()=>Y&&re(f),children:s.jsx(E,{mode:x,value:F,item:e,...y})}):s.jsx(G.Item,{name:`${f}||${k}`,rules:o,initialValue:F,className:"field-lineitem-edit",children:s.jsx(E,{mode:x,autoFocus:S,item:e,...y})})};return s.jsxs(s.Fragment,{children:[s.jsxs("tr",{className:`ajax-${x}`,children:[s.jsxs("td",{className:"td-image",children:[s.jsx("div",{className:"num-row",children:u+1}),s.jsx(C,{element:Ee,fieldName:"imagename",value:e==null?void 0:e.image,notStyle:!0}),s.jsx(C,{element:Re,fieldName:"tax1",value:e==null?void 0:e.tax1,notStyle:!0}),s.jsx(C,{element:we,fieldName:"cf_brandname",value:X,notStyle:!0}),q==="Products"&&s.jsx(C,{element:Le,fieldName:"qtyinstock",value:(e==null?void 0:e.qtyinstock)||0,notStyle:!0})]}),s.jsxs("td",{className:"td-productname",children:[s.jsx(C,{element:ke,fieldName:"productid",childrenProps:{module:$,form:a,disabled:j},value:{value:e==null?void 0:e.productid,label:g,module:{name:q,label:n}},editable:(b==null?void 0:b.editable)||(I==null?void 0:I.editable)}),s.jsx(C,{element:qe,fieldName:"productcode",value:v,notStyle:!0}),P&&s.jsx(C,{element:Fe,fieldName:"comment",value:e==null?void 0:e.comment,editable:P==null?void 0:P.editable,childrenProps:{disabled:j}}),Q&&s.jsx("div",{className:"group-refund",title:"Sản phẩm hoàn trả",children:s.jsx("img",{src:`${ie.urlSub}assets/images/refund.png`,alt:"refund"})})]}),I&&s.jsx("td",{className:"td-quantity",children:s.jsx(C,{element:$e,fieldName:"quantity",value:H,childrenProps:{unit:e==null?void 0:e.usageunit,disabled:j},editable:I==null?void 0:I.editable})}),b&&s.jsxs("td",{className:"td-listprice",children:[s.jsx(C,{element:Ce,fieldName:"listprice",value:e==null?void 0:e.listprice,childrenProps:{symbol:m==null?void 0:m.symbol,disabled:j},editable:b==null?void 0:b.editable}),p&&s.jsxs("div",{className:"purchare-value",children:[s.jsx(C,{element:Te,fieldName:"currency_purchase",value:V==="PurchaseOrder"?{value:1,symbol:"₫"}:K,childrenProps:{module:$},notStyle:!0}),s.jsx(C,{element:Be,fieldName:"purchase_cost",value:V==="PurchaseOrder"?W:J,notStyle:!0})]})]}),b&&s.jsx(Ve,{item:e,form:a,currency:m})]}),x==="edit"&&s.jsx("tr",{children:s.jsx("td",{className:"td-group-action",colSpan:b?5:3,children:s.jsx(G.Item,{className:"group-lineitem-btn-ajax",shouldUpdate:!0,children:()=>{var f,o;const i=(f=a.getFieldValue(`productid||${k}`))==null?void 0:f.value;return s.jsxs("div",{className:"group-btn",children:[((o=t==null?void 0:t.LineItems)==null?void 0:o.length)>1&&!O&&l.current&&s.jsx(be,{title:`Xóa ${n}?`,description:s.jsxs("span",{children:["Bạn chắc chắn muốn xóa ",s.jsx("b",{children:g}),"?"]}),overlayClassName:"popconfirm-remove-lineitem",icon:s.jsx(w,{icon:"fa-regular fa-trash-can",color:"#F63A46"}),getPopupContainer:()=>document.querySelector(".group-lineitem-btn-ajax"),okText:s.jsxs("div",{className:"btn-confirm",children:[j&&s.jsx(ae,{style:{fontSize:16},spin:!0})," ",s.jsx("span",{children:"Đồng ý"})]}),cancelText:s.jsx("div",{className:"btn-deny",children:s.jsx("span",{children:"Hủy"})}),okButtonProps:{loading:!1},cancelButtonProps:{disabled:j},onConfirm:de,children:s.jsxs(Z,{className:"btn-remove",disabled:j,children:[s.jsx(w,{icon:"fa-regular fa-trash-can"}),"Xóa"]})}),s.jsxs(Z,{className:"btn-cancel",onClick:se,disabled:j,children:[s.jsx(w,{icon:"fa-xmark"}),"Hủy"]}),s.jsxs(Z,{className:"btn-save",disabled:j||!i,onClick:oe,children:[j?s.jsx(ae,{style:{fontSize:20},spin:!0}):s.jsx(w,{icon:"fa-check"}),"Lưu"]})]})}})})})]})}const Re=()=>s.jsx("div",{className:"group-tax1"}),Ee=({value:c})=>{const a=s.jsxs("div",{className:"mask-content",children:[s.jsx(w,{icon:"fa-eye"}),s.jsx("span",{children:"Xem"})]});return s.jsx(ye,{values:c,oneImage:!0,styleImg:{width:"100%",height:"100px"},renderMask:a})},we=({value:c})=>c&&s.jsx("div",{className:"brand-name",children:c}),qe=({value:c})=>s.jsx("div",{className:"group-model",children:c||s.jsx("span",{className:"default",children:"Model"})}),Le=({value:c})=>s.jsxs("div",{className:`group-qty-instock ${c>0&&"active"}`,children:[s.jsx(w,{icon:"fa-regular fa-clock"}),c>0?`Tồn: ${c}`:"Hết hàng"]}),Be=({value:c,module:a})=>s.jsx(s.Fragment,{children:s.jsx("span",{children:L.formatCurrency(c||0,2)})}),Te=({value:c,module:a})=>{const e=a==null?void 0:a.name;return s.jsxs(s.Fragment,{children:[s.jsx("span",{children:e==="PurchaseOrder"?"Giá bán: ":"Giá mua: "}),s.jsxs("span",{children:[c==null?void 0:c.symbol," "]})]})},Ve=({currency:c,form:a,item:e})=>{const u=e==null?void 0:e.lineitem_id;return s.jsx("td",{className:"td-total-listprice",children:s.jsx(G.Item,{noStyle:!0,shouldUpdate:!0,children:()=>{const m=a.getFieldValue(`quantity||${u}`)||+(e==null?void 0:e.quantity),p=a.getFieldValue(`listprice||${u}`),N=p===void 0?+(e==null?void 0:e.listprice):p,l=(m||1)*N||0,h=+(e==null?void 0:e.discount_amount)||0,t=+(e==null?void 0:e.discount_percent)||0,d=h>0?h:t*l/100,$=l-d;return s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:"total-after-discount",children:[s.jsx("span",{children:c==null?void 0:c.symbol}),L.formatCurrency($,2)]}),d>0&&s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"total-listprice-value",children:L.formatCurrency(l,2)}),s.jsxs("div",{className:"total-discount",children:[t>0&&`(${t}%) `,"-",L.formatCurrency(d,2)]})]})]})}})})},Ae=r.memo(Pe);export{Ae as default};
