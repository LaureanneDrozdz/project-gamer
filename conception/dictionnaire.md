# Dictionnaire des données - MVP

## Utilisateur

| Champ           | Type      | Spécificité                           | Description                              |
| --------------- | --------- | ------------------------------------- | ---------------------------------------- |
| `id`            | UUID      | PRIMARY KEY, NOT NULL, AUTO_INCREMENT | Identifiant unique de l’utilisateur (PK) |
| `username`      | VARCHAR   | NOT NULL, UNIQUE                      | Nom d'utilisateur, unique                |
| `email`         | VARCHAR   | NOT NULL, UNIQUE                      | Adresse e-mail, unique                   |
| `password_hash` | VARCHAR   | NOT NULL                              | Mot de passe haché                       |
| `avatar_url`    | TEXT      | NULLABLE                              | URL de l’avatar de profil                |
| `created_at`    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP   | Date de création du compte               |
| `updated_at`    | TIMESTAMP | NULLABLE                              | Date de dernière mise à jour             |

## Challenge

| Champ         | Type      | Spécificité                           | Description                                         |
| ------------- | --------- | ------------------------------------- | --------------------------------------------------- |
| `id`          | UUID      | PRIMARY KEY, NOT NULL, AUTO_INCREMENT | Identifiant unique du challenge (PK)                |
| `title`       | VARCHAR   | NOT NULL                              | Titre du challenge                                  |
| `description` | TEXT      | NOT NULL                              | Description du challenge                            |
| `rules`       | TEXT      | NULLABLE                              | Règles spécifiques du challenge                     |
| `game`        | VARCHAR   | NOT NULL                              | Jeu concerné par le challenge                       |
| `difficulty`  | ENUM      | NOT NULL DEFAULT 'medium'             | Difficulté (ENUM: `easy`, `medium`, `hard`)         |
| `created_by`  | UUID      | FOREIGN KEY, NOT NULL                 | Référence à l’utilisateur créateur (`users.id`)     |
| `validated`   | BOOLEAN   | NOT NULL, DEFAULT FALSE               | Statut de validation du challenge                   |
| `created_at`  | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP   | Date de création du challenge                       |
| `updated_at`  | TIMESTAMP | NULLABLE                              | Date de dernière mise à jour                        |

## Participation

| Champ         | Type      | Spécificité                           | Description                                           |
| ------------- | --------- | ------------------------------------- | ----------------------------------------------------- |
| `id`          | UUID      | PRIMARY KEY, NOT NULL, AUTO_INCREMENT | Identifiant unique de la participation (PK)           |
| `user_id`     | UUID      | FOREIGN KEY, NOT NULL                 | Référence à l’auteur de la participation (`users.id`) |
| `challenge_id`| UUID      | FOREIGN KEY, NOT NULL                 | Référence au challenge associé (`challenges.id`)      |
| `video_url`   | TEXT      | NOT NULL                              | URL de la vidéo prouvant la réalisation               |
| `description` | TEXT      | NULLABLE                              | Description facultative de la vidéo                   |
| `validated`   | BOOLEAN   | NOT NULL, DEFAULT FALSE               | Validation de la participation                        |
| `created_at`  | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP   | Date de création de la participation                  |
| `updated_at`  | TIMESTAMP | NULLABLE                              | Date de dernière mise à jour                          |

## Vote

| Champ        | Type      | Spécificité                           | Description                                                                        |
| ------------ | --------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`         | UUID      | PRIMARY KEY, NOT NULL, AUTO_INCREMENT | Identifiant unique du vote (PK)                                                    |
| `user_id`    | UUID      | FOREIGN KEY, NOT NULL                 | Référence à l’auteur du vote (`users.id`)                                          |
| `target_type`| ENUM      | NOT NULL                              | Type de la cible du vote (`challenge` | `participation`)                           |
| `target_id`  | UUID      | NOT NULL                              | Référence à l'identifiant de la cible (challenge.id ou participation.id)           |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP   | Date de création du vote                                                           |

