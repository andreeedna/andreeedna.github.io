---
layout: page
title: Lezione 1
description: le strutture dati di R, dal singolo numero alle liste
img: assets/img/course/lezione1.png
importance: 1
category: Bioinformatics Course
---

R è un linguaggio di programmazione utilizzato per la **manipolazione di dati**, il **calcolo statistico** e la **rappresentazione grafica**.
È un ambiente [open source](https://www.r-project.org/) basato sugli **oggetti**: ogni dato che usiamo (un numero, una tabella, il risultato di un test) viene salvato in un oggetto con un nome, che possiamo richiamare, modificare e combinare con altri.

R si può usare da terminale oppure tramite l'interfaccia grafica [RStudio](https://posit.co/download/rstudio-desktop/), disponibile per Windows, MacOS e Linux.

In questa lezione costruiamo le strutture dati di R un pezzo alla volta: si parte dal singolo valore e si arriva alle liste, che possono contenere qualsiasi cosa.

<div class="modules">
<div class="module m1"><h3>1 dimensione</h3><p>vettori e fattori: una fila di elementi</p></div>
<div class="module m2"><h3>2 dimensioni</h3><p>matrici e data frame: righe e colonne</p></div>
<div class="module m3"><h3>Contenitori</h3><p>array e liste: più dimensioni o oggetti diversi insieme</p></div>
</div>

## Primi passi
Il testo si scrive tra virgolette e si stampa con `print()`. Tutto quello che segue `#` è un **commento**: R non lo esegue, serve a spiegare il codice.
```R
# Questo è un commento
print("Hello world")
## [1] "Hello world"
```

### Assegnare una variabile
Un valore si salva in un oggetto con `<-` (oppure `=`). Da quel momento possiamo usare il nome al posto del valore.
```R
x <- 10
x + 5        # 15, ma x resta 10
x <- x + 5   # ora x vale 15
```
Regole per i nomi:
- sono **case-sensitive**: `Gene` e `gene` sono due oggetti diversi;
- devono iniziare con una lettera e possono contenere numeri, `_` e `.`;
- meglio nomi brevi ma chiari: `conte_wt` è meglio di `a`.

## I tipi di dato: il singolo valore
Il mattone di base di ogni struttura è un singolo valore. In R esistono quattro tipi principali.

| Tipo       | Esempio            | Cosa rappresenta              |
| ---------- | ------------------ | ----------------------------- |
| numeric    | `3.14`, `5`        | numeri decimali (double)      |
| integer    | `5L`               | numeri interi                 |
| character  | `"Ucp1"`           | testo (stringhe)              |
| logical    | `TRUE`, `FALSE`    | valori veri o falsi           |

Con `class()` e `typeof()` chiediamo a R di che tipo è un oggetto.
```R
class(5)       # "numeric"
class(5L)      # "integer"
class("Ucp1")  # "character"
class(TRUE)    # "logical"
```

### Numeri
| Operazione | Simbolo | Esempio      | Risultato |
| ---------- | ------- | ------------ | --------- |
| Addizione       | `+`   | `5 + 2`   | 7    |
| Sottrazione     | `-`   | `5 - 2`   | 3    |
| Moltiplicazione | `*`   | `5 * 2`   | 10   |
| Divisione       | `/`   | `5 / 2`   | 2.5  |
| Potenza         | `^`   | `5 ^ 2`   | 25   |
| Resto           | `%%`  | `5 %% 2`  | 1    |
| Divisione intera| `%/%` | `5 %/% 2` | 2    |

```R
sqrt(16)      # radice quadrata: 4
log2(8)       # logaritmo in base 2: 3
log10(1000)   # 3
exp(1)        # 2.718282
round(3.14159, 2)  # 3.14
1e3           # notazione scientifica: 1000
```

Alcuni valori speciali:
```R
1 / 0      # Inf (infinito)
0 / 0      # NaN (Not a Number)
NA         # valore mancante (Not Available)
```

### Testo
```R
gene <- "Ucp1"
nchar("Biologia")            # numero di caratteri: 8
toupper("tp53")              # "TP53"
substr("ATGCGT", 1, 3)       # "ATG"
paste("gene", "Ucp1")        # "gene Ucp1" (con spazio)
paste0("gene", "_", "Ucp1")  # "gene_Ucp1" (senza spazio)
```

### Logici e confronti
I confronti restituiscono sempre un valore logico.

| Operatore | Descrizione        |
| --------- | ------------------ |
| `<` `>`   | minore / maggiore  |
| `<=` `>=` | minore o uguale / maggiore o uguale |
| `==`      | uguale             |
| `!=`      | diverso            |
| `!X`      | NOT X              |
| `X \| Y`  | X OR Y             |
| `X & Y`   | X AND Y            |

```R
3 > 2              # TRUE
"Ucp1" == "ucp1"   # FALSE (maiuscole e minuscole contano)
(3 > 2) & (1 > 5)  # FALSE
(3 > 2) | (1 > 5)  # TRUE
```

### Convertire un tipo in un altro
Le funzioni `as.*()` convertono, le funzioni `is.*()` controllano.
```R
as.numeric("3.5")   # 3.5
as.character(42)    # "42"
as.integer(3.9)     # 3 (tronca, non arrotonda)
as.numeric("abc")   # NA, con un warning
is.numeric(42)      # TRUE
```

***
## Vettori
Un **vettore** è una fila di valori **tutti dello stesso tipo**. In R anche un singolo numero è un vettore di lunghezza 1: per questo il vettore è la struttura su cui si costruisce tutto il resto.

### Creare un vettore
```R
# c() combina i valori
espressione <- c(12.5, 3.1, 8.7, 20.2)
geni <- c("Ucp1", "Lep", "Adipoq", "Actb")
significativo <- c(TRUE, FALSE, TRUE, FALSE)

# sequenze
1:5                          # 1 2 3 4 5
seq(0, 1, by = 0.25)         # 0.00 0.25 0.50 0.75 1.00
seq(1, 10, length.out = 4)   # 1 4 7 10

# ripetizioni
rep("WT", 3)                    # "WT" "WT" "WT"
rep(c("A", "B"), times = 2)     # "A" "B" "A" "B"
rep(c("A", "B"), each = 2)      # "A" "A" "B" "B"

length(espressione)   # 4
```

Se mescoliamo tipi diversi, R li converte tutti nel tipo più "generale" (**coercizione**): logico → numerico → testo.
```R
c(1, TRUE, FALSE)   # 1 1 0
c(1, "a", TRUE)     # "1" "a" "TRUE"
```

### Accedere agli elementi
Si usano le parentesi quadre. A differenza di molti linguaggi, **il primo elemento ha indice 1**.
```R
v <- c(10, 20, 30, 40, 50)

v[1]           # 10
v[c(1, 3)]     # 10 30
v[2:4]         # 20 30 40
v[-1]          # tutti tranne il primo: 20 30 40 50
v[v > 25]      # selezione con un vettore logico: 30 40 50
which(v > 25)  # le posizioni: 3 4 5

v[2] <- 99     # modificare un elemento
v <- c(v, 60)  # aggiungere un elemento in fondo
```

Ogni elemento può avere un **nome**, e si può accedere tramite quello:
```R
names(espressione) <- geni
espressione["Ucp1"]   # 12.5
```

### Operazioni sui vettori
Le operazioni sono **vettorizzate**: si applicano a tutti gli elementi insieme, senza bisogno di cicli.
```R
a <- c(1, 2, 3)
b <- c(10, 20, 30)

a + 1        # 2 3 4
a * b        # 10 40 90
log2(b)      # 3.321928 4.321928 4.906891
a > 1        # FALSE TRUE TRUE
```
Se i vettori hanno lunghezza diversa, il più corto viene **riciclato**:
```R
1:6 + c(10, 20)   # 11 22 13 24 15 26
```

### Funzioni utili sui vettori
```R
x <- c(5, 3, 8, 3, 10)

sum(x); mean(x); median(x)
min(x); max(x); range(x)
sort(x)                     # 3 3 5 8 10
sort(x, decreasing = TRUE)  # 10 8 5 3 3
rev(x)                      # ordine inverso
unique(x)                   # 5 3 8 10
table(x)                    # quante volte compare ogni valore
```

I valori mancanti `NA` "contagiano" i calcoli: vanno esclusi esplicitamente.
```R
y <- c(4, NA, 7)
mean(y)                # NA
mean(y, na.rm = TRUE)  # 5.5
is.na(y)               # FALSE TRUE FALSE
```

***
## Fattori
Un **fattore** è un vettore che rappresenta una **variabile categorica**: genotipo, trattamento, tessuto. È fondamentale nei modelli statistici e nei grafici, perché dice a R quali sono i gruppi e in che ordine.
```R
genotipo <- factor(c("WT", "KO", "WT", "KO"))
genotipo
## [1] WT KO WT KO
## Levels: KO WT

str(genotipo)
## Factor w/ 2 levels "KO","WT": 2 1 2 1
```
I gruppi si chiamano **livelli** (*levels*) e di default sono in ordine alfabetico. Internamente R salva un numero per ogni livello (`2 1 2 1`).

```R
# scegliere l'ordine dei livelli (ad esempio WT come riferimento)
genotipo <- factor(c("WT", "KO", "WT", "KO"), levels = c("WT", "KO"))
levels(genotipo)    # "WT" "KO"

# oppure cambiare solo il riferimento
genotipo <- relevel(genotipo, ref = "WT")

# rinominare i livelli
dose <- factor(c("low", "high", "low"),
               levels = c("low", "high"),
               labels = c("bassa", "alta"))

table(genotipo)     # conteggio per gruppo
nlevels(genotipo)   # 2
```

Attenzione a convertire in numero un fattore che contiene numeri:
```R
f <- factor(c("10", "20", "10"))
as.numeric(f)                 # 1 2 1  (i codici interni!)
as.numeric(as.character(f))   # 10 20 10 (i valori veri)
```

***
## Matrici
Una **matrice** è un vettore con **due dimensioni**: righe e colonne. Come nel vettore, **tutti gli elementi sono dello stesso tipo**. In bioinformatica l'esempio classico è la matrice di conte di un RNA-seq: geni sulle righe, campioni sulle colonne.

### Creare una matrice
```R
# da un unico vettore: i valori riempiono la matrice per colonne
m <- matrix(1:6, nrow = 2)
m
##      [,1] [,2] [,3]
## [1,]    1    3    5
## [2,]    2    4    6

# per riempirla per righe
matrix(1:6, nrow = 2, byrow = TRUE)

# unendo vettori della stessa lunghezza
x <- c(1, 44); y <- c(0, 12)
rbind(x, y)   # come righe
cbind(x, y)   # come colonne
```

### Una matrice di conte
```R
conte <- matrix(c(10, 250, 3,
                  12, 230, 5,
                  80,  20, 40,
                  95,  18, 37), nrow = 3)
rownames(conte) <- c("Ucp1", "Lep", "Cidea")
colnames(conte) <- c("WT1", "WT2", "KO1", "KO2")
conte

dim(conte)    # 3 4 (righe, colonne)
nrow(conte)   # 3
ncol(conte)   # 4
```

### Accedere agli elementi
Servono **due indici**: `matrice[riga, colonna]`. Lasciando vuoto uno dei due si prende l'intera riga o colonna.
```R
conte[1, 3]                  # riga 1, colonna 3: 80
conte["Ucp1", ]              # tutta la riga di Ucp1: 10 12 80 95
conte[, "KO1"]               # tutta la colonna KO1
conte[, c("KO1", "KO2")]     # sottomatrice
conte[conte[, "WT1"] > 5, ]  # geni con più di 5 conte in WT1
```

### Operazioni sulle matrici
```R
conte * 2             # elemento per elemento
log2(conte + 1)       # trasformazione logaritmica
t(conte)              # trasposta: campioni sulle righe

rowSums(conte); rowMeans(conte)   # per riga (per gene)
colSums(conte); colMeans(conte)   # per colonna (per campione)

# apply() applica una funzione a ogni riga (1) o colonna (2)
apply(conte, 1, max)
apply(conte, 2, median)
```
Per il prodotto righe per colonne dell'algebra lineare si usa `%*%`.

### Array
Un **array** generalizza la matrice a più di due dimensioni (ad esempio geni × campioni × tempi).
```R
arr <- array(1:24, dim = c(2, 3, 4))
dim(arr)        # 2 3 4
arr[1, 2, 3]    # 15
```

***
## Data frame
Il **data frame** è la struttura più usata per i dati reali: una tabella in cui **ogni colonna è un vettore** e colonne diverse possono avere **tipi diversi**. Le righe sono le osservazioni (campioni, pazienti, geni), le colonne le variabili.

### Creare un data frame
```R
df <- data.frame(gene    = c("Ucp1", "Ppargc1a", "Lep", "Adipoq"),
                 espr    = c(120.5, 45.2, 8.1, 300.7),
                 tessuto = c("BAT", "BAT", "WAT", "WAT"))
df

str(df)       # struttura: tipo di ogni colonna
head(df, 2)   # prime righe
summary(df)   # riassunto per colonna
dim(df)       # 4 3
colnames(df)  # "gene" "espr" "tessuto"
```

### Accedere a righe e colonne
```R
df$espr                # una colonna come vettore
df[["gene"]]           # stessa cosa
df[2, ]                # seconda riga
df[, c("gene", "espr")]
df[2, "espr"]          # un singolo valore: 45.2

# filtrare le righe con una condizione
df[df$espr > 50, ]
subset(df, tessuto == "BAT" & espr > 50)
```

### Modificare un data frame
```R
df$log_espr <- log2(df$espr)                 # nuova colonna
df$tessuto <- factor(df$tessuto)             # colonna categorica
df <- df[order(df$espr, decreasing = TRUE), ] # ordinare le righe

# aggiungere una riga
df <- rbind(df, data.frame(gene = "Cidea", espr = 60.3, tessuto = "BAT",
                           log_espr = log2(60.3)))

# riassunti per gruppo
table(df$tessuto)
aggregate(espr ~ tessuto, data = df, FUN = mean)
```

### Leggere e scrivere tabelle
```R
write.csv(df, "geni.csv", row.names = FALSE)
df2 <- read.csv("geni.csv")

# file separati da tabulazione
# read.delim("tabella.tsv")
```

***
## Liste
Una **lista** è un contenitore che può raccogliere **oggetti di tipo e dimensione diversi**, comprese altre liste. Molte funzioni di R (ad esempio i test statistici) restituiscono i risultati proprio come liste.
```R
esperimento <- list(nome     = "BAT freddo",
                    campioni = c("WT1", "WT2", "KO1", "KO2"),
                    conte    = conte,
                    info     = df)

str(esperimento, max.level = 1)
names(esperimento)
length(esperimento)   # 4
```

### Accedere agli elementi
```R
esperimento$campioni        # con $
esperimento[["conte"]]      # con le doppie quadre: restituisce l'oggetto
esperimento["nome"]         # con le quadre singole: restituisce una lista più piccola
esperimento$campioni[2]     # "WT2"

esperimento$note <- "ripetere qPCR"   # aggiungere un elemento
esperimento$note <- NULL              # rimuoverlo
```

### Applicare una funzione a ogni elemento
```R
misure <- list(WT = c(5.1, 4.8, 5.5), KO = c(7.2, 6.9, 7.8))

lapply(misure, mean)   # restituisce una lista
sapply(misure, mean)   # semplifica in un vettore: WT 5.133333  KO 7.3
```

### NA e NULL
`NA` è un valore che esiste ma è sconosciuto; `NULL` indica l'assenza dell'oggetto.
```R
length(NA)     # 1
length(NULL)   # 0
```

## Riassunto

| Struttura   | Dimensioni | Tipi ammessi           | Si crea con     |
| ----------- | ---------- | ---------------------- | --------------- |
| vettore     | 1          | uno solo               | `c()`           |
| fattore     | 1          | categorie (livelli)    | `factor()`      |
| matrice     | 2          | uno solo               | `matrix()`      |
| array       | n          | uno solo               | `array()`       |
| data frame  | 2          | uno per colonna        | `data.frame()`  |
| lista       | 1 (annidabile) | qualsiasi          | `list()`        |

Quando non sappiamo cosa contiene un oggetto, le tre funzioni da ricordare sono `class()`, `str()` e `dim()`.

***
## Bonus: condizioni e cicli
`if` esegue un blocco di codice solo se una condizione è vera; `else` gestisce il caso contrario.
```R
fc <- 2.5
if (fc > 1) {
  print("up")
} else if (fc < -1) {
  print("down")
} else {
  print("invariato")
}
```
`for` ripete un blocco per ogni elemento di un vettore.
```R
for (g in rownames(conte)) {
  print(paste(g, "media:", mean(conte[g, ])))
}
```
Ricorda però che in R molte operazioni sono già vettorizzate: spesso `rowMeans(conte)` sostituisce un intero ciclo.

## Esercizi
1. Crea un vettore con le altezze (in cm) di 6 persone e calcola media, mediana e deviazione standard (`sd()`). Quali persone sono sopra la media?
2. Crea un fattore `trattamento` con i valori `"ctrl"`, `"farmaco"`, `"ctrl"`, `"farmaco"`, `"farmaco"`, con `ctrl` come primo livello, e contali con `table()`.
3. Costruisci una matrice 5 × 4 di numeri casuali con `matrix(rpois(20, lambda = 50), nrow = 5)`, dai nomi a righe (geni) e colonne (campioni) e calcola la media di ogni gene.
4. Trasforma la matrice in un data frame con `as.data.frame()`, aggiungi una colonna con la media e tieni solo i geni con media superiore a 50.
5. Metti matrice e data frame in una lista e accedi al secondo gene del data frame partendo dalla lista.
