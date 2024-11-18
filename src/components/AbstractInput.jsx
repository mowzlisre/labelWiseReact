import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function AbstractInput({ isCollapsed, setIsCollapsed }) {
    const navigate = useNavigate(); 
    const [abstract, setAbstract] = useState("");
    const [rows, setRows] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            validateToken(token);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const validateToken = async (token) => {
        try {
            const response = await fetch("http://54.161.151.76/validate-token/", {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error validating token:", error);
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const handleInput = (event) => {
        const textareaLineHeight = 24; 
        const previousRows = event.target.rows;
        event.target.rows = 1;

        const currentRows = Math.min(Math.floor(event.target.scrollHeight / textareaLineHeight), 10);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        setRows(currentRows);
        setAbstract(event.target.value)
    };

    const handleProcess = async () => {
        setLoading(true);

        try {
            const response = await fetch("http://54.161.151.76/process/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ abstract }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate("/response", { state: JSON.parse(data) });
            } else {
                
            }
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };
    function wishUser() {
        const hours = new Date().getHours();
        let greeting = '';
    
        if (hours < 12) {
            greeting = 'Good Morning';
        } else if (hours < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
    
        return greeting;
    }

    return (
        <Flex height="100vh" bg="gray.900" color="white">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <Flex direction="column" flex="1" p={2} bg="gray.900">
                <Navbar {...{ isCollapsed, setIsCollapsed }} />
                <Flex height={"100vh"} justifyContent={"center"}>
                    <Box my={"auto"}>
                        <Text fontWeight={200} fontSize={"3xl"}>
                            {wishUser()}
                        </Text>
                        <Text fontSize={"sm"}>
                            Simply input an abstract, and I'll identify the most relevant taxonomy labels for you. Let’s get started!
                        </Text>
                        <Textarea
                            fontFamily={"monospace"}
                            lineHeight={7}
                            fontSize={"sm"}
                            mt={8}
                            rows={rows}
                            onChange={handleInput}
                            borderRadius={"20"}
                            border={0}
                            p={5}
                            bg="gray.800"
                            resize="none"
                            _focus={{ boxShadow: "none" }}
                            placeholder="Enter an abstract"
                        />
                        <Flex mt={4} justifyContent={"end"}>
                            <Button
                                borderRadius={20}
                                fontSize={"sm"}
                                color={"white"}
                                bg={"gray.800"}
                                onClick={handleProcess}
                                isLoading={loading}
                                loadingText="Processing"
                            >
                                Process
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default AbstractInput;
