import React, {useEffect, useState} from "react";
import {Button, Image, Text, Wrap} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {Auth} from "aws-amplify";
import {isMobile} from "react-device-detect";

import logo from "../assets/logo/logo.svg"

interface Props {
    username?: string
}

const TopPage: React.FC<Props> = (props) => {
    const navigate = useNavigate();
    const [uid, setUid] = useState<string>("");
    useEffect(() => {
        Auth.currentAuthenticatedUser().then((res: any) => {
            setUid(res.attributes.sub);
        });
    }, []);
    return (
        <>
            <Image
                src={logo}
                w={isMobile ? "100vw" : "80vw"}
                p={12}
            />
            <Text p={12}>
                ようこそ！{props.username}さん
            </Text>
            <Wrap spacing={4}>
                <Button
                    onClick={() => {
                        navigate("/room/create",
                            {
                                state: {
                                    playerId: uid
                                },
                                replace: true
                            });
                    }}
                    colorScheme={"purple"}
                    _hover={{bg: "purple"}}
                    _active={{bg: "purple", transform: "scale(0.95)"}}
                    _focus={{focus: "none"}}
                >
                    ホストとして参加
                </Button>
                <Button
                    onClick={() => {
                        navigate("/room/join",
                            {
                                state: {
                                    playerId: uid
                                },
                                replace: true
                            });
                    }}
                    _hover={{bg: "purple"}}
                    _active={{bg: "purple", transform: "scale(0.95)"}}
                    _focus={{focus: "none"}}
                    colorScheme={"purple"}
                >
                    ゲストとして参加
                </Button>
            </Wrap>
        </>
    );
}

export default TopPage;
