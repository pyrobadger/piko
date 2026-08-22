//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ne = /-\w/g, T = te((e) => e.replace(ne, (e) => e.slice(1).toUpperCase())), re = /\B([A-Z])/g, E = te((e) => e.replace(re, "-$1").toLowerCase()), ie = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = te((e) => e ? `on${ie(e)}` : ""), D = (e, t) => !Object.is(e, t), oe = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, O = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce = (e) => {
	let t = g(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, le, ue = () => le ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function de(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? he(r) : de(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var fe = /;(?![^(]*\))/g, pe = /:([^]+)/, me = /\/\*[^]*?\*\//g;
function he(e) {
	let t = {};
	return e.replace(me, "").split(fe).forEach((e) => {
		if (e) {
			let n = e.split(pe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function ge(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = ge(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var _e = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ve = /* @__PURE__ */ e(_e);
_e + "";
function ye(e) {
	return !!e || e === "";
}
function be(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = xe(e[r], t[r]);
	return n;
}
function xe(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? be(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !xe(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var k, Se = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && k && (k.active ? (this.parent = k, this.index = (k.scopes || (k.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = k;
			try {
				return k = this, e();
			} finally {
				k = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = k, k = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (k === this) k = this.prevScope;
			else {
				let e = k;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Ce() {
	return k;
}
var A, we = /* @__PURE__ */ new WeakSet(), Te = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, k && (k.active ? k.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, we.has(this) && (we.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ke(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ve(this), Me(this);
		let e = A, t = j;
		A = this, j = !0;
		try {
			return this.fn();
		} finally {
			Ne(this), A = e, j = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ie(e);
			this.deps = this.depsTail = void 0, Ve(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? we.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Pe(this) && this.run();
	}
	get dirty() {
		return Pe(this);
	}
}, Ee = 0, De, Oe;
function ke(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Oe, Oe = e;
		return;
	}
	e.next = De, De = e;
}
function Ae() {
	Ee++;
}
function je() {
	if (--Ee > 0) return;
	if (Oe) {
		let e = Oe;
		for (Oe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; De;) {
		let t = De;
		for (De = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Me(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ne(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ie(r), Le(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Fe(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Fe(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === He) || (e.globalVersion = He, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Pe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = A, r = j;
	A = e, j = !0;
	try {
		Me(e);
		let n = e.fn(e._value);
		(t.version === 0 || D(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		A = n, j = r, Ne(e), e.flags &= -3;
	}
}
function Ie(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ie(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Le(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var j = !0, Re = [];
function ze() {
	Re.push(j), j = !1;
}
function Be() {
	let e = Re.pop();
	j = e === void 0 || e;
}
function Ve(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = A;
		A = void 0;
		try {
			t();
		} finally {
			A = e;
		}
	}
}
var He = 0, Ue = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, We = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!A || !j || A === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== A) t = this.activeLink = new Ue(A, this), A.deps ? (t.prevDep = A.depsTail, A.depsTail.nextDep = t, A.depsTail = t) : A.deps = A.depsTail = t, Ge(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = A.depsTail, t.nextDep = void 0, A.depsTail.nextDep = t, A.depsTail = t, A.deps === t && (A.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, He++, this.notify(e);
	}
	notify(e) {
		Ae();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			je();
		}
	}
};
function Ge(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ge(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ke = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ Symbol(""), Je = /* @__PURE__ */ Symbol(""), Ye = /* @__PURE__ */ Symbol("");
function M(e, t, n) {
	if (j && A) {
		let t = Ke.get(e);
		t || Ke.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new We()), r.map = t, r.key = n), r.track();
	}
}
function Xe(e, t, n, r, i, a) {
	let o = Ke.get(e);
	if (!o) {
		He++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ae(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ye || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ye)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(qe)), f(e) && s(o.get(Je)));
				break;
			case "delete":
				i || (s(o.get(qe)), f(e) && s(o.get(Je)));
				break;
			case "set": f(e) && s(o.get(qe));
		}
	}
	je();
}
function Ze(e) {
	let t = /* @__PURE__ */ P(e);
	return t === e ? t : (M(t, "iterate", Ye), /* @__PURE__ */ N(e) ? t : t.map(F));
}
function Qe(e) {
	return M(e = /* @__PURE__ */ P(e), "iterate", Ye), e;
}
function $e(e, t) {
	return /* @__PURE__ */ Ft(e) ? Rt(/* @__PURE__ */ Pt(e) ? F(t) : t) : F(t);
}
var et = {
	__proto__: null,
	[Symbol.iterator]() {
		return tt(this, Symbol.iterator, (e) => $e(this, e));
	},
	concat(...e) {
		return Ze(this).concat(...e.map((e) => d(e) ? Ze(e) : e));
	},
	entries() {
		return tt(this, "entries", (e) => (e[1] = $e(this, e[1]), e));
	},
	every(e, t) {
		return rt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return rt(this, "filter", e, t, (e) => e.map((e) => $e(this, e)), arguments);
	},
	find(e, t) {
		return rt(this, "find", e, t, (e) => $e(this, e), arguments);
	},
	findIndex(e, t) {
		return rt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return rt(this, "findLast", e, t, (e) => $e(this, e), arguments);
	},
	findLastIndex(e, t) {
		return rt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return rt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return at(this, "includes", e);
	},
	indexOf(...e) {
		return at(this, "indexOf", e);
	},
	join(e) {
		return Ze(this).join(e);
	},
	lastIndexOf(...e) {
		return at(this, "lastIndexOf", e);
	},
	map(e, t) {
		return rt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ot(this, "pop");
	},
	push(...e) {
		return ot(this, "push", e);
	},
	reduce(e, ...t) {
		return it(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return it(this, "reduceRight", e, t);
	},
	shift() {
		return ot(this, "shift");
	},
	some(e, t) {
		return rt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ot(this, "splice", e);
	},
	toReversed() {
		return Ze(this).toReversed();
	},
	toSorted(e) {
		return Ze(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ze(this).toSpliced(...e);
	},
	unshift(...e) {
		return ot(this, "unshift", e);
	},
	values() {
		return tt(this, "values", (e) => $e(this, e));
	}
};
function tt(e, t, n) {
	let r = Qe(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ N(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var nt = Array.prototype;
function rt(e, t, n, r, i, a) {
	let o = Qe(e), s = o !== e && !/* @__PURE__ */ N(e), c = o[t];
	if (c !== nt[t]) {
		let t = c.apply(e, a);
		return s ? F(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, $e(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function it(e, t, n, r) {
	let i = Qe(e), a = i !== e && !/* @__PURE__ */ N(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = $e(e, t)), n.call(this, t, $e(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? $e(e, c) : c;
}
function at(e, t, n) {
	let r = /* @__PURE__ */ P(e);
	M(r, "iterate", Ye);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ It(n[0]) ? (n[0] = /* @__PURE__ */ P(n[0]), r[t](...n)) : i;
}
function ot(e, t, n = []) {
	ze(), Ae();
	let r = (/* @__PURE__ */ P(e))[t].apply(e, n);
	return je(), Be(), r;
}
var st = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ct = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function lt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ P(this);
	return M(t, "has", e), t.hasOwnProperty(e);
}
var ut = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ot : Dt : i ? Et : Tt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = et[t])) return e;
			if (t === "hasOwnProperty") return lt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ I(e) ? e : n);
		if ((_(t) ? ct.has(t) : st(t)) || (r || M(e, "get", t), i)) return o;
		if (/* @__PURE__ */ I(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Mt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Mt(o) : /* @__PURE__ */ At(o) : o;
	}
}, dt = class extends ut {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Ft(i);
			if (!/* @__PURE__ */ N(n) && !/* @__PURE__ */ Ft(n) && (i = /* @__PURE__ */ P(i), n = /* @__PURE__ */ P(n)), !a && /* @__PURE__ */ I(i) && !/* @__PURE__ */ I(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ I(e) ? e : r);
		return e === /* @__PURE__ */ P(r) && s && (o ? D(n, i) && Xe(e, "set", t, n, i) : Xe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Xe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !ct.has(t)) && M(e, "has", t), n;
	}
	ownKeys(e) {
		return M(e, "iterate", d(e) ? "length" : qe), Reflect.ownKeys(e);
	}
}, ft = class extends ut {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, pt = /* @__PURE__ */ new dt(), mt = /* @__PURE__ */ new ft(), ht = /* @__PURE__ */ new dt(!0), gt = (e) => e, _t = (e) => Reflect.getPrototypeOf(e);
function vt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ P(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? gt : t ? Rt : F;
		return !t && M(a, "iterate", l ? Je : qe), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function yt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function bt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ P(r), a = /* @__PURE__ */ P(n);
			e || (D(n, a) && M(i, "get", n), M(i, "get", a));
			let { has: o } = _t(i), s = t ? gt : e ? Rt : F;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && M(/* @__PURE__ */ P(t), "iterate", qe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ P(n), i = /* @__PURE__ */ P(t);
			return e || (D(t, i) && M(r, "has", t), M(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ P(a), s = t ? gt : e ? Rt : F;
			return !e && M(o, "iterate", qe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: yt("add"),
		set: yt("set"),
		delete: yt("delete"),
		clear: yt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ P(this), r = _t(n), i = /* @__PURE__ */ P(e), a = !t && !/* @__PURE__ */ N(e) && !/* @__PURE__ */ Ft(e) ? i : e;
			return r.has.call(n, a) || D(e, a) && r.has.call(n, e) || D(i, a) && r.has.call(n, i) || (n.add(a), Xe(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ N(n) && !/* @__PURE__ */ Ft(n) && (n = /* @__PURE__ */ P(n));
			let r = /* @__PURE__ */ P(this), { has: i, get: a } = _t(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ P(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? D(n, s) && Xe(r, "set", e, n, s) : Xe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ P(this), { has: n, get: r } = _t(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ P(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Xe(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ P(this), t = e.size !== 0, n = e.clear();
			return t && Xe(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = vt(r, e, t);
	}), n;
}
function xt(e, t) {
	let n = bt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var St = { get: /* @__PURE__ */ xt(!1, !1) }, Ct = { get: /* @__PURE__ */ xt(!1, !0) }, wt = { get: /* @__PURE__ */ xt(!0, !1) }, Tt = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap();
function kt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function At(e) {
	return /* @__PURE__ */ Ft(e) ? e : Nt(e, !1, pt, St, Tt);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return Nt(e, !1, ht, Ct, Et);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return Nt(e, !0, mt, wt, Dt);
}
function Nt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = kt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return /* @__PURE__ */ Ft(e) ? /* @__PURE__ */ Pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ P(t) : e;
}
function Lt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && O(e, "__v_skip", !0), e;
}
var F = (e) => v(e) ? /* @__PURE__ */ At(e) : e, Rt = (e) => v(e) ? /* @__PURE__ */ Mt(e) : e;
// @__NO_SIDE_EFFECTS__
function I(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return Vt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return Vt(e, !0);
}
function Vt(e, t) {
	return /* @__PURE__ */ I(e) ? e : new Ht(e, t);
}
var Ht = class {
	constructor(e, t) {
		this.dep = new We(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ P(e), this._value = t ? e : F(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ N(e) || /* @__PURE__ */ Ft(e);
		e = n ? e : /* @__PURE__ */ P(e), D(e, t) && (this._rawValue = e, this._value = n ? e : F(e), this.dep.trigger());
	}
};
function Ut(e) {
	e.dep && e.dep.trigger();
}
function L(e) {
	return /* @__PURE__ */ I(e) ? e.value : e;
}
var Wt = {
	get: (e, t, n) => t === "__v_raw" ? e : L(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ I(i) && !/* @__PURE__ */ I(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Gt(e) {
	return /* @__PURE__ */ Pt(e) ? e : new Proxy(e, Wt);
}
var Kt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new We(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = He - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && A !== this) return ke(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Fe(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function qt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Kt(r, i, n);
}
var Jt = {}, Yt = /* @__PURE__ */ new WeakMap(), Xt = void 0;
function Zt(e, t = !1, n = Xt) {
	if (n) {
		let t = Yt.get(n);
		t || Yt.set(n, t = []), t.push(e);
	}
}
function Qt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ N(e) || o === !1 || o === 0 ? $t(e, 1) : $t(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ I(e) ? (g = () => e.value, y = /* @__PURE__ */ N(e)) : /* @__PURE__ */ Pt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Pt(e) || /* @__PURE__ */ N(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ I(e)) return e.value;
		if (/* @__PURE__ */ Pt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			ze();
			try {
				_();
			} finally {
				Be();
			}
		}
		let t = Xt;
		Xt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Xt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => $t(e(), t);
	}
	let x = Ce(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Jt) : Jt, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => D(e, C[t])) : D(t, C))) {
					_ && _();
					let e = Xt;
					Xt = m;
					try {
						let e = [
							t,
							C === Jt ? void 0 : b && C[0] === Jt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Xt = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Te(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Zt(e, !1, m), _ = m.onStop = () => {
		let e = Yt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Yt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function $t(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ I(e)) $t(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) $t(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		$t(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) $t(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && $t(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function en(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		nn(e, t, n);
	}
}
function tn(e, t, n, r) {
	if (h(e)) {
		let i = en(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			nn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(tn(e[a], t, n, r));
		return i;
	}
}
function nn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			ze(), en(o, null, 10, [
				e,
				i,
				a
			]), Be();
			return;
		}
	}
	rn(e, r, a, i, s);
}
function rn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var R = [], an = -1, on = [], sn = null, cn = 0, ln = /* @__PURE__ */ Promise.resolve(), un = null;
function dn(e) {
	let t = un || ln;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function fn(e) {
	let t = an + 1, n = R.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = R[r], a = vn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function pn(e) {
	if (!(e.flags & 1)) {
		let t = vn(e), n = R[R.length - 1];
		!n || !(e.flags & 2) && t >= vn(n) ? R.push(e) : R.splice(fn(t), 0, e), e.flags |= 1, mn();
	}
}
function mn() {
	un ||= ln.then(yn);
}
function hn(e) {
	if (!d(e)) sn && e.id === -1 ? sn.splice(cn + 1, 0, e) : e.flags & 1 || (on.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) on.push(e[t]);
	mn();
}
function gn(e, t, n = an + 1) {
	for (; n < R.length; n++) {
		let t = R[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			R.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function _n(e) {
	if (on.length) {
		let e = [...new Set(on)].sort((e, t) => vn(e) - vn(t));
		if (on.length = 0, sn) {
			for (let t = 0; t < e.length; t++) sn.push(e[t]);
			return;
		}
		for (sn = e, cn = 0; cn < sn.length; cn++) {
			let e = sn[cn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		sn = null, cn = 0;
	}
}
var vn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function yn(e) {
	try {
		for (an = 0; an < R.length; an++) {
			let e = R[an];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), en(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; an < R.length; an++) {
			let e = R[an];
			e && (e.flags &= -2);
		}
		an = -1, R.length = 0, _n(e), un = null, (R.length || on.length) && yn(e);
	}
}
var bn = null, xn = null;
function Sn(e) {
	let t = bn;
	return bn = e, xn = e && e.type.__scopeId || null, t;
}
function Cn(e, t = bn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Mi(-1);
		let i = Sn(t), a = ki.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ki.length; e > a; e--) Ai();
			Sn(i), r._d && Mi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function wn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (ze(), tn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Be());
	}
}
function Tn(e, t) {
	if (K) {
		let n = K.provides, r = K.parent && K.parent.provides;
		r === n && (n = K.provides = Object.create(r)), n[e] = t;
	}
}
function En(e, t, n = !1) {
	let r = $i();
	if (r || Lr) {
		let i = Lr ? Lr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Dn = /* @__PURE__ */ Symbol.for("v-scx"), On = () => En(Dn);
function kn(e, t, n) {
	return An(e, t, n);
}
function An(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (aa) {
		if (c === "sync") {
			let e = On();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = K;
	u.call = (e, t, n) => tn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		B(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : pn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Qt(e, n, u);
	return aa && (f ? f.push(h) : d && h()), h;
}
function jn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Mn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = na(this), s = An(i, a.bind(r), n);
	return o(), s;
}
function Mn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Nn = /* @__PURE__ */ Symbol("_vte"), Pn = (e) => e.__isTeleport, Fn = /* @__PURE__ */ Symbol("_leaveCb");
function In(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Di) {
			t = n;
			break;
		}
	}
	return t;
}
function Ln(e) {
	if (!Kn(e)) return Pn(e.type) && e.children ? In(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Rn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Rn(Pn(n.type) && Ln(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function zn(e, t) {
	return h(e) ? /* @__PURE__ */ s({ name: e.name }, t, { setup: e }) : e;
}
function Bn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Vn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Hn = /* @__PURE__ */ new WeakMap();
function Un(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Un(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Gn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Un(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? fa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ P(v), b = v === t ? i : (e) => !Vn(_, e) && u(y, e), x = (e, t) => !(t && Vn(_, t));
	if (m != null && m !== p) {
		if (Wn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ I(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) en(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ I(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Hn.delete(e);
				};
				t.id = -1, Hn.set(e, t), B(t, r);
			} else Wn(e), i();
		}
	}
}
function Wn(e) {
	let t = Hn.get(e);
	t && (t.flags |= 8, Hn.delete(e));
}
ue().requestIdleCallback, ue().cancelIdleCallback;
var Gn = (e) => !!e.type.__asyncLoader, Kn = (e) => e.type.__isKeepAlive;
function qn(e, t) {
	Yn(e, "a", t);
}
function Jn(e, t) {
	Yn(e, "da", t);
}
function Yn(e, t, n = K) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Zn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Kn(e.parent.vnode) && Xn(r, t, n, e), e = e.parent;
	}
}
function Xn(e, t, n, r) {
	let i = Zn(t, e, r, !0);
	ir(() => {
		c(r[t], i);
	}, n);
}
function Zn(e, t, n = K, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ze();
			let i = na(n), a = tn(t, n, e, r);
			return i(), Be(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Qn = (e) => (t, n = K) => {
	(!aa || e === "sp") && Zn(e, (...e) => t(...e), n);
}, $n = Qn("bm"), er = Qn("m"), tr = Qn("bu"), nr = Qn("u"), rr = Qn("bum"), ir = Qn("um"), ar = Qn("sp"), or = Qn("rtg"), sr = Qn("rtc");
function cr(e, t = K) {
	Zn("ec", e, t);
}
var lr = "components", ur = /* @__PURE__ */ Symbol.for("v-ndc");
function dr(e) {
	return g(e) ? fr(lr, e, !1) || e : e || ur;
}
function fr(e, t, n = !0, r = !1) {
	let i = bn || K;
	if (i) {
		let n = i.type;
		if (e === lr) {
			let e = pa(n, !1);
			if (e && (e === t || e === T(t) || e === ie(T(t)))) return n;
		}
		let a = pr(i[e] || n[e], t) || pr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function pr(e, t) {
	return e && (e[t] || e[T(t)] || e[ie(T(t))]);
}
function mr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Pt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ N(e), s = /* @__PURE__ */ Ft(e), e = Qe(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Rt(F(e[n])) : F(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (v(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
var hr = (e) => e ? ia(e) ? fa(e) : hr(e.parent) : null, gr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => hr(e.parent),
	$root: (e) => hr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Tr(e),
	$forceUpdate: (e) => e.f ||= () => {
		pn(e.update);
	},
	$nextTick: (e) => e.n ||= dn.bind(e.proxy),
	$watch: (e) => jn.bind(e)
}), _r = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), vr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (_r(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else br && (s[n] = 0);
		}
		let d = gr[n], f, p;
		if (d) return n === "$attrs" && M(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return _r(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || _r(n, c) || u(o, c) || u(i, c) || u(gr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function yr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var br = !0;
function xr(e) {
	let t = Tr(e), n = e.proxy, i = e.ctx;
	br = !1, t.beforeCreate && Cr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: T, serverPrefetch: re, expose: E, inheritAttrs: ie, components: ae, directives: D, filters: oe } = t;
	if (u && Sr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ At(t));
	}
	if (br = !0, o) for (let e in o) {
		let t = o[e], a = ha({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) wr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Tn(t, e[t]);
		});
	}
	f && Cr(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O($n, p), O(er, m), O(tr, g), O(nr, _), O(qn, y), O(Jn, b), O(cr, T), O(sr, te), O(or, ne), O(rr, S), O(ir, w), O(ar, re), d(E)) {
		if (E.length) {
			let t = e.exposed ||= {};
			E.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === r && (e.render = ee), ie != null && (e.inheritAttrs = ie), ae && (e.components = ae), D && (e.directives = D), re && Bn(e);
}
function Sr(e, t, n = r) {
	d(e) && (e = Ar(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? En(r.from || n, r.default, !0) : En(r.from || n) : En(r), /* @__PURE__ */ I(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Cr(e, t, n) {
	tn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function wr(e, t, n, r) {
	let i = r.includes(".") ? Mn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && kn(i, n);
	} else if (h(e)) kn(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => wr(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && kn(i, r, e);
		}
	}
}
function Tr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Er(c, e, o, !0)), Er(c, t, o)), v(t) && a.set(t, c), c;
}
function Er(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Er(e, a, n, !0), i && i.forEach((t) => Er(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Dr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Dr = {
	data: Or,
	props: Mr,
	emits: Mr,
	methods: jr,
	computed: jr,
	beforeCreate: z,
	created: z,
	beforeMount: z,
	mounted: z,
	beforeUpdate: z,
	updated: z,
	beforeDestroy: z,
	beforeUnmount: z,
	destroyed: z,
	unmounted: z,
	activated: z,
	deactivated: z,
	errorCaptured: z,
	serverPrefetch: z,
	components: jr,
	directives: jr,
	watch: Nr,
	provide: Or,
	inject: kr
};
function Or(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function kr(e, t) {
	return jr(Ar(e), Ar(t));
}
function Ar(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function z(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function jr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Mr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), yr(e), yr(t ?? {})) : t;
}
function Nr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = z(e[r], t[r]);
	return n;
}
function Pr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Fr = 0;
function Ir(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Pr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Fr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: _a,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || G(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, fa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (tn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Lr;
				Lr = l;
				try {
					return e();
				} finally {
					Lr = t;
				}
			}
		};
		return l;
	};
}
var Lr = null, Rr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${T(t)}Modifiers`] || e[`${E(t)}Modifiers`];
function zr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Rr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(se)));
	let c, l = i[c = ae(n)] || i[c = ae(T(n))];
	!l && o && (l = i[c = ae(E(n))]), l && tn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, tn(u, e, 6, a);
	}
}
var Br = /* @__PURE__ */ new WeakMap();
function Vr(e, t, n = !1) {
	let r = n ? Br : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Vr(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Hr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, E(t)) || u(e, t));
}
function Ur(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Sn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Gi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Gi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Wr(c);
		}
	} catch (t) {
		ki.length = 0, nn(t, e, 1), v = G(Di);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Gr(y, a)), b = Hi(b, y, !1, !0));
	}
	return n.dirs && (b = Hi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Rn(Pn(b.type) && Ln(b) || b, n.transition), v = b, Sn(_), v;
}
var Wr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Gr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Kr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? qr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Jr(o, r, n) && !Hr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || qr(r, o, l) : !!o;
	return !1;
}
function qr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Jr(t, e, a) && !Hr(n, a)) return !0;
	}
	return !1;
}
function Jr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !xe(r, i) : r !== i;
}
function Yr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Xr = {}, Zr = () => Object.create(Xr), Qr = (e) => Object.getPrototypeOf(e) === Xr;
function $r(e, t, n, r = !1) {
	let i = {}, a = Zr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ti(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ jt(i) : e.type.props ? i : a, e.attrs = a;
}
function ei(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ P(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Hr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = T(o);
						i[t] = ni(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		ti(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = E(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ni(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Xe(e.attrs, "set", "");
}
function ti(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = T(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Hr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ P(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = ni(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function ni(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = na(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === E(n)) && (r = !0));
	}
	return r;
}
var ri = /* @__PURE__ */ new WeakMap();
function ii(e, r, i = !1) {
	let a = i ? ri : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = ii(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = T(c[e]);
		ai(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = T(e);
		if (ai(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function ai(e) {
	return e[0] !== "$" && !ee(e);
}
var oi = (e) => e === "_" || e === "_ctx" || e === "$stable", si = (e) => d(e) ? e.map(Gi) : [Gi(e)], ci = (e, t, n) => {
	if (t._n) return t;
	let r = Cn((...e) => si(t(...e)), n);
	return r._c = !1, r;
}, li = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (oi(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = ci(n, i, r);
		else if (i != null) {
			let e = si(i);
			t[n] = () => e;
		}
	}
}, ui = (e, t) => {
	let n = si(t);
	e.slots.default = () => n;
}, di = (e, t, n) => {
	for (let r in t) (n || !oi(r)) && (e[r] = t[r]);
}, fi = (e, t, n) => {
	let r = e.slots = Zr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (di(r, t, n), n && O(r, "_", e, !0)) : li(t, r);
	} else t && ui(e, t);
}, pi = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : di(a, n, r) : (o = !n.$stable, li(n, a)), s = n;
	} else n && (ui(e, n), s = { default: 1 });
	if (o) for (let e in a) !oi(e) && s[e] == null && delete a[e];
}, B = Ti;
function mi(e) {
	return hi(e);
}
function hi(e, i) {
	let a = ue();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ii(e, t) && (r = be(e), he(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ei:
				y(e, t, n, r);
				break;
			case Di:
				b(e, t, n, r);
				break;
			case Oi:
				e ?? x(t, n, r, o);
				break;
			case V:
				ae(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? D(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, Se);
		}
		u != null && i ? Un(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Un(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), re(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && T(e.children, d, null, r, i, gi(e, a), s, u), _ && wn(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Yi(f, r, e);
		}
		_ && wn(e, null, r, "beforeMount");
		let v = vi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && B(() => {
			try {
				f && Yi(f, r, e), v && g.enter(d), _ && wn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || wi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ki(e[l]) : Gi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, re = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && _i(r, !1), (g = h.onVnodeBeforeUpdate) && Yi(g, r, n, e), f && wn(n, e, r, "beforeUpdate"), r && _i(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? E(e.dynamicChildren, d, l, r, i, gi(n, a), o) : s || de(e, n, l, null, r, i, gi(n, a), o, !1), u > 0) {
			if (u & 16) ie(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ie(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && B(() => {
			g && Yi(g, r, n, e), f && wn(n, e, r, "updated");
		}, i);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === V || !Ii(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ie = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), T(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && yi(e, t, !0)) : de(e, t, n, f, i, a, s, c, l);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : O(t, n, r, i, a, o, c) : se(e, t, c);
	}, O = (e, t, n, r, i, a, o) => {
		let s = e.component = Qi(e, r, i);
		if (Kn(e) && (s.ctx.renderer = Se), oa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = G(Di);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (Kr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = xi(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							B(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				_i(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && oe(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Yi(d, s, t, c), _i(e, !0);
				let f = Ur(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), be(p), e, i, a), t.el = f.el, u === null && Yr(e, f.el), r && B(r, i), (d = t.props && t.props.onVnodeUpdated) && B(() => Yi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Gn(t);
				if (_i(e, !1), l && oe(l), !m && (o = c && c.onVnodeBeforeMount) && Yi(o, d, t), _i(e, !0), s && A) {
					let t = () => {
						e.subTree = Ur(e), A(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Ur(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && B(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					B(() => Yi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Gn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && B(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Te(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => pn(u), _i(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ei(e, t.props, r, n), pi(e, t.children, n), ze(), gn(e), Be();
	}, de = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ye(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ye(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && T(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Ki(t[p]) : Gi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ye(e, a, o, !0, !1, f) : T(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Ki(t[u]) : Gi(t[u]);
			if (Ii(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Ki(t[p]) : Gi(t[p]);
			if (Ii(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Ki(t[u]) : Gi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) he(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Ki(t[u]) : Gi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					he(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ii(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? he(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? bi(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ci(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(n, r, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			me(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, Se);
			return;
		}
		if (c === V) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Oi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Fn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), B(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Fn];
					a._isLeaving && a[Fn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, he = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (ze(), Un(s, null, n, e, !0), Be()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Gn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Yi(_, t, e), u & 6) ve(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && wn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== V || d > 0 && d & 64) ? ye(l, t, n, !1, !0) : (a === V && d & 384 || !i && u & 16) && ye(c, t, n), r && ge(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && B(() => {
			_ && Yi(_, t, e), h && wn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ge = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === V) {
			_e(n, r);
			return;
		}
		if (t === Oi) {
			C(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, _e = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ve = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Si(c), Si(l), r && oe(r), i.stop(), a && (a.flags |= 8, he(o, e, t, n)), s && B(s, t), B(() => {
			e.isUnmounted = !0;
		}, t);
	}, ye = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) he(e[o], t, n, r, i);
	}, be = (e) => {
		if (e.shapeFlag & 6) return be(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Nn];
		return n ? h(n) : t;
	}, xe = !1, k = (e, t, n) => {
		let r;
		e == null ? t._vnode && (he(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, xe ||= (xe = !0, gn(r), _n(), !1);
	}, Se = {
		p: v,
		um: he,
		m: me,
		r: ge,
		mt: O,
		mc: T,
		pc: de,
		pbc: E,
		n: be,
		o: e
	}, Ce, A;
	return i && ([Ce, A] = i(Se)), {
		render: k,
		hydrate: Ce,
		createApp: Ir(k, Ce)
	};
}
function gi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function _i({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function vi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function yi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ki(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && yi(t, a)), a.type === Ei && (a.patchFlag === -1 && (a = i[e] = Ki(a)), a.el = t.el), a.type === Di && !a.el && (a.el = t.el);
	}
}
function bi(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function xi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : xi(t);
}
function Si(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ci(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ci(t.subTree) : null;
}
var wi = (e) => e.__isSuspense;
function Ti(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : hn(e);
}
var V = /* @__PURE__ */ Symbol.for("v-fgt"), Ei = /* @__PURE__ */ Symbol.for("v-txt"), Di = /* @__PURE__ */ Symbol.for("v-cmt"), Oi = /* @__PURE__ */ Symbol.for("v-stc"), ki = [], H = null;
function U(e = !1) {
	ki.push(H = e ? null : []);
}
function Ai() {
	ki.pop(), H = ki[ki.length - 1] || null;
}
var ji = 1;
function Mi(e, t = !1) {
	ji += e, e < 0 && H && t && (H.hasOnce = !0);
}
function Ni(e) {
	return e.dynamicChildren = ji > 0 ? H || n : null, Ai(), ji > 0 && H && H.push(e), e;
}
function W(e, t, n, r, i, a) {
	return Ni(zi(e, t, n, r, i, a, !0));
}
function Pi(e, t, n, r, i) {
	return Ni(G(e, t, n, r, i, !0));
}
function Fi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ii(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Li = ({ key: e }) => e ?? null, Ri = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ I(e) || h(e) ? {
	i: bn,
	r: e,
	k: t,
	f: !!n
} : e);
function zi(e, t = null, n = null, r = 0, i = null, a = e === V ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Li(t),
		ref: t && Ri(t),
		scopeId: xn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: bn
	};
	return s ? (qi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), ji > 0 && !o && H && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && H.push(c), c;
}
var G = Bi;
function Bi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === ur) && (e = Di), Fi(e)) {
		let r = Hi(e, t, !0);
		return n && qi(r, n), ji > 0 && !a && H && (r.shapeFlag & 6 ? H[H.indexOf(e)] = r : H.push(r)), r.patchFlag = -2, r;
	}
	if (ma(e) && (e = e.__vccOpts), t) {
		t = Vi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = ge(e)), v(n) && (/* @__PURE__ */ It(n) && !d(n) && (n = s({}, n)), t.style = de(n));
	}
	let o = g(e) ? 1 : wi(e) ? 128 : Pn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return zi(e, t, n, r, i, o, a, !0);
}
function Vi(e) {
	return e ? /* @__PURE__ */ It(e) || Qr(e) ? s({}, e) : e : null;
}
function Hi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ji(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Li(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Ri(t)) : [a, Ri(t)] : Ri(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== V ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Hi(e.ssContent),
		ssFallback: e.ssFallback && Hi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Rn(u, c.clone(u)), u;
}
function Ui(e = " ", t = 0) {
	return G(Ei, null, e, t);
}
function Wi(e = "", t = !1) {
	return t ? (U(), Pi(Di, null, e)) : G(Di, null, e);
}
function Gi(e) {
	return e == null || typeof e == "boolean" ? G(Di) : d(e) ? G(V, null, e.slice()) : Fi(e) ? Ki(e) : G(Ei, null, String(e));
}
function Ki(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Hi(e);
}
function qi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), qi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Qr(t) ? t._ctx = bn : r === 3 && bn && (bn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			qi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: bn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ui(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ji(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = ge([t.class, r.class]));
		else if (e === "style") t.style = de([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Yi(e, t, n, r = null) {
	tn(e, t, 7, [n, r]);
}
var Xi = Pr(), Zi = 0;
function Qi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Xi, o = {
		uid: Zi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Se(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: ii(i, a),
		emitsOptions: Vr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = zr.bind(null, o), e.ce && e.ce(o), o;
}
var K = null, $i = () => K || bn, ea, ta;
{
	let e = ue(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ea = t("__VUE_INSTANCE_SETTERS__", (e) => K = e), ta = t("__VUE_SSR_SETTERS__", (e) => aa = e);
}
var na = (e) => {
	let t = K;
	return ea(e), e.scope.on(), () => {
		e.scope.off(), ea(t);
	};
}, ra = () => {
	K && K.scope.off(), ea(null);
};
function ia(e) {
	return e.vnode.shapeFlag & 4;
}
var aa = !1;
function oa(e, t = !1, n = !1) {
	t && ta(t);
	let { props: r, children: i } = e.vnode, a = ia(e);
	$r(e, r, a, t), fi(e, i, n || t);
	let o = a ? sa(e, t) : void 0;
	return t && ta(!1), o;
}
function sa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, vr);
	let { setup: r } = n;
	if (r) {
		ze();
		let n = e.setupContext = r.length > 1 ? da(e) : null, i = na(e), a = en(r, e, 0, [e.props, n]), o = y(a);
		if (Be(), i(), (o || e.sp) && !Gn(e) && Bn(e), o) {
			if (a.then(ra, ra), t) return a.then((n) => {
				ta(!0);
				try {
					ca(e, n, t);
				} finally {
					ta(!1);
				}
			}).catch((t) => {
				nn(t, e, 0);
			});
			e.asyncDep = a;
		} else ca(e, a, t);
	} else la(e, t);
}
function ca(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Gt(t)), la(e, n);
}
function la(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = na(e);
		ze();
		try {
			xr(e);
		} finally {
			Be(), t();
		}
	}
}
var ua = { get(e, t) {
	return M(e, "get", ""), e[t];
} };
function da(e) {
	return {
		attrs: new Proxy(e.attrs, ua),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function fa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Gt(Lt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in gr) return gr[n](e);
		},
		has(e, t) {
			return t in e || t in gr;
		}
	}) : e.proxy;
}
function pa(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function ma(e) {
	return h(e) && "__vccOpts" in e;
}
var ha = (e, t) => /* @__PURE__ */ qt(e, t, aa);
function ga(e, t, n) {
	try {
		Mi(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? Fi(t) ? G(e, null, [t]) : G(e, t) : G(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Fi(n) && (n = [n]), G(e, t, n));
	} finally {
		Mi(1);
	}
}
var _a = "3.5.41", va = void 0, ya = typeof window < "u" && window.trustedTypes;
if (ya) try {
	va = /* @__PURE__ */ ya.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ba = va ? (e) => va.createHTML(e) : (e) => e, xa = "http://www.w3.org/2000/svg", Sa = "http://www.w3.org/1998/Math/MathML", Ca = typeof document < "u" ? document : null, wa = Ca && /* @__PURE__ */ Ca.createElement("template"), Ta = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ca.createElementNS(xa, e) : t === "mathml" ? Ca.createElementNS(Sa, e) : n ? Ca.createElement(e, { is: n }) : Ca.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ca.createTextNode(e),
	createComment: (e) => Ca.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ca.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			wa.innerHTML = ba(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = wa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ea = /* @__PURE__ */ Symbol("_vtc");
function Da(e, t, n) {
	let r = e[Ea];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Oa = /* @__PURE__ */ Symbol("_vod"), ka = /* @__PURE__ */ Symbol("_vsh"), Aa = /* @__PURE__ */ Symbol(""), ja = /(?:^|;)\s*display\s*:/;
function Ma(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Pa(r, t, "");
			}
			else for (let e in t) n[e] ?? Pa(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Pa(r, i, "") : Ra(e, i, !g(t) && t ? t[i] : void 0, o) || Pa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Aa];
			e && (n += ";" + e), r.cssText = n, a = ja.test(n);
		}
	} else t && e.removeAttribute("style");
	Oa in e && (e[Oa] = a ? r.display : "", e[ka] && (r.display = "none"));
}
var Na = /\s*!important$/;
function Pa(e, t, n) {
	if (d(n)) n.forEach((n) => Pa(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = La(e, t);
		Na.test(n) ? e.setProperty(E(r), n.replace(Na, ""), "important") : e[r] = n;
	}
}
var Fa = [
	"Webkit",
	"Moz",
	"ms"
], Ia = {};
function La(e, t) {
	let n = Ia[t];
	if (n) return n;
	let r = T(t);
	if (r !== "filter" && r in e) return Ia[t] = r;
	r = ie(r);
	for (let n = 0; n < Fa.length; n++) {
		let i = Fa[n] + r;
		if (i in e) return Ia[t] = i;
	}
	return t;
}
function Ra(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var za = "http://www.w3.org/1999/xlink";
function Ba(e, t, n, r, i, a = ve(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(za, t.slice(6, t.length)) : e.setAttributeNS(za, t, n) : n == null || a && !ye(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Va(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ba(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ye(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ha(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ua(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Wa = /* @__PURE__ */ Symbol("_vei");
function Ga(e, t, n, r, i = null) {
	let a = e[Wa] || (e[Wa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ja(t);
		r ? Ha(e, n, a[t] = Qa(r, i), s) : o && (Ua(e, n, o, s), a[t] = void 0);
	}
}
var Ka = /(Once|Passive|Capture)$/, qa = /^on:?(?:Once|Passive|Capture)$/;
function Ja(e) {
	let t, n;
	for (; (n = e.match(Ka)) && !qa.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : E(e.slice(2)), t];
}
var Ya = 0, Xa = /* @__PURE__ */ Promise.resolve(), Za = () => Ya ||= (Xa.then(() => Ya = 0), Date.now());
function Qa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && tn(e, t, 5, a);
			}
		} else tn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Za(), n;
}
var $a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, eo = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Da(e, r, c) : t === "style" ? Ma(e, n, r) : a(t) ? o(t) || Ga(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : to(e, t, r, c)) ? (Va(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ba(e, t, r, c, s, t !== "value")) : e._isVueCE && (no(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Va(e, T(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ba(e, t, r, c));
};
function to(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && $a(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return $a(t) && g(n) ? !1 : t in e;
}
function no(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = T(t);
	return Array.isArray(n) ? n.some((e) => T(e) === r) : Object.keys(n).some((e) => T(e) === r);
}
var ro = {};
// @__NO_SIDE_EFFECTS__
function io(e, t, n) {
	let r = /* @__PURE__ */ zn(e, t);
	C(r) && (r = s({}, r, t));
	class i extends oo {
		constructor(e) {
			super(r, e, n);
		}
	}
	return i.def = r, i;
}
var ao = typeof HTMLElement < "u" ? HTMLElement : class {}, oo = class e extends ao {
	constructor(e, t = {}, n = fo) {
		super(), this._def = e, this._props = t, this._createApp = n, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && n !== fo ? this._root = this.shadowRoot : e.shadowRoot === !1 ? this._root = this : (this.attachShadow(s({}, e.shadowRootOptions, { mode: "open" })), this._root = this.shadowRoot);
	}
	connectedCallback() {
		if (!this.isConnected) return;
		!this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
		let t = this;
		for (; t &&= t.assignedSlot || t.parentNode || t.host;) if (t instanceof e) {
			this._parent = t;
			break;
		}
		this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
			if (this._pendingResolve = void 0, this.isConnected) return this._resolveDef();
		}) : this._resolveDef());
	}
	_setParent(e = this._parent) {
		e && (this._instance.parent = e._instance, this._inheritParentContext(e));
	}
	_inheritParentContext(e = this._parent) {
		e && this._app && Object.setPrototypeOf(this._app._context.provides, e._instance.provides);
	}
	disconnectedCallback() {
		this._connected = !1, dn(() => {
			this._connected || (this._ob &&= (this._ob.disconnect(), null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets &&= (this._teleportTargets.clear(), void 0));
		});
	}
	_processMutations(e) {
		for (let t of e) this._setAttr(t.attributeName);
	}
	_resolveDef() {
		if (this._pendingResolve) return this._pendingResolve;
		for (let e = 0; e < this.attributes.length; e++) this._setAttr(this.attributes[e].name);
		this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
		let e = (e, t = !1) => {
			this._resolved = !0, this._pendingResolve = void 0;
			let { props: n, styles: r } = e, i;
			if (n && !d(n)) for (let e in n) {
				let t = n[e];
				(t === Number || t && t.type === Number) && (e in this._props && (this._props[e] = ce(this._props[e])), (i ||= /* @__PURE__ */ Object.create(null))[T(e)] = !0);
			}
			this._numberProps = i, this._resolveProps(e), this.shadowRoot && this._applyStyles(r), this._mount(e);
		}, t = this._def.__asyncLoader;
		if (t) return this._pendingResolve = t().then((t) => {
			t.configureApp = this._def.configureApp, e(this._def = t, !0);
		}), this._pendingResolve;
		e(this._def);
	}
	_mount(e) {
		this._app = this._createApp(e), this._inheritParentContext(), e.configureApp && e.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
		let t = this._instance && this._instance.exposed;
		if (t) for (let e in t) u(this, e) || Object.defineProperty(this, e, { get: () => L(t[e]) });
	}
	_resolveProps(e) {
		let { props: t } = e, n = d(t) ? t : Object.keys(t || {});
		for (let e of Object.keys(this)) e[0] !== "_" && n.includes(e) && this._setProp(e, this[e]);
		for (let e of n.map(T)) Object.defineProperty(this, e, {
			get() {
				return this._getProp(e);
			},
			set(t) {
				this._setProp(e, t, !0, !this._patching);
			}
		});
	}
	_setAttr(e) {
		if (e.startsWith("data-v-")) return;
		let t = this.hasAttribute(e), n = t ? this.getAttribute(e) : ro, r = T(e);
		t && this._numberProps && this._numberProps[r] && (n = ce(n)), this._setProp(r, n, !1, !0);
	}
	_getProp(e) {
		return this._props[e];
	}
	_setProp(e, t, n = !0, r = !1) {
		if (t !== this._props[e] && (this._dirty = !0, t === ro ? delete this._props[e] : (this._props[e] = t, e === "key" && this._app && (this._app._ceVNode.key = t)), r && this._instance && this._update(), n)) {
			let n = this._ob;
			n && (this._processMutations(n.takeRecords()), n.disconnect()), t === !0 ? this.setAttribute(E(e), "") : typeof t == "string" || typeof t == "number" ? this.setAttribute(E(e), t + "") : t || this.removeAttribute(E(e)), n && n.observe(this, { attributes: !0 });
		}
	}
	_update() {
		let e = this._createVNode();
		this._app && (e.appContext = this._app._context), uo(e, this._root);
	}
	_createVNode() {
		let e = {};
		this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
		let t = G(this._def, s(e, this._props));
		return this._instance || (t.ce = (e) => {
			this._instance = e, e.ce = this, e.isCE = !0;
			let t = (e, t) => {
				this.dispatchEvent(new CustomEvent(e, C(t[0]) ? s({ detail: t }, t[0]) : { detail: t }));
			};
			e.emit = (e, ...n) => {
				t(e, n), E(e) !== e && t(E(e), n);
			}, this._setParent();
		}), t;
	}
	_applyStyles(e, t, n) {
		if (!e) return;
		if (t) {
			if (t === this._def || this._styleChildren.has(t)) return;
			this._styleChildren.add(t);
		}
		let r = this._nonce, i = this.shadowRoot, a = n ? this._getStyleAnchor(n) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(i), o = null;
		for (let s = e.length - 1; s >= 0; s--) {
			let c = document.createElement("style");
			r && c.setAttribute("nonce", r), c.textContent = e[s], i.insertBefore(c, o || a), o = c, s === 0 && (n || this._styleAnchors.set(this._def, c), t && this._styleAnchors.set(t, c));
		}
	}
	_getStyleAnchor(e) {
		if (!e) return null;
		let t = this._styleAnchors.get(e);
		return t && t.parentNode === this.shadowRoot ? t : (t && this._styleAnchors.delete(e), null);
	}
	_getRootStyleInsertionAnchor(e) {
		for (let t = 0; t < e.childNodes.length; t++) {
			let n = e.childNodes[t];
			if (!(n instanceof HTMLStyleElement)) return n;
		}
		return null;
	}
	_parseSlots() {
		let e = this._slots = {}, t;
		for (; t = this.firstChild;) {
			let n = t.nodeType === 1 && t.getAttribute("slot") || "default";
			(e[n] || (e[n] = [])).push(t), this.removeChild(t);
		}
	}
	_renderSlots() {
		let e = this._getSlots(), t = this._instance.type.__scopeId;
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = r.getAttribute("name") || "default", a = this._slots[i], o = r.parentNode;
			if (a) for (let e of a) {
				if (t && e.nodeType === 1) {
					let n = t + "-s", r = document.createTreeWalker(e, 1);
					e.setAttribute(n, "");
					let i;
					for (; i = r.nextNode();) i.setAttribute(n, "");
				}
				o.insertBefore(e, r);
			}
			else for (; r.firstChild;) o.insertBefore(r.firstChild, r);
			o.removeChild(r);
		}
	}
	_getSlots() {
		let e = [this];
		this._teleportTargets && e.push(...this._teleportTargets);
		let t = /* @__PURE__ */ new Set();
		for (let n of e) {
			let e = n.querySelectorAll("slot");
			for (let n = 0; n < e.length; n++) t.add(e[n]);
		}
		return Array.from(t);
	}
	_injectChildStyle(e, t) {
		this._applyStyles(e.styles, e, t);
	}
	_beginPatch() {
		this._patching = !0, this._dirty = !1;
	}
	_endPatch() {
		this._patching = !1, this._dirty && this._instance && this._update();
	}
	_hasShadowRoot() {
		return this._def.shadowRoot !== !1;
	}
	_removeChildStyle(e) {}
}, so = /* @__PURE__ */ s({ patchProp: eo }, Ta), co;
function lo() {
	return co ||= mi(so);
}
var uo = ((...e) => {
	lo().render(...e);
}), fo = ((...e) => {
	let t = lo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = mo(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, po(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function po(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function mo(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/bot/math.ts
var q = Math.PI * 2, J = (e, t = 0, n = 1) => e < t ? t : e > n ? n : e, Y = (e, t, n) => e + (t - e) * n, X = {
	easeOutCubic: (e) => 1 - (1 - e) ** 3,
	easeInOutCubic: (e) => e < .5 ? 4 * e ** 3 : 1 - (-2 * e + 2) ** 3 / 2,
	easeOutQuint: (e) => 1 - (1 - e) ** 5
};
function ho(e, t, n = 0) {
	let r = e / t * q;
	return .55 * Math.sin(r + n) + .3 * Math.sin(2 * r + n * 1.7 + 1.1) + .15 * Math.sin(3 * r + n * 2.3 + 2.4);
}
function go(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = Math.imul(t ^ t >>> 15, 1 | t);
		return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var Z = (e) => Math.round(e * 100) / 100;
//#endregion
//#region src/bot/decor.ts
function _o(e, t = .55, n = .62) {
	let r = (e % 360 + 360) % 360, i = (1 - Math.abs(2 * n - 1)) * t, a = i * (1 - Math.abs(r / 60 % 2 - 1)), o = n - i / 2, [s, c, l] = r < 60 ? [
		i,
		a,
		0
	] : r < 120 ? [
		a,
		i,
		0
	] : r < 180 ? [
		0,
		i,
		a
	] : r < 240 ? [
		0,
		a,
		i
	] : r < 300 ? [
		a,
		0,
		i
	] : [
		i,
		0,
		a
	], u = (e) => Math.round((e + o) * 255).toString(16).padStart(2, "0");
	return `#${u(s)}${u(c)}${u(l)}`;
}
function vo(e, t, n, r, i = 1) {
	let a = e.phase + t * e.speed * q, o = Math.cos(e.tilt), s = Math.sin(e.tilt), c = Math.sqrt(Math.max(0, 1 - e.k * e.k)), l = e.sweep * q, u = "", d = "", f = null;
	for (let t = 0; t <= 64; t++) {
		let r = a + t / 64 * l, i = Math.cos(r), p = Math.sin(r), m = e.a * (i * o + p * -s * e.k) + e.cx, h = e.a * (i * s + p * o * e.k) + e.cy, g = e.a * p * c < 0, _ = Z(m * n), v = Z(h * n), y = g === f ? "L" : "M";
		g ? d += `${y}${_} ${v}` : u += `${y}${_} ${v}`, f = g;
	}
	let p = Math.cos(e.tilt) * e.a * n, m = Math.sin(e.tilt) * e.a * n;
	return {
		id: r,
		front: u,
		back: d,
		width: e.width * n,
		opacity: i,
		grad: {
			x1: Z(e.cx * n - p),
			y1: Z(e.cy * n - m),
			x2: Z(e.cx * n + p),
			y2: Z(e.cy * n + m),
			stops: [
				_o(e.hue),
				_o(e.hue + e.hueSpan * .5),
				_o(e.hue + e.hueSpan)
			]
		}
	};
}
var yo = go(659918), bo = Array.from({ length: 6 }, (e, t) => ({
	a: 1.3 + yo() * .1,
	k: .05 + yo() * .4,
	tilt: t / 6 * Math.PI + yo() * .5,
	speed: 3 + yo() * .7,
	phase: yo() * q,
	sweep: .6 + yo() * .25,
	hue: t * 360 / 6 + yo() * 30,
	hueSpan: 60 + yo() * 60,
	width: .05 + yo() * .012,
	cx: 0,
	cy: .1
})), xo = Array.from({ length: 4 }, (e, t) => ({
	a: .78 + t * .2,
	k: .05 + t * .02,
	tilt: -.62 + t * .05,
	speed: .3,
	phase: .06 * t,
	sweep: .4,
	hue: 95 + t * 62,
	hueSpan: 100,
	width: .05,
	cx: 0,
	cy: -.12
})), So = [
	-.557,
	-.013,
	.532
], Co = .165, wo = 1.25, To = go(48879), Eo = Array.from({ length: 5 }, (e, t) => ({
	birth: t * .2,
	angle: To() * q,
	rho: .58 + To() * .18
}));
function Do(e, t) {
	let n = [];
	for (let r of Eo) {
		let i = e - r.birth;
		if (i < 0 || i > .62) continue;
		let a = r.rho * .75 ** (i * 10), o = r.angle + i * 100 * Math.PI / 180;
		n.push({
			x: Math.cos(o) * a * t,
			y: Math.sin(o) * a * t,
			r: (.04 + .028 * J(i / .55)) * t,
			depth: J(1 - a / .8),
			opacity: J(i / .06) * J((.62 - i) / .08)
		});
	}
	return n;
}
var Oo = go(49383), ko = Array.from({ length: 4 }, (e, t) => {
	let n = t - 1.5;
	return {
		a: .85 * (1 + n * .03),
		k: .15 / .85 * (1 + n * .16),
		tilt: 34 * Math.PI / 180 + n * .035,
		speed: 210 / 360,
		phase: -t * .045 + Oo() * .012,
		sweep: .34,
		hue: t * 85 + Oo() * 20,
		hueSpan: 80,
		width: .095,
		cx: 0,
		cy: 0
	};
}), Ao = .129, jo = "#2496e8", Mo = 1.003, No = .15, Po = 1.14, Fo = .054, Io = 15.46, Lo = .186, Ro = .412, zo = {
	yaw: 28.49,
	pitch: 28.62,
	roll: -13
}, Bo = (e) => e * Math.PI / 180;
function Vo(e, t, n) {
	let r = Math.cos(n), i = Math.sin(n);
	return [[
		e[0] * r + t[0] * i,
		e[1] * r + t[1] * i,
		e[2] * r + t[2] * i
	], [
		t[0] * r - e[0] * i,
		t[1] * r - e[1] * i,
		t[2] * r - e[2] * i
	]];
}
function Ho(e, t, n = Io) {
	let r = [
		0,
		0,
		1
	], i = [
		1,
		0,
		0
	], a = [
		0,
		1,
		0
	];
	[r, i] = Vo(r, i, Bo(e.yaw)), [a, r] = Vo(a, r, Bo(e.pitch)), [i, a] = Vo(i, a, Bo(e.roll));
	let o = (e) => {
		let [o, s] = Vo(r, i, Bo(n * e));
		return {
			x: o[0] * t,
			y: o[1] * t,
			a: s[0],
			b: s[1],
			c: a[0],
			d: a[1],
			depth: o[2]
		};
	};
	return [o(-1), o(1)];
}
var Uo = go(24301), Wo = (() => {
	let e = [], t = 1.4;
	for (; t < 900;) e.push(t), t += 1.9 + Uo() * 2.7, Uo() < .18 && (e.push(t), t += .24);
	return e;
})(), Go = .18;
function Ko(e) {
	for (let t = 0; t < Wo.length; t++) {
		let n = Wo[t];
		if (e < n) break;
		let r = (e - n) / Go;
		if (r >= 0 && r <= 1) return r < .45 ? 1 - r / .45 : (r - .45) / .55;
	}
	return 1;
}
function qo(e, t = {}) {
	let { wander: n = 1, blink: r = !0, float: i = !0 } = t;
	return {
		dYaw: (ho(e, 11.3, .4) * 5.5 + ho(e, 3.7, 2.1) * 1.6) * n,
		dPitch: (ho(e, 9.1, 1.3) * 4.2 + ho(e, 4.3, .7) * 1.3) * n,
		dRoll: ho(e, 13.7, 3.2) * 2.2 * n,
		lid: r ? Ko(e) : 1,
		driftX: i ? ho(e, 7.9, 1.9) * .006 : 0,
		driftY: i ? ho(e, 5.3, .3) * .007 : 0,
		breath: i ? 1 + Math.sin(e / 3.4 * Math.PI * 2) * .005 : 1
	};
}
function Jo(e) {
	return .06 + .94 * J(e);
}
//#endregion
//#region src/bot/expressions.ts
var Yo = (e, t, n = 0, r = 1) => ({
	w: e,
	h: t,
	tilt: n,
	open: r
}), Q = (e, t, n = 0, r = 1) => [Yo(e, t, n, r), Yo(e, t, -n, r)], Xo = [
	{
		id: "neutre",
		gaze: { ...zo },
		split: Io,
		eyes: [Yo(Lo, Ro), Yo(Lo, Ro)]
	},
	{
		id: "attentif",
		gaze: {
			yaw: 4,
			pitch: 5,
			roll: -4
		},
		split: 16,
		eyes: Q(.21, .44)
	},
	{
		id: "surpris",
		gaze: {
			yaw: 3,
			pitch: -3,
			roll: 0
		},
		split: 19,
		eyes: Q(.45, .47)
	},
	{
		id: "excite",
		gaze: {
			yaw: 6,
			pitch: -14,
			roll: 0
		},
		split: 19.5,
		eyes: Q(.4, .56, -10)
	},
	{
		id: "heureux",
		gaze: {
			yaw: 5,
			pitch: 9,
			roll: 0
		},
		split: 17,
		eyes: Q(.27, .17, 14)
	},
	{
		id: "hilare",
		gaze: {
			yaw: 4,
			pitch: 14,
			roll: 0
		},
		split: 18,
		eyes: Q(.34, .13, 20)
	},
	{
		id: "colere",
		gaze: {
			yaw: 3,
			pitch: 7,
			roll: 0
		},
		split: 17,
		eyes: Q(.34, .15, 30)
	},
	{
		id: "triste",
		gaze: {
			yaw: 3,
			pitch: -13,
			roll: 0
		},
		split: 16,
		eyes: Q(.22, .4, -28)
	},
	{
		id: "effraye",
		gaze: {
			yaw: 2,
			pitch: -20,
			roll: 0
		},
		split: 20.5,
		eyes: Q(.4, .6)
	},
	{
		id: "mefiant",
		gaze: {
			yaw: 12,
			pitch: 6,
			roll: -6
		},
		split: 16,
		eyes: [Yo(.21, .4), Yo(.22, .15)]
	},
	{
		id: "confus",
		gaze: {
			yaw: -14,
			pitch: 3,
			roll: 8
		},
		split: 16.5,
		eyes: [Yo(.2, .44, -18), Yo(.28, .17, 14)]
	},
	{
		id: "curieux",
		gaze: {
			yaw: 16,
			pitch: -9,
			roll: -15
		},
		split: 16.5,
		eyes: [Yo(.24, .46, -8), Yo(.2, .38, -8)]
	},
	{
		id: "fier",
		gaze: {
			yaw: 5,
			pitch: 17,
			roll: 0
		},
		split: 17,
		eyes: Q(.3, .15, 18)
	},
	{
		id: "timide",
		gaze: {
			yaw: -19,
			pitch: -14,
			roll: -7
		},
		split: 14,
		eyes: Q(.17, .3)
	},
	{
		id: "blase",
		gaze: {
			yaw: -22,
			pitch: 2,
			roll: 0
		},
		split: 16,
		eyes: Q(.3, .12)
	},
	{
		id: "somnolent",
		gaze: {
			yaw: 6,
			pitch: -9,
			roll: -3
		},
		split: 16,
		eyes: Q(.2, .42, 0, .42)
	}
], Zo = new Map(Xo.map((e) => [e.id, e])), Qo = (e, t, n) => ({
	w: Y(e.w, t.w, n),
	h: Y(e.h, t.h, n),
	tilt: Y(e.tilt ?? 0, t.tilt ?? 0, n),
	open: Y(e.open, t.open, n)
});
function $o(e, t, n) {
	return {
		id: t.id,
		gaze: {
			yaw: Y(e.gaze.yaw, t.gaze.yaw, n),
			pitch: Y(e.gaze.pitch, t.gaze.pitch, n),
			roll: Y(e.gaze.roll, t.gaze.roll, n)
		},
		split: Y(e.split, t.split, n),
		eyes: [Qo(e.eyes[0], t.eyes[0], n), Qo(e.eyes[1], t.eyes[1], n)]
	};
}
//#endregion
//#region src/bot/profiles.ts
var es = {
	egg: [
		.8369,
		.8424,
		.8497,
		.8585,
		.8674,
		.8775,
		.8878,
		.8983,
		.9089,
		.9185,
		.9288,
		.9374,
		.9445,
		.9504,
		.9543,
		.9559,
		.9555,
		.9519,
		.9466,
		.9389,
		.9302,
		.9193,
		.9085,
		.8969,
		.8852,
		.8734,
		.8625,
		.8513,
		.8411,
		.8325,
		.8243,
		.8179,
		.8137,
		.8112,
		.8102,
		.8128,
		.8178,
		.8262,
		.8374,
		.8518,
		.8702,
		.8922,
		.9169,
		.9446,
		.9741,
		1.0023,
		1.0267,
		1.0433,
		1.0481,
		1.0393,
		1.0216,
		.997,
		.9697,
		.9418,
		.9169,
		.8949,
		.876,
		.8604,
		.849,
		.8394,
		.8337,
		.8314,
		.8305,
		.8326
	],
	hexagon: [
		.921,
		.9282,
		.9441,
		.9706,
		.9984,
		1.0059,
		.9896,
		.9562,
		.929,
		.9124,
		.9047,
		.9058,
		.9157,
		.9349,
		.9642,
		.9873,
		.9882,
		.9665,
		.9336,
		.9105,
		.8968,
		.8918,
		.8955,
		.908,
		.9293,
		.9611,
		.982,
		.9812,
		.959,
		.9282,
		.9089,
		.8978,
		.8964,
		.9026,
		.9189,
		.9439,
		.9778,
		.999,
		.9964,
		.9713,
		.9439,
		.9274,
		.9196,
		.9206,
		.9308,
		.9502,
		.9799,
		1.0121,
		1.0226,
		1.0071,
		.9752,
		.951,
		.9366,
		.9316,
		.9351,
		.9485,
		.9711,
		1.0026,
		1.0213,
		1.0155,
		.9863,
		.9547,
		.9347,
		.9232
	],
	triangle: [
		.7819,
		.8211,
		.8747,
		.944,
		1.0223,
		1.096,
		1.1401,
		1.134,
		1.0808,
		1.0047,
		.9265,
		.8603,
		.8104,
		.773,
		.745,
		.7273,
		.7151,
		.7118,
		.7148,
		.7245,
		.7427,
		.768,
		.8037,
		.8518,
		.9148,
		.9876,
		1.0583,
		1.1073,
		1.1109,
		1.0667,
		.994,
		.9164,
		.8482,
		.7948,
		.7555,
		.7261,
		.7056,
		.6925,
		.6859,
		.6869,
		.6938,
		.7084,
		.7305,
		.7615,
		.804,
		.8595,
		.9311,
		1.0092,
		1.0791,
		1.1171,
		1.1054,
		1.0501,
		.9779,
		.905,
		.845,
		.799,
		.7656,
		.7413,
		.7258,
		.716,
		.7146,
		.7204,
		.733,
		.7528
	]
}, ts = Array.from({ length: 64 }, (e, t) => t / 64 * q), ns = ts.map(Math.cos), rs = ts.map(Math.sin);
function is(e, t = {}) {
	return {
		radii: [...es[e]],
		rot: 0,
		cx: 0,
		cy: 0,
		sx: 1,
		sy: 1,
		...t
	};
}
function as(e, t = {}) {
	return {
		radii: Array(64).fill(e),
		rot: 0,
		cx: 0,
		cy: 0,
		sx: 1,
		sy: 1,
		...t
	};
}
function os(e, t, n, r) {
	let i = r ?? {
		radii: Array(64),
		rot: 0,
		cx: 0,
		cy: 0,
		sx: 1,
		sy: 1
	};
	for (let r = 0; r < 64; r++) i.radii[r] = Y(e.radii[r] ?? 1, t.radii[r] ?? 1, n);
	let a = t.rot - e.rot;
	for (; a > Math.PI;) a -= q;
	for (; a < -Math.PI;) a += q;
	return i.rot = e.rot + a * n, i.cx = Y(e.cx, t.cx, n), i.cy = Y(e.cy, t.cy, n), i.sx = Y(e.sx, t.sx, n), i.sy = Y(e.sy, t.sy, n), i;
}
function ss(e, t, n = []) {
	let r = Math.cos(e.rot), i = Math.sin(e.rot);
	for (let a = 0; a < 64; a++) {
		let o = e.radii[a] ?? 1, s = o * (ns[a] ?? 0), c = o * (rs[a] ?? 0), l = s * r - c * i, u = s * i + c * r, d = n[a] ?? {
			x: 0,
			y: 0
		};
		d.x = (l * e.sx + e.cx) * t, d.y = (u * e.sy + e.cy) * t, n[a] = d;
	}
	return n.length = 64, n;
}
function cs(e, t = 1 / 6) {
	let n = e.length;
	if (n < 3) return "";
	let r = e[0], i = `M${Z(r.x)} ${Z(r.y)}`;
	for (let r = 0; r < n; r++) {
		let a = e[(r - 1 + n) % n], o = e[r], s = e[(r + 1) % n], c = e[(r + 2) % n], l = o.x + (s.x - a.x) * t, u = o.y + (s.y - a.y) * t, d = s.x - (c.x - o.x) * t, f = s.y - (c.y - o.y) * t;
		i += `C${Z(l)} ${Z(u)} ${Z(d)} ${Z(f)} ${Z(s.x)} ${Z(s.y)}`;
	}
	return `${i}Z`;
}
function ls(e, t, n) {
	let r = Array(64).fill(0), i = e.length;
	for (let a = 0; a < 64; a++) {
		let o = ns[a] ?? 0, s = rs[a] ?? 0, c = 0;
		for (let r = 0; r < i; r++) {
			let a = e[r], l = e[(r + 1) % i], u = l.x - a.x, d = l.y - a.y, f = o * d - s * u;
			if (Math.abs(f) < 1e-9) continue;
			let p = a.x - t, m = a.y - n, h = (p * d - m * u) / f, g = (p * s - m * o) / f;
			h > c && g >= 0 && g <= 1 && (c = h);
		}
		r[a] = c;
	}
	return r;
}
function us(e, t, n, r, i, a, o = 96) {
	let s = r - e, c = i - t, l = Math.hypot(s, c) || 1e-6, u = Math.atan2(c, s), d = Math.acos(Math.max(-1, Math.min(1, (n - a) / l))), f = [];
	for (let r = 0; r <= o / 2; r++) {
		let i = u + d + (q - 2 * d) * r / (o / 2);
		f.push({
			x: e + Math.cos(i) * n,
			y: t + Math.sin(i) * n
		});
	}
	for (let e = 0; e <= o / 2; e++) {
		let t = u - d + 2 * d * e / (o / 2);
		f.push({
			x: r + Math.cos(t) * a,
			y: i + Math.sin(t) * a
		});
	}
	return f;
}
function ds(e, t) {
	let n = e.length, r = (t / q % 1 + 1) % 1 * n, i = Math.floor(r);
	return Y(e[i % n] ?? 1, e[(i + 1) % n] ?? 1, r - i);
}
function fs(e, t = 1, n = 1) {
	return ts.map((r, i) => (Math.abs((ns[i] ?? 0) / t) ** e + Math.abs((rs[i] ?? 0) / n) ** e) ** (-1 / e));
}
function ps(e) {
	let t = Array(64).fill(0);
	for (let n = 0; n < 64; n++) {
		let r = ns[n] ?? 0, i = rs[n] ?? 0, a = 0;
		for (let t of e) {
			let e = r * t.x + i * t.y, n = e * e - (t.x * t.x + t.y * t.y - t.r * t.r);
			if (n < 0) continue;
			let o = e + Math.sqrt(n);
			o > a && (a = o);
		}
		t[n] = a;
	}
	return t;
}
function ms(e, t, n = 10) {
	let r = e.length, i = [], a = (e, t) => {
		let n = t.x - e.x, r = t.y - e.y, i = Math.hypot(n, r) || 1;
		return Math.atan2(-n / i, r / i);
	};
	for (let o = 0; o < r; o++) {
		let s = e[(o - 1 + r) % r], c = e[o], l = e[(o + 1) % r], u = a(s, c), d = a(c, l) - u;
		for (; d > Math.PI;) d -= q;
		for (; d < -Math.PI;) d += q;
		for (let e = 0; e <= n; e++) {
			let r = u + d * e / n;
			i.push({
				x: c.x + Math.cos(r) * t,
				y: c.y + Math.sin(r) * t
			});
		}
	}
	return i;
}
function hs(e, t, n, r = 0) {
	let i = r * Math.PI / 180;
	return ls(ms(Array.from({ length: e }, (r, a) => {
		let o = i + a / e * q;
		return {
			x: Math.cos(o) * (t - n),
			y: Math.sin(o) * (t - n)
		};
	}), n), 0, 0);
}
function gs(e, t = 1) {
	if (e.length < 3) return "";
	let n = "";
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		n += `${r === 0 ? "M" : "L"}${Z(i.x * t)} ${Z(i.y * t)}`;
	}
	return `${n}Z`;
}
function _s(e, t) {
	let n = Math.max(e, .01) / 2, r = Math.max(t, .01) / 2, i = Math.min(n, r);
	return `M${Z(-n)} ${Z(-r + i)}A${Z(i)} ${Z(i)} 0 0 1 ${Z(-n + i)} ${Z(-r)}L${Z(n - i)} ${Z(-r)}A${Z(i)} ${Z(i)} 0 0 1 ${Z(n)} ${Z(-r + i)}L${Z(n)} ${Z(r - i)}A${Z(i)} ${Z(i)} 0 0 1 ${Z(n - i)} ${Z(r)}L${Z(-n + i)} ${Z(r)}A${Z(i)} ${Z(i)} 0 0 1 ${Z(-n)} ${Z(r - i)}Z`;
}
//#endregion
//#region src/bot/skins.ts
function vs(e, t = 1) {
	let n = Math.max(...e);
	if (n <= 0) return e;
	let r = t / n;
	return e.map((e) => e * r);
}
var ys = vs(Array.from({ length: 64 }, (e, t) => t / 64 * Math.PI * 2).map((e) => 1 + .075 * Math.cos(2 * e + .5) + .035 * Math.cos(3 * e + 2.1)), 1.02), bs = vs(ps([
	{
		x: -.44,
		y: .2,
		r: .54
	},
	{
		x: .46,
		y: .2,
		r: .5
	},
	{
		x: .02,
		y: .3,
		r: .6
	},
	{
		x: -.24,
		y: -.3,
		r: .48
	},
	{
		x: .3,
		y: -.24,
		r: .44
	}
]), 1.02), xs = vs(ls(us(0, .28, .66, 0, -.96, .05), 0, 0), 1.04), Ss = ls(us(-.42, 0, .62, .42, 0, .62), 0, 0), Cs = [
	{
		id: "cercle",
		radii: Array(64).fill(1)
	},
	{
		id: "galet",
		radii: ys
	},
	{
		id: "squircle",
		radii: vs(fs(4.2), 1.15)
	},
	{
		id: "capsule",
		radii: Ss
	},
	{
		id: "triangle",
		radii: hs(3, 1.12, .34, -90)
	},
	{
		id: "hexagone",
		radii: hs(6, 1.04, .26, 0)
	},
	{
		id: "nuage",
		radii: bs
	},
	{
		id: "goutte",
		radii: xs
	}
], ws = new Map(Cs.map((e) => [e.id, e])), Ts = new Map([
	{
		id: "encre",
		hex: "#0a0a0c"
	},
	{
		id: "claude",
		hex: "#d97757"
	},
	{
		id: "brun",
		hex: "#8b5e3c"
	},
	{
		id: "rouge",
		hex: "#e8483f"
	},
	{
		id: "orange",
		hex: "#f08a24"
	},
	{
		id: "ambre",
		hex: "#f0b429"
	},
	{
		id: "vert",
		hex: "#3ecf8e"
	},
	{
		id: "turquoise",
		hex: "#2fbfa0"
	},
	{
		id: "bleu",
		hex: "#3b93f0"
	},
	{
		id: "violet",
		hex: "#8b5cf6"
	},
	{
		id: "rose",
		hex: "#e152b0"
	},
	{
		id: "gris",
		hex: "#a3a3a3"
	},
	{
		id: "creme",
		hex: "#f1efe9"
	}
].map((e) => [e.id, e]));
function Es(e, t, n) {
	let r = (e) => {
		let t = parseInt(e.slice(1), 16);
		return [
			t >> 16 & 255,
			t >> 8 & 255,
			t & 255
		];
	}, i = r(e), a = r(t);
	return `#${i.map((e, t) => Math.round(e + (a[t] - e) * n)).map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
//#endregion
//#region src/bot/states.ts
var Ds = (e, t) => [{
	w: e,
	h: t,
	open: 1
}, {
	w: e,
	h: t,
	open: 1
}];
function $(e = {}) {
	return {
		sil: as(1),
		offX: 0,
		offY: 0,
		gaze: { ...zo },
		split: Io,
		eyes: Ds(Lo, Ro),
		eyeAlpha: 1,
		bodyAlpha: 1,
		dots: [],
		arcs: [],
		notif: null,
		dotsBehind: !1,
		...e
	};
}
var Os = -.1875, ks = ls(us(0, -.505, .132, 0, .13, .075), 0, Os), As = ls(us(0, -.2535, .1345, 0, .2535, .1345), 0, 0), js = (e = {}) => ({
	radii: [...ks],
	rot: 0,
	cx: 0,
	cy: Os,
	sx: 1,
	sy: 1,
	...e
}), Ms = (e = {}) => ({
	radii: [...As],
	rot: 0,
	cx: 0,
	cy: 0,
	sx: 1,
	sy: 1,
	...e
}), Ns = gs(us(0, 0, .118, 0, .172, .012)), Ps = .213;
function Fs(e) {
	return is("triangle", {
		rot: e,
		cx: -.213 * Math.sin(e),
		cy: Ps * Math.cos(e)
	});
}
function Is(e, t) {
	let n = ((e - t * .5) / 1.5 % 1 + 1) % 1;
	return J((n < .5 ? .5 - .5 * Math.cos(n * q) : 0) * 2);
}
var Ls = [
	{
		id: "idle",
		duration: 2.4,
		morph: .45,
		blinkIn: !1,
		baseFace: !0,
		baseBody: !0,
		pose: () => $()
	},
	{
		id: "thinking",
		duration: 2.6,
		morph: .4,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !0,
		pose: (e) => {
			let t = Is(e, 1), n = .3 + .7 * X.easeOutCubic(J(e / .3));
			return $({
				sil: as(Co * (1 + (wo - 1) * t), { cx: So[1] }),
				eyeAlpha: 0,
				dots: [0, 2].map((t) => {
					let r = Is(e, t);
					return {
						x: So[t] * n,
						y: 0,
						r: Co * (1 + (wo - 1) * r),
						opacity: .55 + .45 * r
					};
				})
			});
		}
	},
	{
		id: "wink",
		duration: 1.6,
		morph: .3,
		blinkIn: !0,
		baseFace: !1,
		baseBody: !0,
		pose: () => $({
			gaze: {
				yaw: -5.37,
				pitch: 4.55,
				roll: 6.7
			},
			split: 16.25,
			eyes: [{
				w: .236,
				h: .464,
				open: 1
			}, {
				w: .447,
				h: .089,
				open: 1
			}]
		})
	},
	{
		id: "wide",
		duration: 1.8,
		morph: .55,
		blinkIn: !0,
		baseFace: !1,
		baseBody: !0,
		pose: () => $({
			gaze: {
				yaw: 6.92,
				pitch: -21.96,
				roll: 11.6
			},
			split: 18.43,
			eyes: Ds(.356, .875)
		})
	},
	{
		id: "alert",
		duration: 2.4,
		minDuration: 2,
		morph: .45,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !1,
		pose: (e) => {
			let t = J(e / 1.5), n = X.easeInOutCubic(t) * .82 - .087, r = e > 1.6 ? J((e - 1.6) / .4) : 0, i = n * (1 - r) + .1 * r, a = Math.sin(e * 2.5 * q) * .005, o = 17.7 * Math.PI / 180;
			return $({
				sil: Ms({
					rot: o,
					cx: i,
					cy: -.325 - a
				}),
				eyeAlpha: 0,
				dots: [{
					x: i - Math.sin(o) * .58,
					y: -.325 + Math.cos(o) * .58 + a * 2.8,
					r: .118,
					d: Ns,
					rot: o * 180 / Math.PI,
					opacity: 1
				}]
			});
		}
	},
	{
		id: "notify",
		duration: 2.2,
		morph: .5,
		blinkIn: !0,
		baseFace: !1,
		baseBody: !0,
		pose: (e) => {
			let t = J(e / .45), n = 1 + (Po - 1) * Math.sin(t * Math.PI) * (1 - t * .35), r = No * (t < 1 ? n : 1), i = -42 * Math.PI / 180;
			return $({
				gaze: {
					yaw: -21.94,
					pitch: -5.82,
					roll: -12.2
				},
				split: 18.89,
				eyes: Ds(.505, .498),
				notif: {
					x: Math.cos(i) * Mo,
					y: Math.sin(i) * Mo,
					r,
					notch: r + Fo
				}
			});
		}
	},
	{
		id: "exclaim",
		duration: 2,
		morph: .45,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !1,
		pose: () => $({
			sil: js(),
			eyeAlpha: 0,
			dots: [{
				x: -.012,
				y: .526,
				r: .113,
				opacity: 1
			}]
		})
	},
	{
		id: "sleep",
		duration: 2.4,
		morph: .5,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !1,
		pose: (e) => $({
			sil: as(.1585, { cy: .11 + Math.sin(q / .6 * e) * .19 }),
			eyeAlpha: 0
		})
	},
	{
		id: "egg",
		duration: 1.8,
		morph: .4,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !0,
		pose: () => $({
			sil: is("egg"),
			gaze: {
				yaw: 19.97,
				pitch: 26.01,
				roll: -17.1
			},
			split: 11.07,
			eyes: Ds(.164, .385)
		})
	},
	{
		id: "hexagon",
		duration: 1.6,
		morph: .4,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !0,
		pose: () => $({
			sil: is("hexagon"),
			gaze: {
				yaw: 23.11,
				pitch: 24.42,
				roll: -13.3
			},
			split: 13.37,
			eyes: Ds(.177, .411)
		})
	},
	{
		id: "play",
		duration: 2,
		morph: .5,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !0,
		pose: (e) => {
			let t = J(e / .35) * J((2.2 - e) / .5);
			return $({
				sil: Fs(0),
				gaze: {
					yaw: 12,
					pitch: -8,
					roll: -6
				},
				split: 15,
				eyes: Ds(.18, .34),
				arcs: xo.map((n, r) => ({
					id: `sw${r}`,
					seed: {
						...n,
						cx: .45 - e * .42
					},
					t: e,
					opacity: t
				}))
			});
		}
	},
	{
		id: "orbit",
		duration: 3.4,
		minDuration: 2.5,
		morph: .6,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !1,
		pose: (e) => {
			let t = X.easeInOutCubic(J(e / .35)), n = -q * 1.25 * e * t, r = X.easeInOutCubic(J((e - 1.6) / .9)), i = Fs(n), a = as(1, { rot: n }), o = {
				radii: i.radii.map((e, t) => e + (a.radii[t] - e) * r),
				rot: n,
				cx: i.cx * (1 - r),
				cy: i.cy * (1 - r),
				sx: 1,
				sy: 1
			}, s = J(e / .8) * J((3.6 - e) / .9);
			return $({
				sil: o,
				gaze: {
					yaw: zo.yaw + Math.sin(e * 6.5) * 65 * (1 - r),
					pitch: -4 + r * 32,
					roll: -13
				},
				eyes: Ds(.18, .34 + r * .07),
				arcs: bo.map((t, n) => ({
					id: `rg${n}`,
					seed: t,
					t: e,
					opacity: s * J((e - n * .13) / .3)
				}))
			});
		}
	},
	{
		id: "swirl",
		duration: 1.3,
		minDuration: 1.3,
		morph: .3,
		baseFace: !0,
		baseBody: !0,
		blinkIn: !0,
		pose: (e) => $({ arcs: bo.slice(0, 3).map((t, n) => ({
			id: `sw${n}`,
			seed: t,
			t: e,
			opacity: J((e - n * .06) / .14) * J((1.22 - e) / .34)
		})) })
	},
	{
		id: "burst",
		duration: 2.6,
		minDuration: 2.4,
		morph: .4,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !1,
		pose: (e) => {
			let t = 1 - .834 * X.easeOutQuint(J(e / .7)), n = X.easeOutQuint(J((e - 1.7) / .7));
			return $({
				sil: as(t + (1 - t) * n),
				eyeAlpha: J((e - 1.85) / .4),
				dots: Do(e, 1),
				dotsBehind: !0
			});
		}
	},
	{
		id: "comet",
		duration: 2.4,
		minDuration: 2.4,
		morph: .45,
		baseFace: !1,
		baseBody: !1,
		blinkIn: !1,
		pose: (e) => {
			let t = 1 - (1 - Ao) * X.easeOutQuint(J(e / .55)), n = X.easeOutQuint(J((e - 1.85) / .6)), r = J((e - .15) / .25) * J((1.95 - e) / .3);
			return $({
				sil: as(t + (1 - t) * n, { cy: Math.sin(J(e / 1.7) * Math.PI) * .035 }),
				eyeAlpha: J((e - 2) / .35),
				arcs: ko.map((t, n) => ({
					id: `cm${n}`,
					seed: t,
					t: e,
					opacity: r
				}))
			});
		}
	}
], Rs = new Map(Ls.map((e) => [e.id, e])), zs = 100, Bs = 7.1, Vs = 5.5, Hs = .006, Us = .007;
function Ws(e, t, n) {
	let r = [], i = Ho(e.gaze, zs, e.split);
	for (let a = 0; a < 2; a++) {
		let o = i[a];
		if (o.depth <= .02) continue;
		let s = e.eyes[a], c = (s.tilt ?? 0) * Math.PI / 180, l = Math.cos(c), u = Math.sin(c), d = o.a * l + o.c * u, f = o.b * l + o.d * u, p = -o.a * u + o.c * l, m = -o.b * u + o.d * l, h = Math.max(s.w * zs, .01) / 2, g = Math.max(s.h * zs, .01) / 2, _ = Math.min(h, g), v = g > h, y = v ? g - _ : h - _, b = ds(n, Math.atan2(o.y, o.x) - t.rot);
		r.push({
			x: o.x * b,
			y: o.y * b,
			ax: (v ? p : d) * y,
			ay: (v ? m : f) * y,
			r: _,
			m: [
				d,
				f,
				p,
				m
			]
		});
	}
	return r;
}
function Gs(e, t, n, r, i) {
	let a = r - t, o = i - n, s = a * a + o * o, c = Infinity, l = 0, u = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e[r], d = s > 0 ? ((i.x - t) * a + (i.y - n) * o) / s : 0;
		d = d < 0 ? 0 : d > 1 ? 1 : d;
		let f = t + d * a - i.x, p = n + d * o - i.y, m = f * f + p * p;
		m < c && (c = m, l = f, u = p);
	}
	let d = Math.sqrt(c);
	return {
		d,
		ux: d > 1e-9 ? l / d : 0,
		uy: d > 1e-9 ? u / d : 0
	};
}
var Ks = Math.hypot(Hs, Us) * zs;
function qs(e, t, n, r) {
	let i = Infinity, a = 0, o = 0;
	for (let s of t) {
		let t = s.x + n, c = s.y + r, l = Gs(e, t - s.ax, c - s.ay, t + s.ax, c + s.ay), [u, d, f, p] = s.m, m = s.r * Math.hypot(u * l.ux + d * l.uy, f * l.ux + p * l.uy) + Ks;
		l.d - m < i && (i = l.d - m, a = l.ux, o = l.uy);
	}
	return {
		marge: i,
		ux: a,
		uy: o
	};
}
var Js = 12, Ys = 8;
function Xs(e) {
	if (!e.length) return {
		x: 0,
		y: 0
	};
	let t = (t, n) => {
		let r = Infinity;
		for (let i of e) r = Math.min(r, qs(i.contour, i.empreintes, t, n).marge);
		return r;
	}, n = Infinity;
	for (let t of e) n = Math.min(n, qs(t.calContour, t.reference, 0, 0).marge);
	let r = 0, i = 0, a = e[0].empreintes;
	for (let e of a) r -= e.x / a.length, i -= e.y / a.length;
	let o = Math.max(.35 * zs, Math.hypot(r, i) * 1.25);
	n = Math.min(n, t(r, i));
	let s = t(0, 0);
	if (s >= n && s >= 0) return {
		x: 0,
		y: 0
	};
	let c = Math.max(n, 0), l = 0, u = 0, d = Infinity, f = 0, p = 0, m = s;
	for (let e = 0; e < Js; e++) {
		let n = e / Js * Math.PI * 2, r = Math.cos(n), i = Math.sin(n);
		if (t(r * o, i * o) < c) {
			for (let e of [
				.3,
				.6,
				1
			]) {
				let n = t(r * o * e, i * o * e);
				n > m && (m = n, f = r * o * e, p = i * o * e);
			}
			continue;
		}
		let a = 0, s = o;
		for (let e = 0; e < Ys; e++) {
			let e = (a + s) / 2;
			t(r * e, i * e) >= c ? s = e : a = e;
		}
		s < d && (d = s, l = r * s, u = i * s);
	}
	let h = d === Infinity ? f : l, g = d === Infinity ? p : u;
	return {
		x: +(h / zs).toFixed(6),
		y: +(g / zs).toFixed(6)
	};
}
function Zs(e, t, n) {
	return e.baseFace && n ? {
		gaze: n.gaze,
		split: n.split,
		eyes: n.eyes
	} : {
		gaze: t.gaze,
		split: t.split,
		eyes: t.eyes
	};
}
function Qs(e) {
	let t = (e) => JSON.stringify([
		e.gaze,
		e.split,
		e.eyes,
		e.sil.rot,
		e.sil.cx,
		e.sil.cy,
		e.sil.sx,
		e.sil.sy
	]);
	return t(e.pose(0)) === t(e.pose(e.duration)) ? [0] : Array.from({ length: 3 }, (t, n) => n / 2 * e.duration);
}
function $s(e, t, n) {
	let r = [];
	for (let i of Qs(e)) {
		let a = e.pose(i), o = ss({
			...a.sil,
			radii: t
		}, zs), s = ss(a.sil, zs), c = Zs(e, a, n), l = [];
		for (let e of [-7.1, Bs]) for (let t of [-5.5, Vs]) l.push({
			...c,
			gaze: {
				yaw: c.gaze.yaw + e,
				pitch: c.gaze.pitch + t,
				roll: c.gaze.roll
			}
		});
		for (let e of l) r.push({
			empreintes: Ws(e, a.sil, t),
			reference: Ws(e, a.sil, a.sil.radii),
			contour: o,
			calContour: s
		});
	}
	return Xs(r);
}
var ec = {
	x: 0,
	y: 0
}, tc = (e, t) => `${e}|${t ?? ""}`;
function nc() {
	return new Map(Cs.map((e) => {
		let t = /* @__PURE__ */ new Map();
		for (let n of Ls) {
			if (!n.baseBody) continue;
			let r = n.baseFace ? [null, ...Xo] : [null];
			for (let i of r) t.set(tc(n.id, i?.id ?? null), $s(n, e.radii, i));
		}
		return [e.radii, t];
	}));
}
var rc = nc();
function ic(e, t, n) {
	if (!e) return ec;
	let r = rc.get(e);
	return r ? r.get(tc(t, n)) ?? r.get(tc(t, null)) ?? ec : ec;
}
//#endregion
//#region src/bot/engine.ts
var ac = {
	yaw: 0,
	pitch: 0,
	mix: 0,
	spin: 0,
	wander: 1
}, oc = (e, t, n) => ({
	yaw: Y(e.yaw, t.yaw, n),
	pitch: Y(e.pitch, t.pitch, n),
	mix: Y(e.mix, t.mix, n),
	spin: Y(e.spin, t.spin, n),
	wander: Y(e.wander, t.wander, n)
}), sc = (e, t, n) => ({
	w: Y(e.w, t.w, n),
	h: Y(e.h, t.h, n),
	open: Y(e.open, t.open, n),
	tilt: Y(e.tilt ?? 0, t.tilt ?? 0, n)
});
function cc(e, t, n) {
	let r = 1 - n;
	return {
		sil: os(e.sil, t.sil, n),
		offX: Y(e.offX, t.offX, n),
		offY: Y(e.offY, t.offY, n),
		gaze: {
			yaw: Y(e.gaze.yaw, t.gaze.yaw, n),
			pitch: Y(e.gaze.pitch, t.gaze.pitch, n),
			roll: Y(e.gaze.roll, t.gaze.roll, n)
		},
		split: Y(e.split, t.split, n),
		eyes: [sc(e.eyes[0], t.eyes[0], n), sc(e.eyes[1], t.eyes[1], n)],
		eyeAlpha: Y(e.eyeAlpha, t.eyeAlpha, n),
		bodyAlpha: Y(e.bodyAlpha, t.bodyAlpha, n),
		dots: [...e.dots.map((e) => ({
			...e,
			opacity: e.opacity * r
		})), ...t.dots.map((e) => ({
			...e,
			opacity: e.opacity * n
		}))],
		arcs: [...e.arcs.map((e) => ({
			...e,
			id: `a${e.id}`,
			opacity: e.opacity * r
		})), ...t.arcs.map((e) => ({
			...e,
			id: `b${e.id}`,
			opacity: e.opacity * n
		}))],
		notif: n < .5 ? e.notif : t.notif,
		dotsBehind: n < .5 ? e.dotsBehind : t.dotsBehind
	};
}
var lc = class e {
	scale;
	cur;
	prev = null;
	departFige = null;
	tCur = 0;
	tPrev = 0;
	blinkAt = -10;
	pts = [];
	shape = null;
	shapePrev = null;
	shapeAt = -10;
	expr = null;
	exprPrev = null;
	exprAt = -10;
	look = ac;
	lookPrev = ac;
	lookAt = -10;
	lookMorph = .24;
	static SHAPE_MORPH = .45;
	static LOOK_MORPH = .24;
	constructor(e = 100, t = "idle", n = null, r = null) {
		this.scale = e, this.cur = t, this.shape = n, this.expr = r;
	}
	setExpression(e, t = 0) {
		e !== this.expr && (this.exprPrev = this.expr, this.expr = e, this.exprAt = t);
	}
	exprAtTime(t) {
		let n = this.expr, r = this.exprPrev;
		if (!n || !r) return n;
		let i = (t - this.exprAt) / e.SHAPE_MORPH;
		return i >= 1 ? n : $o(r, n, X.easeOutQuint(J(i)));
	}
	setShape(e, t = 0) {
		e !== this.shape && (this.shapePrev = this.shape, this.shape = e, this.shapeAt = t);
	}
	shapeAtTime(t) {
		let n = this.shape, r = this.shapePrev;
		if (!n || !r) return n;
		let i = (t - this.shapeAt) / e.SHAPE_MORPH;
		if (i >= 1) return n;
		let a = X.easeOutQuint(J(i));
		return n.map((e, t) => Y(r[t] ?? e, e, a));
	}
	setLook(t, n, r = e.LOOK_MORPH) {
		t && !Number.isFinite(t.yaw + t.pitch + t.mix + t.spin + t.wander) || (this.lookPrev = this.lookAtTime(n), this.look = t ?? ac, this.lookAt = n, this.lookMorph = r);
	}
	lookAtTime(e) {
		let t = (e - this.lookAt) / this.lookMorph;
		return t >= 1 ? this.look : oc(this.lookPrev, this.look, X.easeOutQuint(J(t)));
	}
	posed(e, t, n, r) {
		let i = e.pose(t);
		return e.baseBody && n && (i = {
			...i,
			sil: {
				...i.sil,
				radii: n
			}
		}), e.baseFace && r && (i = {
			...i,
			gaze: r.gaze,
			split: r.split,
			eyes: r.eyes
		}), i;
	}
	decalageAtTime(t, n) {
		let r = (e, n, r, i) => {
			if (r === i) return i;
			let a = (t - e) / n;
			if (a >= 1) return i;
			let o = X.easeOutQuint(J(a));
			return {
				x: Y(r.x, i.x, o),
				y: Y(r.y, i.y, o)
			};
		}, i = (t) => r(this.exprAt, e.SHAPE_MORPH, ic(t, n, this.exprPrev?.id ?? null), ic(t, n, this.expr?.id ?? null));
		return r(this.shapeAt, e.SHAPE_MORPH, i(this.shapePrev), i(this.shape));
	}
	get state() {
		return this.cur;
	}
	reset(e, t) {
		this.cur = e, this.prev = null, this.departFige = null, this.tCur = t, this.tPrev = t, this.blinkAt = -10;
	}
	origine(e, t, n) {
		if (this.departFige) return this.departFige;
		if (!this.prev) return null;
		let r = Rs.get(this.prev);
		return this.posed(r, Math.max(0, e - this.tPrev), t, n);
	}
	poseComposee(e) {
		let t = Rs.get(this.cur), n = this.shapeAtTime(e), r = this.exprAtTime(e), i = this.posed(t, Math.max(0, e - this.tCur), n, r), a = e - this.tCur;
		if (a >= t.morph) return i;
		let o = this.origine(e, n, r);
		return o ? cc(o, i, X.easeOutQuint(J(a / t.morph))) : i;
	}
	setState(e, t) {
		if (e === this.cur) return;
		let n = Rs.get(this.cur).morph, r = this.prev !== null && t - this.tCur < n;
		this.departFige = r ? this.poseComposee(t) : null, this.prev = this.cur, this.tPrev = this.tCur, this.cur = e, this.tCur = t, Rs.get(e)?.blinkIn && (this.blinkAt = t);
	}
	sample(e) {
		let t = this.scale, n = Rs.get(this.cur), r = this.shapeAtTime(e), i = this.exprAtTime(e), a = this.posed(n, Math.max(0, e - this.tCur), r, i), o = this.decalageAtTime(e, this.cur), s = e - this.tCur, c = s < n.morph ? this.origine(e, r, i) : null;
		if (c) {
			let t = X.easeOutQuint(J(s / n.morph));
			a = cc(c, a, t);
			let r = this.prev;
			if (r) {
				let n = this.decalageAtTime(e, r);
				o = {
					x: Y(n.x, o.x, t),
					y: Y(n.y, o.y, t)
				};
			}
		}
		let l = a.eyeAlpha > .01, u = this.lookAtTime(e), d = qo(e, {
			wander: l ? u.wander : 0,
			blink: l
		}), f = {
			yaw: Y(a.gaze.yaw, u.yaw, u.mix) + d.dYaw - u.spin,
			pitch: Y(a.gaze.pitch, u.pitch, u.mix) + d.dPitch,
			roll: a.gaze.roll + d.dRoll
		}, p = J((e - this.blinkAt) / .2), m = p < 1 ? Math.abs(p * 2 - 1) : 1, h = Math.min(d.lid, m), g = a.offX + d.driftX, _ = a.offY + d.driftY, v = cs(ss({
			...a.sil,
			cx: a.sil.cx + g,
			cy: a.sil.cy + _,
			sy: a.sil.sy * d.breath
		}, t, this.pts)), y = (e, t) => ds(a.sil.radii, Math.atan2(t, e) - a.sil.rot), b = [];
		if (a.eyeAlpha > .01) {
			let e = Ho(f, t, a.split);
			for (let n = 0; n < 2; n++) {
				let r = e[n];
				if (r.depth <= .02) continue;
				let i = a.eyes[n], s = y(r.x, r.y), c = (i.tilt ?? 0) * Math.PI / 180, l = Math.cos(c), u = Math.sin(c), d = r.a * l + r.c * u, f = r.b * l + r.d * u, p = -r.a * u + r.c * l, m = -r.b * u + r.d * l, v = Jo(Math.min(h, i.open));
				b.push({
					d: _s(i.w * t, i.h * t),
					matrix: `matrix(${Z(d)},${Z(f * v)},${Z(p)},${Z(m * v)},${Z(r.x * s + (g + o.x) * t)},${Z(r.y * s + (_ + o.y) * t)})`,
					alpha: a.eyeAlpha * J(r.depth / .12)
				});
			}
		}
		let x = a.dots.filter((e) => e.opacity > .01 && e.r > 5e-4).map((e) => ({
			...e,
			x: (e.x + g) * t,
			y: (e.y + _) * t,
			r: e.r * t
		})), S = a.notif ? y(a.notif.x, a.notif.y) : 1, C = a.notif ? (a.notif.x * S + g) * t : 0, w = a.notif ? (a.notif.y * S + _) * t : 0, ee = a.notif ? {
			x: C,
			y: w,
			r: a.notif.r * t
		} : null, te = a.notif ? {
			x: C,
			y: w,
			r: a.notif.notch * t
		} : null;
		return {
			bodyPath: v,
			bodyAlpha: a.bodyAlpha,
			eyes: b,
			dots: x,
			dotsBehind: a.dotsBehind,
			arcs: a.arcs.filter((e) => e.opacity > .01).map((e) => vo(e.seed, e.t, t, e.id, e.opacity)),
			notif: ee,
			notch: te
		};
	}
}, uc = [
	"width",
	"height",
	"viewBox"
], dc = [
	"x",
	"y",
	"width",
	"height"
], fc = ["d"], pc = [
	"d",
	"transform",
	"opacity"
], mc = [
	"cx",
	"cy",
	"r"
], hc = [
	"id",
	"x1",
	"y1",
	"x2",
	"y2"
], gc = ["offset", "stop-color"], _c = {
	fill: "none",
	"stroke-linecap": "round"
}, vc = [
	"d",
	"stroke",
	"stroke-width",
	"opacity"
], yc = { key: 0 }, bc = ["opacity"], xc = ["d", "fill"], Sc = ["mask"], Cc = [
	"x",
	"y",
	"width",
	"height",
	"fill"
], wc = { key: 1 }, Tc = [
	"cx",
	"cy",
	"r",
	"fill"
], Ec = {
	fill: "none",
	"stroke-linecap": "round"
}, Dc = [
	"d",
	"stroke",
	"stroke-width",
	"opacity"
], Oc = /* @__PURE__ */ zn({
	__name: "CappyInteractiveMascot",
	props: {
		size: {
			default: 320,
			type: Number
		},
		shape: {
			default: "nuage",
			type: String
		},
		color: {
			default: "claude",
			type: String
		},
		paper: {
			default: "#f9f9f9",
			type: String
		},
		followCursor: {
			type: Boolean,
			default: !0
		},
		cycleExpressions: {
			type: Boolean,
			default: !0
		},
		expressionInterval: {
			default: 5,
			type: Number
		},
		expressions: {
			default: () => [
				"neutre",
				"attentif",
				"surpris",
				"excite",
				"confus",
				"curieux",
				"blase"
			],
			type: Array
		}
	},
	setup(e) {
		let t = e, n = ha(() => ws.get(t.shape)?.radii ?? ws.get("cercle").radii), r = ha(() => Ts.get(t.color)?.hex ?? Ts.get("encre").hex), i = /* @__PURE__ */ zt(0), a = ha(() => t.expressions[i.value] ?? "neutre"), o = ha(() => Zo.get(a.value) ?? null), s = new lc(100, "idle", n.value, o.value), c = /* @__PURE__ */ Bt(s.sample(0)), l = Math.random().toString(36).slice(2, 8), u = `cappy-mask-${l}`, d = /* @__PURE__ */ zt(null), f = typeof window < "u" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null, p = /* @__PURE__ */ zt(f?.matches ?? !1);
		function m(e) {
			p.value = e.matches;
		}
		let h = 0, g = 0, _ = 0, v = null, y = !1;
		function b(e) {
			e.pointerType !== "touch" && (v = {
				x: e.clientX,
				y: e.clientY
			});
		}
		function x() {
			v = null;
		}
		function S() {
			y &&= (s.setLook(null, _), !1);
		}
		function C() {
			if (p.value || !t.followCursor) {
				S();
				return;
			}
			let e = d.value?.getBoundingClientRect();
			if (!e || e.width === 0 || e.height === 0) return;
			let n = Math.max(1, window.innerWidth / 2), r = Math.max(1, window.innerHeight / 2), i = v ? J((v.x - (e.left + e.width / 2)) / n, -1, 1) : 0, a = v ? J((v.y - (e.top + e.height / 2)) / r, -1, 1) : 0;
			s.setLook({
				yaw: i * 20,
				pitch: -a * 15,
				mix: 1,
				spin: 0,
				wander: +(v === null)
			}, _), y = !0;
		}
		let w;
		function ee() {
			clearInterval(w), !(!t.cycleExpressions || p.value || t.expressions.length <= 1) && (w = setInterval(() => {
				i.value = (i.value + 1) % t.expressions.length;
			}, Math.max(1, t.expressionInterval) * 1e3));
		}
		function te(e) {
			h = requestAnimationFrame(te);
			let t = g ? Math.min((e - g) / 1e3, .064) : 0;
			g = e, _ += t, C(), c.value = s.sample(_), Ut(c);
		}
		kn(n, (e) => {
			s.setShape(e, _);
		}), kn(o, (e) => {
			s.setExpression(e, _);
		}), kn([
			() => t.cycleExpressions,
			() => t.expressionInterval,
			() => t.expressions
		], ee, { immediate: !0 }), kn(() => t.followCursor, (e) => {
			e || S();
		});
		function ne(e) {
			let n = {
				fill: e.color ?? (e.depth === void 0 ? r.value : Es(t.paper, r.value, e.depth)),
				opacity: e.opacity
			};
			return e.d ? {
				...n,
				d: e.d,
				transform: `translate(${e.x} ${e.y}) rotate(${e.rot ?? 0}) scale(100)`
			} : {
				...n,
				cx: e.x,
				cy: e.y,
				r: e.r
			};
		}
		return er(() => {
			window.addEventListener("pointermove", b), document.addEventListener("pointerleave", x), f?.addEventListener("change", m), h = requestAnimationFrame(te);
		}), rr(() => {
			cancelAnimationFrame(h), clearInterval(w), window.removeEventListener("pointermove", b), document.removeEventListener("pointerleave", x), f?.removeEventListener("change", m);
		}), (e, n) => (U(), W("svg", {
			ref_key: "svgRef",
			ref: d,
			width: t.size,
			height: t.size,
			viewBox: `${-L(158)} ${-L(158)} ${L(158) * 2} ${L(158) * 2}`,
			role: "img",
			"aria-label": "Cappy Mascot",
			class: "select-none"
		}, [
			zi("defs", null, [zi("mask", {
				id: u,
				maskUnits: "userSpaceOnUse",
				x: -L(158),
				y: -L(158),
				width: L(158) * 2,
				height: L(158) * 2
			}, [
				zi("path", {
					d: c.value.bodyPath,
					fill: "#fff"
				}, null, 8, fc),
				(U(!0), W(V, null, mr(c.value.eyes, (e, t) => (U(), W("path", {
					key: t,
					d: e.d,
					transform: e.matrix,
					opacity: e.alpha,
					fill: "#000"
				}, null, 8, pc))), 128)),
				c.value.notch ? (U(), W("circle", {
					key: 0,
					cx: c.value.notch.x,
					cy: c.value.notch.y,
					r: c.value.notch.r,
					fill: "#000"
				}, null, 8, mc)) : Wi("", !0)
			], 8, dc), (U(!0), W(V, null, mr(c.value.arcs, (e) => (U(), W("linearGradient", {
				id: `${L(l)}-${e.id}`,
				key: e.id,
				gradientUnits: "userSpaceOnUse",
				x1: e.grad.x1,
				y1: e.grad.y1,
				x2: e.grad.x2,
				y2: e.grad.y2
			}, [(U(!0), W(V, null, mr(e.grad.stops, (t, n) => (U(), W("stop", {
				key: n,
				offset: n / (e.grad.stops.length - 1),
				"stop-color": t
			}, null, 8, gc))), 128))], 8, hc))), 128))]),
			zi("g", _c, [(U(!0), W(V, null, mr(c.value.arcs, (e) => (U(), W("path", {
				key: `b${e.id}`,
				d: e.back,
				stroke: `url(#${L(l)}-${e.id})`,
				"stroke-width": e.width,
				opacity: e.opacity
			}, null, 8, vc))), 128))]),
			c.value.dotsBehind ? (U(), W("g", yc, [(U(!0), W(V, null, mr(c.value.dots, (e, t) => (U(), Pi(dr(e.d ? "path" : "circle"), Ji({ key: `pb${t}` }, { ref_for: !0 }, ne(e)), null, 16))), 128))])) : Wi("", !0),
			zi("g", { opacity: c.value.bodyAlpha }, [zi("path", {
				d: c.value.bodyPath,
				fill: t.paper
			}, null, 8, xc), zi("g", { mask: `url(#${u})` }, [zi("rect", {
				x: -L(158),
				y: -L(158),
				width: L(158) * 2,
				height: L(158) * 2,
				fill: r.value
			}, null, 8, Cc)], 8, Sc)], 8, bc),
			c.value.dotsBehind ? Wi("", !0) : (U(), W("g", wc, [(U(!0), W(V, null, mr(c.value.dots, (e, t) => (U(), Pi(dr(e.d ? "path" : "circle"), Ji({ key: `pf${t}` }, { ref_for: !0 }, ne(e)), null, 16))), 128))])),
			c.value.notif ? (U(), W("circle", {
				key: 2,
				cx: c.value.notif.x,
				cy: c.value.notif.y,
				r: c.value.notif.r,
				fill: L(jo)
			}, null, 8, Tc)) : Wi("", !0),
			zi("g", Ec, [(U(!0), W(V, null, mr(c.value.arcs, (e) => (U(), W("path", {
				key: `f${e.id}`,
				d: e.front,
				stroke: `url(#${L(l)}-${e.id})`,
				"stroke-width": e.width,
				opacity: e.opacity
			}, null, 8, Dc))), 128))])
		], 8, uc));
	}
}), kc = /* @__PURE__ */ io({
	name: "CappyButton",
	props: {
		size: {
			type: Number,
			default: 120
		},
		color: {
			type: String,
			default: "claude"
		},
		shape: {
			type: String,
			default: "nuage"
		},
		paper: {
			type: String,
			default: "#f9f9f9"
		},
		followCursor: {
			type: Boolean,
			default: !0
		},
		cycleExpressions: {
			type: Boolean,
			default: !0
		},
		expressionInterval: {
			type: Number,
			default: 5
		}
	},
	styles: ["\n    :host {\n      display: inline-block;\n      line-height: 0;\n    }\n    .cappy-web-btn {\n      background: transparent;\n      border: none;\n      padding: 0;\n      margin: 0;\n      cursor: pointer;\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      outline: none;\n      transition: transform 0.15s ease-out;\n      user-select: none;\n      -webkit-user-select: none;\n    }\n    .cappy-web-btn:hover {\n      transform: scale(1.05);\n    }\n    .cappy-web-btn:active {\n      transform: scale(0.95);\n    }\n    .cappy-web-btn:focus-visible {\n      outline: 2px solid #2596be;\n      outline-offset: 4px;\n      border-radius: 9999px;\n    }\n    "],
	setup(e) {
		return () => ga("button", {
			type: "button",
			class: "cappy-web-btn",
			ariaLabel: "Cappy Mascot Button"
		}, [ga(Oc, {
			size: Number(e.size),
			color: e.color,
			shape: e.shape,
			paper: e.paper,
			followCursor: e.followCursor,
			cycleExpressions: e.cycleExpressions,
			expressionInterval: Number(e.expressionInterval)
		})]);
	}
});
typeof customElements < "u" && !customElements.get("cappy-button") && customElements.define("cappy-button", kc);
//#endregion
export { kc as CappyButtonElement };
