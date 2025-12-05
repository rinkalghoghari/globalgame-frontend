type JsonLdData = {
  [key: string]: string | number | boolean | JsonLdData | (string | number | boolean | JsonLdData)[];
};

type JsonLdProps = {
  type?: string;
  data: JsonLdData;
  scriptId?: string;
};

export default function JsonLd({ type = 'Thing', data, scriptId = 'json-ld' }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      id={scriptId}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
