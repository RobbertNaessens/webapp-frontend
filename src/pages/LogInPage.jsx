import "../css/login.css";
import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useLogin, useSession, useRegister } from "../contexts/AuthProvider";
import swal from "sweetalert";

//Toont login- en registerpagina
//Aparte formulieren voor login en register

export default function LogInPage() {
  const history = useHistory();
  const { loading, error, isAuthed, setError } = useSession();
  const login = useLogin();
  const registerUser = useRegister();
  const methods = useForm();
  const methods2 = useForm();
  const { handleSubmit, reset, register } = methods;
  const {
    handleSubmit: handleSubmit2,
    reset: reset2,
    register: register2,
    getValues: getValues2,
  } = methods2;

  useEffect(() => {
    if (isAuthed) {
      history.replace("/");
    }
    if (error) {
      swal({
        title: "Error",
        text: error,
        icon: "error",
      });
      setError("");
    }
  }, [isAuthed, history, error]);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        const success = await login(email, password);
        if (success) {
          history.replace("/");
        }
      } catch (error) {
        swal(
          "Error",
          "Er is een fout opgetreden, probeert u het later opnieuw",
          "error"
        );
        console.error(error);
      }
    },
    [login, history]
  );

  const handleRegister = useCallback(
    async ({ name, email, password }) => {
      try {
        const success = await registerUser({
          name,
          email,
          password,
        });

        if (success) {
          // we can't come back to register
          history.replace("/");
        }
      } catch (error) {
        console.log(error);
        swal(
          "Error",
          "Er is een fout opgetreden, probeert u het later opnieuw",
          "error"
        );
      }
    },
    [history, registerUser]
  );

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleCancel2 = useCallback(() => {
    reset2();
  }, [reset2]);

  const handleClick = () => {
    document.querySelector(".cont").classList.toggle("s--signup");
  };

  return (
    <>
      <div id="loginform">
        <div className="cont">
          <FormProvider {...methods}>
            <form key={1} onSubmit={handleSubmit(handleLogin)}>
              <div className="form sign-in">
                <h2>Welkom terug!</h2>
                <label htmlFor="email">
                  <span>Email</span>
                  <input
                    type="email"
                    {...register("email")}
                    required
                    data-cy="email_input"
                  />
                </label>
                <label htmlFor="password">
                  <span>Wachtwoord</span>
                  <input
                    type="password"
                    {...register("password")}
                    required
                    data-cy="password_input"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="submit"
                  data-cy="submit_btn"
                >
                  Log In
                </button>
                <button type="reset" className="submit" onClick={handleCancel}>
                  Annuleer
                </button>
              </div>
            </form>
          </FormProvider>
          <div className="sub-cont">
            <div className="img">
              <div className="img__text m--up">
                <h2>Nieuw hier?</h2>
                <p>
                  Schrijf je in en ontdek een groot aantal nieuwe mogelijkheden!
                </p>
              </div>
              <div className="img__text m--in">
                <h2>Een van ons?</h2>
                <p>
                  Als je al een account hebt, log dan in. We hebben je gemist!
                </p>
              </div>
              <div className="img__btn" onClick={handleClick}>
                <span className="m--up">Registreer</span>
                <span className="m--in">Log In</span>
              </div>
            </div>
            <FormProvider {...methods2}>
              <form key={2} onSubmit={handleSubmit2(handleRegister)}>
                <div className="form sign-up">
                  <h2>Tijd om je thuis te voelen</h2>
                  <label htmlFor="name">
                    <span>Naam</span>
                    <input
                      type="text"
                      {...register2("name", {
                        validate: {
                          validName: (value) => {
                            const naam = getValues2("name");
                            const reg = new RegExp(
                              /^[a-zA-Z]+[ -_'a-zA-Z]*[a-zA-Z]+$/
                            );
                            if (!reg.test(naam)) {
                              swal(
                                "Error",
                                "Ongeldige gebruikersnaam",
                                "error"
                              );
                            }
                            return reg.test(naam);
                          },
                        },
                      })}
                      required
                    />
                  </label>
                  <label htmlFor="email">
                    <span>Email</span>
                    <input type="email" {...register2("email")} required />
                  </label>
                  <label htmlFor="password">
                    <span>Wachtwoord</span>
                    <input
                      type="password"
                      {...register2("password")}
                      required
                    />
                  </label>
                  <label htmlFor="confirmPassword">
                    <span>Bevestig wachtwoord</span>
                    <input
                      type="password"
                      {...register2("confirmPassword", {
                        validate: {
                          notIdentical: (value) => {
                            const password = getValues2("password");
                            if (password !== value) {
                              swal(
                                "Error",
                                "Wachtwoorden moeten hetzelfde zijn",
                                "error"
                              );
                            }
                            return password === value ? null : "";
                          },
                        },
                      })}
                      required
                    />
                  </label>
                  <button type="submit" className="submit">
                    Registreer
                  </button>
                  <button
                    type="reset"
                    className="submit"
                    onClick={handleCancel2}
                  >
                    Annuleer
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}
