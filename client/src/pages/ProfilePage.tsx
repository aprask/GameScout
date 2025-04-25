import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Container, 
    Box, 
    Typography, 
    Avatar,
    IconButton,
    Paper,
    useTheme,
    TextField,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface WishListType {
    game_img_url: string;
    game_id: string
}

function ProfilePage() {
    const { id } = useParams();
    const { token, userId, profileId } = useAuth();
    const [wishlist, setWishlist] = useState<WishListType[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        const fetchProfileName = async() => {
            const response = await axios.get(
                `http://localhost:3000/api/v1/profile/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.status === 200) {
                setProfileName(response.data.profile.profile_name);
                setIsEditing(false);
            }
        };
        fetchProfileName();
    }, []);
    
    async function updateProfileName(newName: string) {
        if (profileId !== id) {
            setIsEditing(false);
            return;
        }
        if (newName.length > 24) {
            setIsEditing(false); 
            return;
        };
        try {
            const response = await axios.put(
                `http://localhost:3000/api/v1/profile/${id}`,
                {
                    profile_img: null,
                    banner_img: null,
                    profile_name: newName
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.status === 200) {
                setProfileName(newName);                
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error updating name:', err);
        }
    };


    useEffect(() => {
        const fetchWishlistData = async() => {
            try {
                let res = await axios.get(
                    `http://localhost:3000/api/v1/wishlist/userList/${userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                if (res.status !== 200) return;
                const gameIds: string[] = [];
                for (let i = 0; i < res.data.wishlists.length; ++i) gameIds.push(res.data.wishlists[i].game_id);
                console.log(gameIds);
                const wishListData: WishListType[] = [];
                for (let i = 0; i < gameIds.length; ++i) {
                    res = await axios.get(
                        `http://localhost:3000/api/v1/game/${gameIds[i]}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            }
                        }
                    );
                    if (res.status !== 200) continue;
                    console.log(`Game found: ${res.data.game}`);
                    wishListData.push({game_img_url: `https://images.igdb.com/igdb/image/upload/t_720p/${res.data.game.cover_id}.jpg`, game_id: gameIds[i]});
                }
                setWishlist(wishListData);    
            } catch (err) {
                console.error('Error fetching wishlist:', err);    
            }
        };
        if (token && userId) fetchWishlistData();
    }, [token, userId]);

    return (
        <Container sx={{ py: 8 }}>
            <Paper 
                elevation={3}
                sx={{ 
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    p: 12,
                    mb: 6,
                    background: theme.palette.primary.main,
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    position: 'relative'
                }}>
                    <Avatar
                        src={undefined}
                        alt="Profile"
                        sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid white',
                            boxShadow: 3,
                            cursor: 'pointer'
                        }}
                    />
                    {(id === profileId) && isEditing ? (
                        <TextField
                            defaultValue={profileName}
                            variant="outlined"
                            sx={{
                                ml: 60,
                                input: { color: 'white' }
                            }}
                            onBlur={(e) => updateProfileName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    updateProfileName((e.target as HTMLInputElement).value);
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <Typography 
                            variant="h4" 
                            color="white" 
                            fontWeight="bold"
                            sx={{
                                ml: 60,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                cursor: 'pointer'
                            }}
                            onClick={() => setIsEditing(true)}
                        >
                            {profileName}
                        </Typography>
                    )}
                </Box>
            </Paper>
    
            <Box sx={{ mt: 6 }}>
                <Typography 
                    variant="h4" 
                    color="primary" 
                    sx={{ 
                        mb: 4,
                        fontWeight: 'bold',
                        borderBottom: '2px solid',
                        pb: 1
                    }}
                >
                    Wishlist
                </Typography>
                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <IconButton 
                        sx={{ 
                            position: 'absolute',
                            left: 0,
                            zIndex: 2,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                        onClick={() => {
                            const container = document.getElementById('wishlist-container'); // the literal box of games
                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                    >
                        <ArrowBackIosNewIcon sx={{ color: 'white' }}/>
                    </IconButton>
                    
                    <Box
                        id="wishlist-container"
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 2,
                            px: 6,
                            scrollBehavior: 'smooth',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {wishlist.map((game, index) => (
                            <Paper
                                key={index}
                                elevation={3}
                                sx={{ 
                                    minWidth: 220,
                                    height: 280,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                                onClick={() => {
                                    navigate(`/game/?id=${game.game_id}`)
                                }}
                            >
                                <img
                                    src={game.game_img_url}
                                    alt="Game cover"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Paper>
                        ))}
                    </Box>

                    <IconButton 
                        sx={{ 
                            position: 'absolute',
                            right: 0,
                            zIndex: 2,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                        onClick={() => {
                            const container = document.getElementById('wishlist-container');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });   
                        }}
                    >
                        <ArrowForwardIosIcon sx={{ color: 'white' }}/>
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
}

export default ProfilePage;

