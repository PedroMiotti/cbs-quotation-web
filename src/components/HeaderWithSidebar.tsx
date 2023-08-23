import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  BoxProps,
  Button,
  Card,
  CardBody,
  CloseButton,
  Container,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Hide,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  color,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Quotation } from "../types/Quotation";
import { AiOutlineShoppingCart, AiOutlinePlusCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { HiOutlineDocument } from "react-icons/hi";
import { BsHash, BsListUl } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

const Tabs = [
  {
    name: "Cotações",
    icon: HiOutlineDocument,
    route: "/",
  },
  {
    name: "Produtos",
    icon: AiOutlineShoppingCart,
    route: "/",
  },
  {
    name: "Marcas",
    icon: BsListUl,
    route: "/",
  },
];

const quotations: Quotation[] = [
  {
    id: 1,
    name: "2022",
    type: "CHRISTMAS",
  },
  {
    id: 2,
    name: "2021",
    type: "CHRISTMAS",
  },
  {
    id: 3,
    name: "2023",
    type: "CHRISTMAS",
  },
  {
    id: 4,
    name: "Ambev",
    type: "CUSTOM",
  },
  {
    id: 5,
    name: "Vale",
    type: "CUSTOM",
  },
  {
    id: 6,
    name: "Brasuco",
    type: "CUSTOM",
  },
];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const isSidebarOpenURL = [
    "/perfis/",
    "/members/",
    "/teams/",
    "/clients/",
    "/dashboard/",
  ].some((path) => location.pathname.startsWith(path));

  const [isSidebarOpen, setSidebarOpen] = useState(isSidebarOpenURL);

  useEffect(() => {
    if (!isSidebarOpenURL) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isSidebarOpenURL]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("#f8f8f8", "gray.900")}
      position="relative"
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        isSidebarOpen={isSidebarOpen}
        onItemClick={handleItemClick}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            isSidebarOpen={isSidebarOpen}
            onItemClick={handleItemClick}
          />
        </DrawerContent>
      </Drawer>

      <Hide above="md">
        <MobileNav onOpen={onOpen} />
      </Hide>

      <Box
        ml={{ base: 0, md: isSidebarOpen ? 60 : 55 }}
        p="4"
        transition="margin-left 0.3s ease"
      >
        <Box
          display={{ base: isSidebarOpen ? "none" : "block", md: "none" }}
          ml={isSidebarOpen ? "0" : "60px"}
        >
          <IconButton
            position="absolute"
            top="8px"
            left="8px"
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
            onClick={handleSidebarToggle}
          />
        </Box>
        <Box ml={"2"} height='95vh'>
          <Card height='100%' bg='white'  borderRadius='26px'>
            <CardBody p={7}>{children}</CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  isSidebarOpen: boolean;
  onItemClick: () => void;
}

const SidebarContent = ({
  onClose,
  isSidebarOpen,
  onItemClick,
  ...rest
}: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("#F7F7F7", "gray.900")}
      w={isSidebarOpen ? { base: "full", md: "60" } : "80px"}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        alignItems="center"
        mx="3"
        justifyContent="space-between"
        mt={5}
        mb={7}
      >
        <Image
          src={logo}
          alt="Knower Logo"
          maxHeight={isSidebarOpen ? 100 : 50}
        />

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex my={6} justify={"center"}>
        <Button
          bg={"#83B735"}
          color={"#FFFFFF"}
          w={"full"}
          height="45px"
          mx={3}
          _hover={{ bg: "#96c255" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Icon as={AiOutlinePlusCircle} mr={2} fontSize="20px" /> Nova Cotação
        </Button>
      </Flex>
      {Tabs.map((link) => (
        <Stack key={link.name} spacing={0}>
          <NavItem
            key={`nav-item-${link.name}`}
            color="gray.500"
            fontWeight="semibold"
            fontSize="md"
            route={link.route}
            icon={link.icon}
            onItemClick={onItemClick}
            isSidebarOpen={isSidebarOpen}
          >
            {link.name}
          </NavItem>
        </Stack>
      ))}
      <Container mt={5}>
        <Accordion
          allowMultiple
          defaultIndex={[0, 1]}
          width="100%"
          maxW="lg"
          bg="#F7F7F7"
          rounded="lg"
        >
          <AccordionItem border="none">
            <AccordionButton
              display="flex"
              alignItems="center"
              p={1}
              _hover={{ bg: "gray.100" }}
            >
              <ChevronDownIcon fontSize="20px" color="gray.300" />
              <Text fontSize="sm" ml={1} color="gray.400">
                NATAL
              </Text>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {quotations
                .filter((quotation) => quotation.type === "CHRISTMAS")
                .map((quotation) => (
                  <Link
                    key={quotation.id}
                    href={`/quotations/${quotation.id}`}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                    py={1}
                    borderRadius={4}
                    _hover={{ bg: "gray.100" }}
                  >
                    <Icon as={BsHash} color="gray.500" />
                    <Text color="gray.500" fontWeight="semibold" fontSize="md">
                      {quotation.name}
                    </Text>
                  </Link>
                ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem border="none">
            <AccordionButton
              display="flex"
              alignItems="center"
              p={1}
              _hover={{ bg: "gray.100" }}
              color="gray.800"
            >
              <ChevronDownIcon fontSize="20px" color="gray.300" />
              <Text fontSize="sm" color="gray.400" ml={1}>
                PERSONALIZADAS
              </Text>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {quotations
                .filter((quotation) => quotation.type === "CUSTOM")
                .map((quotation) => (
                  <Link
                    key={quotation.id}
                    href={`/quotations/${quotation.id}`}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                    py={1}
                    borderRadius={4}
                    _hover={{ bg: "gray.100" }}
                  >
                    <Icon as={BsHash} color="gray.500" />
                    <Text color="gray.500" fontWeight="semibold" fontSize="md">
                      {quotation.name}
                    </Text>
                  </Link>
                ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>

      <Box
        display="flex"
        alignItems="center"
        position={'fixed'}
        bottom={8}
        left={6}
        _hover={{ bg: "gray.100", cursor: "pointer" }}
      >
        <Icon as={FiLogOut} color="gray.500" mr={2} />
        <Text color="gray.500" fontWeight="semibold" fontSize="md">
          Sair
        </Text>
      </Box>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  route: string;
  onItemClick: () => void;
  isSidebarOpen: boolean;
  children: ReactText;
}
const NavItem = ({
  icon,
  route,
  onItemClick,
  isSidebarOpen,
  children,
  ...rest
}: NavItemProps) => {
  const handleItemClick = () => {
    onItemClick();
  };

  return (
    <Link
      href={route}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={handleItemClick}
    >
      <Flex
        align="center"
        p="2"
        mx="4"
        my="1"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "rgba(131, 183, 53, .25)",
          color: "#83B735",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="18"
            color="gray.500"
            _groupHover={{
              color: "#83B735",
            }}
            as={icon}
          />
        )}
        {isSidebarOpen ? <Text>{children}</Text> : null}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("#f8f8f8", "gray.900")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Hide above="md">
        <Image src={logo} width={100} height={100} alt="Cbs logo" />
      </Hide>
    </Flex>
  );
};