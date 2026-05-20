# Architecture des services

Ce document décrit la façon dont sont organisés les services du dossier `src/services/`. Il sert de référence pour créer un nouveau service ou faire évoluer un existant de manière homogène.

Un « service » encapsule **tout ce qui touche à un domaine métier côté client** : appels HTTP, schemas de validation, hooks React Query, mapping de paramètres, erreurs métier et constantes liées.

## ⚠️ AVERTISSEMENT CONCERNANT LE CODE EXISTANT (LEGACY)

Le dépôt contient des services **historiques (legacy)** qui ne respectent pas l’ensemble des règles décrites ici. Exemples fréquents : sous-dossiers `hook/`, `api/`, ou `schema/` ; concaténation de query params dans l’URL `path` ; fichiers listés comme **MAY** fragmentés ou emplacement des helpers incohérent avec ce document.

**Instruction stricte pour les humains et pour les LLM** : ce fichier est la **seule et unique source de vérité** pour la conception et la modification des services. Vous **MUST NOT** inférer de nouvelles conventions par mimétisme à partir d’autres dossiers du projet (`src/services/*`, `features_next`, etc.). Lorsqu’une règle du présent document entre en conflit avec du code existant, **MUST** primer ce document ; le legacy se corrige progressivement au fil des changements, pas l’inverse.

---

## 1. Principes généraux

1. **Validation** des requêtes et des réponses par Zod via la factory `api()` (`@/utils/api`). Les appels HTTP « bruts » (hors `api()`) depuis un service **MUST NOT** être utilisés.
2. **Un seul point d’entrée par couche** : un fichier `api.ts`, un fichier `hook.ts`, un fichier `schema.ts`. Les sous-dossiers par couche (`hook/`, etc.) **MUST NOT** être introduits (cf. §2), sauf décision d’équipe documentée pour un cas exceptionnel.
3. **Frontière nette entre couches** :
   - `schema.ts` ne dépend que de `zod` et de schemas partagés.
   - `api.ts` ne dépend que de `schema.ts`, `paramsMapper.ts` (**MAY**) et `error.ts` (**MAY**).
   - `hook.ts` ne dépend que de `api.ts`, `schema.ts`, des contextes/store React et de React Query.
4. **Tous les query params** passent par le payload validé par Zod. La concaténation `?xxx=...` dans `path` **MUST NOT** être utilisée (cf. §4.3).
5. **Optimistic updates** : toute mutation qui impacte une entité déjà présente dans le cache (liste paginée ou détail) **MUST** privilégier un optimistic update plutôt qu’un simple `invalidateQueries` (cf. §6.4), sauf cas d’exception documentés dans cette section.

---

## 2. Structure d'un service

Par défaut, un service est un dossier **à plat** :

```
src/services/<service-name>/
├── api.ts          # fonctions d'appel HTTP (**MUST**)
├── hook.ts         # hooks React Query (**MUST** si le service expose de l’UI consommant des données)
├── schema.ts       # schemas Zod + types (**MUST**)
├── error.ts        # erreurs custom (**MAY** — cf. §7)
├── paramsMapper.ts # mapping payload <-> query params (**MAY** — cf. §5)
└── constants.ts    # constantes du domaine (**MAY** — cf. §8)
```

> **Règle** : `api.ts`, `hook.ts`, `schema.ts` **MUST** rester à la racine du service.
> Les sous-dossiers `hook/`, `api/`, `schema/` **MUST NOT** être introduits.
> Si un fichier devient « trop gros » (>500 lignes par ex.), on factorise via des helpers privés dans le même fichier ou un `helpers.ts` **à plat** à la racine du service (cf. §6.4), **MUST NOT** via une fragmentation en sous-dossiers par couche.

**Règle des micro-fichiers (< 20 lignes)** : si la logique d’un fichier listé comme **MAY** (`paramsMapper.ts`, `error.ts`, `constants.ts`) fait **moins de 20 lignes**, elle **MUST** être inlinée dans le fichier de son domaine d’action plutôt que de créer un fichier séparé. Le mapping va dans `api.ts`, les petites erreurs custom dans `api.ts` ou `schema.ts`, et les clés de cache simples dans `hook.ts`. Seules les constantes **partagées entre plusieurs couches** méritent un fichier `constants.ts` dédié.

---

## 3. `schema.ts`

### 3.1 Conventions de nommage

Le nom du schema **commence par `Rest`**, puis **le verbe HTTP**, puis **le nom métier**, puis le suffixe `RequestSchema` / `ResponseSchema`.

```ts
export const RestGetAdherentsRequestSchema = z.object({ /* ... */ })
export const RestGetAdherentsResponseSchema = createRestPaginationSchema(RestAdherentListItemSchema)

export const RestPostAdherentRequestSchema = z.object({ /* ... */ })
export const RestPostAdherentResponseSchema = RestAdherentDetailSchema
```

Pour les schemas de domaine réutilisables (entités), on omet le verbe :

```ts
export const RestAdherentListItemSchema = z.object({ /* ... */ })
export const RestAdherentDetailSchema = z.object({ /* ... */ })
```

### 3.2 Pagination

Le helper partagé **MUST** être utilisé :

```ts
import { createRestPaginationSchema } from '@/services/common/schema'

export const RestGetAdherentsResponseSchema = createRestPaginationSchema(RestAdherentListItemSchema)
```

### 3.3 Exports de types

Les `z.infer<typeof ...>` **MUST** être **regroupés en bas du fichier**, dans une section dédiée. Les `export type` **MUST NOT** être disséminés à côté de chaque schema.

```ts
export const RestAdherentListItemSchema = z.object({ /* ... */ })
export const RestAdherentDetailSchema = z.object({ /* ... */ })

export const RestGetAdherentsRequestSchema = z.object({ /* ... */ })
export const RestGetAdherentsResponseSchema = createRestPaginationSchema(RestAdherentListItemSchema)

// ----------------- Types -----------------

export type RestAdherentListItem = z.infer<typeof RestAdherentListItemSchema>
export type RestAdherentDetail = z.infer<typeof RestAdherentDetailSchema>
export type RestGetAdherentsRequest = z.infer<typeof RestGetAdherentsRequestSchema>
export type RestGetAdherentsResponse = z.infer<typeof RestGetAdherentsResponseSchema>
```

### 3.4 Requêtes vides

Quand une route ne prend pas de payload (path params uniquement), `z.void()` **MUST** être utilisé directement dans `api.ts`. Un `RestGetXxxRequestSchema = z.void()` **MUST NOT** être écrit uniquement pour la cosmétique.

```ts
export const deleteEvent = (props: { eventId: string }) =>
  api({
    method: 'delete',
    path: `/api/v3/events/${props.eventId}`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()
```

### 3.5 Erreurs de formulaire (`propertyPath`)

Si l'endpoint peut renvoyer des erreurs Symfony-style avec `violations[].propertyPath`, l'enum strict des chemins **MUST** être déclaré ici :

```ts
export const propertyPathPostEventSchema = z.enum([
  'name',
  'post_address',
  'post_address.address',
  'category',
  // ...
])
```

Ce schema est ensuite consommé par `error.ts` (cf. §7).

---

## 4. `api.ts`

### 4.1 Style d'export

**Une fonction par endpoint**, en export nommé. Un objet `Service` regroupant les fonctions **MUST NOT** être exposé.

Deux variantes selon que l'endpoint a un payload ou non :

```ts
// Endpoint avec payload validé : on appelle directement api({ ... })
export const getEventCategories = api({
  method: 'get',
  path: '/api/event_categories',
  requestSchema: z.void(),
  responseSchema: schemas.RestGetEventCategoriesResponseSchema,
  type: 'private',
})

// Endpoint paramétré (path param, transformation, etc.) : on enrobe dans une fonction
export const getEventDetails = (eventId: string) =>
  api({
    method: 'get',
    path: `/api/v3/events/${eventId}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetEventDetailsResponseSchema,
    type: 'private',
  })()
```

### 4.2 Verbe HTTP

**MUST** être en **minuscules** : `'get'`, `'post'`, `'put'`, `'delete'`, `'patch'`.
`constructApi` se charge de la sémantique : `get` / `delete` → query params, autres → body.

### 4.3 Query params

**MUST NOT** : concaténer des query params dans `path`.

```ts
// ❌ **MUST NOT**
path: `/api/v3/events/${id}?scope=${scope}&status=${status}`

// ✅ conforme
path: `/api/v3/events/${id}`,
requestSchema: schemas.RestGetEventRequestSchema, // { scope: z.string(), status: z.string().optional() }
```

Les query params **MUST** être dans le payload validé par Zod. `constructApi` les enverra automatiquement en `params` axios pour un GET/DELETE, ou `useParams: true` **MUST** être passé pour un POST/PUT qui aurait des query params.

### 4.4 Le paramètre `scope`

`scope` est un query param comme un autre : il **MUST** être typé dans le request schema et **MUST NOT** être concaténé dans `path`.

```ts
// ✅
export const RestGetAdherentDetailRequestSchema = z.object({
  scope: z.string(),
})

export const getAdherentDetail = (uuid: string) =>
  api({
    method: 'get',
    path: `/api/v3/adherents/${uuid}`,
    requestSchema: schemas.RestGetAdherentDetailRequestSchema,
    responseSchema: schemas.RestAdherentDetailSchema,
    type: 'private',
  })
```

Le `scope` effectif est injecté côté hook (depuis `useSession()` ou la prop passée au hook).

### 4.5 `type: 'private' | 'public'`

**MUST** être explicite. `'private'` utilise `authInstance` (avec refresh token), `'public'` utilise `publicInstance`. La valeur par défaut côté `constructApi` est `'private'`, mais on l'écrit malgré tout pour la lisibilité.

### 4.6 `errorThrowers`

Quand l'endpoint peut renvoyer des erreurs métier (FormError typé), les throwers **MUST** être passés ici. Voir §7.

```ts
export const createEvent = (props: { payload: schemas.RestPostEventRequest; scope: string }) =>
  api({
    method: 'post',
    path: '/api/v3/events',
    requestSchema: schemas.RestPostEventRequestSchema,
    responseSchema: schemas.RestPostEventResponseSchema,
    errorThrowers: [eventPostFormErrorThrower],
    type: 'private',
  })(props.payload)
```

---

## 5. `paramsMapper.ts` (**MAY**)

`paramsMapper.ts` **MAY** être créé **uniquement** si la logique de mapping dépasse ~10 lignes **ou** est réutilisée par plusieurs endpoints **ou** implique des transformations non triviales (format de date, renommage `finishAfter` → `finishAt[strictly_after]`, calculs de bornes temporelles, etc.). Sinon, le mapping **MUST** rester inline dans `api.ts`.

**Règle des micro-fichiers** : si l’ensemble du mapping fait **moins de 20 lignes**, il **MUST** être inliné dans `api.ts` ; un fichier `paramsMapper.ts` séparé **MUST NOT** être créé. (Rappel complet : §2.)

Pattern type :

```ts
// services/events/paramsMapper.ts
export type GetEventsSearchParametersMapperProps = { /* shape côté client */ }

export const mapParams = (props: GetEventsSearchParametersMapperProps): RestGetEventsRequest => {
  // transformation explicite → shape attendue par le back
}
```

```ts
// services/events/api.ts
export const getEvents = (params: GetEventsSearchParametersMapperProps) =>
  api({
    method: 'get',
    path: '/api/v3/events',
    requestSchema: schemas.RestGetEventsRequestSchema,
    responseSchema: schemas.RestGetEventsResponseSchema,
    type: 'private',
  })(mapParams(params))
```

---

## 6. `hook.ts`

### 6.1 Nommage des hooks

Le nom du hook suit le **verbe métier**, pas le verbe HTTP :

| Intention            | Nom                           |
| -------------------- | ----------------------------- |
| Récupérer une entité | `useEvent`, `useAdherent`     |
| Liste paginée        | `usePaginatedEvents`          |
| Création / édition   | `useCreateEvent`              |
| Suppression          | `useDeleteEvent`              |
| Action métier        | `useSubscribeEvent`, `useCancelEvent` |

Les préfixes `useGet…` / `useMutation…` **SHOULD NOT** être utilisés. La nature (query vs mutation) doit transparaître via le verbe (`use<Action>`) ou la précision (`usePaginated…`).

Si une variante Suspense est exposée, on suffixe :

```ts
export const useEvent = (id: string) => /* useQuery */
export const useSuspenseEvent = (id: string) => /* useSuspenseQuery */
```

### 6.2 Query keys

On a **deux niveaux** selon la complexité du service :

#### Cas simple : constantes locales

Quand le service a 1 à 2 clés et pas d'invalidations croisées complexes :

```ts
const COMMITTEES_KEY = 'committees'

export const useCommittees = () =>
  useQuery({
    queryKey: [COMMITTEES_KEY],
    queryFn: api.getCommittees,
  })
```

#### Cas complexe : factory hiérarchique

Dès qu'on a plus de 2 clés, des invalidations croisées, ou des clés paramétrées, on regroupe dans un objet factory exporté :

```ts
export const adherentKeys = {
  all: ['adherents'] as const,
  list: (scope: string, page: number, filters: Record<string, unknown>) =>
    [...adherentKeys.all, 'list', scope, page, filters] as const,
  detail: (uuid: string | undefined) => [...adherentKeys.all, 'detail', uuid] as const,
  elect: (uuid: string | undefined, scope: string | undefined) =>
    [...adherentKeys.all, 'elect', uuid, scope] as const,
}
```

Avantages :
- centralise les clés en un seul endroit ;
- permet une invalidation globale (`adherentKeys.all`) ;
- type-safe via `as const`.

Quand on doit invalider des clés **d'un autre service**, on importe sa factory ou sa constante. La clé d'un autre service **MUST NOT** être réécrite à la main.

```ts
import { PAGINATED_QUERY_FEED } from '@/services/timeline-feed/hook'
import { adherentKeys } from '@/services/adherents/hook'

queryClient.invalidateQueries({ queryKey: adherentKeys.list(scope) })
queryClient.invalidateQueries({ queryKey: [PAGINATED_QUERY_FEED] })
```

> ⚠ Une invalidation comme `queryClient.invalidateQueries({ queryKey: ['profil', 'instances', PAGINATED_QUERY_FEED, ...] })` n'invalide **qu'une seule clé composite**, pas plusieurs. Un appel `invalidateQueries` **MUST** être fait par clé à invalider.

### 6.3 Suspense

**MAY** être choisi au cas par cas. `useSuspenseQuery` **MUST** être utilisé seulement quand un `<Suspense>` parent garantit le fallback et que le rendu **MUST** attendre la donnée. Sinon `useQuery` avec `isPending` / `data` manuellement.

Quand un même endpoint est consommé dans les deux modes, les deux hooks (`useX` + `useSuspenseX`) **MUST** partager **la même clé** pour un cache commun.

### 6.4 Mutations : optimistic updates

**MUST** : toute mutation qui impacte une entité **présente dans le cache** (liste paginée ou détail) **MUST** faire un optimistic update plutôt qu'un simple `invalidateQueries`, sauf exceptions listées plus bas.

On utilise les helpers partagés :

```ts
import {
  optimisticSetPaginatedData,
  optimisticSetDataById,
  getCachedPaginatedData,
  getCachedSingleItem,
} from '@/services/common/helpers'
```

Pattern type (cf. `services/events/helpers.ts` à la racine du service pour un exemple complet de logique extraite ; le fichier **MUST** rester **à plat** sous `src/services/events/`, **MUST NOT** sous `hook/`) :

```ts
export const optimisticToggleSubscribe = (
  subscribe: boolean,
  identifier: { eventId: string; slug?: string },
  queryClient: QueryClient,
) => {
  const updater: OptimisticItemUpdater<RestEvent> = (old) => {
    if (!old || isPartialEvent(old)) return old
    return {
      ...old,
      user_registered_at: subscribe ? new Date().toISOString() : null,
      participants_count: subscribe
        ? (old.participants_count ?? 0) + 1
        : (old.participants_count ?? 1) - 1,
    }
  }

  optimisticSetPaginatedData({ id: identifier.eventId, updater, queryClient, queryKey: QUERY_KEY_PAGINATED_SHORT_EVENTS })
  optimisticSetDataById({ id: identifier.slug ?? identifier.eventId, updater, queryClient, queryKey: QUERY_KEY_SINGLE_EVENT })
}
```

Quand l'optimistic est complexe (plusieurs caches à toucher, rollback à gérer), il **MUST** être extrait dans des helpers privés du même `hook.ts`, ou dans un fichier **`helpers.ts` à plat à la racine du service** (ex. `services/events/helpers.ts`). Un sous-dossier `hook/helpers.ts` **MUST NOT** être créé pour cela.

Le fallback `invalidateQueries` **MAY** être utilisé uniquement quand :
- la donnée n'est pas reconstructible côté client (ex. recalculée par le back) ;
- ou la mutation crée une entité dont le shape complet n'est pas connu à l'avance.

### 6.5 Erreurs et toasts

Le pattern **inline** dans chaque mutation **MUST** être conservé pour la lisibilité :

```ts
import { useToastController } from '@tamagui/toast'
import { GenericResponseError } from '@/services/common/errors/generic-errors'

export const useDeleteEvent = () => {
  const toast = useToastController()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: (_, { eventId }) => {
      toast.show('Succès', { message: 'Événement supprimé', type: 'success' })
      queryClient.invalidateQueries({ queryKey: eventKeys.list() })
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
    onError: (error) => {
      if (error instanceof GenericResponseError) {
        toast.show('Erreur', { message: error.message, type: 'error' })
      } else {
        toast.show('Erreur', { message: "Impossible de supprimer l'événement", type: 'error' })
      }
      return error
    },
  })
}
```

Conventions :

- `GenericResponseError` (message back exploitable) et le fallback générique **MUST** être différenciés ;
- pour les mutations formulaire, le `instanceof <Service>FormError` (cf. §7) **MUST** être intercalé avant le fallback ;
- les libellés (`'Succès'`, `'Erreur'`) et les messages **MUST** être en français.

### 6.6 Données dérivées / sélecteurs

Quand on combine plusieurs hooks ou qu'on dérive un état utile à plusieurs écrans, un hook composite **MUST** être exposé dans `hook.ts` (ex. `useHasRecentMembership`, `useIsAdherentDues`). Cette logique **MUST NOT** être placée dans les composants.

---

## 7. `error.ts` (**MAY**)

`error.ts` **MAY** être créé **uniquement** quand l'endpoint peut renvoyer des erreurs de formulaire typées (réponse Symfony avec `violations[].propertyPath`).

**Règle des micro-fichiers** : si la classe d’erreur + le thrower font **moins de 20 lignes au total**, cette logique **MUST** être inlinée dans `api.ts` ou dans `schema.ts` (sans fichier `error.ts` dédié). (Rappel complet : §2.)

### 7.1 Structure standard

```ts
// services/events/error.ts
import { z } from 'zod'

import { createFormErrorResponseSchema, createFormErrorThrower } from '../common/errors/form-errors'
import { propertyPathPostEventSchema } from './schema'

const eventPostFormErrorSchema = createFormErrorResponseSchema(propertyPathPostEventSchema)

export class EventPostFormError extends Error {
  violations: z.infer<typeof eventPostFormErrorSchema>['violations']
  constructor(public errors: z.infer<typeof eventPostFormErrorSchema>) {
    super('FormError')
    this.violations = errors.violations
  }
}

export const eventPostFormErrorThrower = createFormErrorThrower(EventPostFormError, eventPostFormErrorSchema)
```

### 7.2 Branchement

Côté `api.ts` :

```ts
errorThrowers: [eventPostFormErrorThrower],
```

Côté `hook.ts` :

```ts
onError: (error) => {
  if (error instanceof GenericResponseError) {
    toast.show('Erreur', { message: error.message, type: 'error' })
  } else if (error instanceof EventPostFormError) {
    toast.show('Validation', { message: 'Un ou plusieurs champs sont invalides.', type: 'warning' })
  } else {
    toast.show('Erreur', { message: 'Impossible de créer cet événement', type: 'error' })
  }
  return error
}
```

### 7.3 Quand ne pas créer `error.ts`

- Si l'endpoint ne renvoie que `GenericResponseError` (message libre), `error.ts` **MUST NOT** être créé : le pattern inline du hook suffit.
- Pour une 404/403/etc. transversale : déjà géré dans `services/common/errors/generic-errors.ts`.

---

## 8. `constants.ts` (**MAY**)

Un **unique** fichier `constants.ts` par service **MAY** être utilisé pour stocker :

- des listes de référence (libellés, mappings code → label) ;
- des bornes, seuils, valeurs par défaut ;
- des constantes de query keys partagées entre plusieurs hooks du même service.

**Règle des micro-fichiers** : si l’ensemble des constantes du service fait **moins de 20 lignes**, elles **MUST** être inlinées dans `hook.ts` et/ou `api.ts` selon le besoin ; un `constants.ts` séparé **MUST NOT** être créé, **sauf** si ces constantes sont **partagées entre plusieurs couches** (ex. query keys utilisées à la fois par `hook.ts` et par un `helpers.ts` à la racine). (Rappel complet : §2.)

La fragmentation en plusieurs fichiers thématiques (`bounds.ts`, `labels.ts`, `queryKeys.ts`, …) **MUST NOT** être faite : tout va dans `constants.ts`, organisé en sections séparées par des commentaires.

```ts
// services/events/constants.ts

// ---------- Query keys ----------

export const QUERY_KEY_PAGINATED_SHORT_EVENTS = 'shortEvents'
export const QUERY_KEY_SINGLE_EVENT = 'event'
export const QUERY_KEY_MAP_EVENTS = 'mapEvents'

// ---------- Bbox géographique ----------

export const FRANCE_METRO_EVENTS_BBOX = {
  ne: { lat: 51.6, lng: 9.7 },
  sw: { lat: 40.3, lng: -6.2 },
} as const

// ---------- Catégories ----------

export const eventCategoryLabels: Record<string, string> = { /* ... */ }
```

---

## 9. `services/common/` : réutilisation (**MUST** vérifier avant duplication)

Avant de réécrire un helper local, le contenu suivant **MUST** être vérifié dans `services/common/` :

- `schema.ts` : `createRestPaginationSchema`, `RestPagination`, `RestMetadata`.
- `helpers.ts` : helpers d'optimistic update (`optimisticSetPaginatedData`, `optimisticSetDataById`, `getCachedPaginatedData`, `getCachedSingleItem`, `getCachedPaginatedItemList`).
- `errors/generic-errors.ts` : `GenericResponseError`, `genericErrorThrower`.
- `errors/form-errors.ts` : `FormError`, `createFormErrorResponseSchema`, `createFormErrorThrower`.
- `errors/utils.ts` : `parseError`, `isPathExist`.
- `mapper/` : mappers inter-services (ex. `mapTimelineFeedToRestEvent`).

Toute logique réellement transverse **MUST** finir ici, pas dans un service spécifique.

---

## 10. Checklist : créer un nouveau service

1. Créer le dossier `src/services/<name>/` (sans sous-dossier par couche).
2. Écrire `schema.ts` :
   - schemas d'entités → schemas de requêtes/réponses préfixés `RestGet…` / `RestPost…` ;
   - types `z.infer` regroupés en bas ;
   - si erreurs de formulaire : enum `propertyPathXxxSchema`.
3. Écrire `api.ts` :
   - une fonction par endpoint, verbe en minuscules, `type` explicite ;
   - `scope` et autres query params dans le payload, **MUST NOT** dans `path` ;
   - mapping complexe → `paramsMapper.ts` **MAY** être extrait si ≥ règles §5 / §2 (micro-fichiers).
4. Si erreurs métier de formulaire : `error.ts` **MAY** être ajouté (cf. §7 / §2) et branché via `errorThrowers`.
5. Écrire `hook.ts` :
   - hooks nommés par verbe métier (`useX`, `useCreateX`, `useDeleteX`, `usePaginatedX`) ;
   - query keys via constantes simples ou factory selon la taille du service ;
   - mutations : optimistic update si la donnée est cachée (**MUST**, cf. §6.4), sinon `invalidateQueries` **MAY** ;
   - toasts inline en français, branche dédiée pour `GenericResponseError` et `FormError` éventuel.
6. `constants.ts` **MAY** être ajouté si volume et partage entre couches le justifient (cf. §8 / §2).

---

## 11. Anti-patterns à éviter

- ❌ Sous-dossier `hook/`, `api/`, `schema/` (sauf cas extrême discuté en équipe) — **MUST NOT**.
- ❌ `path: \`/api/...?scope=${scope}\`` : tout query param **MUST** passer par le payload validé — **MUST NOT** dans `path`.
- ❌ Objet `XService = { ... }` exposé à la place de fonctions individuelles — **MUST NOT**.
- ❌ Verbes HTTP en majuscules (`'GET'`, `'POST'`) — **MUST** rester en minuscules ; majuscules **MUST NOT**.
- ❌ Types `z.infer` dispersés autour des schemas — **MUST NOT** ; regroupement en bas **MUST**.
- ❌ Préfixe `useGet…` / `useMutation…` — **SHOULD NOT** ; nommage par verbe métier **MUST** être privilégié.
- ❌ Réécrire à la main la clé d'un autre service — **MUST NOT** ; importer la factory / la constante **MUST**.
- ❌ Appeler `invalidateQueries({ queryKey: ['a', 'b', 'c'] })` en pensant invalider trois clés : **une seule** clé composite — N appels distincts **MUST** être faits — confusion **MUST NOT**.
- ❌ `invalidateQueries` brut quand un optimistic update est réalisable — **MUST NOT** (cf. §6.4).
- ❌ Fichier `error.ts` vide ou contenant uniquement des `GenericResponseError` — **MUST NOT** ; `error.ts` **MAY** exister seulement pour les FormError typées.
- ❌ Fragmenter les constantes d'un service en plusieurs fichiers (`bounds.ts`, `labels.ts`, …) : un seul `constants.ts` — fragmentation **MUST NOT**.
- ❌ Logique métier dans les composants : si une dérivation est utile à >1 écran, elle **MUST** vivre dans `hook.ts` comme hook composite — dispersion dans les composants **MUST NOT**.
