import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard Page (Protected)</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default DashboardPage;
