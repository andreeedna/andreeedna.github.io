---
layout: about
title: about
permalink: /

news: true
social: true
---

<section class="hero">
<div class="hero-text">
<h1>Andrea Ninni</h1>
<p class="role">PostDoc Researcher<span>University of Rome Tor Vergata · Integrative Physiology and Metabolism Laboratory</span></p>
<p class="lead">I study how adipose tissue adapts to its environment and the role of macrophages in this role, using single-cell and bulk transcriptomics. When the analysis I need does not exist, I build it: the latest example is <strong>MACanalyzeR</strong>, an R package for profiling monocytes and macrophages in single-cell RNA-seq data.</p>
<div class="hero-actions">
<a class="btn-site primary" href="https://doi.org/10.1038/s41467-025-60295-2">Read the Nature Communication paper</a>
<a class="btn-site" href="{{ '/projects/MACanalyzeR_Vignette/' | relative_url }}">MACanalyzeR Vignette</a>
<a class="btn-site" href="{{ '/cv/' | relative_url }}">CV</a>
</div>
<p class="affiliation">Department of Biology, University of Rome Tor Vergata, 00133 Rome, Italy<br>Supervisor: Daniele Lettieri Barbato</p>
</div>
<div class="hero-visual">
<div class="portrait">{% include figure.html path="assets/img/prof_pic.jpg" alt="Portrait of Andrea Ninni" %}</div>
</div>
</section>

## What I work on

<ul class="themes">
<li>
<h3>Adipose tissue and its environment</h3>
<p>How brown and white fat remodel under metabolic stress such as obesity, mapped cell by cell with single-cell and bulk RNA-seq.</p>
</li>
<li>
<h3>Macrophages and immunometabolism</h3>
<p>Lipid-associated macrophages in brown fat, what they secrete, and how they change the identity of the cells around them.</p>
</li>
<li>
<h3>Tools for transcriptomics</h3>
<p>R packages and machine-learning models that turn single-cell data into answers, with an eye on deep learning for microscopy images.</p>
</li>
</ul>

## Selected publications

<div class="publications publications-flat">
{% bibliography -f {{ site.scholar.bibliography }} -q @*[selected=true]* --group_by none %}
</div>

<p><a href="{{ '/publications/' | relative_url }}">All publications</a></p>

## Also here

<div class="feature-row">
<a class="feature" href="{{ '/codonle/' | relative_url }}">
<span class="tag">game</span>
<h3>Codonle</h3>
<p>A daily puzzle on the genetic code: find the codon, pair its anticodon, name the amino acid.</p>
</a>
<a class="feature" href="{{ '/illustrations/' | relative_url }}">
<span class="tag">gallery</span>
<h3>Scientific illustrations</h3>
<p>Figures and drawings that explain biology, collected in one place.</p>
</a>
</div>
