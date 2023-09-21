import {
  Active,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { Flex, useToast, Icon } from "@chakra-ui/react";
import { useState } from "react";
import QuotationLaneComponent from "./QuotationLane";
import { arrayMove } from "@dnd-kit/sortable";
import { Composition, CompositionItem } from "../types/Composition";
import { coordinateGetter as multipleContainersCoordinateGetter } from "./CoordinateGetter";
import ProductCard from "./ProductCard";
import { FiTrash } from "react-icons/fi";

interface QuotationBoardProps {
  data: Composition[];
  setData: (data: any) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleAddItem: (id: number) => void;
  handleMoveItem: (itemId: number, compositionId: number) => void;
  handleDeleteItem: (itemId: number) => void;
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

const QuotationBoard = ({
  data,
  setData,
  handleDelete,
  handleEdit,
  handleAddItem,
  handleMoveItem,
  handleDeleteItem,
}: QuotationBoardProps) => {
  const [active, setActive] = useState<Active | null>(null);
  const [activeItem, setActiveItem] = useState<CompositionItem | null>(null);

  const getActiveItem = () => {
    if (!active) return null;
    const currentContainerId = findContainer(+active.id)!.id;

    const activeContainer = data.find(
      (quotation) => quotation.id === +currentContainerId
    );

    const activeCard: CompositionItem | undefined =
      activeContainer?.CompositionItems.find((item) => item.id === active?.id);

    return activeCard ?? null;
  };

  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: multipleContainersCoordinateGetter,
    })
  );

  const findContainer = (id: number | string) => {
    const isContainer = typeof id === "string" && id.includes(":");

    if (!isContainer) {
      const container = data.find((quotation) =>
        quotation.CompositionItems.find((item) => item.id === id)
      );
      return container;
    }

    const [name, compositionId] = id.split(":");
    const container = data.find(
      (quotation) => quotation.id === +compositionId && quotation.name === name
    );

    return container;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={(e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) {
          setActive(null);
          return;
        }

        const { id } = active;
        const { id: overId } = over;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (!activeContainer) {
          setActive(null);
          return;
        }

        if (overId === "trash") {
          handleDeleteItem(+id);
          setActive(null);
          const updatedPositionsActive =
            activeContainer?.CompositionItems.filter(
              (item: any) => item.id !== id
            );

          setData((prev: any) => {
            const updatedQuotations = prev.map((quotation: any) => {
              if (quotation.id === activeContainer.id) {
                return {
                  ...quotation,
                  CompositionItems: updatedPositionsActive,
                };
              }
              return quotation;
            });

            return updatedQuotations;
          });

          toast({
            title: "Item excluído",
            description: "O item foi excluído da composição",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });

          return;
        }

        if (!overContainer || activeContainer.id !== overContainer.id) {
          setActive(null);
          return;
        }

        const activeIndex = activeContainer.CompositionItems.findIndex(
          (item: any) => item.id === id
        );
        const overIndex = overContainer.CompositionItems.findIndex(
          (item: any) => item.id === overId
        );

        handleMoveItem(+id, +overContainer.id);

        if (activeIndex !== overIndex) {
          setData((prev: any) => {
            const updatedPositions = arrayMove(
              overContainer.CompositionItems,
              activeIndex,
              overIndex
            );

            const updatedQuotations = prev.map((quotation: any) => {
              if (quotation.id === overContainer.id) {
                return {
                  ...quotation,
                  CompositionItems: updatedPositions,
                };
              }
              return quotation;
            });

            return updatedQuotations;
          });
        }

        setActive(null);
      }}
      onDragOver={(e: DragEndEvent) => {
        const { active, over } = e;
        const { id } = active;

        const overId = over!.id;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
          !activeContainer ||
          !overContainer ||
          activeContainer.id === overContainer.id ||
          overId === "trash"
        ) {
          return;
        }

        const isOverContainer =
          typeof overId === "string" && overId.includes(":");

        setData((prev: any) => {
          const activeItems = prev.find(
            (comp: any) => comp.id === activeContainer.id
          ).CompositionItems;
          const overItems = prev.find(
            (comp: any) => comp.id === overContainer.id
          ).CompositionItems;

          const activeIndex = activeItems.findIndex(
            (item: any) => item.id === id
          );
          const overIndex = overItems.findIndex(
            (item: any) => item.id === overId
          );

          let newIndex;
          if (isOverContainer) {
            newIndex = overItems.length + 1;
          } else {
            const isBelowLastItem =
              over &&
              overIndex === overItems.length - 1 &&
              active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowLastItem ? 1 : 0;

            newIndex =
              overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }

          const updatedPositionsOver = [
            ...overItems.slice(0, newIndex),
            activeItems[activeIndex],
            ...overItems.slice(newIndex, overItems.length),
          ];

          const updatedPositionsActive = activeItems.filter(
            (item: any) => item.id !== id
          );

          const updatedQuotations = prev.map((quotation: any) => {
            if (quotation.id === activeContainer.id) {
              return {
                ...quotation,
                CompositionItems: updatedPositionsActive,
              };
            } else if (quotation.id === overContainer.id) {
              return {
                ...quotation,
                CompositionItems: updatedPositionsOver,
              };
            } else {
              return quotation;
            }
          });

          return updatedQuotations;
        });
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <Flex overflowX="scroll" overflowY="hidden" height="630px">
        {data.map((lane: Composition) => (
          <QuotationLaneComponent
            setData={setData}
            composition={lane}
            handleAddItem={handleAddItem}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            key={`${lane.name}:${lane.id}`}
            id={`${lane.name}:${lane.id}`}
            title={lane.name}
            items={lane.CompositionItems}
          />
        ))}
      </Flex>

      <DragOverlay dropAnimation={dropAnimationConfig}>
        {active ? (
          <ProductCard
            setData={setData}
            id={active?.id as number}
            product={active.data.current?.product}
            quantity={0}
            index={
              findContainer(active.id)?.CompositionItems.findIndex(
                (item) => item.id === active.id
              ) ?? 0
            }
            parent={active?.data?.current?.parent}
          />
        ) : null}
      </DragOverlay>

      {active ? <Trash id="trash" /> : null}
    </DndContext>
  );
};

function Trash({ id }: { id: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <Flex
      ref={setNodeRef}
      position="fixed"
      align="center"
      justify="center"
      left="50%"
      marginLeft={"-150px"}
      bottom={"20px"}
      width={"300px"}
      height={"80px"}
      borderRadius={5}
      border="1px solid"
      borderColor={isOver ? "red" : "#DDD"}
      color={isOver ? "red" : "black"}
      bg="white"
      gap={4}
    >
      <Icon
        as={FiTrash}
        mt="1px"
        size="20px"
        color={isOver ? "red" : "black"}
      />
      Solte aqui para excluir
    </Flex>
  );
}

export default QuotationBoard;
