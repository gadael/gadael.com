---
title: Décompte du solde des utilisateurs en temps partiel
date: 2017-05-12 14:00:00
category: Blog
---

## Paramétrage d'un régime temps partiel dans Gadael

Nous allons paramétrer Gadael de façon à ce que la consommation du solde de congés d'un utilisateur à temps partiel soit fait de la façon qui est prévue par la loi française. C'est à dire qu'il faut que les jours soient décomptés en fonction des jours ouvrés en vigueur dans l'enreprise.

{% youtube is4nAUM64w4 %}

La vidéo montre une configuration du temps partiel avec consommation des jours ouvrés comme prévu par la loi française. Sur le régime, on paramètre les jours ouvrés, ici du lundi au samedi. Sur le droit on choisit le type de consommation "consommer le jour suivant".

Si une personne ne travaille pas le samedi et pose un jour de congé le vendredi, 2 jours serons consommés.

Les autres types de consommation possibles sont expliqués dans la [documentation](https://www.gadael.com/fr/docs/version-master/006-temps-partiels.html).

## Paramétrage d'un utilisateur en temps partiel

{% youtube NBl77byL1KM %}

Pour définir un utilisateur à temps partiel, le gestionnaire sélectionne la période d'ouverture du régime et la période d'ouverture d'un rythme de travail.

## Demande de congés par l'utilisateur

{% youtube tF4gIuYeckE %}

Si l'utilisateur choisi de poser le jeudi, le vendredi et le samedi sont consommés aussi, car le samedi à été paramétré comme jour ouvré au niveau du régime.
La quantité qui sera consommée est affichée sur la deuxième étape de la demande de congés, c'est une prévisualisation en fonction de la période choisie sur la première étape.
