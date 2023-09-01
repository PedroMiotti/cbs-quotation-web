// Modal.tsx
import React, { useState } from "react";
import {
  Button,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
} from "@chakra-ui/react";

interface ModalProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  children: React.ReactNode;
  textButton: string;
  isLoading?: boolean;
  footerText?: string;
}

const Modal: React.FC<ModalProps> = ({
  size,
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  textButton,
  isLoading,
  footerText,
}) => {
  return (
    <ChakraModal size={size ?? "md"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Flex align="center" justifyContent={footerText ? "space-between" : "flex-end"} width="full">
            {footerText && (
              <Text fontSize="md" color="gray.500" ml={1}>
                {footerText}
              </Text>
            )}
            <Flex>
              <Button bg={"gray.400"} color={"white"} mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="solid"
                bg={"#83B735"}
                color={"white"}
                onClick={onSubmit}
                isLoading={isLoading ?? false}
              >
                {textButton}
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
