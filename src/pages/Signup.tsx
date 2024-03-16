import SignupForm from "@/components/auth/SignupForm";

const SignupPage = () => {
  return (
    <div className="mt-8">
      <div className="text-center">
        <span className="text-2xl">회원가입</span>
      </div>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
