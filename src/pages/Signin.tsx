import SigninForm from "@/components/auth/SigninForm";

const SigninPage = () => {
  return (
    <div className="mt-8">
      <div className="text-center">
        <span className="text-2xl">로그인</span>
      </div>
      <SigninForm />
    </div>
  );
};

export default SigninPage;
