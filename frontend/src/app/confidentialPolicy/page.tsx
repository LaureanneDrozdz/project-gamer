export default function ConfidentialityPolicy() {
  return (
    <main className="w-full md:my-11 px-4 md:px-10 lg:px-20 xxl:px-40 py-7 gap-6">
    <h1 className="text-xl lg:text-6xl pb-2 font-semibold">Politique de confidentialité — Projet de formation</h1>
    
  
    <section className="py-6">
      <h2 className="text-xl font-semibold pb-2">Responsable de la publication</h2>
      <p><strong>Kratos</strong> — Directeur fictif du projet</p>
      <p>Email : <a href="mailto:publication@gamerchallenge.example">publication@gamerchallenge.example</a></p>
    </section>

    <section className="py-6">
      <h2 className="text-xl font-semibold pb-2">Données collectées</h2>
      <p>Ce site ne collecte aucune donnée personnelle. Les informations saisies dans les formulaires sont uniquement utilisées à des fins de démonstration et ne sont pas stockées.</p>
    </section>

    <section className="py-6">
      <h2 className="text-xl font-semibold pb-2">Finalités</h2>
      <ul className=" space-y-1">
        <li>Gestion du compte utilisateur</li>
        <li>Authentification et sécurité</li>
        <li>Support utilisateur</li>
        <li>Sécurité technique</li>
      </ul>
    </section>

    <section className="py-6">
      <h2 className="text-xl font-semibold pb-2">Vos droits</h2>
      <p>
          Accès, rectification, suppression, opposition, limitation et
        portabilité. Vous pouvez exercer vos droits en contactant :{" "}
        <a
          href="mailto:dpo@gamerchallenge.example"
          className="text-indigo-600 hover:underline"
        >
          dpo@gamerchallenge.example
        </a>{" "}

      </p>
    </section>

    <section className="py-6">
      <h2 className="text-xl font-semibold pb-2"> Sécurité</h2>
      <p> Des mesures techniques et organisationnelles sont mises en œuvre pour
        protéger vos données : chiffrement, sauvegardes régulières et accès
        restreint aux informations sensibles..</p>
    </section>

    <section className="py-6">
      <h2 className="text-xl font-semibold pb-2">Cookies</h2>
      <p>Le site utilise uniquement des cookies nécessaires à son fonctionnement
        (session, sécurité, compte). Aucun cookie publicitaire ni de suivi tiers
        n’est utilisé.</p>
      
    </section>
  </main>
  );
}
