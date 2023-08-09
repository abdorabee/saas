import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

export const BotAvater = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage className="p-1" src="/logo.png" alt="bot" />
    </Avatar>
  );
};
