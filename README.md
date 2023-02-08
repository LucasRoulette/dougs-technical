# Dougs Technical Test

Voici ma réponse au test technique proposé par Dougs.  
C'est un petit serveur utilisant NestJs qui va valider ou non les données d'un scraping de compte bancaire.

## Logique

L'application va d'abord vérifier s'il y a des doublons dans les mouvements bancaire envoyés, en se basant sur leurs Ids. S'il y en a, on filtre le tableau pour les rétirer et l'ajouter au journal d'erreur.

Ensuite, je crée un tableau contenant toutes les opérations ainsi que les points de contrôles que je trie selon leur date, du plus ancien au plus récent. 

Si le dernier élément enregistré n'est pas un point de contrôle, toutes les opérations suivant le dernier point de contrôle de la liste ne peuvent pas être validées. J'ajoute ces données dans une erreur `Uncontrolled bank operations` dans le journal d'erreur. Selon le comportement attendu, on pourrait accepter ces données si le point de contrôle  n'a simplement pas encore été généré.

Après cela j'utilise le point de contrôle antérieur à toutes les opérations (s'il présent) pour initialiser le solde du compte. Sans ce point de contrôle, je considère que le compte est un nouveau compte, sans point de contrôle précédent, mais on pourrait renvoyer une erreur.  

Une fois dans cette configuration, il suffit de boucler sur les objets pour les traiter de façon chronologique.   
Quand on traite un mouvement de banque, on ajoute sa valeur au solde.  
Quand on traite un point de contrôle, on vérifie que le solde de celui-ci est égal au solde calculé jusqu'ici. Si ce n'est pas le cas, on sauvegarde ce point de contrôle pour l'ajouter à l'erreur `Mismatch on control points`, puis on récupère sa valeur pour valider les opérations suivantes.

Si le journal d'erreur est vide, les données sont acceptées

## Comment utiliser

Pour lancer l'application :
```
npm run start
// Ou en watch mode
npm run start:dev
```

Pour lancer les tests e2e :
```
npm run test
npm run test:cov    // version avec coverage
```

## API
On a l'unique route :
```
POST /movements/validation
```

Qui demande comme body un objet de type `ValidationDto`. Le body est automatiquement validé grâce aux décorateurs de `class-validator`, et les string de date sont transformés en objets `Date` grâce au `class-transformer`.  

En réponse on aura un status 202 si les données sont valide, ou un 418 (le code 418 à été gardé pour la blague) sur une erreur, avec ces données :
```ts
{
    // Le message de réponse
    message: string; 

    // Les possibles erreurs sont renvoyées ici, selon le message on aura des données differentes
    errorReport?: [{
        message: 
            | 'Mismatch on control point'
            | 'Uncontrolled bank operations'
            | 'Duplicate bank operations';
        failedControlPoints?: ControlPoint[];
        uncontrolledOperations?: BankOperation[];
        duplicateBankOperations?: BankOperation[];
    }]
}
```

## Structure

```
│   README.md
│   ...
└─ src
 │   main.ts                    // Entry file
 │   app.module.ts              // Module root
 │   validation.controller.ts   // Controller de la route de validation
 │   validation.service.ts      // Service gérant la logique de la validation
 └─── model                         // Structures de données
    |   bank-operation.dto.ts
    |   control-point.dto.ts
    |   validation.dto.ts           
    |   dated-operation.model.ts    // interface pour stocker organiser les deux types d'objets dans le tableau           
    |   invalid-data.model.ts       // interface représentant un élément invalide dans les données
```


## Tests
Les tests ont été améliorés pour mieux couvrir les cas possibles et j'ai rajouté le coverage qui manquait.
