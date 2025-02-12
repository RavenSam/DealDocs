import { create } from 'zustand';
import { Template, Quotation } from '../types';

interface QuotationStore {
  templates: Template[];
  quotations: Quotation[];
  addTemplate: (template: Template) => void;
  addQuotation: (quotation: Quotation) => void;
  removeTemplate: (id: string) => void;
  removeQuotation: (id: string) => void;
}

export const useQuotationStore = create<QuotationStore>((set) => ({
  templates: [],
  quotations: [],
  addTemplate: (template) =>
    set((state) => ({ templates: [...state.templates, template] })),
  addQuotation: (quotation) =>
    set((state) => ({ quotations: [...state.quotations, quotation] })),
  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),
  removeQuotation: (id) =>
    set((state) => ({
      quotations: state.quotations.filter((q) => q.id !== id),
    })),
}));