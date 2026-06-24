# Architecture globale — Espace Militant

Ce document décrit **où placer le code** et **comment éviter le mélange avec le legacy**. Il complète le [guide de contribution](../CONTRIBUTING.md) (standards TypeScript, Tamagui, commits, etc.).

Pour la couche **services** (API, hooks React Query, schemas Zod), voir la section [Services](#services) ci-dessous — les règles détaillées sont dans [`src/services/ARCHITECTURE.md`](../src/services/ARCHITECTURE.md).

---

## ⚠️ Avertissement — legacy vs moderne

Le dépôt contient **deux générations de code** qui coexistent. Le legacy n'est **pas** un modèle à suivre pour du nouveau code.

| Zone | Statut | Règle |
|------|--------|-------|
| `src/features_next/` | ✅ Moderne | Nouveau code métier UI |
| `src/services/` | ✅ Moderne | Nouveaux appels API / données |
| `app/(app)/`, `app/(signup)/` | ✅ Moderne | Nouvelles routes |
| `src/components/AppStructure/` | ✅ Moderne | Shell applicatif (layout, nav) |
| `src/components/` (hors legacy) | ✅ Partagé | Composants UI réutilisables cross-feature |
| `app/old/` | ❌ Legacy | Maintenance uniquement — **ne pas étendre** |
| `src/screens/` | ❌ Legacy | Maintenance uniquement — **ne pas ajouter** |
| `src/data/` | ❌ Legacy | Repositories, stores phoning/dtd — **ne pas étendre** |
| `src/navigation/` | ❌ Legacy | Ancienne navigation modale — **ne pas étendre** |
| `src/core/` | ⚠️ Transitoire | Entités / erreurs encore consommées — **ne pas ajouter de nouvelle logique** |
| `src/features/` | ⚠️ Transitoire | Sous-features isolées (scanner, push…) — migrer vers `features_next` si touché |

**Instruction stricte** : ce fichier est la **source de vérité** pour l'organisation du code UI et des features. En cas de conflit entre ce document et du code existant (y compris dans `features_next`), **ce document prime**. Le legacy se corrige au fil des changements, pas l'inverse.

**Ne pas inférer de conventions** en copiant un dossier legacy (`screens/`, `data/`, `app/old/`) ou un service historique non conforme.

---

## Vue d'ensemble

```
espace-militant/
├── app/                    # Routes Expo Router (fichiers minces)
│   ├── (app)/              # Routes authentifiées (moderne)
│   ├── (signup)/           # Tunnel d'inscription (moderne)
│   └── old/                # Routes legacy — ne pas étendre
├── src/
│   ├── features_next/      # Modules métier UI (moderne)
│   ├── services/           # Couche données / API (moderne)
│   ├── components/         # Composants UI partagés
│   │   └── AppStructure/   # Layout, navigation, shell
│   ├── config/             # Routes, navigation, métadonnées
│   ├── ctx/                # Contextes React globaux (session…)
│   ├── hooks/              # Hooks transverses (non liés à un domaine)
│   ├── store/              # Stores Zustand globaux
│   ├── utils/              # Utilitaires purs transverses
│   ├── assets/             # Assets partagés (icônes, illustrations)
│   ├── screens/            # ❌ Legacy
│   ├── data/               # ❌ Legacy
│   └── core/               # ⚠️ Transitoire
└── theme/                  # Design tokens Tamagui
```

### Flux de dépendances (moderne)

```
app/  →  features_next/  →  services/
              ↓                  ↓
         components/        utils/api
              ↓
           theme/
```

- `app/` orchestre (layout, suspense, SEO, tracking) et délègue à `features_next/`.
- `features_next/` contient l'UI métier ; elle consomme `services/` pour les données.
- `components/` fournit des briques UI **sans logique métier**.
- Les dépendances **descendantes** (services → features, features → app) sont interdites.

---

## Routes — `app/`

Les fichiers dans `app/` sont des **wrappers minces**. Ils ne contiennent pas de logique métier complexe.

**Responsabilités autorisées dans `app/` :**

- Résolution des paramètres de route (`useLocalSearchParams`)
- Enrobage layout (`Layout.Container`, `hideTabBar`, etc.)
- Suspense / error boundaries (`BoundarySuspenseWrapper`)
- SEO web (`Head`, meta OG)
- Tracking (hits, UTM)
- Export par défaut vers un screen `features_next/`

**Exemple conforme :**

```tsx
// app/(app)/(tabs)/evenements.tsx
import EventsHubPage from '@/features_next/events/pages/hub'

export default function EvenementsPage() {
  return (
    <Layout.Container safeHorizontalPadding={false}>
      <EventsHubPage />
    </Layout.Container>
  )
}
```

**À ne pas mettre dans `app/` :**

- Composants UI métier
- Formulaires, listes, cartes
- Hooks métier (sauf orchestration route très légère)

Nouvelle route → `app/(app)/` ou `app/(signup)/`, **jamais** `app/old/`.

---

## Features — `src/features_next/`

Chaque domaine métier a son dossier : `events`, `actions`, `profil`, `signup`, etc.

### Structure type d'une feature

```
src/features_next/<feature>/
├── pages/                  # Écrans (un dossier = un écran ou flux)
│   └── <page>/
│       ├── index.tsx       # Point d'entrée du screen (export default)
│       ├── components/     # Composants utilisés UNIQUEMENT par cette page
│       ├── hooks/          # Hooks utilisés UNIQUEMENT par cette page
│       ├── helpers/        # Helpers utilisés UNIQUEMENT par cette page
│       └── utils/          # Utilitaires locaux à la page
├── components/             # Composants partagés au sein de la feature
├── hooks/                  # Hooks partagés au sein de la feature
├── store/                  # Store Zustand local à la feature
├── context/                # Providers React locaux à la feature
├── assets/                 # Images, illustrations propres à la feature
└── utils.ts                # Utilitaires partagés au sein de la feature
```

Tous les sous-dossiers listés sous `pages/<page>/` et à la racine de la feature sont **optionnels** — on les crée seulement quand le besoin apparaît.

### Règle de colocation des composants

| Portée du composant | Emplacement |
|---------------------|-------------|
| Utilisé par **une seule page** | `pages/<page>/components/` |
| Utilisé par **plusieurs pages** de la même feature | `components/` (racine feature) |
| Utilisé par **plusieurs features** | `src/components/` |
| Layout / navigation globale | `src/components/AppStructure/` |

**Principe** : colocaliser au plus près du consommateur. On remonte d'un niveau uniquement quand un second consommateur apparaît.

```
❌ Mauvais : créer tout dans features_next/events/components/
   alors que le composant n'est utilisé que par pages/detail/

✅ Bon : features_next/events/pages/detail/components/EventContent.tsx
```

### Règle de colocation des hooks et utilitaires

Même logique que les composants :

| Portée | Emplacement |
|--------|-------------|
| Hook / helper d'une page | `pages/<page>/hooks/` ou `pages/<page>/helpers/` |
| Hook / helper partagé dans la feature | `hooks/` ou `utils.ts` à la racine feature |
| Hook transverse (partage, clavier, fichier…) | `src/hooks/` |
| Utilitaire pur transverse | `src/utils/` |

La logique métier dérivée de données API (combinaison de hooks, sélecteurs) vit dans `services/<name>/hook.ts` si elle sert à **plusieurs écrans** — pas dans les composants. Voir [`src/services/ARCHITECTURE.md`](../src/services/ARCHITECTURE.md) §6.6.

### Exports d'un screen

Chaque `pages/<page>/index.tsx` exporte typiquement :

- `default` — le screen principal
- `<Page>Skeleton` — état de chargement
- `<Page>Deny` — état 401/403/404 métier

Ces exports sont consommés par `app/` via `BoundarySuspenseWrapper`.

### Nommage

- Dossiers en **kebab-case** : `create-edit`, `list-item`
- Fichiers composants en **PascalCase** : `EventContent.tsx`
- Hooks en **camelCase** avec préfixe `use` : `useOpenOrganiserEvenement.ts`

---

## Composants partagés — `src/components/`

`src/components/` contient des briques UI **réutilisables entre features**, sans logique métier spécifique à un domaine.

| Dossier | Rôle |
|---------|------|
| `AppStructure/` | Layout, sidebar, tab bar, scroll containers |
| `base/` | Primitives stylées (Text, etc.) |
| `Button/`, `VoxCard/`, `Skeleton/`… | Composants UI génériques |
| `404/` | Pages d'erreur génériques |

**Règles :**

- Un composant ici **ne doit pas** importer depuis `features_next/` (dépendance inverse).
- Utiliser les **primitives Tamagui** (`YStack`, `XStack`, `Text`) — voir [CONTRIBUTING.md](../CONTRIBUTING.md).
- Si un composant n'est utilisé que dans une feature → le déplacer vers cette feature.

---

## Services

La couche `src/services/` encapsule **tout ce qui touche à un domaine côté client** : HTTP, validation Zod, hooks React Query, mapping, erreurs métier.

### Règles de base

1. **Un service = un dossier à plat** sous `src/services/<name>/`.
2. **Fichiers obligatoires** : `api.ts`, `schema.ts` ; `hook.ts` si le service expose des données à l'UI.
3. **Validation Zod** via la factory `api()` (`@/utils/api`) — pas d'appels HTTP bruts.
4. **Pas de sous-dossiers** `hook/`, `api/`, `schema/` — tout à la racine du service.
5. **Query params** dans le payload Zod, jamais concaténés dans `path`.
6. **Nommage des hooks** par verbe métier (`useEvent`, `useCreateEvent`) — pas `useGetEvent`.
7. Vérifier `services/common/` avant de dupliquer un helper.

### Documentation détaillée

→ **[`src/services/ARCHITECTURE.md`](../src/services/ARCHITECTURE.md)**

Ce document couvre : nommage des schemas, query keys, optimistic updates, erreurs formulaire, `paramsMapper.ts`, `constants.ts`, checklist de création, anti-patterns.

---

## Autres emplacements

| Dossier | Quand l'utiliser |
|---------|------------------|
| `src/config/` | Constantes de navigation, routes protégées, métadonnées — pas de logique métier |
| `src/ctx/` | Contextes React **globaux** (session, auth) |
| `src/hooks/` | Hooks **transverses** non liés à un domaine (`useShareOrCopy`, `useOpenExternalContent`) |
| `src/store/` | Stores Zustand **globaux** (`user-store`) — préférer `features_next/<feature>/store/` pour l'état local |
| `src/utils/` | Fonctions pures transverses (`api`, formatage, scopes) |
| `src/assets/` | Assets **partagés** entre plusieurs features |
| `theme/` | Tokens et configuration Tamagui |

---

## Imports legacy — règles de migration

Le code moderne **évite** les imports depuis le legacy. Exceptions tolérées **temporairement** le temps de la migration :

| Import legacy | Alternative moderne |
|---------------|---------------------|
| `@/data/*` | `@/services/<name>/` |
| `@/screens/*` | Composant dans `features_next/` ou `components/` |
| `@/core/entities/*` | Type depuis `@/services/<name>/schema` |
| `@/core/errors` | Toujours acceptable (erreurs transverses) — migrer si un équivalent apparaît dans `services/common/errors/` |
| `@/navigation/*` | Expo Router + `app/` |

**Ne pas** ajouter de nouveaux fichiers dans `src/screens/`, `src/data/`, `app/old/`.

---

## Anti-patterns

- ❌ Logique métier dans `app/` au lieu de `features_next/`
- ❌ Composant page-specific dans `features_next/<feature>/components/` alors qu'il n'est utilisé que par une page
- ❌ Composant cross-feature dans `features_next/` au lieu de `src/components/`
- ❌ Nouvel appel API hors de `src/services/`
- ❌ Copier la structure `src/screens/` ou `src/data/` pour une nouvelle feature
- ❌ `features_next/` qui importe depuis `features_next/<autre>/pages/` (importer depuis `components/`, `hooks/` ou `utils/` de l'autre feature)
- ❌ Dépendance `components/` → `features_next/`
- ❌ Route nouvelle dans `app/old/`
- ❌ Inférer des conventions depuis le legacy ou un service non conforme

---

## Checklist — nouvelle feature

1. Créer `src/features_next/<feature>/` avec la structure type (§ Features).
2. Créer le service associé dans `src/services/<feature>/` — suivre [`src/services/ARCHITECTURE.md`](../src/services/ARCHITECTURE.md).
3. Ajouter la route mince dans `app/(app)/` (ou `(signup)/`).
4. Colocaliser composants et hooks au niveau page, remonter seulement si réutilisés.
5. Utiliser `Layout` / `LayoutScrollView` / `LayoutFlatList` depuis `AppStructure`.
6. Exporter `Skeleton` et `Deny` depuis le screen pour l'orchestration dans `app/`.
7. Ne pas importer depuis `screens/`, `data/`, `navigation/`.

---

## Documents connexes

| Document | Contenu |
|----------|---------|
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Tamagui, TypeScript, commits, PR |
| [src/services/ARCHITECTURE.md](../src/services/ARCHITECTURE.md) | Architecture détaillée des services |
| [README.md](../README.md) | Stack, installation, profils EAS |
