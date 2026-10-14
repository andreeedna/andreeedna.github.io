---
layout: page
title: Lezione 2
description: grafici in R, con le funzioni di base e con ggplot2
img: assets/img/course/lezione2.png
importance: 2
category: Bioinformatics Course
---

Un buon grafico è spesso il modo più rapido per capire i dati e per raccontarli. In R ci sono due approcci principali:

- la **grafica di base** (pacchetto *graphics*, già incluso in R): veloce, ottima per esplorare;
- **ggplot2**: un sistema basato su una "grammatica" dei grafici, più flessibile e più curato, ideale per le figure da pubblicare.

In questa lezione usiamo dataset già presenti in R, così il codice funziona subito:

| Dataset       | Contenuto                                                     |
| ------------- | ------------------------------------------------------------- |
| `iris`        | misure di sepali e petali di 150 fiori di 3 specie            |
| `ToothGrowth` | crescita dei denti in cavie con 2 integratori a 3 dosi di vitamina C |
| `mtcars`      | caratteristiche di 32 automobili                              |

```R
head(iris)
str(ToothGrowth)
```

## Grafici con R base

### Scatter plot
`plot()` disegna due variabili numeriche una contro l'altra.
```R
plot(iris$Sepal.Length, iris$Petal.Length)

# con titolo, etichette, colori e simbolo pieno
plot(iris$Sepal.Length, iris$Petal.Length,
     col = iris$Species,   # un colore per specie
     pch = 19,             # tipo di punto
     cex = 0.8,            # dimensione dei punti
     main = "Iris",
     xlab = "Lunghezza sepalo (cm)",
     ylab = "Lunghezza petalo (cm)")
legend("topleft", legend = levels(iris$Species), col = 1:3, pch = 19)
```

Ai grafici si possono **aggiungere elementi** dopo averli creati:
```R
modello <- lm(Petal.Length ~ Sepal.Length, data = iris)
abline(modello, lty = 2, lwd = 2)          # retta di regressione
abline(h = mean(iris$Petal.Length), col = "grey")  # linea orizzontale
text(7.5, 2, "R base")                       # testo in una posizione
```

### Istogramma
Mostra la **distribuzione** di una variabile numerica.
```R
hist(iris$Sepal.Length,
     breaks = 20,
     col = "steelblue", border = "white",
     main = "Distribuzione della lunghezza del sepalo",
     xlab = "cm")
```

### Boxplot
Confronta la distribuzione di una variabile tra **gruppi**. La formula `y ~ gruppo` si legge "y in funzione di gruppo".
```R
boxplot(len ~ dose, data = ToothGrowth,
        col = c("#a8cbc2", "#6a9f98", "#3e7c78"),
        xlab = "Dose (mg/giorno)", ylab = "Lunghezza dei denti")

# aggiungere i singoli punti sopra il boxplot
stripchart(len ~ dose, data = ToothGrowth,
           vertical = TRUE, method = "jitter", pch = 19, add = TRUE)
```

### Barplot
Rappresenta conteggi o valori riassuntivi per categoria.
```R
cilindri <- table(mtcars$cyl)
barplot(cilindri, col = "grey40",
        xlab = "Numero di cilindri", ylab = "Numero di auto")

# barre affiancate per due variabili
barplot(table(mtcars$am, mtcars$cyl), beside = TRUE,
        legend.text = c("automatico", "manuale"))
```

### Più grafici in una figura e salvataggio
```R
par(mfrow = c(1, 2))     # 1 riga, 2 colonne
hist(iris$Petal.Length)
boxplot(Petal.Length ~ Species, data = iris)
par(mfrow = c(1, 1))     # torna a un grafico per volta

# salvare su file: apri il file, disegna, chiudi
png("boxplot_iris.png", width = 1600, height = 1200, res = 300)
boxplot(Petal.Length ~ Species, data = iris)
dev.off()
# per un pdf vettoriale: pdf("figura.pdf", width = 6, height = 4)
```

I parametri grafici più usati:

| Parametro | Cosa controlla                      |
| --------- | ----------------------------------- |
| `main`, `xlab`, `ylab` | titolo ed etichette degli assi |
| `col`     | colore                              |
| `pch`     | forma dei punti (19 = cerchio pieno) |
| `cex`     | dimensione                          |
| `lty`, `lwd` | tipo e spessore delle linee      |
| `xlim`, `ylim` | limiti degli assi              |

***
## Grafici con ggplot2
ggplot2 costruisce i grafici **a strati**, sommati con `+`. Ogni grafico ha tre ingredienti:

1. i **dati** (un data frame);
2. l'**estetica** `aes()`: quale colonna va sull'asse x, quale sull'asse y, quale decide il colore...;
3. una o più **geometrie** `geom_*()`: punti, linee, barre, box...

```R
install.packages("ggplot2")
library(ggplot2)
```

### Scatter plot
```R
ggplot(iris, aes(x = Sepal.Length, y = Petal.Length)) +
  geom_point()

# colore per specie, retta di regressione, etichette e tema
ggplot(iris, aes(Sepal.Length, Petal.Length, colour = Species)) +
  geom_point(size = 2, alpha = 0.7) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(title = "Iris",
       x = "Lunghezza sepalo (cm)",
       y = "Lunghezza petalo (cm)",
       colour = "Specie") +
  theme_classic()
```
Rispetto a R base, la legenda viene creata automaticamente.

### Istogramma e densità
```R
ggplot(iris, aes(Sepal.Length, fill = Species)) +
  geom_histogram(bins = 20, alpha = 0.6, position = "identity")

ggplot(iris, aes(Sepal.Length, fill = Species)) +
  geom_density(alpha = 0.5)
```

### Boxplot e violin plot
In `ToothGrowth` la dose è numerica: la trasformiamo in **fattore** perché vogliamo trattarla come gruppo.
```R
tg <- ToothGrowth
tg$dose <- factor(tg$dose)

ggplot(tg, aes(dose, len, fill = dose)) +
  geom_boxplot(outlier.shape = NA) +
  geom_jitter(width = 0.15, size = 1.5) +
  labs(x = "Dose (mg/giorno)", y = "Lunghezza dei denti") +
  theme_minimal() +
  theme(legend.position = "none")

ggplot(tg, aes(dose, len, fill = dose)) +
  geom_violin() +
  geom_boxplot(width = 0.1, fill = "white")
```

### Barplot
`geom_bar()` conta le righe per categoria; `geom_col()` usa valori già calcolati.
```R
ggplot(mtcars, aes(factor(cyl))) +
  geom_bar(fill = "grey40") +
  labs(x = "Cilindri", y = "Numero di auto")

# media ± deviazione standard per gruppo
medie <- aggregate(len ~ supp + dose, data = tg, FUN = mean)
medie$sd <- aggregate(len ~ supp + dose, data = tg, FUN = sd)$len

ggplot(medie, aes(dose, len, fill = supp)) +
  geom_col(position = position_dodge(0.9)) +
  geom_errorbar(aes(ymin = len - sd, ymax = len + sd),
                position = position_dodge(0.9), width = 0.2)
```

### Pannelli multipli: facet
Un grafico per ogni livello di una variabile, con gli stessi assi.
```R
ggplot(tg, aes(dose, len, fill = supp)) +
  geom_boxplot() +
  facet_wrap(~ supp)
```

### Temi e salvataggio
```R
p <- ggplot(iris, aes(Species, Petal.Width)) + geom_boxplot()

p + theme_bw()
p + theme_classic(base_size = 14)
p + theme(axis.text.x = element_text(angle = 45, hjust = 1))

ggsave("petali.png", p, width = 5, height = 4, dpi = 300)
ggsave("petali.pdf", p, width = 5, height = 4)
```

### R base o ggplot2?

| Voglio...                                     | R base | ggplot2 |
| --------------------------------------------- | :----: | :-----: |
| un'occhiata veloce ai dati                    | ✔      |         |
| colorare o dividere per gruppi senza fatica   |        | ✔       |
| legende automatiche                           |        | ✔       |
| una figura per un articolo                    |        | ✔       |
| zero pacchetti da installare                  | ✔      |         |

***
## Colori
La scelta dei colori è fondamentale per l'efficacia di un grafico: un buon uso del colore guida l'attenzione e chiarisce il messaggio, una scelta poco attenta può confondere o perfino trasmettere informazioni sbagliate.

Circa il **5% della popolazione** ha qualche forma di daltonismo, che rende difficile distinguere soprattutto **rosso e verde**. Evitare questa coppia e usare palette pensate per essere accessibili rende il grafico leggibile per tutti.

### Colori in R base
```R
colors()[1:10]              # i nomi dei colori disponibili
"steelblue"; "#3e7c78"      # per nome o in esadecimale
hcl.colors(5, "viridis")    # palette percettivamente uniformi
palette.colors(8, "Okabe-Ito")  # palette adatta ai daltonici
```

### RColorBrewer
```R
install.packages("RColorBrewer")
library(RColorBrewer)

display.brewer.all(colorblindFriendly = TRUE)
pal <- brewer.pal(3, "Set2")

boxplot(len ~ dose, data = ToothGrowth, col = pal)

# in ggplot2
ggplot(iris, aes(Sepal.Length, Petal.Length, colour = Species)) +
  geom_point() +
  scale_colour_brewer(palette = "Dark2")
```

### colorRampPalette
Crea una sfumatura continua tra due o più colori, utile per le heatmap.
```R
teal_ocra <- colorRampPalette(c("#3e7c78", "white", "#b08a3e"))
teal_ocra(11)

heatmap(as.matrix(mtcars[1:10, 1:6]), scale = "column", col = teal_ocra(50))
```

### Colori manuali in ggplot2
```R
ggplot(tg, aes(dose, len, fill = dose)) +
  geom_boxplot() +
  scale_fill_manual(values = c("0.5" = "#a8cbc2", "1" = "#6a9f98", "2" = "#3e7c78"))

# scale continue
ggplot(iris, aes(Sepal.Length, Petal.Length, colour = Petal.Width)) +
  geom_point() +
  scale_colour_viridis_c()
```

## Esercizi
1. Con R base, disegna un istogramma di `mtcars$mpg` e aggiungi una linea verticale rossa sulla media (`abline(v = ...)`).
2. Con ggplot2, fai uno scatter plot di `mpg` contro `wt` in `mtcars`, colorando i punti per numero di cilindri (ricorda `factor(cyl)`) e aggiungendo una retta di regressione.
3. Rifai il boxplot di `ToothGrowth` (lunghezza per dose) con ggplot2, separando i due integratori con `facet_wrap()` e usando una palette di RColorBrewer adatta ai daltonici.
4. Salva l'ultimo grafico in PNG a 300 dpi e in PDF.
