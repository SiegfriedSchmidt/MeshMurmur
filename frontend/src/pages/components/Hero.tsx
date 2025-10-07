import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CallIcon from '@mui/icons-material/Call';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function Hero() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box', // Учитываем отступы и границы
            overflowX: 'hidden',
            margin: 0,
            padding: 0
        }}>
            <Box
                id="hero"
                sx={(theme) => ({
                    width: { xs: '100%', sm: '60%' },  // на мобильных устройствах 100% ширины
                    backgroundRepeat: 'no-repeat',
                    bgcolor: 'background.default',
                    boxSizing: 'border-box',  // Учитываем отступы и границы
                })}
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 4, sm: 6 },
                        width: '100%', // Обеспечиваем, что контейнер не выйдет за пределы
                        boxSizing: 'border-box', // Учитываем отступы и границы
                    }}
                >
                    <Stack
                        spacing={2}
                        useFlexGap
                        sx={{ alignItems: 'center', boxSizing: 'border-box', }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',        // разрешаем перенос слов внутри flex
                                justifyContent: 'center',// чтобы текст оставался по центру
                                fontSize: '3rem',        // фиксированный размер
                                textAlign: 'center',
                            }}
                        >
                            MeshMurmur&nbsp;
                            <Typography
                                component="span"
                                variant="h1"
                                sx={(theme) => ({
                                    fontSize: 'inherit',
                                    color: 'primary.main',
                                    ...theme.applyStyles('dark', {
                                        color: 'primary.light',
                                    }),
                                })}
                            >
                                voicecall
                            </Typography>
                        </Typography>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                color: 'text.secondary',
                            }}
                        >
                            To call you, other people need to know your peerid or use the link below.
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                pt: 2
                            }}
                        >
                            <TextField
                                id="peerlink-hero"
                                hiddenLabel
                                size="small"
                                variant="outlined"
                                defaultValue="ГЕНЕРАТОР ССЫЛКИ"
                                fullWidth
                                slotProps={{
                                    htmlInput: {
                                        readOnly: true,
                                        autoComplete: 'off',
                                        'aria-label': 'Enter your email address',
                                    },
                                }}
                            />
                            <IconButton color="primary">
                                <ContentCopyIcon />
                            </IconButton>
                        </Box>
                        <Stack
                            useFlexGap
                            sx={{ alignItems: 'center'}}
                        >
                            <Typography
                                sx={{
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                }}
                            >
                                You can call user using his peerid below.
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1,
                                    pt: 2
                                }}
                            >
                                <TextField
                                    id="peerlink-hero"
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                    label="PeerID"
                                    slotProps={{
                                        htmlInput: {
                                            autoComplete: 'off',
                                            'aria-label': 'Enter your email address',
                                        },
                                    }}
                                />
                                <IconButton color="success">
                                    <CallIcon />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
