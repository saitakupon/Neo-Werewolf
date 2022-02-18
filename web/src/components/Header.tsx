import React from "react";
import {
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    Button,
    DrawerCloseButton,
    DrawerHeader,
    DrawerFooter, IconButton
} from "@chakra-ui/react";
import {Auth} from "aws-amplify";
import {HamburgerIcon} from "@chakra-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";

const Header: React.FC = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <>
            {
                location?.pathname !== "/" && <>Neo Werewolf</>
            }
            {/*{*/}
            {/*    (location?.pathname === "/room/create" || location?.pathname === "/room/join") &&*/}
            {/*    <IconButton*/}
            {/*        position={"absolute"}*/}
            {/*        left={"2vw"}*/}
            {/*        textAlign={"start"}*/}
            {/*        color={"white"}*/}
            {/*        bg={"#282c34"}*/}
            {/*        _hover={{bg: "#282c34"}}*/}
            {/*        _active={{bg: "#282c34", transform: "scale(0.95)"}}*/}
            {/*        _focus={{focus: "none"}}*/}
            {/*        aria-label="menu"*/}
            {/*        size={"md"}*/}
            {/*        icon={<ChevronLeftIcon fontSize={24}/>}*/}
            {/*        onClick={() => {*/}
            {/*            navigate("/", {*/}
            {/*                replace: true*/}
            {/*            });*/}
            {/*        }}*/}
            {/*    />*/}
            {/*}*/}
            <IconButton
                position={"absolute"}
                right={"2vw"}
                textAlign={"start"}
                color={"white"}
                bg={"#282c34"}
                _hover={{bg: "#282c34"}}
                _active={{bg: "#282c34", transform: "scale(0.95)"}}
                _focus={{focus: "none"}}
                aria-label="menu"
                size={"md"}
                icon={<HamburgerIcon fontSize={24}/>}
                onClick={onOpen}
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay/>
                <DrawerContent bg={"#282c34"}>
                    <DrawerCloseButton color={"white"} _focus={{focus: "none"}}/>
                    <DrawerBody>
                        <DrawerHeader color={"white"}>メニュー</DrawerHeader>
                    </DrawerBody>
                    <DrawerFooter>
                        {
                            location?.pathname === "/" ?
                                <Button
                                    h={16}
                                    w={272}
                                    colorScheme={"red"}
                                    marginY={2}
                                    onClick={() => {
                                        Auth.signOut().then(() => {
                                            window.location.reload();
                                        });
                                        onClose();
                                    }}
                                >
                                    サインアウト
                                </Button>
                                :
                                <Button
                                    h={16}
                                    w={272}
                                    colorScheme={"red"}
                                    marginY={4}
                                    onClick={() => {
                                        navigate("/", {
                                            replace: true
                                        });
                                        onClose();
                                    }}
                                >
                                    中断してホームへ
                                </Button>
                        }
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default Header;
