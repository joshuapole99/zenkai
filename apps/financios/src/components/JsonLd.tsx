export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://financios.nl/#organization",
        name: "Financios",
        url: "https://financios.nl",
        description: "Gratis spaaranalyse en persoonlijk spaarplan voor Nederlanders.",
        foundingLocation: { "@type": "Country", name: "Nederland" },
      },
      {
        "@type": "WebSite",
        "@id": "https://financios.nl/#website",
        url: "https://financios.nl",
        name: "Financios",
        publisher: { "@id": "https://financios.nl/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://financios.nl/scan",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is de spaaranalyse echt gratis?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, de scan en het resultaat zijn volledig gratis. Alleen het persoonlijk spaarplan kost €4,99 eenmalig.",
            },
          },
          {
            "@type": "Question",
            name: "Hoe werkt Financios?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Je vult je inkomen en uitgaven in. Financios berekent direct je spaarruimte, of je doel haalbaar is, en waar je geld naartoe gaat. Optioneel krijg je een persoonlijk weekplan.",
            },
          },
          {
            "@type": "Question",
            name: "Wat krijg ik voor €4,99?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Een persoonlijk spaarplan met weekoverzicht, maandoverzicht, bezuinigingstips op maat, 3 scenario's en een exacte afrondingsdatum voor jouw spaardoel.",
            },
          },
          {
            "@type": "Question",
            name: "Moet ik een account aanmaken?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nee, je kunt direct starten zonder account. Met een gratis account kun je je scans opslaan, spaardoelen bijhouden en je vermogen bijhouden.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
