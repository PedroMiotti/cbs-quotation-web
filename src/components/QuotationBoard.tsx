import {
  Active,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Flex, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import QuotationLaneComponent from "./QuotationLane";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Composition, CompositionItem } from "../types/Composition";

interface QuotationBoardProps {
  data: Composition[];
  setData: (data: any) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleAddItem: (id: number) => void;
  handleMoveItem: (itemId: number, compositionId: number) => void;
}

const QuotationBoard = ({
  data,
  setData,
  handleDelete,
  handleEdit,
  handleAddItem,
  handleMoveItem,
}: QuotationBoardProps) => {
  const [active, setActive] = useState<Active | null>(null);
  const [activeItem, setActiveItem] = useState<CompositionItem | null>(null);

  const getActiveItem = () => {
    const currentContainerId = active?.data.current?.parent;

    const activeContainer = data.find(
      (quotation) => quotation.id === +currentContainerId
    );

    const activeCard: CompositionItem | undefined =
      activeContainer?.CompositionItems.find((item) => item.id === active?.id);

    return activeCard ?? null;
  };

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [active]);

  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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
        const isContainer = !e.over?.data?.current;

        const nextLane = isContainer
          ? e.over?.id
          : e.over?.data.current?.parent;
        const currentLane = e.active.data.current?.parent;
        const currentItemId = e.active.id;

        const currentQuotationLane = data.find(
          (quotation) => quotation.id === +currentLane
        );

        const nextQuotationLane = data.find(
          (quotation) => quotation.id === nextLane
        );

        const currentItem = currentQuotationLane?.CompositionItems.find(
          (item) => item.id === currentItemId
        );

        const isAlreadyInLane = nextQuotationLane?.CompositionItems.find(
          (item) => item.product_id === currentItem?.product_id
        );

        if (isAlreadyInLane) {
          if (nextLane === currentLane) return;

          toast({
            title: "Item já adicionado",
            description: "Este item já esta nessa cotação",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }

        if (!currentItem) return;

        const updatedQuotations = data.map((quotation) => {
          if (quotation.id === nextLane) {
            return {
              ...quotation,
              CompositionItems: [...quotation.CompositionItems, currentItem],
            };
          } else if (quotation.id === +currentLane) {
            return {
              ...quotation,
              CompositionItems: quotation.CompositionItems.filter(
                (item) => item.id !== currentItemId
              ),
            };
          } else {
            return quotation;
          }
        });

        setActive(null);
        setData(updatedQuotations);
        handleMoveItem(+currentItemId, +nextLane!);
      }}
      // onDragOver={(e: DragEndEvent) => {
      //   const { active, over } = e;

      //   const isContainer = !over?.data?.current;

      //   const currentContainerId = active.data.current?.parent;
      //   const overContainerId = isContainer
      //     ? over?.id
      //     : over.data.current?.parent;

      //   if (over && !isContainer && active.id !== over.id) {
      //     console.log('Active ' + active.id)
      //     console.log('Over ' + over?.id)
      //     setData((items: Composition[]) => {
      //       const activeContainer = items.find(
      //         (quotation) => quotation.id === +currentContainerId
      //       );
      //       const overContainer = items.find(
      //         (quotation) => quotation.id === +overContainerId
      //       );

      //       if (!activeContainer || !overContainer) return items;

      //       const activeIndex = activeContainer.CompositionItems.findIndex(
      //         (item: any) => item.id === active.id
      //       );
      //       const overIndex = overContainer.CompositionItems.findIndex(
      //         (item: any) => item.id === over.id
      //       );

      //       const isBelowOverItem =
      //         over &&
      //         active.rect.current.translated &&
      //         active.rect.current.translated.top >
      //           over.rect.top + over.rect.height;

      //       const modifier = isBelowOverItem ? 1 : 0;

      //       const newIndex =
      //         overIndex >= 0
      //           ? overIndex + modifier
      //           : overContainer.CompositionItems.length + 1;

      //           console.log({newIndex})

      //       const updatedPositionsOver = [
      //         ...overContainer.CompositionItems.slice(0, newIndex),
      //         activeContainer.CompositionItems[activeIndex],
      //         ...overContainer.CompositionItems.slice(newIndex),
      //       ];

      //       const updatedQuotations = items.map((quotation) => {
      //         if (quotation.id === +overContainerId) {
      //           return {
      //             ...quotation,
      //             CompositionItems: updatedPositionsOver,
      //           };
      //         }

      //         else if (quotation.id === +currentContainerId) {
      //           return {
      //             ...quotation,
      //             CompositionItems: quotation.CompositionItems.filter(
      //               (item) => item.id !== active.id
      //             ),
      //           };
      //         }

      //         return quotation;
      //       });

      //       // console.log({data})
      //       // console.log({updatedQuotations})

      //       return updatedQuotations;
      //     });
      //   }
      // }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <Flex overflowX="scroll" height="630px">
        {data.map((lane: Composition) => (
          <QuotationLaneComponent
            setData={setData}
            composition={lane}
            handleAddItem={handleAddItem}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            key={lane.id}
            activeItem={activeItem}
            id={lane.id}
            title={lane.name}
            items={lane.CompositionItems}
          />
        ))}
      </Flex>
    </DndContext>
  );
};

export default QuotationBoard;
