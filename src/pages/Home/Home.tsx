import "../../assets/styles/global.css";

export default function Home() {
    return (
        <div className="bg-custom-gradient w-full h-screen">
            <header className="fixed top-0 left-0 w-full p-2 transition-all duration-300 backdrop-blur-lg bg-white/30 shadow-lg border-b border-gray-300">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
                    <div className="flex lg:flex-1 text-indigo-500 font-weight-bold">
                        RISKTASKERX
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href="/login" className="text-sm/6 font-semibold text-indigo-500">
                            Log in
                        </a>
                    </div>
                </nav>
            </header>
            <div className=" text-transparent text-[80px] font-bold text-center pt-60 text-stroke animate-strokeGrow ">
                WELCOME TO RISKTASKERX
            </div>
        </div>
    )
}
