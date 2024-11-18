import { Box, Button, Collapse, Flex, Text, useToast, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdFilterList, MdFilterListOff } from "react-icons/md";

function Sidebar({ isCollapsed, setIsCollapsed }) {
    const [openSections, setOpenSections] = useState({});
    const [logs, setLogs] = useState({});
    const [logsUnfiltered, setLogsUnfiltered] = useState({});
    const [toggleFilter, setToggleFilter] = useState(true); // Initially toggled on to show filtered logs
    const navigate = useNavigate();
    const toast = useToast();

    const toggleCollapse = (index) => {
        setOpenSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const unfilter = () => {
        if (logsUnfiltered.length > 0){
            setToggleFilter(false);
        }
        let result = [];
        let seen = new Set();
        for (let category in logs) {
            logs[category].forEach(item => {
                if (!seen.has(item.id)) {
                    seen.add(item.id);
                    result.push({ id: item.id, title: item.title });
                }
            });
        }
        setLogsUnfiltered(result); 
        setToggleFilter(false);
    };

    const filter = () => {
        setToggleFilter(true); 
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('https://mowzlisre.me/logs/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        localStorage.removeItem('token');
                        toast({ title: 'You have been logged out!', status: 'info', duration: 2500, position: 'bottom' });
                    } else {
                        toast({ title: 'An error occurred. Please try again later.', status: 'error', duration: 2500, position: 'bottom' });
                    }
                    return;
                }
                const data = await response.json();
                setLogs(data); 
                setLogsUnfiltered(data);
            } catch (error) {
                console.log(error);
                toast({ title: 'Failed to fetch logs', status: 'error', duration: 2500, position: 'bottom' });
            }
        };

        const token = localStorage.getItem("token");
        if (token) {
            validateToken(token);
            fetchLogs();
        } else {
            navigate("/login");
        }
    }, [navigate, toast]);

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

    return (
        logs &&
        <Flex top={0} height={"100vh"} zIndex={999} position={{ base: isCollapsed ? "inherit" : "fixed", xl: "sticky" }} width={isCollapsed ? "0" : "250px"} bg="gray.800" transition="width 0.2s" overflow="hidden" display="flex" flexDirection="column" p={isCollapsed ? 0 : 2}>
            <Flex my={1}>
                <Flex width={"100%"} justifyContent={'end'}>
                    <Button px={1} colorScheme='whiteAlpha' variant={"ghost"} onClick={toggleFilter ? unfilter : filter}>
                        {toggleFilter ? <MdFilterList onClick={filter} /> : <MdFilterListOff onClick={unfilter} />}
                    </Button>
                    <Button px={1} colorScheme='whiteAlpha' onClick={() => { window.location.href = "/new"; }} variant={"ghost"}>
                        <HiOutlinePencilAlt fontSize={25} onClick={() => setIsCollapsed(!isCollapsed)} />
                    </Button>
                </Flex>
            </Flex>
            <Flex mt={2}>
                {!isCollapsed && (toggleFilter ? (
                    <VStack display="flex" width="100%" align="start" spacing={0} px={1}>
                        <Text fontSize="xs" my={2} px={2} fontWeight="bold">Labels</Text>
                        {Object.entries(logs).length === 0 ? (
                            <Flex py={3} width={"100%"}>
                                <Text mx={'auto'} textAlign={'center'} color="whiteAlpha.500" fontSize="xs">No Labels to display</Text>
                            </Flex>
                        ) : (
                            Object.entries(logs).map(([label, items], index) => (
                                <VStack key={index} width="100%" align="start" spacing={0}>
                                    <Button onClick={() => toggleCollapse(index)} justifyContent="start" color={"whiteAlpha.500"} fontSize="sm" size="sm" px={2} py={5} width="100%" colorScheme="whiteAlpha" variant="ghost">
                                        {label}
                                    </Button>
                                    <Collapse style={{ width: "100%" }} in={openSections[index]} animateOpacity>
                                        <Flex direction="column" width="100%">
                                            {items.map((item, idx) => (
                                                <Button key={idx} justifyContent="start" fontSize="sm" size="sm" px={2} py={5} color={"whiteAlpha.400"} width="100%" colorScheme="whiteAlpha" variant="ghost" onClick={() => { window.location.href = `/response/${item.id}`; }}>
                                                    {item.title.length > 25 ? `${item.title.slice(0, 25)}...` : item.title}
                                                </Button>
                                            ))}
                                        </Flex>
                                    </Collapse>
                                </VStack>
                            ))
                        )}
                    </VStack>
                ) : (
                    <VStack display="flex" width="100%" align="start" spacing={0} px={1}>
                        <Text fontSize="xs" my={2} px={2} fontWeight="bold">Papers</Text>
                        {Object.entries(logsUnfiltered).length === 0 ? (
                            <Flex py={3} width={"100%"}>
                                <Text mx={'auto'} textAlign={'center'} color="whiteAlpha.500" fontSize="xs">No Papers to display</Text>
                            </Flex>
                        ) : (
                            Object.entries(logsUnfiltered).map(([index, { title, id }]) => (
                                <Flex key={index} direction="column" width="100%">
                                    <Button justifyContent="start" fontSize="sm" size="sm" px={2} py={5} color="whiteAlpha.400" width="100%" colorScheme="whiteAlpha" variant="ghost" onClick={() => window.location.href = `/response/${id}`}>
                                        {title.length > 25 ? `${title.slice(0, 25)}...` : title}
                                    </Button>
                                </Flex>
                            ))
                        )}
                    </VStack>
                ))}
            </Flex>

        </Flex>
    );
}

export default Sidebar;
