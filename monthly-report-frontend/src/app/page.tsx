"use client";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
} from "@mui/material";
import Logo from "@@/assets/images/eventus-logo.png";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { doLogin } from "@@/services/auth";
import Cookies from "universal-cookie";
import axiosApi from "@@/config/axios";

export default function Home() {
  const router = useRouter();
  const cookies = new Cookies();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all the fields");
    try {
      const result = await doLogin(email, password);
      cookies.set("_token", result.data.token, { path: "/" });
      cookies.set("_refresh_token", result.data.refreshToken, { path: "/" });
      cookies.set("_name", result.data.firstName, { path: "/" });
      axiosApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.authToken}`;
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Avatar src={Logo.src} sx={{ m: 1 }} />
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
}
