import "./signIn.css";

const SignIn = () => {
  return (
    <>
      <h1>Sign In</h1>
      <form className="signInForm">
      <input placeholder="Username"></input>
      <input placeholder="Password"></input>
        <button>Sign In</button>
      </form>
      
    </>
  );
};

export default SignIn;
