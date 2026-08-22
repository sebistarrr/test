# Fiches d'éléments

Ces fiches sont la **transcription lisible** de `src/data/elements.js`. Le code
est la source de vérité : toute valeur ci-dessous existe telle quelle dans la
fiche gelée correspondante.

- `mesuré` = relevé sur la vidéo de référence (720 × 1280, 30 fps, 60,4 s),
  par échantillonnage d'images et analyse des pixels.
- `calé` = ajusté par simulation pour retrouver le rythme observé
  (durée de duel, progression des deux compteurs du HUD).

Les fiches sont **immuables** : `deepFreeze` les gèle au chargement du module et
`assertFrozen()` le revérifie au lancement de chaque duel. Un duel ne peut donc
pas déteindre sur le suivant.

---

## ⬤ OMBRE — `shadow` (affiché « DARK »)

> Assassin — se déplace par pas d'ombre et draine l'essence.

### Apparence

| Propriété          | Valeur                                  | Source  |
| ------------------ | --------------------------------------- | ------- |
| Rayon du corps     | 41 px                                   | mesuré  |
| Couleur du corps   | `#870286`                               | mesuré  |
| Contour            | `#0a0a0a`, 5 px                         | mesuré  |
| PV                 | Archivo Black 34 px, noir, centré       | mesuré  |
| Flash d'encaissement | corps blanc pendant 0,2 s             | mesuré  |
| Halo               | violet `rgba(124,58,237,.42)`, 1,62 × rayon, pulsation 2,4 Hz | mesuré |
| Condition du halo  | Pas d'ombre rechargé                    | déduit  |
| Traînée            | `rgba(88,28,135,.30)`, image toutes les 45 ms | mesuré |
| Icône du titre     | orbe violette 16 × 16 px                | mesuré  |

### Déplacement

| Propriété               | Valeur     | Source |
| ----------------------- | ---------- | ------ |
| Vitesse nominale        | 440 px/s   | mesuré |
| Vitesse de virage       | 1,75 rad/s | mesuré |
| Poids du pilotage (`seek`) | 0,42    | calé   |
| Rebonds                 | élastiques sur les 4 murs, le sens de rotation de l'arme s'inverse | mesuré |

### Arme — Lame du Néant

| Propriété              | Valeur                                | Source |
| ---------------------- | ------------------------------------- | ------ |
| Portée (centre → pointe) | 77 px                              | mesuré |
| Manche                 | 17 px, largement masqué par le corps  | mesuré |
| Tête                   | sprite `darkBlade`, ×3 (60 × 27 px)   | mesuré |
| Rotation               | 5,76 rad/s (330 °/s), sens initial anti-horaire | mesuré |
| Zone tranchante        | 42 % → 100 % de la portée, épaisseur 13 px | déduit |
| Dégâts                 | 4 PV                                  | calé   |
| Cadence                | 1 touche / 1,3 s maximum              | calé   |
| Recul infligé / subi   | 300 / 90                              | calé   |

### Pouvoir — Pas d'ombre (`Shadow Step`)

| Propriété              | Valeur                                            | Source |
| ---------------------- | ------------------------------------------------- | ------ |
| Recharge initiale      | 3 s                                               | mesuré |
| Réduction par usage    | −0,2 s, plancher 0,7 s                            | mesuré |
| Téléportation          | 190 px dans l'axe de course, 7 images fantômes    | mesuré |
| Invulnérabilité        | 0,12 s                                            | déduit |
| Accélération           | ×1,35 pendant 0,45 s                              | déduit |
| Volée                  | 3 traits d'ombre, dispersion ±0,38 rad, dans l'axe du saut | mesuré |
| Affichage HUD          | `Shadow Step Cooldown: X.Xs`                      | mesuré |

### Ultime — Lien d'essence (`ESSENCE TETHER`)

| Propriété          | Valeur                                             | Source |
| ------------------ | -------------------------------------------------- | ------ |
| Jauge              | +3,4 %/s, +2 % par touche portée                   | calé   |
| Durée              | 6,5 s (la jauge se vide pendant l'incantation)     | mesuré |
| Dôme               | rayon 270 px, **figé** au point d'incantation, `rgba(30,24,45,.88)` | mesuré |
| Poussière          | 120 particules violettes en dérive dans le dôme    | mesuré |
| Rayon de drain     | trait violet + cœur blanc, relié en permanence     | mesuré |
| Drain              | 1 PV toutes les 0,28 s                             | mesuré |
| Ralentissement     | −15 % sur la cible tant que le lien tient          | déduit |

### Projectile — Trait d'ombre

| Propriété | Valeur                       | Source |
| --------- | ---------------------------- | ------ |
| Sprite    | `darkBlade` ×2,2 (≈ 44 px)   | mesuré |
| Vitesse   | 600 px/s                     | calé   |
| Dégâts    | 2 PV                         | calé   |
| Rayon     | 11 px                        | déduit |
| Durée     | 1,5 s, **aucun rebond**      | mesuré |
| Traînée   | violette, tous les 50 ms     | mesuré |

---

## ❄ GLACE — `ice` (affiché « ICE »)

> Contrôle — empile les dégâts et le ralentissement.

### Apparence

| Propriété          | Valeur                                   | Source |
| ------------------ | ---------------------------------------- | ------ |
| Rayon du corps     | 41 px                                    | mesuré |
| Couleur du corps   | `#00eff0`                                | mesuré |
| Contour            | `#0a0a0a`, 5 px                          | mesuré |
| Halo               | cyan `rgba(34,211,238,.42)`, pulsation 2 Hz | mesuré |
| Condition du halo  | Blizzard chargé ou actif                 | déduit |
| Traînée            | `rgba(125,211,252,.28)`                  | mesuré |
| Icône du titre     | flocon 16 × 16 px                        | mesuré |

### Déplacement

| Propriété               | Valeur    | Source |
| ----------------------- | --------- | ------ |
| Vitesse nominale        | 470 px/s  | mesuré |
| Vitesse de virage       | 1,9 rad/s | mesuré |
| Poids du pilotage       | 0,42      | calé   |

### Arme — Hache de givre

| Propriété               | Valeur                                    | Source |
| ----------------------- | ----------------------------------------- | ------ |
| Portée                  | 132 px                                    | mesuré |
| Manche                  | 90 px, gris, gemme cyan à 52 %            | mesuré |
| Tête                    | sprite `iceAxeHead`, ×3,5 (42 × 60 px)    | mesuré |
| Rotation                | 5,76 rad/s, sens initial horaire          | mesuré |
| Zone tranchante         | 62 % → 100 % (seule la tête coupe), épaisseur 20 px | déduit |
| **Dégâts**              | **= pile courante** (`Damage/Slow`)       | mesuré |
| Cadence                 | 1 touche / 1 s maximum                    | calé   |
| Effet à la touche       | +1 pile ; ralentit de 3 %/pile (max 45 %) pendant 2,6 s | mesuré |
| Recul infligé / subi    | 260 / 80                                  | calé   |

La pile démarre à **1** et monte de **1 à chaque coup d'arme porté** : c'est le
compteur `Damage/Slow: N` du HUD, qui atteint 13 en fin de duel sur la vidéo.
C'est la mécanique de montée en puissance de la Glace — elle est faible au
début et létale à la fin.

### Pouvoir — Éclats de givre (`Frost Shards`)

| Propriété             | Valeur                                | Source |
| --------------------- | ------------------------------------- | ------ |
| Cadence               | 1 salve / 5 s                         | calé   |
| Salve                 | 6 éclats en étoile (360°)             | mesuré |
| Pendant le Blizzard   | 1 salve / 1,2 s, 10 éclats            | mesuré |

### Ultime — Blizzard (`BLIZZARD`)

| Propriété          | Valeur                                                 | Source |
| ------------------ | ------------------------------------------------------ | ------ |
| Jauge              | +5,4 %/s, +2 % par touche portée, remplissage **par la droite** | mesuré |
| Durée              | 5,2 s                                                  | mesuré |
| Onde de choc       | anneau cyan 40 → 900 px en 0,95 s, déborde de l'arène   | mesuré |
| Champ              | rayon 130 px, **suit la Glace**                        | mesuré |
| Effet du champ     | −35 % de vitesse, 1 PV toutes les 0,7 s                | calé   |
| Neige              | 90 flocons/s sur toute l'arène                         | mesuré |

### Projectile — Éclat de givre

| Propriété | Valeur                                  | Source |
| --------- | --------------------------------------- | ------ |
| Sprite    | `iceShard` ×2,4                         | mesuré |
| Vitesse   | 380 px/s                                | mesuré |
| Dégâts    | 1 PV                                    | calé   |
| Rayon     | 10 px                                   | déduit |
| Durée     | 3,4 s, **2 rebonds** sur les murs       | mesuré |
| Effet     | −12 % de vitesse pendant 1,6 s          | déduit |
| Traînée   | pointillé bleu pâle, tous les 35 ms     | mesuré |

---

## Règles communes (moteur)

| Règle                     | Valeur                                                    |
| ------------------------- | --------------------------------------------------------- |
| Points de vie             | 100, le premier à 0 perd                                   |
| Pas de simulation         | 1/120 s, boucle à accumulateur                             |
| Collision corps/corps     | élastique, séparation 50/50, impulsion 130                 |
| Collision arme/corps      | segment tranchant contre cercle + recharge d'arme          |
| Murs                      | rebond parfait, l'arme change de sens de rotation          |
| Flash d'encaissement      | 0,2 s en blanc                                             |
| Intro / K.O.              | 0,9 s d'ouverture ; K.O. au ralenti (×0,25) pendant 1,8 s  |

## Comment les mesures ont été prises

1. Décodage de la vidéo image par image (PyAV) ;
2. relevé des couleurs à la pipette sur les images fixes (fond, corps, dôme) ;
3. détection des bords noirs pour la géométrie exacte de l'arène et du HUD ;
4. suivi des corps par fenêtre glissante sur masque colorimétrique → vitesses ;
5. suivi du centroïde de la tête de hache → vitesse de rotation
   (≈ 11,5 °/image à 30 fps, soit 330 °/s, avec inversions de sens) ;
6. lecture des deux compteurs du HUD au fil du duel pour caler la
   progression (`3 s → 0,7 s` et `1 → 13`).

Pour rejouer une mesure : `index.html?seed=6&debug=1` affiche vitesses, charges
et hitboxes en direct.
