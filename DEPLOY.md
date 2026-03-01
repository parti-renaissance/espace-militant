# Déploiement de l'application

## Règles de déclenchement automatique

| Branche / État | Cible |
|---|---|
| `develop` | Version **live** du projet **staging** |
| `rc/**` | Version **éphémère** du projet **production** |
| Release en état `published` | Version **live** du projet **production** |
| PR avec revue demandée | Version **éphémère** du projet **staging** |

---

## Partie Web

Le build web utilise une compilation locale avec Metro et le compilateur Tamagui pour la génération des assets.

> **Note :** Un bug de compatibilité entre Tamagui et le CSS flattening peut nécessiter de relancer le process de build plusieurs fois. Si le build web échoue, tenter une seconde ou troisième exécution avant d'investiguer.

---

## Partie Mobile

La stratégie de déploiement dépend du numéro de version dans `app.json` :

| Changement de version | Type de déploiement |
|---|---|
| `1.0.0` → `1.0.0` | Archive → nouveau build |
| `1.0.0` → `1.0.1` | Patch → **EAS Update** (OTA, sans passage en store) |
| `1.0.0` → `1.1.0` | Mineure → nouveau build |
| `1.0.0` → `2.0.0` | Majeure → nouveau build |

### EAS Update (mise à jour OTA)

Permet de pousser des correctifs JavaScript sans passer par les stores.

1. Incrémenter `eas_update_version` dans `app.json` (champ `extra`)
2. Utiliser le workflow `deploy`, sélectionner la branche, l'environnement, et choisir `update` comme type EAS

### Build interne (staging)

1. Utiliser le workflow `deploy`
2. Sélectionner la branche, l'environnement `staging`, et le type `build`

### Build production

1. Incrémenter `version` dans `app.json`
2. Utiliser le workflow `deploy`, sélectionner l'environnement `production` et le type `build`

---

## Profils et identifiants

| Profil EAS | Nom affiché | Bundle ID (iOS) | Package (Android) | Scheme |
|---|---|---|---|---|
| `development` | Vox Dev | `fr.en-marche.jecoute.development` | `fr.en_marche.jecoute.development` | `vox-dev://` |
| `staging` | _(variable)_ | `fr.en-marche.jecoute.staging` | `fr.en_marche.jecoute.staging` | `vox-staging://` |
| `production` | Renaissance | `fr.en-marche.jecoute` | `fr.en_marche.jecoute` | `vox://` |

---

## Secrets GitHub Actions

| Secret | Usage |
|---|---|
| `GCP_SA_KEY_FIREBASE_DEPLOYER` | Compte de service Firebase. Voir la [documentation officielle](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md) pour la création et la rotation. |

---

## Déploiement Firebase

Le déploiement Firebase cible une version live ou éphémère selon le cas.

- **TTL par défaut** : 7 jours
- Chaque nouveau commit sur une PR réinitialise le TTL à 7 jours
- Le TTL peut être augmenté sur demande si nécessaire
