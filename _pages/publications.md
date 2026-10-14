---
layout: page
permalink: /publications/
title: publications
description:
nav: true
nav_order: 1
---
<!-- _pages/publications.md -->
<div class="profile-row">
{% include profile_card.html profile=site.data.profiles.researchgate brand="rg" %}
{% include profile_card.html profile=site.data.profiles.scholar brand="gs" %}
</div>

<div class="publications">

{% bibliography -f {{ site.scholar.bibliography }} %}

</div>
