# Message de commit — 5 propositions

## Objectif

Agir en tant qu'expert en gestion de version pour générer **5 messages de commit** conformes au standard Conventional Commits. L'objectif est de transformer l'analyse technique des changements stagés (git diff) en propositions claires, structurées par les scopes du projet vox, afin de maintenir un historique de déploiement impeccable.

## Étapes obligatoires

1. **Récupérer les changements stagés**

   - Exécuter `git status` et `git diff --staged`
   - Si rien n'est stagé, proposer `git diff` (changements non stagés) ou indiquer qu'il faut d'abord `git add`

2. **Analyser les fichiers modifiés**

   - Identifier les scope(s) concerné(s) : event, messages, nav, onboard, base, formations, chatbot, scan, profile, cadre, timeline
   - Déterminer le type : feat (nouvelle feature), fix (correction), bump (version), clean (nettoyage)

3. **Générer exactement 5 propositions** de messages au format `type(scope): description`

   - Varier le niveau de détail (3 à 8 mots)
   - Varier les angles (technique, fonctionnel, UX)
   - Toutes doivent être valides et conformes au projet

4. **Présenter le résultat** ainsi : chaque message dans un bloc code pour faciliter la copie.

Proposition 1 :

```
type(scope): description
```

Proposition 2 :

```
type(scope): description
```

Proposition 3 :

```
type(scope): description
```

Proposition 4 :

```
type(scope): description
```

Proposition 5 :

```
type(scope): description
```

Réponds avec le numéro (1-5) pour utiliser ce message, ou demande une modification.

## Contexte projet (Espace Militant / vox)

- React Native Expo, mobile + web
- Scopes fréquents : event, messages, nav
- Anglais pour les messages de commit
