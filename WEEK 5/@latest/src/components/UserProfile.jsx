import { useState, useEffect } from 'react';

function UserProfile({userId}) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState({
        user: false,
        posts: false
    });
    const [error, setError] = useState({
        user: null,
        posts: null
    });

    // Fetch user data when userId changes
    useEffect(() => {
        if (!userId) {
        setUser(null);
        return;
    }

    const abortController = new AbortController();

    const fetchUser = async () => {
        setLoading(prev => ({...prev, user: true}));
        setError(prev => ({...prev, user: null}));

        try {
            // Simulate API call to fetch user data 
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(`/api/users/${userId}`, {  
                signal: abortController.signal 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUser(userData);
        } catch (err) {
            if (err.name !== `AbortError`) {
                setError(prev => ({...prev, user: err.message}));
            }
        } finally {
            setLoading(prev => ({...prev, user: false}));
        }
    };

    fetchUser();

    return () => {
        abortController.abort();
    };
}, [userId]);

// Fetch user posts when user changes
useEffect(() => {
    if (!user) {
        setPosts([]);
        return;
    }

    const abortController = new AbortController();

    const fetchPosts = async () => {
        setLoading(prev => ({...prev, posts: true}));
        setError(prev => ({...prev, posts: null}));

        try {
            // Simulate API call to fetch user posts
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = await fetch(`/api/users/${userId}/posts`, {
                signal: abortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const postsdata = await response.json();
            setPosts(postsdata);
        } catch (err) {
            if (err.name !== `AbortError`) {
                setError(prev => ({...prev, posts: err.message}));
            }
        } finally {
            setLoading(prev => ({...prev, posts: false}));
        }
    };

    fetchPosts();

    return () => {
        abortController.abort();
    };

    // update page title when user changes 
    useEffect(() => {
        if(user) {
            document.title = `Profile: ${user.name}`;
        } else {
            document.title = 'User Profile';
        }

        return () => {
            document.title = 'React App';
        };
    }, [user]);

    //Simulate real API responses
    useEffect(() => {
        // Mock API setup 

    const mockUsers = {
        1: { id: 1, name: 'John Doe', email: 'john.doe@example.com' , avatar: 'https://randomuser.me/api/portraits/men/1.jpg'},
        2: { id: 2, name: 'John Doe', email: 'john.doe@example.com' , avatar: 'https://randomuser.me/api/portraits/men/1.jpg'},
        
}
