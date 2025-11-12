#!/bin/bash

# Vérifier si le répertoire de données existe et n'est pas vide
if [ -d "/var/lib/postgresql/data" ] && [ "$(ls -A /var/lib/postgresql/data)" ]; then
    echo "Le répertoire de données existe déjà et n'est pas vide. Initialisation ignorée."
    exit 0
fi

# Si le répertoire n'existe pas ou est vide, initialiser la base de données
echo "Initialisation de la base de données..."
initdb -D /var/lib/postgresql/data

# Configurer PostgreSQL pour accepter les connexions
echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf

# Démarrer PostgreSQL
pg_ctl -D /var/lib/postgresql/data start

# Créer l'utilisateur et la base de données
psql -v ON_ERROR_STOP=1 --username "$DATABASE_URL" <<-EOSQL
    CREATE USER gamer WITH PASSWORD 'gamer';
    CREATE DATABASE gamerchallenge;
    GRANT ALL PRIVILEGES ON DATABASE gamerchallenge TO gamer;
EOSQL

echo "Initialisation terminée avec succès." 