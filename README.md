# Renaissance App

**Application universelle d'engagement civique et militant — iOS · Android · Web**

[![CI/CD](https://github.com/parti-renaissance/espace-militant/actions/workflows/deploy.yml/badge.svg?branch=develop)](https://github.com/parti-renaissance/espace-militant/actions/workflows/deploy.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/parti-renaissance/espace-militant/badge)](https://www.codefactor.io/repository/github/parti-renaissance/espace-militant)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE)

---

Renaissance App est l'application mobile et web officielle de Renaissance. Elle permet aux militants et sympathisants d'accéder à leurs actions locales, événements, actualités et outils d'engagement — sur iOS, Android et le web depuis une base de code unique.

> **⚠️ Contributeurs : lisez ceci avant d'écrire du code UI.**
>
> Ce projet utilise [Tamagui](https://tamagui.dev/) comme système UI universel. Les composants sont compilés différemment selon la cible (Native vs Web). Vous devez utiliser les **primitives Tamagui** (`YStack`, `XStack`, `Text`, `Button`, etc.) et **non** les composants React Native bruts (`View`, `Text`) ni les éléments HTML. Consultez le [guide de contribution](CONTRIBUTING.md) pour les détails.

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| [Expo](https://docs.expo.dev/) | ~53 | Framework universel |
| React Native | 0.79.5 | Runtime iOS / Android |
| React | 19 | Runtime Web |
| [Tamagui](https://tamagui.dev/) | ^1.132 | UI cross-platform |
| TypeScript | ~5.8 | Typage strict |
| [Expo Router](https://docs.expo.dev/router/introduction/) | ~5.1.5 | Navigation file-system |
| [EAS Build / Update](https://docs.expo.dev/eas/) | — | CI/CD mobile |
| Firebase (FCM / APNs) | ^12 | Notifications push |
| Mapbox | 10.x | Cartographie |
| Sentry | ~6.14 | Monitoring et crash reporting |
| Storybook | 7.x | Développement de composants UI |

## Architecture

```
espace-militant/
├── app/              # Écrans et routes (Expo Router, file-system based)
├── src/              # Logique métier, hooks, services, composants partagés
├── theme/            # Design tokens et thème Tamagui
├── assets/           # Images, fonts, icônes (par profil : dev / staging / prod)
├── scripts/          # Scripts de build et de préparation
├── .env.exemple      # Variables d'environnement (template, sans secrets)
└── app.config.ts     # Configuration Expo dynamique (profils EAS)
```

L'application utilise trois profils EAS :

| Profil | Nom affiché | Scheme |
|---|---|---|
| Development | Vox Dev | `vox-dev://` |
| Staging | _(variable)_ | `vox-staging://` |
| Production | Renaissance | `vox://` |

## Prérequis

- **Node.js** 20+
- **Yarn** 4 — activé via [Corepack](https://nodejs.org/api/corepack.html) :
  ```bash
  corepack enable
  ```
  ⚠️ `npm install` ne fonctionnera **pas** — utilisez toujours `yarn`.
- Accès Firebase : les fichiers `GoogleService-Info.plist` (iOS) et `google-services.json` (Android) sont nécessaires. Ils ne sont pas versionnés — demandez-les à l'équipe technique.

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/parti-renaissance/espace-militant.git
cd espace-militant

# 2. Installer les dépendances
yarn install

# 3. Configurer l'environnement
cp .env.exemple .env.local
# Renseigner les variables dans .env.local

# 4. Générer le fichier de configuration client (obligatoire)
yarn prepare:env

# 5. Placer les fichiers Firebase dans config/
#    - config/GoogleService-Info.plist   (iOS)
#    - config/google-services.json       (Android)

# 6. Lancer l'application
yarn start          # Metro bundler (Expo Go ou Dev Client)
yarn ios            # Simulateur iOS
yarn android        # Émulateur Android
yarn web            # Navigateur
```

> **Note :** `yarn prepare:env` doit être relancé à chaque modification de `.env.local`.

## Variables d'environnement

Les variables préfixées `EXPO_PUBLIC_` sont **intégrées dans le binaire** au moment du build. Elles ne sont pas secrètes — ne jamais y placer de clés privées ou de tokens serveur.

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL de base de l'API Renaissance Plateforme |
| `EXPO_PUBLIC_OAUTH_BASE_URL` | URL du serveur d'authentification OAuth |
| `EXPO_PUBLIC_OAUTH_CLIENT_ID` | Client ID OAuth 2.0 (public) |
| `EXPO_PUBLIC_ASSOCIATED_DOMAIN` | Domaine pour les universal links |
| `EXPO_PUBLIC_SENTRY_DSN` | DSN Sentry (public, conçu pour être exposé) |
| `EXPO_PUBLIC_MAP_BOX_ACCESS_TOKEN` | Token Mapbox (public) |

Consultez `.env.exemple` pour la liste complète.

## Développement de composants UI

Ce projet intègre [Storybook](https://storybook.js.org/) pour le développement isolé de composants :

```bash
yarn storybook          # Sur simulateur/émulateur
yarn storybook:web      # Dans le navigateur
```

## Test des deep links

Les deep links varient selon le profil actif :

```bash
# Développement (scheme : vox-dev)
npx uri-scheme open vox-dev:///evenements/mon-evenement --android
npx uri-scheme open vox-dev:///evenements/mon-evenement --ios

# Via adb (Android)
adb shell am start -W -a android.intent.action.VIEW \
  -d "vox-dev:///evenements/mon-evenement" \
  fr.en_marche.jecoute.development
```

> **Note :** Le bundle ID iOS (`fr.en-marche.jecoute`) et le package Android (`fr.en_marche.jecoute`) sont des identifiants techniques non encore rebrandés — ils ne peuvent pas être modifiés sans republier l'application sur les stores.

## Contribuer

Les contributions sont les bienvenues ! Lire [CONTRIBUTING.md](CONTRIBUTING.md) avant d'ouvrir une pull request.

## Déploiement

Le processus de déploiement est documenté dans [DEPLOY.md](DEPLOY.md).

## Sécurité

Pour signaler une vulnérabilité, consulter [SECURITY.md](SECURITY.md). **Ne pas ouvrir d'issue publique.**

## Licence

Ce projet est distribué sous licence [MIT](LICENSE).
