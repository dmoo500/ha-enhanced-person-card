/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, pe = Y.ShadowRoot && (Y.ShadyCSS === void 0 || Y.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, fe = Symbol(), Ce = /* @__PURE__ */ new WeakMap();
let Fe = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== fe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (pe && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Ce.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ce.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const at = (s) => new Fe(typeof s == "string" ? s : s + "", void 0, fe), qe = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce(((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1]), s[0]);
  return new Fe(t, s, fe);
}, ct = (s, e) => {
  if (pe) s.adoptedStyleSheets = e.map(((t) => t instanceof CSSStyleSheet ? t : t.styleSheet));
  else for (const t of e) {
    const i = document.createElement("style"), r = Y.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, Se = pe ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return at(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: lt, defineProperty: dt, getOwnPropertyDescriptor: ht, getOwnPropertyNames: ut, getOwnPropertySymbols: pt, getPrototypeOf: ft } = Object, te = globalThis, Ee = te.trustedTypes, _t = Ee ? Ee.emptyScript : "", mt = te.reactiveElementPolyfillSupport, B = (s, e) => s, J = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? _t : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, _e = (s, e) => !lt(s, e), ke = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: _e };
Symbol.metadata ??= Symbol("metadata"), te.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let N = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ke) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && dt(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: o } = ht(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const d = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ke;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const e = ft(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const t = this.properties, i = [...ut(t), ...pt(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(Se(r));
    } else e !== void 0 && t.push(Se(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise(((e) => this.enableUpdating = e)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((e) => e(this)));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ct(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(((e) => e.hostConnected?.()));
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach(((e) => e.hostDisconnected?.()));
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : J).toAttribute(t, i.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : J;
      this._$Em = r;
      const d = n.fromAttribute(t, o.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, i) {
    if (e !== void 0) {
      const r = this.constructor, o = this[e];
      if (i ??= r.getPropertyOptions(e), !((i.hasChanged ?? _e)(o, t) || i.useDefault && i.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, d = this[r];
        n !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, o, d);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach(((i) => i.hostUpdate?.())), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach(((t) => t.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach(((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[B("elementProperties")] = /* @__PURE__ */ new Map(), N[B("finalized")] = /* @__PURE__ */ new Map(), mt?.({ ReactiveElement: N }), (te.reactiveElementVersions ??= []).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = globalThis, X = me.trustedTypes, Pe = X ? X.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Ze = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Ke = "?" + $, gt = `<${Ke}>`, S = document, V = () => S.createComment(""), W = (s) => s === null || typeof s != "object" && typeof s != "function", ge = Array.isArray, vt = (s) => ge(s) || typeof s?.[Symbol.iterator] == "function", ce = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, He = /-->/g, Ne = />/g, x = RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Me = /'/g, Te = /"/g, Ge = /^(?:script|style|textarea|title)$/i, $t = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), f = $t(1), T = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), De = /* @__PURE__ */ new WeakMap(), w = S.createTreeWalker(S, 129);
function Ye(s, e) {
  if (!ge(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pe !== void 0 ? Pe.createHTML(e) : e;
}
const yt = (s, e) => {
  const t = s.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = j;
  for (let d = 0; d < t; d++) {
    const a = s[d];
    let c, h, l = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, h = n.exec(a), h !== null); ) u = n.lastIndex, n === j ? h[1] === "!--" ? n = He : h[1] !== void 0 ? n = Ne : h[2] !== void 0 ? (Ge.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = x) : h[3] !== void 0 && (n = x) : n === x ? h[0] === ">" ? (n = r ?? j, l = -1) : h[1] === void 0 ? l = -2 : (l = n.lastIndex - h[2].length, c = h[1], n = h[3] === void 0 ? x : h[3] === '"' ? Te : Me) : n === Te || n === Me ? n = x : n === He || n === Ne ? n = j : (n = x, r = void 0);
    const p = n === x && s[d + 1].startsWith("/>") ? " " : "";
    o += n === j ? a + gt : l >= 0 ? (i.push(c), a.slice(0, l) + Ze + a.slice(l) + $ + p) : a + $ + (l === -2 ? d : p);
  }
  return [Ye(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
let he = class Je {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const d = e.length - 1, a = this.parts, [c, h] = yt(e, t);
    if (this.el = Je.createElement(c, i), w.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = w.nextNode()) !== null && a.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(Ze)) {
          const u = h[n++], p = r.getAttribute(l).split($), b = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: b[2], strings: p, ctor: b[1] === "." ? xt : b[1] === "?" ? At : b[1] === "@" ? wt : se }), r.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: o }), r.removeAttribute(l));
        if (Ge.test(r.tagName)) {
          const l = r.textContent.split($), u = l.length - 1;
          if (u > 0) {
            r.textContent = X ? X.emptyScript : "";
            for (let p = 0; p < u; p++) r.append(l[p], V()), w.nextNode(), a.push({ type: 2, index: ++o });
            r.append(l[u], V());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ke) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = r.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += $.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = S.createElement("template");
    return i.innerHTML = e, i;
  }
};
function D(s, e, t = s, i) {
  if (e === T) return e;
  let r = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const o = W(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = r : t._$Cl = r), r !== void 0 && (e = D(s, r._$AS(s, e.values), r, i)), e;
}
let bt = class {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, r = (e?.creationScope ?? S).importNode(t, !0);
    w.currentNode = r;
    let o = w.nextNode(), n = 0, d = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new ve(o, o.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (c = new Ct(o, this, e)), this._$AV.push(c), a = i[++d];
      }
      n !== a?.index && (o = w.nextNode(), n++);
    }
    return w.currentNode = S, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}, ve = class Xe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = D(this, e, t), W(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== T && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : vt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && W(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = he.createElement(Ye(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new bt(r, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = De.get(e.strings);
    return t === void 0 && De.set(e.strings, t = new he(e)), t;
  }
  k(e) {
    ge(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const o of e) r === t.length ? t.push(i = new Xe(this.O(V()), this.O(V()), this, this.options)) : i = t[r], i._$AI(o), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}, se = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, o) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, t = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = D(this, e, t, 0), n = !W(e) || e !== this._$AH && e !== T, n && (this._$AH = e);
    else {
      const d = e;
      let a, c;
      for (e = o[0], a = 0; a < o.length - 1; a++) c = D(this, d[i + a], t, a), c === T && (c = this._$AH[a]), n ||= !W(c) || c !== this._$AH[a], c === _ ? e = _ : e !== _ && (e += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}, xt = class extends se {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}, At = class extends se {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}, wt = class extends se {
  constructor(e, t, i, r, o) {
    super(e, t, i, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = D(this, e, t, 0) ?? _) === T) return;
    const i = this._$AH, r = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== _ && (i === _ || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}, Ct = class {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    D(this, e);
  }
};
const St = me.litHtmlPolyfillSupport;
St?.(he, ve), (me.litHtmlVersions ??= []).push("3.3.1");
const Et = (s, e, t) => {
  const i = t?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    i._$litPart$ = r = new ve(e.insertBefore(V(), o), o, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis;
let M = class extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Et(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return T;
  }
};
M._$litElement$ = !0, M.finalized = !0, $e.litElementHydrateSupport?.({ LitElement: M });
const kt = $e.litElementPolyfillSupport;
kt?.({ LitElement: M });
($e.litElementVersions ??= []).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qe = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer((() => {
    customElements.define(s, e);
  })) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = { attribute: !0, type: String, converter: J, reflect: !1, hasChanged: _e }, Ht = (s = Pt, e, t) => {
  const { kind: i, metadata: r } = t;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(t.name, s), i === "accessor") {
    const { name: n } = t;
    return { set(d) {
      const a = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(n, a, s);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, s, d), d;
    } };
  }
  if (i === "setter") {
    const { name: n } = t;
    return function(d) {
      const a = this[n];
      e.call(this, d), this.requestUpdate(n, a, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ie(s) {
  return (e, t) => typeof t == "object" ? Ht(s, e, t) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ye(s) {
  return ie({ ...s, state: !0, attribute: !1 });
}
const et = [
  { name: "entity", required: !0, selector: { entity: {} } },
  { name: "name", selector: { text: {}, placeholder: "Custom name" } },
  { name: "image", selector: { text: { placeholder: "URL to an image" } } },
  { name: "icon", selector: { icon: {} } },
  { name: "show_name", selector: { boolean: {} } },
  { name: "show_state", selector: { boolean: {} } },
  { name: "show_devices", selector: { boolean: {} } },
  {
    name: "badge_style",
    selector: {
      select: {
        options: [
          { value: "icon_text", label: "Icon + Text" },
          { value: "icon_only", label: "Nur Icon" },
          { value: "text_only", label: "Nur Text" }
        ]
      }
    }
  },
  {
    name: "device_attributes",
    selector: {
      select: {
        multiple: !0,
        options: [
          "battery",
          "battery_level",
          "gps_accuracy",
          "source_type",
          "last_update_trigger",
          "latitude",
          "longitude",
          "altitude",
          "speed",
          "direction"
        ],
        placeholder: "e.g. battery, bluetooth"
      }
    }
  },
  { name: "excluded_entities", selector: { entity: { multiple: !0 }, domain: "device_tracker" } }
], Nt = "langChanged";
function Mt(s, e, t) {
  return Object.entries(Ue(e || {})).reduce((i, [r, o]) => i.replace(new RegExp(`{{[  ]*${r}[  ]*}}`, "gm"), String(Ue(o))), s);
}
function Tt(s, e) {
  const t = s.split(".");
  let i = e.strings;
  for (; i != null && t.length > 0; )
    i = i[t.shift()];
  return i != null ? i.toString() : null;
}
function Ue(s) {
  return typeof s == "function" ? s() : s;
}
const Dt = () => ({
  loader: () => Promise.resolve({}),
  empty: (s) => `[${s}]`,
  lookup: Tt,
  interpolate: Mt,
  translationCache: {}
});
let tt = Dt();
function Ut(s) {
  window.dispatchEvent(new CustomEvent(Nt, { detail: s }));
}
function It(s, e, t = tt) {
  Ut({
    previousStrings: t.strings,
    previousLang: t.lang,
    lang: t.lang = s,
    strings: t.strings = e
  });
}
async function Ot(s, e = tt) {
  const t = await e.loader(s, e);
  e.translationCache = {}, It(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var le;
const Q = window, U = Q.trustedTypes, Ie = U ? U.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ue = "$lit$", y = `lit$${(Math.random() + "").slice(9)}$`, st = "?" + y, Lt = `<${st}>`, E = document, ee = () => E.createComment(""), F = (s) => s === null || typeof s != "object" && typeof s != "function", it = Array.isArray, zt = (s) => it(s) || typeof s?.[Symbol.iterator] == "function", de = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Oe = /-->/g, Le = />/g, A = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ze = /'/g, je = /"/g, rt = /^(?:script|style|textarea|title)$/i, q = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), Re = /* @__PURE__ */ new WeakMap(), C = E.createTreeWalker(E, 129, null, !1);
function nt(s, e) {
  if (!Array.isArray(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ie !== void 0 ? Ie.createHTML(e) : e;
}
const jt = (s, e) => {
  const t = s.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : "", n = R;
  for (let d = 0; d < t; d++) {
    const a = s[d];
    let c, h, l = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, h = n.exec(a), h !== null); ) u = n.lastIndex, n === R ? h[1] === "!--" ? n = Oe : h[1] !== void 0 ? n = Le : h[2] !== void 0 ? (rt.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = A) : h[3] !== void 0 && (n = A) : n === A ? h[0] === ">" ? (n = r ?? R, l = -1) : h[1] === void 0 ? l = -2 : (l = n.lastIndex - h[2].length, c = h[1], n = h[3] === void 0 ? A : h[3] === '"' ? je : ze) : n === je || n === ze ? n = A : n === Oe || n === Le ? n = R : (n = A, r = void 0);
    const p = n === A && s[d + 1].startsWith("/>") ? " " : "";
    o += n === R ? a + Lt : l >= 0 ? (i.push(c), a.slice(0, l) + ue + a.slice(l) + y + p) : a + y + (l === -2 ? (i.push(void 0), d) : p);
  }
  return [nt(s, o + (s[t] || "<?>") + (e === 2 ? "</svg>" : "")), i];
};
class Z {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const d = e.length - 1, a = this.parts, [c, h] = jt(e, t);
    if (this.el = Z.createElement(c, i), C.currentNode = this.el.content, t === 2) {
      const l = this.el.content, u = l.firstChild;
      u.remove(), l.append(...u.childNodes);
    }
    for (; (r = C.nextNode()) !== null && a.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const l = [];
          for (const u of r.getAttributeNames()) if (u.endsWith(ue) || u.startsWith(y)) {
            const p = h[n++];
            if (l.push(u), p !== void 0) {
              const b = r.getAttribute(p.toLowerCase() + ue).split(y), L = /([.?@])?(.*)/.exec(p);
              a.push({ type: 1, index: o, name: L[2], strings: b, ctor: L[1] === "." ? Bt : L[1] === "?" ? Wt : L[1] === "@" ? Ft : ne });
            } else a.push({ type: 6, index: o });
          }
          for (const u of l) r.removeAttribute(u);
        }
        if (rt.test(r.tagName)) {
          const l = r.textContent.split(y), u = l.length - 1;
          if (u > 0) {
            r.textContent = U ? U.emptyScript : "";
            for (let p = 0; p < u; p++) r.append(l[p], ee()), C.nextNode(), a.push({ type: 2, index: ++o });
            r.append(l[u], ee());
          }
        }
      } else if (r.nodeType === 8) if (r.data === st) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(y, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += y.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = E.createElement("template");
    return i.innerHTML = e, i;
  }
}
function I(s, e, t = s, i) {
  var r, o, n, d;
  if (e === q) return e;
  let a = i !== void 0 ? (r = t._$Co) === null || r === void 0 ? void 0 : r[i] : t._$Cl;
  const c = F(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== c && ((o = a?._$AO) === null || o === void 0 || o.call(a, !1), c === void 0 ? a = void 0 : (a = new c(s), a._$AT(s, t, i)), i !== void 0 ? ((n = (d = t)._$Co) !== null && n !== void 0 ? n : d._$Co = [])[i] = a : t._$Cl = a), a !== void 0 && (e = I(s, a._$AS(s, e.values), a, i)), e;
}
class Rt {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    var t;
    const { el: { content: i }, parts: r } = this._$AD, o = ((t = e?.creationScope) !== null && t !== void 0 ? t : E).importNode(i, !0);
    C.currentNode = o;
    let n = C.nextNode(), d = 0, a = 0, c = r[0];
    for (; c !== void 0; ) {
      if (d === c.index) {
        let h;
        c.type === 2 ? h = new re(n, n.nextSibling, this, e) : c.type === 1 ? h = new c.ctor(n, c.name, c.strings, this, e) : c.type === 6 && (h = new qt(n, this, e)), this._$AV.push(h), c = r[++a];
      }
      d !== c?.index && (n = C.nextNode(), d++);
    }
    return C.currentNode = E, o;
  }
  v(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class re {
  constructor(e, t, i, r) {
    var o;
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cp = (o = r?.isConnected) === null || o === void 0 || o;
  }
  get _$AU() {
    var e, t;
    return (t = (e = this._$AM) === null || e === void 0 ? void 0 : e._$AU) !== null && t !== void 0 ? t : this._$Cp;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = I(this, e, t), F(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== q && this._(e) : e._$litType$ !== void 0 ? this.g(e) : e.nodeType !== void 0 ? this.$(e) : zt(e) ? this.T(e) : this._(e);
  }
  k(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  $(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.k(e));
  }
  _(e) {
    this._$AH !== m && F(this._$AH) ? this._$AA.nextSibling.data = e : this.$(E.createTextNode(e)), this._$AH = e;
  }
  g(e) {
    var t;
    const { values: i, _$litType$: r } = e, o = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Z.createElement(nt(r.h, r.h[0]), this.options)), r);
    if (((t = this._$AH) === null || t === void 0 ? void 0 : t._$AD) === o) this._$AH.v(i);
    else {
      const n = new Rt(o, this), d = n.u(this.options);
      n.v(i), this.$(d), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = Re.get(e.strings);
    return t === void 0 && Re.set(e.strings, t = new Z(e)), t;
  }
  T(e) {
    it(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const o of e) r === t.length ? t.push(i = new re(this.k(ee()), this.k(ee()), this, this.options)) : i = t[r], i._$AI(o), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) === null || i === void 0 || i.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const r = e.nextSibling;
      e.remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cp = e, (t = this._$AP) === null || t === void 0 || t.call(this, e));
  }
}
class ne {
  constructor(e, t, i, r, o) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = m;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e, t = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = I(this, e, t, 0), n = !F(e) || e !== this._$AH && e !== q, n && (this._$AH = e);
    else {
      const d = e;
      let a, c;
      for (e = o[0], a = 0; a < o.length - 1; a++) c = I(this, d[i + a], t, a), c === q && (c = this._$AH[a]), n || (n = !F(c) || c !== this._$AH[a]), c === m ? e = m : e !== m && (e += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Bt extends ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
const Vt = U ? U.emptyScript : "";
class Wt extends ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    e && e !== m ? this.element.setAttribute(this.name, Vt) : this.element.removeAttribute(this.name);
  }
}
class Ft extends ne {
  constructor(e, t, i, r, o) {
    super(e, t, i, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    var i;
    if ((e = (i = I(this, e, t, 0)) !== null && i !== void 0 ? i : m) === q) return;
    const r = this._$AH, o = e === m && r !== m || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== m && (r === m || o);
    o && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t, i;
    typeof this._$AH == "function" ? this._$AH.call((i = (t = this.options) === null || t === void 0 ? void 0 : t.host) !== null && i !== void 0 ? i : this.element, e) : this._$AH.handleEvent(e);
  }
}
class qt {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    I(this, e);
  }
}
const Be = Q.litHtmlPolyfillSupport;
Be?.(Z, re), ((le = Q.litHtmlVersions) !== null && le !== void 0 ? le : Q.litHtmlVersions = []).push("2.8.0");
var Ve, We;
(function(s) {
  s.language = "language", s.system = "system", s.comma_decimal = "comma_decimal", s.decimal_comma = "decimal_comma", s.space_comma = "space_comma", s.none = "none";
})(Ve || (Ve = {})), (function(s) {
  s.language = "language", s.system = "system", s.am_pm = "12", s.twenty_four = "24";
})(We || (We = {}));
var ot = function(s, e, t, i) {
  i = i || {}, t = t ?? {};
  var r = new Event(e, { bubbles: i.bubbles === void 0 || i.bubbles, cancelable: !!i.cancelable, composed: i.composed === void 0 || i.composed });
  return r.detail = t, s.dispatchEvent(r), r;
}, Zt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, oe = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Kt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && Zt(e, t, r), r;
};
let O = class extends M {
  constructor() {
    super(), this._computeLabel = (s) => ({
      entity: "Person Entity",
      name: "Custom Name",
      image: "Image URL",
      icon: "Icon",
      show_name: "Show Name",
      show_state: "Show State",
      show_devices: "Show Devices",
      badge_style: "Badge Style",
      device_attributes: "Device Attributes",
      excluded_entities: "Excluded Entities"
    })[s.name] || s.name, console.log("🎨 EnhancedPersonCardEditor constructor called");
  }
  static get styles() {
    return qe`
      .card-config {
        padding: 16px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--card-divider-color);
      }

      .header-title {
        font-size: 24px;
        font-weight: bold;
        color: var(--primary-text-color, #dc143c);
      }

      .header-subtitle {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      ha-form {
        display: block;
        margin-bottom: 24px;
      }

      .preview {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 20px;
        margin-top: 24px;
      }

      .preview-title {
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .preview-config {
        font-family: "SFMono-Regular", "Monaco", "Consolas", monospace;
        font-size: 13px;
        color: var(--secondary-text-color);
        background: var(--code-editor-background-color, #f8f8f8);
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        white-space: pre-wrap;
        line-height: 1.4;
        border: 1px solid var(--divider-color);
      }

      @media (max-width: 768px) {
        .card-config {
          padding: 12px;
        }
      }
    `;
  }
  connectedCallback() {
    super.connectedCallback(), console.log("🎨 EnhancedPersonCardEditor connected to DOM"), console.log("🎨 HASS available:", !!this.hass);
  }
  setConfig(s) {
    const t = {
      ...{
        type: "custom:enhanced-person-card",
        entity: "",
        show_name: !0,
        show_state: !0,
        show_devices: !0,
        badge_style: "icon_text"
      },
      ...s
    };
    Object.keys(t).forEach((i) => {
      s[i] !== void 0 && (t[i] = s[i]);
    }), this._config = t;
  }
  render() {
    if (Ot(
      (this.hass.selectedLanguage || this.hass.language || "en").substring(
        0,
        2
      )
    ), !this.hass)
      return f`
        <div class="card-config">
          <div class="warning">⚠️ Waiting for Home Assistant connection...</div>
        </div>
      `;
    if (!this._config)
      return f`
        <div class="card-config">
          <div class="warning">⚠️ Loading configuration...</div>
        </div>
      `;
    const s = { ...this._config };
    return f`
      <div class="card-config">
        <!-- Header -->
        <div class="section">
          <div class="section-header">
            🌦️ Enhanced Person Card Configuration
          </div>
          <div class="section-description">
            Configure your Enhanced Person with the options below. All changes
            are saved automatically.
          </div>
        </div>

        <!-- HA Form -->
        <ha-form
          .hass=${this.hass}
          .data=${s}
          .schema=${et}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <!-- Configuration Preview -->
        ${this._config.entity ? f`
              <div class="preview">
                <div class="preview-title">📋 YAML Configuration</div>
                <div class="preview-config">${this._renderConfigPreview()}</div>
              </div>
            ` : f`
              <div class="warning">
                ⚠️ Please select a device to complete the configuration.
              </div>
            `}
      </div>
    `;
  }
  _renderConfigPreview() {
    const s = {
      type: "custom:enhanced-person-card",
      ...this._config
    };
    return Object.keys(s).forEach((e) => {
      (s[e] === void 0 || s[e] === "") && delete s[e];
    }), Object.entries(s).map(([e, t]) => typeof t == "string" ? `${e}: "${t}"` : `${e}: ${t}`).join(`
`);
  }
  _valueChanged(s) {
    if (!this._config || !this.hass)
      return;
    const e = {
      ...this._config,
      ...s.detail.value,
      type: "custom:enhanced-person-card"
    };
    Object.keys(e).forEach((t) => {
      (e[t] === "" || e[t] === void 0) && delete e[t];
    }), this._config = e, ot(this, "config-changed", { config: this._config });
  }
  static get properties() {
    return {
      hass: {},
      _config: {}
    };
  }
};
oe([
  ie({ attribute: !1 })
], O.prototype, "hass", 2);
oe([
  ie({ attribute: !1 })
], O.prototype, "lovelace", 2);
oe([
  ye()
], O.prototype, "_config", 2);
O = oe([
  Qe("enhanced-person-card-editor")
], O);
var Gt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, ae = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Yt(e, t) : e, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && Gt(e, t, r), r;
};
console.log("🎯 About to apply @customElement decorator to EnhancedPersonCard");
console.log("🎯 customElements registry available:", !!customElements);
let K = class extends M {
  constructor() {
    super(), this._usedSensors = /* @__PURE__ */ new Set();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  static get styles() {
    return qe`
        :host {
            display: block;
            background: var(
            --ha-card-background,
            var(--card-background-color, #fff)
            );
            border-radius: 16px;
            box-shadow: var(
            --ha-card-box-shadow,
            0 4px 20px var(--box-shadow-color, rgba(0, 0, 0, 0.1))
            );
            font-family: var(
            --primary-font-family,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif
            );
            color: var(--primary-text-color, #fff);
        }
        .person-card {
            padding: 16px;
        }
        .person-card:hover {
          box-shadow: var(--ha-card-box-shadow-hover, var(--ha-card-box-shadow));
        }

        .person-card.loading, .person-card.error {
          justify-content: center;
          align-items: center;
          cursor: default;
        }

        .person-card.error {
          background: var(--error-color);
          color: var(--text-primary-color);
        }

        .person-header {
          margin-bottom: 12px;
        }

        .person-name {
          font-weight: var(--paper-font-headline_-_font-weight);
          font-size: var(--person-name-font-size, var(--paper-font-subhead_-_font-size));
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .person-content {
          display: flex;
          align-items: stretch;
          gap: 16px;
          flex: 1;
        }

        .person-left-section {
          flex: 0 0 var(--person-left-width, 40%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .person-avatar-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .person-avatar {
          width: var(--dynamic-icon-size, 80px);
          height: var(--dynamic-icon-size, 80px);
          border-radius: 50%;
          background: transparent;
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: calc(var(--dynamic-icon-size, 80px) * 0.45);
          flex-shrink: 0;
          overflow: hidden;
        }

        .person-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .fallback-icon {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-text-color);
        }

        .fallback-icon ha-icon {
          --mdc-icon-size: var(--dynamic-icon-size, 64px);
          color: var(--primary-text-color);
        }

        .person-status-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          color: white;
          background: var(--secondary-text-color);
          text-transform: uppercase;
          white-space: nowrap;
          border: 2px solid var(--ha-card-background, var(--card-background-color));
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 24px;
          min-height: 24px;
          justify-content: center;
        }

        .person-status-badge.icon-only {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .person-status-badge.icon-only ha-icon {
          --mdc-icon-size: 16px;
        }

        .person-status-badge.state-home {
          background: var(--state-person-home-color, var(--success-color, #4caf50));
        }

        .person-status-badge.state-away {
          background: var(--state-person-away-color, var(--warning-color, #ff9800));
        }

        .person-status-badge.state-unknown {
          background: var(--state-person-unknown-color, var(--info-color, var(--secondary-text-color)));
        }

        .person-devices-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .devices-header {
          font-size: 14px;
          font-weight: bold;
          color: var(--primary-text-color);
          margin-bottom: 8px;
          border-bottom: 1px solid var(--divider-color);
          padding-bottom: 4px;
        }

        .devices-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .device-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: transparent;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .device-item:hover {
          background: var(--secondary-background-color, rgba(0,0,0,0.05));
        }

        .device-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-text-color);
        }

        .device-icon ha-icon {
          --mdc-icon-size: 20px;
        }

        .device-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .device-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .device-attributes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }

        .device-attribute {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          overflow: hidden; /* Prevent text from overflowing */
          position: relative;
          max-width: 180px; /* Limit total width to prevent overlap */
        }

        .device-attribute:hover {
          background: var(--secondary-background-color, rgba(0,0,0,0.1));
        }

        .attribute-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }

        .attribute-icon ha-icon {
          --mdc-icon-size: 12px;
        }

        .attribute-name {
          font-weight: 500;
          white-space: nowrap;
          color: var(--secondary-text-color);
          position: relative;
          display: inline-block;
          max-width: 120px; /* Increased from 90px to show more text */
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .attribute-name.scrolling {
          animation: scroll-text 6s ease-in-out infinite;
          overflow: hidden; /* Keep overflow hidden even when scrolling */
          text-overflow: unset;
          max-width: 90px; /* Keep same width for consistency */
        }

        .attribute-value {
          font-weight: 600;
          white-space: nowrap;
          color: var(--primary-text-color);
        }

        @keyframes scroll-text {
          0%, 25% { 
            transform: translateX(0); 
          }
          75%, 100% { 
            transform: translateX(-15%); 
          }
        }

        .no-devices {
          text-align: center;
          color: var(--secondary-text-color);
          font-size: 12px;
          font-style: italic;
          padding: 20px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--disabled-text-color);
          border-top: 2px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        .loading-text, .error-text {
          color: var(--secondary-text-color);
          font-size: var(--paper-font-body1_-_font-size);
        }

        .error-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .person-card {
            flex-direction: column;
            gap: 12px;
          }
          
          .person-left-section {
            flex: none;
            justify-content: center;
          }
          
          .person-devices-section {
            flex: none;
          }
          
          .person-avatar {
            width: calc(var(--dynamic-icon-size, 80px) * 0.75) !important;
            height: calc(var(--dynamic-icon-size, 80px) * 0.75) !important;
            font-size: calc(var(--dynamic-icon-size, 80px) * 0.75 * 0.45) !important;
          }
          
          .fallback-icon ha-icon {
            --mdc-icon-size: calc(var(--dynamic-icon-size, 80px) * 0.6) !important;
          }

          .device-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: transparent;
            border-radius: 8px;
            transition: background-color 0.2s ease;
            cursor: pointer;
          }          
          
          .person-devices-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
    `;
  }
  setConfig(s) {
    if (!s.entity)
      throw new Error("You need to define an entity");
    this._config = s;
  }
  static getConfigElement() {
    return document.createElement("enhanced-person-card-editor");
  }
  // Schema for the visual editor
  static getConfigSchema() {
    return et;
  }
  static getStubConfig() {
    return {
      type: "custom:enhanced-person-card",
      entity: "person.your_name",
      name: "Your Name",
      icon: "mdi:account",
      image: "",
      show_name: !0,
      show_state: !0,
      show_devices: !0,
      badge_style: "icon_text",
      device_attributes: ["battery_level", "source_type", "zone"],
      excluded_entities: []
    };
  }
  getCardSize() {
    const s = this._config;
    return s?.grid_options?.rows ? Number(s.grid_options.rows) : s?.layout_options?.grid_rows ? Number(s.layout_options.grid_rows) : s && "grid_rows" in s ? Number(s.grid_rows) : 3;
  }
  getCardColumns() {
    const s = this._config;
    return s?.grid_options?.columns !== void 0 ? s.grid_options.columns : s?.layout_options?.grid_columns !== void 0 ? s.layout_options.grid_columns : s && "grid_columns" in s && s.grid_columns !== void 0 ? s.grid_columns : 1;
  }
  updated(s) {
    super.updated(s);
  }
  render() {
    if (!this.hass || !this._config)
      return f``;
    if (!this.hass)
      return f`<div class="person-card error">
        <div class="error-icon">⚠️</div>
        <div class="error-text">Home Assistant not available</div>
      </div>`;
    const s = this._config.entity, e = this.hass.states[s];
    if (!e)
      return f`<div class="person-card error">
        <div class="error-icon">❌</div>
        <div class="error-text">Entity "${s}" not found</div>
      </div>`;
    const t = this._config, i = t.name || e.attributes.friendly_name || t.entity, r = e.state, o = t.image || e.attributes.entity_picture, n = t.icon, d = t.show_name !== !1, a = t.show_state !== !1, c = t.show_devices !== !1, h = this._getStateText(r), l = this._getStateClass(r), u = this._getPersonDevices(e);
    return this._usedSensors.clear(), f`
      <div class="person-card" data-entity="${t.entity}">
        ${d ? f`<div class="person-header">
              <div class="person-name">${i}</div>
            </div>` : ""}
        <div class="person-content">
          <div class="person-left-section">
            <div class="person-avatar-container">
              <div class="person-avatar">
                ${this._renderIcon(o, n, i)}
              </div>
              ${a ? f`<div
                    class="person-status-badge ${l} ${t.badge_style === "icon_only" ? "icon-only" : ""}"
                  >
                    ${h}
                  </div>` : ""}
            </div>
          </div>
          ${c ? f`<div class="person-devices-section">
                <div class="devices-header">Devices</div>
                <div class="devices-list">
                  ${u.length > 0 ? u.map((p) => this._renderDevice(p)) : f`<div class="no-devices">No devices found</div>`}
                </div>
              </div>` : ""}
        </div>
      </div>
    `;
  }
  _getStateText(s) {
    const e = this._config?.badge_style || "icon_text", t = this._getStateIcon(s), i = this._getLocationDisplayName(s);
    switch (e) {
      case "icon_only":
        return this._renderMDI(t);
      case "text_only":
        return i;
      case "icon_text":
      default:
        return f`${this._renderMDI(t)} ${i}`;
    }
  }
  _getStateIcon(s) {
    switch (s) {
      case "home":
        return "mdi:home";
      case "not_home":
        return "mdi:home-export-outline";
      case "unknown":
        return "mdi:help-circle-outline";
      default:
        return "mdi:map-marker";
    }
  }
  _getLocationDisplayName(s) {
    if (!s || s === "unknown") return "Unknown";
    switch (s) {
      case "home":
        return "Home";
      case "not_home":
        return "Away";
      case "unknown":
        return "Unknown";
    }
    let e = s.replace(/_/g, " ");
    return e = e.split(" ").map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(" "), e;
  }
  _getStateClass(s) {
    switch (s) {
      case "home":
        return "state-home";
      case "not_home":
        return "state-away";
      default:
        return "state-unknown";
    }
  }
  _getPersonDevices(s) {
    if (!this.hass || !s) return [];
    const t = this._config?.excluded_entities || [], i = s.entity_id, r = [];
    return s.attributes.device_trackers && Array.isArray(s.attributes.device_trackers) && s.attributes.device_trackers.forEach((o) => {
      if (!t.includes(o)) {
        const n = this.hass.states[o];
        n && n.attributes.source_type && r.push(n);
      }
    }), r.length === 0 && Object.values(this.hass.states).forEach((o) => {
      o.entity_id.startsWith("device_tracker.") && !t.includes(o.entity_id) && o.attributes.source_type && o.attributes.person === i && r.push(o);
    }), r.sort((o, n) => {
      const d = o.attributes.friendly_name || o.entity_id;
      return (n.attributes.friendly_name || n.entity_id).length - d.length;
    }), r;
  }
  _renderIcon(s, e, t) {
    return s ? f`<img
          src="${s}"
          alt="${t}"
          @error="${(i) => i.target.style.display = "none"}"
        />
        <div class="fallback-icon" style="display: none;">
          ${e ? this._renderMDI(e) : this._renderMDI("mdi:account")}
        </div>` : e ? f`<div class="fallback-icon">${this._renderMDI(e)}</div>` : f`<div class="fallback-icon">
        ${this._renderMDI("mdi:account")}
      </div>`;
  }
  _renderMDI(s) {
    return s.startsWith("mdi:") ? f`<ha-icon .icon="${s}"></ha-icon>` : s;
  }
  _renderDevice(s) {
    const e = s.attributes.friendly_name || s.entity_id, t = this._getDeviceIcon(s), i = this._config?.device_attributes || [
      "battery_level",
      "gps_accuracy",
      "source_type"
    ], r = [];
    return i.forEach((o) => {
      if (o === "zone") {
        const n = s.state, d = this._formatDeviceState(n), a = this._getAttributeIcon("zone", n), c = this._getAttributeLabel("zone");
        r.push({
          name: o,
          label: c,
          value: n,
          displayValue: d,
          icon: a,
          entityName: e
        });
      } else {
        const n = this._getAttributeEntriesForDevice(
          s,
          o
        );
        r.push(...n);
      }
    }), f`
      <div
        class="device-item"
        data-entity="${s.entity_id}"
        @click=${this._onDeviceClick}
        tabindex="0"
        style="cursor: pointer;"
      >
        <div class="device-icon">${this._renderMDI(t)}</div>
        <div class="device-info">
          <div class="device-name">${e}</div>
          ${r.length > 0 ? f`
                <div class="device-attributes">
                  ${(() => {
      const o = {};
      return r.forEach((n) => {
        o[n.label] = (o[n.label] || 0) + 1;
      }), r.map(
        (n) => f`
                        <span
                          class="device-attribute"
                          data-attribute="${n.name}"
                          title="${n.label}: ${n.displayValue} (${n.entityName || e})"
                        >
                          <span
                            class="attribute-icon"
                            style="color: ${n.icon.color}"
                          >
                            ${this._renderMDI(n.icon.icon)}
                          </span>
                          <span class="attribute-name">
                            ${n.label}
                            ${o[n.label] > 1 && n.entityName ? f`<span class="attribute-entity"> (${n.entityName})</span>` : ""}
                            :
                          </span>
                          <span class="attribute-value"
                            >${n.displayValue}</span
                          >
                        </span>
                      `
      );
    })()}
                </div>
              ` : ""}
        </div>
      </div>
    `;
  }
  /**
   * Click-Handler für Geräte: holt Entity-ID aus data-entity und öffnet Dialog
   */
  _onDeviceClick(s) {
    console.debug("🔍 Device clicked, showing more info");
    const e = s.currentTarget;
    console.debug("🔍 Click target:", e);
    const t = e.getAttribute("data-entity");
    t && this._showMoreInfo(t), s.stopPropagation();
  }
  /**
  * Öffnet das Standard-HA-Dialog für das angeklickte Gerät
  */
  _showMoreInfo(s) {
    console.debug("🔍 Showing more info for", s), ot(this, "hass-more-info", { entityId: s });
  }
  _getDeviceIcon(s) {
    return s.entity_id.startsWith("device_tracker.") ? s.attributes.source_type === "gps" ? "mdi:cellphone" : s.attributes.source_type === "bluetooth" ? "mdi:bluetooth" : s.attributes.source_type === "router" ? "mdi:router-wireless" : "mdi:crosshairs-gps" : "mdi:devices";
  }
  _getAttributeLabel(s) {
    return {
      battery_level: "Battery",
      gps_accuracy: "GPS Accuracy",
      source_type: "Source",
      zone: "Zone",
      latitude: "Latitude",
      longitude: "Longitude",
      altitude: "Altitude",
      course: "Course",
      speed: "Speed",
      ip: "IP Address",
      hostname: "Hostname",
      mac: "MAC Address",
      last_seen: "Last Seen"
    }[s] || s;
  }
  _getAttributeIcon(s, e) {
    switch (s) {
      case "battery_level": {
        const t = parseInt(e);
        return t > 80 ? { icon: "mdi:battery", color: "#4caf50" } : t > 60 ? { icon: "mdi:battery-60", color: "#8bc34a" } : t > 40 ? { icon: "mdi:battery-40", color: "#ff9800" } : t > 20 ? { icon: "mdi:battery-20", color: "#ff5722" } : { icon: "mdi:battery-alert", color: "#f44336" };
      }
      case "gps_accuracy": {
        const t = parseInt(e);
        return t <= 10 ? { icon: "mdi:crosshairs-gps", color: "#4caf50" } : t <= 50 ? { icon: "mdi:crosshairs-gps", color: "#ff9800" } : { icon: "mdi:crosshairs-question", color: "#f44336" };
      }
      case "source_type":
        switch (e) {
          case "gps":
            return { icon: "mdi:crosshairs-gps", color: "#2196f3" };
          case "bluetooth":
            return { icon: "mdi:bluetooth", color: "#3f51b5" };
          case "router":
            return { icon: "mdi:router-wireless", color: "#607d8b" };
          default:
            return { icon: "mdi:help-circle", color: "#757575" };
        }
      case "altitude":
        return { icon: "mdi:elevation-rise", color: "#795548" };
      case "course":
        return { icon: "mdi:compass", color: "#9c27b0" };
      case "speed": {
        const t = parseInt(e);
        return t > 50 ? { icon: "mdi:speedometer", color: "#f44336" } : t > 10 ? { icon: "mdi:speedometer-medium", color: "#ff9800" } : { icon: "mdi:speedometer-slow", color: "#4caf50" };
      }
      case "zone":
        return { icon: "mdi:map-marker-radius", color: "#2196f3" };
      case "latitude":
      case "longitude":
        return { icon: "mdi:map-marker", color: "#9c27b0" };
      case "ip":
        return { icon: "mdi:ip-network", color: "#607d8b" };
      case "hostname":
        return { icon: "mdi:dns", color: "#607d8b" };
      case "mac":
        return { icon: "mdi:network", color: "#607d8b" };
      case "last_seen":
        return { icon: "mdi:clock-outline", color: "#757575" };
      default:
        return { icon: "mdi:information-outline", color: "#757575" };
    }
  }
  _getAttributeDisplayValue(s, e) {
    switch (s) {
      case "battery_level":
        return `${e}%`;
      case "gps_accuracy":
        return `${e}m`;
      case "altitude":
        return `${e}m`;
      case "speed":
        return `${e} km/h`;
      case "course":
        return `${e}°`;
      case "zone":
        return String(e).replace(/_/g, " ");
      case "latitude":
        return `${parseFloat(e).toFixed(4)}°`;
      case "longitude":
        return `${parseFloat(e).toFixed(4)}°`;
      case "ip":
      case "hostname":
        return String(e);
      case "mac":
        return String(e).toUpperCase();
      case "last_seen":
        if (e && (e.includes("T") || e.includes("-")))
          try {
            return new Date(e).toLocaleTimeString();
          } catch (t) {
            return console.error("Error parsing last_seen date:", t), String(e);
          }
        return String(e);
      default:
        return String(e);
    }
  }
  _getAttributeEntriesForDevice(s, e) {
    const t = [], i = /* @__PURE__ */ new Set();
    if (!this.hass || !this.hass.states) return t;
    const r = s.attributes.device_id, o = s.entity_id, n = s.attributes.friendly_name || s.entity_id.replace("device_tracker.", ""), a = {
      battery_level: ["battery_level", "battery"],
      signal_strength: ["signal_strength", "wifi_signal", "signal"],
      gps_accuracy: ["gps_accuracy", "accuracy"]
    }[e] || [e];
    return !this.hass || !this.hass.states || Object.values(this.hass.states).forEach((c) => {
      if (!c.entity_id.startsWith("sensor.")) return;
      const h = c.attributes.friendly_name || c.entity_id;
      if (i.has(h)) return;
      let l = !1;
      if (r && c.attributes.device_id === r && (l = !0), !l) {
        const g = c.entity_id.toLowerCase(), z = (c.attributes.friendly_name || "").toLowerCase(), P = o.replace("device_tracker.", "").toLowerCase(), H = (n || "").toLowerCase(), be = this.hass && this.hass.states ? Object.values(this.hass.states).filter((v) => v.entity_id.startsWith("device_tracker.")).map((v) => ({
          entity_id: v.entity_id.replace("device_tracker.", "").toLowerCase(),
          friendly_name: (v.attributes.friendly_name || "").toLowerCase(),
          full_entity: v.entity_id
        })) : [], xe = g === `sensor.${P}` || g.startsWith(`sensor.${P}_`);
        let Ae = !1;
        if (xe) {
          for (const v of be)
            if (v.entity_id !== P && v.entity_id.includes(P) && (g.includes(v.entity_id) || z.includes(v.friendly_name))) {
              Ae = !0;
              break;
            }
        }
        if (xe && !Ae)
          l = !0;
        else if (!l && H && H.length > 3) {
          const v = z.includes(H) || g.includes(H.replace(/\s+/g, "_"));
          let we = !1;
          if (v) {
            for (const G of be)
              if (G.friendly_name !== H && G.friendly_name.length > H.length && (z.includes(G.friendly_name) || g.includes(
                G.friendly_name.replace(/\s+/g, "_")
              ))) {
                we = !0;
                break;
              }
          }
          v && !we && (l = !0);
        }
      }
      if (!l) return;
      const u = c.entity_id.toLowerCase(), p = (c.attributes.friendly_name || "").toLowerCase();
      if (!a.some(
        (g) => u.includes(g) || p.includes(g)
      ) || this._usedSensors.has(c.entity_id) || [
        "battery_state",
        "charging_state",
        "power_state"
      ].some(
        (g) => u.includes(g) || p.includes(g)
      )) return;
      const k = c.state;
      if (k && k !== "unknown" && k !== "unavailable") {
        const g = this._getAttributeDisplayValue(
          e,
          k
        ), z = this._getAttributeIcon(e, k), P = this._getAttributeLabel(e);
        t.push({
          name: e,
          label: P,
          value: k,
          displayValue: g,
          icon: z,
          entityName: h
        }), i.add(h), this._usedSensors.add(c.entity_id);
      }
    }), t;
  }
  _formatDeviceState(s) {
    if (!s || s === "unknown") return "Unknown";
    switch (s) {
      case "home":
        return "Home";
      case "not_home":
        return "Away";
      case "unknown":
        return "Unknown";
    }
    let e = s.replace(/_/g, " ");
    return e = e.split(" ").map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(" "), e;
  }
  static get properties() {
    return {
      hass: { attribute: !1 },
      _config: { attribute: !1 }
    };
  }
};
ae([
  ie({ attribute: !1 })
], K.prototype, "hass", 2);
ae([
  ye()
], K.prototype, "_config", 2);
ae([
  ye()
], K.prototype, "_usedSensors", 2);
K = ae([
  Qe("enhanced-person-card")
], K);
var as = O;
window.customCards || (window.customCards = []);
window.customCards.push({
  type: "enhanced-person-card",
  name: "Enhanced Person Card",
  description: "a",
  preview: !0,
  documentationURL: "https://github.com/dmoo500/ha-enhanced-person-card"
});
console.log("✅ EnhancedPersonCard fully loaded and registered");
export {
  K as EnhancedPersonCard,
  as as default
};
//# sourceMappingURL=enhanced-person-card.js.map
