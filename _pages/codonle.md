---
layout: page
title: codonle
permalink: /codonle/
description: A daily puzzle on the genetic code
nav: true
nav_order: 3
---

<link rel="stylesheet" href="{{ '/assets/codonle/codonle.css' | relative_url }}">

<!--
<p class="cdl-intro">One mRNA codon a day. Find it with Wordle-style hints, pair it with its tRNA anticodon, then name the amino acid. Stop codons are in the pool.</p>
-->

<div id="codonle" class="cdl" aria-live="polite"></div>

<p class="cdl-legend">
<span><i style="background:var(--c-ok)"></i>right letter, right place</span>
<span><i style="background:#d99a1c"></i>right letter, wrong place</span>
<span><i style="background:#7b8497"></i>not in the codon</span>
</p>

<script src="{{ '/assets/codonle/aminoacids.js' | relative_url }}"></script>
<script src="{{ '/assets/codonle/codonle.js' | relative_url }}"></script>
