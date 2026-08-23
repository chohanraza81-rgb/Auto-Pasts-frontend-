export function generateArticleSchema(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDesc,
    author: { '@type': 'Person', name: 'Mike Johnson' },
    datePublished: post.publishedAt,
    image: post.featuredImage
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  };
}

export function generateVehicleSchema(make: string, model: string, year: string, part: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${year} ${make} ${model}`,
    model: model,
    vehicleModelDate: year,
    isAccessoryOrSparePartFor: { '@type': 'Product', name: part.replace(/-/g, ' ') }
  };
}
