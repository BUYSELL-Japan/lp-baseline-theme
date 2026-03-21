interface SectionErrorProps {
  sectionName: string;
  error: string;
  data?: any;
}

export default function SectionError({ sectionName, error }: SectionErrorProps) {
  console.warn(`[SectionError] Hiding section ${sectionName} due to error: ${error}`);
  return null;
}
