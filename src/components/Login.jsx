import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token);
        }
    }, [navigate]);

    const validateToken = async (token) => {
        try {
            const response = await fetch('https://54.161.151.76/validate-token/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                navigate('/new');
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error validating token:', error);
            localStorage.removeItem('token');
        }
    };

    const handleLogin = async () => {
        if (!username || !password) {
            toast({ title: 'Missing Credentials', status: 'error', duration: 3000, position: 'bottom' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://54.161.151.76/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({ title: 'Login Successful', status: 'success', duration: 3000, position: 'bottom' });
                localStorage.setItem('token', data.token); // Store the token
                navigate('/new');
            } else {
                toast({ title: data.detail || 'Invalid credentials', status: 'error', duration: 3000, position: 'bottom' });
            }
        } catch (error) {
            toast({ title: 'An error occurred. Please try again later.', status: 'error', duration: 3000, position: 'bottom' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box height="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.800" color="white" px={4}>
            <VStack spacing={6} px={8} py={10} borderRadius="lg" bg="gray.700" boxShadow="lg" w="100%" maxW="400px">
                <Text fontSize="2xl" fontWeight="bold" color="whiteAlpha.900">LabelWise</Text>

                <FormControl>
                    <FormLabel htmlFor="username" fontSize="sm" color="whiteAlpha.800">Username</FormLabel>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} bg="gray.600" color="white" borderColor="gray.500" _focus={{ borderColor: 'blue.500' }} />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="password" fontSize="sm" color="whiteAlpha.800">Password</FormLabel>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} bg="gray.600" color="white" borderColor="gray.500" _focus={{ borderColor: 'blue.500' }} />
                </FormControl>

                <Button colorScheme="blue" isLoading={loading} loadingText="Logging in..." onClick={handleLogin} width="100%">Login</Button>
            </VStack>
        </Box>
    );
}

export default Login;
