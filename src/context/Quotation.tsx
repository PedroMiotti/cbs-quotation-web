import { createContext, useEffect, useState, useContext } from "react";
import { Quotation, QuotationTable } from "../types/Quotation";
import { fetchAllQuotations } from "../api/Quotation";

type QuotationContext = {
  quotations: QuotationTable[];
  isLoading: boolean;
  fetchQuotations: () => Promise<void>;
};

const QuotationContext = createContext<QuotationContext>({
  quotations: [],
  isLoading: false,
  async fetchQuotations() {},
});

export const QuotationProvider = ({ children }: { children: React.ReactNode }) => {
  const [quotations, setQuotations] = useState<QuotationTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchQuotations = async () => {
    setIsLoading(true);
    fetchAllQuotations()
      .then((data) => {
        setQuotations(data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if ((!quotations || !quotations.length) && !isLoading)
      fetchQuotations();
  }, []);

  return (
    <QuotationContext.Provider
      value={{ quotations, fetchQuotations, isLoading }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => useContext(QuotationContext);
