import { Button, Card, Flex, Input, Tag, TagLabel, Text, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Tags({ data, handleNoteChange, id, saveFunction }) {
    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const colorSchemes = ["red", "blue", "green", "purple", "orange", "yellow", "teal", "pink", "cyan", "green"];
    const toast = useToast()
    const navigate = useNavigate()
    function getColorSchemeByLength(label) {
        const firstChar = label[0].toUpperCase();
        let position = firstChar.charCodeAt(0) - 64;
        while (position >= 10) {
            position = String(position)
                .split("")
                .reduce((sum, num) => sum + parseInt(num, 10), 0);
        }

        return colorSchemes[position];
    }

    const handleDelete = async () => {
        try {
    
            const response = await fetch('https://mowzlisre.me/delete-log/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`, 
                },
                body: JSON.stringify({ id: id }),
            });
    
            if (!response.ok) {
                toast({
                    title: `Error deleting the paper`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else{
                navigate('/new')
                toast({
                    title: `Paper deleted`,
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            }
            onClose();
    
        } catch (error) {
            toast({
                title: `Error deleting the paper`,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };
    

    return (
        <>
            <Flex direction={'column'} width={{ base: "auto", xl: "50%"}} gap={2}>
                <Card bg={"gray.800"} p={8} pb={10}>
                    <Text color={"white"} fontSize={"sm"} fontWeight={"bold"}>
                        Identified Labels:{" "}
                    </Text>
                    <Flex mt={3} spacing={2} gap={2} wrap="wrap">
                        {Object.keys(data.prediction).map((label, index) => (
                            <Tag key={index} px={5} size="lg" width="auto" borderRadius="full" variant="solid" colorScheme={getColorSchemeByLength(label)} >
                                <TagLabel fontSize="xs" fontWeight="bold">
                                    {label}
                                </TagLabel>
                            </Tag>
                        ))}
                    </Flex>
                </Card>
                <Card bg={"gray.800"} height={"80px"}>
                    <Textarea color={"white"} pt={4} fontWeight={'bold'} fontSize={'sm'} fontFamily={'monospace'} _focus={{ boxShadow: "none" }} border={"none"} placeholder="Leave a note/link" onChange={handleNoteChange} resize="none">
                    </Textarea>
                </Card>
                <Flex gap={2}>
                    {
                        id !== undefined &&
                        <Button py={6} width={"100%"} color={"red.500"} bg={"gray.800"} _hover={{ bg : "red.600", color: "white" }} onClick={onOpen}>Delete</Button>
                    }
                    <Button py={6} width={"100%"} color={"white"} bg={"gray.800"} _hover={{ bg : "green.600" }} onClick={saveFunction} >{ id === undefined ? "Save" : "Update" }</Button>
                </Flex>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="gray.800">
                    <ModalHeader color="white" fontSize={'md'}>Confirm Deletion</ModalHeader>
                    <ModalBody color="white" fontSize={'sm'}>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button bg={"red.600"} _hover={{ bg : "red.400", color: "white" }} size={"sm"} onClick={handleDelete}>Delete</Button>
                        <Button bg={"gray.600"} _hover={{ bg : "gray.400" }} size={"sm"} ml={3} onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default Tags;
