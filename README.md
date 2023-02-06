# Dougs Technical Test

Voici ma réponse au test technique proposé par Dougs.  
C'est un petit serveur utilisant NestJs qui va valider ou non les données d'un scraping de compte bancaire.

## Logique

L'application va d'abord vérifier s'il y a des doublons dans les mouvements bancaire envoyés, en se basant sur leurs Ids. S'il y en a, une erreur avec pour message `Duplicate bank operations` est renvoyé, ainsi que toutes les données présentes en double dans le champ `duplicateOperations`.  

Ensuite, je crée un tableau contenant toutes les opérations ainsi que les points de contrôles que je trie selon leur date, du plus ancien au plus récent. 

Si le dernier élément enregistré n'est pas un point de contrôle, je considère que les données ne sont pas correctes et envoie une erreur `Uncontrolled bank operation`, avec ce mouvement de banque dans le champ `uncontrolledOperation`. En effet, il y aura forcement des opérations qui ne seront pas validées. Selon le comportement attendu, on pourrait accepter ces données si le point de contrôle  n'a simplement pas encore été généré.

Après cela j'utilise le point de contrôle antérieur à toutes les opérations (s'il présent) pour initialiser le solde du compte. Sans ce point de contrôle, je considère que le compte est un nouveau compte, sans point de contrôle précédent, mais on pourrait renvoyer une erreur.  

Une fois dans cette configuration, il suffit de boucler sur les objets pour les traiter de façon chronologique.   
Quand on traite un mouvement de banque, on ajoute sa valeur au solde.  
Quand on traite un point de contrôle, on vérifie que le solde de celui-ci est égal au solde calculé jusqu'ici. Si ce n'est pas le cas, on envoie une erreur avec pour message `Mismatch on control point` et le point posant problème dans le champ `failedControlPoint`.  

Si aucune erreur n'a été envoyée, on renvoie le message `Accepted`, les données sont conformes.

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

    // les lignes dupliquées si cette erreur arrive
    duplicateBankOperations?: BankOperation[]; 

    // Le point de contrôle invalide si le solde n'est pas bon
    failedControlPoint?: ControlPoint;

    // Une opération non validée par un point de contrôle si cela arrive
    uncontrolledOperation?: BankOperation;
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
 └─── exception
    |   bank-validation.exception.ts    // Exception custom pour gérer les différentes erreurs
```


## Tests
J'ai fourni des test e2e assez simple, ainsi que des données de test, qui permettent de voir les comportements les plus courants.  
Je n'ai pas mis de tests unitaires car la méthode `instanceOf` pose des problèmes de contexte et renvoie toujours `false` sur une configuration basique de Jest.  J'aurai pu contourner le problème en n'utilisant pas `instanceOf`, mais je trouve le code plus lisible avec, ce qui me semble plus important pour un test technique.