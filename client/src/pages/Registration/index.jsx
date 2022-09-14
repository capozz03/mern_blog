import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import api from "../../api/api";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const inputAvatarRef = useRef();

  const dispatch = useDispatch();

  const [avatarUrl, setAvatarUrl] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Вася Пупкин",
      email: "vasya@mail.ru",
      avatarUrl: `${process.env.REACT_APP_API_URL}${avatarUrl}`,
      password: "1234",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {

    if (avatarUrl) {
      values.avatarUrl = avatarUrl
    }

    const { payload } = await dispatch(fetchRegister(values));

    if (!payload) {
      return alert("Не удалось зарегистрироваться");
    }

    if ("token" in payload) {
      window.localStorage.setItem("token", payload.token);
    }
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await api.post("/upload/register", formData);
      setAvatarUrl(`${process.env.REACT_APP_API_URL}${data.url}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка загрузки файла");
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar
            sx={{ width: 100, height: 100 }}
            onClick={() => inputAvatarRef.current.click()}
            src={avatarUrl}
          />
          <input
            ref={inputAvatarRef}
            type="file"
            onChange={handleChangeFile}
            hidden
          />
        </div>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Укажите имя" })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register("email", { required: "Укажите почту" })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register("password", { required: "Укажите пароль" })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
