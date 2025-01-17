# Documentation du Projet

[![codecov](https://codecov.io/gh/VioletThe25th/integdeploy-back/graph/badge.svg?token=J8J8Pcnlxi)](https://codecov.io/gh/VioletThe25th/integdeploy-back)

## Objectif
Ce document décrit les modifications et ajouts réalisés sur le projet, notamment l'intégration des tests, la configuration de Codecov pour la couverture de code

---

## 1. **Configuration des tests avec Jest**

### **Ajout des tests unitaires**
Mise en place des tests unitaires pour les différentes routes de l'API :
- **`countUsers`** : Teste la récupération du nombre d'utilisateurs.
- **`getAllUsers`** : Vérifie que tous les utilisateurs sont récupérés correctement.
- **`createUser`** : Valide la création d'un nouvel utilisateur.

#### Exemple de test pour `countUsers` :
```javascript
describe('countUsers', () => {
    it('fetches successfully data from an API', async () => {
      const data = {
        data: {
          users: [
            {
              id: '1',
              nom: 'a',
              prenom: 'b',
              email: 'c@c.fr',
            },
          ],
        },
      };

      axios.get.mockImplementationOnce(() => Promise.resolve(data));
      await expect(countUsers()).resolves.toEqual(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.SERVER_URL}/users`,
        );
    });

    it('handles API errors gracefully', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('API Error'))
      );

      await expect(countUsers()).rejects.toThrow('API Error');
    });
  });
```

### **Mise en place des variables d'environnement**
Un fichier `.jest/setEnvVars.js` a été créé pour configurer les variables d'environnement nécessaires aux tests. Ce fichier est chargé automatiquement par Jest via le fichier `jest.config.js`.

#### Contenu de `setEnvVars.js` :
```javascript
process.env.PORT=8000
process.env.SERVER_URL = "http://localhost:8000";
process.env.MONGODB_URL="mongodb+srv://bilgerjeremy5705:b8209ze6531@cluster0.icxtwoq.mongodb.net/IntegDeploy?retryWrites=true&w=majority&appName=Cluster0"
process.env.FRONT_URL="http://localhost:3000"
```

#### Configuration dans `jest.config.js` :
```javascript
module.exports = {
    setupFiles: ['./.jest/setEnvVars.js'],
    collectCoverage: true, 
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    testEnvironment: "node",
};
```

---

## 2. **Intégration de Codecov**
### **Installation des dépendances**
Pour collecter la couverture de code :
```bash
npm install --save-dev jest
```

Puis pour générer le dossier de couverture
```bash
npx jest --coverage
```

### **Ajout d'un script pour la couverture**
Dans le fichier `package.json` :
```json
"scripts": {
    ...
  "test:coverage": "jest --coverage"
}
```

### **Configuration du workflow GitHub Actions**
Le workflow a été modifié pour exécuter les tests et envoyer les rapports de couverture à Codecov.

#### configuration du fichier `.github/workflows/production.yml` :
```yaml
name: Vercel Production Deployment

env: 
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  push: 
    branches: [main]
  pull_request:
    branches: [main]

jobs: 
  build_test_and_deploy:
    permissions:
      contents: write
      pull-requests: write

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      # Récupération du code source
      - uses: actions/checkout@v4
      
      # Installation de Node.js
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with: 
          node-version: ${{ matrix.node-version }}

      # Installation des dépendances et exécution des tests
      - name: npm ci and test
        run: |
          npm ci
          npm test
      
      # Deploiement sur Codecov
      - name: Upload coverage reports to Codecov
        uses: codecov/codecov-action@v5
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

      # Installation de la CLI Vercel
      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      # Récupération des variables d'environnement de Vercel
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      # Construction des artefacts du projet
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      # Déploiement sur Vercel
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

```

---

## 4. **Commandes utiles**

- **Lancer les tests** :
  ```bash
  npm test
  ```

---
