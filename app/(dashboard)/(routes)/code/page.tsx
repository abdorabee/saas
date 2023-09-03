"use client";

import axios from "axios";
import { formSchema } from "./constants";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionResponseMessage } from "openai";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvater } from "@/components/user-avater";
import { BotAvater } from "@/components/bot-avater";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import { NextResponse } from "next/server";

const CodePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [message, setMessage] = useState<ChatCompletionResponseMessage[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionResponseMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...message];
      const response = await axios.post("/api/code", {
        message: newMessages,
      });

      setMessage((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error:any) {
       /* eslint-disable prettier/prettier */
  console.error("[AXIOS_ERROR]", error);
  /* eslint-enable prettier/prettier */


      if (error.response && error.response.status === 403) {
        proModal.onOpen();
      } else {
        return new NextResponse("Internal error", { status: 500 });
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code Page"
        description="This is the code page (beta)"
        icon={Code}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
            rounded-lg
            border
            w-full
            p-4
            px-3
            md:px-6
            grid-cols-12
            gap-2
            "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none
                    focus-visible:ring-0
                    focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="I am your AI assistant make sure to thank Abdel-Rahman for bringing me alive :)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {message.length === 0 && !isLoading && (
            <Empty label="no conversation started " />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {message.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvater /> : <BotAvater />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div
                        className="overflow-auto w-full my-2 bg-black/10
                    p-2 rounded-lg"
                      >
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
