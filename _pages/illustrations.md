---
layout: page
title: illustrations
permalink: /illustrations/
description: Scientific illustrations
nav: true
nav_order: 4
---

{%- assign ig = site.data.profiles.instagram -%}
<div class="ig-card">
<div class="ig-text">
<span class="ig-handle"><i class="fab fa-instagram"></i> @{{ ig.handle }}</span>
<h3>{{ ig.title }}</h3>
<p>{{ ig.text }}</p>
<a class="ig-btn" href="{{ ig.url }}" target="_blank" rel="noopener noreferrer">Follow on Instagram</a>
</div>
{%- if site.data.illustrations and site.data.illustrations.size > 0 %}
<div class="ig-strip">
{%- for item in site.data.illustrations limit: 3 %}
<img src="{{ item.image | prepend: '/assets/img/illustrations/' | relative_url }}" alt="" loading="lazy">
{%- endfor %}
</div>
{%- endif %}
</div>

<!--
<p class="page-intro">Drawings and figures that explain biology: cells, tissues, pathways and methods.</p>
-->

{% if site.data.illustrations and site.data.illustrations.size > 0 %}
<div class="gallery">
{% for item in site.data.illustrations %}
<figure>
<img src="{{ item.image | prepend: '/assets/img/illustrations/' | relative_url }}" alt="{{ item.title }}" loading="lazy" data-zoomable>
<figcaption><strong>{{ item.title }}</strong>{{ item.caption }}{% if item.year %} <span class="mono">{{ item.year }}</span>{% endif %}</figcaption>
</figure>
{% endfor %}
</div>
{% else %}
<div class="gallery-empty">
<svg viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="36" cy="36" r="24"/><circle cx="29" cy="31" r="5"/><circle cx="43" cy="28" r="3"/><circle cx="41" cy="43" r="6"/><path d="M12 60l10-10M60 12L50 22" opacity=".5"/></svg>
<strong>The first illustrations are coming</strong>
New scientific drawings will appear here as soon as they are ready.
</div>
{% endif %}
