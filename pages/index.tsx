import { useState } from 'react';
import Head from 'next/head';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Logo from '../public/logo.svg'

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<{ isSubscribed: Boolean, message?: string} | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value.trim());
  }

  const handleClearClick = () => {
    setEmail('');
    setIsLoading(false);
    setError(null);
    setResponse(null);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    const responseData = await fetch(`./api/denylist?email=${email}`);
    const { data, error } = await responseData.json();
    setIsLoading(false);
    
    if (error) {
      setError(error);
      setResponse(null);
      return;
    }
    if (data) setResponse({
      isSubscribed: data.isSubscribed,
      message: `User at ${email} can ${!data.isSubscribed ? `NOT` : ''} receive emails ${!data.isSubscribed ? `for the following reason: ${data.message}` : ''}.`,
    });
  }

  return (
    <main>
      <Head>
        <title>VACI - Subscriber Utility</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Box sx={{ marginTop: '20vh' }}>
        <Container maxWidth="sm">
          <Box textAlign='center' sx={{ marginBottom: 3 }}><Logo width='200' /></Box>
          <Typography variant="h2" component='h1' align="center" gutterBottom>Subscriber Utility</Typography>
          <Typography variant="body1" align="center" sx={{ marginBottom: 5 }}>Use this tool to check if an email address is able to receive messages from our systems.</Typography>
          <form onSubmit={handleSubmit}>
            <Stack direction="row">
              <TextField
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleChange}
                InputProps={{
                endAdornment: (
                  <IconButton
                    sx={{ visibility: email ? "visible" : "hidden" }}
                    onClick={(handleClearClick)}
                  >
                    <ClearIcon />
                  </IconButton>
                  ),
                }}
                sx={{ '.MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 }}}
              />
              <Button type="submit" variant="contained" disabled={email.length < 1} sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} >Check</Button>
            </Stack>
          </form>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 3 }}><CircularProgress /></Box>
          ) : <>
            {response ? <>
                <Alert severity={response.isSubscribed ? 'success' : 'warning'} sx={{ marginTop: 1 }}>{response.message}</Alert>
                <Typography variant='body1' sx={{ marginTop: 1 }}>
                  {response.isSubscribed ? 'Please be aware, this does NOT mean that the user is actually seeing messages, only that our system is not prevented from sending.' : 'Reach out directly and ask the user for permission to re-subscribe them. Once approved, submit a support ticket.'}</Typography>
            </> : null}
            {error ? (
              <Alert severity="error" sx={{ marginTop: 1 }}>{error}</Alert>
            ) : null}
          </>}
        </Container>
      </Box>
    </main>
  )
}
