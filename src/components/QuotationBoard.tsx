import { DndContext, DragEndEvent, rectIntersection } from "@dnd-kit/core";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import QuotationLane from "./QuotationLane";
import AddCard from "./AddCard";

interface Card {
  title: string;
}

const lanes: QuotationLane[] = [
  {
    id: 1,
    name: "Diamante",
    items: [
      { id: 1, name: "Arroz solito" },
      { id: 2, name: "Feijão" },
    ],
  },
  {
    id: 2,
    name: "Ouro",
    items: [
      { id: 4, name: "Arroz solito" },
      { id: 5, name: "Feijão" },
    ],
  },
  {
    id: 3,
    name: "Rubi",
    items: [
      { id: 6, name: "Arroz solito" },
      { id: 7, name: "Feijão" },
    ],
  },
];

interface Product {
  id: number;
  name: string;
  price?: number;
}

interface QuotationLane {
  id: number;
  name: string;
  items: Product[];
}

const QuotationBoard = () => {
  const [quotations, setQuotations] = useState<Array<QuotationLane>>(lanes);

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={(e: DragEndEvent) => {
        const nextLane = e.over?.id;
        const currentLane = e.active.data.current?.parent;
        const currentItemId = e.active.id;

        const currentQuotationLane = quotations.find(
          (quotation) => quotation.name === currentLane
        );

        const currentQuotationItem = currentQuotationLane?.items.find(
          (item) => item.id === currentItemId
        );

        if(!currentQuotationItem) return

        const updatedQuotations = quotations.map((quotation) => {
          if (quotation.id === nextLane) {
            return {
              ...quotation,
              items: [...quotation.items, currentQuotationItem],
            };
          } else if (quotation.name === currentLane) {
            return {
              ...quotation,
              items: quotation.items.filter(
                (item) => item.id !== currentItemId
              ),
            };
          } else {
            return quotation;
          }
        });

        setQuotations(updatedQuotations);
      }}
    >
      <Flex flexDirection="column">
        {/* <AddCard addCard={addNewCard} /> */}
        <Flex flex="3">
          {quotations.map((lane: any) => (
            <QuotationLane id={lane.id} title={lane.name} items={lane.items} />
          ))}
        </Flex>
      </Flex>
    </DndContext>
  );
};

export default QuotationBoard;
