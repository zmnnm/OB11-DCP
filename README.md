# DCP rendszer használati útmutató

## Indítás:
Első és legfontosabb, hogy a Node.JS szerver fusson. Ez bármilyen tetszőleges módon mehet, de találsz mellékelve egy controller programot.
!! Ez szükséges a .pdf formátumú kamerarajzok miatt, illetve a különbőző értesítések és riasztások miatt. !!

Ha ez rendben elindult, megnyitatod az index.html file-t.

Amennyiben az autód nem tud HTML POST üzenetet küldeni, a custom-send.html segítségével is tudsz pushover üzeneteket küldeni.

## Működés:
Lisy minden éjjel 2-kor ellenőrzi az adott napi produkciókat és az azokhoz tartozó kamerarajzok meglétét. Ezt vagy elküldi vagy pedig
"hiba üzenetet" küld. Ez lehet "nincs kamerarajz" vagy "ma nincs produkció". Illetve ezek mellett a DCP tud egy "probléma adódott a letöltéssel"
hibát küldeni. Ilyen esetben Lisy-ben kell frissíteni a kamerarajzokat, vagy egy egyszerű oldal újratöltés is meg tudja oldani.

## Üzenet és parancs küldési lehetőségek:

szimpla üzenet:
HTML POST:
```
link: http://localhost:3000/send
body: {"message": "Üzenet"}
content type: application\json
```

A szimpla üzenetek megjelennek a web felületen, illetve push értesítés is megy róluk

---

Üzenet mikrofonosnak, technikusnak, műszveznek:
HTML POST:
```
link: http://localhost:3000/[isomic, isotech, isoeic] <- értelemszerűen amelyik kell
body: {"message": "Üzenet"}
content type: application\json
```

Ezeket az üzeneteket csak a címzettek kapják meg pushover üzenetként, és a web felületen nem jelennek meg.

---

Összes megjelenítő oldal újratöltése:
```
link: http://localhost:3000/reload
body: {"cmd": "reload"}
content type: application\json
```

A fentebb említett betöltési hibák ellen tökéletes.

## Egyéb infók:
A szerver localhost-on üzemel, hogy kímélje a kocsik IP forgalmát. Ha Neked ez nem megfelelő, a server file legalján tudod megváltoztatni.
Ha bármi problémád akad, vagy szeretnéd valami kis extrával megcsavarni a saját verziód, keress bátran!

Zémann-Kiss Mátyás
