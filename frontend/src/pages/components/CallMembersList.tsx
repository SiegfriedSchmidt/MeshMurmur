import React from 'react';
import { Box, Typography, Avatar, Paper, useTheme, useMediaQuery } from '@mui/material';
import { MicOffRounded, VideocamOffRounded } from '@mui/icons-material';

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    isSpeaking?: boolean;
    isCurrentUser?: boolean;
}

interface CallMembersListProps {
    participants: Participant[];
    currentUserId?: string;
}

const CallMembersList: React.FC<CallMembersListProps> = ({ participants }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    const getGridColumns = () => {
        if (isMobile) return 1;         // На мобильных устройствах 1 колонка
        if (participants.length === 1) return 1; // Если 1 участник, то только 1 колонка
        if (isTablet) return 2;         // Для планшетов 2 колонки
        return participants.length <= 4 ? 2 : 3; // Для остальных случаев, если участников больше, то 3 колонки
    };

    const gridColumns = getGridColumns();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,  // Используем minmax
                gap: 1,  // Уменьшаем отступы
                p: 2,
                height: 'calc(100vh - 130px)',
                overflow: 'auto',
                backgroundColor: '#121212',
                [theme.breakpoints.down('sm')]: {
                    gridTemplateColumns: '1fr',  // Одна колонка на мобильных
                    gap: 1,
                    p: 1,
                }
            }}
        >
            {participants.map((participant) => (
                <Paper
                    key={participant.id}
                    elevation={3}
                    sx={{
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        backgroundColor: '#1e1e1e',
                        border: participant.isSpeaking ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                        borderColor: participant.isCurrentUser ? theme.palette.primary.main : undefined,
                        display: 'flex',
                        flexDirection: 'column',  // Для правильного размещения содержимого
                        minHeight: '250px',  // Минимальная высота для плитки
                    }}
                >
                    {!participant.isVideoMuted ? (
                        <Box
                            component="video"
                            autoPlay
                            muted={participant.isCurrentUser}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#2d2d2d',
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: '2rem',
                                    backgroundColor: theme.palette.primary.main,
                                    mb: 1,
                                }}
                                src={participant.avatar}
                            >
                                {participant.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography
                                variant="h6"
                                color="white"
                                align="center"
                                sx={{ fontWeight: 'bold' }}
                            >
                                {participant.name}
                                {participant.isCurrentUser && ' (You)'}
                            </Typography>
                        </Box>
                    )}

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                            }}
                        >
                            {participant.name}
                            {participant.isCurrentUser && ' (You)'}
                        </Typography>
                    </Box>

                    {/* Индикаторы аудио/видео */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5,
                        }}
                    >
                        {participant.isAudioMuted && (
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: '50%',
                                    p: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MicOffRounded sx={{ color: 'white', fontSize: '1rem' }} />
                            </Box>
                        )}
                        {participant.isVideoMuted && (
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: '50%',
                                    p: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <VideocamOffRounded sx={{ color: 'white', fontSize: '1rem' }} />
                            </Box>
                        )}
                    </Box>

                    {/* Индикатор говорящего */}
                    {participant.isSpeaking && !participant.isAudioMuted && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                                animation: 'pulse 1.5s infinite',
                                '@keyframes pulse': {
                                    '0%': { transform: 'scale(1)', opacity: 1 },
                                    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                                    '100%': { transform: 'scale(1)', opacity: 1 },
                                },
                            }}
                        />
                    )}
                </Paper>
            ))}
        </Box>
    );
};

export default CallMembersList;