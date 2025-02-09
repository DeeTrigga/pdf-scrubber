import { ExtractedMetadata } from '../types/index';

export function extractMetadata(text: string, filePath: string): ExtractedMetadata {
  // PDF processing logic here
  return {
    company: 'Unknown',
    type: 'Document',
    date: new Date().toLocaleDateString(),
    assumed: true
  };
}

export function generateFilename(metadata: ExtractedMetadata): string {
  const sanitizedCompany = metadata.company.toLowerCase().replace(/[^a-z0-9]/g, '');
  const sanitizedType = metadata.type.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const sanitizedDate = metadata.date.replace(/\//g, '.');
  
  return `${sanitizedCompany}-${sanitizedType}-${sanitizedDate}.pdf`;
}