export default function ConfidentialityPolicy() {
  return (
    <section className="container">
      <h1>Politique de confidentialité</h1>
      <section id="privacy" className="card">
        <h2>Responsable du traitement</h2>
        <p>
          <strong>AsperioTech SARL</strong>
          <br />
          Adresse : 12 rue des Impressionnistes, 75017 Paris, France
          <br />
          SIRET : 892 345 678 00012
          <br />
          DPO : Julie Bernard — dpo@asperiotech.example — +33 (0)1 98 76 54 32
        </p>

        <h2>Données collectées</h2>
        <p>
          Nom, prénom, adresse email, mot de passe chiffré et données techniques
          liées à l’usage de l’application.
        </p>

        <h2>Finalités</h2>
        <ul>
          <li>Gestion du compte utilisateur</li>
          <li>Authentification et sécurité</li>
          <li>Support utilisateur</li>
          <li>Sécurité technique</li>
        </ul>

        <h2>Bases légales</h2>
        <p>Exécution du contrat et intérêt légitime pour la sécurité.</p>

        <h2>Durées de conservation</h2>
        <ul>
          <li>Comptes actifs : tant que le compte existe</li>
          <li>Suppression : données supprimées sous 30 jours</li>
          <li>Logs techniques : maximum 90 jours</li>
        </ul>

        <h2>Vos droits</h2>
        <p>
          Accès, rectification, suppression, opposition, limitation,
          portabilité. Contact : dpo@asperiotech.example ou par courrier.
        </p>

        <h2>Sécurité</h2>
        <p>
          Mesures techniques et organisationnelles pour protéger vos données
          (chiffrement, sauvegardes, accès restreint).
        </p>

        <h2>Cookies</h2>
        <p>
          Cookies uniquement nécessaires au fonctionnement (session, sécurité,
          compte). Aucun cookie publicitaire ni de suivi tiers.
        </p>
      </section>
    </section>
  );
}
