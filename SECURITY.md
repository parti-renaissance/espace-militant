# Politique de sécurité — Renaissance App

## Versions supportées

Seule la **version en production** (la plus récente, distribuée via EAS Update et les stores App Store / Google Play) est activement maintenue et recevra des correctifs de sécurité.

| Plateforme | Support |
|---|---|
| iOS (App Store) | ✅ Version actuelle |
| Android (Google Play) | ✅ Version actuelle |
| Web | ✅ Version actuelle |
| Versions antérieures | ❌ Non maintenues |

---

## Signaler une vulnérabilité

**Ne pas ouvrir d'issue publique.** Les divulgations publiques avant correction mettent les utilisateurs en danger.

Envoyer un email à **security@parti-renaissance.fr** avec :

- Une description claire de la vulnérabilité
- Les étapes pour la reproduire
- L'impact estimé (données exposées, actions possibles)
- La plateforme concernée (iOS / Android / Web)
- Si possible, une preuve de concept (sans données réelles)

### Délais de réponse

| Étape | Délai |
|---|---|
| Accusé de réception | 48 heures |
| Évaluation initiale | 5 jours ouvrés |
| Correctif — vulnérabilité critique | 30 jours |
| Correctif — vulnérabilité modérée | 90 jours |

---

## Périmètre

### Dans le périmètre de cette politique

- Application mobile iOS et Android (Renaissance App)
- Application web
- Deep links : schémas `vox://`, `vox-staging://`, `vox-dev://`
- Authentification OAuth 2.0 (flux PKCE via `expo-auth-session`)
- Stockage local des données utilisateur (`expo-secure-store`)
- Contenu chargé dans les WebViews

### Hors périmètre — backend API

Les vulnérabilités concernant l'API backend sont à signaler via le dépôt [`espace-adherent`](https://github.com/parti-renaissance/espace-adherent/blob/main/SECURITY.md).

### Hors périmètre de cette politique

- Tests de charge et déni de service
- Phishing et ingénierie sociale
- Vulnérabilités dans des dépendances tierces non exploitables dans ce contexte

---

## Vecteurs d'attaque prioritaires

Ces surfaces méritent une attention particulière dans les rapports :

- **Deep link hijacking** : détournement des schémas `vox://` pour déclencher des actions non autorisées
- **Stockage de données sensibles** : tokens OAuth mal stockés (ex. dans `AsyncStorage` au lieu de `expo-secure-store`)
- **Injection WebView** : exécution de code arbitraire via `react-native-webview` ou `@10play/react-native-web-webview`
- **Permissions mobiles abusives** : accès à la caméra, la localisation ou les contacts hors usage déclaré
- **Intégrité des mises à jour OTA** : manipulation de bundles EAS Update
- **Exposition de secrets** : clés privées placées dans des variables `EXPO_PUBLIC_*` (bundlées dans le binaire)

---

## Pour les contributeurs — en cas de découverte d'une vulnérabilité

Si tu découvres une faille en contribuant :

1. **Ne pas committer** de code qui exploite ou expose la faille
2. Contacter **security@parti-renaissance.fr** immédiatement
3. Attendre confirmation avant de mentionner quoi que ce soit publiquement

Nous nous engageons à reconnaître les signalements responsables dans nos notes de version (pseudonyme accepté).
