import styles from './SignInWithGoogle.module.css'
export default function SignInWithGoogle() {
  return (
    // <div className={styles.test}>
      <>
  
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <div
        id="g_id_onload"
        data-client_id="736006982645-7qv1rh1bhj5fousdv24068mse5bmuefh.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="googleSignInHandler"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="medium"
        data-logo_alignment="left"
      ></div>
      </>
    // </div>
  );
}
