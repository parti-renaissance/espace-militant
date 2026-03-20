# Guide de contribution — Renaissance App

Merci de l'intérêt porté à Renaissance App. Ce guide est là pour que ta contribution soit intégrée efficacement.

## Avant de commencer

Ouvre ou commente une [issue existante](https://github.com/parti-renaissance/espace-militant/issues) avant de commencer à coder, pour éviter de travailler en parallèle sur la même chose.

---

## ⚠️ Règle n°1 : les composants UI s'écrivent avec Tamagui

Ce projet utilise [Tamagui](https://tamagui.dev/) comme système UI universel. Tamagui compile les composants différemment selon la cible (iOS, Android, Web) pour optimiser les performances de chaque plateforme. **Mélanger les primitives casse l'un ou l'autre rendu.**

| ✅ À utiliser | ❌ À éviter |
|---|---|
| `YStack`, `XStack` (Tamagui) | `View` (React Native) |
| `Text` (Tamagui) | `Text` (React Native) |
| `Button` (Tamagui) | `TouchableOpacity`, `Pressable` |
| Styles via `styled()` ou props Tamagui | `StyleSheet.create()` |

Si tu as besoin d'accéder à une API spécifiquement native (haptics, caméra, etc.), utilise les modules Expo dédiés — pas les primitives de rendu React Native directement dans un composant UI partagé.

---

## Workflow Git

1. **Fork** le dépôt
2. Crée une branche depuis `develop` (**pas depuis `main`**) :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/ma-fonctionnalite
   ```
3. Développe et committe en respectant les conventions ci-dessous
4. Ouvre une **Pull Request vers `develop`**

⚠️ La branche par défaut est `develop`. Les PR vers d'autres branches sont refusées.

### Nommage des branches

```
feat/     → nouvelle fonctionnalité
fix/      → correction de bug
chore/    → maintenance, dépendances, outillage
refactor/ → refactoring sans changement fonctionnel
docs/     → documentation uniquement
```

---

## Conventions de commit

Ce projet suit [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
<type>(<scope>): <description courte en anglais>
```

**Types courants :**

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `bump` | Mise à jour de version |
| `clean` | Nettoyage de code |
| `chore` | Maintenance, dépendances |
| `refactor` | Refactoring sans changement de comportement |
| `docs` | Documentation uniquement |
| `style` | Formatage, sans changement fonctionnel |

**Scopes courants :** `event`, `messages`, `nav`, `onboard`, `base`, `formations`, `chatbot`, `scan`, `profile`, `cadre`, `timeline`

**Exemples :**

```
feat(event): add event card component
fix(nav): fix navigation crash on back press
fix(onboard): fix keyboard offset on adhesion form
bump(deps): update expo to 53.0.1
docs: update installation guide
```

---

## Standards de code

- **TypeScript strict** : pas de `any`, pas de `@ts-ignore`, pas de `@ts-nocheck`
- **Pas de `console.log`** laissé dans le code final
- **Pas de classes** : préférer les fonctions et hooks React

Outils à lancer avant de commiter :

```bash
yarn lint        # ESLint
yarn ts:check    # Vérification TypeScript
yarn knip        # Détection de code mort (exports/imports inutilisés)
```

---

## Sécurité dans le code

Ces règles sont non-négociables :

- ✅ **`expo-secure-store`** pour stocker des tokens, identifiants ou données sensibles (stockage chiffré natif)
- ❌ **`AsyncStorage`** pour tout ce qui est sensible — stockage plaintext non chiffré, lisible sur appareil rooté
- Les variables `EXPO_PUBLIC_*` sont **intégrées dans le binaire** — ne jamais y mettre de clés privées, tokens serveur ou secrets
- Ne jamais committer `.env.local`
- En cas de découverte d'une vulnérabilité, consulter [SECURITY.md](SECURITY.md)

---

## Checklist avant de soumettre une PR

- [ ] `yarn lint` sans erreur
- [ ] `yarn ts:check` sans erreur
- [ ] Les composants UI utilisent les primitives Tamagui
- [ ] Pas de `console.log` de debug
- [ ] Pas de `any` TypeScript non justifié
- [ ] Aucune variable `EXPO_PUBLIC_*` contenant un secret
- [ ] `.env.local` non commité
- [ ] Testé sur les plateformes concernées (iOS / Android / Web)

---

## Délai de revue

Les pull requests sont revues sous **2 à 5 jours ouvrés**. Si ta PR est urgente, mentionne-le dans la description.
