export interface Client {
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  items: QuotationItem[];
}

export interface Quotation {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  client: Client;
  items: QuotationItem[];
  projectOverview: string;
  timeline: {
    phase: string;
    duration: string;
  }[];
  paymentTerms: string;
  exclusions: string;
  template?: string;
}