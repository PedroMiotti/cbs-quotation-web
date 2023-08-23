import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  CloseButton,
  Container,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
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
import { FiMenu } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsListUl } from "react-icons/bs";
import { HiOutlineDocument } from "react-icons/hi";
import { BsHash } from "react-icons/bs";
import logo from "../../assets/logo.svg";

const Tabs = [
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
  {
    name: "Cotações",
    icon: HiOutlineDocument,
    route: "/",
  },
  {
    title: "NATAL",
    name: "2022",
    icon: BsHash,
    route: "/",
  },
  {
    name: "2023",
    icon: BsHash,
    route: "/",
  },
  {
    name: "2024",
    icon: BsHash,
    route: "/",
  },
  {
    title: "PERSONALIZADAS",
    name: "Ambev",
    icon: BsHash,
    route: "/",
  },
  {
    name: "Brasuco",
    icon: BsHash,
    route: "/",
  },
  {
    name: "Vale",
    icon: BsHash,
    route: "/",
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

  console.log(isSidebarOpenURL);

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
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
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
        <Box ml={"5"}>{children}</Box>
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
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={isSidebarOpen ? { base: "full", md: "60" } : "80px"}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        mb={10}
        mt={5}
      >
        <Image
          src={logo}
          alt="Knower Logo"
          maxHeight={isSidebarOpen ? 100 : 50}
        />
        <div
          style={{
            height: 50,
            width: "100%",
            borderBottomColor: "red",
            borderBottomWidth: 1,
          }}
        />

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex my={6} justify={"center"}>
        <Button
          bg={"#83B735"}
          color={"#FFFFFF"}
          w={"200px"}
          _hover={{ bg: "#96c255" }}
        >
          + Nova Cotação
        </Button>
      </Flex>
      {Tabs.map((link) => (
        <Stack key={link.name} spacing={0}>
          <Container
            title={isSidebarOpen ? link.title : "-"}
            color={"#7E8BA9"}
            fontSize="md"
            textTransform="uppercase"
          >
            {isSidebarOpen && link.title}
          </Container>
          <NavItem
            key={`nav-item-${link.name}`}
            fontSize="sm"
            route={link.route}
            icon={link.icon}
            onItemClick={onItemClick}
            isSidebarOpen={isSidebarOpen}
          >
            {link.name}
          </NavItem>
        </Stack>
      ))}
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
        p="3"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "green.100",
          color: "green.700",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="18"
            color="gray.400"
            _groupHover={{
              color: "green.700",
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
      // ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
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

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton
					size="lg"
					variant="ghost"
					aria-label="open menu"
					icon={<FiBell />}
				/> */}
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
                {/* <VStack
									display={{ base: 'none', md: 'flex' }}
									alignItems="flex-start"
									spacing="1px"
									ml="2">
									<Text fontSize="sm">Justina Clark</Text>
									<Text fontSize="xs" color="gray.600">
										Admin
									</Text>
								</VStack>
								<Box display={{ base: 'none', md: 'flex' }}>
									<FiChevronDown />
								</Box> */}
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Dashboard</MenuItem>
              <MenuItem>Perfis</MenuItem>
              <MenuItem>Membros</MenuItem>

              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
