import { Card, Flex, Input, Text, useToast, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import RadarChartComponent from "./RadarChartComponent";
import Sidebar from "./SideBar";
import Tags from "./Tags";

function Response({ isCollapsed, setIsCollapsed }) {
    const toast = useToast();
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate()
    const [data, setData] = useState(location.state || {
        id: null,
        title: "",
        text: "",
        note: "",
        prediction: [],
        predictionTime: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://mowzlisre.me/log/${id}`, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`, 
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result); 
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                toast({
                    title: "Error fetching data",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                console.error("Error:", error);
            }
        };

        if (id) {
            fetchData(); 
        }
    }, [id])

    const handleChange = (field, value) => {
        setData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleNoteChange = (e) => handleChange("note", e.target.value);

    const handleTitleChange = (e) => handleChange("title", e.target.value);

    const saveFunction = async () => {
        try {
            const response = await fetch('https://mowzlisre.me/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: `Paper ${id === undefined ? "saved" : "updated"}`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate(`/response/${result.id}`)
            } else {
                throw new Error('Failed to save data');
            }
        } catch (error) {
            toast({
                title: "Error saving data",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            console.error("Error:", error);
        }
    };

    return (
        <Flex minH="100vh" bg="gray.900" color="white">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <Flex direction="column" flex={1} p={2} bg="gray.900" overflow="scroll">
                <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <Flex justifyContent="center" px={{ md: 20 }} direction="column" mt={{ base: "50px" }}>
                    <VStack align="start" spacing={2} m="auto">
                        {/* Title Input */}
                        <Input
                            fontWeight="bold"
                            fontFamily="monospace"
                            _focus={{ boxShadow: "none" }}
                            border="none"
                            placeholder="Enter the title of the paper"
                            p={8}
                            bg="gray.800"
                            color="white"
                            value={data.title}
                            onChange={handleTitleChange}
                        />

                        {/* Text Display */}
                        <Card width="100%" fontFamily="monospace" p="35px" borderRadius={10} color="whiteAlpha.700" bg="gray.800">
                            <Text fontSize="sm" height="150px" overflow="auto">
                                {data.text}
                            </Text>
                        </Card>

                        <Flex direction={{ base: "column", xl: "row" }} gap={2} width="100%">
                            {/* RadarChartComponent */}
                            <RadarChartComponent prediction={data.prediction} />

                            {/* Tags Component */}
                            <Tags data={data} handleNoteChange={handleNoteChange} saveFunction={saveFunction} id={id} />
                        </Flex>

                    </VStack>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Response;
