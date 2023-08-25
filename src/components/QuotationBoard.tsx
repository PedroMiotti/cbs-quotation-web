import { Active, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import QuotationLaneComponent from "./QuotationLane";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Composition, CompositionItem } from "../types/Composition";

interface QuotationBoardProps {
  data: Composition[];
  setData: (data: any) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleAddItem: (id: number) => void;
}

const QuotationBoard = ({data, setData, handleDelete, handleEdit, handleAddItem}: QuotationBoardProps) => {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => {
      const currentContainerId = active?.data.current?.parent;

      const activeContainer = data.find((quotation) => quotation.id === +currentContainerId);
      const activeCard: CompositionItem | undefined = activeContainer?.CompositionItems.find((item) => item.product_id === active?.id)

      return activeCard;
    },
    [active]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      collisionDetection={rectIntersection}
      onDragEnd={(e: DragEndEvent) => {
        const nextLane = e.over?.id;
        const currentLane = e.active.data.current?.parent;
        const currentItemId = e.active.id;

        const currentQuotationLane = data.find(
          (quotation) => quotation.id === +currentLane
        );

        const nextQuotationLane = data.find(
          (quotation) => quotation.id === nextLane
        );

        const currentQuotationItem = currentQuotationLane?.CompositionItems.find(
          (item) => item.product_id === currentItemId
        );

        const isAlreadyInLane = nextQuotationLane?.CompositionItems.find(
          (item) => item.product_id === currentQuotationItem?.product_id
        );

        if(!currentQuotationItem || isAlreadyInLane) return

        const updatedQuotations = data.map((quotation) => {
          if (quotation.id === nextLane) {
            return {
              ...quotation,
              items: [...quotation.CompositionItems, currentQuotationItem],
            };
          } else if (quotation.id === +currentLane) {
            return {
              ...quotation,
              items: quotation.CompositionItems.filter(
                (item) => item.product_id !== currentItemId
              ),
            };
          } else {
            return quotation;
          }
        });

        setActive(null);
        setData(updatedQuotations);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <Flex overflowX='scroll' height="100%">
        {data.map((lane: Composition) => (
          <QuotationLaneComponent handleAddItem={handleAddItem} handleDelete={handleDelete} handleEdit={handleEdit} key={lane.id} activeItem={activeItem} id={lane.id} title={lane.name} items={lane.CompositionItems} />
        ))}
      </Flex>
    </DndContext>
  );
};

export default QuotationBoard;
