# Mises à jour — Crashs OTA iOS et correctif UpdateGateway

Document court décrivant l'incident OTA du 26/06/2026 et la solution mise en place.

---

## Problème

Après publication d'une OTA, des crashs fatals iOS en production ont été observés (~300+ utilisateurs), notamment :

| Symptôme | Cause probable |
|----------|----------------|
| `SharedObject.appContext.setter` | Reload JS pendant que des modules natifs (expo-image, etc.) sont actifs |
| `installTurboModule` / Reanimated | Réinitialisation des TurboModules pendant un `reloadAsync()` |
| `folly::TypeError` (string vs null) | Props natives recevant `null` pendant la transition |
| `WatchdogTermination` | Téléchargement OTA (~17 Mo) + vidéo HLS en parallèle |

**Cause racine :** l'ancien `useAppUpdate.ts` enchaînait automatiquement `checkForUpdateAsync()` → `fetchUpdateAsync()` → `reloadAsync()` au **boot** et au **retour foreground**, alors que l'arbre React complet était monté (SessionProvider, Reanimated, expo-image, vidéos, etc.).

---

## Solution : UpdateGateway

Séparer **toutes** les mises à jour (store + OTA) de l'app et **démonter l'arbre applicatif** avant toute action bloquante.

### Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/features/update/hooks/useUpdateGateway.ts` | Vérif store + pipeline OTA (machine à états unifiée) |
| `src/features/update/components/UpdateGatewayScreen.tsx` | UI minimale (RN pur) — store, OTA et erreur |
| `app/_layout.tsx` | `Root` (gateway) vs `AppShell` (app complète) |

---

## Flow

```
Boot / Foreground
       │
       ▼
  Native (non dev/web) ? ──non──► AppShell monté
       │
      oui
       │
       ▼
  Vérif store (app toujours montée si pas de MAJ)
       │
       ├── MAJ store requise ─────► mode = store → UpdateGatewayScreen → AppShell démonté
       │
       └── Pas de MAJ store
              │
              ▼
         checkForUpdateAsync (OTA)
              │
              ├── pas de MAJ ──────► AppShell monté
              │
              └── MAJ OTA dispo
                     │
                     ▼
              mode = ota → AppShell démonté
                     │
                     ▼
              fetchUpdateAsync → preparing_reload → reloadAsync

       (en cas d'erreur OTA → écran erreur + retry)
```

### Modes (`UpdateGatewayMode`)

- `ready` — app normale (`AppShell` monté)
- `store` — build store obsolète, redirection vers le store
- `ota` — téléchargement / reload OTA en cours (`otaPhase`: downloading | preparing_reload | reloading)

### Priorité

1. **Store** — si le build natif est obsolète, l'OTA est ignorée
2. **OTA** — uniquement si le build store est à jour

### Déclencheurs

- **Boot** : vérification après 1 s
- **Foreground** : recheck après 2 s (si `mode === 'ready'`)
- **Hors ligne** : skip, retry automatique au retour réseau

### Principes de sécurité

1. Les vérifications réseau se font **sans démonter** l'app (pas de flash inutile si pas de MAJ).
2. Dès qu'une MAJ est confirmée → **démontage** de Tamagui, Session, Slot, Reanimated, etc.
3. UI gateway **minimale** (pas de Tamagui / expo-image).
4. Délai avant reload OTA pour laisser le runtime natif se stabiliser.
5. En cas d'échec OTA → retour à `ready` + écran erreur avec bouton « Réessayer ».

---

## Déploiement

1. Publier cette OTA sur le channel `main`.
2. Incrémenter `eas_update_version` dans `app.json`.
3. Envisager un **rollback** de l'OTA problématique en parallèle — les clients sur l'ancien JS continuent d'auto-reload jusqu'à recevoir le correctif.
