import Signin from "@/components/Signin";
export default function SignInPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="m-4">
        <div className="pl-5 ">
          <a href="/">
            <img
              src="/CoreNoteLogo.svg"
              alt="CoreNote Logo"
              className="w-8 h-8 block cursor-pointer"
            />
          </a>
        </div>
      </header>
      <section className="flex-1 overflow-hidden">
        <Signin />
      </section>
    </div>
  );
}
