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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  nickname: z.string().min(2, { message: "닉네임은 필수 항목입니다." }).max(20),
  email: z
    .string()
    .min(1, { message: "이메일은 필수 항목입니다." })
    .email("유효한 이메일이 아닙니다."),
  password: z
    .string()
    .min(1, { message: "비밀번호는 1자리 이상이여야 합니다." })
    .max(20),
});

const SignupForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 회원가입 로직 추가
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          nickname: values.nickname,
          password: values.password,
        }),
        credentials: "include",
      }
    );
    const result = await response.json();
    console.log(result);
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
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>nickname</FormLabel>
              <FormControl>
                <Input placeholder="닉네임을 입력하세요" {...field} />
              </FormControl>

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
        <Button type="submit">회원가입</Button>
      </form>
    </Form>
  );
};

export default SignupForm;
