# smartTODO
Pametna spletna aplikacija za vodenje seznama opravil.

### Ciljni uporabniki
Aplikacija je namenjena vsem, ki želijo voditi pameten seznam opravil. Deluje na principu spodbujanja učinkovitejšega opravljanja opravil iz seznama na podlagi roka za dokončanja, težavnosti in prioritete opravila.

Ključna konkurenčna prednost pred drugimi tovrstnimi aplikacijami je, da ob ustvarjanju novega opravila uporabnik določi težavnost, prioriteto in datum konca, v ozadju pa teče algoritem, ki na podlagi teh treh parametrov uporabniku predlaga oz. ga opomne katero opravilo mora dokončati.

Pameten način planiranja in opravljanja opravil je uporaben predvsem pri vsakdanjem delu na delovnem mestu ali pa pri vodenju večjih projektov, kjer je potrebno narediti veliko različno težkih in pomembnih opravil. Tak način vodenja nam omogoča boljše razporejati čas in energijo na projektih.


### Ciljne naprave
Aplikacija je najbolj pregledna na namiznih zaslonih, je pa tudi optimizirana (responsive design) za manjše zaslone tabličnih računalnikov ali mobilnikov, tako da jo lahko uporabljamo kjerkoli in kadarkoli.

Testirana okolja so Google Chrome, Safari in Firefox na OS X ter Safari in Chrome na iOS.


### Težave v različnih brskalnikih
Vsak brskalnik interpretira kodo na svoj način, zato pride različnih izgledov. Na začetku sem imel težave pri odmikih v različnih brskalnikih sem dodal normalize.css, ki pomaga poenotiti osnoven css. Delovanje izgleda sem preverjal v Chrome 54, Safari 10 in Firefox 50. Kljub temu, da sem dosti časa namenil oblikovanju, se pri Firefoxu noga spletne strani prikaže z manjšim odmikom od dna strani. Ugotovil sem tudi, da Firefox ne uporabi definiran stil za drsnik (ang. slider).

### Posebni gradniki
- Kot komponento responsive design sem naredil, da se meni na manjših zaslonih skrije in je dosegljiv po kliku na "hamburger" gumb. Realiziran je popolnoma brez javascripta in sicer kot html element tipa checkbox, ki mu glede na css značko `:checked` spreminjam `display` atribut.

- Graf aktivnosti po mesecih je narjen v HTML5 Canvas, ki s pomočjo JavaScripta riše objekte na canvas. Najprej izriše y os s števili dokončanih opravil od 0 do 14 in horizontalnimi črtami. Sledi izris oznak mesecev in izris stolpcev za posemezen mesec.
