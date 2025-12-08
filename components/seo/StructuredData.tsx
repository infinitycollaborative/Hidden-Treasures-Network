interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hidden Treasures Network",
  "alternateName": "Infinity Aero Club Tampa Bay, Inc.",
  "url": "https://HiddenTreasuresNetwork.org",
  "logo": "https://HiddenTreasuresNetwork.org/logo.png",
  "description": "A global network connecting aviation and STEM organizations to impact one million lives by 2030 through education, mentorship, and opportunity.",
  "foundingDate": "2023",
  "founders": [{
    "@type": "Person",
    "name": "Ricardo Foster",
    "jobTitle": "Founder & CEO"
  }],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "General Inquiries",
    "email": "info@hiddentreasuresnetwork.org"
  },
  "sameAs": [
    "https://www.linkedin.com/company/hidden-treasures-network",
    "https://twitter.com/HiddenTreasureN",
    "https://www.facebook.com/HiddenTreasuresNetwork"
  ]
}

// Educational Organization Schema
export const educationalOrgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Hidden Treasures Network",
  "url": "https://HiddenTreasuresNetwork.org",
  "description": "Aviation and STEM education network empowering underserved youth worldwide",
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "educationalCredentialAwarded": [
    "Private Pilot License",
    "FAA Part 107 Drone Certification",
    "STEM Certifications"
  ]
}

// Article Schema Generator
export function createArticleSchema(article: {
  title: string
  description: string
  publishedAt: string
  author?: string
  imageUrl?: string
  slug: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.author || "Hidden Treasures Network"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hidden Treasures Network",
      "logo": {
        "@type": "ImageObject",
        "url": "https://HiddenTreasuresNetwork.org/logo.png"
      }
    },
    "image": article.imageUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://HiddenTreasuresNetwork.org/blog/${article.slug}`
    }
  }
}

// Event Schema Generator
export function createEventSchema(event: {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: { name: string; address?: string }
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate || event.startDate,
    "location": {
      "@type": "Place",
      "name": event.location.name,
      "address": event.location.address
    },
    "image": event.image,
    "organizer": {
      "@type": "Organization",
      "name": "Hidden Treasures Network",
      "url": "https://HiddenTreasuresNetwork.org"
    }
  }
}
