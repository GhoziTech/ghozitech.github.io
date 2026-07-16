export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  year: number
  category: 'AI' | 'Cloud' | 'Cybersecurity' | 'Web Development' | 'Programming'
  type: 'Completion' | 'Achievement' | 'Participation' | 'Attendance'
  pdf: string
  thumbnail: string
  credential?: string
  verificationUrl?: string
  note?: string
}

/**
 * Sertifikat baru dapat ditambahkan dengan:
 * 1. Salin PDF ke public/certificates/
 * 2. Tambahkan thumbnail WebP ke public/certificate-thumbnails/
 * 3. Tambahkan satu object baru pada array ini.
 */
export const certificates: Certificate[] = [
  {
    id: 'info-security',
    title: 'Introduction to Information Security',
    issuer: 'Cyber Academy',
    date: '05 November 2025',
    year: 2025,
    category: 'Cybersecurity',
    type: 'Completion',
    pdf: '/certificates/introduction-information-security.pdf',
    thumbnail: '/certificate-thumbnails/introduction-information-security.webp',
    credential: 'PKMI01111254371',
  },
  {
    id: 'basic-cybersecurity',
    title: 'Basic Cybersecurity',
    issuer: 'JagoanSiber x CODEPOLITAN',
    date: '25 October 2025',
    year: 2025,
    category: 'Cybersecurity',
    type: 'Completion',
    pdf: '/certificates/basic-cybersecurity.pdf',
    thumbnail: '/certificate-thumbnails/basic-cybersecurity.webp',
    credential: 'CPJS-CR/2025/X/0079',
  },
  {
    id: 'identity-concepts',
    title: 'Describe Identity Concepts',
    issuer: 'Microsoft Learn',
    date: '04 August 2025',
    year: 2025,
    category: 'Cybersecurity',
    type: 'Achievement',
    pdf: '/certificates/microsoft-identity-concepts.pdf',
    thumbnail: '/certificate-thumbnails/microsoft-identity-concepts.webp',
  },
  {
    id: 'computer-programming',
    title: 'Mengenal Pemrograman Komputer',
    issuer: 'CODEPOLITAN',
    date: '27 July 2025',
    year: 2025,
    category: 'Programming',
    type: 'Completion',
    pdf: '/certificates/codepolitan-computer-programming.pdf',
    thumbnail: '/certificate-thumbnails/codepolitan-computer-programming.webp',
    verificationUrl: 'https://codepolitan.com/c/KVO8KL0',
    note: 'Valid until 26 July 2028',
  },
  {
    id: 'security-compliance',
    title: 'Describe Security and Compliance Concepts',
    issuer: 'Microsoft Learn',
    date: '25 July 2025',
    year: 2025,
    category: 'Cybersecurity',
    type: 'Achievement',
    pdf: '/certificates/microsoft-security-compliance.pdf',
    thumbnail: '/certificate-thumbnails/microsoft-security-compliance.webp',
  },
  {
    id: 'generative-ai',
    title: 'Introduction to Generative AI Concepts',
    issuer: 'Microsoft Learn',
    date: '26 June 2025',
    year: 2025,
    category: 'AI',
    type: 'Achievement',
    pdf: '/certificates/microsoft-generative-ai.pdf',
    thumbnail: '/certificate-thumbnails/microsoft-generative-ai.webp',
  },
  {
    id: 'cloud-types',
    title: 'Describe Cloud Service Types',
    issuer: 'Microsoft Learn',
    date: '26 June 2025',
    year: 2025,
    category: 'Cloud',
    type: 'Achievement',
    pdf: '/certificates/microsoft-cloud-service-types.pdf',
    thumbnail: '/certificate-thumbnails/microsoft-cloud-service-types.webp',
  },
  {
    id: 'osint',
    title: 'Uncovering Secrets with OSINT',
    issuer: 'JadiHacker',
    date: '08 March 2024',
    year: 2024,
    category: 'Cybersecurity',
    type: 'Participation',
    pdf: '/certificates/osint-jadihacker.pdf',
    thumbnail: '/certificate-thumbnails/osint-jadihacker.webp',
    note: 'The name printed in the source certificate is “Hafid Ghozali Al Ghifari”.',
  },
  {
    id: 'web-components',
    title: 'DevCoach 131: Build Custom HTML Elements with Web Components',
    issuer: 'Dicoding Event',
    date: '13 February 2024',
    year: 2024,
    category: 'Web Development',
    type: 'Attendance',
    pdf: '/certificates/dicoding-web-components.pdf',
    thumbnail: '/certificate-thumbnails/dicoding-web-components.webp',
  },
]
