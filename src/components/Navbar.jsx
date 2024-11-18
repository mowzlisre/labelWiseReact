import { Avatar, Box, Button, Divider, Fade, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { VscLayoutSidebarLeft } from "react-icons/vsc";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar({isCollapsed, setIsCollapsed}) {
    const { isOpen, onToggle } = useDisclosure()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
                return;
            }
    
            const response = await fetch('https://mowzlisre.me/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/login')
            } else {
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred during logout');
        }
    };
    return (
        <>

            <Flex position={"relative"} my={1} width="100%" zIndex={"9999"}>
                <Button position="fixed" colorScheme="whiteAlpha" variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <VscLayoutSidebarLeft fontSize={20} />
                </Button>
                <Button right={2} position="fixed" colorScheme="whiteAlpha" variant="ghost" onClick={onToggle}>
                    <FaRegUser fontSize={16}/>
                </Button>
                <Fade in={isOpen}>
                    <Box position={"absolute"} top={10} right={2} width={"200px"} p={5} mt='4' bg={'gray.800'} rounded='md' shadow='md'>
                        <Flex gap={3}>
                            <Avatar size={'sm'} />
                            <Text my={'auto'}>User</Text>
                        </Flex>
                        <Divider my={3}  borderColor="gray.600" />
                        <Button color={"whiteAlpha.500"} fontSize="sm" size="sm" px={2} py={3} width="100%" colorScheme="whiteAlpha" onClick={handleLogout} variant="ghost">
                            Logout
                        </Button>
                    </Box>
                </Fade>
            </Flex>
        </>
    )
}

export default Navbar