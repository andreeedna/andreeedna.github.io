---
layout: page
title: Lezione 3
description: statistica di base in R, con un assaggio di analisi avanzate
img: assets/img/course/lezione3.png
importance: 3
category: Bioinformatics Course
---

La statistica serve a rispondere a due domande: **come sono fatti i miei dati?** (statistica descrittiva) e **le differenze che vedo sono reali o dovute al caso?** (statistica inferenziale). R nasce proprio per questo: quasi tutto quello che serve è già incluso, senza installare pacchetti.

Useremo dataset già presenti in R: `ToothGrowth`, `iris`, `mtcars`, `PlantGrowth` (peso di piante in un controllo e due trattamenti) e `sleep` (ore di sonno guadagnate da 10 pazienti con due farmaci).

## Statistica descrittiva

### Misure di posizione e di dispersione
```R
x <- iris$Sepal.Length

mean(x)        # media
median(x)      # mediana: il valore centrale
var(x)         # varianza
sd(x)          # deviazione standard
range(x)       # minimo e massimo
IQR(x)         # scarto interquartile (Q3 - Q1)
quantile(x)    # quartili
quantile(x, probs = c(0.1, 0.9))
summary(x)     # tutto insieme

# errore standard della media
sd(x) / sqrt(length(x))
```
La **media** è sensibile ai valori estremi, la **mediana** no: se le due sono molto diverse, la distribuzione è asimmetrica o ci sono outlier.

### Descrittive per gruppo
```R
tapply(iris$Sepal.Length, iris$Species, mean)
aggregate(len ~ supp + dose, data = ToothGrowth, FUN = median)

# correlazione tra variabili numeriche
cor(iris$Sepal.Length, iris$Petal.Length)
round(cor(iris[, 1:4]), 2)   # matrice di correlazione
```

## Distribuzioni
Ogni distribuzione in R ha quattro funzioni, con un prefisso diverso:

| Prefisso | Cosa fa                             | Esempio con la normale |
| -------- | ----------------------------------- | ---------------------- |
| `r`      | genera numeri casuali               | `rnorm(100)`           |
| `d`      | densità in un punto                 | `dnorm(0)`             |
| `p`      | probabilità cumulata P(X ≤ q)       | `pnorm(1.96)`          |
| `q`      | quantile (l'inverso di `p`)         | `qnorm(0.975)`         |

```R
set.seed(1)   # rende riproducibili i numeri casuali
campione <- rnorm(1000, mean = 10, sd = 2)
hist(campione, breaks = 30, freq = FALSE)
curve(dnorm(x, mean = 10, sd = 2), add = TRUE, lwd = 2)

pnorm(1.96)    # 0.975
qnorm(0.975)   # 1.959964

# altre distribuzioni utili in biologia
rbinom(10, size = 20, prob = 0.5)   # binomiale (successi su prove)
rpois(10, lambda = 5)               # Poisson (conteggi)
```

### I dati sono normali?
Molti test assumono che i dati seguano una distribuzione normale. Si controlla a occhio con il **Q-Q plot** e formalmente con il **test di Shapiro-Wilk**.
```R
qqnorm(campione); qqline(campione)

shapiro.test(campione)
# p > 0.05: nessuna evidenza contro la normalità
# p < 0.05: i dati si discostano dalla normale
```

***
## Test d'ipotesi
Ogni test parte da un'**ipotesi nulla** (H0), di solito "non c'è differenza" o "non c'è associazione". Il **p-value** è la probabilità di osservare dati almeno così estremi **se H0 fosse vera**. Se è sotto una soglia scelta prima (di solito α = 0.05), rifiutiamo H0.

Attenzione: un p-value piccolo dice che un effetto è **probabilmente reale**, non che è **grande** o **importante**. Va sempre guardato insieme alla dimensione dell'effetto (ad esempio la differenza tra le medie).

### Quale test scegliere?

| Domanda                                  | Dati normali (parametrico) | Dati non normali (non parametrico) |
| ---------------------------------------- | -------------------------- | ---------------------------------- |
| 2 gruppi indipendenti                    | t-test                     | Wilcoxon (Mann-Whitney)            |
| 2 misure sugli stessi soggetti           | t-test appaiato            | Wilcoxon appaiato                  |
| più di 2 gruppi                          | ANOVA                      | Kruskal-Wallis                     |
| associazione tra due variabili numeriche | correlazione di Pearson    | correlazione di Spearman           |
| associazione tra due variabili categoriche | chi-quadro               | test esatto di Fisher (pochi dati) |

### Due gruppi: t-test e Wilcoxon
Il succo d'arancia (`OJ`) e la vitamina C pura (`VC`) hanno effetti diversi sulla crescita dei denti?
```R
boxplot(len ~ supp, data = ToothGrowth)

t.test(len ~ supp, data = ToothGrowth)
wilcox.test(len ~ supp, data = ToothGrowth)
```
Di default R usa il **t-test di Welch**, che non assume varianze uguali nei due gruppi. Con `var.equal = TRUE` si ottiene il t-test classico di Student.

### Misure appaiate
Nel dataset `sleep` gli stessi 10 pazienti hanno preso entrambi i farmaci: le misure non sono indipendenti.
```R
farmaco1 <- sleep$extra[sleep$group == 1]
farmaco2 <- sleep$extra[sleep$group == 2]

t.test(farmaco1, farmaco2, paired = TRUE)
wilcox.test(farmaco1, farmaco2, paired = TRUE)
```
Ignorare l'appaiamento fa perdere potenza: prova a rifare il test senza `paired = TRUE` e confronta i p-value.

### Più di due gruppi: ANOVA
Il peso delle piante cambia tra controllo (`ctrl`) e due trattamenti (`trt1`, `trt2`)?
```R
boxplot(weight ~ group, data = PlantGrowth)

modello <- aov(weight ~ group, data = PlantGrowth)
summary(modello)

# l'ANOVA dice SE c'è una differenza, il post-hoc dice TRA CHI
TukeyHSD(modello)

# alternativa non parametrica
kruskal.test(weight ~ group, data = PlantGrowth)
```

### Variabili categoriche: chi-quadro e Fisher
Il tipo di cambio (`am`: 0 automatico, 1 manuale) è associato al numero di cilindri?
```R
tab <- table(mtcars$am, mtcars$cyl)
tab

chisq.test(tab)    # avvisa che alcune frequenze attese sono troppo basse
fisher.test(tab)   # più adatto con pochi dati
```

### Correlazione
```R
plot(mtcars$wt, mtcars$mpg)

cor.test(mtcars$wt, mtcars$mpg)                       # Pearson
cor.test(mtcars$wt, mtcars$mpg, method = "spearman")  # Spearman (sui ranghi)
```
Correlazione non significa causalità: due variabili possono essere correlate perché entrambe dipendono da una terza.

***
## Regressione lineare
La regressione descrive come una variabile (**risposta**) cambia in funzione di una o più altre (**predittori**). Quanto diminuiscono le miglia per gallone (`mpg`) al crescere del peso dell'auto (`wt`, in migliaia di libbre)?
```R
fit <- lm(mpg ~ wt, data = mtcars)
summary(fit)

plot(mpg ~ wt, data = mtcars, pch = 19)
abline(fit, col = "red", lwd = 2)
```
Nell'output di `summary()`:
- **Estimate** di `wt`: di quanto cambia `mpg` per ogni unità di `wt` (la pendenza);
- `Pr(>|t|)`: il p-value di quel coefficiente;
- **R-squared**: la frazione della variabilità di `mpg` spiegata dal modello (da 0 a 1).

```R
# più predittori insieme
fit2 <- lm(mpg ~ wt + hp, data = mtcars)
summary(fit2)

# controllare le assunzioni del modello (residui)
par(mfrow = c(2, 2)); plot(fit2); par(mfrow = c(1, 1))

# predire nuovi valori
predict(fit, newdata = data.frame(wt = c(2.5, 3.5)))
```

## Test multipli
In bioinformatica si fanno spesso migliaia di test insieme (uno per gene). Con α = 0.05, su 20.000 geni ci aspettiamo circa **1.000 falsi positivi** anche se nessun gene cambia davvero. Per questo i p-value vanno **corretti**.
```R
set.seed(42)
p <- c(runif(950), runif(50, 0, 0.001))   # 950 geni "nulli" e 50 "veri"

sum(p < 0.05)                                       # p-value grezzi
sum(p.adjust(p, method = "bonferroni") < 0.05)      # molto conservativo
sum(p.adjust(p, method = "BH") < 0.05)              # False Discovery Rate
```
Il metodo di **Benjamini-Hochberg (BH)** controlla la *False Discovery Rate*, cioè la frazione attesa di falsi positivi tra i risultati significativi. È il `padj` che trovi nei risultati di DESeq2.

***
## Un assaggio di statistica avanzata

### PCA: ridurre le dimensioni
Con tante variabili (ad esempio migliaia di geni) non possiamo guardarle tutte. La **PCA** (*analisi delle componenti principali*) le riassume in poche nuove variabili, le componenti principali, che catturano la maggior parte della variabilità.
```R
pca <- prcomp(iris[, 1:4], scale. = TRUE)
summary(pca)   # quanta varianza spiega ogni componente

plot(pca$x[, 1], pca$x[, 2], col = iris$Species, pch = 19,
     xlab = "PC1", ylab = "PC2")
legend("topright", legend = levels(iris$Species), col = 1:3, pch = 19)
```
È lo stesso grafico che si usa per controllare i campioni di un RNA-seq: campioni simili stanno vicini.

### Clustering: trovare gruppi
```R
dati <- scale(iris[, 1:4])   # stessa scala per tutte le variabili

# gerarchico
hc <- hclust(dist(dati), method = "ward.D2")
plot(hc, labels = FALSE)
gruppi <- cutree(hc, k = 3)

# k-means
set.seed(1)
km <- kmeans(dati, centers = 3, nstart = 25)

# i gruppi trovati corrispondono alle specie?
table(gruppi, iris$Species)
table(km$cluster, iris$Species)
```

### Modelli lineari generalizzati
Quando la risposta non è continua (ad esempio sì/no o un conteggio) si usa un **GLM**. Il peso dell'auto predice se ha il cambio manuale?
```R
logit <- glm(am ~ wt, data = mtcars, family = binomial)
summary(logit)

# probabilità predetta di cambio manuale per un'auto di 3000 libbre
predict(logit, newdata = data.frame(wt = 3), type = "response")
```
Con `family = poisson` (o la binomiale negativa, usata da DESeq2) si modellano i conteggi.

### Per andare oltre
- **modelli a effetti misti** (pacchetto `lme4`): quando ci sono misure ripetute o gruppi annidati, ad esempio più cellule dallo stesso topo;
- **analisi di sopravvivenza** (pacchetto `survival`): curve di Kaplan-Meier e modello di Cox;
- **statistica bayesiana**: stima direttamente la probabilità delle ipotesi alla luce dei dati.

## Esercizi
1. Calcola media, mediana e deviazione standard di `Petal.Width` per ogni specie di `iris`. Quale specie è la più variabile?
2. In `ToothGrowth`, considera solo la dose 0.5: la lunghezza dei denti è diversa tra `OJ` e `VC`? Controlla prima la normalità di ogni gruppo con `shapiro.test()` e scegli il test di conseguenza.
3. In `iris`, la lunghezza del petalo è diversa tra le tre specie? Usa un'ANOVA seguita da `TukeyHSD()` e rappresenta il risultato con un boxplot.
4. In `mtcars`, costruisci un modello lineare di `mpg` in funzione di `hp`. Quanto vale R²? Aggiungere `wt` al modello migliora R²?
5. Fai la PCA di `mtcars` (con `scale. = TRUE`) e colora i punti per numero di cilindri. Le auto con lo stesso numero di cilindri stanno vicine?
