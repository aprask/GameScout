import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';
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
import { useProfile } from '../context/profile/ProfileContext';
import Following from '../components/follower/Following';
import Follower from '../components/follower/Follower';
import FollowAction from '../components/follower/FollowAction';

interface WishListType {
    game_img_url: string;
    game_id: string
}

const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
? `${import.meta.env.VITE_PROD_URL}`
: `${import.meta.env.VITE_DEV_URL}`;

function ProfilePage() {
    const { id } = useParams();
    const { userId, profileId } = useAuth(); 
    const [wishlist, setWishlist] = useState<WishListType[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();
    const {setProfileName} = useProfile();
    const [profileImage, setProfileImage] = useState('');
    const [pageProfileName, setPageProfileName] = useState('');
    const [pageProfileUserId, setPageProfileUserId] = useState('');
    
    useEffect(() => {
        setPageProfileUserId('');
        const fetchProfileData = async () => {
            try {
                const res = await axios.get(
                    `${baseUrl}/api/v1/profile/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );
                if (res.status !== 200) return;
                setProfileImage(res.data.profile.profile_img);
                setPageProfileName(res.data.profile.profile_name);
                setPageProfileUserId(res.data.profile.user_id);
            } catch (err) {
                console.error('Error fetching wishlist:', err);    
            }
        };
        fetchProfileData();
    }, [id]);    

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
                `${baseUrl}/api/v1/profile/${id}`,
                {
                    profile_img: null,
                    banner_img: null,
                    profile_name: newName
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            if (response.status === 200) {
                setProfileName(newName);
                setPageProfileName(newName);                
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error updating name:', err);
        }
    };

    useEffect(() => {
        if (!pageProfileUserId) return;
        const fetchWishlistData = async() => {
            try {
                let res = await axios.get(
                    `${baseUrl}/api/v1/wishlist/userList/${pageProfileUserId}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
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
                        `${baseUrl}/api/v1/game/${gameIds[i]}`,
                        {
                            withCredentials: true,
                            headers: {
                                "Content-Type": "application/json",
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
        if (userId) fetchWishlistData();
    }, [pageProfileUserId, userId]);

    return (
        <Container sx={{
            py: 8,
            backgroundColor: "#0d0d0d",
            border: "2px solid #9400FF",
            borderRadius: "12px",
            boxShadow: "0 0 20px #9400FF55",
          }}>
            <Paper 
                elevation={3}
                sx={{ 
                    bgcolor: "#1a1a1a",
                    borderRadius: "0 0 12px 12px",
                    p: 6,
                    mb: 4,
                    border: "1px solid #9400FF",
                    boxShadow: "0 0 15px #9400FF66",                
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
                        src={profileImage || undefined}
                        alt="Profile"
                        sx={{
                            width: 120,
                            height: 120,
                            border: "3px solid #9400FF",
                            boxShadow: "0 0 10px #9400FFaa",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                        }}
                    />
                    {(id === profileId) && isEditing ? (
                        <TextField
                            defaultValue={pageProfileName}
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
                                ml: 6,
                                fontWeight: 700,
                                color: "#FFFFFF",
                                textShadow: "0 0 5px #9400FF",
                                letterSpacing: 1.5,
                                cursor: "pointer",
                                "&:hover": {
                                  color: "#9400FF",
                                },
                              }}                            
                            onClick={() => setIsEditing(true)}
                        >
                            {pageProfileName}
                        </Typography>
                    )}
                </Box>
            </Paper>
   
            {pageProfileUserId && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Following key={pageProfileUserId} id={pageProfileUserId} />
                    <Follower key={pageProfileUserId} id={pageProfileUserId} />
                    <FollowAction key={pageProfileUserId} id={pageProfileUserId} />
                </Box>
            )}
    
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
                                    border: "1px solid #9400FF",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                                    boxShadow: "0 0 6px #9400FF66",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 0 12px #9400FF",
                                    },
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

