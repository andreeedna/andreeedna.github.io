---
layout: page
title: R per bioinfo
description: un tutorial di R per la bioinformatica
img: assets/img/12.jpg
importance: 1
category: tutorial
---

R è un linguaggio di programmazione utilizzato per la **manipolazione di dati**, il **calcolo statistico** e la **rappresentazione grafica**.
R è un ambiente [open source](https://www.r-project.org/) per `object-oriented programming`, cioè uno stile di programmazione che si basa sulla manipolazione di **oggetti**, un approccio che rende molto semplice accedere ai dati in memoria e combinarli in strutture che possono essere anche molto complesse.

R è disponibile in versione base direttamente da terminale o tramite un'interfaccia grafica disponibile tramite [Rstudio](https://posit.co/download/rstudio-desktop/), disponibile per Windows, MacOS e Linux.


## R basics
Per caratterizzare del testo in R si usano le doppie virgolette o i doppi apici nel quale si inserisce il testo.
```R
"Hello world"
```

Per stampare del testo R ha la funzione ```print()```
```R
print("Hello world")
## [1] "Hello world"
```

I commenti sono parti del codice che non vengono interpretati/compilati ma servono per descrivere parti del codice.
```R
# Questo è un commento
# Sono parti di codice che non sono interpretate
```

### Variabili
Una variabile è una caratteristica che può presentarsi in forme diverse, e assumere stati diversi. I tipi di

- *character*, sono singoli caratteri o un insieme di caratteri che formano una stinga
- *numeric*, sono i numeri che comprendono numeri interi e decimali (double e float)
- *logical*, sono le variabili logiche TRUE/FALSE

Sulle variabili numeriche possono essere operate le operazioni:

| Operazione | Funzione        |
| ---------- | --------------- |
| +          | Addizione       |
| -          | Sottrazione     |
| /          | Divisione       |
| *          | Moltiplicazione |
| ^          | Esponente       |

***
### Assegnare una variabile
Le variabili possono essere assegnate ad un oggetto per poi essere richiamate con il nome dell'oggetto stesso (*object-oriented programming*). L'assegnazione viene effettuata con **=** o **<-**.
```R
# Assegnazione della variabile
var <- 10

# questo non riassegna la variabile
var + 10

# questo riassegna la variabile
var <- var + 10

# una variabile può essere riassegnata anche cambiando il tipo di variabile
var <- "prova"
```
Il nome della variabile può essere molto flessibile:
- i nomi degli oggetti sono **case-sensitive**: l'oggetto *MyObject* non è lo stesso di *myobject*.
- i nomi degli oggetti possono contenere numeri o lettere ma deve iniziare con una lettera.
- i nomi degli oggetti possono contenere *underscores* o *punti*


## Strutture Dati in R
In R sono presenti varie **strutture dati**, ossia un'entità utilizzata per organizzare un insieme di dati. \
Le principali sono **vettori**, **fattori**, **matrici**, **data frames** e **liste**.

### Vettori
Un vettore è la struttura dati più semplice in R e si tratta di una semplice lista di oggetti tutti dello stesso tipo. \
Per creare un vettore si usa la funzione ```c()``` al cui interno vanno inseriti tutti gli elementi separati da una virgola. Per creare un vettore vuoto si usa la funzione ```vector()```.

```R
# Vettore di stringhe
frutta <- c("banana", "mela", "arancia")

# Stampa il vettore
frutta

# Lunghezza del vettore
length(frutta) # 3
```
Un vettore può contenere anche valori numerici o di valori logici:

```R
# Vettore di numeri
numeri <- c(1, 2, 3)
numeri # 1 2 3
# L'operatore : permette di creare una sequenza numerica
sequenza <- 1:5
sequenza # 1 2 3 4 5

# Vettore di logici
logici <- c(TRUE ,TRUE, FALSE, TRUE)
```
Possiamo accedere ai singoli elementi del vettore tramite l'utilizzo delle parentesi quadre. Al contrario di altri linguaggi di programmazione, il primo elemento del vettore si accede col numero 1.
```R
# Creazione del vettore
vecnum <- 10:16

# possiamo accedere ad un singolo elemento
vecnum[1] # 10
# o ad un sottoinsieme di elementi del vettore
vecnum[c(1,3)] # 10 12
vecnum[2:4] # 11 12 13

# Possiamo modificare un singolo elemento del vettore
vecnum[4] <- 21
vecnum # 10 11 12 21 14 15 16

# Possiamo anche rimuovere un elemento di un vettore
vecnum <- vecnum[-2] # 10 12 21 14 15 16
```
Un vettore può essere **denominato**, ad ogni elemento del vettore può essere assegnato un nome.
```R
vec <- c(1, 2, 3, 4)
# Denominazione del vettore
names(vec) <- c("mRNA", "miRNA", "snoRNA", "lncRNA")

# In questo modo possiamo accedere all'elemento del vettore
# con il nome corrispondente (come in un dizionario)
vec["mRNA"] # 1
```

I vettori sono oggetti **manipolabili**, si possono aggiungere o rimuovere elementi, oppure concatenare vettori differenti tra loro per creare nuovi vettori.
```R
vec1 <- c(1, 2, 3, 12, 4)
vec2 <- c(5, 6)

# Aggiungere un elemento del vettore
vec2 <- c(vec2, 7)

# Rimuovere un elemento da un vettore
vec1 <- vec1[-4]

# Concatenare i vettori
vec3 <- c(vec1, vec2)
vec3 # 1 2 3 4 5 6 7
```

Si possono eseguire **operazioni sui vettori**, sia operazioni matemtiche sia operazioni logiche (ossia confronto tra elementi del vettore).

Le operazioni logiche effettuano un confronto, e restituiscono un logico a seconda se l'operazione è rispettata o meno. Gli operatori logici sono:

| Operatore | Descrizione        |
| --------- | ------------------ |
| <         | minore di          |
| >         | maggiore di        |
| ==        | esattamente uguale |
| !=        | non uguale         |
| !X        | NOT X              |
| X \| Y    | X OR Y             |
| X & Y     | X AND Y            |

***

```R
## OPERAZIONI LOGICHE
a <- 1:5

# quale elemento è uguale a 2?
a == 2 # FALSE TRUE FALSE FALSE FALSE

# quale elemento è maggiore di 2?
a > 2 # FALSE FALSE TRUE TRUE TRUE

# si possono selezionare elementi di un vettore che rispettano
# un'espressione logica
a[a<=2] # 1 2
```

Sui vettori sono operabili le normali operazioni matematiche ma vengono effettuate su tutti gli elementi del vettore stesso.
```R
## OPERAZIONI MATEMATICHE
a <- 1:3
a + 2 # 3 4 5

# i vettori possono essere moltiplicati tra loro
b <- c(2, 3, 0)
a * b # 2 6 0
```

### Factors
Un ***factor*** è un vettore (oggetto con una dimensione) usato per specificare una ***classificazione discreta***; sono usati principalmente per i modelli statistici e sono utili per fare i grafici.  
I factor vengono creati con la funzione ```factor()```:
```R
fac <- factor(c("high", "low", "medium", "low"))
# struttura dell'oggetto
str(fac)
## Factor w/ 2 levels "high","low": 1 2 1
```
I gruppi di factor sono chiamati ***levels***, che possono essere ordinati , con il flag ```levels```, o anche etichettati in modo differente, con il flag ```label```.
```R
##factor ordinato ed etichettato
fac <- factor(c("high", "low", "medium", "low"),
              levels=c("high", "medium", "low"),
              label=c("alto", "medio", "basso"))

str(fac)
##  Factor w/ 3 levels "alto","medio",..: 1 3 2 3
```

### Matrici
Una ***matrice*** è un vettore bidimensionale, tutte le colonne devono avere lo stesso tipo(numerical, character o logical) e la stessa lunghezza.  
Una matrice può essere creata con la funzione ```cbind()``` o ```rbind()``` a partire da singoli vettori (della stessa lunghezza!), o con la funzione ```matrix()``` a partire da un unico vettore.
```R
x <- c(1, 44)
y <- c(0, 12)
z <- c(34, 4)

# rbind
mat <- rbind(x, y, z)


i <- c(1, 0, 34)
j <- c(44, 12, 4)
# cbind
mat <- cbind(i, j)

# nrow è il numero di righe, ncol è il numero di colonne
mat <- matrix(c(1, 0, 34, 44, 12, 4),
    nrow=3,
    ncol=2)
```
Essendo oggetti bidimensionali, ogni oggetto della matrice è identificato da *due indici* corrispondenti al numero della riga e il numero della colonna.
```R
# per accedere all'elemento della matrice si usa la sintassi:
# mat[indice_riga, indice_colonna]

#accedere all'elemento in prima riga e terza colonna
mat[1,3]
```
Posso accedere anche a single righe o singole colonne andando a specificare solo una delle due dimensione, oppure specificare un subset di righe o colonne.
```R
# prima riga della matrice
mat[1,]

# terza colonna della matrice
mat[,3]

# subset della matrice
mat[2:5,]
mat[,3:4]
mat[2:5,3:4]
```

### Data Frame
Un ***data frame*** è un oggetto bidimensionale ed è molto più generico rispetto ad una matrice. Le colonne tra di loro possono avere variabili di tipo differente (ma deve essere la stessa per l'intera colonna) e devono avere tutte la stessa lunghezza.  
Un data frame è organizzato per colonne: le colonne sono le variabili mentre le righe sono le osservazioni per ogni variabile.

Un data frame viene creato tramite la funzione ```data.frame()```
```R
# i vettori sono singole colonne
df <- data.frame(c("Maria", "Juan", "Alba"),
    c(23, 25, 31),
    c(TRUE, TRUE, FALSE))

# posso assegnare il nome di colonne
df <- data.frame(c("Name" = "Maria", "Juan", "Alba"),
    "Age" = c(23, 25, 31),
    "Disease" = c(TRUE, TRUE, FALSE))
```
Si accede ai sigoli elementi o ad un sottoinsieme del data frame allo stesso modo delle matrici, specificando gli indici della riga e della colonna tra parentesi quadre.

Posso accedere al numero di righe e colonne tramite le funzioni ```nrow()``` e ```ncol()``` oppure tramite```dim()```
```R
# numero delle righe
nrow(df)
# numero delle colonne
ncol(df)
# numero righe, numero colonne
dim(df)
```

Colonne e righe di data frames possono essere nominate e posso accedere al nome di righe e colonne tramite le funzioni ```colnames()``` e ```rownames```.
```R
colnames(df) <- c("Name", "Age", "Disease")
rownames(df) <- c("Patient1", "Patient2", "Patient3")

# posso accedere a singoli elementi anche tramite il nome delle righe e colonne
df["Age", "Patient2"]
```

### Liste
Le liste in R sono elenchi indicizzati di oggetti che possono essere di tipi e classi diverse, che possono includere anche altre liste.  
Si crea una lista con la funzione ```list()```

```R
vec <- c(1, 2, 3, 4, 5)

# creazione della lista
li1 <- list(vec, 5, "pippo")

# posso anche nominare la lista
li2 <- list("el1" = vec,
            "el2" = 5,
            "el3" = "pippo")

# posso accedere agli elementi della lista in due modi
li2$el1 #con l'operatore $
li2[["el1"]] # con le doppie quadre

# usando una sola parentesi quadra si ottiene un subset della lista
sub_li <- li[1:2]

# posso accedere e modificare i nomi della lista con la funzione names()
names(li2)

```
Le liste sono oggetti molto utili quando restituire più elementi da una funzione (vedi poi)

## If e Cicli

### Conditional Statement
I **conditional statement** sono espressioni che eseguono calcoli o azioni diverse a seconda che una condizione booleana predefinita sia VERA o FALSA. I conditional statement sono creati tramite **if**
```R
if (condizione) {
  comandi
}
```
se la condizione presente tra le parentesi tonde è rispettata (**TRUE**), allora vengono eseguite tutte le operazioni interne alle parentesi graffe, se invece non è rispettata (**FALSE**) allora non succede niente.
```R
k <- 10

# print if value is > 3
if (k > 3) {
  print(k)
}

# print if value is < 3
if (k < 3) {
  print(k)
}
```
Successivamente all'if posso aggiungere ```else``` nel caso in cui l'espressione non è rispettata
```R
if(condition) {
    comandi 1
} else {
    comandi 2
}
```
Se la condizione è rispettata sono eseguite tutti i comandi 1, altrimenti sono eseguite tutte le operazioni in comandi 2.
```R
k <- 3

if (k > 3) {
  print("greater than 3")
} else {
  print("less than 3")
}
```

Posso concatenare più if tra di loro tramite ```else if```
```R
if (condition1) {
    comandi 1
} else if (condition2) {
    comandi 2
} else {
    comandi 3
}
```
Alla prima condizione rispettata il codice entra nell'if corrispondente ed esce direttamente senza fare altri controlli; se serve effettuare più controlli consecutivi bisogna usare più if consecutivi.

### Cicli
I **loop** o **cicli** sono utilizzati per ripetere specifici blocchi di codice.

Struttura del ***for loop***
```R
for (x in vector) {
  comandi
}
```
sono presenti 3 elementi:
- **i** che è la variabile del loop, viene aggiornata ad ogni ciclo
- **vettore** il vettore sul quale vogliamo eseguire le azioni
- **comandi** tutti i comandi da eseguire sul singolo elemento del vettore

Il loop for va a creare una variabile x (definiamo noi il nome della variabile) che ad ogni ciclo assume un valore del vettore (a partire dal primo) ed esegue l'insieme di operazioni tra le parentesi quadre.
```R
for(i in 2:5){
    # print il valore di i ad ogni iterazione
    print(i)
}
```
I loop possono essere utili anche per eplorare elementi di un oggetto bidimensionali
```R
# rnorm è una funzione che campiona casualmente dei valori da una distribuzione normale
# matrice di 50 righe e 16 colonne
mat <- matrix(rnorm(800), nrow=50)

# ciclo su ogni riga della matrice
for (i in 1:nrow(mymat)) {
    # stampa il valore di i
    print(i)
    # stampa il valore minimo di ogni riga
    print(min(mat[i,]))
}
```
Dentro ad un ciclo ci possono essere altri cicli o anche un condition statement

```R
# definizione del contatore
neg = 0
# loop che itera sulle righe della matrice
for (i in 1:nrow(mat)) {
    # loop che itera sulle colonne della matrice
    for (j in  1:ncol(mat)) {
      if (mat[i,j] < 0) {
          # il contatore si incrementa se il numero è negativo
          neg = neg + 1  
      }
    }
}
```

Guarda questo tutorial sui [loop in R](https://www.datacamp.com/tutorial/tutorial-on-loops-in-r) per saperne di più.

## Funzioni

## Lettura e Scrittura di File

## Grafici
Il pacchetto di R-base *graphics* offre varie funzioni per produrre vari plot.
- *Scatter Plot* - plot()
- *Bar Plot* - barplot()
- *Box Plot* - boxplot()
- *Histogram* - hist()
