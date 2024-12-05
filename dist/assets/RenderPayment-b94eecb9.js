import{j as e,a as C,D as M,r as V,d as A,F as $,I as L,b as S,e as O,B as T,L as B}from"./index-224a7984.js";function H(d){const{paymentFields:c,divider:r,recordData:a,getFieldInfo:t,currency:s,grandTotal:o,PaymentItem:u,form:x,recordPermissions:j}=d,_=c.some(l=>{const p=a==null?void 0:a[l==null?void 0:l.paymentValue];return(+(p==null?void 0:p.value)||0)>=0});if(!_)return null;const F=j==null?void 0:j.editable,g=t("hoantra"),D=t("cf_1996"),f=x.getFieldValue("hoantra")||0,b=t("datcoc"),n=x.getFieldValue("datcoc")||0,y=c.reduce((l,p)=>{const v=x.getFieldValue(p==null?void 0:p.paymentValue)||0;return l+v},0)+n-f,h=t("balance"),N=o-y;return(_||h)&&e.jsxs(e.Fragment,{children:[r&&r(),e.jsx("div",{className:"payment-container",children:e.jsx("table",{children:e.jsxs("tbody",{children:[c.map((l,p)=>{var R,I,Y;const v=t(l==null?void 0:l.paymentValue),P=t(l==null?void 0:l.paymentDay),m=x.getFieldValue(l==null?void 0:l.paymentValue)||((R=a==null?void 0:a[l==null?void 0:l.paymentValue])==null?void 0:R.value)||0,k=(I=c[p-1])==null?void 0:I.paymentValue,E=+((Y=a==null?void 0:a[k])==null?void 0:Y.value)||0;return v&&(m>0||p===0||E>0&&F)&&e.jsx(u,{fieldDay:l==null?void 0:l.paymentDay,fieldValue:l==null?void 0:l.paymentValue,payDayInfo:P,payInfo:v,...d},p)}),b&&e.jsx(u,{fieldValue:"datcoc",payInfo:b,...d}),g&&e.jsx(u,{fieldDay:"cf_1996",fieldValue:"hoantra",payDayInfo:D,payInfo:g,typeValue:"error",...d}),h&&e.jsxs("tr",{children:[e.jsx("td",{className:"td-label",children:e.jsx("div",{className:"text-label",children:"Đã thanh toán"})}),e.jsx("td",{className:"td-value total-success",children:e.jsxs("div",{className:"text-value not-edit",children:[s==null?void 0:s.symbol," ",C.formatCurrency(y,2)]})})]}),h&&e.jsxs(e.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"td-label"}),e.jsx("td",{className:"td-value",children:e.jsx(M,{className:"divider-balance"})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"td-label",children:e.jsx("div",{className:"text-label",children:h==null?void 0:h.label})}),e.jsx("td",{className:`td-value ${N===0?"total-success":N<0?"total-info":"total-error"}`,children:e.jsxs("div",{className:"text-value not-edit",id:"balance","data-value":N,children:[s==null?void 0:s.symbol," ",C.formatCurrency(N,2)]})})]})]})]})})})]})}function q(d){const{paymentFields:c,divider:r,recordData:a,getFieldInfo:t,currency:s,grandTotal:o,PaymentItem:u,form:x}=d,j=c.some(n=>{const i=a==null?void 0:a[n==null?void 0:n.paymentValue];return(+(i==null?void 0:i.value)||0)>=0});if(!j)return null;const _=c.reduce((n,i)=>{const y=x.getFieldValue(i==null?void 0:i.paymentValue)||0;return n+y},0),F=t("datcocdh"),g=x.getFieldValue("datcocdh")||0,D=_+g,f=t("balance"),b=o-D;return(j||f)&&e.jsxs(e.Fragment,{children:[r&&r(),e.jsx("div",{className:"payment-container",children:e.jsx("table",{children:e.jsxs("tbody",{children:[c.map((n,i)=>{var v,P,m;const y=t(n==null?void 0:n.paymentValue),h=t(n==null?void 0:n.paymentDay),N=x.getFieldValue(n==null?void 0:n.paymentValue)||((v=a==null?void 0:a[n==null?void 0:n.paymentValue])==null?void 0:v.value)||0,l=(P=c[i-1])==null?void 0:P.paymentValue,p=+((m=a==null?void 0:a[l])==null?void 0:m.value)||0;return y&&(N>0||i===0||p>0)&&e.jsx(u,{fieldDay:n==null?void 0:n.paymentDay,fieldValue:n==null?void 0:n.paymentValue,payDayInfo:h,payInfo:y,...d},i)}),F&&e.jsx(u,{fieldValue:"datcocdh",payInfo:F,...d}),f&&e.jsxs("tr",{children:[e.jsx("td",{className:"td-label",children:e.jsx("div",{className:"text-label",children:"Đã thanh toán"})}),e.jsx("td",{className:"td-value total-success",children:e.jsxs("div",{className:"text-value not-edit",children:[s==null?void 0:s.symbol," ",C.formatCurrency(D,2)]})})]}),f&&e.jsxs(e.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"td-label"}),e.jsx("td",{className:"td-value",children:e.jsx(M,{className:"divider-balance"})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"td-label",children:e.jsx("div",{className:"text-label",children:f==null?void 0:f.label})}),e.jsx("td",{className:`td-value ${b===0?"total-success":b<0?"total-info":"total-error"}`,children:e.jsxs("div",{className:"text-value not-edit",id:"balance","data-value":b,children:[s==null?void 0:s.symbol," ",C.formatCurrency(b,2)]})})]})]})]})})})]})}function z(d){var v,P;const{fieldDay:c,fieldValue:r,payInfo:a,payDayInfo:t,recordData:s,recordPermissions:o,reloadTabInfo:u,form:x,isEditing:j,saveDataRecord:_,typeValue:F}=d,[g,D]=V.useState("detail"),[f,b]=V.useState(!1),n=V.useRef(null),i=+((v=s==null?void 0:s[r])==null?void 0:v.value)||0,y=((P=s==null?void 0:s[c])==null?void 0:P.value)||null,h=o==null?void 0:o.editable,N=m=>{j.current||m==="value"&&!(a!=null&&a.editable)||m==="date"&&!(t!=null&&t.editable)||!h||(n.current=m,j.current=!0,D("edit"))},l=()=>{j.current=!1,x.resetFields([r,c]),D("detail")},p=async()=>{var Y;const m=x.getFieldsValue(),k=(m==null?void 0:m[r])||0,E=((Y=m==null?void 0:m[c])==null?void 0:Y.format("YYYY-MM-DD"))||null;if(!(k!==i||E!==y)){l();return}const I={[r]:k};t&&(I[c]=E),b(!0);try{await _(I)}finally{j.current=!1,b(!1),u(),D("detail")}};return e.jsxs("tr",{children:[e.jsx("td",{className:"td-label",children:e.jsxs("div",{className:"group-label-payment",children:[e.jsx("div",{className:"text-label",children:a==null?void 0:a.label}),t&&(g==="detail"?e.jsxs("div",{className:`text-date ${!y&&"not-date"} ${(!h||!(t!=null&&t.editable))&&"disabled"}`,onClick:()=>N("date"),children:[e.jsx("span",{children:y?C.convertToServerTime(y,"DD-MM-YYYY"):"Chưa có ngày"}),e.jsx($,{icon:"fa-regular fa-calendar",color:"#A0AEC0",className:"icon-value"})]}):e.jsx(S.Item,{name:c,initialValue:y&&O(y,"YYYY-MM-DD"),noStyle:!0,children:e.jsx(G,{autoFocus:n.current==="date",disabled:f})}))]})}),e.jsxs("td",{className:`td-value ${F||"success"}`,children:[e.jsx(S.Item,{name:r,initialValue:i,noStyle:!0,children:g==="detail"?e.jsxs("div",{className:`text-value ${(!h||!(a!=null&&a.editable))&&"disabled"}`,onClick:()=>N("value"),children:[F==="error"?"-":"+",C.formatCurrency(i||0,2)]}):e.jsx(J,{autoFocus:n.current==="value",disabled:f})}),g!=="detail"&&e.jsxs("div",{className:"group-btn-ajax",children:[e.jsx(T,{className:"btn-cancel",onClick:l,disabled:f,children:e.jsx($,{icon:"fa-xmark"})}),e.jsx(T,{className:"btn-save",onClick:p,disabled:f,children:f?e.jsx(B,{style:{fontSize:16},spin:!0}):e.jsx($,{icon:"fa-check"})})]})]})]})}const G=V.memo(({id:d,value:c,onChange:r,disabled:a,autoFocus:t})=>{V.useLayoutEffect(()=>{setTimeout(()=>{t&&s()},50)},[]);const s=()=>{if(o())return;const u=document.getElementById(d);u==null||u.click()},o=()=>{const u=document.querySelector(`.date-picker-popup-${d}`);return!(u?u==null?void 0:u.classList.contains("ant-picker-dropdown-hidden"):!0)};return e.jsxs("div",{className:"field-edit-group field-adjustment-date-group",children:[e.jsx(A,{id:d,className:"date-picker-custom field-edit-input",format:"DD-MM-YYYY",value:c,onChange:r,disabled:a,placement:"bottomLeft",suffixIcon:!1,popupClassName:`date-picker-popup-${d}`}),e.jsx("div",{className:"suffix-icon has-clicked",onClick:s,children:e.jsx($,{icon:"fa-regular fa-calendar",color:"#A0AEC0"})})]})}),J=V.memo(({id:d,value:c,onChange:r,disabled:a,autoFocus:t})=>{const s=V.useRef(null);return V.useEffect(()=>{var o;t&&((o=s.current)==null||o.select())},[]),e.jsx("div",{className:"field-edit-group",children:e.jsx(L,{id:d,ref:s,className:"field-edit-input wrap-left",type:"numbers",formatter:o=>`${o||0}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:o=>o.replace(/\$\s?|(,*)/g,""),precision:2,min:0,onChange:r,value:c,disabled:a,autoFocus:t})})}),w=V.memo(z);function Q(d){const{module:c}=d,r=V.useRef([{paymentDay:"cf_1706",paymentValue:"received"},{paymentDay:"cf_1708",paymentValue:"received2"},{paymentDay:"cf_1710",paymentValue:"received3"},{paymentDay:"cf_1712",paymentValue:"received4"},{paymentDay:"cf_1714",paymentValue:"received5"},{paymentDay:"cf_1858",paymentValue:"received6"},{paymentDay:"cf_1860",paymentValue:"received7"},{paymentDay:"cf_1862",paymentValue:"received8"},{paymentDay:"cf_1864",paymentValue:"received9"},{paymentDay:"cf_1866",paymentValue:"received10"}]),a=V.useRef([{paymentDay:"cf_1972",paymentValue:"paid"},{paymentDay:"cf_1952",paymentValue:"paid1"},{paymentDay:"cf_1954",paymentValue:"paid2"},{paymentDay:"cf_1956",paymentValue:"paid3"},{paymentDay:"cf_1958",paymentValue:"paid4"},{paymentDay:"cf_1960",paymentValue:"paid5"},{paymentDay:"cf_1962",paymentValue:"paid6"},{paymentDay:"cf_1964",paymentValue:"paid7"},{paymentDay:"cf_1966",paymentValue:"paid8"},{paymentDay:"cf_1968",paymentValue:"paid9"}]),t=()=>e.jsxs("div",{className:"group-divider",children:[e.jsx(M,{className:"divider-payment"}),e.jsx("div",{className:"label-payment",children:e.jsx("span",{children:"Phần thanh toán"})})]});switch(c==null?void 0:c.name){case"Invoice":return e.jsx(H,{paymentFields:r.current,divider:t,PaymentItem:w,...d});case"PurchaseOrder":return e.jsx(q,{paymentFields:a.current,divider:t,PaymentItem:w,...d});default:return null}}export{Q as default};