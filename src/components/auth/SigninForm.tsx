import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserInfoStore from "@/stores/userInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일은 필수 항목입니다." })
    .email("유효한 이메일이 아닙니다."),
  password: z
    .string()
    .min(1, { message: "비밀번호는 1자리 이상이여야 합니다." })
    .max(20),
});

const SigninForm = () => {
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 로그인 로직 추가
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        credentials: "include",
      }
    );
    const result = await response.json();
    setUserInfo({
      email: result.payload.email,
      at: result.payload.at,
    });
    localStorage.setItem("at", result.payload.at);
    // TODO 저장 결과 확인을 위한 로그 삭제 예정
    console.log(result, userInfo);
    if (result.result === "success") {
      navigate("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="이메일을 입력하세요" {...field} />
              </FormControl>
              <FormDescription>
                이메일을 사용해서 로그인하실 수 있습니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                비밀번호는 1자리 이상이여야 합니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">로그인</Button>
      </form>
    </Form>
  );
};

export default SigninForm;
